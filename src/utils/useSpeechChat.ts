/**
 * Speech Recognition and Speech Synthesis Hook for Chempions AI Voice Chat
 */

import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API interface declarations
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export function useSpeechChat(options?: {
  onTranscriptComplete?: (transcript: string) => void;
  lang?: string;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    setSpeechError(null);
    setTranscript("");
    setInterimTranscript("");

    // Stop speaking if currently speaking
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please type your query.");
      setIsSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = options?.lang || "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalStr += res[0].transcript;
          } else {
            interimStr += res[0].transcript;
          }
        }

        if (interimStr) {
          setInterimTranscript(interimStr);
        }

        if (finalStr) {
          setTranscript(finalStr);
          setInterimTranscript("");
          if (options?.onTranscriptComplete) {
            options.onTranscriptComplete(finalStr.trim());
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setSpeechError("Microphone access denied. Please allow microphone permissions in your browser.");
        } else if (event.error === "no-speech") {
          setSpeechError("No speech detected. Please tap the mic and try again.");
        } else {
          setSpeechError(`Voice input issue: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      // Auto stop safety after 15 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // ignore
          }
        }
      }, 15000);
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      setSpeechError("Could not access microphone.");
      setIsListening(false);
    }
  }, [options]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  // Text to Speech
  const speakText = useCallback((rawText: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel existing speech
    window.speechSynthesis.cancel();

    // Clean up Markdown formatting for natural voice synthesis
    const cleanedText = rawText
      .replace(/###\s+/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[\d+(?:,\s*\d+)*\]/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[-*•]\s+/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .trim();

    if (!cleanedText) return;

    // Only speak the immediate action plan & questions if long, avoid citations
    const sections = cleanedText.split(/References/i);
    const textToSpeak = sections[0].trim();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 1.05; // slightly swift, professional clinical cadence
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSpeaking,
    speechError,
    isSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    resetTranscript: () => {
      setTranscript("");
      setInterimTranscript("");
      setSpeechError(null);
    }
  };
}
