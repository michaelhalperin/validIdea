import { Target, Zap, Code, TrendingUp, ArrowUpRight } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import CountUp from '../ui/CountUp';
import type { Analysis } from '../../types';

interface KeyMetricsGridProps {
  analysis: Analysis;
}

export default function KeyMetricsGrid({ analysis }: KeyMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Market Size - Tall Card */}
      <SpotlightCard className="md:col-span-1 md:row-span-2 p-8 flex flex-col bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(6, 182, 212, 0.2)">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/5 flex items-center justify-center mb-8 text-[#06B6D4] ring-1 ring-[#06B6D4]/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Target className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-gray-400 mb-3 tracking-wide">TOTAL ADDRESSABLE MARKET</h3>
        <div className="text-5xl lg:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-8 tracking-tighter">
          <CountUp 
            value={analysis.marketSize?.tamn_estimate_usd || 0} 
            prefix="$" 
          />
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-[#06B6D4]/30 pl-4">
            {analysis.marketSize?.reasoning}
          </p>
          <div className="space-y-3">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">Market Vectors</div>
            {analysis.marketSize?.data_points?.map((point: string, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </SpotlightCard>

      {/* Competitors - Wide Card */}
      <SpotlightCard className="md:col-span-2 p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(236, 72, 153, 0.2)">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC4899]/20 to-[#EC4899]/5 flex items-center justify-center text-[#EC4899] ring-1 ring-[#EC4899]/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Competitive Landscape</h3>
              <p className="text-sm text-gray-400 mt-1">Direct and indirect market challengers</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.competitors?.map((comp, i: number) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  {comp.name}
                  <ArrowUpRight className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <span className="text-xs font-mono text-[#EC4899] bg-[#EC4899]/10 px-2.5 py-1 rounded-full border border-[#EC4899]/20">
                  {comp.confidence}% OVERLAP
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{comp.why_competitor}</p>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* Technical - Standard Card */}
      <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(255, 208, 41, 0.2)">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD029]/20 to-[#FFD029]/5 flex items-center justify-center mb-8 text-[#FFD029] ring-1 ring-[#FFD029]/30 shadow-[0_0_15px_rgba(255,208,41,0.15)]">
          <Code className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Technical Feasibility</h3>
        <div className="flex justify-between items-end mb-8 pb-6 border-b border-white/5">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Complexity</div>
            <div className="text-3xl font-bold text-[#FFD029]">{analysis.technicalFeasibility?.complexity_rating}/10</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">MVP Timeline</div>
            <div className="text-3xl font-bold text-white">{analysis.technicalFeasibility?.estimated_dev_months} <span className="text-lg text-gray-500 font-normal">mo</span></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.technicalFeasibility?.stack?.map((tech: string, i: number) => (
            <span key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-xs text-gray-300 border border-white/[0.05] hover:bg-white/[0.1] transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </SpotlightCard>

      {/* Cost - Standard Card */}
      <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(16, 185, 129, 0.2)">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-8 text-emerald-500 ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <TrendingUp className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Financial Outlook</h3>
        <div className="space-y-6">
          <div className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">Initial Development</span>
              <CountUp 
                value={analysis.costEstimate?.dev_cost_usd || 0} 
                prefix="$"
                className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors"
              />
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/50 w-3/4 rounded-full" />
            </div>
          </div>
          <div className="group">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">Year 1 Marketing</span>
              <CountUp 
                value={analysis.costEstimate?.marketing_first_year_usd || 0} 
                prefix="$"
                className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors"
              />
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/30 w-1/2 rounded-full" />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
