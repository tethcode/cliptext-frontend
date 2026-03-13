"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineExternalLink } from "react-icons/hi";
import Link from "next/link";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "@/components/Toast";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{msg: string, type: 'error' | 'success'} | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`blog-details/${id}/`);
        setBlog(response.data);
      } catch (err) {
        setNotification({ 
          msg: "Failed to load blog post. It might have been deleted.", 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse px-4">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-8"></div>
        <div className="h-10 sm:h-12 w-3/4 bg-zinc-800 rounded mb-6"></div>
        <div className="h-64 w-full bg-zinc-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-1 sm:px-4">
      <Link 
        href="/dashboard/library" 
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 sm:mb-8 transition-colors group"
      >
        <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Library
      </Link>

      {blog && (
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Optimized p-6 for mobile, p-8 for tablets, p-12 for desktops
          className="rounded-3xl border border-white/5 bg-zinc-900/30 p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          <header className="mb-8 sm:mb-10">
            {/* Fluid typography: text-2xl on mobile to 4xl on desktop */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight break-words">
              {blog.youtube_title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4">
              <a 
                href={blog.youtube_link} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Original Video on YouTube"
                title="View Original Video"
                className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-[11px] sm:text-xs font-medium text-zinc-300 hover:bg-white/10 transition-all border border-white/5 active:scale-95"
              >
                <HiOutlineExternalLink className="text-sm" /> 
                View Original Video
              </a>
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            {/* Adjusted leading and text size for better mobile reading density */}
            <div className="text-zinc-300 leading-7 sm:leading-8 text-base sm:text-lg whitespace-pre-wrap font-light break-words">
              {blog.generated_content}
            </div>
          </div>
        </motion.article>
      )}

      {/* CUSTOM NOTIFICATION SYSTEM */}
      <AnimatePresence>
        {notification && (
          <Toast 
            message={notification.msg} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}