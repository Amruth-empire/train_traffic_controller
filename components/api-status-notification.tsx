"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  message?: string;
  duration?: number;
}

interface ApiStatusNotificationProps {
  fetchStatus: 'idle' | 'fetching' | 'success' | 'error';
  useRealData: boolean;
  isLoadingRealData: boolean;
  apiUsage: { used: number; remaining: number };
}

export function ApiStatusNotification({ 
  fetchStatus, 
  useRealData, 
  isLoadingRealData,
  apiUsage 
}: ApiStatusNotificationProps) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Add notification
  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: ToastNotification = {
      id,
      duration: 4000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, newNotification.duration);
    }
  };

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Watch for status changes
  useEffect(() => {
    if (!useRealData) return;

    if (fetchStatus === 'fetching') {
      addNotification({
        type: 'loading',
        title: '🚂 Fetching Real Train Data',
        message: 'Getting live data from IRCTC API...',
        duration: 0, // Don't auto-remove loading notifications
      });
    }

    if (fetchStatus === 'success') {
      // Remove loading notifications
      setNotifications(prev => prev.filter(n => n.type !== 'loading'));
      
      addNotification({
        type: 'success',
        title: '✅ Real Data Loaded',
        message: `API calls remaining: ${apiUsage.remaining}/20`,
        duration: 3000,
      });
    }

    if (fetchStatus === 'error') {
      // Remove loading notifications
      setNotifications(prev => prev.filter(n => n.type !== 'loading'));
      
      addNotification({
        type: 'error',
        title: '❌ Failed to Load Real Data',
        message: 'Using fallback data instead',
        duration: 5000,
      });
    }
  }, [fetchStatus, useRealData, apiUsage.remaining]);

  // Warn when API limit is low
  useEffect(() => {
    if (apiUsage.remaining <= 5 && apiUsage.remaining > 0 && useRealData) {
      addNotification({
        type: 'info',
        title: '⚠️ API Limit Warning',
        message: `Only ${apiUsage.remaining} calls remaining this month`,
        duration: 6000,
      });
    }
  }, [apiUsage.remaining, useRealData]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-start p-4 rounded-lg shadow-lg backdrop-blur-sm border max-w-sm",
            "transform transition-all duration-300 ease-out",
            notification.type === 'success' && "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
            notification.type === 'error' && "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
            notification.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
            notification.type === 'loading' && "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
          )}
        >
          <div className="flex-shrink-0 mr-3">
            {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {notification.type === 'error' && <XCircle className="h-5 w-5" />}
            {notification.type === 'info' && <Info className="h-5 w-5" />}
            {notification.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{notification.title}</p>
            {notification.message && (
              <p className="mt-1 text-xs opacity-90">{notification.message}</p>
            )}
          </div>
          
          {notification.type !== 'loading' && (
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-2 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}