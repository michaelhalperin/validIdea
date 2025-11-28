import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email, password);
      // Check verification status from the returned user data
      if (!user.isVerified && !user.googleId) {
        navigate("/verify-email");
      } else {
        navigate("/history");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      if (err.response?.data?.error?.includes("verify your email")) {
        // Optional: Offer to resend verification email here
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <button
        onClick={handleBack}
        className="absolute top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-white font-medium rounded-lg px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-lg"
        type="button"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <div className="absolute top-8 left-8 flex items-center gap-2 text-white font-display font-bold text-xl">
        <div className="w-8 h-8 rounded bg-[#5D5FEF] flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        ValidIdea
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bento-card p-8 md:p-10 border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to continue your validation journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
              {error.includes("verify your email") && (
                <button
                  onClick={async () => {
                    try {
                      await api.post("/auth/resend-verification", { email });
                      toast.success("Verification email sent!");
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to send verification email");
                    }
                  }}
                  className="text-xs text-left text-[#5D5FEF] hover:underline ml-8"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-modern pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#5D5FEF] hover:text-[#00D4FF] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-modern pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#5D5FEF] hover:text-[#00D4FF] font-medium transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
