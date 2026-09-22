import React, { useState } from "react";
import { Activity, ShieldCheck, Sparkles, Menu, X, ArrowRight, HeartPulse } from "lucide-react";

interface StartupNavbarProps {
  onOpenDemo: () => void;
  onOpenAssistant: () => void;
}

export const StartupNavbar: React.FC<StartupNavbarProps> = ({
  onOpenDemo,
  onOpenAssistant
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Chempions<span className="text-teal-700">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Pediatric Sepsis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Clinical Decision Support Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            <button
              onClick={() => scrollTo("problem")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              The Clinical Challenge
            </button>
            <button
              onClick={() => scrollTo("solution")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              What We Solve
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("evidence")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              Evidence & Guidelines
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="hover:text-teal-700 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenAssistant}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Ask AI Reasoner</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all hover:shadow cursor-pointer"
            >
              <span>Live CDS Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenDemo}
              className="px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => scrollTo("problem")}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 cursor-pointer"
          >
            The Clinical Challenge
          </button>
          <button
            onClick={() => scrollTo("solution")}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 cursor-pointer"
          >
            What We Solve
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("evidence")}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 cursor-pointer"
          >
            Evidence & Guidelines
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 cursor-pointer"
          >
            FAQ
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Ask AI Reasoner</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Live CDS Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
