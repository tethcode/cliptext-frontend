"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi";
import api from "@/lib/axios";

export default function GeneratorPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!url) {
      setError("Please paste a YouTube link first.");
      return;
    }
    if (!url.includes("youtube.com/") && !url.includes("youtu.be/")) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      const response = await api.post('generate-blog/', { link: url });
      setResult(response.data.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to connect to AI server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl w-full px-1">
      <header className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Blog Generator</h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-500">Convert any YouTube video into an article instantly.</p>
      </header>

      <motion.div 
        animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
        className={`relative group rounded-2xl sm:rounded-3xl border p-1.5 sm:p-2 backdrop-blur-xl transition-all duration-300 ${
          error ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-zinc-900/50 focus-within:border-blue-500/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="url" 
            placeholder="Paste link here..." 
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            // Added text-base for mobile zoom prevention
            className="flex-1 bg-transparent px-4 sm:px-6 py-3 sm:py-4 text-base text-white outline-none placeholder:text-zinc-600 w-full"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white px-6 sm:px-8 py-3 sm:py-4 font-bold text-black hover:bg-zinc-200 disabled:opacity-50 transition-all active:scale-95 w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <>
                <HiSparkles className="text-xl" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4">
            <div className="flex items-start sm:items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
              <div className="h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse mt-1.5 sm:mt-0" />
              <p className="text-sm font-medium break-words">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl border border-white/5 bg-zinc-900/30 p-6 sm:p-10 shadow-2xl overflow-hidden"
          >
            <div className="prose prose-invert max-w-none">
              <p className="uppercase tracking-[0.2em] text-[10px] text-blue-500 font-bold mb-4 sm:mb-6">Generated Content</p>
              <div className="text-zinc-300 leading-7 sm:leading-8 text-base sm:text-lg whitespace-pre-wrap break-words">
                {result}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 sm:mt-20 text-center">
            <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/5 text-zinc-800">
              <HiSparkles className="text-3xl sm:text-4xl" />
            </div>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 italic font-light">No article generated yet.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}