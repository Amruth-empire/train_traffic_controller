"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RAW_SOS_NUMBER = process.env.NEXT_PUBLIC_SOS_NUMBER ?? "+18005550199";

export function SOSButton() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { displayNumber } = useMemo(() => {
    return { displayNumber: RAW_SOS_NUMBER };
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("🚨 Emergency call initiated! 📞");
      } else {
        alert("❌ Failed to start call: " + data.error);
      }
    } catch (err: any) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full border-2 border-red-500 bg-white text-lg font-bold uppercase text-red-600 shadow-lg transition-transform hover:scale-105 hover:bg-red-50"
          aria-label="Trigger SOS call"
        >
          SOS
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 text-white">
        <DialogHeader className="items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
            <AlertTriangle className="size-6" />
          </span>
          <DialogTitle className="mt-4 text-2xl font-semibold text-red-400">
            Emergency Call
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Are you sure you want to place an emergency call to {displayNumber}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="secondary"
            className="border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            No, cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Calling..." : "Yes, call now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
