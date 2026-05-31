"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Ticket, User, Home } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Bosh sahifa", path: "/", icon: Home },
    { name: "Qidiruv", path: "/feed", icon: Compass },
    { name: "Chiptalarim", path: "/tickets", icon: Ticket },
    { name: "Profil", path: "/login", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-light-card/85 dark:bg-brand-dark-card/85 backdrop-blur-md border-t border-brand-light-border dark:border-brand-dark-border px-4 py-2 flex justify-around items-center max-w-md mx-auto shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 ${
              isActive
                ? "text-primary scale-105"
                : "text-foreground/50 hover:text-primary"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
