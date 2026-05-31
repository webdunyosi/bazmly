"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      setError("Iltimos, telefon raqamingizni to'liq kiriting!");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
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

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((val) => !val)) {
      setError("Tasdiqlash kodini to'liq kiriting!");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/feed");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-radial from-primary/5 via-transparent to-transparent">
        <div className="w-full max-w-md space-y-8 rounded-3xl bg-brand-light-card dark:bg-brand-dark-card border border-brand-light-border dark:border-brand-dark-border p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="text-center relative z-10">
            <span className="text-4xl">🔑</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              {step === 1 ? "Tizimga Kirish" : "Kodni Tasdiqlash"}
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              {step === 1
                ? "Marosimlarni bron qilish uchun telefon raqamingizni kiriting"
                : `+998 ${phone} raqamiga yuborilgan tasdiqlash kodini kiriting`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500 text-center font-semibold relative z-10">
              ⚠️ {error}
            </div>
          )}

          {/* Flow Steps */}
          {step === 1 ? (
            /* STEP 1: Phone Input */
            <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-6 relative z-10">
              <div className="rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3 p-4 focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200">
                <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">
                  Telefon raqam
                </label>
                <div className="flex items-center text-lg font-bold">
                  <span className="text-foreground/50 mr-2 border-r border-brand-light-border dark:border-brand-dark-border pr-2">
                    +998
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").substring(0, 9))}
                    className="block w-full border-0 bg-transparent p-0 text-foreground placeholder-foreground/30 focus:ring-0 outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Yuborilmoqda...
                    </span>
                  ) : (
                    "Kodni olish"
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: OTP Verification */
            <form onSubmit={handleVerifySubmit} className="mt-8 space-y-6 relative z-10">
              <div className="flex justify-center gap-4">
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
                    className="w-14 h-16 text-center text-2xl font-bold rounded-2xl border border-brand-light-border dark:border-brand-dark-border bg-foreground/3 dark:bg-white/3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
                  />
                ))}
              </div>

              <div className="text-center text-sm text-foreground/50">
                Kodni olmadingizmi?{" "}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-primary font-bold hover:underline"
                  disabled={loading}
                >
                  Raqamni o'zgartirish
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Tasdiqlanmoqda...
                    </span>
                  ) : (
                    "Tasdiqlash va Kirish"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Decorative glowing gradient blur */}
          <div className="absolute -bottom-16 -right-16 h-32 w-32 bg-primary/20 blur-3xl rounded-full scale-125 -z-10" />
        </div>
      </main>
    </div>
  );
}
