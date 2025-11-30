import { DollarSign, TrendingUp, Target, Clock, Percent, Users } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import CountUp from '../ui/CountUp';
import type { Analysis } from '../../types';

interface UnitEconomicsProps {
  analysis: Analysis;
}

export default function UnitEconomics({ analysis }: UnitEconomicsProps) {
  if (!analysis.unitEconomics) return null;

  const ue = analysis.unitEconomics;
  const ltvCacRatio = ue.ltv_cac_ratio;
  const isHealthy = ltvCacRatio >= 3;

  return (
    <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(16, 185, 129, 0.2)">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <DollarSign className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Unit Economics</h3>
          <p className="text-sm text-gray-400 mt-1">Customer profitability metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* CAC */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Customer Acquisition Cost</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            <CountUp value={ue.estimated_cac_usd} prefix="$" />
          </div>
          <p className="text-xs text-gray-500">Per customer</p>
        </div>

        {/* LTV */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Lifetime Value</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            <CountUp value={ue.estimated_ltv_usd} prefix="$" />
          </div>
          <p className="text-xs text-gray-500">Per customer</p>
        </div>

        {/* LTV:CAC Ratio */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">LTV:CAC Ratio</span>
          </div>
          <div className={`text-3xl font-mono font-bold mb-1 ${isHealthy ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {ltvCacRatio.toFixed(1)}x
          </div>
          <p className={`text-xs ${isHealthy ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {isHealthy ? 'Healthy' : 'Needs improvement'}
          </p>
        </div>

        {/* Payback Period */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Payback Period</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {ue.payback_period_months}
          </div>
          <p className="text-xs text-gray-500">Months</p>
        </div>

        {/* Contribution Margin */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Contribution Margin</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {ue.contribution_margin_percent}%
          </div>
          <p className="text-xs text-gray-500">Per customer</p>
        </div>

        {/* Break Even */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Break Even</span>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {ue.break_even_customers.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500">Customers needed</p>
        </div>
      </div>

      {ue.assumptions && ue.assumptions.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <h4 className="text-sm font-bold text-white mb-3">Key Assumptions</h4>
          <ul className="space-y-2">
            {ue.assumptions.map((assumption, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                {assumption}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SpotlightCard>
  );
}

