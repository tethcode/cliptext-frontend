"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { HiOutlineExclamationCircle, HiOutlineCheckCircle } from "react-icons/hi";

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  // Auto-hide after 4 seconds to save the user from clicking
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
        type === 'error' 
          ? "bg-red-500/10 border-red-500/20 text-red-400" 
          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      }`}
    >
      {type === 'error' ? (
        <HiOutlineExclamationCircle className="text-xl flex-shrink-0" />
      ) : (
        <HiOutlineCheckCircle className="text-xl flex-shrink-0" />
      )}
      <span className="font-medium text-sm whitespace-nowrap">{message}</span>
      <div className="ml-4 pl-4 border-l border-white/10">
        <button 
          onClick={onClose} 
          className="text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}