import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.EMAIL_FROM || "ValidIdea <onboarding@resend.dev>";

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const firstName = name?.split(" ")[0] || "there";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to ValidIdea! 🚀",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #5D5FEF;">Welcome to ValidIdea</h1>
          <p>Hi ${firstName},</p>
          <p>Thanks for joining ValidIdea! We're excited to help you deconstruct and validate your next big idea.</p>
          <p>You can now:</p>
          <ul>
            <li>Submit your startup concepts for deep analysis</li>
            <li>Get unbiased feedback on market size, competitors, and technical feasibility</li>
            <li>Generate a complete MVP roadmap and development prompt</li>
          </ul>
          <p>
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:5174"
            }/new-idea" style="background-color: #5D5FEF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Start Your First Analysis</a>
          </p>
          <p style="color: #666; margin-top: 30px; font-size: 12px;">
            Happy building,<br>
            The ValidIdea Team
          </p>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw error to avoid breaking the registration flow
  }
}

export async function sendAnalysisCompleteEmail(
  email: string,
  ideaTitle: string,
  ideaId: string
) {
  try {
    const resultsUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5174"
    }/results/${ideaId}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Analysis Complete: ${ideaTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">Analysis Ready! ✅</h1>
          <p>Great news! The deep analysis for your idea <strong>"${ideaTitle}"</strong> is complete.</p>
          <p>Our engines have crunched the numbers on market size, competitors, and technical strategy.</p>
          <p>
            <a href="${resultsUrl}" style="background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Results</a>
          </p>
          <p style="margin-top: 20px;">What you'll find inside:</p>
          <ul>
            <li>💰 TAM/SAM/SOM estimates</li>
            <li>⚔️ Competitor breakdown</li>
            <li>🛠️ Recommended tech stack & cost estimates</li>
            <li>🤖 Copy-paste AI coding prompt</li>
          </ul>
          <p style="color: #666; margin-top: 30px; font-size: 12px;">
            Keep iterating,<br>
            The ValidIdea Team
          </p>
        </div>
      `,
    });
    console.log(`Analysis complete email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send analysis complete email:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "RESEND_API_KEY is not set. Cannot send password reset email."
      );
      throw new Error("Email service not configured");
    }

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5174"
    }/reset-password?token=${resetToken}`;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your ValidIdea password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #5D5FEF;">Reset Password</h1>
          <p>We received a request to reset the password for your ValidIdea account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <p>
            <a href="${resetUrl}" style="background-color: #5D5FEF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
          </p>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log(`Password reset email sent to ${email}`, result);
    return result;
  } catch (error: any) {
    console.error("Failed to send password reset email:", {
      email,
      error: error.message,
      details: error.response?.data || error,
    });
    throw error; // Re-throw so the endpoint can handle it
  }
}

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  try {
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5174"
    }/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #5D5FEF;">Verify Your Email</h1>
          <p>Thanks for signing up for ValidIdea! Please verify your email address to access your dashboard.</p>
          <p>
            <a href="${verificationUrl}" style="background-color: #5D5FEF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify Email</a>
          </p>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  try {
    const contactEmail = process.env.CONTACT_EMAIL || "";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: contactEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #5D5FEF;">New Contact Form Submission</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #5D5FEF; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Message:</h2>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; margin-top: 30px; font-size: 12px;">
            This email was sent from the ValidIdea contact form.
          </p>
        </div>
      `,
    });
    console.log(`Contact email sent to ${contactEmail} from ${email}`);
  } catch (error) {
    console.error("Failed to send contact email:", error);
    throw error;
  }
}
