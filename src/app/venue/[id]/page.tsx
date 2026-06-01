"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Share2,
  Bookmark,
  Percent,
  ChevronRight,
  Compass,
  MapPin,
  Search,
  Star,
  CheckCircle,
  Wallet,
  Plus,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const VENUES_DATA: Record<string, {
  name: string;
  location: string;
  rating: string;
  reviews: string;
  image: string;
  distance: string;
  isDeposit: boolean;
  hasDiscount: boolean;
  gallery: string[];
}> = {
  "1": {
    name: "Sayqal",
    location: "Umid qo'rg'oni 765 - uy",
    rating: "4.8",
    reviews: "128 ta sharh",
    image: "/images/home/tuyxona1.png",
    distance: "2 km uzoqda",
    isDeposit: false,
    hasDiscount: true,
    gallery: [
      "/images/home/rest1.png",
      "/images/home/rest2.png",
      "/images/home/rest3.png",
      "/images/home/rest4.png",
      "/images/home/rest5.png",
      "/images/home/rest6.png"
    ]
  },
  "2": {
    name: "Tinchlik",
    location: "Umid qo'rg'oni 765 - uy",
    rating: "4.8",
    reviews: "214 ta sharh",
    image: "/images/home/tuyxona2.png",
    distance: "2 km uzoqda",
    isDeposit: true,
    hasDiscount: false,
    gallery: [
      "/images/home/rest1.png",
      "/images/home/rest2.png",
      "/images/home/rest3.png",
      "/images/home/rest4.png",
      "/images/home/rest5.png",
      "/images/home/rest6.png"
    ]
  },
  "3": {
    name: "Rest One",
    location: "Navoiy, O'zbekiston ko'chasi 27 - uy",
    rating: "4.8",
    reviews: "356 ta sharh",
    image: "/images/home/top.png",
    distance: "1 km uzoqda",
    isDeposit: true,
    hasDiscount: true,
    gallery: [
      "/images/home/rest1.png",
      "/images/home/rest2.png",
      "/images/home/rest3.png",
      "/images/home/rest4.png",
      "/images/home/rest5.png",
      "/images/home/rest6.png"
    ]
  },
  "4": {
    name: "Panorama",
    location: "Umid qo'rg'oni 765 - uy",
    rating: "4.8",
    reviews: "185 ta sharh",
    image: "/images/home/tuyxona3.png",
    distance: "2 km uzoqda",
    isDeposit: true,
    hasDiscount: true,
    gallery: [
      "/images/home/rest1.png",
      "/images/home/rest2.png",
      "/images/home/rest3.png",
      "/images/home/rest4.png",
      "/images/home/rest5.png",
      "/images/home/rest6.png"
    ]
  },
  "5": {
    name: "Sharqona",
    location: "Umid qo'rg'oni 765 - uy",
    rating: "4.8",
    reviews: "95 ta sharh",
    image: "/images/home/tuyxona4.png",
    distance: "2 km uzoqda",
    isDeposit: false,
    hasDiscount: true,
    gallery: [
      "/images/home/rest1.png",
      "/images/home/rest2.png",
      "/images/home/rest3.png",
      "/images/home/rest4.png",
      "/images/home/rest5.png",
      "/images/home/rest6.png"
    ]
  }
};

export default function VenueDetailPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const venue = VENUES_DATA[id] || VENUES_DATA["3"]; // fallback to Rest One

  const [activeImage, setActiveImage] = useState(venue.image);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

  const FOODS = [
    { name: "Jizz", img: "/images/home/food1.png", price: "500 000 so'm", priceVal: 500000 },
    { name: "Qozon kabob", img: "/images/home/food2.png", price: "300 000 so'm", priceVal: 300000 },
    { name: "Manti", img: "/images/home/food3.png", price: "100 000 so'm", priceVal: 100000 },
    { name: "Stake", img: "/images/home/food4.png", price: "180 000 so'm", priceVal: 180000 },
    { name: "Tandir go'sht", img: "/images/home/top.png", price: "250 000 so'm", priceVal: 250000 },
    { name: "Somsa", img: "/images/home/tuyxona1.png", price: "15 000 so'm", priceVal: 15000 }
  ];

  const handleAddItem = (name: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [name]: (prev[name] || 0) + 1
    }));
  };

  const cartTotal = Object.entries(selectedItems).reduce((sum, [name, qty]) => {
    const item = FOODS.find(f => f.name === name);
    return sum + (item ? item.priceVal * qty : 0);
  }, 0);

  const formatPrice = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  };
  const [showReviews, setShowReviews] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [userName, setUserName] = useState("Shahzod");
  const [reviewsList, setReviewsList] = useState([
    {
      author: "KaiB",
      avatar: "/images/home/rest1.png",
      date: "22 Jul",
      isVerified: true,
      rating: 5,
      text: "KaiB was amazing with our cats!! 🌟🌟🌟 This was our first time using a pet-sitting service, so we were naturally quite anxious. We took a chance on Kai and completely lucked out! We booked Kai to come twice a day for three days."
    },
    {
      author: "Shahzod",
      avatar: "/images/home/rest2.png",
      date: "20 Jul",
      isVerified: true,
      rating: 5,
      text: "Menga bu joy juda yoqdi! Taomlari shirin, xizmat ko'rsatish darajasi juda yuqori. Hammaga tavsiya qilaman! 🌟"
    },
    {
      author: "Malika",
      avatar: "/images/home/rest3.png",
      date: "18 Jul",
      isVerified: true,
      rating: 5,
      text: "Ajoyib muhit va shinam joy. Oilaviy o'tirishlar uchun juda mos keladi. Kelajakda yana albatta kelamiz."
    },
    {
      author: "Olim",
      avatar: "/images/home/rest4.png",
      date: "10 Jul",
      isVerified: true,
      rating: 4,
      text: "Xizmat ko'rsatish a'lo darajada. Taomlari ham lazzatli. Faqat sal kechroq tayyor bo'ldi, lekin kutishga arziydi."
    }
  ]);

  useEffect(() => {
    setActiveImage(venue.image);
  }, [venue]);

  useEffect(() => {
    const name = localStorage.getItem("fullName");
    if (name) {
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    const bottomNav = document.getElementById("global-bottom-nav");
    if (bottomNav) {
      if (showReviews) {
        bottomNav.style.transform = "translateY(100%)";
        bottomNav.style.opacity = "0";
        bottomNav.style.pointerEvents = "none";
      } else {
        bottomNav.style.transform = "translateY(0)";
        bottomNav.style.opacity = "1";
        bottomNav.style.pointerEvents = "auto";
      }
    }
    return () => {
      if (bottomNav) {
        bottomNav.style.transform = "translateY(0)";
        bottomNav.style.opacity = "1";
        bottomNav.style.pointerEvents = "auto";
      }
    };
  }, [showReviews]);

  const reviewsEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    // Standard delay to let state render fully before scrolling
    setTimeout(() => {
      reviewsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (showReviews) {
      scrollToBottom();
    }
  }, [reviewsList, showReviews]);

  const handleSendReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      author: userName,
      avatar: "/images/home/rest6.png",
      date: "Hozir",
      isVerified: true,
      rating: 5,
      text: newReviewText.trim()
    };

    setReviewsList([...reviewsList, newRev]);
    setNewReviewText("");
    setToastMessage("Sharhingiz muvaffaqiyatli qo'shildi!");
  };

  // Toast auto-dismiss helper
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    setToastMessage(!isSaved ? "Restoran saqlandi!" : "Restoran saqlanganlardan olib tashlandi!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Havola buferga nusxalandi!");
  };

  return (
    <div className="flex flex-col flex-1 bg-[#121212] text-white min-h-screen relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2 max-w-xs text-center border border-white/20">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cinematic Top Image Section */}
      <div className="relative w-full h-[280px] bg-zinc-900 border-b border-white/5 overflow-hidden">
        <img
          src={activeImage}
          alt={venue.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

        {/* Floating Header Actions */}
        <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20">
          {/* Back Chevron */}
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Right share & save */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white transition-all active:scale-90"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleSaveToggle}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all active:scale-90"
            >
              <Bookmark
                className={`h-5 w-5 ${
                  isSaved ? "fill-primary text-primary" : "text-white/90 hover:text-white"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Small Image Gallery previews inside overlay */}
        <div className="absolute bottom-4 left-6 right-6 z-20 flex justify-center">
          <div className="bg-white/95 rounded-[18px] p-[5px] flex gap-[6px] items-center shadow-[0_8px_30px_rgba(0,0,0,0.16)] border border-white/40 max-w-[340px] overflow-x-auto scrollbar-none">
            {venue.gallery.map((thumb, idx) => {
              const isSel = activeImage === thumb;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(thumb)}
                  className={`w-11 h-11 rounded-[12px] overflow-hidden shrink-0 transition-all duration-300 ${
                    isSel ? "border-2 border-[#FF6B00] scale-105" : "border-0 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <main className="flex-1 px-6 py-6 pb-28 flex flex-col gap-6 max-w-md mx-auto w-full text-left">
        
        {/* Info detail block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* 10% discount green pill */}
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-[#10B981] font-bold rounded-lg px-2.5 py-1 text-xs">
              <Percent className="h-3.5 w-3.5" />
              <span>10% chegirma</span>
            </div>

            {/* Rating row link */}
            <button
              type="button"
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer active:scale-95 transition-all"
            >
              <span className="text-[#FFB800]">★</span>
              <span>{venue.rating} ({reviewsList.length} ta sharh)</span>
              <ChevronRight className="h-4 w-4 text-[#FFB800]" />
            </button>
          </div>

          {/* Restaurant Title & Status */}
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">{venue.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-bold pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>Ochiq</span>
            </div>
          </div>

          {/* Distance Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-white/70 font-semibold">
              <Compass className="h-4 w-4 text-white/40" />
              <span>{venue.distance}</span>
            </div>

            {/* Deposit Badges */}
            {venue.isDeposit && (
              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-[#10B981] font-bold rounded-lg px-2.5 py-1 text-[10px] uppercase tracking-wider">
                <Wallet className="h-3.5 w-3.5 shrink-0" />
                <span>Depozitlik</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 text-xs text-white/50 font-semibold leading-relaxed">
            <MapPin className="h-4 w-4 text-white/30 shrink-0" />
            <span>{venue.location}</span>
          </div>
        </div>

        {/* Menyu Section */}
        <div className="space-y-4 pt-2">
          {/* Section tab header */}
          <div className="border-b border-white/5">
            <div className="inline-block border-b-2 border-primary pb-2 pr-4 text-sm font-bold text-white tracking-wide">
              Menyu
            </div>
          </div>

          {/* Menu Count bar */}
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span className="text-white/90">Menu (86 mahsulot)</span>
            <button className="text-white/40 hover:text-white/60 transition-colors">
              Menyuni ko'riish
            </button>
          </div>

          {/* Search bar inside section */}
          <div className="flex items-center bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden focus-within:border-[#FF6B00]/50 transition-all duration-300">
            <span className="pl-4 text-white/40">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidirish"
              className="w-full pl-3 pr-4 py-4 bg-transparent text-sm text-white font-medium outline-none placeholder:text-white/30"
            />
          </div>

          {/* Food Grid Display */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((food, idx) => {
              const qty = selectedItems[food.name] || 0;
              return (
                <div
                  key={idx}
                  className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-3 flex flex-col gap-3 shadow-lg relative text-left animate-fade-in"
                >
                  {/* Image Viewport */}
                  <div className="w-full aspect-[1.15/1] rounded-2xl overflow-hidden relative border border-white/5 bg-zinc-800">
                    <img
                      src={food.img}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(food.name)}
                      className={`absolute bottom-2 right-2 w-8 h-8 rounded-full shadow-md flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all z-10 ${
                        qty > 0 ? "bg-[#FF6B00] text-white" : "bg-white text-zinc-950"
                      }`}
                    >
                      {qty > 0 ? <span className="text-xs">{qty}</span> : <Plus className="h-4 w-4 stroke-[3]" />}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 pr-0.5">
                    <p className="text-sm font-black text-white tracking-wide">{food.price}</p>
                    <p className="text-xs font-semibold text-white/50">{food.name}</p>
                  </div>
                </div>
              );
            })}
            {FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="col-span-2 py-8 text-center text-xs text-white/40 font-semibold">
                Mahsulot topilmadi
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Solid Sticky Bottom Action Panel */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/85 backdrop-blur-md border-t border-white/5 px-6 py-4.5 z-40">
        <Link
          href={`/booking/${id}`}
          className="w-full py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#E05000] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-[#FF6B00]/20"
        >
          <span>{cartTotal > 0 ? formatPrice(cartTotal) : "Keyingisi"}</span>
        </Link>
      </div>

      {/* Reviews Screen Overlay */}
      {showReviews && (
        <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col max-w-md mx-auto shadow-2xl animate-fade-in text-white overflow-hidden">
          {/* Header */}
          <div className="relative py-6 px-6 flex items-center justify-between z-20 border-b border-white/5 bg-[#121212]">
            <button
              onClick={() => setShowReviews(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 font-bold text-base tracking-wide text-white">
              Sharhlar ({reviewsList.length})
            </div>
            <div className="w-9" />
          </div>

          {/* Review Cards list container */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 flex flex-col gap-4">
            {reviewsList.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C1E] border border-white/5 rounded-[22px] p-5 shadow-lg relative text-left animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10 bg-zinc-800">
                      <img
                        src={rev.avatar}
                        className="w-full h-full object-cover"
                        alt={rev.author}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white tracking-wide">{rev.author}</span>
                        <span className="text-white/30 text-[10px]">•</span>
                        <span className="text-xs text-white/50">{rev.date}</span>
                        {rev.isVerified && (
                          <span className="text-[10px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded-[4px] font-semibold tracking-wide ml-1">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-[#FFB800]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs">
                        {i < rev.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Text Body */}
                <p className="text-xs font-medium text-white/80 leading-relaxed">
                  {rev.text}
                </p>
                {/* Read More button */}
                <div className="flex justify-end mt-2">
                  <button className="text-[10px] font-bold text-white/40 hover:text-white/60 transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            ))}
            <div ref={reviewsEndRef} />
          </div>

          {/* Input panel fixed at bottom of overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#121212] px-6 py-4 border-t border-white/5 pb-6">
            <form
              onSubmit={handleSendReview}
              className="flex items-center bg-[#1C1C1E] rounded-full px-4 py-3.5 gap-3 border border-white/5 focus-within:border-[#FF6B00]/40 transition-all"
            >
              <input
                type="text"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Yozish"
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              />
              <button
                type="submit"
                disabled={!newReviewText.trim()}
                className="p-1.5 rounded-full bg-transparent text-[#FF6B00] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all shrink-0 flex items-center justify-center"
              >
                <svg className="w-5.5 h-5.5 fill-current transform rotate-45 -translate-x-[2px] translate-y-[1px]" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
