import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { z } from "zod";
import prisma from "../utils/prisma";
import { authenticateToken, JWTPayload } from "../middleware/auth";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/email";

const router = express.Router();

// Register schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Update Profile schema
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  notifyEmail: z.boolean().optional(),
  notifyUpdates: z.boolean().optional(),
  notifyMarketing: z.boolean().optional(),
});

// Change Password schema
const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

// Delete Account schema
const deleteAccountSchema = z.object({
  password: z.string().optional(), // Optional for OAuth users
  confirmText: z.literal("DELETE"),
});

// Forgot Password schema
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// Reset Password schema
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// Generate JWT token
const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Check if user exists with same email
          user = await prisma.user.findUnique({
            where: { email: profile.emails?.[0]?.value || "" },
          });

          if (user) {
            // Link Google account to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                isVerified: true,
              } as any,
            });
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email: profile.emails?.[0]?.value || "",
                name: profile.displayName,
                image: profile.photos?.[0]?.value,
                googleId: profile.id,
                isVerified: true,
              } as any, // Cast to any to bypass TS check if types are outdated
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name } = validatedData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Send welcome email & verification email
    await sendWelcomeEmail(user.email, user.name || undefined);

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken } as any,
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = (await prisma.user.findUnique({
      where: { email },
    })) as any;

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email address" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify email endpoint
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = (await prisma.user.findUnique({
      where: { id: payload.userId },
    })) as any;

    if (!user || user.verificationToken !== token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      } as any,
    });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = (await prisma.user.findUnique({ where: { email } })) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ error: "Email already verified" });

    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken } as any,
    });

    await sendVerificationEmail(email, verificationToken);
    res.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Forgot password endpoint
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return res.json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    // Save token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Still return success to user (security best practice - don't reveal if email exists)
      // But log the error for debugging
    }

    res.json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Reset password endpoint
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    // Verify token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      const token = generateToken({ userId: user.id, email: user.email });
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const userId = (req.user as any).id;
    let user = (await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        credits: true,
        creditsUsed: true,
        notifyEmail: true,
        notifyUpdates: true,
        notifyMarketing: true,
        createdAt: true,
        lastCreditReset: true,
        googleId: true,
        isVerified: true,
      } as any,
    })) as any;

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check if credits need reset
    const now = new Date();
    const lastReset = new Date((user as any).lastCreditReset);
    const isNewDay =
      now.getDate() !== lastReset.getDate() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear();

    if (isNewDay) {
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          credits: 3,
          lastCreditReset: now,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          credits: true,
          creditsUsed: true,
          notifyEmail: true,
          notifyUpdates: true,
          notifyMarketing: true,
          createdAt: true,
          lastCreditReset: true,
          googleId: true,
        } as any,
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Update current user profile
router.patch("/me", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const userId = (req.user as any).id;
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.notifyEmail !== undefined && {
          notifyEmail: validatedData.notifyEmail,
        }),
        ...(validatedData.notifyUpdates !== undefined && {
          notifyUpdates: validatedData.notifyUpdates,
        }),
        ...(validatedData.notifyMarketing !== undefined && {
          notifyMarketing: validatedData.notifyMarketing,
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        credits: true,
        creditsUsed: true,
        notifyEmail: true,
        notifyUpdates: true,
        notifyMarketing: true,
        createdAt: true,
        googleId: true,
      } as any,
    });

    res.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Change password endpoint
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const userId = (req.user as any).id;
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return res
        .status(400)
        .json({ error: "Password change not available for this account" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Delete account endpoint
router.delete("/me", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const userId = (req.user as any).id;
    const { password, confirmText } = deleteAccountSchema.parse(req.body);

    if (confirmText !== "DELETE") {
      return res
        .status(400)
        .json({ error: 'Confirmation text must be "DELETE"' });
    }

    // Get user to check if they have a password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        googleId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // For non-OAuth users, verify password
    if (user.password && !user.googleId) {
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
