import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Link as LinkIcon,
  X,
  Loader2,
  ChevronLeft,
  Target,
  FileText,
  Search,
  Save,
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function IdeaForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  // Check credits only when trying to run analysis (not for saving drafts)

  const handleAddUrl = () => {
    if (currentUrl && !attachmentUrls.includes(currentUrl)) {
      setAttachmentUrls([...attachmentUrls, currentUrl]);
      setCurrentUrl("");
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      // Create Idea (status will be DRAFT by default - no credit consumed)
      const response = await api.post("/ideas", {
        title,
        oneLiner,
        description,
        attachmentUrls,
      });
      const ideaId = response.data.idea.id;

      toast.success(
        "Draft saved! You can run the analysis anytime without losing your work."
      );

      // Redirect to results page (which will show the "Run Analysis" button)
      navigate(`/results/${ideaId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to save draft");
      setSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    // Check credits before running analysis
    if (user && user.credits <= 0) {
      toast.error(
        "Daily limit reached. You can still save as draft and run analysis later when credits reset."
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Create Idea
      const response = await api.post("/ideas", {
        title,
        oneLiner,
        description,
        attachmentUrls,
      });
      const ideaId = response.data.idea.id;

      // 2. Trigger Analysis (this consumes a credit)
      await api.post(`/ideas/${ideaId}/generate`);

      // 3. Redirect
      navigate(`/results/${ideaId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to run analysis");
      setLoading(false);
    }
  };

  // Animation variants for step transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setStep(step + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Start New Analysis</h1>
        <p className="text-gray-400">
          Let AI deconstruct your idea and evaluate its potential.
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center max-w-xl mx-auto relative">
          {/* Progress Line Background */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />

          {/* Progress Line Active */}
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-[#6366F1] -z-10 transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />

          {/* Steps */}
          {[
            { num: 1, icon: Target, label: "Concept" },
            { num: 2, icon: FileText, label: "Details" },
            { num: 3, icon: Search, label: "Context" },
          ].map((s) => {
            const isActive = step >= s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className="flex flex-col items-center gap-2 bg-transparent px-2"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? "border-[#6366F1] bg-[#6366F1] text-white"
                      : "border-white/10 bg-[#0A0A0A] text-gray-500"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isCurrent ? "text-white" : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-transparent border border-white/5 rounded-3xl p-6 md:p-10 min-h-[400px] relative overflow-hidden shadow-2xl">
        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[100px] pointer-events-none" />

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  What's your idea called?
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Give it a working title. You can change this later.
                </p>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && title && oneLiner && nextStep()
                  }
                  className="w-full bg-transparent text-3xl md:text-4xl font-bold placeholder-white/10 border-b-2 border-white/10 focus:border-[#6366F1] outline-none py-4 transition-colors"
                  placeholder="Project Name"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  The Elevator Pitch
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Explain it in one sentence. What is it and who is it for?
                </p>
                <input
                  type="text"
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && title && oneLiner && nextStep()
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#6366F1]/50 outline-none transition-all text-lg"
                  placeholder="e.g. Airbnb for boat rentals in Miami"
                />
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={nextStep}
                  disabled={!title || !oneLiner}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Deep Dive</h2>
                <p className="text-sm text-gray-400 mb-6">
                  The more details you provide, the better the AI analysis.
                  Describe the problem, your solution, features, target
                  audience, and revenue model.
                </p>
                <textarea
                  autoFocus
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-[300px] bg-white/5 border border-white/10 rounded-xl p-6 focus:ring-2 focus:ring-[#6366F1]/50 outline-none transition-all resize-none text-base leading-relaxed"
                  placeholder="Detailed description..."
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={prevStep}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!description || description.length < 10}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 px-8 py-3"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Context & Attachments
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Add links to pitch decks, competitor websites, or inspiration
                  (optional).
                </p>

                <div className="flex gap-3 mb-6">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="url"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#6366F1]/50 outline-none transition-all"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    onClick={handleAddUrl}
                    disabled={!currentUrl}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 min-h-[100px]">
                  {attachmentUrls.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl h-[100px] text-gray-600">
                      <LinkIcon className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-sm">No links added yet</span>
                    </div>
                  )}
                  {attachmentUrls.map((url) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={url}
                      className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 text-sm text-white group"
                    >
                      <span className="truncate max-w-[250px]">{url}</span>
                      <button
                        onClick={() =>
                          setAttachmentUrls((urls) =>
                            urls.filter((u) => u !== url)
                          )
                        }
                        className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <button
                  onClick={prevStep}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-4 py-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveDraft}
                      disabled={loading || savingDraft}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {savingDraft ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Draft
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || savingDraft}
                      className="btn-primary w-48 flex items-center justify-center gap-2 py-3 text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Run Analysis"
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    💡 Save Draft doesn't use credits. Run Analysis consumes 1
                    credit.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
