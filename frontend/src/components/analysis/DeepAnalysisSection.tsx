import { Users, Megaphone, DollarSign, BookOpen, TrendingUp, Search, ArrowRight } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis } from '../../types';

interface DeepAnalysisSectionProps {
  analysis: Analysis;
}

export default function DeepAnalysisSection({ analysis }: DeepAnalysisSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            <BookOpen className="w-6 h-6" />
          </div>
          Deep Dive Analysis
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
      </div>
      
      {/* Personas & Marketing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Personas */}
        <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(236, 72, 153, 0.2)">
           <div className="flex items-center gap-5 mb-8">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center text-pink-500 ring-1 ring-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
               <Users className="w-7 h-7" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white tracking-tight">Target Personas</h3>
               <p className="text-sm text-gray-400 mt-1">Ideal customer profiles</p>
             </div>
           </div>
           <div className="space-y-4">
             {analysis.userPersonas?.map((persona, i) => (
               <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors group">
                 <div className="flex justify-between items-start mb-3">
                   <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors">{persona.role}</h4>
                   <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
                     persona.willingness_to_pay === 'High' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                     persona.willingness_to_pay === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                   }`}>
                     {persona.willingness_to_pay} WTP
                   </span>
                 </div>
                 <ul className="space-y-2">
                   {persona.pain_points.map((point, j) => (
                     <li key={j} className="text-sm text-gray-400 flex items-start gap-2.5">
                       <div className="w-1 h-1 rounded-full bg-pink-500 mt-2 flex-shrink-0 opacity-60" />
                       {point}
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
           </div>
        </SpotlightCard>

        {/* Marketing Channels */}
        <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(59, 130, 246, 0.2)">
           <div className="flex items-center gap-5 mb-8">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-blue-500 ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
               <Megaphone className="w-7 h-7" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Growth Channels</h3>
                <p className="text-sm text-gray-400 mt-1">Acquisition strategy</p>
             </div>
           </div>
           <div className="space-y-4">
             {analysis.marketingChannels?.map((channel, i) => (
               <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors group">
                 <div className="flex justify-between items-start mb-3">
                   <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{channel.channel}</h4>
                   <span className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
                     channel.effectiveness === 'High' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                     channel.effectiveness === 'Medium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                   }`}>
                     {channel.effectiveness} IMPACT
                   </span>
                 </div>
                 <p className="text-sm text-gray-400 leading-relaxed">{channel.strategy}</p>
               </div>
             ))}
           </div>
        </SpotlightCard>
      </div>

      {/* Revenue Streams - Full Width */}
      <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(16, 185, 129, 0.2)">
         <div className="flex items-center gap-5 mb-8">
           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
             <DollarSign className="w-7 h-7" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Monetization Strategy</h3>
              <p className="text-sm text-gray-400 mt-1">Revenue models & pricing</p>
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {analysis.revenueStreams?.map((stream, i) => (
             <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group hover:bg-white/[0.04] transition-all hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                 <DollarSign className="w-24 h-24 text-emerald-500" />
               </div>
               <h4 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{stream.model}</h4>
               <p className="text-sm text-gray-400 mb-6 min-h-[3rem] leading-relaxed">{stream.pricing_strategy}</p>
               {stream.estimated_ltv_usd && (
                 <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-mono font-bold text-emerald-400">
                      ${stream.estimated_ltv_usd}
                    </div>
                    <span className="text-xs text-gray-500 font-bold tracking-wider">EST. LTV</span>
                 </div>
               )}
             </div>
           ))}
         </div>
      </SpotlightCard>

      {/* Trends & Research - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(245, 158, 11, 0.2)">
             <div className="flex items-center gap-5 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center text-amber-500 ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                 <TrendingUp className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Market Signals</h3>
                  <p className="text-sm text-gray-400 mt-1">Trends & movements</p>
               </div>
             </div>
             <div className="space-y-4">
               {analysis.marketTrends?.map((trend, i) => (
                 <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                   <div className={`mt-1 text-xs font-bold px-2.5 py-1 rounded-md border ${
                     trend.direction === 'UP' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                     trend.direction === 'DOWN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                     'bg-gray-500/10 text-gray-400 border-gray-500/20'
                   }`}>
                     {trend.direction}
                   </div>
                   <div>
                     <h4 className="font-bold text-white mb-1">{trend.trend}</h4>
                     <p className="text-sm text-gray-400 leading-relaxed">{trend.impact}</p>
                   </div>
                 </div>
               ))}
             </div>
          </SpotlightCard>

          <SpotlightCard className="p-8 bg-[#080808]/80 backdrop-blur-xl" spotlightColor="rgba(139, 92, 246, 0.2)">
             <div className="flex items-center gap-5 mb-8">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center text-violet-500 ring-1 ring-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                 <Search className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Research Tasks</h3>
                  <p className="text-sm text-gray-400 mt-1">Validation & discovery</p>
               </div>
             </div>
             <div className="space-y-4">
               {analysis.deepResearch?.map((item, i) => (
                 <div key={i} className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors cursor-default">
                   <h4 className="font-bold text-white mb-2 flex items-center gap-2 group-hover:text-violet-400 transition-colors">
                     {item.topic}
                     {item.source_url && (
                       <a href={item.source_url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                         <ArrowRight className="w-4 h-4 text-violet-500" />
                       </a>
                     )}
                   </h4>
                   <p className="text-sm text-gray-400 leading-relaxed">{item.summary}</p>
                 </div>
               ))}
             </div>
          </SpotlightCard>
        </div>
    </div>
  );
}
