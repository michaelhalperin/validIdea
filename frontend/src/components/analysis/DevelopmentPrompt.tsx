import { useState } from 'react';
import { Copy, Check, Terminal, Code, FileCode, Info } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import type { Analysis, Idea } from '../../types';

interface DevelopmentPromptProps {
  analysis: Analysis;
  idea: Idea;
}

export default function DevelopmentPrompt({ analysis, idea }: DevelopmentPromptProps) {
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const features = analysis.roadmap?.map(phase => 
      `- ${phase.phase}: ${phase.goals.join(', ')}`
    ).join('\n') || '';
    const personas = analysis.userPersonas?.map(p => p.role).join(', ') || 'General Users';
    
    return `You are an expert Full Stack Developer and AI Coding Assistant. 
Your goal is to build a complete, production-ready MVP for a new startup idea.

## Project: ${idea.title}
**One-Liner:** ${idea.oneLiner}
**Description:** ${idea.description}

## Technical Stack
Please use the following technology stack:
${analysis.technicalFeasibility?.stack?.map(s => `- ${s}`).join('\n')}

## Target Audience
Primary Users: ${personas}
User Pain Points:
${analysis.userPersonas?.flatMap(p => p.pain_points).map(pp => `- ${pp}`).join('\n')}

## Core Features & Roadmap
The project should be built in phases:
${features}

## Design System & UI/UX
- Modern, clean, and responsive design
- Mobile-first approach
- Use a consistent color palette and typography
- Components should be modular and reusable

## Development Guidelines
1. **Code Quality:** Write clean, maintainable, and type-safe code (TypeScript).
2. **Project Structure:** Use a standard, scalable folder structure.
3. **Error Handling:** Implement robust error handling and user feedback.
4. **Documentation:** Add comments and a README for setup instructions.
5. **Testing:** (Optional) Include basic unit tests for critical functions.

## Deliverables
1. Complete source code for the MVP.
2. Instructions to run the project locally.
3. A "Demo" walkthrough of the core user flow.

Please start by scaffolding the project structure and setting up the core dependencies. Then, proceed phase by phase according to the roadmap.`;
  };

  const promptText = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-blue-400" />
            AI Development Prompt
          </h2>
          <p className="text-gray-400 mt-1">
            Generate a production-ready MVP using this optimized prompt.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copied ? 'Copied to Clipboard' : 'Copy Prompt'}
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Instructions */}
        <SpotlightCard className="p-6 bg-white/[0.02] border-white/10" spotlightColor="rgba(168, 85, 247, 0.2)">
          <div className="flex items-center gap-3 text-purple-400 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-mono tracking-wider text-sm">HOW TO USE</h3>
          </div>
          <ol className="space-y-3 text-sm text-gray-400 list-decimal pl-4 marker:text-purple-500">
            <li><span className="text-white">Copy the prompt</span> using the button above.</li>
            <li>Open <span className="text-white">Cursor</span>, Windsurf, or your AI editor.</li>
            <li>Start a new <span className="text-white">Composer (Cmd+I)</span> session.</li>
            <li>Paste the prompt and watch it build.</li>
          </ol>
        </SpotlightCard>

        {/* Tech Stack Summary */}
        <SpotlightCard className="p-6 bg-white/[0.02] border-white/10" spotlightColor="rgba(59, 130, 246, 0.2)">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-mono tracking-wider text-sm">RECOMMENDED SETUP</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
              <div className="text-xs text-gray-500 mb-1">Primary Stack</div>
              <div className="text-sm font-medium text-white break-words leading-tight">{analysis.technicalFeasibility?.stack?.[0] || 'React'}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 mb-1">Language</div>
              <div className="text-sm font-medium text-white">TypeScript</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 mb-1">Est. Timeline</div>
              <div className="text-sm font-medium text-white">{analysis.technicalFeasibility?.estimated_dev_months || 1} months</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-gray-500 mb-1">Complexity</div>
              <div className="text-sm font-medium text-white">{analysis.technicalFeasibility?.complexity_rating || 5}/10</div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Main Prompt Terminal */}
      <SpotlightCard className="p-0 bg-[#1E1E1E] border-white/10 overflow-hidden flex flex-col shadow-2xl" spotlightColor="rgba(59, 130, 246, 0.1)">
        <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <Info className="w-3 h-3" />
              cursor_prompt.md
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">Markdown</div>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap custom-scrollbar selection:bg-blue-500/30">
            {promptText}
          </pre>
        </div>
      </SpotlightCard>
    </div>
  );
}