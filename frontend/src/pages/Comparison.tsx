import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Clock,
  FolderOpen,
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import type { Idea, Analysis } from "../types";

interface ComparisonData {
  ideas: Array<{
    id: string;
    title: string;
    oneLiner: string;
    analysis: Analysis | null;
  }>;
}

export default function Comparison() {
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>([]);
  const [comparisonName, setComparisonName] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: ideas } = useQuery({
    queryKey: ["ideas"],
    queryFn: async () => {
      const response = await api.get("/ideas");
      return response.data.ideas as Idea[];
    },
  });

  const { data: savedComparisons } = useQuery({
    queryKey: ["comparisons"],
    queryFn: async () => {
      const response = await api.get("/comparison");
      return response.data.comparisons as Array<{
        id: string;
        name: string | null;
        ideaIds: string[];
        createdAt: string;
      }>;
    },
  });

  const { data: comparison, isLoading } = useQuery<ComparisonData>({
    queryKey: ["comparison", selectedIdeas],
    queryFn: async () => {
      if (selectedIdeas.length < 2) return null;
      const response = await api.post("/comparison", {
        ideaIds: selectedIdeas,
      });
      return response.data.comparison;
    },
    enabled: selectedIdeas.length >= 2,
  });

  const saveMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.post("/comparison", { ideaIds: selectedIdeas, name });
    },
    onSuccess: () => {
      toast.success("Comparison saved!");
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
      setComparisonName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/comparison/${id}`);
    },
    onSuccess: () => {
      toast.success("Comparison deleted");
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });

  const loadSavedComparison = async (comparisonId: string) => {
    try {
      const response = await api.get(`/comparison/${comparisonId}`);
      const saved = response.data.saved;
      if (saved && saved.ideaIds) {
        setSelectedIdeas(saved.ideaIds);
        toast.success("Comparison loaded");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to load comparison");
    }
  };

  const toggleIdea = (ideaId: string) => {
    if (selectedIdeas.includes(ideaId)) {
      setSelectedIdeas(selectedIdeas.filter((id) => id !== ideaId));
    } else if (selectedIdeas.length < 5) {
      setSelectedIdeas([...selectedIdeas, ideaId]);
    } else {
      toast.error("Maximum 5 ideas can be compared");
    }
  };

  const getScore = (analysis: Analysis | null) => {
    if (!analysis) return null;
    return (
      (analysis.opportunity as any)?.score || analysis.confidenceOverall || 0
    );
  };

  const getMarketSize = (analysis: Analysis | null) => {
    if (!analysis?.marketSize) return null;
    return (analysis.marketSize as any).tamn_estimate_usd;
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Compare Ideas</h1>

        {/* Saved Comparisons Section */}
        {savedComparisons && savedComparisons.length > 0 && (
          <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-8 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-5 h-5 text-[#6366F1]" />
              <h2 className="text-xl font-semibold">Saved Comparisons</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedComparisons.map((comparison) => (
                <div
                  key={comparison.id}
                  className="p-4 rounded-lg border border-white/10 hover:border-[#6366F1]/50 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">
                      {comparison.name || "Unnamed Comparison"}
                    </h3>
                    <button
                      onClick={() => deleteMutation.mutate(comparison.id)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    {comparison.ideaIds.length} ideas
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3" />
                    {new Date(comparison.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => loadSavedComparison(comparison.id)}
                    className="w-full px-4 py-2 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/20 rounded-lg text-sm font-medium text-[#6366F1] transition-colors"
                  >
                    Load Comparison
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idea Selection */}
        <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Select Ideas to Compare (2-5)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas
              ?.filter((i) => i.status === "COMPLETED")
              .map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => toggleIdea(idea.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedIdeas.includes(idea.id)
                      ? "border-[#6366F1] bg-[#6366F1]/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{idea.title}</h3>
                      <p className="text-sm text-gray-400">{idea.oneLiner}</p>
                    </div>
                    {selectedIdeas.includes(idea.id) ? (
                      <X className="w-5 h-5 text-[#6366F1]" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
          </div>

          {selectedIdeas.length >= 2 && (
            <div className="mt-6 flex gap-4">
              <input
                type="text"
                placeholder="Save as..."
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg"
              />
              <button
                onClick={() => saveMutation.mutate(comparisonName)}
                className="px-6 py-2 bg-[#6366F1] rounded-lg hover:bg-[#5856EB] flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin mx-auto" />
          </div>
        )}

        {comparison && comparison.ideas.length >= 2 && (
          <div className="bg-[#0A0A0A] rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6">Comparison</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4">Metric</th>
                  {comparison.ideas.map((idea) => (
                    <th key={idea.id} className="text-left p-4 min-w-[200px]">
                      {idea.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold">Score</td>
                  {comparison.ideas.map((idea) => {
                    const score = getScore(idea.analysis);
                    return (
                      <td key={idea.id} className="p-4">
                        {score !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{score}</span>
                            {score >= 70 ? (
                              <TrendingUp className="w-5 h-5 text-green-400" />
                            ) : score >= 50 ? (
                              <Minus className="w-5 h-5 text-yellow-400" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold">Market Size</td>
                  {comparison.ideas.map((idea) => {
                    const marketSize = getMarketSize(idea.analysis);
                    return (
                      <td key={idea.id} className="p-4">
                        {marketSize ? (
                          <span>${(marketSize / 1_000_000).toFixed(1)}M</span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 font-semibold">One Liner</td>
                  {comparison.ideas.map((idea) => (
                    <td key={idea.id} className="p-4 text-sm text-gray-300">
                      {idea.oneLiner}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
