"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: string;
  capacityNum: number;
  priceText: string;
  priceNum: number; // in UZS (millions) or per person
  rating: number;
  category: "toyxona" | "restoran" | "katering" | "bezaklar";
  emoji: string;
  imageUrl?: string;
  tags: string[];
}

export const MOCK_VENUES: Venue[] = [
  {
    id: "1",
    name: "Oltin Saroy To'yxonasi",
    location: "Toshkent sh., Yunusobod",
    capacity: "500 kishi",
    capacityNum: 500,
    priceText: "12,000,000 UZS dan",
    priceNum: 12,
    rating: 4.9,
    category: "toyxona",
    emoji: "🏰",
    imageUrl: "/images/oltin_saroy.png",
    tags: ["Avtoturargoh", "Sahna", "Chiroqlar shousi"],
  },
  {
    id: "2",
    name: "Versal Tantanalar Zali",
    location: "Toshkent sh., Chilonzor",
    capacity: "400 kishi",
    capacityNum: 400,
    priceText: "15,000,000 UZS dan",
    priceNum: 15,
    rating: 4.8,
    category: "toyxona",
    emoji: "🌟",
    imageUrl: "/images/versal_hall.png",
    tags: ["Premium", "Konditsioner", "Ovoz tizimi"],
  },
  {
    id: "3",
    name: "Shoroq Restorani",
    location: "Toshkent sh., Mirobod",
    capacity: "150 kishi",
    capacityNum: 150,
    priceText: "4,000,000 UZS dan",
    priceNum: 4,
    rating: 4.7,
    category: "restoran",
    emoji: "🍽️",
    imageUrl: "/images/shoroq_restaurant.png",
    tags: ["Milliy & Yevropa", "Jonli ijro", "Shinam"],
  },
  {
    id: "4",
    name: "Lazzat Catering",
    location: "Toshkent sh., Yakkasaroy",
    capacity: "Cheksiz",
    capacityNum: 1000,
    priceText: "150,000 UZS / kishi",
    priceNum: 3, // mapped to budget range
    rating: 4.9,
    category: "katering",
    emoji: "🍢",
    imageUrl: "/images/party_hero.png",
    tags: ["Furshet", "Shirinliklar", "Professional xizmat"],
  },
  {
    id: "5",
    name: "Nafis Bezaklar Jamoasi",
    location: "Toshkent sh., Olmazor",
    capacity: "N/A",
    capacityNum: 0,
    priceText: "3,000,000 UZS dan",
    priceNum: 3,
    rating: 4.6,
    category: "bezaklar",
    emoji: "🎈",
    imageUrl: "/images/party_hero.png",
    tags: ["Geliy sharlar", "Gullar", "Fotozona"],
  },
  {
    id: "6",
    name: "Minor Milliy Taomlari",
    location: "Toshkent sh., Shayxontohur",
    capacity: "200 kishi",
    capacityNum: 200,
    priceText: "5,000,000 UZS dan",
    priceNum: 5,
    rating: 4.8,
    category: "restoran",
    emoji: "🥘",
    imageUrl: "/images/minor_restaurant.png",
    tags: ["Osh", "Milliy taomlar", "Oilaviy"],
  },
];


export default function FeedPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(20); // in millions UZS

  const filteredVenues = MOCK_VENUES.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "all" || venue.category === selectedCat;
    const matchesRating = venue.rating >= minRating;
    const matchesBudget = venue.category === "katering" || venue.category === "bezaklar" || venue.priceNum <= maxBudget;

    return matchesSearch && matchesCat && matchesRating && matchesBudget;
  });

  const categories = [
    { id: "all", name: "Barchasi", icon: "✨" },
    { id: "toyxona", name: "To'yxonalar", icon: "🏰" },
    { id: "restoran", name: "Restoranlar", icon: "🍽️" },
    { id: "katering", name: "Katering", icon: "🍢" },
    { id: "bezaklar", name: "Bezaklar", icon: "🎈" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 w-full px-4 py-6 pb-24">
        
        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2.5 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-foreground/45">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="To'yxona, restoran yoki manzilni qidiring..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface text-foreground placeholder-foreground/35 outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border font-bold transition-all duration-200 active:scale-95 ${
                showFilters
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-brand-light-surface dark:bg-brand-dark-surface text-foreground border-brand-light-border dark:border-brand-dark-border hover:bg-foreground/5 dark:hover:bg-white/5"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Filtrlar
            </button>
          </div>

          {/* Advanced Filter Panel */}
          {showFilters && (
            <div className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-surface dark:bg-brand-dark-surface p-6 shadow-xl space-y-6 transition-all duration-300 animate-fadeIn">
              <h3 className="font-bold text-lg text-foreground mb-4">Qidiruv parametrlari</h3>
              
              <div className="grid grid-cols-1 gap-5">
                {/* Budget Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Maksimal Byudjet (To'yxonalar uchun)</span>
                    <span className="text-primary">{maxBudget} mln UZS</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-primary bg-foreground/10 dark:bg-white/10 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-foreground/50">
                    <span>3 mln UZS</span>
                    <span>30 mln UZS</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <span className="block font-semibold text-sm">Minimal Reyting</span>
                  <div className="flex gap-2">
                    {[0, 4.5, 4.7, 4.8, 4.9].map((ratingVal) => (
                      <button
                        key={ratingVal}
                        onClick={() => setMinRating(ratingVal)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                          minRating === ratingVal
                            ? "bg-primary text-white"
                            : "bg-foreground/5 dark:bg-white/5 text-foreground hover:bg-foreground/10 dark:hover:bg-white/10"
                        }`}
                      >
                        {ratingVal === 0 ? "Barchasi" : `★ ${ratingVal}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories Horizontal Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap border transition-all duration-200 ${
                  selectedCat === cat.id
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                    : "bg-brand-light-surface dark:bg-brand-dark-surface text-foreground border-brand-light-border dark:border-brand-dark-border hover:bg-foreground/5 dark:hover:bg-white/5"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-foreground/60">
            Natijalar: {filteredVenues.length} ta topildi
          </span>
        </div>

        {/* Grid List */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="group relative rounded-3xl bg-brand-light-card dark:bg-brand-dark-card border border-brand-light-border dark:border-brand-dark-border shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Visual image display of Venue */}
                <div className="h-48 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-brand-dark-surface">
                  {venue.imageUrl ? (
                    <img
                      src={venue.imageUrl}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-brand-dark flex items-center justify-center text-7xl select-none">
                      {venue.emoji}
                    </div>
                  )}
                  {/* Glass indicator for capacity */}
                  {venue.capacity !== "N/A" && (
                    <span className="absolute bottom-3 right-3 text-xs font-bold rounded-lg px-2.5 py-1 glass-effect border border-brand-light-border/20 dark:border-brand-dark-border/20">
                      👥 {venue.capacity}
                    </span>
                  )}
                </div>

                {/* Info body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {venue.category.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                      ★ {venue.rating}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                    {venue.name}
                  </h3>
                  
                  <p className="text-sm text-foreground/50 mt-1 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-primary/70"
                    >
                      <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.381 7.587-.83.799-1.655 1.38-2.274 1.765-.31.193-.57.337-.757.433a5.742 5.742 0 0 0-.281.14l-.018.008-.006.003ZM10 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                    </svg>
                    {venue.location}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {venue.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold rounded-md bg-foreground/5 dark:bg-white/5 border border-brand-light-border dark:border-brand-dark-border px-2 py-0.5 text-foreground/75"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-brand-light-border dark:border-brand-dark-border my-4" />

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-foreground/40">Band qilish narxi</p>
                      <p className="font-extrabold text-foreground">{venue.priceText}</p>
                    </div>
                    
                    <Link
                      href={`/venue/${venue.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/15 hover:bg-primary-hover hover:scale-[1.02] transition-all duration-200"
                    >
                      Batafsil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-brand-light-card dark:bg-brand-dark-card border border-brand-light-border dark:border-brand-dark-border max-w-lg mx-auto">
            <span className="text-5xl">🔍</span>
            <h3 className="mt-4 text-xl font-bold">Hech narsa topilmadi</h3>
            <p className="text-sm text-foreground/50 mt-2">
              Boshqa mezonlarni kiritib yoki qidiruv so'zini tozalab ko'ring.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCat("all");
                setMinRating(0);
                setMaxBudget(20);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 text-sm font-bold transition-colors"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
