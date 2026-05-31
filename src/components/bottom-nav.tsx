"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, CheckCircle, Aperture, AlertCircle } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);

  // Real Camera Streaming Refs and States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Triggered when Scan button is clicked
  const handleScanClick = () => {
    setIsScanning(true);
    setScanResult(null);
    setLoadingScan(true);

    // Simulate scanning/decoding delay of 2.8 seconds
    setTimeout(() => {
      setLoadingScan(false);
      setScanResult("BZ-90214"); // Simulated valid ticket ID
    }, 2800);
  };

  // Camera stream activation and release effect
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isScanning && !scanResult) {
      // Request access to rear environment camera
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 640 },
          },
          audio: false,
        })
        .then((stream) => {
          activeStream = stream;
          setMediaStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((err) => console.log("Video play error:", err));
          }
        })
        .catch((err) => {
          console.warn("Camera blocked or unavailable, falling back to simulation:", err);
        });
    }

    return () => {
      // Stop all tracks to release camera hardware immediately on close or success
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      setMediaStream(null);
    };
  }, [isScanning, scanResult]);

  const closeScanner = () => {
    // Release camera tracks
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsScanning(false);
    setScanResult(null);
    setLoadingScan(false);
  };

  // 5 navigation items including the central Scan button
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

  // Calculate the active index to position the sliding notch dynamically
  let activeIdx = 2; // Default center
  const activeItemIndex = navItems.findIndex((item) => item.isActive);
  if (activeItemIndex !== -1) {
    activeIdx = activeItemIndex;
  }

  // Horizontal centers coordinates in 400px viewBox
  const centers = [52, 120, 200, 280, 348];
  const cX = centers[activeIdx];

  // Generate dynamic path with a concentric 40px depth U-notch
  const getDynamicPath = (center: number) => {
    const leftStart = center - 46;
    const leftEnd = center - 34;
    const rightEnd = center + 34;
    const rightStart = center + 46;
    const depth = 40; // concentric 10px bottom gap

    return `M0,28 C0,12.5 12.5,0 28,0 
            L${leftStart},0 
            C${leftStart + 8},0 ${leftEnd},6 ${leftEnd + 2},16 
            C${leftEnd + 6},26 ${center - 18},${depth} ${center},${depth} 
            C${center + 18},${depth} ${rightEnd - 6},26 ${rightEnd - 2},16 
            C${rightEnd},6 ${rightStart - 8},0 ${rightStart},0 
            L372,0 
            C387.5,0 400,12.5 400,28 
            L400,80 L0,80 Z`;
  };

  return (
    <>
      {/* ==================== Figmatic Dynamic Sliding Notch Bottom Bar ==================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-20 max-w-md mx-auto">
        
        {/* Dynamic Curved SVG Background with sliding notch */}
        <svg
          className="absolute inset-0 w-full h-full text-[#1C1C1E] dark:text-[#121212] drop-shadow-[0_-8px_20px_rgba(0,0,0,0.45)] transition-colors duration-300 pointer-events-none"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path
            d={getDynamicPath(activeIdx)}
            className="transition-all duration-300"
          />
        </svg>

        {/* Content Navigation Actions Layer */}
        <div className="absolute inset-0 flex justify-between items-center px-2 z-10">
          
          {navItems.map((item, index) => {
            const isActive = item.isActive;

            return (
              <div
                key={index}
                className="relative flex-1 flex flex-col items-center justify-center h-full"
              >
                {isActive ? (
                  /* Spacer to keep flex layout intact while active item is rendered absolutely below */
                  <div className="w-10 h-10" />
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

        {/* ==================== SLIDING ACTIVE CIRCLE WITH CONCENTRIC GAP ==================== */}
        <div
          className="absolute -top-5 w-[50px] h-[50px] rounded-full bg-[#2A2A2A] border border-white/10 flex items-center justify-center shadow-2xl z-50 transition-all duration-300"
          style={{
            left: `${(cX / 400) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {navItems[activeIdx].isAction ? (
            <button
              onClick={navItems[activeIdx].action}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={navItems[activeIdx].icon}
                alt={navItems[activeIdx].name}
                className="h-5.5 w-5.5 object-contain brightness-0 invert animate-scale-up"
              />
            </button>
          ) : (
            <Link
              href={navItems[activeIdx].path}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={navItems[activeIdx].icon}
                alt={navItems[activeIdx].name}
                className="h-5.5 w-5.5 object-contain brightness-0 invert animate-scale-up"
              />
            </Link>
          )}
        </div>

      </div>

      {/* ==================== High-Fidelity QR Scanner Overlay with Live Video ==================== */}
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
              /* Simulation of active scanning with real live video feed */
              <div className="relative w-64 h-64 border-2 border-white/20 rounded-3xl overflow-hidden flex items-center justify-center bg-zinc-950 shadow-2xl">
                
                {/* Real-time HTML5 Back Camera Feed */}
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Glowing target corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl z-10" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl z-10" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl z-10" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl z-10" />

                {/* Laser scan line over the video feed */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_rgba(255,107,0,0.8)] animate-laser z-10" />

                {/* Simulated live viewfinder grids */}
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full opacity-10 absolute inset-0 z-10 pointer-events-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white" />
                  ))}
                </div>

                {/* Loading indicator */}
                <div className="absolute text-[10px] uppercase font-bold tracking-widest text-white/60 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm z-20 animate-pulse">
                  Kameraga yo'naltiring...
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
