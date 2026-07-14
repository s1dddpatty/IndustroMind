"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoading, isLoggedIn, mounted, router]);

  if (!mounted || isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not logged in but it hasn't redirected yet, render nothing to avoid flashes
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
