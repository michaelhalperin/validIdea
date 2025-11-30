import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, DollarSign } from 'lucide-react';
import api from '../utils/api';

interface AnalyticsData {
  totalIdeas: number;
  totalAnalyses: number;
  averageConfidence: number;
  averageOpportunityScore: number;
  categoryDistribution: Array<{ category: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  monthlyTrend: Array<{ month: string; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  marketSizeDistribution: Array<{ range: string; count: number }>;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics');
      return response.data.analytics;
    },
  });

  const { data: benchmark } = useQuery({
    queryKey: ['analytics', 'benchmark'],
    queryFn: async () => {
      const response = await api.get('/analytics/benchmark');
      return response.data.benchmark;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-[#6366F1]" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.totalIdeas}</div>
            <div className="text-sm text-gray-400">Total Ideas</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-[#6366F1]" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.averageConfidence}</div>
            <div className="text-sm text-gray-400">Avg Confidence</div>
            {benchmark && (
              <div className="text-xs text-gray-500 mt-2">
                Benchmark: {benchmark.averageConfidence}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-[#6366F1]" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.averageOpportunityScore}</div>
            <div className="text-sm text-gray-400">Avg Opportunity Score</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-[#6366F1]" />
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.totalAnalyses}</div>
            <div className="text-sm text-gray-400">Total Analyses</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Distribution */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Score Distribution</h2>
            <div className="space-y-3">
              {analytics.scoreDistribution.map((item) => (
                <div key={item.range} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-400">{item.range}</div>
                  <div className="flex-1 bg-[#1A1A1A] rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(item.count / analytics.totalAnalyses) * 100}%`,
                      }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="space-y-3">
              {analytics.categoryDistribution.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.category || 'Uncategorized'}</span>
                  <span className="text-[#6366F1] font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {analytics.topKeywords.map((item) => (
              <span
                key={item.keyword}
                className="px-4 py-2 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full text-sm"
              >
                {item.keyword} ({item.count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

