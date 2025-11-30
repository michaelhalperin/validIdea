import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Plus,
  History,
  Menu,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BarChart3,
  GitCompare,
  Bell,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isLanding = location.pathname === "/";
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  if (isLanding) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  const navItems = [
    {
      path: "/idea-of-the-day",
      label: "Idea of the Day",
      icon: Sparkles,
      public: true,
    },
    { path: "/new-idea", label: "New Analysis", icon: Plus },
    { path: "/history", label: "History", icon: History },
    { path: "/comparison", label: "Compare", icon: GitCompare },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/market-alerts", label: "Market Alerts", icon: Bell },
    ...(user?.role === "ADMIN"
      ? [{ path: "/admin", label: "Admin", icon: LayoutGrid }]
      : []),
  ];

  return (
    <div className="min-h-screen flex bg-[#050505]">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex ${
          isCollapsed ? "w-20" : "w-72"
        } flex-col border-r border-white/5 bg-[#080808] fixed h-full z-40 transition-all duration-300`}
      >
        <div className={`p-6 ${isCollapsed ? "px-3" : ""} relative`}>
          {!isCollapsed && (
            <img
              src="/logo.svg"
              alt="ValidIdea Logo"
              className="h-24 group-hover:scale-110 transition-transform duration-300"
            />
          )}
          {isCollapsed && (
            <img
              src="/logo-icon.svg"
              alt="ValidIdea"
              className="w-12 h-12 group-hover:scale-110 transition-transform duration-300"
            />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-6 right-0 translate-x-1/2 w-6 h-6 rounded-full bg-[#080808] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all z-50"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <div
          className={`flex-1 py-6 space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/idea-of-the-day" &&
                location.pathname.startsWith("/idea-of-the-day"));

            // Public items are always visible, protected items require auth
            if (!item.public && !user) {
              return null;
            }

            // Disable New Analysis if no credits
            const isNewAnalysis = item.path === "/new-idea";
            const noCredits = user && user.credits <= 0;
            const isDisabled = isNewAnalysis && noCredits;

            if (isDisabled) {
              return (
                <div
                  key={item.path}
                  className={`nav-item opacity-50 cursor-not-allowed relative group ${
                    isCollapsed ? "justify-center px-0" : ""
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && item.label}
                  {!isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      No credits remaining
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""} ${
                  isCollapsed ? "justify-center px-0" : ""
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && item.label}
                {!isCollapsed && isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </div>

        <div
          className={`p-4 border-t border-white/5 ${isCollapsed ? "px-2" : ""}`}
        >
          {user && (
            <Link
              to="/profile"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              } p-3 rounded-lg hover:bg-white/5 transition-colors mb-2 group`}
              title={
                isCollapsed
                  ? `${user.name || "User"}\n${user.email}`
                  : undefined
              }
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.name
                  ? user.name[0].toUpperCase()
                  : user.email[0].toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                    {user.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
              )}
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-lg border-b border-white/5 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="ValidIdea Logo" className="h-14" />
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
            >
              {user.name
                ? user.name[0].toUpperCase()
                : user.email[0].toUpperCase()}
            </Link>
          )}
          <button className="p-2 text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 relative transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-72"
        }`}
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              maskImage:
                "linear-gradient(to bottom, black 40%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto pt-24 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
