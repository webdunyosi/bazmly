"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

interface MockTicket {
  id: string;
  venueName: string;
  location: string;
  date: string;
  session: string;
  guests: number;
  totalPrice: string;
  emoji: string;
  status: "active" | "past";
}

const MOCK_TICKETS: MockTicket[] = [
  {
    id: "BZM-482015",
    venueName: "Oltin Saroy To'yxonasi",
    location: "Toshkent sh., Yunusobod",
    date: "2026-06-18",
    session: "Kechki navbat (18:00)",
    guests: 250,
    totalPrice: "18,250,000 UZS",
    emoji: "🏰",
    status: "active",
  },
  {
    id: "BZM-193405",
    venueName: "Shoroq Restorani",
    location: "Toshkent sh., Mirobod",
    date: "2026-03-12",
    session: "Kechki navbat (18:00)",
    guests: 120,
    totalPrice: "7,000,000 UZS",
    emoji: "🍽️",
    status: "past",
  },
];

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>("BZM-482015");

  const filteredTickets = MOCK_TICKETS.filter((t) => t.status === activeTab);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 w-full px-4 py-6 pb-24">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">
          Mening Chiptalarim
        </h1>

        {/* Tab switcher */}
        <div className="flex border-b border-brand-light-border dark:border-brand-dark-border mb-8">
          <button
            onClick={() => {
              setActiveTab("active");
              setExpandedTicketId(null);
            }}
            className={`flex-1 pb-4 text-sm font-bold text-center border-b-2 transition-all duration-200 ${
              activeTab === "active"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/50 hover:text-foreground"
            }`}
          >
            Faol chiptalar ({MOCK_TICKETS.filter((t) => t.status === "active").length})
          </button>
          <button
            onClick={() => {
              setActiveTab("past");
              setExpandedTicketId(null);
            }}
            className={`flex-1 pb-4 text-sm font-bold text-center border-b-2 transition-all duration-200 ${
              activeTab === "past"
                ? "border-primary text-primary"
                : "border-transparent text-foreground/50 hover:text-foreground"
            }`}
          >
            Tarix ({MOCK_TICKETS.filter((t) => t.status === "past").length})
          </button>
        </div>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => {
              const isExpanded = expandedTicketId === ticket.id;

              return (
                <div
                  key={ticket.id}
                  className="rounded-3xl border border-brand-light-border dark:border-brand-dark-border bg-brand-light-card dark:bg-brand-dark-card shadow-lg overflow-hidden transition-all duration-300"
                >
                  {/* Summary row */}
                  <div
                    onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-foreground/3 dark:hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                        {ticket.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-foreground">
                            {ticket.venueName}
                          </h3>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {ticket.id}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/50 mt-0.5">
                          📅 {ticket.date} • {ticket.session}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-foreground/80">
                        {ticket.totalPrice}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-5 h-5 text-foreground/50 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Expandable detail section (Ticket Card) */}
                  {isExpanded && (
                    <div className="border-t border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3 p-6 animate-fadeIn">
                      <div className="flex flex-col items-center justify-between gap-8">
                        {/* Details */}
                        <div className="space-y-4 text-sm w-full">
                          <h4 className="font-extrabold text-primary text-xs uppercase tracking-wider">
                            Tashrif tafsilotlari
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-foreground/40 font-bold uppercase">Manzil</p>
                              <p className="font-extrabold text-foreground">{ticket.location}</p>
                            </div>
                            <div>
                              <p className="text-foreground/40 font-bold uppercase">Mehmonlar</p>
                              <p className="font-extrabold text-foreground">{ticket.guests} kishi</p>
                            </div>
                            <div>
                              <p className="text-foreground/40 font-bold uppercase">Sana</p>
                              <p className="font-extrabold text-foreground font-mono">{ticket.date}</p>
                            </div>
                            <div>
                              <p className="text-foreground/40 font-bold uppercase">To'lov holati</p>
                              <p className="font-bold text-green-500">Muvaffaqiyatli to'langan</p>
                            </div>
                          </div>
                        </div>

                        {/* Dashed divider */}
                        <div className="w-full border-t border-dashed border-brand-light-border dark:border-brand-dark-border" />

                        {/* Interactive QR code */}
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="p-2.5 bg-white rounded-2xl border border-gray-100 shadow-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 100 100"
                              className="h-28 w-28 text-black"
                            >
                              {/* Top-left position marker */}
                              <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                              <rect x="5" y="5" width="20" height="20" fill="white" />
                              <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                              {/* Top-right position marker */}
                              <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                              <rect x="75" y="5" width="20" height="20" fill="white" />
                              <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                              {/* Bottom-left position marker */}
                              <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                              <rect x="5" y="75" width="20" height="20" fill="white" />
                              <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                              {/* Mock QR bits */}
                              <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                              <rect x="55" y="0" width="10" height="15" fill="currentColor" />
                              <rect x="35" y="25" width="20" height="10" fill="currentColor" />
                              <rect x="50" y="45" width="15" height="15" fill="currentColor" />
                              <rect x="80" y="40" width="10" height="20" fill="currentColor" />
                              <rect x="85" y="75" width="15" height="15" fill="currentColor" />
                            </svg>
                          </div>
                          <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                            Kirish QR kodi
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-brand-light-card dark:bg-brand-dark-card border border-brand-light-border dark:border-brand-dark-border max-w-md mx-auto">
            <span className="text-5xl">🎫</span>
            <h3 className="mt-4 text-xl font-bold">Chiptalar yo'q</h3>
            <p className="text-sm text-foreground/50 mt-2">
              Sizda hozircha chiptalar mavjud emas. Ilovadan foydalanib to'yxona yoki restoran bron qilishingiz mumkin!
            </p>
            <Link
              href="/feed"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary text-white px-6 py-3 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] transition-all duration-200"
            >
              Explore Feed
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
