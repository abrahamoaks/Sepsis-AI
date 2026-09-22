import React from "react";
import { HeartPulse, ShieldCheck, Mail, ArrowUp } from "lucide-react";

export const StartupFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4 text-teal-100" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Chempions<span className="text-teal-400">.ai</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Chempions AI delivers deterministic, explainable clinical intelligence for pediatric sepsis recognition, bedside scale-locked resuscitation dosing, and 1-hour golden window protocols.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Grounded in Surviving Sepsis Campaign 2026 & Phoenix Criteria</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#problem" className="hover:text-white transition-colors">
                  The Clinical Challenge
                </a>
              </li>
              <li>
                <a href="#solution" className="hover:text-white transition-colors">
                  What We Solve
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Interactive CDS Demo
                </a>
              </li>
              <li>
                <a href="#evidence" className="hover:text-white transition-colors">
                  Evidence Guidelines
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Clinical Rigor */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Clinical Rigor
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300">Age-Specific Norms</span>
              </li>
              <li>
                <span className="text-slate-300">Scale Weight Locks</span>
              </li>
              <li>
                <span className="text-slate-300">Golden Hour Bundle</span>
              </li>
              <li>
                <span className="text-slate-300">Serial Lactate Tracking</span>
              </li>
              <li>
                <span className="text-slate-300">Explainable Audit Trail</span>
              </li>
            </ul>
          </div>

          {/* Contact / Inquiries */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Clinical Partnerships
            </h4>
            <p className="text-slate-400 text-xs">
              Collaborate with pediatric intensive care teams, emergency medicine researchers, and healthcare systems.
            </p>
            <div className="pt-1">
              <a
                href="mailto:contact@chempions.ai"
                className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-bold"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>contact@chempions.ai</span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 max-w-2xl text-center sm:text-left leading-relaxed">
            <strong>Clinical Safety Notice:</strong> Chempions AI is an experimental clinical decision support software designed to augment, not replace, clinical evaluation by licensed physicians. Independent clinical judgment is required at all times.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 text-center sm:text-left text-[11px] text-slate-600">
          © {new Date().getFullYear()} Chempions AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
