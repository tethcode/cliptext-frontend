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

  // Fetch blogs on load
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

  // Handle Secure Deletion
  const confirmDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await api.delete(`blogs/${id}/delete/`);
      
      // Update local state (Optimistic UI)
      setBlogs((prev) => prev.filter(blog => blog.id !== id));
      setDeletingId(null);
      setError(null);
    } catch (err) {
      setError("Delete failed. Please check your connection.");
      setDeletingId(null);
      // Auto-hide error
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen text-white">
      {/* Header Area */}
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Your Library</h2>
        <p className="text-zinc-500 mt-2">Manage and view your AI-generated articles.</p>
      </header>

      {/* Inline Error Notification */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
              <HiExclamation className="text-xl" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-zinc-900/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <motion.div
                  layout
                  key={blog.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="relative"
                >
                  <Link href={`/dashboard/library/${blog.id}`}>
                    <div className={`group h-full relative p-6 rounded-3xl border transition-all duration-300 ${
                      deletingId === blog.id 
                      ? 'bg-red-500/5 border-red-500/50' 
                      : 'bg-zinc-900/30 border-white/5 hover:border-blue-500/30 hover:bg-zinc-900/50'
                    }`}>
                      
                      {/* Action Overlay */}
                      <div className="absolute top-4 right-4 z-20">
                        {deletingId === blog.id ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => confirmDelete(e, blog.id)}
                              className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <HiCheck size={18} />
                            </button>
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingId(null); }}
                              className="p-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                            >
                              <HiX size={18} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingId(blog.id); }}
                            className={`
                              p-2 rounded-xl transition-all z-20
                              /* Mobile: Always visible, slightly larger for thumbs */
                              relative opacity-100 bg-red-500/10 text-red-500 
                              /* Desktop: Hide and show only on hover */
                              lg:absolute lg:top-4 lg:right-4 lg:opacity-0 lg:group-hover:opacity-100 lg:bg-zinc-800/0 lg:hover:bg-red-500/10 lg:text-zinc-500 lg:hover:text-red-500
                            `}
                          >
                            <HiOutlineTrash size={20} />
                          </button>
                        )}
                      </div>

                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <HiOutlineBookOpen className="text-2xl" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-white line-clamp-1">{blog.youtube_title}</h3>
                      <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed italic">
                        {blog.generated_content}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-white/10">
                <p className="text-zinc-500 italic">Your library is empty. Go create something!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}