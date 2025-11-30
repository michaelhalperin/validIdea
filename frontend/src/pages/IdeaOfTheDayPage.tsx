import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useSEO } from "../hooks/useSEO";
import type { Analysis } from "../types";
import MarketAnalysis from "../components/analysis/MarketAnalysis";
import StrategyAnalysis from "../components/analysis/StrategyAnalysis";
import ExecutionAnalysis from "../components/analysis/ExecutionAnalysis";
import DevelopmentPrompt from "../components/analysis/DevelopmentPrompt";
import ScoreGauge from "../components/analysis/ScoreGauge";
import OpportunityOverview from "../components/analysis/OpportunityOverview";

interface IdeaOfTheDayData {
  id: string;
  date: string;
  title: string;
  oneLiner: string;
  description: string;
  idea: {
    id: string;
    title: string;
    oneLiner: string;
    description: string;
    attachments: any[];
  };
  analysis: Analysis;
}

export default function IdeaOfTheDayPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<
    "overview" | "market" | "strategy" | "execution" | "development"
  >("overview");

  const { data, isLoading, error } = useQuery<
    IdeaOfTheDayData | { status: string; message: string }
  >({
    queryKey: ["idea-of-the-day", id],
    queryFn: async () => {
      const response = await api.get(`/idea-of-the-day${id ? `/${id}` : ""}`);
      // Handle generating status
      if (response.status === 202 || response.data.status === "generating") {
        return response.data;
      }
      return response.data.ideaOfTheDay;
    },
    refetchInterval: (query) => {
      // If status is generating, poll every 5 seconds
      const data = query.state.data as any;
      return data?.status === "generating" ? 5000 : false;
    },
  });

  // Dynamic SEO for Idea of the Day - must be called before any conditional returns
  const ideaData = data && "id" in data ? (data as IdeaOfTheDayData) : null;
  useSEO(
    ideaData
      ? {
          title: `${ideaData.title} — Idea of the Day | ValidIdea`,
          description: `${ideaData.oneLiner} — Today's featured startup idea with complete AI-powered analysis.`,
          url: `/idea-of-the-day${id ? `/${id}` : ''}`,
        }
      : undefined
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#030303]">
        <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin mb-4" />
        <p className="text-gray-400 animate-pulse">
          Loading Idea of the Day...
        </p>
      </div>
    );
  }

  // Handle generating status
  if (data && "status" in data && data.status === "generating") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#030303] px-4">
        <Loader2 className="w-16 h-16 text-[#6366F1] animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">
          Generating Idea of the Day
        </h2>
        <p className="text-gray-400 max-w-md mb-6">
          {data.message ||
            "Our AI is analyzing today's featured startup idea. This will take about a minute..."}
        </p>
        <p className="text-sm text-gray-500">
          This page will automatically refresh when ready
        </p>
      </div>
    );
  }

  if (error || !data || !("id" in data) || !ideaData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#030303] px-4">
        <div className="text-red-400 mb-4">Error loading Idea of the Day</div>
        <Link to="/" className="text-[#6366F1] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const analysis = ideaData.analysis;
  const opportunityScore =
    (analysis.opportunity as any)?.score || analysis.confidenceOverall || 0;

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 mb-6">
            <span className="text-sm font-medium text-[#6366F1]">
              Featured on{" "}
              {new Date(ideaData.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {ideaData.title}
          </h1>
          <p className="text-xl text-gray-300 mb-2">{ideaData.oneLiner}</p>
          <p className="text-gray-400 leading-relaxed max-w-3xl">
            {ideaData.description}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 overflow-x-auto">
          {(
            [
              "overview",
              "market",
              "strategy",
              "execution",
              "development",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-[#6366F1] text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && analysis && (
            <>
              <OpportunityOverview analysis={analysis} />
              {opportunityScore > 0 && (
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-400 mb-2">
                    Opportunity Score
                  </div>
                  <ScoreGauge score={opportunityScore} />
                </div>
              )}
              {analysis.executiveSummary && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {analysis.executiveSummary}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "market" && analysis && (
            <MarketAnalysis analysis={analysis} />
          )}

          {activeTab === "strategy" && analysis && (
            <StrategyAnalysis analysis={analysis} />
          )}

          {activeTab === "execution" && analysis && (
            <ExecutionAnalysis analysis={analysis} />
          )}

          {activeTab === "development" && analysis && (
            <DevelopmentPrompt
              analysis={analysis}
              idea={{
                id: ideaData.idea.id,
                title: ideaData.title,
                oneLiner: ideaData.oneLiner,
                description: ideaData.description,
                status: "COMPLETED",
                createdAt: ideaData.date,
                updatedAt: ideaData.date,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
