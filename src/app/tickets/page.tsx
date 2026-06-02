"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Check } from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  description: string;
  expirySeconds?: number; // active countdown
  expiryDate?: string; // static date
}

const MOCK_VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "BAZMLY50E",
    description: "-80 000 so'm oldindan buyurtma uchun promokod",
    expirySeconds: 5 * 3600 + 35 * 60 + 49, // 05:35:49
  },
  {
    id: "v2",
    code: "BAZMLYGOLD",
    description: "-80 000 so'm oldindan buyurtma uchun promokod",
    expiryDate: "09/19/2026",
  },
  {
    id: "v3",
    code: "BAZMLYVIP",
    description: "-80 000 so'm oldindan buyurtma uchun promokod",
    expirySeconds: 5 * 3600 + 35 * 60 + 49,
  },
  {
    id: "v4",
    code: "BAZMLY80K",
    description: "-80 000 so'm oldindan buyurtma uchun promokod",
    expirySeconds: 5 * 3600 + 35 * 60 + 49,
  },
];

export default function VouchersPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [copied, setCopied] = useState(false);
  const [timers, setTimers] = useState<Record<string, number>>({});

  // Real-time countdown timer tick effect
  useEffect(() => {
    // Initialize countdowns
    const initialTimers: Record<string, number> = {};
    MOCK_VOUCHERS.forEach((v) => {
      if (v.expirySeconds !== undefined) {
        initialTimers[v.id] = v.expirySeconds;
      }
    });
    setTimers(initialTimers);

    // Decrement countdowns every second
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        let updated = false;
        Object.keys(next).forEach((key) => {
          if (next[key] > 0) {
            next[key] -= 1;
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00:00";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hrs, mins, secs].map((v) => v.toString().padStart(2, "0")).join(":");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }).catch((err) => {
      console.warn("Clipboard failed, using fallback copy feedback:", err);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <div className={`absolute inset-0 pb-24 overflow-y-auto bg-[var(--background)] flex flex-col font-sans select-none transition-all duration-300 ${selectedVoucher ? "z-[80]" : "z-40"}`}>
      
      {/* ==================== Header ==================== */}
      <div className="py-4 text-center pt-6">
        <h1 className="text-[22px] font-extrabold text-white tracking-wide">
          Promokodlar
        </h1>
      </div>

      {/* ==================== Vouchers List ==================== */}
      <div className="flex-1 px-4 py-3 space-y-4">
        {MOCK_VOUCHERS.map((voucher) => {
          const timerVal = timers[voucher.id];
          const isTimerActive = timerVal !== undefined;

          return (
            <div
              key={voucher.id}
              onClick={() => setSelectedVoucher(voucher)}
              className="group p-4 flex items-center justify-between gap-4 border border-[#2A2A2A]/40 bg-[#393939] hover:bg-[#252528] rounded-[22px] cursor-pointer transition-all duration-300 shadow-md transform active:scale-[0.98]"
            >
              {/* Logo section */}
              <div className="w-[50px] h-[50px] shrink-0 rounded-[14px] bg-[#FF5A00] flex flex-col items-center justify-center font-black text-white text-[10px] tracking-tighter leading-none shadow-[0_4px_12px_rgba(255,90,0,0.3)]">
                <span className="scale-x-95">Bazmly</span>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-xs font-semibold leading-normal break-words pr-2">
                  {voucher.description}
                </h3>
                <div className="mt-1 flex items-center">
                  {isTimerActive ? (
                    <span className="text-[#FF5A00] text-xs font-bold font-mono tracking-wider animate-pulse">
                      {formatCountdown(timerVal)}
                    </span>
                  ) : (
                    <span className="text-[#8E8E93] text-xs font-semibold">
                      {voucher.expiryDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Chevron */}
              <div className="shrink-0">
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== Copy Successful Toast ==================== */}
      {copied && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[160] bg-emerald-500 text-white font-extrabold text-[11px] tracking-wider uppercase px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-scale-up">
          <Check className="w-4 h-4" />
          <span>Muvaffaqiyatli nusxalandi!</span>
        </div>
      )}

      {/* ==================== Dimming Backdrop ==================== */}
      <div
        onClick={() => setSelectedVoucher(null)}
        className={`fixed inset-0 z-[140] bg-black/75 backdrop-blur-[2px] transition-opacity duration-300 max-w-md mx-auto ${
          selectedVoucher ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ==================== Slide-Up Drawer / Bottom Sheet ==================== */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[150] max-w-md mx-auto bg-[#393939] border-t border-[#2A2A2A]/40 rounded-t-[32px] px-6 pb-8 pt-4 shadow-2xl transition-transform duration-300 flex flex-col items-stretch transform ${
          selectedVoucher ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag pill handle */}
        <div className="w-9 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {selectedVoucher && (
          <div className="space-y-6">
            {/* Drawer Content */}
            <div className="space-y-2 text-left">
              <h2 className="text-white text-xl font-bold tracking-tight">
                Promokod {selectedVoucher.code}
              </h2>
              <p className="text-white/70 text-xs font-semibold leading-relaxed">
                {selectedVoucher.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3.5 pt-2">
              {/* Copy Button */}
              <button
                onClick={() => handleCopy(selectedVoucher.code)}
                className="w-full py-4 bg-[#FF5A00] hover:bg-[#E05000] text-white font-extrabold text-sm rounded-[24px] shadow-lg shadow-[#FF5A00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 animate-scale-up" />
                    <span>Nusxa olindi!</span>
                  </>
                ) : (
                  <span>Nusxa olish</span>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setSelectedVoucher(null)}
                className="w-full py-3 bg-transparent text-white/90 hover:text-white font-bold text-sm tracking-wide transition-colors"
              >
                Ortga
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
