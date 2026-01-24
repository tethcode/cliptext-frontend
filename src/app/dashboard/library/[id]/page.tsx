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
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-8"></div>
        <div className="h-12 w-3/4 bg-zinc-800 rounded mb-6"></div>
        <div className="h-64 w-full bg-zinc-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/library" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
        <HiOutlineArrowLeft /> Back to Library
      </Link>

      {blog && (
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/5 bg-zinc-900/30 p-8 md:p-12 shadow-2xl"
        >
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {blog.youtube_title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4">
              <a 
                href={blog.youtube_link} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-all border border-white/5"
              >
                <HiOutlineExternalLink /> View Original Video
              </a>
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            <div className="text-zinc-300 leading-8 text-lg whitespace-pre-wrap font-light">
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