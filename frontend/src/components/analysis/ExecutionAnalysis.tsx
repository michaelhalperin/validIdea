import { Code, TrendingUp, Layers, Clock } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import CountUp from '../ui/CountUp';
import type { Analysis } from '../../types';

interface ExecutionAnalysisProps {
  analysis: Analysis;
}

export default function ExecutionAnalysis({ analysis }: ExecutionAnalysisProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(255, 208, 41, 0.2)">
          <div className="flex items-center gap-2 text-[#FFD029] mb-6">
            <Code className="w-5 h-5" />
            <span className="text-sm font-mono font-bold tracking-wider">TECH STACK</span>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-gray-400">Complexity Score</span>
              <span className="text-xl font-bold text-[#FFD029]">{analysis.technicalFeasibility?.complexity_rating}/10</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FFD029]" 
                style={{ width: `${(analysis.technicalFeasibility?.complexity_rating || 0) * 10}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.technicalFeasibility?.stack?.map((tech, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-white/[0.05] text-xs text-gray-300 border border-white/[0.05]">
                {tech}
              </span>
            ))}
          </div>
        </SpotlightCard>

        {/* Costs */}
        <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(16, 185, 129, 0.2)">
          <div className="flex items-center gap-2 text-emerald-500 mb-6">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-mono font-bold tracking-wider">FINANCIALS</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Development Cost</div>
              <div className="text-3xl font-mono font-bold text-white">
                <CountUp value={analysis.costEstimate?.dev_cost_usd || 0} prefix="$" />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">Year 1 Marketing</div>
              <div className="text-3xl font-mono font-bold text-white">
                <CountUp value={analysis.costEstimate?.marketing_first_year_usd || 0} prefix="$" />
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Roadmap */}
      <SpotlightCard className="p-6 bg-white/[0.02] backdrop-blur-lg border-white/10" spotlightColor="rgba(99, 102, 241, 0.2)">
        <div className="flex items-center gap-2 text-[#6366F1] mb-8">
          <Layers className="w-5 h-5" />
          <span className="text-sm font-mono font-bold tracking-wider">EXECUTION ROADMAP</span>
        </div>
        
        <div className="relative border-l border-white/10 ml-3 space-y-8 pb-2">
          {analysis.roadmap?.map((phase, i) => (
            <div key={i} className="relative pl-8">
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#6366F1] ring-4 ring-black" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h4 className="text-lg font-bold text-white">{phase.phase}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full w-fit">
                  <Clock className="w-3 h-3" />
                  {phase.duration_months} Months
                </div>
              </div>
              <ul className="space-y-2 mt-3">
                {phase.goals.map((goal, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
}
