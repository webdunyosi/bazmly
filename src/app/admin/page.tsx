"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import {
  LogOut,
  Trash2,
  Plus,
  Star,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Calendar,
  Check,
  X,
  TrendingUp,
  LayoutDashboard,
  Building2,
  Clock,
  UserCheck,
} from "lucide-react";
import Navbar from "@/components/navbar";

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: string;
  capacityNum?: number;
  priceText: string;
  priceNum?: number;
  rating: number;
  category: "restoran" | "toyxona";
  emoji: string;
  tags?: string[];
}

interface BookingRequest {
  id: string;
  customerName: string;
  phone: string;
  venueName: string;
  date: string;
  time: string;
  tableOrZal: string;
  status: "pending" | "approved" | "rejected";
}

const DEFAULT_BOOKINGS: BookingRequest[] = [
  {
    id: "b1",
    customerName: "Shahzod Alimov",
    phone: "+998 90 999 88 77",
    venueName: "Oqshom Restorani",
    date: "12/06/2026",
    time: "19:00",
    tableOrZal: "4-stol",
    status: "pending",
  },
  {
    id: "b2",
    customerName: "Kamola Karimova",
    phone: "+998 93 111 22 33",
    venueName: "Visol To'yxonasi",
    date: "18/06/2026",
    time: "18:00",
    tableOrZal: "Asosiy zal",
    status: "approved",
  },
  {
    id: "b3",
    customerName: "Doston Rustamov",
    phone: "+998 94 444 55 66",
    venueName: "Rest One",
    date: "20/06/2026",
    time: "13:00",
    tableOrZal: "2-kabina",
    status: "pending",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [partnerName, setPartnerName] = useState("Admin Hamkor");
  
  // Dashboard states
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    const isRegistered = localStorage.getItem("isRegistered") === "true";
    const userRole = localStorage.getItem("userRole");
    const name = localStorage.getItem("fullName");

    if (!isRegistered || userRole !== "partner") {
      // Not logged in or not a partner/admin, redirect to login
      router.push("/login");
    } else {
      setAuthorized(true);
      if (name) {
        setPartnerName(name);
      }

      // Load venues
      const storedVenues = localStorage.getItem("partnerVenues");
      if (storedVenues) {
        try {
          setVenues(JSON.parse(storedVenues));
        } catch (e) {}
      } else {
        // Fallback default mock venues for display
        const defaultVenues: Venue[] = [
          {
            id: "d1",
            name: "Oqshom Restorani",
            location: "Toshkent sh., Yunusobod",
            capacity: "250 kishi",
            priceText: "180 000 UZS dan",
            rating: 4.9,
            category: "restoran",
            emoji: "🍽️",
            tags: ["Premium", "Milliy"],
          },
          {
            id: "d2",
            name: "Visol To'yxonasi",
            location: "Toshkent sh., Chilonzor",
            capacity: "500 kishi",
            priceText: "250 000 UZS dan",
            rating: 5.0,
            category: "toyxona",
            emoji: "🏰",
            tags: ["Yevro", "Hashamatli"],
          },
        ];
        localStorage.setItem("partnerVenues", JSON.stringify(defaultVenues));
        setVenues(defaultVenues);
      }

      // Load or initialize bookings
      const storedBookings = localStorage.getItem("partnerBookings");
      if (storedBookings) {
        try {
          setBookings(JSON.parse(storedBookings));
        } catch (e) {}
      } else {
        localStorage.setItem("partnerBookings", JSON.stringify(DEFAULT_BOOKINGS));
        setBookings(DEFAULT_BOOKINGS);
      }
    }
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isRegistered");
    localStorage.removeItem("fullName");
    localStorage.removeItem("phone");
    localStorage.removeItem("location");
    localStorage.removeItem("userRole");
    showToast("Tizimdan chiqildi.");
    router.push("/login");
  };

  const handleDeleteVenue = (venueId: string) => {
    const updated = venues.filter((v) => v.id !== venueId);
    setVenues(updated);
    localStorage.setItem("partnerVenues", JSON.stringify(updated));
    showToast("Muassasa o'chirildi.");
  };

  const handleBookingAction = (bookingId: string, action: "approved" | "rejected") => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: action };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem("partnerBookings", JSON.stringify(updated));
    showToast(action === "approved" ? "Buyurtma tasdiqlandi!" : "Buyurtma rad etildi.");
  };

  if (!mounted || !authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
        <p className="mt-4 text-xs font-semibold text-zinc-500">Yuklanmoqda...</p>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalCapacity = venues.reduce((acc, curr) => {
    const capNum = curr.capacityNum || parseInt(curr.capacity) || 0;
    return acc + capNum;
  }, 0);

  return (
    <div
      className={`min-h-screen flex flex-col bg-[var(--background)] ${
        isDark ? "text-white" : "text-zinc-900"
      }`}
    >
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2 border border-white/20">
          <Check className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">Hamkorlik Paneli</h1>
            <p className="text-sm opacity-60 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-[#FF5A00]" />
              Xush kelibsiz, <span className="font-bold text-foreground dark:text-white">{partnerName}</span>!
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Add Venue Trigger */}
            <button
              onClick={() => {
                // To register another venue, they can go back to wizard selection
                router.push("/login");
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A00] hover:bg-[#E05000] text-white font-bold text-xs shadow-lg shadow-[#FF5A00]/15 transition-all active:scale-95"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Yangi joy qo'shish</span>
            </button>

            {/* Logout Trigger */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E82C2C]/20 hover:bg-[#E82C2C]/10 text-[#E82C2C] font-bold text-xs transition-all active:scale-95"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Jami joylar</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black">{venues.length}</p>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +1 bu oy
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Jami sig'im</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black">{totalCapacity || "750"}+ kishi</p>
              <p className="text-[10px] opacity-65">Barcha joylar bo'yicha</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Bron qilingan</span>
              <div className="p-2 rounded-lg bg-[#FF5A00]/10 text-[#FF5A00]">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black">{bookings.length}</p>
              <p className="text-[10px] text-green-500 font-bold">Faol so'rovlar</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Ko'rishlar</span>
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black">1,840</p>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +12.5% haftalik
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Partner Venues Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#FF5A00]" />
            <h2 className="text-xl font-bold tracking-tight">Sizning muassasalaringiz</h2>
          </div>

          {venues.length === 0 ? (
            <div className="border border-dashed border-zinc-300 dark:border-white/10 rounded-2xl p-10 text-center space-y-3 bg-white/10 dark:bg-zinc-900/10">
              <Building2 className="h-10 w-10 text-zinc-400 mx-auto" />
              <p className="text-sm font-semibold opacity-60">Sizda hali ro'yxatdan o'tgan muassasalar yo'q.</p>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 rounded-lg bg-[#FF5A00] text-white text-xs font-bold"
              >
                Yaratish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all duration-300 ${
                    isDark
                      ? "bg-[#393939]/30 border-white/5 hover:border-white/10"
                      : "bg-white border-zinc-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Badge/Emoji */}
                    <div className="w-16 h-16 rounded-2xl bg-[#FF5A00]/10 flex items-center justify-center text-3xl shrink-0">
                      {venue.emoji || "🍽️"}
                    </div>

                    <div className="space-y-1 w-full min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold truncate text-base">{venue.name}</h3>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full tracking-wider ${
                          venue.category === "restoran"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-purple-500/10 text-purple-500"
                        }`}>
                          {venue.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs opacity-60">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="truncate">{venue.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 flex items-center gap-1">
                          <Users className="h-3 w-3 text-[#FF5A00]" /> {venue.capacity}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-[#FF5A00]" /> {venue.priceText}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#FF5A00]/10 text-[#FF5A00] flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-current" /> {venue.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-3">
                    <span className="text-[10px] opacity-40">ID: {venue.id}</span>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="p-2 rounded-lg text-[#E82C2C] hover:bg-[#E82C2C]/10 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking Requests Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF5A00]" />
            <h2 className="text-xl font-bold tracking-tight">Bron buyurtmalari so'rovlari</h2>
          </div>

          <div className="border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white/40 dark:bg-[#1E1E1E]/40 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/5 text-[10px] font-black uppercase tracking-wider opacity-60 bg-zinc-100/50 dark:bg-white/5">
                    <th className="py-4 px-5">Mijoz</th>
                    <th className="py-4 px-5">Muassasa</th>
                    <th className="py-4 px-5">Sana & Vaqt</th>
                    <th className="py-4 px-5">Joylashuv</th>
                    <th className="py-4 px-5">Holat</th>
                    <th className="py-4 px-5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/5 text-xs font-semibold">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-zinc-100/20 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 space-y-0.5">
                        <p className="font-bold">{booking.customerName}</p>
                        <p className="text-[10px] opacity-60 font-mono">{booking.phone}</p>
                      </td>
                      <td className="py-4 px-5">{booking.venueName}</td>
                      <td className="py-4 px-5 space-y-0.5">
                        <p>{booking.date}</p>
                        <p className="text-[10px] opacity-60">{booking.time}</p>
                      </td>
                      <td className="py-4 px-5">{booking.tableOrZal}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          booking.status === "approved"
                            ? "bg-green-500/10 text-green-500"
                            : booking.status === "rejected"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {booking.status === "approved" && "Tasdiqlangan"}
                          {booking.status === "rejected" && "Rad etilgan"}
                          {booking.status === "pending" && "Kutilmoqda"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex gap-2 justify-end">
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking.id, "approved")}
                                className="p-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-500 transition-all active:scale-95"
                                title="Tasdiqlash"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking.id, "rejected")}
                                className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-500 transition-all active:scale-95"
                                title="Rad etish"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
