import type { ReactNode } from 'react';
import { Copy } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  children: ReactNode;
  onCopy?: () => void;
}

export default function AnalysisCard({ title, children, onCopy }: AnalysisCardProps) {
  return (
    <div className="glass-panel p-6 md:p-8 mb-8 relative group hover:border-primary-500/30 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-purple-500 rounded-full" />
          {title}
        </h2>
        {onCopy && (
          <button 
            onClick={onCopy}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy section"
          >
            <Copy className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
}
