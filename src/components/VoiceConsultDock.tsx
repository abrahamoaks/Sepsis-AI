import React from "react";
import { Sparkles, Mic, Volume2, ShieldCheck, ChevronRight } from "lucide-react";

interface VoiceConsultDockProps {
  onOpenAssistant: (initialQuery?: string) => void;
  onStartVoice: () => void;
  isListening?: boolean;
}

export const VoiceConsultDock: React.FC<VoiceConsultDockProps> = ({
  onOpenAssistant,
  onStartVoice,
  isListening
}) => {
  return (
    <aside aria-label="Clinical AI Voice Dock" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[94%] sm:w-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 sm:gap-4 transition-all hover:border-teal-500/60">
        {/* Left: Brand Icon & Clinical Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-100" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-slate-900 animate-pulse" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span>Ask Chempions AI</span>
              <span className="text-[10px] text-teal-300 font-normal">| Bedside Reasoner</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Voice & text clinical decision support
            </p>
          </div>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Voice Mic Button */}
          <button
            onClick={onStartVoice}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isListening
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
            title="Start voice clinical consultation"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isListening ? "Listening..." : "Voice Consult"}</span>
          </button>

          {/* Direct Text / Ask Assistant Button */}
          <button
            onClick={() => onOpenAssistant()}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
          >
            <span>Ask Protocol</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
