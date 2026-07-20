"use client";

import React, { useEffect, useState } from "react";
import { NotificationBus, UIEvent } from "./NotificationBus";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<UIEvent[]>([]);

  useEffect(() => {
    // Load initial history
    setNotifications(NotificationBus.getHistory());
    
    // Subscribe to new events
    const unsubscribe = NotificationBus.subscribe((event) => {
      setNotifications(prev => [event, ...prev].slice(0, 50));
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: UIEvent["type"]) => {
    switch(type) {
      case "success": return <span className="text-green-500">✓</span>;
      case "warning": return <span className="text-yellow-500">⚠</span>;
      case "error": return <span className="text-red-500">✕</span>;
      default: return <span className="text-blue-500">ℹ</span>;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No recent activity</div>
        ) : (
          <ul className="space-y-1">
            {notifications.map(n => (
              <li key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex gap-3 transition-colors">
                <div className="shrink-0 mt-0.5">{getIcon(n.type)}</div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
