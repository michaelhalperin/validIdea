import { Users, Megaphone, DollarSign, Briefcase, Layers } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis } from '../../types';

interface StrategyAnalysisProps {
  analysis: Analysis;
}

export default function StrategyAnalysis({ analysis }: StrategyAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Business Fit & Value Ladder Row */}
      {(analysis.businessFit || analysis.offerStructure) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Fit */}
            {analysis.businessFit && (
                <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(139, 92, 246, 0.2)">
                     <div className="flex items-center gap-2 text-purple-500 mb-6">
                        <Briefcase className="w-5 h-5" />
                        <span className="text-sm font-mono font-bold tracking-wider">BUSINESS FIT</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Revenue Potential</span>
                            <span className="text-white font-medium">{analysis.businessFit.revenue_potential}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Execution Difficulty</span>
                             <span className={`font-medium ${
                                analysis.businessFit.execution_difficulty === 'Low' ? 'text-green-400' :
                                analysis.businessFit.execution_difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>{analysis.businessFit.execution_difficulty}</span>
                        </div>
                         <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">GTM Efficiency</span>
                             <span className={`font-medium ${
                                analysis.businessFit.go_to_market_efficiency === 'High' ? 'text-green-400' :
                                analysis.businessFit.go_to_market_efficiency === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>{analysis.businessFit.go_to_market_efficiency}</span>
                        </div>
                    </div>
                </SpotlightCard>
            )}

            {/* Value Ladder */}
            {analysis.offerStructure && (
                <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(249, 115, 22, 0.2)">
                     <div className="flex items-center gap-2 text-orange-500 mb-6">
                        <Layers className="w-5 h-5" />
                        <span className="text-sm font-mono font-bold tracking-wider">VALUE LADDER</span>
                    </div>
                     <div className="space-y-3 text-sm">
                         <div className="flex gap-3">
                             <div className="min-w-[80px] text-gray-500 uppercase text-xs mt-0.5">Lead Magnet</div>
                             <div className="text-gray-300">{analysis.offerStructure.lead_magnet}</div>
                         </div>
                         <div className="flex gap-3">
                             <div className="min-w-[80px] text-gray-500 uppercase text-xs mt-0.5">Frontend</div>
                             <div className="text-gray-300">{analysis.offerStructure.frontend}</div>
                         </div>
                         <div className="flex gap-3">
                             <div className="min-w-[80px] text-orange-500 font-bold uppercase text-xs mt-0.5">Core Offer</div>
                             <div className="text-white font-medium">{analysis.offerStructure.core_offer}</div>
                         </div>
                         <div className="flex gap-3">
                             <div className="min-w-[80px] text-gray-500 uppercase text-xs mt-0.5">Backend</div>
                             <div className="text-gray-300">{analysis.offerStructure.backend}</div>
                         </div>
                          <div className="flex gap-3">
                             <div className="min-w-[80px] text-gray-500 uppercase text-xs mt-0.5">Continuity</div>
                             <div className="text-gray-300">{analysis.offerStructure.continuity}</div>
                         </div>
                     </div>
                </SpotlightCard>
            )}
        </div>
      )}

      {/* Personas */}
      <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(236, 72, 153, 0.2)">
        <div className="flex items-center gap-2 text-pink-500 mb-6">
          <Users className="w-5 h-5" />
          <span className="text-sm font-mono font-bold tracking-wider">TARGET PERSONAS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.userPersonas?.map((persona, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.05]">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h4 className="font-bold text-white text-lg mb-1">{persona.role}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    persona.willingness_to_pay === 'High' ? 'bg-green-500/20 text-green-400' : 
                    persona.willingness_to_pay === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {persona.willingness_to_pay} Willingness
                  </span>
                </div>
                <div className="space-y-2 mt-auto">
                  {persona.pain_points.map((point, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Channels */}
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(59, 130, 246, 0.2)">
          <div className="flex items-center gap-2 text-blue-500 mb-4">
            <Megaphone className="w-5 h-5" />
            <span className="text-sm font-mono font-bold tracking-wider">GROWTH CHANNELS</span>
          </div>
          <div className="space-y-3">
            {analysis.marketingChannels?.map((channel, i) => (
              <div key={i} className="group p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-white">{channel.channel}</h4>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, stars) => (
                      <div key={stars} className={`w-1.5 h-1.5 rounded-full ${
                        (channel.effectiveness === 'High' && stars < 3) ||
                        (channel.effectiveness === 'Medium' && stars < 2) ||
                        (channel.effectiveness === 'Low' && stars < 1)
                          ? 'bg-blue-500' 
                          : 'bg-gray-700'
                      }`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400">{channel.strategy}</p>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Revenue Models */}
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(16, 185, 129, 0.2)">
          <div className="flex items-center gap-2 text-emerald-500 mb-4">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-mono font-bold tracking-wider">MONETIZATION</span>
          </div>
          <div className="space-y-4">
            {analysis.revenueStreams?.map((stream, i) => (
              <div key={i} className="relative p-4 rounded-xl bg-emerald-900/10 border border-emerald-500/20 overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-white mb-1">{stream.model}</h4>
                  <p className="text-xs text-emerald-200/70 mb-3">{stream.pricing_strategy}</p>
                  {stream.estimated_ltv_usd && (
                    <div className="inline-flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded text-emerald-400 text-xs font-mono font-bold">
                      <span>LTV:</span>
                      <span>${stream.estimated_ltv_usd}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -right-4 -bottom-4 text-emerald-500/10">
                  <DollarSign className="w-24 h-24" />
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
