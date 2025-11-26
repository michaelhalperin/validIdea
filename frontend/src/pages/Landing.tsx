import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Layers,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  Brain,
  Globe,
  CheckCircle2,
  Star,
  Plus,
  Minus,
  Code2,
  Database,
  Cloud,
} from "lucide-react";
import SpotlightCard from "../components/ui/SpotlightCard";
import CountUp from "../components/ui/CountUp";
import { useState } from "react";

const DemoCard = ({
  title,
  score,
  color,
  delay,
}: {
  title: string;
  score: number;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between mb-3 last:mb-0"
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center bg-opacity-20`}
      >
        <div
          className={`w-3 h-3 rounded-full ${color.replace(
            "bg-",
            "bg-opacity-100 "
          )}`}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <div className="h-1.5 w-24 bg-white/10 rounded-full mt-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${score}%` }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className={`h-full ${color.replace("bg-", "bg-")}`}
          />
        </div>
      </div>
    </div>
    <span className="text-lg font-bold font-mono text-white">{score}%</span>
  </motion.div>
);

const Step = ({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative flex flex-col items-start p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
  >
    <div className="text-4xl font-bold font-display text-white/5 absolute right-4 top-4">
      {number}
    </div>
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 flex items-center justify-center mb-4 border border-white/10">
      {number === "01" && <Brain className="w-6 h-6 text-[#8B5CF6]" />}
      {number === "02" && <Zap className="w-6 h-6 text-[#6366F1]" />}
      {number === "03" && <BarChart3 className="w-6 h-6 text-[#06B6D4]" />}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-white transition-colors"
      >
        <span className="text-lg font-medium text-gray-200">{question}</span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-[#6366F1]" />
        ) : (
          <Plus className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TestimonialCard = ({
  name,
  role,
  image,
  content,
}: {
  name: string;
  role: string;
  image: string;
  content: string;
}) => (
  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
    <div className="flex items-center gap-4 mb-4">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover border border-white/10"
      />
      <div>
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
    <div className="flex gap-1 mb-3">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">"{content}"</p>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      title: "Market Analysis",
      desc: "Real-time TAM/SAM/SOM calculations using live market data sources.",
      icon: Target,
      color: "text-[#6366F1]",
      bg: "bg-[#6366F1]/10",
      colSpan: "md:col-span-2",
    },
    {
      title: "Competitor Intel",
      desc: "Instant SWOT analysis of your top 5 competitors.",
      icon: ShieldCheck,
      color: "text-[#06B6D4]",
      bg: "bg-[#06B6D4]/10",
      colSpan: "md:col-span-1",
    },
    {
      title: "Tech Feasibility",
      desc: "Architecture recommendations & cost estimation.",
      icon: Layers,
      color: "text-[#EC4899]",
      bg: "bg-[#EC4899]/10",
      colSpan: "md:col-span-1",
    },
    {
      title: "Growth Strategy",
      desc: "Personalized go-to-market roadmap.",
      icon: TrendingUp,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
      colSpan: "md:col-span-2",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder @ FinFlow",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=faces",
      content:
        "I was about to spend $50k developing an app that the market didn't need. IdeaValidate saved me 6 months of work.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO @ BuildScale",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      content:
        "The technical feasibility report was spot on. It recommended the exact stack we ended up using for production.",
    },
    {
      name: "Emily Watson",
      role: "Indie Hacker",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
      content:
        "The best $20 I've ever spent. The competitor analysis alone found 3 rivals I hadn't even heard of.",
    },
  ];

  const faqs = [
    {
      question: "How accurate is the market data?",
      answer:
        "We aggregate data from multiple premium sources including Crunchbase, Statista, and Google Trends to provide real-time, highly accurate market estimations.",
    },
    {
      question: "Can I export the reports?",
      answer:
        "Yes! All reports can be exported as professional PDF documents, perfect for sharing with co-founders or potential investors.",
    },
    {
      question: "What technologies do you analyze?",
      answer:
        "Our engine covers the entire modern web and mobile stack, including cloud providers (AWS, GCP, Azure), frontend frameworks, and database solutions.",
    },
  ];

  return (
    <div className="relative bg-[#030303] text-white overflow-hidden selection:bg-[#6366F1] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#030303]/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-display font-bold text-xl tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo.svg" alt="ValidIdea Logo" className="h-16" />
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-[#6366F1]/20 rounded-full blur-[120px] mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#06B6D4]/15 rounded-full blur-[100px] mix-blend-screen"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            style={{ opacity }}
            className="pt-10 lg:pt-0 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-6 tracking-tighter"
            >
              Validate ideas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#6366F1] animate-gradient bg-[length:200%_auto]">
                in seconds.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
            >
              Stop building in the dark. Get an AI-powered feasibility report
              with market data, competitor analysis, and a roadmap—before you
              write a single line of code.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8"
            >
              <button
                onClick={() => navigate("/register")}
                className="btn-primary min-w-[200px] group h-12"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Free Analysis{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-medium hover:text-white hover:bg-white/5 transition-all h-12"
              >
                How it works
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center lg:justify-start gap-8 text-gray-500 grayscale opacity-60"
            >
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                <span>Free tier available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div style={{ y: heroY }} className="relative hidden lg:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/20 to-purple-500/20 rounded-full blur-3xl -z-10" />

            <div className="relative z-10 w-full max-w-md mx-auto">
              <motion.div
                initial={{ rotate: -6, y: 40, opacity: 0 }}
                animate={{ rotate: -3, y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-0 left-0 right-0 z-0 bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 h-[400px] transform scale-95 opacity-50"
              />
              <motion.div
                initial={{ rotate: 6, y: 20, opacity: 0 }}
                animate={{ rotate: 3, y: 10, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute top-4 left-2 right-2 z-10 bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 h-[400px] transform scale-95 opacity-70"
              />

              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative z-20 bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">SaaS Platform</h3>
                      <p className="text-xs text-gray-400">Analysis Score</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    92/100
                  </div>
                </div>

                <div className="space-y-2">
                  <DemoCard
                    title="Market Viability"
                    score={95}
                    color="bg-emerald-500"
                    delay={1}
                  />
                  <DemoCard
                    title="Technical Feasibility"
                    score={88}
                    color="bg-blue-500"
                    delay={1.2}
                  />
                  <DemoCard
                    title="Competition"
                    score={72}
                    color="bg-orange-500"
                    delay={1.4}
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                  <span>Generated in 2.4s</span>
                  <span>AI Model: Gemini Pro</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Strip */}
      <section className="border-y border-white/5 bg-white/[0.01] overflow-hidden py-8">
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <p className="text-center text-sm text-gray-500 uppercase tracking-widest">
            Powered by world-class intelligence
          </p>
        </div>
        <div className="flex gap-12 overflow-hidden relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap px-6"
          >
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex gap-12 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                {/* Mock Logos */}
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Cloud className="w-6 h-6" /> Google Cloud
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Brain className="w-6 h-6" /> OpenAI
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Database className="w-6 h-6" /> Supabase
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Code2 className="w-6 h-6" /> GitHub
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Zap className="w-6 h-6" /> Vercel
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Globe className="w-6 h-6" /> Crunchbase
                </div>

                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Cloud className="w-6 h-6" /> Google Cloud
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Brain className="w-6 h-6" /> OpenAI
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Database className="w-6 h-6" /> Supabase
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Code2 className="w-6 h-6" /> GitHub
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Zap className="w-6 h-6" /> Vercel
                </div>
                <div className="flex items-center gap-2 text-xl font-bold font-display">
                  <Globe className="w-6 h-6" /> Crunchbase
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-32 px-6 relative z-10 bg-[#030303]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From idea to blueprint
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Complex market analysis simplified into three steps. No MBA
              required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
            <Step
              number="01"
              title="Describe your idea"
              desc="Simply tell us what you want to build. The more details, the better the analysis."
            />
            <Step
              number="02"
              title="AI Deep Dive"
              desc="Our engines scour the web, analyze competitors, and compute technical requirements."
            />
            <Step
              number="03"
              title="Get the Roadmap"
              desc="Receive a comprehensive report with actionable steps, tech stack, and marketing strategy."
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-[#030303] to-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-2 text-[#6366F1] font-mono text-sm mb-4 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to validate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <SpotlightCard
                key={i}
                className={`p-8 group ${feature.colSpan || ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 ${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>

                <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-20 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                  <feature.icon className="w-32 h-32" />
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Ideas Analyzed", value: 12000, suffix: "+" },
              { label: "Data Points", value: 50, suffix: "M+" },
              { label: "Founders Helped", value: 8500, suffix: "+" },
              { label: "Success Rate", value: 94, suffix: "%" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold font-display text-white mb-2">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Founders</h2>
            <p className="text-gray-400">Don't just take our word for it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 relative bg-[#030303]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0A0A0A] to-[#030303]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6366F1]/10 rounded-full blur-[120px] mix-blend-screen" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-8 tracking-tight">
            Ready to build the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#EC4899]">
              next big thing?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of founders who are saving time and money by
            validating their ideas with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-xl shadow-white/10"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ValidIdea Logo" className="h-8" />
          </div>
          <div className="text-gray-500 text-xs flex gap-4">
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
          <div className="text-gray-600 text-xs">
            © {new Date().getFullYear()} ValidIdea. Crafted with ❤️ by{" "}
            <a
              href="https://portfolio-two-sigma-8ktq5rj0zc.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              MCD webs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
