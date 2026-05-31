"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";

export default function WelcomePage() {
  const categories = [
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-32 bg-radial from-primary/10 via-transparent to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6 animate-pulse">
              🎉 Yangi Avlod Marosim Platformasi
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground max-w-4xl mx-auto leading-tight sm:leading-none">
              Orzuingizdagi marosimni{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                osongina bron qiling!
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-lg sm:text-xl text-foreground/75 max-w-2xl mx-auto leading-relaxed">
              BAZMLY yordamida to'yxonalar, shinam restoranlar va katering xizmatlarini birgina bosish orqali band qiling. Marosimingizni unutilmas qiling!
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all duration-200"
              >
                Tizimga Kirish
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
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 px-8 py-4 text-base font-bold text-foreground hover:bg-foreground/10 dark:hover:bg-white/10 hover:scale-[1.02] transition-all duration-200"
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
              {categories.map((cat, idx) => (
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

              {/* Decorative design graphic mimicking the Figma layout */}
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
                {/* Background decorative glowing blur */}
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
  );
}
