import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Bell, Trash2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

interface MarketAlert {
  id: string;
  ideaId?: string;
  idea?: { id: string; title: string };
  alertType: string;
  keywords: string[];
  competitorNames: string[];
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export default function MarketAlerts() {
  const [showCreate, setShowCreate] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery<MarketAlert[]>({
    queryKey: ['market-alerts'],
    queryFn: async () => {
      const response = await api.get('/market-alerts');
      return response.data.alerts;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/market-alerts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-alerts'] });
      setShowCreate(false);
      toast.success('Market alert created!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create alert');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.patch(`/market-alerts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-alerts'] });
      toast.success('Alert updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/market-alerts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-alerts'] });
      toast.success('Alert deleted!');
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keywords = (formData.get('keywords') as string)
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const competitorNames = (formData.get('competitorNames') as string)
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    createMutation.mutate({
      alertType: formData.get('alertType'),
      keywords,
      competitorNames,
      ideaId: formData.get('ideaId') || undefined,
    });
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Market Alerts</h1>
            <p className="text-gray-400">
              Get notified about competitor launches, market changes, and industry news
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-6 py-3 bg-[#6366F1] rounded-lg hover:bg-[#5856EB] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Alert
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Market Alert</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alert Type</label>
                <select
                  name="alertType"
                  required
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg"
                >
                  <option value="COMPETITOR_LAUNCH">Competitor Launch</option>
                  <option value="MARKET_SIZE_CHANGE">Market Size Change</option>
                  <option value="SIMILAR_IDEA_LAUNCH">Similar Idea Launch</option>
                  <option value="INDUSTRY_NEWS">Industry News</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  placeholder="startup, SaaS, AI"
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Competitor Names (comma-separated)
                </label>
                <input
                  type="text"
                  name="competitorNames"
                  placeholder="Company A, Company B"
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 py-2 bg-[#6366F1] rounded-lg hover:bg-[#5856EB] disabled:opacity-50"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-2 bg-[#1A1A1A] rounded-lg hover:bg-[#252525]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin mx-auto" />
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-[#6366F1]" />
                      <h3 className="font-semibold">{alert.alertType.replace(/_/g, ' ')}</h3>
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            id: alert.id,
                            data: { isActive: !alert.isActive },
                          })
                        }
                        className="ml-4"
                      >
                        {alert.isActive ? (
                          <ToggleRight className="w-6 h-6 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {alert.idea && (
                      <p className="text-sm text-gray-400 mb-2">
                        Related to: {alert.idea.title}
                      </p>
                    )}
                    {alert.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {alert.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                    {alert.competitorNames.length > 0 && (
                      <div className="text-sm text-gray-400">
                        Monitoring: {alert.competitorNames.join(', ')}
                      </div>
                    )}
                    {alert.lastTriggered && (
                      <div className="text-xs text-gray-500 mt-2">
                        Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(alert.id)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No market alerts configured</p>
            <p className="text-sm text-gray-500 mt-2">
              Create an alert to get notified about market changes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

