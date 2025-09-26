"use client";

import { useState, useRef, useEffect } from "react";
import { User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  user: User;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-600 text-white";
      case "controller":
        return "bg-blue-600 text-white";
      case "viewer":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getRoleDisplayName = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "System Administrator";
      case "controller":
        return "Controller";
      case "viewer":
        return "Viewer";
      default:
        return role;
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200">
          <UserIcon className="h-4 w-4" />
        </div>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-white shadow-lg dark:bg-slate-800 dark:border-slate-700 z-50">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email ||
                    `${user.name
                      .toLowerCase()
                      .replace(/\s+/g, ".")}@railway.com`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Role:
              </span>
              <Badge className={cn("text-xs", getRoleBadgeColor(user.role))}>
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>

            {user.section && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Section:
                </span>
                <Badge
                  variant="outline"
                  className="text-xs border-slate-300 text-slate-600 dark:border-slate-500 dark:text-slate-300"
                >
                  {user.section}
                </Badge>
              </div>
            )}
          </div>

          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
