import { useEffect, useRef } from "react";

interface ThankYouPageProps {
  paymentId: string;
  itemName: string;
  onBack: () => void;
}

export default function ThankYouPage({
  paymentId,
  itemName,
  onBack,
}: ThankYouPageProps) {
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const whatsappText = encodeURIComponent(
    `Hi Quick Bee Agency! I just completed payment for: ${itemName}. Payment ID: ${paymentId}. Looking forward to getting started!`,
  );

  return (
    <div
      ref={topRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center relative"
      style={{ background: "#0b0b0f", color: "#fff" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%,rgba(0,255,198,0.08),transparent 65%)",
        }}
      />

      <div className="relative mb-8">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,255,198,0.15),rgba(0,168,150,0.1))",
            border: "2px solid rgba(0,255,198,0.4)",
            boxShadow:
              "0 0 60px rgba(0,255,198,0.25),inset 0 0 30px rgba(0,255,198,0.05)",
          }}
        >
          <span style={{ fontSize: 56 }}>✅</span>
        </div>
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: "1px solid rgba(0,255,198,0.2)",
            animationDuration: "2s",
          }}
        />
      </div>

      <div
        className="text-4xl md:text-6xl font-black mb-4"
        style={{ color: "#00ffc6" }}
      >
        Payment Successful!
      </div>
      <div
        className="text-lg md:text-xl mb-2"
        style={{ color: "rgba(255,255,255,0.8)" }}
      >
        Thank you for choosing Quick Bee Agency.
      </div>
      <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
        Service: <span style={{ color: "#fff" }}>{itemName}</span>
      </div>

      {paymentId && (
        <div
          className="mb-8 px-5 py-3 rounded-xl text-xs"
          style={{
            background: "rgba(0,255,198,0.07)",
            border: "1px solid rgba(0,255,198,0.2)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Payment ID:{" "}
          <span style={{ color: "#00ffc6", fontFamily: "monospace" }}>
            {paymentId}
          </span>
        </div>
      )}

      <div
        className="max-w-lg w-full rounded-2xl p-6 mb-8 text-left"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,255,198,0.15)",
        }}
      >
        <div className="font-bold text-base mb-4" style={{ color: "#00ffc6" }}>
          What Happens Next
        </div>
        <div className="space-y-3">
          {[
            { icon: "📧", text: "Confirmation email sent to your inbox" },
            {
              icon: "💬",
              text: "Our team contacts you within 12 hours via WhatsApp",
            },
            {
              icon: "🚀",
              text: "Work begins immediately — updates at every step",
            },
            {
              icon: "🎁",
              text: "Free 30-min strategy call scheduled within 24 hours",
            },
          ].map((s) => (
            <div
              key={s.icon}
              className="flex gap-3 text-sm"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              <span className="text-lg flex-shrink-0">{s.icon}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <a
          href={`https://wa.me/919182768591?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer"
          style={{
            background: "#25d366",
            color: "#fff",
            boxShadow: "0 0 20px rgba(37,211,102,0.35)",
          }}
        >
          💬 Message Us on WhatsApp
        </a>
        <button
          type="button"
          data-ocid="thankyou.home_button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer"
          style={{
            background: "rgba(0,255,198,0.1)",
            border: "1px solid rgba(0,255,198,0.3)",
            color: "#00ffc6",
          }}
        >
          ← Back to Home
        </button>
      </div>

      <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        © 2025 Quick Bee Agency · Uma Nagar, Old Town, Anantapur
      </div>
    </div>
  );
}
