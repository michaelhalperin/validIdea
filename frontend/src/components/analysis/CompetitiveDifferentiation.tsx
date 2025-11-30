import { Shield, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis } from '../../types';

interface CompetitiveDifferentiationProps {
  analysis: Analysis;
}

const moatTypeColors = {
  'Network Effects': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Switching Costs': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Brand': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Technology': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Data': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'None': 'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

const moatStrengthColors = {
  Weak: 'text-red-400',
  Moderate: 'text-yellow-400',
  Strong: 'text-emerald-400',
};

export default function CompetitiveDifferentiation({ analysis }: CompetitiveDifferentiationProps) {
  if (!analysis.competitiveDifferentiation) return null;

  const diff = analysis.competitiveDifferentiation;
  const defensibilityScore = diff.defensibility_score;

  return (
    <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(139, 92, 246, 0.2)">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center text-violet-500 ring-1 ring-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Competitive Differentiation</h3>
          <p className="text-sm text-gray-400 mt-1">Defensibility & moat analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Defensibility Score */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Defensibility Score</span>
          </div>
          <div className="relative mb-4">
            <div className="text-5xl font-mono font-bold text-white mb-2">
              {defensibilityScore}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  defensibilityScore >= 70 ? 'bg-emerald-500' : defensibilityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${defensibilityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Moat Strength */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Moat Strength</span>
          </div>
          <div className={`text-3xl font-bold mb-2 ${moatStrengthColors[diff.moat_strength]}`}>
            {diff.moat_strength}
          </div>
          <div className={`text-xs px-3 py-1 rounded-full border w-fit ${moatTypeColors[diff.moat_type]}`}>
            {diff.moat_type}
          </div>
        </div>
      </div>

      {/* Unique Value Props */}
      {diff.unique_value_props && diff.unique_value_props.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            Unique Value Propositions
          </h4>
          <div className="space-y-3">
            {diff.unique_value_props.map((prop, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <p className="text-sm text-gray-300 leading-relaxed">{prop}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Response */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-white">Competitive Response Likelihood</span>
        </div>
        <p className="text-sm text-gray-400">
          {diff.competitive_response_likelihood === 'High' && 'High risk of competitive response. Focus on speed and execution.'}
          {diff.competitive_response_likelihood === 'Medium' && 'Moderate risk. Build strong differentiation and customer loyalty.'}
          {diff.competitive_response_likelihood === 'Low' && 'Low risk. Market position is relatively defensible.'}
        </p>
      </div>
    </SpotlightCard>
  );
}

