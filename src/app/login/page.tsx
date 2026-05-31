"use client";

import React, { useState } from "react";
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
  const [step, setStep] = useState<Step>(1);
  
  // Registration Form States
  const [searchLang, setSearchLang] = useState("");
  const [selectedLang, setSelectedLang] = useState("uz");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search filter for languages
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

    // Auto-focus next input
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
      router.push("/feed");
    }, 1200);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-brand-dark transition-colors duration-300"
      style={{
        backgroundImage: "url('/images/topo_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        {/* Glassmorphic registration form shell */}
        <div className="w-full max-w-md border border-white/10 rounded-3xl shadow-2xl bg-black/85 flex flex-col justify-between p-8 relative overflow-hidden transition-all duration-300">

          {/* Wizard Navigation Header */}
          <div className="flex items-center justify-between mb-4">
            {step > 1 ? (
              <button
                onClick={handleBackStep}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                disabled={loading}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
            
            <span className="text-xs font-bold text-white/40 tracking-wider">
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
                    <h2 className="text-xl font-black text-white">Tizim tilini tanlang</h2>
                  </div>
                  <p className="text-xs text-white/50">
                    Ilova interfeysining asosiy tilini belgilang
                  </p>

                  {/* Language Search */}
                  <div className="relative mt-2">
                    <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 my-auto text-white/40" />
                    <input
                      type="text"
                      placeholder="Qidirish..."
                      value={searchLang}
                      onChange={(e) => setSearchLang(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
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
                              ? "bg-primary/10 border-primary text-white"
                              : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{lang.flag}</span>
                            <div>
                              <p className="text-sm font-bold">{lang.nativeName}</p>
                              <p className="text-[10px] text-white/40">{lang.name}</p>
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
                      <h2 className="text-xl font-black text-white">Akkaunt yaratish</h2>
                    </div>
                    <p className="text-xs text-white/50">
                      Mobil raqamingizni kiritib yangi akkaunt yarating
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-bold">
                      {error}
                    </div>
                  )}

                  {/* Phone Input */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">
                      Telefon raqam
                    </label>
                    <div className="flex items-center text-sm font-bold">
                      <span className="text-white/60 mr-2 flex items-center gap-1">
                        🇺🇿 +998
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="90 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").substring(0, 9))}
                        className="block w-full border-0 bg-transparent p-0 text-white placeholder-white/20 outline-none focus:ring-0 text-sm font-bold"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="flex-shrink mx-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      yoki
                    </span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <Apple className="h-4 w-4" /> Apple orqali kirish
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.886H12.24Z" />
                      </svg>
                      Google orqali kirish
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
                      <h2 className="text-xl font-black text-white">Tasdiqlash kodi</h2>
                    </div>
                    <p className="text-xs text-white/50">
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
                        className="w-full h-12 text-center text-lg font-bold rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="text-center text-xs text-white/40">
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
                      <h2 className="text-xl font-black text-white">Ism / Familiya</h2>
                    </div>
                    <p className="text-xs text-white/50">
                      Ilovada foydalanish uchun to'liq ismingizni kiriting
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-bold">
                      {error}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">
                      Ismingizni kiriting
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Shohrux"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      className="block w-full border-0 bg-transparent p-0 text-white font-bold outline-none placeholder-white/20 focus:ring-0 text-sm"
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
  );
}
