"use client";

/**
 * NodiWatch AI Chatbot
 * =====================
 * Floating chatbot widget that appears on all pages.
 * Powered by Gemini AI with specialized environmental knowledge.
 * Page-aware: injects current page context into each query.
 */

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Loader2,
  HelpCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { suggestedQuestions } from "@/lib/gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Per-page context descriptions fed to the AI
const PAGE_CONTEXT: Record<string, { name: string; description: string }> = {
  "/": {
    name: "Dashboard",
    description:
      "The main NodiWatch dashboard. Shows aggregate stats: 1,400+ rivers monitored, 47 active pollution hotspots, factories tracked, violations detected, population at risk. Features a live Leaflet map with pollution/encroachment/erosion overlays, a satellite comparison section with before/after imagery for pollution, encroachment, and erosion (2016-2026), and an AI technology overview.",
  },
  "/pollution": {
    name: "Pollution Monitor",
    description:
      "The river pollution monitoring page. Shows NDTI spectral index analysis, factory attribution with Bayesian models, live Buriganga/Dhaka river pollution map, and before/after comparison slider. Tracks tannery (chromium/sulfide), textile (dye), thermal, and chemical discharge. Users can see pollution hotspot locations, severity, and factory IDs.",
  },
  "/encroachment": {
    name: "Encroachment Monitor",
    description:
      "The river encroachment monitoring page. Uses MNDWI (Modified Normalized Difference Water Index) to detect illegal land filling and boundary violations. Shows 10-year comparison (2016-2026), area lost in kmÂ², and satellite evidence for Turag river and other encroached rivers.",
  },
  "/erosion": {
    name: "Erosion Monitor",
    description:
      "The riverbank erosion monitoring page. Uses Sentinel-1 SAR (Synthetic Aperture Radar) coherence analysis for cloud-penetrating monitoring. Shows retreat rates in m/yr, erosion corridors on Jamuna/Padma rivers, early warning alerts for communities, and displacement estimates.",
  },
  "/evidence": {
    name: "Evidence Submission",
    description:
      "The citizen ground-truth reporting platform. Users can drag-drop or upload multiple photos of environmental violations (pollution/encroachment/erosion). GPS location is auto-captured. Gemini Vision AI analyzes each image to classify threat type, severity (low/medium/high/critical), and generates a formal enforcement report for DoE/NRCC. Recent community submissions are visible in a gallery.",
  },
  "/analysis": {
    name: "Trend Analysis",
    description:
      "Historical trend analysis page showing 10-year data (2016-2026) for Bangladesh river health. Includes charts for pollution severity trends, encroachment area growth over time, erosion retreat rate progression, and year-by-year comparison across all monitored rivers.",
  },
  "/datasets": {
    name: "Datasets",
    description:
      "The data sources page listing all satellite and ground datasets used by NodiWatch: Sentinel-2 (10m optical, multispectral), Sentinel-1 SAR (C-band radar, erosion), Landsat 8/9 (30m, long-term archive), Google Earth Engine (cloud processing), Bangladesh government river databases.",
  },
  "/about": {
    name: "About NodiWatch",
    description:
      "About page for NodiWatch - Eco-Tech Hackathon 2026 project by Team AlphaVerse. Team: Ahmmad Nur Swapnil (AI/ML Lead - Spectral Index & Random Forest), Tamim Hasan Saad (Full-Stack Dev - Next.js/PostGIS), Ekramul Haque Amin (Backend + SAR signal processing), Habiba Rafique (AI/ML + database), Sonia Khatun (Full-Stack Dev, UI). Shows system architecture diagram, tech stack, and mission.",
  },
};

export default function AIChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Assalamu-'Alaikum! ðŸ‘‹ I'm NodiWatch AI, your environmental monitoring assistant. I can help you understand river pollution, encroachment, and erosion in Bangladesh. What would you like to know? May Allah guide us in protecting His creation.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const currentPage = PAGE_CONTEXT[pathname] || {
    name: "NodiWatch",
    description:
      "A NodiWatch page for Bangladesh river environmental monitoring.",
  };

  const buildPageContext = () =>
    `User is currently viewing: "${currentPage.name}" (URL: ${pathname}). ` +
    `Page content: ${currentPage.description}. ` +
    `If the user asks about something on a DIFFERENT page, mention that page's name and suggest navigating there. ` +
    `Available pages: Dashboard (/), Pollution Monitor (/pollution), Encroachment Monitor (/encroachment), ` +
    `Erosion Monitor (/erosion), Evidence Submission (/evidence), Trend Analysis (/analysis), Datasets (/datasets), About (/about).`;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages
            .filter((m) => m.id !== "1")
            .slice(-8)
            .map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              content: m.content,
            })),
          pageContext: buildPageContext(),
          currentPage: pathname,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const panelWidth = isExpanded ? "w-[600px]" : "w-[460px]";
  const messagesHeight = isExpanded ? "h-[520px]" : "h-[380px]";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-slate-700 hover:bg-slate-600 rotate-0"
            : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 animate-pulse"
        }`}
        aria-label={isOpen ? "Close chat" : "Open AI assistant"}
      >
        {isOpen ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 ${panelWidth} max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-fadeIn transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">NodiWatch AI</h3>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  {currentPage.name} Â· Page-aware
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label={isExpanded ? "Shrink chat" : "Expand chat"}
                title={isExpanded ? "Shrink" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Page context indicator */}
          <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-700/40 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-[11px] text-slate-400">
              Viewing:{" "}
              <span className="text-teal-400 font-medium">
                {currentPage.name}
              </span>{" "}
              â€” Ask anything about this page or navigate to another
            </span>
          </div>

          {/* Messages */}
          <div
            className={`${messagesHeight} overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 transition-all duration-300`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-600"
                      : "bg-gradient-to-br from-teal-500 to-blue-500"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-slate-800 text-slate-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-[10px] mt-1.5 opacity-40">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <HelpCircle className="w-3 h-3" />
                <span>Suggested questions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-800 text-teal-400 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-teal-500/40"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${currentPage.name.toLowerCase()}...`}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-400 hover:to-blue-400 transition-all"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              Powered by Gemini AI Â· Context-aware Â· NodiWatch v2.0
            </p>
          </div>
        </div>
      )}
    </>
  );
}
