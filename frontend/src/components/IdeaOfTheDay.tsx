import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, ArrowRight, Calendar } from 'lucide-react';
import api from '../utils/api';
import type { Analysis } from '../types';
import ScoreGauge from './analysis/ScoreGauge';
import { Link } from 'react-router-dom';

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

export default function IdeaOfTheDay() {
  const { data, isLoading, error } = useQuery<IdeaOfTheDayData | { status: string; message: string }>({
    queryKey: ['idea-of-the-day'],
    queryFn: async () => {
      const response = await api.get('/idea-of-the-day');
      // Handle generating status
      if (response.status === 202 || response.data.status === 'generating') {
        return response.data;
      }
      return response.data.ideaOfTheDay;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchInterval: (query) => {
      // If status is generating, poll every 5 seconds
      const data = query.state.data as any;
      return data?.status === 'generating' ? 5000 : false;
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin" />
      </div>
    );
  }

  // Don't show section if generating or error
  if (error || !data || ('status' in data && data.status === 'generating') || !('id' in data)) {
    return null; // Don't show error, just don't display the section
  }

  const ideaData = data as IdeaOfTheDayData;
  const analysis = ideaData.analysis;
  const opportunityScore = (analysis.opportunity as any)?.score || analysis.confidenceOverall || 0;

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0A0A0A] to-[#030303]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[100px] mix-blend-screen" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 mb-6">
            <Calendar className="w-4 h-4 text-[#6366F1]" />
            <span className="text-sm font-medium text-[#6366F1]">Idea of the Day</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Today's Featured Startup Idea
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore a complete AI-powered analysis of a real startup concept
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Idea Info */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{ideaData.title}</h3>
                  <p className="text-gray-300 text-lg mb-4">{ideaData.oneLiner}</p>
                  <p className="text-gray-400 leading-relaxed">{ideaData.description}</p>
                </div>
              </div>

              {/* Key Metrics */}
              {analysis && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {analysis.confidenceOverall !== undefined && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Confidence Score</div>
                      <div className="text-3xl font-bold text-white">{analysis.confidenceOverall}</div>
                    </div>
                  )}
                  {analysis.marketSize && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Market Size</div>
                      <div className="text-lg font-bold text-white">
                        ${((analysis.marketSize as any).tamn_estimate_usd / 1e9).toFixed(1)}B
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Analysis Highlights */}
            <div>
              {analysis && (
                <>
                  {/* Score Gauge */}
                  {opportunityScore > 0 && (
                    <div className="mb-6">
                      <div className="text-center mb-2">
                        <div className="text-sm text-gray-400 mb-2">Opportunity Score</div>
                      </div>
                      <ScoreGauge score={opportunityScore} />
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    {analysis.swot && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-[#6366F1]" />
                          <span className="text-sm font-medium text-gray-300">Key Strengths</span>
                        </div>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {(analysis.swot.strengths || []).slice(0, 2).map((s: string, i: number) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.technicalFeasibility && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-[#EC4899]" />
                          <span className="text-sm font-medium text-gray-300">Tech Stack</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {((analysis.technicalFeasibility as any).stack || []).slice(0, 4).map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-[#6366F1]/20 text-[#6366F1] text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <Link
              to={`/idea-of-the-day/${ideaData.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold rounded-lg hover:scale-105 transition-transform"
            >
              View Full Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

