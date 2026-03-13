"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineMail, HiOutlineCamera, HiOutlineBadgeCheck, HiOutlineTrash } from "react-icons/hi";
import api from "@/lib/axios";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("auth/user/").then((res) => {
      setUser(res.data);
      setFormData({ username: res.data.username, email: res.data.email });
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatus({ type: 'error', msg: "Image must be less than 2MB." });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePhoto = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return;
    
    setIsSubmitting(true);
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("profile_pic", ""); 

    try {
      const response = await api.patch("auth/user/update/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUser(response.data);
      setPreviewUrl(null);
      setSelectedFile(null);
      window.dispatchEvent(new Event("userUpdated")); 
      
      setStatus({ type: 'success', msg: "Photo deleted and storage cleaned!" });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: "Failed to delete photo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    
    if (selectedFile) {
      data.append("profile_pic", selectedFile);
    }

    try {
      const response = await api.patch("auth/user/update/", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser(response.data);
      window.dispatchEvent(new Event("userUpdated")); 
      setStatus({ type: 'success', msg: "Profile updated successfully!" });
      setSelectedFile(null); 
      setPreviewUrl(null);
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.error || "Update failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className="animate-pulse text-zinc-500 p-4">Loading profile...</div>;

  return (
    <div className="mx-auto max-w-4xl font-sans w-full px-1">
      <header className="mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Profile Settings</h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-500">Update your personal information and profile picture.</p>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left Card: Avatar */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8 text-center backdrop-blur-xl h-fit">
          <div className="group relative mx-auto mb-6 h-28 w-28 sm:h-32 sm:w-32">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-blue-500/20 border border-blue-500/30 text-3xl sm:text-4xl font-bold text-blue-500 shadow-2xl shadow-blue-500/10">
              {previewUrl || user?.profile_pic ? (
                <img src={previewUrl || user?.profile_pic} className="h-full w-full object-cover" alt="Profile" />
              ) : (
                <span className="animate-in fade-in duration-500">
                    {user?.username?.[0].toUpperCase()}
                </span>
              )}
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload New Photo"
              title="Upload New Photo"
              className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60 opacity-0 lg:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <HiOutlineCamera className="text-3xl text-white" />
            </button>
            {/* Mobile-only camera button overlay since hover doesn't exist on touch */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-xl text-white lg:hidden shadow-lg"
            >
              <HiOutlineCamera className="text-xl" />
            </button>
          </div>

          <div className="flex flex-col gap-3 items-center">
             <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Image size &lt; 2MB</p>
             {(user?.profile_pic || previewUrl) && (
               <button 
                type="button" 
                onClick={removePhoto}
                className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors font-semibold bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20"
               >
                 <HiOutlineTrash /> Remove Photo
               </button>
             )}
          </div>
          
          <div className="mt-6 sm:mt-8 flex items-center gap-2 rounded-2xl bg-white/[0.03] p-3 text-[11px] text-zinc-400 border border-white/5">
            <HiOutlineBadgeCheck className="text-blue-500 text-lg shrink-0" />
            <span className="truncate">Verified Account</span>
          </div>
        </div>

        {/* Right Card: Form Fields */}
        <div className="lg:col-span-2 space-y-6 rounded-3xl border border-white/10 bg-zinc-900/30 p-6 sm:p-8">
          {status && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-sm font-medium break-words ${
                status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {status.msg}
            </motion.div>
          )}

          <div className="space-y-5">
            <div className="group">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Username</label>
              <div className="mt-2 relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 pl-12 text-base text-white outline-none focus:border-blue-500/40 focus:bg-white/[0.07] transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="mt-2 relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email"
                  className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 pl-12 text-base text-white outline-none focus:border-blue-500/40 focus:bg-white/[0.07] transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full rounded-2xl py-4 font-bold text-black transition-all active:scale-[0.98] mt-4 shadow-xl ${
              isSubmitting ? 'bg-zinc-500 cursor-not-allowed' : 'bg-white hover:bg-zinc-200'
            }`}
          >
            {isSubmitting ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}