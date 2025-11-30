import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Play,
  Loader2,
  ArrowLeft,
  LayoutDashboard,
  TrendingUp,
  Crosshair,
  Layers,
  Menu,
  X,
  Terminal,
  MessageSquare,
  CheckSquare,
  FileText,
  MoreVertical,
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { useSEO } from "../hooks/useSEO";
import type { Analysis, Idea } from "../types";
import MarketAnalysis from "../components/analysis/MarketAnalysis";
import StrategyAnalysis from "../components/analysis/StrategyAnalysis";
import ExecutionAnalysis from "../components/analysis/ExecutionAnalysis";
import DevelopmentPrompt from "../components/analysis/DevelopmentPrompt";
import ScoreGauge from "../components/analysis/ScoreGauge";
import OpportunityOverview from "../components/analysis/OpportunityOverview";
import ChatInterface from "../components/analysis/ChatInterface";
import ValidationChecklist from "../components/analysis/ValidationChecklist";
import Recommendations from "../components/analysis/Recommendations";

type Tab =
  | "overview"
  | "market"
  | "strategy"
  | "execution"
  | "development"
  | "chat"
  | "checklist"
  | "recommendations";

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showRaw, setShowRaw] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    data: ideaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["idea", id],
    queryFn: async () => {
      const response = await api.get(`/ideas/${id}`);
      return response.data.idea as Idea;
    },
    refetchInterval: (query) =>
      query.state.data?.status === "ANALYZING" ? 2000 : false,
  });

  const runAnalysisMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/ideas/${id}/generate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", id] });
    },
  });

  const analysis = ideaData?.analyses?.[0] as Analysis | undefined;

  // Dynamic SEO based on idea data
  useSEO(
    ideaData
      ? {
          title: `${ideaData.title} — Analysis | ValidIdea`,
          description: `${ideaData.oneLiner} — AI-powered analysis with market insights, competitor research, and feasibility assessment.`,
          url: `/results/${id}`,
          noindex: true, // Private analysis pages shouldn't be indexed
        }
      : undefined
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#030303]">
        <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse">
          Initializing Analysis Engine...
        </p>
      </div>
    );
  }

  if (error || !ideaData)
    return (
      <div className="text-center py-20 text-red-400">Error loading data</div>
    );

  if (ideaData.status === "ANALYZING") {
    return (
      <div className="flex h-screen bg-[#030303] overflow-hidden text-white font-sans">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-72 bg-[#080808] border-r border-white/5">
          <div className="h-full flex flex-col p-6">
            <div className="mb-6">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />
              <div className="h-8 w-full bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="space-y-2 flex-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-12">
            {/* Header Skeleton */}
            <div className="mb-10">
              <div className="h-10 w-64 bg-white/10 rounded-lg animate-pulse mb-4" />
              <div className="h-6 w-full max-w-2xl bg-white/5 rounded animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="space-y-8">
              {/* Executive Summary Skeleton */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                </div>
              </div>

              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-4" />
                    <div className="h-8 w-24 bg-white/10 rounded animate-pulse mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                      <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading Indicator */}
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-[#6366F1]/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#6366F1] border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#6366F1] animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Analyzing Venture
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  Calculating market vectors, simulating competitors, and
                  generating strategic roadmap...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (ideaData.status === "FAILED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#030303]">
        <div className="w-24 h-24 mb-6 rounded-full bg-red-500/10 flex items-center justify-center ring-1 ring-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">Analysis Failed</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          We encountered an issue while processing your idea.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate("/new-idea")} className="btn-ghost">
            New Idea
          </button>
          <button
            onClick={() => runAnalysisMutation.mutate()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (ideaData.status === "DRAFT") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#030303]">
        <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <Play className="w-10 h-10 text-white ml-1" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">Ready to Analyze</h2>
        <button
          onClick={() => runAnalysisMutation.mutate()}
          disabled={runAnalysisMutation.isPending}
          className="btn-primary mt-8 px-8 py-4 text-lg flex items-center gap-3"
        >
          {runAnalysisMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles />
          )}
          Run Analysis Engine
        </button>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "market", label: "Market Analysis", icon: TrendingUp },
    { id: "strategy", label: "Strategy", icon: Crosshair },
    { id: "execution", label: "Execution", icon: Layers },
    { id: "development", label: "Build It", icon: Terminal },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "checklist", label: "Validation", icon: CheckSquare },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
  ];

  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden text-white font-sans selection:bg-[#6366F1]/30">
      {/* Mobile Nav Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white/10 rounded-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-[#080808] border-r border-white/5 transform transition-transform duration-300 ease-in-out
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="h-full flex flex-col">
          {/* Fixed Header */}
          <div className="p-6 pb-4 flex-shrink-0">
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer group"
              onClick={() => navigate("/history")}
            >
              <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                Back to Hub
              </span>
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-bold leading-tight mb-2 line-clamp-2">
                {ideaData.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-mono text-emerald-500 tracking-wider">
                  ANALYSIS COMPLETE
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <nav className="space-y-1 mb-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-[#6366F1] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      activeTab === item.id
                        ? "text-white"
                        : "text-gray-500 group-hover:text-white"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-4">
              {analysis?.confidenceOverall && (
                <div className="bg-white/5 rounded-2xl p-4 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/10 to-transparent" />
                  <div className="relative z-10">
                    <ScoreGauge score={analysis.confidenceOverall} />
                    <p className="text-xs font-medium text-gray-400 mt-2">
                      Venture Confidence Score
                    </p>
                  </div>
                </div>
              )}
              {/* Export Buttons */}
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    if (analysis?.id) {
                      try {
                        const response = await api.get(
                          `/export/${analysis.id}/pdf`,
                          {
                            responseType: "blob",
                          }
                        );
                        const blob = new Blob([response.data], {
                          type: "application/pdf",
                        });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `analysis-${ideaData?.title
                          .replace(/[^a-z0-9]/gi, "-")
                          .toLowerCase()}-${analysis.id}.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        toast.success("PDF exported!");
                      } catch (err) {
                        console.error("Export error:", err);
                        toast.error("Failed to export PDF. Please try again.");
                      }
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium text-gray-300 hover:text-white"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </button>

                <div className="relative group">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium text-gray-300 hover:text-white">
                    <MoreVertical className="w-4 h-4" /> More Exports
                  </button>
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="py-2">
                      {[
                        { label: "Notion (Markdown)", format: "notion" },
                        { label: "CSV", format: "csv" },
                        { label: "JSON", format: "json" },
                        { label: "Google Sheets", format: "google-sheets" },
                        { label: "Airtable", format: "airtable" },
                      ].map(({ label, format }) => (
                        <button
                          key={format}
                          onClick={async () => {
                            if (analysis?.id) {
                              try {
                                const response = await api.get(
                                  `/exports/${analysis.id}/${format}`,
                                  {
                                    responseType: "blob",
                                  }
                                );
                                const blob = new Blob([response.data], {
                                  type:
                                    format === "json"
                                      ? "application/json"
                                      : "text/plain",
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                const ext =
                                  format === "json"
                                    ? "json"
                                    : format === "notion"
                                    ? "md"
                                    : "csv";
                                a.download = `analysis-${ideaData?.title
                                  .replace(/[^a-z0-9]/gi, "-")
                                  .toLowerCase()}-${analysis.id}.${ext}`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                toast.success(`${label} exported!`);
                              } catch (err) {
                                toast.error(`Failed to export ${label}`);
                              }
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/investor-report/${id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/20 transition-all text-sm font-medium text-[#6366F1] hover:text-[#8B5CF6]"
                >
                  <FileText className="w-4 h-4" /> Investor Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        {/* Background Ambient Gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6366F1]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto p-6 lg:p-12 relative z-10">
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-3xl">
              {ideaData.oneLiner}
            </p>
          </div>

          {/* Content Area */}
          <div className="space-y-8 min-h-[60vh]">
            {activeTab === "overview" && analysis && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <OpportunityOverview analysis={analysis} />
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#6366F1]" /> Executive
                    Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    {analysis.executiveSummary}
                  </p>
                </div>
                {analysis.keywords && (
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((k, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "market" && analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <MarketAnalysis analysis={analysis} />
              </div>
            )}

            {activeTab === "strategy" && analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <StrategyAnalysis analysis={analysis} />
              </div>
            )}

            {activeTab === "execution" && analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ExecutionAnalysis analysis={analysis} />
              </div>
            )}

            {activeTab === "development" && analysis && ideaData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DevelopmentPrompt analysis={analysis} idea={ideaData} />
              </div>
            )}

            {activeTab === "chat" && analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ChatInterface analysisId={analysis.id} />
              </div>
            )}

            {activeTab === "checklist" && ideaData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ValidationChecklist ideaId={ideaData.id} />
              </div>
            )}

            {activeTab === "recommendations" && id && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Recommendations ideaId={id} />
              </div>
            )}
          </div>

          {/* Raw Data Toggle */}
          <div className="mt-20 pt-8 border-t border-white/5">
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs font-mono text-gray-600 hover:text-gray-400 flex items-center gap-2 transition-colors"
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  showRaw ? "rotate-180" : ""
                }`}
              />
              {showRaw ? "HIDE RAW DATA" : "VIEW RAW DATA"}
            </button>
            {showRaw && (
              <div className="mt-4 p-6 rounded-2xl bg-black border border-white/5 overflow-x-auto">
                <pre className="text-xs font-mono text-gray-500">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
