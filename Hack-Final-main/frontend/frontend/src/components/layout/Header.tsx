"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, CheckCircle, CheckCheck, Clock, X, Info, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at?: string;
}

export function Header() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/notifications/");
      const items = res.data?.data?.items || res.data?.items || res.data?.data || [];
      if (Array.isArray(items)) {
        setNotifications(items);
        const unread = items.filter((n: NotificationItem) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      // Fallback silently if not logged in yet or offline
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await api.post("/api/v1/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#334155] bg-[#0F172A] px-6 relative z-40">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[#88929b]" />
          </div>
          <input
            type="text"
            suppressHydrationWarning
            className="block w-full rounded-md border border-[#334155] bg-[#161c22] py-1.5 pl-10 pr-3 text-sm text-[#dde3eb] placeholder-[#88929b] focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]"
            placeholder="Search equipment, documents, regulations..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button 
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) fetchNotifications();
          }}
          suppressHydrationWarning 
          title="Notifications"
          className={`relative p-2.5 rounded-lg transition-colors ${isOpen ? "bg-[#161c22] text-[#0ea5e9]" : "text-[#88929b] hover:text-[#dde3eb] hover:bg-[#161c22]"}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#0ea5e9] rounded-full ring-2 ring-[#0F172A] animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 top-14 w-80 sm:w-96 bg-[#161c22] border border-[#334155] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155] bg-[#0F172A]">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-[#0ea5e9]" />
                <h3 className="text-sm font-semibold text-[#dde3eb]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-[#0ea5e9]/20 text-[#0ea5e9] text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={loading}
                    title="Mark all as read"
                    className="text-xs text-[#88929b] hover:text-[#0ea5e9] transition-colors flex items-center space-x-1 p-1 rounded hover:bg-[#161c22]"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#88929b] hover:text-[#dde3eb] p-1 rounded hover:bg-[#161c22]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#334155]/60">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                    className={`p-4 transition-colors cursor-pointer flex items-start space-x-3 ${
                      !notif.is_read ? "bg-[#0ea5e9]/5 hover:bg-[#0ea5e9]/10 border-l-4 border-l-[#0ea5e9]" : "hover:bg-[#1a2026]/40 opacity-80"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {notif.title.toLowerCase().includes("process") || notif.title.toLowerCase().includes("document") ? (
                        <CheckCircle className="h-4 w-4 text-[#4edea3]" />
                      ) : notif.notification_type === "warning" || notif.notification_type === "error" ? (
                        <AlertCircle className="h-4 w-4 text-[#ffb4ab]" />
                      ) : (
                        <Info className="h-4 w-4 text-[#0ea5e9]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-semibold truncate ${!notif.is_read ? "text-[#dde3eb]" : "text-[#88929b]"}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[#88929b] flex-shrink-0 ml-2">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-[#88929b] mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        title="Mark as read"
                        className="flex-shrink-0 text-[#88929b] hover:text-[#0ea5e9] p-1 rounded-full hover:bg-[#161c22] transition-colors"
                      >
                        <span className="block h-2 w-2 rounded-full bg-[#0ea5e9]" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[#88929b] space-y-2">
                  <Bell className="h-8 w-8 mx-auto opacity-30" />
                  <p className="text-xs">No notifications right now.</p>
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-[#334155] bg-[#0F172A]/80 text-center">
              <span className="text-[10px] text-[#88929b]">Real-time updates enabled</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
