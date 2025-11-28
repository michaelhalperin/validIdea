import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

interface RecommendationsProps {
  ideaId: string;
}

interface SimilarIdea {
  ideaId: string;
  title: string;
  similarityScore: number;
  reason: string;
}

export default function Recommendations({ ideaId }: RecommendationsProps) {
  const { data: similar } = useQuery<SimilarIdea[]>({
    queryKey: ['recommendations', 'similar', ideaId],
    queryFn: async () => {
      const response = await api.get(`/recommendations/similar/${ideaId}`);
      return response.data.similarIdeas;
    },
  });

  const { data: improvements } = useQuery<string[]>({
    queryKey: ['recommendations', 'improvements', ideaId],
    queryFn: async () => {
      const response = await api.get(`/recommendations/improvements/${ideaId}`);
      return response.data.suggestions;
    },
  });

  return (
    <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
      {/* Similar Ideas */}
      {similar && similar.length > 0 && (
        <div className="bg-[#0A0A0A] rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#6366F1]" />
            <h3 className="text-sm font-semibold">Similar Ideas</h3>
          </div>
          <div className="space-y-2">
            {similar.map((idea) => (
              <Link
                key={idea.ideaId}
                to={`/results/${idea.ideaId}`}
                className="block p-2 bg-[#1A1A1A] rounded-lg hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-xs line-clamp-1">{idea.title}</h4>
                  <span className="text-xs text-[#6366F1] flex-shrink-0 ml-2">
                    {idea.similarityScore}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{idea.reason}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {improvements && improvements.length > 0 && (
        <div className="bg-[#0A0A0A] rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-semibold">Improvements</h3>
          </div>
          <div className="space-y-2">
            {improvements.map((suggestion, index) => (
              <div
                key={index}
                className="flex gap-2 p-2 bg-[#1A1A1A] rounded-lg"
              >
                <AlertCircle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!similar || similar.length === 0) && (!improvements || improvements.length === 0) && (
        <div className="bg-[#0A0A0A] rounded-xl border border-white/10 p-4 text-center text-gray-500">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-xs">No recommendations</p>
        </div>
      )}
    </div>
  );
}

