"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, CheckCircle, Aperture, AlertCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);

  // Triggered when Scan button is clicked
  const handleScanClick = () => {
    setIsScanning(true);
    setScanResult(null);
    setLoadingScan(true);

    // Simulate scanning delay of 2.5 seconds
    setTimeout(() => {
      setLoadingScan(false);
      setScanResult("BZ-90214"); // Simulated valid ticket ID
    }, 2500);
  };

  const closeScanner = () => {
    setIsScanning(false);
    setScanResult(null);
    setLoadingScan(false);
  };

  const navItems = [
    {
      name: "Asosiy",
      path: "/",
      icon: "/logo-loading.png",
      isActive: pathname === "/",
      isAction: false,
    },
    {
      name: "Voucher",
      path: "/tickets",
      icon: "/icons/discount-shape.png",
      isActive: pathname.startsWith("/tickets") || pathname.startsWith("/payment-success"),
      isAction: false,
    },
    {
      name: "Skaner",
      path: "#scan",
      icon: "/icons/scan-barcode.png",
      isActive: isScanning,
      isAction: true,
      action: handleScanClick,
    },
    {
      name: "Joylar",
      path: "/feed",
      icon: "/icons/receipt.png",
      isActive: pathname.startsWith("/feed") || pathname.startsWith("/venue") || pathname.startsWith("/booking") || pathname.startsWith("/payment"),
      isAction: false,
    },
    {
      name: "Profilim",
      path: "/login",
      icon: "/icons/user.png",
      isActive: pathname.startsWith("/login"),
      isAction: false,
    },
  ];

  return (
    <>
      {/* ==================== Figmatic Bottom Navigation Bar ==================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-20 max-w-md mx-auto bg-[#1C1C1E] dark:bg-[#121212] border-t border-white/5 rounded-t-[28px] shadow-[0_-8px_24px_rgba(0,0,0,0.4)] transition-colors duration-300">
        <div className="flex h-full items-center justify-around px-2 relative">
          
          {navItems.map((item, index) => {
            const isActive = item.isActive;

            return (
              <div
                key={index}
                className="relative flex-1 flex flex-col items-center justify-center h-full"
              >
                {isActive ? (
                  /* ==================== FLOATING ACTIVE STATE: PERFECT CIRCLE ==================== */
                  <div className="absolute -top-5 w-14 h-14 rounded-full bg-[#2A2A2A] border-4 border-[#1C1C1E] dark:border-[#121212] flex items-center justify-center shadow-2xl z-50 animate-scale-up transition-all duration-300">
                    {item.isAction ? (
                      <button
                        onClick={item.action}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="h-6 w-6 object-contain brightness-0 invert"
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="h-6 w-6 object-contain brightness-0 invert"
                        />
                      </Link>
                    )}
                  </div>
                ) : (
                  /* ==================== NORMAL FLAT INACTIVE STATE ==================== */
                  item.isAction ? (
                    <button
                      onClick={item.action}
                      className="flex flex-col items-center gap-1.5 py-1 px-3 transition-all duration-200"
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="h-5 w-5 object-contain brightness-75 opacity-40 hover:opacity-75 transition-opacity"
                      />
                      <span className="text-[10px] font-bold text-zinc-500 hover:text-white/80">
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className="flex flex-col items-center gap-1.5 py-1 px-3 transition-all duration-200"
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="h-5 w-5 object-contain brightness-75 opacity-40 hover:opacity-75 transition-opacity"
                      />
                      <span className="text-[10px] font-bold text-zinc-500 hover:text-white/80">
                        {item.name}
                      </span>
                    </Link>
                  )
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* ==================== Simulated High-Fidelity QR Scanner Overlay ==================== */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 max-w-md mx-auto shadow-2xl animate-fade-in text-white">
          
          {/* Header */}
          <div className="flex justify-between items-center py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Aperture className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              <span className="text-sm font-black tracking-wider uppercase">Chipta Skanerlash</span>
            </div>
            <button
              onClick={closeScanner}
              className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scanner View Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative py-10">
            {loadingScan ? (
              /* Simulation of active scanning */
              <div className="relative w-64 h-64 border-2 border-white/20 rounded-3xl overflow-hidden flex items-center justify-center bg-zinc-950/50 shadow-inner">
                {/* Glowing target corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {/* Laser scan line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_rgba(255,107,0,0.8)] animate-laser" />

                {/* Simulated live viewfinder grids */}
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full opacity-10">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white" />
                  ))}
                </div>

                <div className="absolute text-[10px] uppercase font-bold tracking-widest text-white/40 animate-pulse">
                  Kamerani yo'naltiring...
                </div>
              </div>
            ) : (
              /* Scanning Completed / Success Alert card */
              <div className="w-full max-w-sm p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 shadow-2xl animate-scale-up text-center">
                {scanResult ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-white">
                        Chipta tasdiqlandi!
                      </h4>
                      <p className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-wide">
                        Bron ID: {scanResult}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-left text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/40">Zal/Restoran:</span>
                        <span className="font-bold text-white">Oltin Saroy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Tadbir kuni:</span>
                        <span className="font-bold text-white">12 Iyun, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Status:</span>
                        <span className="font-bold text-emerald-400">To'langan</span>
                      </div>
                    </div>
                    <button
                      onClick={closeScanner}
                      className="w-full py-3 rounded-xl bg-primary text-xs font-bold text-white shadow-lg hover:bg-primary-hover transition-colors"
                    >
                      Tayyor
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto shadow-md">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-white">
                        Xato yuz berdi
                      </h4>
                      <p className="text-xs text-red-400 font-bold mt-1">
                        Skaner chiptani aniqlay olmadi.
                      </p>
                    </div>
                    <button
                      onClick={handleScanClick}
                      className="w-full py-3 rounded-xl bg-primary text-xs font-bold text-white shadow-lg hover:bg-primary-hover transition-colors"
                    >
                      Qaytadan urinish
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer Instruction Text */}
          <div className="pb-6 text-center text-xs text-white/50 px-6 leading-relaxed">
            BAZMLY tadbiri yoki marosim zalining QR-kodli taklifnoma chiptasini to'rtburchak maydonga yo'naltiring.
          </div>

        </div>
      )}
    </>
  );
}
