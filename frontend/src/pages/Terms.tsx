import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Scale,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-400 mb-12">Last updated: November 26, 2025</p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-[#5D5FEF]">
                <Scale className="w-6 h-6" />
                <h3 className="font-bold text-white">Agreement to Terms</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                By accessing or using ValidIdea, you agree to be bound by
                these Terms and Conditions and our Privacy Policy. If you
                disagree with any part of the terms, you may not access the
                service.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-4 text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-bold text-white">Intellectual Property</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The service and its original content, features, and
                functionality are owned by ValidIdea. Your submitted ideas
                and data remain your intellectual property.
              </p>
            </div>
          </div>

          <div className="space-y-12 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-mono">
                  01
                </span>
                User Accounts
              </h2>
              <div className="pl-11 space-y-4 text-gray-400">
                <p>
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. Failure to do so constitutes a breach of the Terms,
                  which may result in immediate termination of your account on
                  our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use
                  to access the Service and for any activities or actions under
                  your password, whether your password is with our Service or a
                  third-party service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-mono">
                  02
                </span>
                AI Analysis Disclaimer
              </h2>
              <div className="pl-11 space-y-4 text-gray-400">
                <p>
                  Our Service uses Artificial Intelligence (AI) to generate
                  analysis and insights. While we strive for accuracy,
                  AI-generated content may contain errors, inaccuracies, or
                  biases. You should not rely solely on this information for
                  making business or financial decisions.
                </p>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>
                    ValidIdea does not provide financial, legal, or
                    professional advice. All analysis is for informational
                    purposes only.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-mono">
                  03
                </span>
                Subscription & Payments
              </h2>
              <div className="pl-11 space-y-4 text-gray-400">
                <p>
                  Some parts of the Service are billed on a subscription basis
                  ("Subscription(s)"). You will be billed in advance on a
                  recurring and periodic basis ("Billing Cycle"). Billing cycles
                  are set either on a monthly or annual basis, depending on the
                  type of subscription plan you select when purchasing a
                  Subscription.
                </p>
                <p>
                  At the end of each Billing Cycle, your Subscription will
                  automatically renew under the exact same conditions unless you
                  cancel it or ValidIdea cancels it.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-mono">
                  04
                </span>
                Termination
              </h2>
              <div className="pl-11 space-y-4 text-gray-400">
                <p>
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will
                  immediately cease. If you wish to terminate your account, you
                  may simply discontinue using the Service or delete your
                  account through the settings page.
                </p>
              </div>
            </section>

            <section className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:{" "}
                <a
                  href="mailto:legal@ValidIdea.com"
                  className="text-[#5D5FEF] hover:text-[#4B4ACF]"
                >
                  legal@ValidIdea.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
