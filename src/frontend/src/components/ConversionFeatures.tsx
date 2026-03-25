import { useEffect, useRef, useState } from "react";

// ============================================================
// COUNTDOWN TO MIDNIGHT (for service card urgency)
// ============================================================
export function MidnightCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="text-[10px] font-bold mt-1.5 flex items-center gap-1"
      style={{ color: "#ff6a00" }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: "#ff6a00", boxShadow: "0 0 4px #ff6a00" }}
      />
      Offer ends: {timeLeft}
    </div>
  );
}

// ============================================================
// SOCIAL PROOF NOTIFICATIONS
// ============================================================
const NOTIFICATIONS = [
  { name: "Ravi", city: "Mumbai", service: "Website Design", amount: "₹7,999" },
  {
    name: "Priya",
    city: "Delhi",
    service: "AI Chatbot Setup",
    amount: "₹7,999",
  },
  {
    name: "Ankit",
    city: "Bangalore",
    service: "Full SEO Package",
    amount: "₹19,999",
  },
  {
    name: "Deepa",
    city: "Hyderabad",
    service: "Full Email Funnel",
    amount: "₹8,999",
  },
  {
    name: "Sanjay",
    city: "Chennai",
    service: "Google Ads Setup",
    amount: "₹6,999",
  },
  {
    name: "Meera",
    city: "Pune",
    service: "Brand Identity Kit",
    amount: "₹7,999",
  },
  {
    name: "Kiran",
    city: "Ahmedabad",
    service: "CRM Automation",
    amount: "₹9,999",
  },
  {
    name: "Pooja",
    city: "Kolkata",
    service: "Social Media Mgmt",
    amount: "₹14,999",
  },
  {
    name: "Ajay",
    city: "Jaipur",
    service: "Lead Gen Funnel",
    amount: "₹14,999",
  },
  { name: "Sneha", city: "Surat", service: "E-commerce SEO", amount: "₹9,999" },
];

const ACTIONS = [
  "just purchased",
  "just paid for",
  "completed checkout —",
  "just started —",
];

export function SocialProofNotifications() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't show on mobile
    if (window.innerWidth < 640) return;

    function show(idx: number) {
      setCurrent(idx);
      setVisible(true);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        timerRef.current = setTimeout(
          () => show((idx + 1) % NOTIFICATIONS.length),
          Math.floor(Math.random() * 10000) + 20000,
        );
      }, 4000);
    }

    timerRef.current = setTimeout(() => show(0), 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const n = NOTIFICATIONS[current];
  const action = ACTIONS[current % ACTIONS.length];

  return (
    <div
      className="fixed bottom-24 left-4 z-[80] hidden sm:block"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120px)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl max-w-xs"
        style={{
          background: "rgba(11,11,15,0.95)",
          border: "1px solid rgba(0,255,198,0.3)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,198,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#00ffc6,#00a896)",
            color: "#0b0b0f",
          }}
        >
          {n.name[0]}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold" style={{ color: "#fff" }}>
            {n.name} from {n.city}
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            {action} <span style={{ color: "#00ffc6" }}>{n.service}</span>
          </div>
          <div
            className="text-xs font-bold mt-0.5"
            style={{ color: "#ff6a00" }}
          >
            {n.amount} ✓
          </div>
        </div>
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
          style={{ background: "#25d366", boxShadow: "0 0 6px #25d366" }}
        />
      </div>
    </div>
  );
}

// ============================================================
// EXIT INTENT POPUP
// ============================================================
interface ExitIntentPopupProps {
  grandTotal?: number;
  onClaim: (discountPct: number) => void;
}

export function ExitIntentPopup({ grandTotal, onClaim }: ExitIntentPopupProps) {
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const triggered = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("exitIntentShown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 50 && !triggered.current) {
        triggered.current = true;
        sessionStorage.setItem("exitIntentShown", "1");
        setShow(true);
      }
    };

    // Also trigger on back button / navigation intent
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [show]);

  if (!show) return null;

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timer = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const discountedAmount = grandTotal ? Math.round(grandTotal * 0.9) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl p-8 text-center"
        style={{
          background:
            "linear-gradient(145deg,rgba(11,11,15,0.99),rgba(20,20,28,0.99))",
          border: "2px solid rgba(0,255,198,0.4)",
          boxShadow:
            "0 0 80px rgba(0,255,198,0.15), 0 40px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Glow orbs */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(0,255,198,0.3),transparent 70%)",
          }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          ✕
        </button>

        {/* Badge */}
        <div
          className="inline-block text-xs font-black px-4 py-1.5 rounded-full mb-4"
          style={{
            background: "linear-gradient(135deg,#ff6a00,#ff9500)",
            color: "#fff",
          }}
        >
          🔥 EXCLUSIVE EXIT OFFER — DON'T MISS THIS
        </div>

        <h2 className="text-2xl font-black mb-3" style={{ color: "#fff" }}>
          Wait! Don&apos;t Leave Without Your
          <span style={{ color: "#00ffc6" }}> EXCLUSIVE Discount</span>
        </h2>

        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>
          You&apos;re so close! Complete your order now and get an extra{" "}
          <strong style={{ color: "#ff6a00" }}>10% OFF</strong> — valid for the
          next 10 minutes only.
        </p>

        {/* Coupon code */}
        <div
          className="inline-flex items-center gap-3 px-5 py-3 rounded-xl mb-5"
          style={{
            background: "rgba(0,255,198,0.08)",
            border: "2px dashed rgba(0,255,198,0.5)",
          }}
        >
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            Your code:
          </span>
          <span
            className="text-lg font-black tracking-widest"
            style={{ color: "#00ffc6" }}
          >
            EXITQB10
          </span>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div
            className="text-xs mb-1"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Offer expires in:
          </div>
          <div
            className="text-3xl font-black tracking-widest font-mono"
            style={{ color: timeLeft < 60 ? "#ff6a00" : "#00ffc6" }}
          >
            {timer}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          data-ocid="exit_intent.claim_button"
          onClick={() => {
            setShow(false);
            onClaim(10);
          }}
          className="w-full py-4 rounded-2xl font-black text-lg mb-3 cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#ff6a00,#ff9500)",
            color: "#fff",
            boxShadow: "0 0 40px rgba(255,106,0,0.5)",
            animation: "pulse-btn 2s infinite",
          }}
        >
          ⚡ Claim 10% OFF &amp; Pay Now
          {discountedAmount && (
            <span className="block text-sm font-normal mt-0.5 opacity-90">
              Pay only ₹{discountedAmount.toLocaleString("en-IN")} instead
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShow(false)}
          className="text-xs cursor-pointer"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          No thanks, I&apos;ll pay full price
        </button>
      </div>
    </div>
  );
}

// ============================================================
// TRUST TICKER STRIP
// ============================================================
const TRUST_ITEMS = [
  "🔒 256-bit SSL Encryption",
  "✅ 500+ Businesses Served",
  "⭐ 4.9/5 Average Rating",
  "🔄 7-Day Money Back",
  "💯 100% Satisfaction Guarantee",
  "⚡ Delivery in 1–7 Days",
  "🏆 Top AI Agency India",
  "🔐 Razorpay Secured",
  "🚀 Results in 7 Days",
  "💬 24/7 WhatsApp Support",
];

export function TrustTicker() {
  return (
    <div
      className="overflow-hidden relative py-2.5"
      style={{
        background: "rgba(0,255,198,0.04)",
        borderTop: "1px solid rgba(0,255,198,0.15)",
        borderBottom: "1px solid rgba(0,255,198,0.15)",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg,#0b0b0f,transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg,#0b0b0f,transparent)" }}
      />

      <div
        className="trust-ticker-inner flex gap-8 whitespace-nowrap"
        style={{ animation: "trust-scroll 30s linear infinite" }}
      >
        {Array.from({ length: 2 }, (_, gi) =>
          TRUST_ITEMS.map((item, ii) => ({ item, k: `${gi}-${ii}` })),
        )
          .flat()
          .map(({ item, k }) => (
            <span
              key={k}
              className="text-xs font-bold flex-shrink-0 flex items-center gap-1.5"
              style={{ color: "#00ffc6" }}
            >
              {item}
              <span style={{ color: "rgba(0,255,198,0.3)", marginLeft: 8 }}>
                ·
              </span>
            </span>
          ))}
      </div>
    </div>
  );
}
