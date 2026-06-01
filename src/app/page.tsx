"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Compass,
  Wallet,
  ArrowRight,
  Ticket,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/navbar";

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [fullName, setFullName] = useState("Shahzod");
  const [activeTab, setActiveTab] = useState("Umumiy");
  const [currentSlide, setCurrentSlide] = useState(0);

  const BANNERS = [
    "/images/home/adv1.png",
    "/images/home/top.png",
    "/images/home/tuyxona2.png",
    "/images/home/tuyxona3.png"
  ];

  useEffect(() => {
    setMounted(true);
    const registered = localStorage.getItem("isRegistered") === "true";
    if (registered) {
      setIsRegistered(true);
      setFullName(localStorage.getItem("fullName") || "Shahzod");
    }
  }, []);

  // Automatic slide interval for best offers carousel
  useEffect(() => {
    if (!isRegistered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isRegistered]);

  if (!mounted) {
    return <div className="flex flex-col flex-1 bg-[#121212] animate-pulse" />;
  }

  const welcomeCategories = [
    {
      title: "To'yxonalar",
      desc: "Eng hashamatli marosim zallari",
      icon: "🏰",
      count: "120+ zallar",
    },
    {
      title: "Restoranlar",
      desc: "Kichik va shinam tadbirlar uchun",
      icon: "🍽️",
      count: "85+ joylar",
    },
    {
      title: "Katering",
      desc: "Professional taomlar xizmati",
      icon: "🍢",
      count: "40+ xizmatlar",
    },
    {
      title: "Bezaklar",
      desc: "Zallarni bezatish va dizayn",
      icon: "🎈",
      count: "60+ jamoalar",
    },
  ];

  const horizontalTabs = ["Umumiy", "Restoranlar", "To'yxonalar", "Katering", "Bezaklar"];

  return (
    <div className="flex flex-col flex-1 bg-[#121212] text-white transition-colors duration-300 relative">
      {isRegistered ? (
        /* ==================== HIGH-FIDELITY REGISTERED ASOSIY (HOME) VIEW ==================== */
        <div className="flex flex-col flex-1 min-h-screen bg-[#121212]">
          {/* Header Row */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Hayrli kun! {fullName}
            </h1>
            
            {/* Top Right Voucher Link Button */}
            <Link
              href="/tickets"
              className="p-2.5 rounded-xl bg-[#1C1C1E] border border-white/5 text-white/80 hover:text-white transition-all active:scale-95 flex items-center justify-center"
            >
              <Ticket className="h-5 w-5" />
            </Link>
          </div>

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto px-6 py-6 pb-28 flex flex-col gap-6 max-w-md mx-auto w-full text-left">
            
            {/* Search Input and Filter Button */}
            <div className="flex items-center gap-3">
              {/* Search Field */}
              <div className="flex-1 relative flex items-center bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden focus-within:border-primary/50 transition-all duration-300">
                <span className="pl-4 text-white/40">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Qidirish"
                  className="w-full pl-3 pr-4 py-4 bg-transparent text-sm text-white font-medium outline-none placeholder:text-white/30"
                />
              </div>

              {/* Orange Slider/Filter Button */}
              <button
                type="button"
                className="p-4 bg-primary hover:bg-primary-hover text-white rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Horizontal Tabs / Pills */}
            <div className="flex overflow-x-auto gap-2.5 pb-1 scrollbar-none">
              {horizontalTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                        : "bg-[#1C1C1E] border-white/5 text-white/60 hover:text-white/85"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Section: Eng yaxshi takliflar */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pr-1">
                <h2 className="text-lg font-bold text-white tracking-wide">Eng yaxshi takliflar</h2>
                <Link href="/tickets" className="text-xs text-white/40 font-semibold hover:text-white/70 transition-colors">
                  Barchasini ko'rish
                </Link>
              </div>

              {/* Banner Card Carousel */}
              <div className="relative group">
                <div className="w-full aspect-[2.1/1] rounded-[28px] overflow-hidden border border-white/5 shadow-2xl relative bg-[#1C1C1E]">
                  {BANNERS.map((banner, index) => {
                    const isActive = currentSlide === index;
                    return (
                      <img
                        key={banner}
                        src={banner}
                        alt={`Offer Banner ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${
                          isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
                        }`}
                      />
                    );
                  })}
                </div>
                
                {/* Indicator Dots */}
                <div className="flex justify-center items-center gap-1.5 pt-3">
                  {BANNERS.map((_, index) => {
                    const isActive = currentSlide === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isActive ? "w-4 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section: Top Restoranlar */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pr-1">
                <h2 className="text-lg font-bold text-white tracking-wide">Top Restoranlar</h2>
                <Link href="/feed" className="text-xs text-white/40 font-semibold hover:text-white/70 transition-colors">
                  Barchasini ko'rish
                </Link>
              </div>

              {/* Large Full-Width Restaurant Card */}
              <Link
                href="/venue/3"
                className="w-full bg-[#1C1C1E] border border-white/5 rounded-3xl p-5 flex flex-col gap-4 shadow-xl hover:border-white/10 transition-all block text-left"
              >
                {/* Visual Image Display */}
                <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-white/5">
                  <img
                    src="/images/home/top.png"
                    alt="Rest One"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Restaurant details */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">Rest One</h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span>Ochiq</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-xs font-bold text-[#FFB800] bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-[#FFB800] text-[#FFB800]" />
                      <span>4.8 (356 ta sharh)</span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs text-white/60 font-semibold">
                      <Compass className="h-4 w-4 text-white/40" />
                      <span>1 km uzoqda</span>
                    </div>

                    {/* Deposit green badge */}
                    <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-[#10B981] font-bold rounded-lg px-2.5 py-1 text-[10px] uppercase tracking-wider">
                      <Wallet className="h-3.5 w-3.5 shrink-0" />
                      <span>Depozitlik</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-semibold truncate pt-0.5">
                    <MapPin className="h-4 w-4 text-white/30 shrink-0" />
                    <span className="truncate">O'zbekiston ko'chasi 27 - uy</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 2x2 Grid of Restaurants */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "1", name: "Sayqal", img: "/images/home/tuyxona1.png", rating: "4.8" },
                { id: "2", name: "Tinchlik", img: "/images/home/tuyxona2.png", rating: "4.8" },
                { id: "4", name: "Panorama", img: "/images/home/tuyxona3.png", rating: "4.8" },
                { id: "5", name: "Sharqona", img: "/images/home/tuyxona4.png", rating: "4.8" }
              ].map((card) => (
                <div
                  key={card.id}
                  className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-3 flex flex-col gap-3 shadow-lg text-left relative"
                >
                  {/* Image Viewport */}
                  <div className="w-full aspect-[1.1/1] rounded-2xl overflow-hidden relative border border-white/5 bg-zinc-800">
                    <img
                      src={card.img}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info details */}
                  <div className="space-y-2 pr-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white tracking-wide truncate">{card.name}</h4>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#FFB800] shrink-0">
                        <Star className="h-3 w-3 fill-[#FFB800] text-[#FFB800]" />
                        <span>{card.rating}</span>
                      </div>
                    </div>

                    {/* Distance & Status info */}
                    <div className="flex items-center gap-1 text-[10px] text-white/50 font-bold leading-none">
                      <Compass className="h-3 w-3 text-white/30 shrink-0" />
                      <span>2 km</span>
                      <span className="text-white/20">|</span>
                      <span className="text-[#10B981]">Ochiq</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-1 text-[10px] text-white/40 font-semibold truncate leading-none">
                      <MapPin className="h-3 w-3 text-white/20 shrink-0" />
                      <span className="truncate">Umid qo'rg'...</span>
                    </div>

                    {/* View Button */}
                    <Link
                      href={`/venue/${card.id}`}
                      className="w-full py-2 bg-white hover:bg-zinc-100 text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md mt-1"
                    >
                      <span>Ko'rish</span>
                      <ArrowRight className="h-3 w-3 text-zinc-950 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </main>
        </div>
      ) : (
        /* ==================== ORIGINAL WELCOME ONBOARDING VIEW ==================== */
        <div className="flex flex-col flex-1">
          <Navbar />

          <main className="flex-1">
            <section 
              className="relative overflow-hidden py-24 lg:py-36 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/onboarding_bg.jpg')" }}
            >
              {/* Glassmorphic dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/60 backdrop-blur-[3px]" />

              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
                {/* Tagline */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-sm font-bold text-primary mb-6 animate-pulse backdrop-blur-md">
                  🎉 Yangi Avlod Marosim Platformasi
                </div>

                {/* Title */}
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto leading-tight sm:leading-none text-white">
                  Bazmlarni oson{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                    rejalashtiring!
                  </span>
                </h1>

                {/* Subtext */}
                <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  Qidiruv va oson band qilish uchun ilovadan ro'yxatdan o'ting. To'yxonalar, shinam restoranlar va katering xizmatlarini birgina bosish orqali band qiling!
                </p>

                {/* CTAs */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all duration-200"
                  >
                    Ro'yxatdan o'tish
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="ml-2 h-5 w-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/feed"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 text-base font-bold text-white hover:bg-white/20 hover:scale-[1.02] transition-all duration-200"
                  >
                    Zallarni Ko'rish
                  </Link>
                </div>
              </div>
            </section>

            {/* Feature/Category Section */}
            <section className="py-16 bg-foreground/3 dark:bg-white/3">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Biz nimalarni taklif qilamiz?
                  </h2>
                  <p className="mt-4 text-foreground/70">
                    Sizning barcha shodiyonalaringiz va bayramlaringiz uchun mukammal yechimlar.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {welcomeCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-3xl bg-brand-light-card dark:bg-brand-dark-card border border-brand-light-border dark:border-brand-dark-border p-6 shadow-sm hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                        {cat.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-200">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-foreground/60 mb-4">{cat.desc}</p>
                      <span className="inline-flex items-center rounded-lg bg-foreground/5 dark:bg-white/5 px-2.5 py-1 text-xs font-bold text-primary">
                        {cat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dynamic Interactive Features Mockup */}
            <section className="py-20 overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-orange-500/5 to-transparent border border-primary/20 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
                  <div className="flex-1 text-center lg:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      Premium interfeys va qulaylik
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl mt-3 text-foreground">
                      Hamma narsa bir joyda
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-foreground/75 leading-relaxed">
                      Ilovadan foydalanib, marosimingizning sanasini tekshiring, interfaol kalendardan bo'sh kunlarni ko'ring, to'lovlarni amalga oshiring va kirish chiptasini (QR kod) qo'lga kiriting. Ortiqcha ovvoragarchiliklarsiz, ishonchli band qiling!
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-semibold text-foreground/80">Tezkor bron</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-semibold text-foreground/80">Xavfsiz to'lov</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-semibold text-foreground/80">QR chipta</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative design graphic */}
                  <div className="flex-1 w-full max-w-md relative animate-float">
                    <div className="rounded-3xl bg-brand-light-card dark:bg-brand-dark-card border border-brand-light-border dark:border-brand-dark-border shadow-2xl p-6 relative z-10">
                      <div className="flex items-center justify-between border-b border-brand-light-border dark:border-brand-dark-border pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                            👑
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-sm">Oltin Saroy To'yxonasi</h4>
                            <p className="text-xs text-foreground/50">Toshkent sh., Yunusobod</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary">★★★★★ 4.9</span>
                      </div>
                      <div className="h-40 rounded-2xl bg-gradient-to-r from-primary/30 to-orange-500/20 flex items-center justify-center text-5xl mb-4">
                        🎉
                      </div>
                      <div className="flex items-center justify-between text-xs text-foreground/60 mb-4">
                        <span>Sig'imi: 500 kishi</span>
                        <span>Narxi: 12,000,000 UZS dan</span>
                      </div>
                      <Link
                        href="/feed"
                        className="block w-full text-center py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors duration-200 text-sm"
                      >
                        Hozir Bron Qilish
                      </Link>
                    </div>
                    {/* Decorative glowing blur */}
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-90 -z-10" />
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-brand-light-border dark:border-brand-dark-border py-8 text-center text-sm text-foreground/50">
            <p>© 2026 BAZMLY. Barcha huquqlar himoyalangan.</p>
          </footer>
        </div>
      )}
    </div>
  );
}
