import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Calendar,
  CreditCard,
  Shield,
  LogOut,
  Bell,
  Check,
  Loader2,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import SpotlightCard from "../components/ui/SpotlightCard";
import CountUp from "../components/ui/CountUp";
import api from "../utils/api";

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete Account State
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // Notifications State - Load from user preferences
  const [notifications, setNotifications] = useState({
    email: user?.notifyEmail ?? true,
    updates: user?.notifyUpdates ?? false,
    marketing: user?.notifyMarketing ?? true,
  });

  // Update notifications when user data changes
  useEffect(() => {
    if (user) {
      setNotifications({
        email: user.notifyEmail ?? true,
        updates: user.notifyUpdates ?? false,
        marketing: user.notifyMarketing ?? true,
      });
    }
  }, [user]);

  if (!user) return null;

  const safeCredits = Number.isFinite(user.credits as any)
    ? (user.credits as number)
    : 0;

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return `${hours}h ${minutes}m ${seconds}s`;
    };

    if (safeCredits === 0) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      setTimeLeft(calculateTimeLeft());
      return () => clearInterval(timer);
    }
  }, [safeCredits]);

  const HourglassAnimation = () => (
    <div className="p-4 rounded-full bg-amber-500/10 text-amber-500">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />

        <motion.path
          d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2H7Z"
          fill="currentColor"
          stroke="none"
          animate={{
            clipPath: ["inset(0% 0 0 0)", "inset(100% 0 0 0)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.path
          d="M12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22h10v-4.172a2 2 0 0 0-.586-1.414L12 12Z"
          fill="currentColor"
          stroke="none"
          animate={{
            clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.path
          d="M12 12 L12 22"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.8, 1],
          }}
        />
      </svg>
    </div>
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await api.patch("/auth/me", { name: newName });
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotification = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications((prev) => ({ ...prev, [key]: newValue }));

    // Map frontend keys to backend keys
    const backendKeyMap: Record<keyof typeof notifications, string> = {
      email: "notifyEmail",
      updates: "notifyUpdates",
      marketing: "notifyMarketing",
    };

    try {
      await api.patch("/auth/me", {
        [backendKeyMap[key]]: newValue,
      });
      await refreshUser();
      toast.success("Notification preference updated");
    } catch (error) {
      console.error("Failed to update notification preference:", error);
      // Revert on error
      setNotifications((prev) => ({ ...prev, [key]: !newValue }));
      toast.error(
        "Failed to update notification preference. Please try again."
      );
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
      toast.success("Password changed successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    // For non-OAuth users, require password
    if (!user.googleId && !deletePassword) {
      toast.error("Password is required to delete your account");
      return;
    }

    setIsDeletingAccount(true);
    try {
      await api.delete("/auth/me", {
        data: {
          password: deletePassword || undefined,
          confirmText: deleteConfirmText,
        },
      } as any);

      toast.success("Account deleted successfully");
      // Logout and redirect after a short delay
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete account";
      toast.error(errorMessage);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Profile & Settings
        </h1>
        <p className="text-gray-400">
          Manage your personal information and subscription
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Info & Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <SpotlightCard
            className="p-8 bg-white/[0.02] border-white/10"
            spotlightColor="rgba(99, 102, 241, 0.2)"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3 text-blue-400">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-mono font-bold tracking-wider">
                  PERSONAL INFO
                </span>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-black">
                {user.name
                  ? user.name[0].toUpperCase()
                  : user.email[0].toUpperCase()}
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="input-modern w-full py-2 text-sm"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="text-white font-medium">
                        {user.name || "Not set"}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      Email Address
                    </label>
                    <div className="text-white font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isSaving}
                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    {user.role} Account
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Change Password - Only show for non-OAuth users */}
          {!user.googleId && (
            <SpotlightCard
              className="p-8 bg-white/[0.02] border-white/10"
              spotlightColor="rgba(139, 92, 246, 0.2)"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono font-bold tracking-wider">
                    PASSWORD
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowChangePassword(!showChangePassword);
                    setPasswordError("");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {showChangePassword ? "Cancel" : "Change"}
                </button>
              </div>

              {showChangePassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-modern w-full pl-12 pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-modern w-full pl-12 pr-10"
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-modern w-full pl-12 pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {passwordError}
                    </div>
                  )}

                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="btn-primary w-full py-2 px-4 text-sm flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Update Password
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  Click "Change" to update your password
                </div>
              )}
            </SpotlightCard>
          )}

          {/* Notification Settings */}
          <SpotlightCard
            className="p-8 bg-white/[0.02] border-white/10"
            spotlightColor="rgba(245, 158, 11, 0.2)"
          >
            <div className="flex items-center gap-3 text-amber-500 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-sm font-mono font-bold tracking-wider">
                NOTIFICATIONS
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "email",
                  label: "Analysis Completions",
                  desc: "Get notified when your analysis is ready.",
                },
                {
                  key: "updates",
                  label: "Product Updates",
                  desc: "New features and improvements.",
                },
                {
                  key: "marketing",
                  label: "Weekly Digest",
                  desc: "Summary of your weekly activity.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <button
                    onClick={() =>
                      toggleNotification(item.key as keyof typeof notifications)
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      notifications[item.key as keyof typeof notifications]
                        ? "bg-[#5D5FEF]"
                        : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? "translate-x-6"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Usage & Actions */}
        <div className="space-y-6">
          {/* Credits Usage */}
          <SpotlightCard
            className="p-8 bg-white/[0.02] border-white/10"
            spotlightColor="rgba(16, 185, 129, 0.2)"
          >
            <div className="flex items-center gap-3 text-emerald-500 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-sm font-mono font-bold tracking-wider">
                USAGE
              </span>
            </div>

            <div className="space-y-6">
              {safeCredits === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                  <HourglassAnimation />
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-white mb-1">
                      {timeLeft}
                    </div>
                    <div className="text-xs text-gray-400">
                      until credits reset
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      Daily Credits
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-white">
                        <CountUp value={safeCredits} />
                      </div>
                      <span className="text-gray-500">remaining</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${Math.min(100, (safeCredits / 3) * 100)}%`,
                      }}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between text-xs text-gray-500">
                <span>Resets daily at midnight</span>
                <span>3/day limit</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/20 transition-all flex items-center justify-center gap-2 font-medium group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>

          {/* Support & Legal Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/contact"
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 text-center group"
            >
              <MessageSquare className="w-5 h-5 text-[#5D5FEF] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white">
                Contact Support
              </span>
            </Link>
            <div className="flex flex-col gap-2">
              <Link
                to="/privacy"
                className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-medium text-gray-400 hover:text-white"
              >
                <Shield className="w-3 h-3" /> Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-medium text-gray-400 hover:text-white"
              >
                <FileText className="w-3 h-3" /> Terms of Service
              </Link>
            </div>
          </div>

          {/* Delete Account */}
          <SpotlightCard
            className="p-6 bg-red-500/5 border-red-500/20"
            spotlightColor="rgba(239, 68, 68, 0.1)"
          >
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-sm font-mono font-bold tracking-wider">
                DANGER ZONE
              </span>
            </div>

            {!showDeleteAccount ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  Once you delete your account, there is no going back. All your
                  data will be permanently removed.
                </p>
                <button
                  onClick={() => setShowDeleteAccount(true)}
                  className="w-full py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-400 font-medium">
                  This action cannot be undone. Type "DELETE" to confirm.
                </p>

                {!user.googleId && (
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showDeletePassword ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="input-modern w-full pl-12 pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowDeletePassword(!showDeletePassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showDeletePassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="input-modern w-full"
                    placeholder="DELETE"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteAccount(false);
                      setDeletePassword("");
                      setDeleteConfirmText("");
                    }}
                    className="flex-1 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={
                      isDeletingAccount || deleteConfirmText !== "DELETE"
                    }
                    className="flex-1 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeletingAccount ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete Forever
                  </button>
                </div>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </motion.div>
  );
}
