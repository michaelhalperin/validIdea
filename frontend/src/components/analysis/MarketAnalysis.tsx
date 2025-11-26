import { Target, Zap, BookOpen, Search, TrendingUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import CountUp from '../ui/CountUp';
import type { Analysis } from '../../types';

interface MarketAnalysisProps {
  analysis: Analysis;
}

export default function MarketAnalysis({ analysis }: MarketAnalysisProps) {
  // Simulated Breakdown for Visualization (TAM/SAM/SOM Logic)
  const tam = analysis.marketSize?.tamn_estimate_usd || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* TAM Card */}
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10 flex flex-col" spotlightColor="rgba(6, 182, 212, 0.2)">
          <div className="flex items-center gap-3 text-[#06B6D4] mb-6">
            <div className="p-2 rounded-lg bg-[#06B6D4]/10">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-sm font-mono font-bold tracking-wider">MARKET SIZING</span>
          </div>

          <div className="mb-8 relative">
            {/* Visual Representation of Market Segments */}
            <div className="flex items-end gap-2 h-32 mb-4">
              <div className="w-1/3 bg-[#06B6D4]/10 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 left-0 w-full bg-[#06B6D4]/20 h-full rounded-t-lg border-t border-x border-[#06B6D4]/30 transition-all duration-500 group-hover:bg-[#06B6D4]/30" />
                <div className="absolute -top-6 left-0 w-full text-center text-xs font-mono text-[#06B6D4]">TAM</div>
              </div>
              <div className="w-1/3 bg-[#06B6D4]/10 h-2/3 rounded-t-lg relative group">
                <div className="absolute bottom-0 left-0 w-full bg-[#06B6D4]/40 h-full rounded-t-lg border-t border-x border-[#06B6D4]/50 transition-all duration-500 group-hover:bg-[#06B6D4]/50" />
                <div className="absolute -top-6 left-0 w-full text-center text-xs font-mono text-[#06B6D4]">SAM</div>
              </div>
              <div className="w-1/3 bg-[#06B6D4]/10 h-1/4 rounded-t-lg relative group">
                <div className="absolute bottom-0 left-0 w-full bg-[#06B6D4] h-full rounded-t-lg border-t border-x border-[#06B6D4] transition-all duration-500 group-hover:bg-[#06B6D4] shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                <div className="absolute -top-6 left-0 w-full text-center text-xs font-mono text-white">SOM</div>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-white">
                <CountUp value={tam} prefix="$" />
              </div>
              <span className="text-sm text-gray-500 font-mono">Global TAM</span>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <p className="text-sm text-gray-400 leading-relaxed pl-3 border-l-2 border-[#06B6D4]/30">
              {analysis.marketSize?.reasoning}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {analysis.marketSize?.data_points?.map((point, i) => (
                <span key={i} className="text-xs bg-[#06B6D4]/5 border border-[#06B6D4]/20 text-[#06B6D4] px-2 py-1 rounded-full">
                  {point}
                </span>
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* Signals */}
        {analysis.signals && (
             <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(59, 130, 246, 0.2)">
                <div className="flex items-center gap-3 text-blue-500 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-mono font-bold tracking-wider">COMMUNITY & SEARCH SIGNALS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Community Engagement</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{analysis.signals.community_engagement}</p>
                    </div>
                     <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Search Trends</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{analysis.signals.search_trends}</p>
                    </div>
                     <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Market Gap</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{analysis.signals.market_gap}</p>
                    </div>
                </div>
            </SpotlightCard>
        )}

        {/* Trends Card */}
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(245, 158, 11, 0.2)">
          <div className="flex items-center gap-3 text-amber-500 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-mono font-bold tracking-wider">MARKET SIGNALS</span>
          </div>
          
          <div className="space-y-4">
            {analysis.marketTrends?.map((trend, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 hover:bg-white/[0.05] transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-white mb-1 flex items-center gap-2">
                      {trend.trend}
                    </div>
                    <div className="text-xs text-gray-400 leading-relaxed">{trend.impact}</div>
                  </div>
                  <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border flex-shrink-0 ${
                    trend.direction === 'UP' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : trend.direction === 'DOWN'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                  }`}>
                    <ArrowUpRight className={`w-5 h-5 ${
                      trend.direction === 'DOWN' ? 'rotate-90' : trend.direction === 'STABLE' ? 'rotate-45' : '-rotate-45' // Adjust rotation based on icon logic
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      {/* Competitors */}
      <div className="grid grid-cols-1 gap-6">
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(236, 72, 153, 0.2)">
          <div className="flex items-center gap-3 text-[#EC4899] mb-6">
            <div className="p-2 rounded-lg bg-[#EC4899]/10">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-sm font-mono font-bold tracking-wider">COMPETITIVE LANDSCAPE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.competitors?.map((comp, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {comp.name}
                    <ArrowUpRight className="w-3 h-3 text-gray-500" />
                  </h4>
                  <span className="text-xs font-mono text-[#EC4899] bg-[#EC4899]/10 px-2 py-0.5 rounded">
                    {comp.confidence}% MATCH
                  </span>
                </div>
                <p className="text-sm text-gray-400">{comp.why_competitor}</p>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      {/* Deep Research */}
      <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(139, 92, 246, 0.2)">
        <div className="flex items-center gap-3 text-violet-500 mb-6">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-sm font-mono font-bold tracking-wider">RESEARCH TASKS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.deepResearch?.map((item, i) => (
            <div key={i} className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/30 transition-colors">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <Search className="w-3 h-3 text-violet-500" />
                {item.topic}
                {item.source_url && <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-violet-400" />}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
