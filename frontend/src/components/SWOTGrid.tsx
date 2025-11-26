import { CheckCircle2, AlertTriangle, Zap, Ban } from 'lucide-react';

interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface SWOTGridProps {
  data: SWOTData;
}

export default function SWOTGrid({ data }: SWOTGridProps) {
  const sections = [
    {
      title: 'Strengths',
      items: data.strengths,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20'
    },
    {
      title: 'Weaknesses',
      items: data.weaknesses,
      icon: Ban,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/20'
    },
    {
      title: 'Opportunities',
      items: data.opportunities,
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20'
    },
    {
      title: 'Threats',
      items: data.threats,
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20'
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {sections.map((section) => (
        <div
          key={section.title}
          className={`p-6 rounded-2xl border ${section.border} ${section.bg} backdrop-blur-sm transition-transform hover:-translate-y-1`}
        >
          <div className="flex items-center gap-3 mb-4">
            <section.icon className={`w-6 h-6 ${section.color}`} />
            <h3 className="text-xl font-bold text-white">{section.title}</h3>
          </div>
          <ul className="space-y-3">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${section.color} flex-shrink-0`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
