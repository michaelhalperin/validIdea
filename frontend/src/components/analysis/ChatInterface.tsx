import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

interface ChatInterfaceProps {
  analysisId: string;
}

export default function ChatInterface({ analysisId }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['chat', analysisId],
    queryFn: async () => {
      const response = await api.get(`/chat/${analysisId}`);
      return response.data.messages;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (msg: string) => {
      const response = await api.post(`/chat/${analysisId}`, { message: msg });
      return response.data.messages;
    },
    onSuccess: (newMessages) => {
      queryClient.setQueryData(['chat', analysisId], newMessages);
      setMessage('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to send message');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMutation.isPending) return;
    sendMutation.mutate(message);
  };

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-[#6366F1]" />
        <h3 className="text-lg font-semibold">Ask About This Analysis</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-[#6366F1] animate-spin" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === 'USER' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'ASSISTANT' && (
                <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-[#6366F1]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'USER'
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-[#1A1A1A] text-gray-300'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'USER' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ask me anything about this analysis!</p>
            <p className="text-sm mt-2">Try: "What does the opportunity score mean?"</p>
          </div>
        )}
        {sendMutation.isPending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div className="bg-[#1A1A1A] rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#6366F1]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about this analysis..."
          className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg focus:outline-none focus:border-[#6366F1]"
          disabled={sendMutation.isPending}
        />
        <button
          type="submit"
          disabled={!message.trim() || sendMutation.isPending}
          className="px-4 py-2 bg-[#6366F1] rounded-lg hover:bg-[#5856EB] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

