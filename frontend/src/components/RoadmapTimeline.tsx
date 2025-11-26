import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface RoadmapPhase {
  phase: string;
  goals: string[];
  duration_months: number;
}

interface RoadmapTimelineProps {
  phases: RoadmapPhase[];
}

export default function RoadmapTimeline({ phases }: RoadmapTimelineProps) {
  const colors = ['text-blue-400', 'text-purple-400', 'text-pink-400', 'text-indigo-400'];
  const bgs = ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400'];

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Vertical Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 hidden md:block" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 md:hidden" />

      <div className="space-y-12">
        {phases.map((phase, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} gap-8 md:gap-16 items-center`}
            >
              {/* Center Point */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 -translate-x-[9px] md:-translate-x-1/2 rounded-full bg-dark border-2 border-white/20 z-10 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${bgs[index % bgs.length]}`} />
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-8 md:pl-0">
                <div className="glass-panel p-6 relative group hover:border-white/20 transition-colors">
                  <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    <Calendar className="w-3 h-3" />
                    {phase.duration_months} Months
                  </div>

                  <div className={`text-4xl font-display font-bold mb-2 opacity-20 ${colors[index % colors.length]}`}>
                    0{index + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{phase.phase}</h3>
                  
                  <ul className="space-y-2">
                    {phase.goals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors[index % colors.length]}`} />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
