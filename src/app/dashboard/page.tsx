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
    // 1. Frontend Validation
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
      // 2. Real API Call
      const response = await api.post('generate-blog/', { link: url });
      setResult(response.data.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to connect to AI server. Is Django running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">AI Blog Generator</h2>
        <p className="mt-2 text-zinc-500">Convert any YouTube video into a high-quality article instantly.</p>
      </header>

      {/* Input Section - Added Shake Animation on Error */}
      <motion.div 
        animate={error ? { x: [-2, 2, -2, 2, 0] } : {}}
        className={`relative group rounded-3xl border p-2 backdrop-blur-xl transition-all duration-300 ${
          error ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-zinc-900/50 focus-within:border-blue-500/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="url" 
            placeholder="Paste YouTube video link here..." 
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1 bg-transparent px-6 py-4 text-white outline-none placeholder:text-zinc-600"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-black hover:bg-zinc-200 disabled:opacity-50 transition-all active:scale-95"
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
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Section */}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-3xl border border-white/5 bg-zinc-900/30 p-10 shadow-2xl"
          >
            <div className="prose prose-invert max-w-none">
              <p className="uppercase tracking-[0.2em] text-[10px] text-blue-500 font-bold mb-6">Generated Content</p>
              <div className="text-zinc-300 leading-8 text-lg whitespace-pre-wrap">
                {result}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-zinc-800">
              <HiSparkles className="text-4xl" />
            </div>
            <p className="mt-4 text-zinc-600 italic font-light">No article generated yet. Enter a link above to start.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}