import { AlertCircle, CheckCircle2, Clock, Zap, Target, TrendingUp } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis } from '../../types';

interface OpportunityOverviewProps {
  analysis: Analysis;
}

export default function OpportunityOverview({ analysis }: OpportunityOverviewProps) {
  const { opportunity, categorization, whyNow } = analysis;

  if (!opportunity) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Opportunity Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="p-6 bg-[#080808]/80 backdrop-blur-xl border-emerald-500/20" spotlightColor="rgba(16, 185, 129, 0.2)">
            <div className="flex flex-col items-center text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(opportunity.score)}`}>{opportunity.score}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Opportunity Score</div>
                <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono">
                    {opportunity.score >= 80 ? 'EXCEPTIONAL' : opportunity.score >= 60 ? 'GOOD' : 'WEAK'}
                </div>
            </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(239, 68, 68, 0.2)">
            <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
                <div className="text-lg font-semibold text-white mb-1">{opportunity.pain_level}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Pain Level</div>
            </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(59, 130, 246, 0.2)">
            <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-lg font-semibold text-white mb-1">{opportunity.feasibility}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Feasibility</div>
            </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(245, 158, 11, 0.2)">
            <div className="flex flex-col items-center text-center">
                <Clock className="w-8 h-8 text-amber-400 mb-3" />
                <div className="text-lg font-semibold text-white mb-1">{opportunity.why_now}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Timing</div>
            </div>
        </SpotlightCard>
      </div>

      {/* Why Now Narrative */}
      {whyNow && (
        <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(139, 92, 246, 0.1)">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> Why Now?
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg font-light">
                {whyNow}
            </p>
        </SpotlightCard>
      )}

      {/* Categorization */}
      {categorization && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <SpotlightCard className="p-6 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(236, 72, 153, 0.1)">
                <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Categorization
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Type</span>
                        <span className="text-white font-medium">{categorization.type}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Market</span>
                        <span className="text-white font-medium">{categorization.market}</span>
                    </div>
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Target Audience</span>
                        <span className="text-white font-medium text-right max-w-[60%]">{categorization.target}</span>
                    </div>
                </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(16, 185, 129, 0.1)">
                 <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Market Landscape
                </h4>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Main Competitor</span>
                        <span className="text-white font-medium">{categorization.main_competitor}</span>
                    </div>
                     <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Unfair Advantage</span>
                        <span className="text-white font-medium text-right max-w-[60%]">{opportunity.unfair_advantage}</span>
                    </div>
                </div>
            </SpotlightCard>
        </div>
      )}
    </div>
  );
}

