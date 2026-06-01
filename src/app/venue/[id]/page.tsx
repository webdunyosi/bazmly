"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { MOCK_VENUES } from "../../feed/page";

interface Props {
  params: Promise<{ id: string }>;
}

export default function VenueDetailPage({ params }: Props) {
  const { id } = use(params);
  const venue = MOCK_VENUES.find((v) => v.id === id);

  if (!venue) {
    notFound();
  }

  const mockReviews = [
    { name: "Sardor R.", rating: 5, date: "2026-05-15", comment: "Ajoyib xizmat ko'rsatish va judayam chiroyli bezaklar! To'yimiz judayam zo'r o'tdi." },
    { name: "Malika K.", rating: 4, date: "2026-05-02", comment: "Zal judayam katta va chiroyli, chiroqlar shousi hammaga yoqdi. Avtoturargoh keng ekan." },
    { name: "Bobur M.", rating: 5, date: "2026-04-28", comment: "Professional jamoa, taomlar ham judayam mazali. Hammaga tavsiya qilaman!" }
  ];

  return (
    <div className="flex flex-col flex-1">
      <Navbar />

      <main className="flex-1 w-full px-4 py-6 pb-24">
        {/* Back Button */}
        <Link
          href="/feed"
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
          Orqaga qaytish
        </Link>

        {/* Layout Column */}
        <div className="flex flex-col gap-8">
          
          {/* Main Info */}
          <div className="space-y-8">
            
            {/* Visual Header Graphic */}
            <div className="h-64 rounded-3xl overflow-hidden shadow-lg border border-brand-light-border dark:border-brand-dark-border bg-brand-dark-surface relative">
              {venue.imageUrl ? (
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/45 to-brand-dark flex items-center justify-center text-9xl select-none">
                  {venue.emoji}
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                  {venue.name}
                </h1>
                <div className="flex items-center gap-2 rounded-2xl bg-yellow-500/10 px-4 py-2 border border-yellow-500/20">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-extrabold text-foreground">{venue.rating}</span>
                  <span className="text-xs text-foreground/50">({mockReviews.length} ta sharh)</span>
                </div>
              </div>

              <p className="text-base text-foreground/75 flex items-center gap-2">
                📍 {venue.location}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {venue.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 border-t border-brand-light-border dark:border-brand-dark-border pt-6">
              <h2 className="text-2xl font-bold text-foreground">Tavsif</h2>
              <p className="text-foreground/80 leading-relaxed">
                Toshkentning eng nufuzli maskanlaridan biri bo'lgan ushbu muhtasham joy sizning barcha shodiyonalaringiz va tantanalaringizni yuqori saviyada o'tkazish uchun xizmat qiladi. Ko'p yillik tajribaga ega jamoamiz bayramingizni unutilmas qilish uchun harakat qiladi.
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4 border-t border-brand-light-border dark:border-brand-dark-border pt-6">
              <h2 className="text-2xl font-bold text-foreground">Qulayliklar</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="text-xs text-foreground/50 font-bold">Sig'imi</p>
                    <p className="font-bold text-sm">{venue.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <p className="text-xs text-foreground/50 font-bold">Avtoturargoh</p>
                    <p className="font-bold text-sm">250 ta mashina uchun</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <p className="text-xs text-foreground/50 font-bold">Iqlim nazorati</p>
                    <p className="font-bold text-sm">Zamonaviy konditsioner</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3">
                  <span className="text-2xl">🔊</span>
                  <div>
                    <p className="text-xs text-foreground/50 font-bold">Ovoz tizimi</p>
                    <p className="font-bold text-sm">Premium 10kW akustika</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 border-t border-brand-light-border dark:border-brand-dark-border pt-6">
              <h2 className="text-2xl font-bold text-foreground">Fikr-mulohazalar</h2>
              <div className="space-y-4">
                {mockReviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">{rev.name}</h4>
                      <span className="text-xs text-foreground/50">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                      {"★".repeat(rev.rating)}
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Booking Card panel */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-foreground">Band Qilish</h3>
              
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-foreground/50 tracking-wider">Minimal Bandlik Narxi</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-primary">{venue.priceText.split(" ")[0]}</span>
                  <span className="text-sm font-bold text-foreground/50">UZS dan</span>
                </div>
                <p className="text-xs text-foreground/50">
                  Narx tanlangan sana va katering xizmatlariga qarab o'zgarishi mumkin.
                </p>
              </div>

              <div className="border-t border-brand-light-border dark:border-brand-dark-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Zal xizmati</span>
                  <span className="font-bold">Kiritilgan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Boshlovchi va Show</span>
                  <span className="font-bold text-primary">Qo'shimcha</span>
                </div>
              </div>

              <Link
                href={`/booking/${venue.id}`}
                className="w-full flex items-center justify-center rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] transition-all duration-200"
              >
                Hozir bron qilish
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
