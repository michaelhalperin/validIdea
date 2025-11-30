import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, CheckSquare } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'problem' | 'solution' | 'market' | 'business' | 'execution';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  resources?: Array<{ title: string; url: string }>;
}

interface ValidationChecklistProps {
  ideaId: string;
}

const categoryLabels = {
  problem: 'Problem Validation',
  solution: 'Solution Validation',
  market: 'Market Validation',
  business: 'Business Validation',
  execution: 'Execution Validation',
};

const priorityColors = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-blue-400',
};

export default function ValidationChecklist({ ideaId }: ValidationChecklistProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['problem', 'solution'])
  );

  const { data: checklist, isLoading } = useQuery<ChecklistItem[]>({
    queryKey: ['validation-checklist', ideaId],
    queryFn: async () => {
      const response = await api.get(`/validation-checklist/${ideaId}`);
      return response.data.checklist;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, completed }: { itemId: string; completed: boolean }) => {
      await api.patch(`/validation-checklist/${ideaId}/${itemId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validation-checklist', ideaId] });
      toast.success('Checklist updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update checklist');
    },
  });

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleItem = (item: ChecklistItem) => {
    updateMutation.mutate({ itemId: item.id, completed: !item.completed });
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#1A1A1A] rounded w-1/3" />
          <div className="h-4 bg-[#1A1A1A] rounded w-full" />
          <div className="h-4 bg-[#1A1A1A] rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!checklist || checklist.length === 0) {
    return null;
  }

  const groupedByCategory = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-[#6366F1]" />
          <h3 className="text-lg font-semibold">Validation Checklist</h3>
        </div>
        <div className="text-sm text-gray-400">
          {completedCount} / {totalCount} completed
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedByCategory).map(([category, items]) => {
          const categoryCompleted = items.filter((item) => item.completed).length;
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="border border-white/5 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 bg-[#1A1A1A] flex items-center justify-between hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({categoryCompleted}/{items.length})
                  </span>
                </div>
                <div
                  className={`transform transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-[#0F0F0F] rounded-lg hover:bg-[#151515] transition-colors"
                    >
                      <button
                        onClick={() => toggleItem(item)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <span
                            className={`text-xs font-medium ${priorityColors[item.priority]}`}
                          >
                            {item.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                        {item.resources && item.resources.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#6366F1] hover:underline"
                              >
                                {resource.title} →
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

