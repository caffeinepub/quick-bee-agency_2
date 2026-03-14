import { useEffect, useRef, useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import CustomCursor from "./CustomCursor";
import type { EnterprisePlan, Service } from "./ServicesData";
import { getServiceOffer } from "./ServicesSection";

interface CheckoutPageProps {
  service?: Service;
  services?: Service[];
  plan?: EnterprisePlan;
  onBack: () => void;
  onPaymentSuccess: (paymentId: string, itemName: string) => void;
}

const FAQS = [
  {
    q: "Is hosting included?",
    a: "Domain & hosting guidance is included. We recommend top providers and assist with full setup.",
  },
  {
    q: "Is domain included?",
    a: "Domain registration advice is included. We'll guide you to register the perfect domain.",
  },
  {
    q: "How long is delivery?",
    a: "Most services are delivered in 1–7 days. Your specific timeline is shown above.",
  },
  {
    q: "Can I request changes?",
    a: "Yes — free revisions are included. We work until you are 100% satisfied.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "We offer a 7-day money-back guarantee. No questions asked refund if you're not happy.",
  },
  {
    q: "How do I get started after payment?",
    a: "We contact you within 12 hours via WhatsApp/email and begin immediately.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    company: "TechStartup India",
    rating: 5,
    text: "Incredible results — our revenue doubled in 3 months after using Quick Bee Agency.",
  },
  {
    name: "Priya Mehta",
    company: "FashionBrand Co.",
    rating: 5,
    text: "Professional, fast, and results-driven. The ROI has been outstanding.",
  },
  {
    name: "Anil Kumar",
    company: "RestaurantChain",
    rating: 5,
    text: "Our online bookings went up 300%. Best investment we made this year.",
  },
];

const UPSELLS = [
  {
    name: "SEO Starter Pack",
    price: 4999,
    icon: "🔍",
    desc: "Rank on Google Page 1",
  },
  {
    name: "Logo & Brand Kit",
    price: 2999,
    icon: "🎨",
    desc: "Professional brand identity",
  },
  {
    name: "Hosting Setup",
    price: 1999,
    icon: "🖥️",
    desc: "Fast & secure hosting",
  },
  {
    name: "Monthly Maintenance",
    price: 3999,
    icon: "🔧",
    desc: "Ongoing support & updates",
  },
];

const BONUSES = [
  {
    icon: "🎁",
    title: "FREE 30-Min Strategy Call",
    value: "₹5,000",
    desc: "Personal growth session with our senior consultant",
  },
  {
    icon: "📋",
    title: "Business Launch Checklist",
    value: "₹1,999",
    desc: "Step-by-step 90-day launch plan PDF",
  },
  {
    icon: "🎨",
    title: "Brand Identity Starter Kit",
    value: "₹2,999",
    desc: "Logo variations, colour palette & font guide",
  },
  {
    icon: "📧",
    title: "Email Templates Pack (10)",
    value: "₹1,499",
    desc: "Proven high-conversion email templates",
  },
  {
    icon: "📊",
    title: "Competitor Analysis Report",
    value: "₹3,499",
    desc: "Full competitor breakdown for your niche",
  },
  {
    icon: "🔍",
    title: "SEO Keyword Research Sheet",
    value: "₹999",
    desc: "200+ ranked keywords for your industry",
  },
  {
    icon: "💬",
    title: "WhatsApp Script Templates",
    value: "₹799",
    desc: "Closing scripts proven to convert leads",
  },
  {
    icon: "🎥",
    title: "Video Sales Script",
    value: "₹1,999",
    desc: "Done-for-you VSL script for your service",
  },
];

const EXTRA_FEATURES = [
  {
    id: "f1",
    icon: "🎯",
    name: "Priority 24/7 Support",
    desc: "Dedicated support agent round the clock",
    price: 2999,
  },
  {
    id: "f2",
    icon: "📊",
    name: "Advanced Analytics Dashboard",
    desc: "Real-time insights, heatmaps & conversion tracking",
    price: 3999,
  },
  {
    id: "f3",
    icon: "🌐",
    name: "Custom Domain Setup",
    desc: "Professional domain + DNS configuration",
    price: 1499,
  },
  {
    id: "f4",
    icon: "🔒",
    name: "SSL Certificate",
    desc: "Enterprise-grade HTTPS & security seal",
    price: 999,
  },
  {
    id: "f5",
    icon: "⚡",
    name: "Speed Optimisation Pack",
    desc: "Sub-2s load time, CDN & caching setup",
    price: 2499,
  },
  {
    id: "f6",
    icon: "📱",
    name: "Mobile App Version",
    desc: "PWA / Android lite version of your platform",
    price: 9999,
  },
  {
    id: "f7",
    icon: "🤝",
    name: "CRM Integration",
    desc: "Sync leads to HubSpot / Zoho / custom CRM",
    price: 4999,
  },
  {
    id: "f8",
    icon: "📧",
    name: "Email Marketing Setup",
    desc: "Drip campaigns, sequences & automation",
    price: 3499,
  },
  {
    id: "f9",
    icon: "📲",
    name: "Social Media Integration",
    desc: "Auto-post to Instagram, FB, LinkedIn & more",
    price: 2999,
  },
  {
    id: "f10",
    icon: "💬",
    name: "WhatsApp Business API",
    desc: "Automated replies, broadcast & catalogue",
    price: 5999,
  },
  {
    id: "f11",
    icon: "🤖",
    name: "AI Chatbot Integration",
    desc: "GPT-powered chatbot trained on your business",
    price: 6999,
  },
  {
    id: "f12",
    icon: "💳",
    name: "Payment Gateway Setup",
    desc: "Razorpay / Stripe with full checkout flow",
    price: 2999,
  },
  {
    id: "f13",
    icon: "🔍",
    name: "Full SEO Audit & Fix",
    desc: "Technical SEO, schema markup & on-page fixes",
    price: 4499,
  },
  {
    id: "f14",
    icon: "✍️",
    name: "Content Writing (5 Pages)",
    desc: "SEO-optimised copy by expert writers",
    price: 3999,
  },
  {
    id: "f15",
    icon: "🎨",
    name: "Logo & Brand Identity Kit",
    desc: "Logo, colours, fonts & brand guidelines",
    price: 2499,
  },
  {
    id: "f16",
    icon: "📈",
    name: "Monthly Reports & Analytics",
    desc: "Detailed growth report delivered every month",
    price: 1999,
  },
];

const ALL_FEATURES_TOTAL = EXTRA_FEATURES.reduce((s, f) => s + f.price, 0);

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <span key={n} style={{ color: "#fbbf24" }}>
          ★
        </span>
      ))}
    </span>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(0,255,198,0.1)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-semibold cursor-pointer"
        style={{ background: "rgba(255,255,255,0.03)", color: "#fff" }}
      >
        {q}
        <span style={{ color: "#00ffc6", flexShrink: 0, marginLeft: 8 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div
          className="px-4 py-3 text-sm"
          style={{
            color: "rgba(255,255,255,0.6)",
            background: "rgba(0,255,198,0.02)",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage({
  service,
  services,
  plan,
  onBack,
  onPaymentSuccess,
}: CheckoutPageProps) {
  const { openPayment } = useRazorpay();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    notes: "",
  });
  const [paying, setPaying] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(
    new Set(),
  );
  const [halfOff, setHalfOff] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  // Multi-service mode: when "services" array is passed (cart checkout)
  const isMulti = !service && !plan && services && services.length > 0;
  const itemName = isMulti
    ? `${services!.length} Services Bundle`
    : service
      ? service.name
      : plan
        ? plan.name
        : "";
  const rawPrice = isMulti
    ? services!.reduce((t, s) => t + s.price, 0)
    : service
      ? service.price
      : plan
        ? Number.parseInt(plan.price.replace(/[^0-9]/g, ""), 10)
        : 0;
  const displayPrice = `₹${rawPrice.toLocaleString("en-IN")}`;
  const features = isMulti
    ? services!.flatMap((s) => s.features).slice(0, 16)
    : service
      ? service.features
      : plan
        ? plan.features
        : [];
  const deliveryTime = isMulti
    ? "5–7 Days"
    : service
      ? service.deliveryTime
      : "Custom Timeline";
  const offer = service ? getServiceOffer(service) : null;

  const upsellsTotal = UPSELLS.filter((u) =>
    selectedUpsells.has(u.name),
  ).reduce((s, u) => s + u.price, 0);
  const subtotal = rawPrice + upsellsTotal;
  const grandTotal = halfOff ? Math.round(subtotal * 0.5) : subtotal;

  const toggleUpsell = (name: string) => {
    setSelectedUpsells((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone) {
      setFormError("Please fill Name, Email, and Phone to continue.");
      return;
    }
    setFormError("");
    setPaying(true);
    const upsellNames = UPSELLS.filter((u) => selectedUpsells.has(u.name))
      .map((u) => u.name)
      .join(", ");
    const description = upsellNames
      ? `${itemName} + Add-ons: ${upsellNames}`
      : itemName;
    try {
      await openPayment({
        amount: grandTotal * 100,
        name: "Quick Bee Agency",
        description,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        onSuccess: (pid) => {
          setPaying(false);
          onPaymentSuccess(pid, itemName);
        },
        onDismiss: () => setPaying(false),
      });
    } catch {
      setPaying(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hi Quick Bee Agency! I'm interested in: ${itemName} (${displayPrice}). My name is ${form.name || "[Name]"}. Please help me get started.`,
  );

  return (
    <div
      ref={topRef}
      className="min-h-screen"
      style={{ background: "#0b0b0f", color: "#fff", fontFamily: "inherit" }}
    >
      {/* Custom cursor on checkout page */}
      <CustomCursor />

      {/* Back bar */}
      <div
        className="sticky top-0 z-40 flex items-center gap-4 px-4 py-3"
        style={{
          background: "rgba(11,11,15,0.97)",
          borderBottom: "1px solid rgba(0,255,198,0.15)",
        }}
      >
        <button
          type="button"
          data-ocid="checkout.back_button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer"
          style={{
            background: "rgba(0,255,198,0.08)",
            border: "1px solid rgba(0,255,198,0.25)",
            color: "#00ffc6",
          }}
        >
          ← Back
        </button>
        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Secure Checkout
        </span>
        <div
          className="ml-auto flex items-center gap-2 text-xs"
          style={{ color: "#00ffc6" }}
        >
          <span>🔒</span>
          <span>SSL Secured</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div
          className="rounded-2xl p-6 md:p-10 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,255,198,0.07),rgba(255,106,0,0.05))",
            border: "1px solid rgba(0,255,198,0.2)",
            boxShadow: "0 0 60px rgba(0,255,198,0.06)",
          }}
        >
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(0,255,198,0.12),transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(255,106,0,0.1),transparent 70%)",
            }}
          />
          {offer && (
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
              style={{
                background: offer.bg,
                color: offer.text,
                border: `1px solid ${offer.border}`,
              }}
            >
              {offer.label}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl font-black mb-3">{itemName}</h1>
          <p
            className="text-base md:text-lg mb-4"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            One-time investment. Zero hidden fees. 100% satisfaction guaranteed.
          </p>
          <div
            className="text-3xl md:text-5xl font-black mb-2"
            style={{ color: "#00ffc6" }}
          >
            {displayPrice}
          </div>
          <div
            className="text-sm mb-5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            One-Time Payment · No Subscription
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "✅ 7-Day Money Back",
              "🔁 Free Revisions",
              `⚡ Delivery: ${deliveryTime}`,
              "🔒 Secure Checkout",
            ].map((b) => (
              <span
                key={b}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(0,255,198,0.1)",
                  border: "1px solid rgba(0,255,198,0.25)",
                  color: "#00ffc6",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── MULTI-SERVICE BREAKDOWN (shown only for cart checkouts) ── */}
        {isMulti && services && services.length > 0 && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(0,255,198,0.04)",
              border: "1px solid rgba(0,255,198,0.25)",
            }}
          >
            <h2
              className="text-lg font-black mb-4"
              style={{ color: "#00ffc6" }}
            >
              🛒 Your Selected Services ({services.length})
            </h2>
            <div className="space-y-3">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{svc.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {svc.name}
                      </div>
                      <div
                        className="text-[11px]"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {svc.category} · {svc.deliveryTime}
                      </div>
                    </div>
                  </div>
                  <div
                    className="font-black text-sm flex-shrink-0"
                    style={{ color: "#00ffc6" }}
                  >
                    ₹{svc.price.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
            {/* Total row */}
            <div
              className="flex items-center justify-between mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(0,255,198,0.2)" }}
            >
              <span className="font-bold text-white">Bundle Total</span>
              <span
                className="text-2xl font-black"
                style={{ color: "#00ffc6" }}
              >
                ₹
                {services
                  .reduce((t, s) => t + s.price, 0)
                  .toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* ── VALUE COMPARISON BANNER ── */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,255,198,0.08),rgba(255,106,0,0.06))",
            border: "2px solid rgba(0,255,198,0.3)",
            boxShadow: "0 0 40px rgba(0,255,198,0.08)",
          }}
        >
          <div
            className="absolute top-3 right-4 text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: "rgba(255,106,0,0.15)",
              border: "1px solid rgba(255,106,0,0.4)",
              color: "#ff6a00",
            }}
          >
            🔥 MASSIVE VALUE
          </div>
          <h2 className="text-lg font-black mb-5" style={{ color: "#00ffc6" }}>
            💡 Why Our Plan Price Is a Steal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="text-xs mb-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                If You Buy All 16 Features Separately
              </div>
              <div
                className="text-2xl font-black line-through"
                style={{ color: "rgba(255,80,80,0.8)" }}
              >
                ₹{ALL_FEATURES_TOTAL.toLocaleString("en-IN")}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Market retail price
              </div>
            </div>
            <div
              className="rounded-xl p-4 relative"
              style={{
                background: "rgba(0,255,198,0.08)",
                border: "2px solid rgba(0,255,198,0.35)",
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full"
                style={{ background: "#00ffc6", color: "#0b0b0f" }}
              >
                OUR PLAN PRICE
              </div>
              <div
                className="text-xs mb-1 mt-2"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                You Pay Today
              </div>
              <div className="text-2xl font-black" style={{ color: "#00ffc6" }}>
                {displayPrice}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                One-time · no subscription
              </div>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,106,0,0.08)",
                border: "1px solid rgba(255,106,0,0.25)",
              }}
            >
              <div
                className="text-xs mb-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Your Total Savings
              </div>
              <div className="text-2xl font-black" style={{ color: "#ff6a00" }}>
                ₹{(ALL_FEATURES_TOTAL - rawPrice).toLocaleString("en-IN")}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {Math.round(
                  ((ALL_FEATURES_TOTAL - rawPrice) / ALL_FEATURES_TOTAL) * 100,
                )}
                % off market rate
              </div>
            </div>
          </div>
        </div>

        {/* ── 16 INCLUDED FEATURES — READ-ONLY VALUE DISPLAY ── */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,255,198,0.15)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h2 className="text-lg font-black" style={{ color: "#00ffc6" }}>
              💡 What&apos;s Included — ₹
              {ALL_FEATURES_TOTAL.toLocaleString("en-IN")} Worth of Features
            </h2>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{
                background: "rgba(0,255,198,0.1)",
                border: "1px solid rgba(0,255,198,0.3)",
                color: "#00ffc6",
              }}
            >
              ALL included in your plan · Zero extra cost
            </span>
          </div>
          <p
            className="text-sm mb-5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            These features would cost ₹
            {ALL_FEATURES_TOTAL.toLocaleString("en-IN")} if purchased
            separately. Your plan includes ALL of them.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXTRA_FEATURES.map((feat) => (
              <div
                key={feat.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(0,255,198,0.04)",
                  border: "1px solid rgba(0,255,198,0.1)",
                }}
              >
                <span className="text-xl flex-shrink-0">{feat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "#fff" }}
                  >
                    {feat.name}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {feat.desc}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div
                    className="text-sm font-black line-through"
                    style={{ color: "rgba(255,80,80,0.6)" }}
                  >
                    ₹{feat.price.toLocaleString("en-IN")}
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: "#00ffc6" }}
                  >
                    FREE ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-6">
            {/* Features */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,255,198,0.15)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "#00ffc6" }}
              >
                What You Get
              </h2>
              <ul className="space-y-2">
                {features.map((f) => (
                  <li
                    key={f.slice(0, 30)}
                    className="flex gap-2 text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <span style={{ color: "#00ffc6", flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Testimonials */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,255,198,0.15)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "#00ffc6" }}
              >
                Client Results
              </h2>
              <div className="space-y-4">
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.name}
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(0,255,198,0.04)",
                      border: "1px solid rgba(0,255,198,0.1)",
                    }}
                  >
                    <Stars count={t.rating} />
                    <p
                      className="text-sm mt-2 mb-2"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      &quot;{t.text}&quot;
                    </p>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#00ffc6" }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {t.company}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 text-center text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                ★★★★★ Trusted by 500+ Businesses
              </div>
            </div>
            {/* Urgency */}
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: "rgba(255,106,0,0.07)",
                border: "1px solid rgba(255,106,0,0.25)",
              }}
            >
              <div
                className="text-sm font-bold mb-1"
                style={{ color: "#ff6a00" }}
              >
                ⏰ Limited Slots Available
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                We accept only 3–5 new clients per week. Secure your spot now.
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Form */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,255,198,0.15)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "#00ffc6" }}
              >
                Your Details
              </h2>
              <div className="space-y-3">
                {[
                  {
                    key: "name",
                    label: "Full Name *",
                    type: "text",
                    ocid: "checkout.name_input",
                  },
                  {
                    key: "email",
                    label: "Email Address *",
                    type: "email",
                    ocid: "checkout.email_input",
                  },
                  {
                    key: "phone",
                    label: "Phone Number *",
                    type: "tel",
                    ocid: "checkout.phone_input",
                  },
                  {
                    key: "business",
                    label: "Business Name (optional)",
                    type: "text",
                    ocid: "checkout.business_input",
                  },
                ].map((f) => (
                  <input
                    key={f.key}
                    data-ocid={f.ocid}
                    placeholder={f.label}
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-text"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(0,255,198,0.2)",
                      color: "#fff",
                    }}
                  />
                ))}
                <textarea
                  data-ocid="checkout.notes_input"
                  placeholder="Any notes or requirements (optional)"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none cursor-text"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(0,255,198,0.2)",
                    color: "#fff",
                  }}
                />
              </div>
              {formError && (
                <p className="text-xs mt-2" style={{ color: "#ff6a00" }}>
                  {formError}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,255,198,0.15)",
              }}
            >
              <h2
                className="text-sm font-bold mb-3"
                style={{ color: "#00ffc6" }}
              >
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                {/* Base price */}
                <div className="flex justify-between">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>
                    {itemName}
                  </span>
                  <span style={{ color: "#fff" }}>{displayPrice}</span>
                </div>

                {/* Selected upsells */}
                {selectedUpsells.size > 0 && (
                  <>
                    {UPSELLS.filter((u) => selectedUpsells.has(u.name)).map(
                      (u) => (
                        <div key={u.name} className="flex justify-between">
                          <span style={{ color: "rgba(255,255,255,0.5)" }}>
                            {u.icon} {u.name}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.7)" }}>
                            +₹{u.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ),
                    )}
                    {/* Upsells subtotal */}
                    <div
                      className="flex justify-between pt-1"
                      style={{
                        borderTop: "1px dashed rgba(0,255,198,0.15)",
                      }}
                    >
                      <span style={{ color: "rgba(255,255,255,0.45)" }}>
                        Add-ons subtotal ({selectedUpsells.size})
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>
                        +₹{upsellsTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </>
                )}

                {/* Grand total */}
                <div
                  className="border-t pt-2 mt-2 flex justify-between font-black text-base"
                  style={{ borderColor: "rgba(0,255,198,0.15)" }}
                >
                  <span style={{ color: "#00ffc6" }}>Grand Total</span>
                  <span style={{ color: "#00ffc6" }}>
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              {/* 50% Off Checkbox */}
              <label
                data-ocid="checkout.half_off.checkbox"
                className="flex items-center gap-3 mt-3 cursor-pointer select-none rounded-xl p-3"
                style={{
                  background: "rgba(0,255,198,0.06)",
                  border: "1px solid rgba(0,255,198,0.2)",
                }}
              >
                <input
                  type="checkbox"
                  checked={halfOff}
                  onChange={(e) => setHalfOff(e.target.checked)}
                  className="cursor-pointer"
                  style={{ width: 18, height: 18, accentColor: "#00ffc6" }}
                />
                <div className="flex-1">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#00ffc6" }}
                  >
                    🎉 Apply 50% OFF
                  </span>
                  <span
                    className="text-xs ml-2"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Code: QUICKBEE50
                  </span>
                  {halfOff && (
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "#ff6a00" }}
                    >
                      You save ₹
                      {Math.round(subtotal * 0.5).toLocaleString("en-IN")}!
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Pay */}
            <button
              type="button"
              data-ocid="checkout.pay_button"
              onClick={handlePay}
              disabled={paying}
              className="w-full py-4 rounded-2xl font-black text-lg transition-all cursor-pointer disabled:opacity-60"
              style={{
                background: paying
                  ? "rgba(255,106,0,0.4)"
                  : "linear-gradient(135deg,#ff6a00,#ff9500)",
                color: "#fff",
                boxShadow: paying ? "none" : "0 0 30px rgba(255,106,0,0.4)",
              }}
            >
              {paying
                ? "Opening Payment..."
                : `Pay ₹${grandTotal.toLocaleString("en-IN")} Now →`}
            </button>

            {/* Payment methods */}
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="text-xs mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Accepted Payment Methods
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {[
                  "UPI",
                  "Debit Card",
                  "Credit Card",
                  "EMI",
                  "Net Banking",
                  "International",
                ].map((m) => (
                  <span
                    key={m}
                    className="px-2 py-1 rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              <div
                className="mt-3 flex justify-center items-center gap-3 text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <span>🔒 Powered by Razorpay</span>
                <span>·</span>
                <span>SSL Secured</span>
                <span>·</span>
                <span>PCI DSS</span>
              </div>
            </div>

            {/* Guarantee */}
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: "rgba(0,255,198,0.05)",
                border: "1px solid rgba(0,255,198,0.2)",
              }}
            >
              <div className="text-2xl mb-1">🛡️</div>
              <div
                className="font-bold text-sm mb-1"
                style={{ color: "#00ffc6" }}
              >
                100% Satisfaction Guarantee
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                7-day money-back · Free revisions · No questions asked
              </div>
            </div>

            {/* WhatsApp */}
            <a
              data-ocid="checkout.whatsapp_button"
              href={`https://wa.me/919182768591?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm cursor-pointer"
              style={{
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.3)",
                color: "#25d366",
              }}
            >
              💬 Chat on WhatsApp First
            </a>
          </div>
        </div>

        {/* After payment steps */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,255,198,0.12)",
          }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: "#00ffc6" }}>
            What Happens After Payment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Confirmation Sent",
                desc: "You receive a confirmation email + WhatsApp message instantly.",
              },
              {
                step: "2",
                title: "We Contact You",
                desc: "Our team reaches out within 12 hours to begin onboarding.",
              },
              {
                step: "3",
                title: "Work Begins",
                desc: `Delivery completed within ${deliveryTime}. Updates at every milestone.`,
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#00ffc6,#00a896)",
                    color: "#0b0b0f",
                  }}
                >
                  {s.step}
                </div>
                <div>
                  <div className="font-semibold text-sm">{s.title}</div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8 FREE BONUSES ── */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,106,0,0.07),rgba(0,255,198,0.05))",
            border: "1px solid rgba(255,106,0,0.25)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(255,106,0,0.12),transparent 70%)",
            }}
          />
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🎁</div>
            <h2
              className="text-xl font-black mb-1"
              style={{ color: "#ff6a00" }}
            >
              8 FREE Bonuses Worth ₹18,693 — Included Today
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Every purchase comes with these exclusive bonuses at zero extra
              cost.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BONUSES.map((bonus) => (
              <div
                key={bonus.title}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,106,0,0.15)",
                }}
              >
                <div className="text-2xl">{bonus.icon}</div>
                <div
                  className="text-xs font-bold leading-snug"
                  style={{ color: "#fff" }}
                >
                  {bonus.title}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {bonus.desc}
                </div>
                <div className="mt-auto flex flex-col gap-1">
                  <div className="text-xs" style={{ color: "#00ffc6" }}>
                    Value: {bonus.value}
                  </div>
                  <div
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-center"
                    style={{
                      background: "rgba(37,211,102,0.15)",
                      border: "1px solid rgba(37,211,102,0.35)",
                      color: "#25d366",
                    }}
                  >
                    FREE with Purchase
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECOMMENDED ADD-ONS (UPSELLS) ── */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,255,198,0.12)",
          }}
        >
          <h2 className="text-lg font-bold mb-1" style={{ color: "#00ffc6" }}>
            🚀 Recommended Add-ons
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Supercharge your results with these popular upgrades. Add to your
            order in one click.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UPSELLS.map((u) => {
              const added = selectedUpsells.has(u.name);
              return (
                <div
                  key={u.name}
                  className="p-4 rounded-xl flex flex-col gap-2"
                  style={{
                    background: added
                      ? "rgba(0,255,198,0.07)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${added ? "rgba(0,255,198,0.35)" : "rgba(0,255,198,0.1)"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <div className="text-2xl">{u.icon}</div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: added ? "#00ffc6" : "#fff" }}
                  >
                    {u.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {u.desc}
                  </div>
                  <div
                    className="text-sm font-black mt-auto"
                    style={{ color: "#00ffc6" }}
                  >
                    ₹{u.price.toLocaleString("en-IN")}
                  </div>
                  <button
                    type="button"
                    data-ocid={`checkout.upsell_${u.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.toggle`}
                    onClick={() => toggleUpsell(u.name)}
                    className="w-full text-xs font-bold px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                    style={{
                      background: added
                        ? "rgba(0,255,198,0.15)"
                        : "linear-gradient(135deg,rgba(255,106,0,0.15),rgba(255,149,0,0.1))",
                      border: `1.5px solid ${added ? "rgba(0,255,198,0.5)" : "rgba(255,106,0,0.5)"}`,
                      color: added ? "#00ffc6" : "#ff6a00",
                    }}
                  >
                    {added ? "✓ Added" : "+ Add to Order"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upsells selected summary */}
          {selectedUpsells.size > 0 && (
            <div
              className="mt-4 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2"
              style={{
                background: "rgba(0,255,198,0.05)",
                border: "1px solid rgba(0,255,198,0.2)",
              }}
            >
              <div>
                <div className="text-sm font-bold" style={{ color: "#00ffc6" }}>
                  {selectedUpsells.size} add-on
                  {selectedUpsells.size > 1 ? "s" : ""} added
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Base: {displayPrice} + Add-ons: ₹
                  {upsellsTotal.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  New Total
                </div>
                <div
                  className="text-2xl font-black"
                  style={{ color: "#ff6a00" }}
                >
                  ₹{grandTotal.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,255,198,0.12)",
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#00ffc6" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Support */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,255,198,0.12)",
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#00ffc6" }}>
            Need Help?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919182768591"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer"
              style={{
                background: "rgba(0,255,198,0.08)",
                border: "1px solid rgba(0,255,198,0.25)",
                color: "#00ffc6",
              }}
            >
              📞 +91 91827 68591
            </a>
            <a
              href="https://wa.me/919182768591"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer"
              style={{
                background: "rgba(37,211,102,0.08)",
                border: "1px solid rgba(37,211,102,0.25)",
                color: "#25d366",
              }}
            >
              💬 WhatsApp Chat
            </a>
            <a
              href="mailto:hello@quickbeeagency.com"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              ✉️ hello@quickbeeagency.com
            </a>
          </div>
        </div>

        {/* Legal */}
        <div
          className="text-center text-xs pb-4"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <span className="cursor-pointer hover:text-white transition-colors">
              Terms &amp; Conditions
            </span>
            <span className="cursor-pointer hover:text-white transition-colors">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-white transition-colors">
              Refund Policy
            </span>
          </div>
          <div>© 2025 Quick Bee Agency · Uma Nagar, Old Town, Anantapur</div>
        </div>
      </div>
    </div>
  );
}
