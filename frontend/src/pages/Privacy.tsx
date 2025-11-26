import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Shield,
      title: "Data Collection",
      content:
        "We collect information you provide directly to us, including name, email address, and details about your business ideas. We also automatically collect certain information about your device and usage of our services.",
    },
    {
      icon: Lock,
      title: "Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your ideas remain your intellectual property.",
    },
    {
      icon: Eye,
      title: "Data Usage",
      content:
        "We use your information to provide, maintain, and improve our services, process your transactions, and communicate with you. We do not sell your personal data to third parties.",
    },
    {
      icon: Server,
      title: "Data Retention",
      content:
        "We retain your personal information only for as long as necessary to provide you with our services and as described in this Privacy Policy. You can request deletion of your account at any time.",
    },
  ];

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
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: November 26, 2025</p>

          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              At ValidIdea, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website and use our services.
              Please read this privacy policy carefully. If you do not agree
              with the terms of this privacy policy, please do not access the
              site.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#5D5FEF]/10 text-[#5D5FEF] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-8 text-gray-300 border-t border-white/10 pt-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information that you provide directly to us when you
                register for an account, create a profile, submit ideas for
                analysis, or communicate with us. This information may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Personal identifiers (name, email address)</li>
                <li>Account credentials</li>
                <li>Business ideas and analysis data</li>
                <li>
                  Payment information (processed securely by our payment
                  providers)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>
                  Send you technical notices, updates, and support messages
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Generate AI-powered analysis for your submitted ideas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                3. Contact Us
              </h2>
              <p>
                If you have questions or comments about this Privacy Policy,
                please contact us at:{" "}
                <a
                  href="mailto:privacy@ValidIdea.com"
                  className="text-[#5D5FEF] hover:text-[#4B4ACF]"
                >
                  privacy@ValidIdea.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
