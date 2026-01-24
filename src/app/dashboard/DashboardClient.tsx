"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineDatabase, HiOutlineLogout, HiOutlineHome, HiOutlineUser } from "react-icons/hi";
import api from "@/lib/axios";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<{ username: string; email: string; profile_pic?: string } | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Memoized fetch function so it can be reused safely
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

    // 1. Initial Load
    fetchUserData();

    // 2. Listen for the "userUpdated" event from the Profile page
    window.addEventListener("userUpdated", fetchUserData);

    // Clean up the listener when the component unmounts
    return () => window.removeEventListener("userUpdated", fetchUserData);
  }, [fetchUserData, router]);

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
    <div className="flex min-h-screen bg-[#09090b] text-zinc-400 font-sans">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-zinc-900/20 backdrop-blur-xl z-50">
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 px-2">
            <h1 className="text-xl font-bold text-white tracking-tighter">
              ClipText <span className="text-blue-500">AI</span>
            </h1>
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
                  <img 
                    src={user.profile_pic} 
                    alt="Avatar" 
                    className="h-full w-full object-cover"
                    key={user.profile_pic} // Force re-render if URL changes
                  />
                ) : (
                  <span className="font-bold text-sm">{user?.username?.[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {user?.username}
                </span>
                <span className="text-[10px] text-zinc-500 truncate">
                  {user?.email}
                </span>
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

      <main className="ml-64 w-full p-8">
        <motion.div
          key={pathname} // Animation triggers on route change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}