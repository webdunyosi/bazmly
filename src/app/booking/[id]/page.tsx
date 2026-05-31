"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { MOCK_VENUES } from "../../feed/page";

interface Props {
  params: Promise<{ id: string }>;
}

export default function BookingPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const venue = MOCK_VENUES.find((v) => v.id === id);

  if (!venue) {
    notFound();
  }

  // Interactive configurations
  const [selectedDate, setSelectedDate] = useState<number | null>(18); // Default to June 18
  const [selectedSession, setSelectedSession] = useState<"morning" | "evening">("evening");
  const [guests, setGuests] = useState(250);
  
  // Custom addon services
  const [addons, setAddons] = useState({
    decor: false,
    media: false,
    premiumSound: false,
  });

  const basePrice = venue.category === "katering" ? 0 : venue.priceNum * 1000000;
  const guestRate = venue.category === "katering" ? 150000 : 25000; // cost per guest
  
  // Calculations
  const addonsTotal = 
    (addons.decor ? 2500000 : 0) +
    (addons.media ? 3500000 : 0) +
    (addons.premiumSound ? 1500000 : 0);

  const guestsTotal = guests * guestRate;
  const totalAmount = basePrice + guestsTotal + addonsTotal;

  // Render dummy calendar dates for June 2026
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const disabledDates = [3, 4, 10, 11, 24, 25]; // Booked days

  const handleProceedToPayment = () => {
    if (!selectedDate) return;
    // Route to payment with configurations in query params
    const query = `date=2026-06-${selectedDate}&session=${selectedSession}&guests=${guests}&total=${totalAmount}`;
    router.push(`/payment/${venue.id}?${query}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 w-full px-4 py-6 pb-24">
        
        {/* Breadcrumb Back */}
        <Link
          href={`/venue/${venue.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Zal tafsilotlariga qaytish
        </Link>

        <h1 className="text-3xl font-extrabold text-foreground mb-8">
          Marosim sozlamalari: <span className="text-primary">{venue.name}</span>
        </h1>

        <div className="flex flex-col gap-8">
          
          {/* Calendar & Configs Panel */}
          <div className="space-y-8">
            
            {/* Custom Interactive Calendar */}
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg text-foreground">Sana Tanlang</h3>
                <span className="text-sm font-bold text-primary">Iyun 2026</span>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-foreground/40 mb-2">
                <span>DSH</span><span>CSH</span><span>CHSH</span><span>PSH</span><span>JUM</span><span>SHN</span><span>YAK</span>
              </div>

              {/* Month dates */}
              <div className="grid grid-cols-7 gap-2">
                {/* June 2026 starts on Monday (1st) */}
                {calendarDays.map((day) => {
                  const isBooked = disabledDates.includes(day);
                  const isSelected = selectedDate === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedDate(day)}
                      className={`h-11 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                        isBooked
                          ? "bg-foreground/5 dark:bg-white/5 text-foreground/20 line-through cursor-not-allowed"
                          : isSelected
                          ? "bg-primary text-white scale-105 shadow-md shadow-primary/20"
                          : "bg-brand-light-surface dark:bg-brand-dark-surface text-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Selector */}
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card p-6 shadow-lg">
              <h3 className="font-extrabold text-lg text-foreground mb-4">Marosim Navbati</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedSession("morning")}
                  className={`p-4 rounded-2xl border font-bold text-center flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    selectedSession === "morning"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface text-foreground hover:bg-foreground/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-2xl">☀️</span>
                  <span>Ertalabki navbat</span>
                  <span className="text-xs font-semibold text-foreground/50">10:00 - 15:00</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSession("evening")}
                  className={`p-4 rounded-2xl border font-bold text-center flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                    selectedSession === "evening"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface text-foreground hover:bg-foreground/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-2xl">🌙</span>
                  <span>Kechki navbat</span>
                  <span className="text-xs font-semibold text-foreground/50">18:00 - 23:00</span>
                </button>
              </div>
            </div>

            {/* Guest Count Configurator */}
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card p-6 shadow-lg space-y-4">
              <div className="flex justify-between font-extrabold text-lg">
                <h3>Mehmonlar soni</h3>
                <span className="text-primary">{guests} kishi</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="10"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full accent-primary bg-foreground/10 dark:bg-white/10 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-foreground/50">
                <span>Min: 50 kishi</span>
                <span>Max: 600 kishi</span>
              </div>
            </div>

            {/* Addon Services */}
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card p-6 shadow-lg space-y-4">
              <h3 className="font-extrabold text-lg text-foreground">Qo'shimcha Xizmatlar</h3>
              
              <div className="space-y-3">
                {/* Addon 1 */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface cursor-pointer hover:border-primary/45 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addons.decor}
                      onChange={(e) => setAddons({ ...addons, decor: e.target.checked })}
                      className="rounded h-5 w-5 accent-primary border-brand-light-border dark:border-brand-dark-border"
                    />
                    <div>
                      <p className="font-bold text-sm text-foreground">Premium Bezatish xizmati</p>
                      <p className="text-xs text-foreground/50">Fotozona va yangi gullar dizayni</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-primary">+2,500,000 UZS</span>
                </label>

                {/* Addon 2 */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface cursor-pointer hover:border-primary/45 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addons.media}
                      onChange={(e) => setAddons({ ...addons, media: e.target.checked })}
                      className="rounded h-5 w-5 accent-primary border-brand-light-border dark:border-brand-dark-border"
                    />
                    <div>
                      <p className="font-bold text-sm text-foreground">Foto va Video (Media)</p>
                      <p className="text-xs text-foreground/50">Ikki kamerali tasvir va Lovestory</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-primary">+3,500,000 UZS</span>
                </label>

                {/* Addon 3 */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface cursor-pointer hover:border-primary/45 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addons.premiumSound}
                      onChange={(e) => setAddons({ ...addons, premiumSound: e.target.checked })}
                      className="rounded h-5 w-5 accent-primary border-brand-light-border dark:border-brand-dark-border"
                    />
                    <div>
                      <p className="font-bold text-sm text-foreground">Premium Ovoz va Boshlovchi</p>
                      <p className="text-xs text-foreground/50">Musiqiy hamrohlik va professional boshlovchi</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-primary">+1,500,000 UZS</span>
                </label>
              </div>
            </div>

          </div>

          {/* Checkout Invoice Receipt panel */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-foreground">Hisob varag'i</h3>
              
              <div className="space-y-3 text-sm border-b border-brand-light-border dark:border-brand-dark-border pb-4">
                {basePrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Zal bazaviy narxi</span>
                    <span className="font-bold">{basePrice.toLocaleString()} UZS</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-foreground/60">Mehmonlar xarajati ({guests} kishi)</span>
                  <span className="font-bold">{guestsTotal.toLocaleString()} UZS</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Qo'shimcha xizmatlar</span>
                    <span className="font-bold text-primary">+{addonsTotal.toLocaleString()} UZS</span>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-foreground/50 tracking-wider">Jami To'lov summasi</span>
                <div className="text-2xl font-black text-primary">
                  {totalAmount.toLocaleString()} UZS
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full flex items-center justify-center rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] transition-all duration-200"
              >
                To'lov sahifasiga o'tish
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
