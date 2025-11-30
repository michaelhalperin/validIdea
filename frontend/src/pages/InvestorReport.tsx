import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Loader2,
  FileText,
  TrendingUp,
  DollarSign,
  Target,
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

interface InvestorReport {
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  marketOpportunity: {
    size: number;
    growth: string;
    trends: string[];
  };
  businessModel: {
    revenueStreams: string[];
    pricing: string;
    unitEconomics: string;
  };
  traction: string;
  competitiveAdvantage: string;
  team: string;
  financialProjections: {
    year1: { revenue: number; expenses: number; users: number };
    year2: { revenue: number; expenses: number; users: number };
    year3: { revenue: number; expenses: number; users: number };
  };
  fundingAsk: {
    amount: number;
    useOfFunds: string[];
    milestones: string[];
  };
  pitchDeck: {
    slides: Array<{ title: string; content: string }>;
  };
}

export default function InvestorReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Try to load existing report first
  const { data: existingReport, isLoading: isLoadingExisting } =
    useQuery<InvestorReport | null>({
      queryKey: ["investor-report", id],
      queryFn: async () => {
        try {
          const response = await api.get(`/investor-reports/${id}`);
          return response.data.report as InvestorReport;
        } catch (error: any) {
          if (error.response?.status === 404) {
            return null;
          }
          throw error;
        }
      },
      retry: false,
    });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/investor-reports/${id}`);
      return response.data.report as InvestorReport;
    },
    onSuccess: () => {
      toast.success("Investor report generated and saved!");
      // Invalidate and refetch the report
      queryClient.invalidateQueries({ queryKey: ["investor-report", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to generate report");
    },
  });

  const report = existingReport;

  if (isLoadingExisting) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading investor report...</p>
        </div>
      </div>
    );
  }

  if (!report && !generateMutation.isPending) {
    return (
      <div className="min-h-screen text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-8 text-center">
            <FileText className="w-16 h-16 text-[#6366F1] mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Investor-Ready Report</h1>
            <p className="text-gray-400 mb-8">
              Generate a comprehensive investor report with financial
              projections, pitch deck outline, and funding ask.
            </p>
            <button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="px-8 py-4 bg-[#6366F1] rounded-lg hover:bg-[#5856EB] disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (generateMutation.isPending) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#6366F1] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Generating investor report...</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(report, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `investor-report-${id}.json`;
              a.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] rounded-lg hover:bg-[#5856EB]"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>

        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
            <p className="text-gray-300 leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-3">Problem Statement</h3>
              <p className="text-gray-300">{report.problemStatement}</p>
            </div>
            <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-3">Solution</h3>
              <p className="text-gray-300">{report.solution}</p>
            </div>
          </div>

          {/* Market Opportunity */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[#6366F1]" />
              <h3 className="text-xl font-semibold">Market Opportunity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Market Size</div>
                <div className="text-2xl font-bold">
                  ${(report.marketOpportunity.size / 1_000_000_000).toFixed(1)}B
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Growth</div>
                <div className="text-lg font-semibold">
                  {report.marketOpportunity.growth}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Key Trends</div>
              <div className="flex flex-wrap gap-2">
                {report.marketOpportunity.trends.map((trend, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full text-sm"
                  >
                    {trend}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Projections */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-[#6366F1]" />
              <h3 className="text-xl font-semibold">Financial Projections</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                report.financialProjections.year1,
                report.financialProjections.year2,
                report.financialProjections.year3,
              ].map((year, idx) => (
                <div key={idx} className="bg-[#1A1A1A] rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-3">
                    Year {idx + 1}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Revenue</div>
                      <div className="text-lg font-semibold">
                        ${(year.revenue / 1_000_000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Expenses</div>
                      <div className="text-lg font-semibold">
                        ${(year.expenses / 1_000_000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Users</div>
                      <div className="text-lg font-semibold">
                        {year.users.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funding Ask */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-[#6366F1]" />
              <h3 className="text-xl font-semibold">Funding Ask</h3>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold mb-2">
                ${(report.fundingAsk.amount / 1_000_000).toFixed(1)}M
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold mb-2">Use of Funds</div>
                <ul className="space-y-1">
                  {report.fundingAsk.useOfFunds.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-[#6366F1] mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">Milestones</div>
                <ul className="space-y-1">
                  {report.fundingAsk.milestones.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-[#6366F1] mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pitch Deck Outline */}
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Pitch Deck Outline</h3>
            <div className="space-y-3">
              {report.pitchDeck.slides.map((slide, idx) => (
                <div key={idx} className="bg-[#1A1A1A] rounded-lg p-4">
                  <div className="font-semibold mb-2">
                    Slide {idx + 1}: {slide.title}
                  </div>
                  <p className="text-sm text-gray-400">{slide.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
