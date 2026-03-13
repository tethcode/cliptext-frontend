"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineDatabase, HiOutlineLogout, HiOutlineHome, HiOutlineUser, HiMenuAlt2, HiX } from "react-icons/hi";
import api from "@/lib/axios";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<{ username: string; email: string; profile_pic?: string } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("auth/user/");
      setUser(response.data);
    } catch (err) {
      console.error("Auth verification failed");
      localStorage.removeItem("cliptext_token");
      router.replace("/login");
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("cliptext_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchUserData();
    window.addEventListener("userUpdated", fetchUserData);
    return () => window.removeEventListener("userUpdated", fetchUserData);
  }, [fetchUserData, router]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isChecking) {
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  const menuItems = [
    { name: "Generator", href: "/dashboard", icon: HiOutlineHome },
    { name: "Library", href: "/dashboard/library", icon: HiOutlineDatabase },
    { name: "Profile", href: "/dashboard/profile", icon: HiOutlineUser },
  ];

  const handleLogout = () => {
    localStorage.removeItem("cliptext_token");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-400 font-sans overflow-x-hidden">
      {/* --- MOBILE HEADER --- */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-zinc-900/20 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:hidden">
        <h1 className="text-lg font-bold text-white tracking-tighter">
          ClipText <span className="text-blue-500">AI</span>
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(true)} aria-label="Open Menu" title="Open Menu"
          className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <HiMenuAlt2 className="text-2xl" />
        </button>
      </div>

      {/* --- SIDEBAR OVERLAY (Mobile only) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR ASIDE --- */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-zinc-900/90 lg:bg-zinc-900/20 backdrop-blur-xl z-[60]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 px-2 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white tracking-tighter">
              ClipText <span className="text-blue-500">AI</span>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} aria-label="Close Menu" title="Close Menu" className="lg:hidden text-zinc-500">
                <HiX className="text-xl" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all cursor-pointer ${
                    isActive ? "bg-white/5 text-white shadow-inner shadow-white/5" : "hover:bg-white/5 hover:text-white"
                  }`}>
                    <item.icon className={`text-xl ${isActive ? "text-blue-500" : ""}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 overflow-hidden shrink-0 shadow-lg shadow-blue-500/5">
                {user?.profile_pic ? (
                  <img src={user.profile_pic} alt="Avatar" className="h-full w-full object-cover" key={user.profile_pic} />
                ) : (
                  <span className="font-bold text-sm">{user?.username?.[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{user?.username}</span>
                <span className="text-[10px] text-zinc-500 truncate">{user?.email}</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-500/10 hover:text-red-400 transition-all group"
            >
              <HiOutlineLogout className="text-xl group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 lg:ml-64 mt-16 lg:mt-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-full overflow-x-hidden"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}