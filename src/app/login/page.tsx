"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Search,
  Check,
  Phone,
  Apple,
  Lock,
  User,
  ArrowRight,
  ChevronLeft,
  MapPin,
  Bell,
  CreditCard,
  Clock,
  Languages,
  HelpCircle,
  LogOut,
  ChevronRight,
  Share2,
  CheckCircle,
  X,
} from "lucide-react";
import Navbar from "@/components/navbar";

type Step = 1 | 2 | 3 | 4;

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: "uz", name: "Uzbek", nativeName: "O'zbekcha", flag: "🇺🇿" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [step, setStep] = useState<Step>(1);
  
  // Registration / Profile States
  const [searchLang, setSearchLang] = useState("");
  const [selectedLang, setSelectedLang] = useState("uz");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("Tashkent, Tashkent city");

  // Profile Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Mount effect to check registration state
  useEffect(() => {
    setMounted(true);
    const registered = localStorage.getItem("isRegistered") === "true";
    if (registered) {
      setIsRegistered(true);
      setFullName(localStorage.getItem("fullName") || "Alisher Raimov");
      setLocation(localStorage.getItem("location") || "Tashkent, Tashkent city");
      setPhone(localStorage.getItem("phone") || "");
    }
  }, []);

  // Toast auto-dismiss helper
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-dark animate-pulse" />
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast("Ism va familiyangiz bo'sh bo'lishi mumkin emas!");
      return;
    }
    const cleanLocation = editLocation.trim() || "Tashkent, Tashkent city";
    setFullName(editName);
    setLocation(cleanLocation);
    localStorage.setItem("fullName", editName);
    localStorage.setItem("location", cleanLocation);
    setIsEditing(false);
    showToast("Profil muvaffaqiyatli saqlandi!");
  };

  const handleLogout = () => {
    localStorage.removeItem("isRegistered");
    localStorage.removeItem("fullName");
    localStorage.removeItem("phone");
    localStorage.removeItem("location");
    setIsRegistered(false);
    setFullName("");
    setPhone("");
    setStep(1);
    setActiveModal(null);
    showToast("Akkauntdan chiqildi.");
  };

  const filteredLanguages = LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(searchLang.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(searchLang.toLowerCase())
  );

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (phone.length < 9) {
        setError("Iltimos, telefon raqamingizni kiriting!");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1000);
    } else if (step === 3) {
      if (otp.some((v) => !v)) {
        setError("6 xonali kodni to'liq kiriting!");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 1000);
    }
  };

  const handleBackStep = () => {
    setError("");
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Iltimos, ism va familiyangizni kiriting!");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("phone", phone);
      localStorage.setItem("location", "Tashkent, Tashkent city");
      localStorage.setItem("isRegistered", "true");
      setIsRegistered(true);
      showToast("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      router.push("/feed");
    }, 1200);
  };

  const menuItems = [
    {
      label: "Xabarlar",
      icon: Bell,
      action: () => setActiveModal("messages"),
    },
    {
      label: "Mening kartalarim",
      icon: CreditCard,
      action: () => router.push("/tickets"),
    },
    {
      label: "Tarix",
      icon: Clock,
      action: () => setActiveModal("history"),
    },
    {
      label: "Tillar",
      icon: Languages,
      action: () => setActiveModal("languages"),
    },
    {
      label: "Yordam",
      icon: HelpCircle,
      action: () => setActiveModal("help"),
    },
    {
      label: "Chiqish",
      icon: LogOut,
      action: () => setActiveModal("logout"),
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-300 relative"
      style={{
        backgroundImage: "url('/images/topo_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xl animate-fade-in flex items-center gap-2 max-w-xs text-center border border-white/20">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isRegistered ? (
        /* ==================== REGISTERED PROFILE VIEW ==================== */
        <div className="flex flex-col flex-1 pb-10">
          <Navbar />

          <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 max-w-md mx-auto w-full">
            {/* Header Title */}
            <h1 className="text-xl font-black text-foreground dark:text-white mb-6">
              Sozlamalar
            </h1>

            {/* Profile Card Info */}
            <div className="w-full flex flex-col items-center text-center mb-8">
              {/* Circle Avatar with custom styling */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl relative bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src="/images/profil.jpg"
                    alt="User Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg border-2 border-brand-light dark:border-brand-dark">
                  <User className="h-4.5 w-4.5" />
                </div>
              </div>

              {/* Editable Name & Location */}
              {isEditing ? (
                <div className="mt-4 w-full max-w-xs space-y-3 bg-foreground/5 dark:bg-white/5 p-4 rounded-2xl border border-foreground/10 dark:border-white/10 glass-effect">
                  <div className="text-left">
                    <label className="block text-[10px] font-bold text-foreground/45 dark:text-white/40 uppercase tracking-wider mb-1">
                      To'liq ismingiz
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Masalan: Alisher Raimov"
                      className="w-full px-3 py-2 rounded-xl border border-foreground/10 dark:border-white/10 bg-brand-light dark:bg-brand-dark text-sm text-foreground dark:text-white font-bold outline-none focus:border-primary"
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-[10px] font-bold text-foreground/45 dark:text-white/40 uppercase tracking-wider mb-1">
                      Sizning shahringiz
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="Masalan: Tashkent, Tashkent city"
                      className="w-full px-3 py-2 rounded-xl border border-foreground/10 dark:border-white/10 bg-brand-light dark:bg-brand-dark text-xs text-foreground dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-foreground/10 dark:bg-white/10 hover:bg-foreground/15 text-xs font-bold text-foreground dark:text-white transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-white transition-colors shadow-md"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-1">
                  <h2 className="text-2xl font-black text-foreground dark:text-white tracking-tight">
                    {fullName || "Alisher Raimov"}
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-foreground/60 dark:text-white/60 font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{location}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3.5 w-full max-w-xs mt-6">
                <button
                  onClick={() => {
                    setEditName(fullName);
                    setEditLocation(location);
                    setIsEditing(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 text-xs font-bold text-foreground dark:text-white hover:bg-foreground/10 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                >
                  Edit profile
                </button>
                <button
                  onClick={() => setActiveModal("friends")}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-xs font-bold text-white shadow-lg hover:bg-primary-hover transition-all active:scale-95"
                >
                  Add friends
                </button>
              </div>
            </div>

            {/* Options List Dashboard Container */}
            <div className="w-full border border-foreground/10 dark:border-white/10 rounded-2xl bg-brand-light-card/80 dark:bg-black/80 shadow-2xl overflow-hidden p-2 space-y-1 glass-effect">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isChiqish = item.label === "Chiqish";
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl text-foreground dark:text-white/90 hover:bg-foreground/5 dark:hover:bg-white/5 active:bg-foreground/10 dark:active:bg-white/10 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-xl border transition-colors ${
                        isChiqish
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-foreground/5 dark:bg-white/5 border-foreground/5 dark:border-white/5 text-foreground/80 dark:text-white/80 group-hover:text-primary group-hover:border-primary/20"
                      }`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className={`text-sm font-bold tracking-wide ${
                        isChiqish ? "text-red-500/90 font-black" : ""
                      }`}>{item.label}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-foreground/30 dark:text-white/30 group-hover:translate-x-0.5 transition-transform ${
                      isChiqish ? "text-red-500/40 group-hover:text-red-500" : ""
                    }`} />
                  </button>
                );
              })}
            </div>
          </main>

          {/* ==================== SETTINGS MODALS ==================== */}
          {activeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-sm border border-foreground/10 dark:border-white/10 rounded-3xl shadow-2xl bg-brand-light-card dark:bg-zinc-900 p-6 space-y-5 relative animate-scale-up">
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 text-foreground/50 dark:text-white/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Modal Title */}
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    {activeModal === "messages" && <Bell className="h-5 w-5" />}
                    {activeModal === "history" && <Clock className="h-5 w-5" />}
                    {activeModal === "languages" && <Globe className="h-5 w-5" />}
                    {activeModal === "help" && <HelpCircle className="h-5 w-5" />}
                    {activeModal === "logout" && <LogOut className="h-5 w-5" />}
                    {activeModal === "friends" && <Share2 className="h-5 w-5" />}
                  </span>
                  <h3 className="text-lg font-black text-foreground dark:text-white">
                    {activeModal === "messages" && "Xabarlar"}
                    {activeModal === "history" && "Bronlar Tarixi"}
                    {activeModal === "languages" && "Tizim Tili"}
                    {activeModal === "help" && "Yordam Markazi"}
                    {activeModal === "logout" && "Akkauntdan chiqish"}
                    {activeModal === "friends" && "Do'stlarni chaqirish"}
                  </h3>
                </div>

                {/* Modal Content */}
                <div className="text-xs text-foreground/70 dark:text-white/70 space-y-3 leading-relaxed">
                  {/* Messages Content */}
                  {activeModal === "messages" && (
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      <div className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 rounded-xl">
                        <div className="flex justify-between font-bold text-foreground dark:text-white mb-1">
                          <span>🎉 Xush kelibsiz!</span>
                          <span className="text-[10px] text-foreground/40 dark:text-white/40">Hozir</span>
                        </div>
                        <p>BAZMLY ilovasiga muvaffaqiyatli kirdingiz! Endilikda premium restoran va marosim zallarini oson bron qilishingiz mumkin.</p>
                      </div>
                      <div className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 rounded-xl">
                        <div className="flex justify-between font-bold text-foreground dark:text-white mb-1">
                          <span>🔥 10% Chegirma Kuponi</span>
                          <span className="text-[10px] text-foreground/40 dark:text-white/40">Kecha</span>
                        </div>
                        <p>Birinchi broningiz uchun 10% lik kuponingiz chiptalar bo'limida saqlandi!</p>
                      </div>
                    </div>
                  )}

                  {/* History Content */}
                  {activeModal === "history" && (
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      <div className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground dark:text-white">Oltin Saroy Marosim Zali</p>
                          <p className="text-[10px] text-foreground/45 dark:text-white/45">Bron ID: BZ-90214 • 12 Iyun, 2026</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[10px]">
                          Faol
                        </span>
                      </div>
                      <div className="p-3 bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground dark:text-white">Versal Hall Premium</p>
                          <p className="text-[10px] text-foreground/45 dark:text-white/45">Bron ID: BZ-89110 • 28 May, 2026</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-foreground/10 border border-foreground/15 text-foreground/60 dark:text-white/60 font-bold text-[10px]">
                          Yakunlangan
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Languages Content */}
                  {activeModal === "languages" && (
                    <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                      {LANGUAGES.map((lang) => {
                        const isSel = selectedLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLang(lang.code);
                              showToast(`Tizim tili o'zgartirildi: ${lang.nativeName}`);
                              setActiveModal(null);
                            }}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all active:scale-95 ${
                              isSel
                                ? "bg-primary/10 border-primary text-foreground dark:text-white"
                                : "bg-foreground/5 dark:bg-white/5 border-foreground/5 dark:border-white/5 text-foreground/75 dark:text-white/75 hover:bg-foreground/10 dark:hover:bg-white/10"
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <div>
                              <p className="text-xs font-bold leading-tight">{lang.nativeName}</p>
                              <p className="text-[9px] text-foreground/45 dark:text-white/45">{lang.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Help Content */}
                  {activeModal === "help" && (
                    <div className="space-y-4">
                      <p>BAZMLY ilovasi orqali marosim zallari, restoran va shou-dasturlarni onlayn, xavfsiz va eng yaxshi narxlarda bron qilishingiz mumkin.</p>
                      
                      <div className="space-y-2">
                        <p className="font-bold text-foreground dark:text-white">Tez-tez beriladigan savollar:</p>
                        <details className="bg-foreground/5 dark:bg-white/5 rounded-xl border border-foreground/5 dark:border-white/5 p-2 focus:outline-none">
                          <summary className="font-bold text-[11px] cursor-pointer text-foreground dark:text-white">To'lovlar xavfsizmi?</summary>
                          <p className="mt-1 pl-2 text-[10px] text-foreground/60 dark:text-white/60">Barcha to'lovlar rasmiy to'lov tizimlari orqali 3D-Secure himoyasi bilan amalga oshiriladi.</p>
                        </details>
                        <details className="bg-foreground/5 dark:bg-white/5 rounded-xl border border-foreground/5 dark:border-white/5 p-2 focus:outline-none">
                          <summary className="font-bold text-[11px] cursor-pointer text-foreground dark:text-white">Qanday bekor qilish mumkin?</summary>
                          <p className="mt-1 pl-2 text-[10px] text-foreground/60 dark:text-white/60">Tadbirdan 48 soat oldin bekor qilinsa, pul mablag'ingiz to'liq qaytariladi.</p>
                        </details>
                      </div>

                      <a
                        href="https://t.me/bazmly_support"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
                      >
                        Qo'llab-quvvatlash guruhi bilan aloqa (Telegram)
                      </a>
                    </div>
                  )}

                  {/* Friends Referral Content */}
                  {activeModal === "friends" && (
                    <div className="space-y-4 text-center">
                      <p className="text-foreground/75 dark:text-white/75">
                        Do'stlaringizni taklif qiling va ularning birinchi bronidan keyin <span className="font-bold text-primary">50,000 so'm</span> bonusga ega bo'ling!
                      </p>

                      <div className="p-4 bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 rounded-2xl space-y-1 relative">
                        <span className="block text-[10px] text-foreground/45 dark:text-white/40 font-bold uppercase tracking-wider">Taklif kodingiz</span>
                        <span className="block text-2xl font-black text-primary tracking-widest uppercase">BZMLY8839</span>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://t.me/bazmly_bot?start=BZMLY8839");
                          showToast("Taklif havolasi nusxalandi!");
                          setActiveModal(null);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
                      >
                        Havolani nusxalash <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Logout Content */}
                  {activeModal === "logout" && (
                    <div className="space-y-4">
                      <p className="text-center text-foreground/80 dark:text-white/80 font-medium">
                        Haqiqatan ham akkauntingizdan chiqmoqchimisiz?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setActiveModal(null)}
                          className="flex-1 py-3 rounded-xl bg-foreground/10 dark:bg-white/10 hover:bg-foreground/15 text-xs font-bold text-foreground dark:text-white transition-colors"
                        >
                          Bekor qilish
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-bold text-white shadow-md transition-colors"
                        >
                          Ha, chiqish
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==================== ORIGINAL STEPPED REGISTRATION VIEW ==================== */
        <div className="flex flex-col flex-1">
          <Navbar />

          <main className="flex-1 flex items-center justify-center py-10 px-4 max-w-md mx-auto w-full">
            {/* Glassmorphic registration form shell */}
            <div className="w-full border border-foreground/10 dark:border-white/10 rounded-3xl shadow-2xl bg-brand-light-card/90 dark:bg-black/85 flex flex-col justify-between p-8 relative overflow-hidden transition-all duration-300 glass-effect">

              {/* Wizard Navigation Header */}
              <div className="flex items-center justify-between mb-4">
                {step > 1 ? (
                  <button
                    onClick={handleBackStep}
                    className="p-2 rounded-xl bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 text-foreground/80 dark:text-white/80 transition-colors"
                    disabled={loading}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="w-9 h-9" />
                )}
                
                <span className="text-xs font-bold text-foreground/40 dark:text-white/40 tracking-wider">
                  {step} / 4 - BOSQICH
                </span>

                <div className="w-9 h-9" />
              </div>

              {/* Steps Content Area */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Step 1: Language Selection */}
                {step === 1 && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-black text-foreground dark:text-white">Tizim tilini tanlang</h2>
                      </div>
                      <p className="text-xs text-foreground/50 dark:text-white/50">
                        Ilova interfeysining asosiy tilini belgilang
                      </p>

                      {/* Language Search */}
                      <div className="relative mt-2">
                        <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 my-auto text-foreground/40 dark:text-white/40" />
                        <input
                          type="text"
                          placeholder="Qidirish..."
                          value={searchLang}
                          onChange={(e) => setSearchLang(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/5 text-sm text-foreground dark:text-white placeholder-foreground/30 dark:placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {/* Languages List */}
                      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                        {filteredLanguages.map((lang) => {
                          const isSelected = selectedLang === lang.code;
                          return (
                            <button
                              key={lang.code}
                              onClick={() => setSelectedLang(lang.code)}
                              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? "bg-primary/10 border-primary text-foreground dark:text-white"
                                  : "bg-foreground/5 dark:bg-white/5 border-foreground/5 dark:border-white/5 text-foreground/70 dark:text-white/70 hover:bg-foreground/10 dark:hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{lang.flag}</span>
                                <div>
                                  <p className="text-sm font-bold">{lang.nativeName}</p>
                                  <p className="text-[10px] text-foreground/40 dark:text-white/40">{lang.name}</p>
                                </div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-colors mt-4"
                    >
                      Keyingisi <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Step 2: Create Account / Socials */}
                {step === 2 && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-6 w-6 text-primary" />
                          <h2 className="text-xl font-black text-foreground dark:text-white">Akkaunt yaratish</h2>
                        </div>
                        <p className="text-xs text-foreground/50 dark:text-white/50">
                          Mobil raqamingizni kiritib yangi akkaunt yarating
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-bold">
                          {error}
                        </div>
                      )}

                      {/* Phone Input Row */}
                      <div className="flex items-center gap-3">
                        {/* Country Code Pill */}
                        <div className="flex items-center justify-center gap-2 border border-foreground/10 dark:border-white/10 rounded-2xl bg-foreground/5 dark:bg-white/5 h-12 px-3 text-foreground dark:text-white text-sm font-bold select-none min-w-[100px]">
                          <img
                            src="/icons/uzb.png"
                            alt="UZB Flag"
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span>+998</span>
                        </div>

                        {/* Phone Number Input Pill */}
                        <div className="flex-1 flex items-center border border-foreground/10 dark:border-white/10 rounded-2xl bg-foreground/5 dark:bg-white/5 h-12 px-4 focus-within:border-primary/50 transition-all">
                          <input
                            type="tel"
                            required
                            placeholder="Telefon raqami"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").substring(0, 9))}
                            className="block w-full border-0 bg-transparent p-0 text-foreground dark:text-white placeholder-foreground/35 dark:placeholder-white/35 outline-none focus:ring-0 text-sm font-semibold"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-foreground/10 dark:border-white/10" />
                        <span className="flex-shrink mx-4 text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-widest">
                          yoki
                        </span>
                        <div className="flex-grow border-t border-foreground/10 dark:border-white/10" />
                      </div>

                      {/* Social Buttons */}
                      <div className="space-y-3">
                        <button
                          type="button"
                          className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/5 py-3.5 text-xs font-bold text-foreground dark:text-white hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <img
                            src="/icons/apple.png"
                            alt="Apple"
                            className="h-5 w-5 object-contain dark:invert dark:brightness-0"
                          />
                          Continue with Apple
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/5 py-3.5 text-xs font-bold text-foreground dark:text-white hover:bg-foreground/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <img
                            src="/icons/google.svg"
                            alt="Google"
                            className="h-5 w-5 object-contain"
                          />
                          Continue with Google
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-colors mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Jo'natilmoqda...
                        </span>
                      ) : (
                        <>
                          Kodni olish <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Step 3: SMS Verification */}
                {step === 3 && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-6 w-6 text-primary" />
                          <h2 className="text-xl font-black text-foreground dark:text-white">Tasdiqlash kodi</h2>
                        </div>
                        <p className="text-xs text-foreground/50 dark:text-white/50">
                          +998 {phone.substring(0,2)} ••• {phone.substring(5,9)} raqamiga yuborilgan 6 xonali kodni kiriting
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-bold">
                          {error}
                        </div>
                      )}

                      {/* 6 Digit Input Grid */}
                      <div className="grid grid-cols-6 gap-2 py-2">
                        {otp.map((val, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            required
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleOtpChange(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            disabled={loading}
                            className="w-full h-12 text-center text-lg font-bold rounded-xl border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/5 text-foreground dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          />
                        ))}
                      </div>

                      <div className="text-center text-xs text-foreground/40 dark:text-white/40">
                        Kodni olmadingizmi?{" "}
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-primary font-bold hover:underline"
                        >
                          Qaytadan yuborish
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-colors mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Tekshirilmoqda...
                        </span>
                      ) : (
                        <>
                          Kodni tasdiqlash <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Step 4: Name Input */}
                {step === 4 && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-6 w-6 text-primary" />
                          <h2 className="text-xl font-black text-foreground dark:text-white">Ism / Familiya</h2>
                        </div>
                        <p className="text-xs text-foreground/50 dark:text-white/50">
                          Ilovada foydalanish uchun to'liq ismingizni kiriting
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-bold">
                          {error}
                        </div>
                      )}

                      {/* Name Input */}
                      <div className="rounded-xl border border-foreground/10 dark:border-white/10 bg-foreground/5 dark:bg-white/5 p-3.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                        <label className="block text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-wider mb-1">
                          Ismingizni kiriting
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Shohrux"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={loading}
                          className="block w-full border-0 bg-transparent p-0 text-foreground dark:text-white font-bold outline-none placeholder-foreground/20 dark:placeholder-white/20 focus:ring-0 text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-colors mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-1.5">
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Akkaunt ochilmoqda...
                        </span>
                      ) : (
                        <>
                          Ro'yxatdan o'tish <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </main>
        </div>
      )}
    </div>
  );
}
