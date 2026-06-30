"use client";

export function DashboardHeader() {
  return (
    <div className="flex flex-col shrink-0">
      <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
        Welcome back, Admin <span className="text-xl">👋</span>
      </h1>
      <p className="text-sm text-gray-400">Here&apos;s what&apos;s happening at your plant today.</p>
    </div>
  );
}
