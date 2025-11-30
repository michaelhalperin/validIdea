import { AlertTriangle, Shield, TrendingDown, DollarSign, Scale, Settings } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis } from '../../types';

interface RiskAssessmentProps {
  analysis: Analysis;
}

const riskIcons = {
  technical: Settings,
  market: TrendingDown,
  financial: DollarSign,
  regulatory: Scale,
  operational: Shield,
};

const getRiskColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'rgba(59, 130, 246, 0.2)',
    amber: 'rgba(245, 158, 11, 0.2)',
    emerald: 'rgba(16, 185, 129, 0.2)',
    purple: 'rgba(139, 92, 246, 0.2)',
    pink: 'rgba(236, 72, 153, 0.2)',
  };
  return colors[color] || colors.blue;
};

const getRiskIconColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    pink: 'text-pink-500 bg-pink-500/10',
  };
  return colors[color] || colors.blue;
};

const probabilityColors = {
  Low: 'text-green-400 bg-green-500/10 border-green-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
};


export default function RiskAssessment({ analysis }: RiskAssessmentProps) {
  if (!analysis.riskAssessment) return null;

  const risks = analysis.riskAssessment;
  const riskCategories = [
    { key: 'technical_risks', label: 'Technical Risks', icon: riskIcons.technical, color: 'blue' },
    { key: 'market_risks', label: 'Market Risks', icon: riskIcons.market, color: 'amber' },
    { key: 'financial_risks', label: 'Financial Risks', icon: riskIcons.financial, color: 'emerald' },
    { key: 'regulatory_risks', label: 'Regulatory Risks', icon: riskIcons.regulatory, color: 'purple' },
    { key: 'operational_risks', label: 'Operational Risks', icon: riskIcons.operational, color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          Risk Assessment
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskCategories.map((category) => {
          const riskList = risks[category.key as keyof typeof risks] as Array<{
            risk: string;
            probability: 'Low' | 'Medium' | 'High';
            impact: 'Low' | 'Medium' | 'High';
            mitigation: string;
          }>;

          if (!riskList || riskList.length === 0) return null;

          const Icon = category.icon;

          return (
            <SpotlightCard
              key={category.key}
              className="p-6 bg-[#080808]/80 backdrop-blur-xl"
              spotlightColor={getRiskColor(category.color)}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${getRiskIconColor(category.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{category.label}</h3>
              </div>

              <div className="space-y-4">
                {riskList.map((risk, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-white flex-1">{risk.risk}</h4>
                      <div className="flex gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${probabilityColors[risk.probability]}`}>
                          {risk.probability} Prob
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${probabilityColors[risk.impact]}`}>
                          {risk.impact} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      <span className="text-gray-500">Mitigation: </span>
                      {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}

