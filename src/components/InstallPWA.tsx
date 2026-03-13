"use client";

import { useEffect, useState } from "react";
import { HiOutlineDownload, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if the app isn't already installed
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-[100] md:left-auto md:right-8 md:w-80"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-5 backdrop-blur-xl shadow-2xl">
            {/* Blue Glow Effect */}
            <div className="absolute -right-4 -top-4 h-16 w-16 bg-blue-500/20 blur-2xl" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
            >
              <HiX />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <HiOutlineDownload className="text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Install ClipText AI</h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  Add to your home screen for faster access and a full-screen experience.
                </p>
                <button 
                  onClick={handleInstall}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors active:scale-95"
                >
                  Install Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}