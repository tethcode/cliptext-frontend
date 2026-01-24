"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBookOpen, HiOutlineCalendar } from "react-icons/hi";
import api from "@/lib/axios";
import Toast from "@/components/Toast"; // Assuming you saved the Toast component here

export default function LibraryPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{msg: string, type: 'error' | 'success'} | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('all-blogs/');
        setBlogs(response.data);
      } catch (err) {
        // No more console.log! Real user feedback now:
        setNotification({ 
          msg: "Could not load library. Please check your connection.", 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Your Library</h2>
        <p className="text-zinc-500 mt-2">Access all your AI-generated articles in one place.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full animate-pulse rounded-3xl bg-zinc-900/50 border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog: any) => (
              <Link key={blog.id} href={`/dashboard/library/${blog.id}`}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative rounded-3xl border border-white/5 bg-zinc-900/30 p-6 transition-all hover:bg-zinc-900/50 hover:border-blue-500/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <HiOutlineBookOpen className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-1">{blog.youtube_title}</h3>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed italic">
                    {blog.generated_content}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <span className="flex items-center gap-1"><HiOutlineCalendar /> Recently Saved</span>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-white/10">
              <p className="text-zinc-500">No blogs found. Go to the Generator to create your first one!</p>
            </div>
          )}
        </div>
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