"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBookOpen, HiOutlineTrash, HiX, HiCheck, HiExclamation } from "react-icons/hi";
import api from "@/lib/axios";

export default function LibraryPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('all-blogs/');
        setBlogs(res.data);
      } catch (err) {
        setError("Failed to fetch your library. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const confirmDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.delete(`blogs/${id}/delete/`);
      setBlogs((prev) => prev.filter(blog => blog.id !== id));
      setDeletingId(null);
      setError(null);
    } catch (err) {
      setError("Delete failed. Please check your connection.");
      setDeletingId(null);
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white">
      <header className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Your Library</h2>
        <p className="text-sm sm:text-base text-zinc-500 mt-2">Manage and view your AI-generated articles.</p>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
              <HiExclamation className="text-xl shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 sm:h-48 rounded-3xl bg-zinc-900/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <motion.div
                  layout
                  key={blog.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="relative group h-full"
                >
                  <Link href={`/dashboard/library/${blog.id}`} className="block h-full">
                    <div className={`h-full relative p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
                      deletingId === blog.id 
                      ? 'bg-red-500/5 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                      : 'bg-zinc-900/30 border-white/5 hover:border-blue-500/30 hover:bg-zinc-900/50'
                    }`}>
                      
                      {/* Action Overlay */}
                      <div className="absolute top-4 right-4 z-20">
                        {deletingId === blog.id ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => confirmDelete(e, blog.id)}
                              aria-label="Confirm Delete"
                              title="Confirm Delete"
                              className="p-2.5 sm:p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg active:scale-95"
                            >
                              <HiCheck size={20} />
                            </button>
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingId(null); }}
                              aria-label="Cancel Delete"
                              title="Cancel Delete"
                              className="p-2.5 sm:p-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors active:scale-95"
                            >
                              <HiX size={20} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingId(blog.id); }}
                            aria-label="Delete Article"
                            title="Delete Article"
                            className={`
                              p-2.5 sm:p-2 rounded-xl transition-all z-20
                              /* Mobile: Visible and larger tap target */
                              relative bg-red-500/10 text-red-500 opacity-100
                              /* Desktop: Subtle hover state */
                              lg:opacity-0 lg:group-hover:opacity-100 lg:bg-transparent lg:text-zinc-500 lg:hover:text-red-500 lg:hover:bg-red-500/10
                            `}
                          >
                            <HiOutlineTrash size={20} />
                          </button>
                        )}
                      </div>

                      <div className="mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <HiOutlineBookOpen className="text-xl sm:text-2xl" />
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 pr-12">
                        {blog.youtube_title || "Untitled Article"}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-zinc-500 line-clamp-2 leading-relaxed italic">
                        {blog.generated_content}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 sm:py-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                <p className="text-sm sm:text-base text-zinc-500 italic px-4">Your library is empty. Go create something!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}