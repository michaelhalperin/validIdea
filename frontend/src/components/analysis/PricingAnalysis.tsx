import { DollarSign, TrendingDown, BarChart3, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis } from '../../types';

interface PricingAnalysisProps {
  analysis: Analysis;
}

const sensitivityColors = {
  Low: 'text-green-400 bg-green-500/10 border-green-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function PricingAnalysis({ analysis }: PricingAnalysisProps) {
  if (!analysis.pricingAnalysis) return null;

  const pricing = analysis.pricingAnalysis;

  return (
    <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(245, 158, 11, 0.2)">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center text-amber-500 ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <DollarSign className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Pricing Analysis</h3>
          <p className="text-sm text-gray-400 mt-1">Pricing strategy & competitive positioning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recommended Model */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Recommended Model</span>
          </div>
          <p className="text-lg font-bold text-white">{pricing.recommended_pricing_model}</p>
        </div>

        {/* Price Sensitivity */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Price Sensitivity</span>
          </div>
          <span className={`text-lg font-bold px-3 py-1 rounded-full border ${sensitivityColors[pricing.price_sensitivity]}`}>
            {pricing.price_sensitivity}
          </span>
        </div>
      </div>

      {/* Pricing Strategy Rationale */}
      {pricing.pricing_strategy_rationale && (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <h4 className="text-sm font-bold text-white mb-2">Strategy Rationale</h4>
          <p className="text-sm text-gray-400 leading-relaxed">{pricing.pricing_strategy_rationale}</p>
        </div>
      )}

      {/* Competitive Pricing Comparison */}
      {pricing.competitive_pricing_comparison && pricing.competitive_pricing_comparison.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white mb-4">Competitive Pricing</h4>
          <div className="space-y-3">
            {pricing.competitive_pricing_comparison.map((comp, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-white">{comp.competitor}</span>
                  <span className="text-sm text-gray-400">{comp.price}</span>
                </div>
                <p className="text-xs text-gray-400">{comp.our_advantage}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Freemium & Discount Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-2">
            {pricing.freemium_viability === 'Yes' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            {pricing.freemium_viability === 'No' && <XCircle className="w-4 h-4 text-red-400" />}
            {pricing.freemium_viability === 'Maybe' && <HelpCircle className="w-4 h-4 text-yellow-400" />}
            <span className="text-sm font-bold text-white">Freemium Viability</span>
          </div>
          <p className="text-sm text-gray-400">{pricing.freemium_viability}</p>
        </div>

        {pricing.discount_strategy && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <h4 className="text-sm font-bold text-white mb-2">Discount Strategy</h4>
            <p className="text-sm text-gray-400">{pricing.discount_strategy}</p>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

