import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Play, Eye, Clock, FileText, Trash2, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import type { Idea } from '../types';

export default function History() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const response = await api.get('/ideas');
      return response.data.ideas as Idea[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      setDeleteId(null);
    },
  });

  const filteredIdeas = data?.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.oneLiner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#5D5FEF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        Failed to load ideas
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Delete Analysis?</h3>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone. All associated data will be permanently removed.
                  </p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(deleteId)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">History</h1>
          <p className="text-gray-400">Manage your previous analyses</p>
        </div>
        <button
          onClick={() => navigate('/new-idea')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Analysis
        </button>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-modern pl-12"
        />
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 -mr-2">
        {filteredIdeas && filteredIdeas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-[#0A0A0A] rounded-3xl border border-white/5 border-dashed"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {searchTerm ? 'No ideas found' : 'No analyses yet'}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start your first analysis to see insights here. It takes less than a minute.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/new-idea')}
                className="btn-ghost"
              >
                Create Analysis
              </button>
            )}
          </motion.div>
        )}

        <div className="grid gap-4">
          {filteredIdeas?.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bento-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white truncate">
                  {idea.title}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  idea.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  idea.status === 'FAILED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                  {idea.status}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-1">{idea.oneLiner}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {new Date(idea.createdAt).toLocaleDateString()}
                </div>
                {idea.analyses && idea.analyses.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    {idea.analyses.length} runs
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => navigate(`/results/${idea.id}`)}
                disabled={idea.status !== 'COMPLETED'}
                className="flex-1 md:flex-none btn-ghost py-2 px-4 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              {idea.status === 'DRAFT' && (
                <button
                  onClick={async () => {
                    try {
                      await api.post(`/ideas/${idea.id}/generate`);
                      navigate(`/results/${idea.id}`);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="flex-1 md:flex-none btn-primary py-2 px-4 text-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
              )}
              <button
                onClick={() => setDeleteId(idea.id)}
                className="p-2.5 rounded-xl border border-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </div>
  );
}
