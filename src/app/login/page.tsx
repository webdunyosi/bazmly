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
  ChevronDown,
  Trash2,
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

const FAQS = [
  {
    q: "Qanday qilib restoran yoki marosim zalini bron qilish mumkin?",
    a: "Loyiha bosh sahifasidagi 'Joylar' bo'limiga o'ting, o'zingizga yoqqan restoran yoki zalni tanlang. Sana, vaqt va stol raqamini belgilab, to'lovni tasdiqlang. Broningiz muvaffaqiyatli amalga oshgach, u 'Tarix' bo'limida faol holatda ko'rinadi."
  },
  {
    q: "To'lovlar xavfsizmi va qanday amalga oshiriladi?",
    a: "Barcha to'lovlar hamkor rasmiy to'lov tizimlari orqali 3D-Secure himoyasi bilan amalga oshiriladi. Humo yoki Uzcard bank kartangizni kiritib, SMS-kod orqali tasdiqlash yo'li bilan mutlaqo xavfsiz to'lov qilishingiz mumkin."
  },
  {
    q: "Buyurtmani bekor qilsam, pulim qaytariladimi?",
    a: "Ha, albatta. Agar tadbiringiz boshlanishiga 48 soatdan ko'proq vaqt qolgan bo'lsa, buyurtmani bekor qilishingiz mumkin va mablag'ingiz kartangizga 100% qaytarib beriladi. 48 soatdan kam vaqt qolganda esa bekor qilish imkoniyati mavjud emas."
  },
  {
    q: "Promo-kodlar va kuponlardan qanday foydalanaman?",
    a: "Mavjud kuponlarni 'Voucher' bo'limida ko'rishingiz mumkin. Buyurtmani rasmiylashtirish va to'lov sahifasida promo-kod kiritish oynasiga kupon kodini kiritsangiz, chegirma avtomatik ravishda buyurtma summasiga qo'llaniladi."
  }
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
  const [editPhone, setEditPhone] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tempLanguage, setTempLanguage] = useState("uz");

  // Cards Management States
  const [userCards, setUserCards] = useState([
    { id: "1", type: "humo", number: "**** **** **** 1234", name: "" }
  ]);
  const [selectedCardForDelete, setSelectedCardForDelete] = useState<any | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [showCardOtp, setShowCardOtp] = useState(false);
  const [cardOtp, setCardOtp] = useState(["", "", "", "", "", ""]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setNewCardNumber(formatted.substring(0, 19));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    let formatted = val;
    if (val.length > 2) {
      formatted = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setNewCardExpiry(formatted.substring(0, 5));
  };

  const handleKeypadPress = (key: string) => {
    if (key === "⌫") {
      setCardOtp(prev => {
        const next = [...prev];
        for (let i = 5; i >= 0; i--) {
          if (next[i] !== "") {
            next[i] = "";
            break;
          }
        }
        return next;
      });
    } else if (key === "+*#" || key === "") {
      // do nothing
    } else {
      setCardOtp(prev => {
        const next = [...prev];
        for (let i = 0; i < 6; i++) {
          if (next[i] === "") {
            next[i] = key;
            break;
          }
        }
        return next;
      });
    }
  };

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

  // Dynamic bottom navigation bar visibility controller for cards sub-flows & logout drawers
  useEffect(() => {
    const bottomNav = document.getElementById("global-bottom-nav");
    if (bottomNav) {
      if (
        (showCards && (showCardOtp || showAddCard || selectedCardForDelete)) ||
        activeModal === "logout_profile" ||
        activeModal === "delete_account" ||
        showLanguages ||
        showMessages ||
        showHelp
      ) {
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
  }, [showCards, showCardOtp, showAddCard, selectedCardForDelete, activeModal, showLanguages, showMessages, showHelp]);

  // Toast auto-dismiss helper
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!mounted) {
    return (
      <div className="flex flex-col flex-1 bg-brand-dark animate-pulse" />
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
    setPhone(editPhone);
    localStorage.setItem("fullName", editName);
    localStorage.setItem("location", cleanLocation);
    localStorage.setItem("phone", editPhone);
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
      action: () => setShowMessages(true),
    },
    {
      label: "Mening kartalarim",
      icon: CreditCard,
      action: () => setShowCards(true),
    },
    {
      label: "Tarix",
      icon: Clock,
      action: () => setShowHistory(true),
    },
    {
      label: "Tillar",
      icon: Languages,
      action: () => {
        setTempLanguage(selectedLang || "uz");
        setShowLanguages(true);
      },
    },
    {
      label: "Yordam",
      icon: HelpCircle,
      action: () => setShowHelp(true),
    },
    {
      label: "Chiqish",
      icon: LogOut,
      action: () => setActiveModal("logout_profile"),
    },
  ];

  const isBottomNavHidden =
    (showCards && (showCardOtp || showAddCard || selectedCardForDelete)) ||
    activeModal === "logout_profile" ||
    activeModal === "delete_account" ||
    showLanguages ||
    showMessages ||
    showHelp;

  return (
    <div
      className="flex flex-col flex-1 bg-brand-light dark:bg-brand-dark transition-colors duration-300 relative"
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
        <div className={`flex flex-col flex-1 bg-[#121212] text-white transition-all duration-300 ${isBottomNavHidden ? "-mb-16" : ""}`}>
          {showCards ? (
            /* ==================== HIGH-FIDELITY REGISTERED MY CARDS VIEW ==================== */
            <div className="flex flex-col flex-1 bg-[#121212] text-white">
              <style>{`
                @keyframes slideUp {
                  from { transform: translateY(100%); }
                  to { transform: translateY(0); }
                }
                .animate-slide-up {
                  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
              `}</style>

              {showCardOtp ? (
                /* ==================== SCREEN 4: OTP VERIFICATION VIEW ==================== */
                <div className="flex flex-col flex-1 bg-[#121212] text-white">
                  {/* Close Top Bar */}
                  <div className="relative flex items-center justify-between px-6 py-5">
                    <button
                      onClick={() => setShowCardOtp(false)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="w-9 h-9" />
                  </div>

                  {/* Verification Form Content */}
                  <main className="flex-1 px-6 py-4 flex flex-col justify-between max-w-md mx-auto w-full">
                    <div className="space-y-4">
                      <h1 className="text-2xl font-black text-white tracking-tight">Send verification code</h1>
                      <p className="text-xs text-white/60 leading-relaxed">
                        We'll send a code to your phone number to verify your account.
                      </p>

                      {/* 6 OTP Code Slots */}
                      <div className="flex gap-2 justify-center py-4">
                        {[0, 1, 2, 3, 4, 5].map((idx) => (
                          <div
                            key={idx}
                            className={`w-11 h-14 rounded-xl border flex items-center justify-center text-lg font-bold bg-[#393939] transition-all duration-200 ${
                              cardOtp[idx] ? "border-primary text-white scale-105" : "border-white/10 text-white/30"
                            }`}
                          >
                            {cardOtp[idx] || ""}
                          </div>
                        ))}
                      </div>

                      {/* Resend Code Link */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => showToast("Kod qayta yuborildi!")}
                          className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                          Resent code
                        </button>
                      </div>
                    </div>

                    {/* Bottom Next Button & Keypad */}
                    <div className="space-y-6 pb-2">
                      <button
                        type="button"
                        disabled={cardOtp.some(digit => digit === "")}
                        onClick={() => {
                          const firstDigit = newCardNumber.charAt(0);
                          const cardType = firstDigit === "8" ? "uzcard" : "humo";
                          const masked = `**** **** **** ${newCardNumber.replace(/\s/g, "").slice(-4)}`;
                          
                          setUserCards((prev) => [
                            ...prev,
                            {
                              id: Date.now().toString(),
                              type: cardType,
                              number: masked,
                              name: fullName || "Alisher Raimov"
                            }
                          ]);
                          
                          // Reset & Success
                          showToast("Karta muvaffaqiyatli qo'shildi!");
                          setShowCardOtp(false);
                          setShowAddCard(false);
                          setNewCardNumber("");
                          setNewCardExpiry("");
                          setCardOtp(["", "", "", "", "", ""]);
                        }}
                        className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-98 shadow-lg ${
                          cardOtp.every(digit => digit !== "")
                            ? "bg-primary text-white shadow-primary/20 shadow-lg"
                            : "bg-primary/20 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>

                      {/* Custom Simulated Numeric Keypad matching screenshot 4 */}
                      <div className="grid grid-cols-3 gap-y-3.5 gap-x-5 px-4">
                        {[
                          { val: "1", sub: "" },
                          { val: "2", sub: "abc" },
                          { val: "3", sub: "def" },
                          { val: "4", sub: "ghi" },
                          { val: "5", sub: "jkl" },
                          { val: "6", sub: "mno" },
                          { val: "7", sub: "pqrs" },
                          { val: "8", sub: "tuv" },
                          { val: "9", sub: "wxyz" },
                          { val: "+*#", sub: "" },
                          { val: "0", sub: "" },
                          { val: "⌫", sub: "" }
                        ].map((btn, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleKeypadPress(btn.val)}
                            className="bg-[#2C2C2E] hover:bg-[#3A3A3C] active:bg-[#48484A] rounded-xl py-3 flex flex-col items-center justify-center transition-all duration-100"
                          >
                            <span className="text-xl font-bold leading-tight">{btn.val}</span>
                            {btn.sub && <span className="text-[9px] font-medium text-white/40 uppercase tracking-widest leading-none">{btn.sub}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </main>
                </div>
              ) : showAddCard ? (
                /* ==================== SCREEN 2 & 3: ADD CARD DETAILS VIEW ==================== */
                <div className="flex flex-col flex-1 bg-[#121212] text-white">
                  {/* Top Bar Header */}
                  <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <button
                      onClick={() => setShowAddCard(false)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-base font-bold text-white tracking-wide">Karta ma'lumotlari</h1>
                    <div className="w-9 h-9" />
                  </div>

                  {/* Form Content */}
                  <main className="flex-1 px-6 py-8 flex flex-col justify-between max-w-md mx-auto w-full">
                    <div className="space-y-6">
                      {/* Card Number field with internal orange icon */}
                      <div className="space-y-2">
                        <div className="relative flex items-center bg-[#393939] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 focus-within:border-primary/50">
                          <span className="pl-4 text-primary shrink-0">
                            <CreditCard className="h-5 w-5" />
                          </span>
                          <input
                            type="text"
                            value={newCardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="Karta raqami"
                            className="w-full pl-3 pr-4 py-4 bg-transparent text-sm text-white font-semibold tracking-wider outline-none placeholder:text-white/30"
                          />
                        </div>
                      </div>

                      {/* Expiry field */}
                      <div className="space-y-2">
                        <div className="relative flex items-center bg-[#393939] rounded-2xl border border-white/5 overflow-hidden w-36 transition-all duration-300 focus-within:border-primary/50">
                          <input
                            type="text"
                            value={newCardExpiry}
                            onChange={handleCardExpiryChange}
                            placeholder="OO/YY"
                            className="w-full px-4 py-4 bg-transparent text-sm text-white font-semibold tracking-widest text-center outline-none placeholder:text-white/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Submit Button */}
                    <div className="pb-8">
                      <button
                        type="button"
                        disabled={newCardNumber.length < 19 || newCardExpiry.length < 5}
                        onClick={() => {
                          setCardOtp(["", "", "", "", "", ""]);
                          setShowCardOtp(true);
                        }}
                        className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-98 shadow-lg ${
                          newCardNumber.length === 19 && newCardExpiry.length === 5
                            ? "bg-primary text-white shadow-primary/20 hover:bg-primary-hover"
                            : "bg-[#E25C00]/10 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        Tasdiqlash
                      </button>
                    </div>
                  </main>
                </div>
              ) : (
                /* ==================== SCREEN 1: CARDS LIST VIEW ==================== */
                <div className="flex flex-col flex-1 bg-[#121212] text-white">
                  {/* Top Bar Header */}
                  <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <button
                      onClick={() => setShowCards(false)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-base font-bold text-white tracking-wide">Sozlamalar</h1>
                    <div className="w-9 h-9" />
                  </div>

                  {/* Content Container */}
                  <main className="flex-1 overflow-y-auto px-6 py-8 pb-10 flex flex-col gap-6 max-w-md mx-auto w-full">
                    {/* Render existing cards */}
                    {userCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCardForDelete(card)}
                        className="w-full border border-white/15 bg-[#393939] rounded-[24px] p-6 flex flex-col justify-between h-44 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/55 cursor-pointer active:scale-98"
                      >
                        <div className="flex justify-between items-start">
                          {card.type === "humo" ? (
                            <img
                              src="/images/humo.png"
                              alt="Humo Card"
                              className="h-9 object-contain rounded"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-primary font-black uppercase text-sm tracking-widest">
                              <CreditCard className="h-7 w-7 text-white" />
                              <span>Uzcard</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <p className="text-white text-base font-semibold tracking-wide capitalize">
                            {card.name || fullName}
                          </p>
                          <p className="text-white text-base font-mono tracking-widest font-semibold">
                            {card.number}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Card 2: Empty Card with Add Button */}
                    <div className="w-full border border-white/10 bg-[#393939]/20 rounded-[24px] p-6 flex flex-col justify-between h-44 transition-all duration-300 hover:bg-[#393939]/30">
                      <div className="flex justify-between items-start text-white/60">
                        <CreditCard className="h-7 w-7" />
                      </div>
                      <div className="flex justify-start">
                        <button
                          type="button"
                          onClick={() => {
                            setNewCardNumber("");
                            setNewCardExpiry("");
                            setShowAddCard(true);
                          }}
                          className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-primary text-xs font-black">+</span>
                          <span>Karta qo'shish</span>
                        </button>
                      </div>
                    </div>
                  </main>

                  {/* Card Deletion Bottom Drawer (Sheet) matching Screenshot 1 */}
                  {selectedCardForDelete && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center transition-opacity duration-300 animate-fade-in">
                      <div className="absolute inset-0" onClick={() => setSelectedCardForDelete(null)} />
                      
                      <div className="w-full max-w-md bg-[#393939] rounded-t-[32px] px-6 pt-3 pb-8 flex flex-col items-center gap-4 z-10 animate-slide-up border-t border-white/5 relative">
                        {/* Notch indicator */}
                        <div className="w-12 h-1 bg-white/20 rounded-full mb-2" />
                        
                        {/* Title */}
                        <p className="text-white text-base font-bold tracking-wide">Bank kartasi</p>
                        
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const idToDelete = selectedCardForDelete.id;
                            setUserCards((prev) => prev.filter((c) => c.id !== idToDelete));
                            setSelectedCardForDelete(null);
                            showToast("Karta muvaffaqiyatli o'chirildi!");
                          }}
                          className="w-full py-4 rounded-2xl bg-[#E82C2C] hover:bg-red-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-red-600/10"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                          <span>Kartani olib tashlash</span>
                        </button>
                        
                        {/* Cancel Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedCardForDelete(null)}
                          className="w-full py-4 text-white/60 hover:text-white font-bold text-sm tracking-wide transition-all active:scale-98"
                        >
                          Ortga
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : showLanguages ? (
            /* ==================== HIGH-FIDELITY REGISTERED LANGUAGE SETTINGS VIEW ==================== */
            <div className="flex flex-col flex-1 bg-[#121212] text-white">
              {/* Top Bar Header */}
              <div className="relative flex items-center justify-between px-6 py-5">
                <button
                  onClick={() => setShowLanguages(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-base font-bold text-white tracking-wide">Til sozlamalari</h1>
                <div className="w-9 h-9" />
              </div>

              {/* Form Content */}
              <main className="flex-1 px-6 py-6 flex flex-col justify-between max-w-md mx-auto w-full">
                <div className="space-y-6">
                  {/* Subtitle */}
                  <div className="space-y-1 text-left">
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight">Ilovani o'zingizga qulay</h2>
                    <p className="text-xl font-bold text-white tracking-tight leading-tight text-white/95">tilda boshqaring</p>
                  </div>

                  {/* Language Options Grid */}
                  <div className="space-y-4">
                    {[
                      { code: "uz", label: "O'zbek tili", icon: "/icons/uzb.png" },
                      { code: "en", label: "Ingliz tili", icon: "/icons/eng.png" },
                      { code: "ru", label: "Rus tili", icon: "/icons/ru.png" }
                    ].map((opt) => {
                      const isSelected = tempLanguage === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => setTempLanguage(opt.code)}
                          className={`w-full flex items-center justify-between p-5 rounded-[20px] transition-all duration-200 active:scale-98 text-left ${
                            isSelected
                              ? "bg-primary text-white shadow-lg shadow-primary/20"
                              : "bg-[#393939] text-white hover:bg-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={opt.icon}
                              alt={opt.label}
                              className="w-10 h-10 object-cover rounded-full shadow-sm"
                            />
                            <span className="text-base font-bold tracking-wide">{opt.label}</span>
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Confirm Button */}
                <div className="pb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLang(tempLanguage);
                      setShowLanguages(false);
                      showToast("Til muvaffaqiyatli o'zgartirildi!");
                    }}
                    className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm tracking-wide transition-all active:scale-98 shadow-lg shadow-primary/20"
                  >
                    Tasdiqlash
                  </button>
                </div>
              </main>
            </div>
          ) : showMessages ? (
            /* ==================== HIGH-FIDELITY REGISTERED XABARLAR VIEW ==================== */
            <div className="flex flex-col flex-1 bg-[#121212] text-white animate-fade-in">
              {/* Top Bar Header */}
              <div className="relative flex items-center justify-between px-6 py-5">
                <button
                  onClick={() => setShowMessages(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-base font-bold text-white tracking-wide">Xabarlar</h1>
                <div className="w-9 h-9" />
              </div>

              {/* Form Content */}
              <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 max-w-md mx-auto w-full text-left">
                {/* Subtitle */}
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight leading-tight">Ilovamiz bo'yicha yangiliklarni</h2>
                  <p className="text-xl font-bold text-white/90 tracking-tight leading-tight text-white/95">kuzatib boring</p>
                </div>

                {/* Notifications Grouped List */}
                <div className="space-y-6">
                  {/* Group 1: Today */}
                  <div className="space-y-3.5">
                    <h3 className="text-base font-bold text-white tracking-wide">Today</h3>
                    
                    {/* Unread Card (warm brown tint, unread red dot) */}
                    <div className="w-full bg-[#221A15] border border-white/5 rounded-3xl p-5 flex items-start gap-4 relative shadow-lg">
                      {/* Red unread dot */}
                      <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[#E53E3E]" />
                      
                      {/* Stylized Logo circular container */}
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
                        <img
                          src="/logo-loading.png"
                          alt="B"
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      
                      {/* Content text */}
                      <div className="space-y-1 pr-2">
                        <h4 className="text-sm font-bold text-white leading-snug">
                          Bazmly just got better! 🚀
                        </h4>
                        <p className="text-xs text-white/80 leading-normal">
                          Check out our latest update now
                        </p>
                        <p className="text-[10px] text-white/45 font-semibold pt-1">
                          20.01.2026, 18:00
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-t border-white/5 my-1" />

                  {/* Group 2: This Week */}
                  <div className="space-y-3.5">
                    <h3 className="text-base font-bold text-white tracking-wide">This Week</h3>
                    
                    {/* Read Card 1 (dark grey bg) */}
                    <div className="w-full bg-[#393939] border border-white/5 rounded-3xl p-5 flex items-start gap-4 shadow-lg">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
                        <img
                          src="/logo-loading.png"
                          alt="B"
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white leading-snug">
                          Bazmly just got better! 🚀
                        </h4>
                        <p className="text-xs text-white/80 leading-normal">
                          Check out our latest update now
                        </p>
                        <p className="text-[10px] text-white/45 font-semibold pt-1">
                          20.01.2026, 18:00
                        </p>
                      </div>
                    </div>

                    {/* Read Card 2 (dark grey bg) */}
                    <div className="w-full bg-[#393939] border border-white/5 rounded-3xl p-5 flex items-start gap-4 shadow-lg">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
                        <img
                          src="/logo-loading.png"
                          alt="B"
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white leading-snug">
                          Bazmly just got better! 🚀
                        </h4>
                        <p className="text-xs text-white/80 leading-normal">
                          Check out our latest update now
                        </p>
                        <p className="text-[10px] text-white/45 font-semibold pt-1">
                          20.01.2026, 18:00
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-t border-white/5 my-1" />

                  {/* Group 3: This Month */}
                  <div className="space-y-3.5">
                    <h3 className="text-base font-bold text-white tracking-wide">This Month</h3>

                    {/* Read Card 3 (dark grey bg, different date) */}
                    <div className="w-full bg-[#393939] border border-white/5 rounded-3xl p-5 flex items-start gap-4 shadow-lg">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
                        <img
                          src="/logo-loading.png"
                          alt="B"
                          className="w-7 h-7 object-contain"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white leading-snug">
                          Bazmly just got better! 🚀
                        </h4>
                        <p className="text-xs text-white/80 leading-normal">
                          Check out our latest update now
                        </p>
                        <p className="text-[10px] text-white/45 font-semibold pt-1">
                          12.01.2026, 15:30
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          ) : showHistory ? (
            /* ==================== HIGH-FIDELITY REGISTERED BOOKINGS HISTORY VIEW ==================== */
            <div className="flex flex-col flex-1 bg-[#121212] text-white">
              {/* Top Bar Header */}
              <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h1 className="text-xl font-bold text-white tracking-wide">Band qilingan</h1>
                </div>
                
                {/* Location pin with Toshkent */}
                <div className="flex items-center gap-1.5 text-xs text-white/80 font-semibold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>Toshkent</span>
                </div>
              </div>

              {/* Scrollable Bookings List */}
              <main className="flex-1 overflow-y-auto px-6 py-6 pb-2 flex flex-col gap-6 max-w-md mx-auto w-full text-left">
                {[
                  { id: "1", showBanner: true },
                  { id: "2", showBanner: false }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="w-full bg-[#393939] border border-white/5 rounded-3xl p-5 flex flex-col gap-4 shadow-xl transition-all duration-300 hover:border-white/10"
                  >
                    {/* Top Restaurant Detail */}
                    <div className="flex items-start gap-4">
                      {/* Rounded restaurant image */}
                      <img
                        src="/images/restaurant.png"
                        alt="Rest One"
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/5 shadow-md"
                      />
                      
                      <div className="space-y-1 pr-1 w-full min-w-0">
                        <h2 className="text-base font-bold text-white tracking-wide truncate">Rest One</h2>
                        
                        {/* Distance & Status info */}
                        <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>1 km</span>
                          <span className="text-white/20">|</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                          <span className="text-[#10B981] font-bold">Ochiq</span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                          <Phone className="h-3.5 w-3.5 text-white/40 shrink-0" />
                          <span>+998 99 123 45 67</span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium truncate">
                          <MapPin className="h-3.5 w-3.5 text-white/40 shrink-0" />
                          <span className="truncate">Umid qo'rg'oni 765 - uy</span>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Divider */}
                    <hr className="border-t border-white/5" />

                    {/* Booking metadata table */}
                    <div className="space-y-2.5 text-xs font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Holat</span>
                        <span className="text-white font-bold">Band qilish tasdiqlandi</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Chek raqami:</span>
                        <span className="text-white/90 font-mono">0789 091172</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Belgilandi:</span>
                        <span className="text-white/90">11:00 • 26/02/2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Stol raqami:</span>
                        <span className="text-white/90">4 - stol</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40">Restoran raqami:</span>
                        <span className="text-white/90">+998 99 123 45 67</span>
                      </div>
                    </div>

                    {/* Bottom orange banner with clock for Card 1 */}
                    {item.showBanner && (
                      <div className="w-full bg-[#FF6B00] rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-md animate-pulse">
                        <span>Qoldi:</span>
                        <Clock className="h-4.5 w-4.5 shrink-0" />
                        <span>2 soat 25 daqiqa</span>
                      </div>
                    )}
                  </div>
                ))}
              </main>
            </div>
          ) : showHelp ? (
            /* ==================== HIGH-FIDELITY REGISTERED YORDAM (HELP) VIEW ==================== */
            <div className="flex flex-col flex-1 bg-[#121212] text-white animate-fade-in">
              {/* Top Bar Header */}
              <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowHelp(false);
                      setOpenFaq(null);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h1 className="text-xl font-bold text-white tracking-wide">Yordam markazi</h1>
                </div>
              </div>

              {/* Scrollable Help Content */}
              <main className="flex-1 overflow-y-auto px-6 py-6 pb-8 flex flex-col gap-6 max-w-md mx-auto w-full text-left">
                {/* Hero Card */}
                <div className="w-full bg-gradient-to-br from-[#393939] to-[#252528] border border-white/5 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-white tracking-wide">Qanday yordam bera olamiz?</h2>
                    <p className="text-xs text-white/60 leading-relaxed font-medium">
                      BAZMLY ilovasi orqali marosim zallari, restoran va shou-dasturlarni onlayn, xavfsiz va eng yaxshi narxlarda bron qilish bo'yicha savollaringizga javob oling.
                    </p>
                  </div>
                </div>

                {/* FAQ Header */}
                <div className="space-y-1 mt-1">
                  <h3 className="text-base font-bold text-white tracking-wide">Tez-tez beriladigan savollar</h3>
                  <p className="text-xs text-white/40 font-medium">Eng ko'p beriladigan savollarga javoblar</p>
                </div>

                {/* FAQ Accordions List */}
                <div className="space-y-3">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="w-full bg-[#393939] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-md"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left transition-colors hover:bg-white/5"
                        >
                          <span className="text-xs font-bold text-white/90 leading-snug">{faq.q}</span>
                          <ChevronDown className={`h-4.5 w-4.5 text-white/40 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                        </button>
                        
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen ? "max-h-[160px] border-t border-white/5" : "max-h-0"
                          }`}
                        >
                          <p className="px-5 py-4 text-xs text-white/60 leading-relaxed font-medium bg-[#161618]">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Support Contact Section */}
                <div className="w-full bg-[#221A15] border border-[#FF6B00]/10 rounded-3xl p-5 flex flex-col gap-4 shadow-xl mt-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white tracking-wide">Savolingizga javob topmadingizmi?</h4>
                    <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                      Bizning mijozlarni qo'llab-quvvatlash xizmati mutaxassislarimiz haftada 7 kun, 24 soat davomida sizga tezkor yordam berishga tayyor.
                    </p>
                  </div>
                  
                  <a
                    href="https://t.me/bazmly_support"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#E05000] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-[#FF6B00]/20"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.82-.77 4.47-1.09 6.16-.13.72-.4 1-.66 1.03-.57.05-1-.38-1.55-.74-.86-.57-1.34-.86-2.18-1.41-.97-.64-.34-.99.21-1.56.14-.15 2.65-2.42 2.7-2.63.01-.03.01-.13-.05-.18-.06-.05-.14-.03-.21-.02-.09.02-1.54.98-4.36 2.88-.41.28-.79.42-1.12.41-.37-.01-1.08-.21-1.61-.38-.65-.21-1.17-.32-1.12-.68.02-.19.28-.38.77-.57 3.01-1.31 5.02-2.18 6.03-2.6 2.87-1.19 3.47-1.4 3.86-1.4.08 0 .28.02.4.12.1.09.13.21.14.31.01.07-.01.2-.02.26z"/>
                    </svg>
                    <span>Qo'llab-quvvatlash xizmati (Telegram)</span>
                  </a>
                </div>
              </main>
            </div>
          ) : isEditing ? (
            /* ==================== HIGH-FIDELITY REGISTERED EDIT PROFILE VIEW ==================== */
            <div className="flex flex-col flex-1">
              {/* Custom Top Bar Header matching screenshot */}
              <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/5">
                <button
                  onClick={handleSaveProfile}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-base font-bold text-white tracking-wide">Sozlamalar</h1>
                <div className="w-9 h-9" />
              </div>

              {/* Content Container */}
              <main className="flex-1 overflow-y-auto px-6 py-8 pb-10 flex flex-col items-center max-w-md mx-auto w-full">
                {/* Circle Avatar with Camera/Plus icon */}
                <div className="relative mb-8 mt-2">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl bg-zinc-800">
                    <img
                      src="/images/profil.jpg"
                      alt="User Portrait"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white text-zinc-800 p-2.5 rounded-full shadow-lg border border-white/10 cursor-pointer hover:bg-zinc-100 transition-colors flex items-center justify-center">
                    <svg className="h-4.5 w-4.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                      <line x1="21" y1="10" x2="21" y2="6"/>
                      <line x1="19" y1="8" x2="23" y2="8"/>
                    </svg>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="w-full space-y-5">
                  {/* Name field */}
                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-semibold text-zinc-400">Ism/Familiya</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Alisher Raimov"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-[#393939] text-sm text-white font-medium outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-semibold text-zinc-400">Telefon raqam</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+998 99 219 19 55"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-[#393939] text-sm text-white font-medium outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Location field */}
                  <div className="space-y-2 text-left">
                    <label className="block text-xs font-semibold text-zinc-400">Manzil</label>
                    <div className="relative">
                      <select
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full px-4 py-3.5 pr-10 rounded-xl border border-white/10 bg-[#393939] text-sm text-white font-medium outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="Tashkent, Tashkent city">Toshkent</option>
                        <option value="Samarkand, Samarkand region">Samarqand</option>
                        <option value="Bukhara, Bukhara region">Buxoro</option>
                        <option value="Andijan, Andijan region">Andijon</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                        <ChevronDown className="h-4.5 w-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="pt-2">
                    <span className="block text-red-400 text-xs font-semibold uppercase tracking-wider text-left mb-2">
                      Xavfli zona
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveModal("delete_account")}
                      className="w-full bg-[#393939] border border-white/10 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-[#252528] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                          <Trash2 className="h-4.5 w-4.5" />
                        </span>
                        <span className="text-sm font-bold text-white/90">Akkauntni o'chirish</span>
                      </div>
                      <ChevronRight className="h-4.5 w-4.5 text-white/30" />
                    </button>
                  </div>
                </div>
              </main>
            </div>
          ) : (
            /* ==================== REGISTERED DASHBOARD VIEW ==================== */
            <>
              <Navbar />

              <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 pb-10 max-w-md mx-auto w-full">
                {/* Header Title */}
                <h1 className="text-xl font-black text-white mb-6">
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

                  <div className="mt-5 space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      {fullName || "Alisher Raimov"}
                    </h2>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{location.split(",")[0]}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3.5 w-full max-w-xs mt-6">
                    <button
                      onClick={() => {
                        setEditName(fullName);
                        setEditLocation(location);
                        setEditPhone(phone || "+998 99 219 19 55");
                        setIsEditing(true);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 text-xs font-bold text-white hover:bg-[#252528] transition-all active:scale-95 shadow-sm"
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
                <div className="w-full border border-white/10 rounded-2xl bg-black/80 shadow-2xl overflow-hidden p-2 space-y-1 glass-effect">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isChiqish = item.label === "Chiqish";
                    return (
                      <button
                        key={index}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl text-white/90 hover:bg-white/5 active:bg-white/10 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`p-2 rounded-xl border transition-colors ${
                            isChiqish
                              ? "bg-red-500/10 border-red-500/20 text-red-500"
                              : "bg-white/5 border-white/5 text-white/80 group-hover:text-primary group-hover:border-primary/20"
                          }`}>
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          <span className={`text-sm font-bold tracking-wide ${
                            isChiqish ? "text-red-500/90 font-black" : ""
                          }`}>{item.label}</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-white/30 group-hover:translate-x-0.5 transition-transform ${
                          isChiqish ? "text-red-500/40 group-hover:text-red-500" : ""
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </main>
            </>
          )}

          {/* ==================== SETTINGS MODALS ==================== */}
          {activeModal && activeModal !== "logout_profile" && activeModal !== "delete_account" && (
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

          {/* Profildan Chiqish Bottom Sheet Modal matching Screenshot 2 (left) */}
          {activeModal === "logout_profile" && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center transition-opacity duration-300 animate-fade-in">
              <div className="absolute inset-0" onClick={() => setActiveModal(null)} />
              
              <div className="w-full max-w-md bg-[#393939] rounded-t-[32px] px-6 pt-3 pb-8 flex flex-col items-center gap-4 z-10 animate-slide-up border-t border-white/5 relative">
                {/* Notch indicator */}
                <div className="w-12 h-1 bg-white/20 rounded-full mb-2" />
                
                {/* Title */}
                <p className="text-white text-base font-bold tracking-wide">Profildan chiqmoqchimisiz?</p>
                
                {/* Red Profile Logout Button with logout icon */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    handleLogout();
                  }}
                  className="w-full py-4 rounded-2xl bg-[#E82C2C] hover:bg-red-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-red-600/10"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Profildan chiqish</span>
                </button>
                
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-4 text-white/60 hover:text-white font-bold text-sm tracking-wide transition-all active:scale-98"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}

          {/* Akkauntni O'chirish Bottom Sheet Modal matching Screenshot 2 (right) */}
          {activeModal === "delete_account" && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center transition-opacity duration-300 animate-fade-in">
              <div className="absolute inset-0" onClick={() => setActiveModal(null)} />
              
              <div className="w-full max-w-md bg-[#393939] rounded-t-[32px] px-6 pt-3 pb-8 flex flex-col items-center gap-4 z-10 animate-slide-up border-t border-white/5 relative">
                {/* Notch indicator */}
                <div className="w-12 h-1 bg-white/20 rounded-full mb-2" />
                
                {/* Title */}
                <p className="text-white text-base font-bold tracking-wide">Akkauntdan chiqmoqchimisiz?</p>
                
                {/* Red Account Delete Button with trash icon */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    handleLogout();
                  }}
                  className="w-full py-4 rounded-2xl bg-[#E82C2C] hover:bg-red-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-red-600/10"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  <span>Akkauntni o'chirish</span>
                </button>
                
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-4 text-white/60 hover:text-white font-bold text-sm tracking-wide transition-all active:scale-98"
                >
                  Bekor qilish
                </button>
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
