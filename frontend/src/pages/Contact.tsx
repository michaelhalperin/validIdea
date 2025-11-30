import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { useSEO } from "../hooks/useSEO";

export default function Contact() {
  useSEO({
    title: "Contact Us — ValidIdea",
    description: "Get in touch with the ValidIdea team. We're here to help you validate your startup ideas.",
    url: "/contact",
  });
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/contact', formData);

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-gray-400 text-lg mb-8">
              Have questions about ValidIdea? We're here to help. Fill out
              the form or reach us via email.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-3 rounded-xl bg-[#5D5FEF]/10 text-[#5D5FEF]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Email Us</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    For general inquiries and support
                  </p>
                  <a
                    href="mailto:support@ValidIdea.com"
                    className="text-[#5D5FEF] hover:text-[#4B4ACF] transition-colors"
                  >
                    support@ValidIdea.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Feedback</h3>
                  <p className="text-gray-400 text-sm">
                    We value your feedback! Let us know how we can improve your
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#080808] border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-modern w-full"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-modern w-full"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="input-modern w-full"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="input-modern w-full resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
