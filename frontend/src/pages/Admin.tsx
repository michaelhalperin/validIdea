import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, FileText, Lightbulb, Activity, ShieldCheck, Database, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

export default function Admin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-usage'],
    queryFn: async () => {
      const response = await api.get('/admin/usage');
      return response.data;
    },
  });

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
        Failed to load admin data
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: data?.stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Active (30d)',
      value: data?.stats?.activeUsers || 0,
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Total Ideas',
      value: data?.stats?.totalIdeas || 0,
      icon: Lightbulb,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Analyses Run',
      value: data?.stats?.totalAnalyses || 0,
      icon: FileText,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#5D5FEF]/10 text-[#5D5FEF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">System Overview</h1>
        </div>
        <p className="text-gray-400">Real-time platform metrics and usage statistics.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bento-card p-6 flex flex-col justify-between h-32"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bento-card p-8"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#5D5FEF]" />
            Analysis Status
          </h3>
          <div className="space-y-4">
            {data?.ideasByStatus?.map((item: any) => (
              <div key={item.status} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'COMPLETED' ? 'bg-emerald-500' :
                    item.status === 'FAILED' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-300">{item.status}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bento-card p-8"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00D4FF]" />
            Top Users
          </h3>
          <div className="space-y-4">
            {data?.topUsersByCredits?.slice(0, 5).map((user: any, i: number) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono text-gray-400">
                    {i + 1}
                  </div>
                  <div className="text-sm text-gray-300 truncate max-w-[150px]" title={user.email}>
                    {user.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white">{user.creditsUsed} used</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bento-card p-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5D5FEF]/10 flex items-center justify-center text-[#5D5FEF]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Total Token Consumption</div>
            <div className="text-3xl font-mono font-bold text-white">
              {(data?.stats?.totalTokenUsage || 0).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="hidden sm:block h-16 w-px bg-white/10" />
        <div className="hidden sm:block text-right">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Est. Cost</div>
          <div className="text-xl font-mono text-gray-300">
            ${((data?.stats?.totalTokenUsage || 0) * 0.000002).toFixed(2)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
