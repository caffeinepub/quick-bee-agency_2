import { useEffect, useRef, useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import ServiceDetailModal from "./ServiceDetailModal";
import {
  CATEGORIES,
  ENTERPRISE_PLANS,
  type EnterprisePlan,
  SERVICES_DATA,
  type Service,
} from "./ServicesData";

// ── Offer helper ─────────────────────────────────────────────
const CATEGORY_OFFERS: Record<string, string[]> = {
  Analytics: ["Free Data Audit", "30% OFF", "Early Bird Deal"],
  "Automation & AI": ["AI Free Trial", "40% OFF", "Bundle Save"],
  "Business & Agency": [
    "Starter Pack",
    "25% OFF",
    "Free Consultation",
    "Combo Offer",
    "Buy 2 Get 1",
    "Limited Slots",
    "20% OFF",
    "Flash Deal",
  ],
  "Content Marketing": [
    "Free Sample",
    "35% OFF",
    "Content Bundle",
    "Early Access",
  ],
  "Digital Marketing": ["30% OFF", "Free Strategy", "Performance Pack"],
  "Email Marketing": [
    "Free Template",
    "40% OFF",
    "Sequence Bundle",
    "Drip Offer",
  ],
  Enterprise: ["Private Access", "Priority Onboarding", "Custom Deal"],
  "Graphic Design": [
    "Free Concept",
    "30% OFF",
    "Design Bundle",
    "Rush Delivery",
    "Brand Pack",
  ],
  "Lead Generation": ["Free Lead Audit", "35% OFF", "Starter Pack"],
  "Paid Ads": [
    "Free Ad Audit",
    "25% OFF",
    "Scale Pack",
    "ROAS Booster",
    "Free Creative",
  ],
  "Premium & Scale": [
    "Exclusive Access",
    "20% OFF",
    "VIP Bundle",
    "Scale Fast",
  ],
  "Reputation Management": ["Free Audit", "40% OFF"],
  SEO: [
    "Free SEO Audit",
    "30% OFF",
    "Rank Fast",
    "Backlink Bundle",
    "Local Pack",
  ],
  "Social Media": [
    "Free Month",
    "25% OFF",
    "Viral Pack",
    "Growth Bundle",
    "Reels Kit",
  ],
  Student: ["Student Deal", "50% OFF*", "Internship Pack", "Career Bundle"],
  "Video Production": ["Free Storyboard", "35% OFF", "Reel Bundle"],
  "Web Development": [
    "Free Mockup",
    "30% OFF",
    "Speed Pack",
    "Mobile First",
    "Ecom Bundle",
  ],
  "Web3 & Blockchain": ["Web3 Pilot", "Early Adopter"],
  "Website Design & Development": [
    "Free Mockup",
    "30% OFF",
    "Launch Pack",
    "Mobile First",
  ],
};

export interface OfferBadge {
  label: string;
  bg: string;
  text: string;
  border: string;
}

export function getServiceOffer(service: Service): OfferBadge {
  const offers = CATEGORY_OFFERS[service.category] ?? ["Free Consultation"];
  const label = offers[service.id % offers.length];

  // Color rules
  if (/\d+%\s*OFF/.test(label)) {
    return {
      label,
      bg: "rgba(255,106,0,0.15)",
      text: "#ff6a00",
      border: "rgba(255,106,0,0.35)",
    };
  }
  if (/^Free /i.test(label)) {
    return {
      label,
      bg: "rgba(0,255,198,0.1)",
      text: "#00ffc6",
      border: "rgba(0,255,198,0.3)",
    };
  }
  if (/Bundle|Pack|Kit|Booster|Combo/i.test(label)) {
    return {
      label,
      bg: "rgba(168,85,247,0.12)",
      text: "#a855f7",
      border: "rgba(168,85,247,0.3)",
    };
  }
  if (/Limited|Exclusive|Private|VIP|Priority/i.test(label)) {
    return {
      label,
      bg: "rgba(239,68,68,0.12)",
      text: "#ef4444",
      border: "rgba(239,68,68,0.3)",
    };
  }
  if (/Early Bird|Early Access|Early Adopter/i.test(label)) {
    return {
      label,
      bg: "rgba(234,179,8,0.12)",
      text: "#eab308",
      border: "rgba(234,179,8,0.3)",
    };
  }
  // Default teal
  return {
    label,
    bg: "rgba(0,255,198,0.1)",
    text: "#00ffc6",
    border: "rgba(0,255,198,0.3)",
  };
}

// ── Reuse site's reveal pattern ─────────────────────────────
function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

// ── Format price ─────────────────────────────────────────────
function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

// ── Service Card ─────────────────────────────────────────────
function ServiceCard({
  service,
  index,
  onSelect,
}: {
  service: Service;
  index: number;
  onSelect: (service: Service) => void;
}) {
  const offer = getServiceOffer(service);
  const waText = encodeURIComponent(`Hi, I'm interested in ${service.name}`);

  return (
    <RevealSection delay={Math.min(index * 40, 400)}>
      <div
        className="glow-card card-neon-hover cursor-hover glass-panel rounded-2xl p-5 h-full flex flex-col"
        style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.35)" }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl">{service.icon}</span>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
            style={{
              background: "rgba(0,255,198,0.08)",
              border: "1px solid rgba(0,255,198,0.25)",
              color: "#00ffc6",
            }}
          >
            {service.category}
          </span>
        </div>

        {/* Offer badge row */}
        <div className="mb-2">
          <span
            style={{
              background: offer.bg,
              border: `1px solid ${offer.border}`,
              color: offer.text,
              fontSize: "10px",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 999,
              display: "inline-block",
            }}
          >
            🏷 {offer.label}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-white font-extrabold text-sm leading-snug mb-1">
          {service.name}
        </h3>

        {/* Price */}
        <div className="text-xl font-black mb-2" style={{ color: "#00ffc6" }}>
          {formatPrice(service.price)}
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed mb-3 flex-shrink-0"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-1.5 mb-4 flex-1">
          {service.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-1.5 text-xs"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <span
                className="mt-0.5 flex-shrink-0"
                style={{ color: "#00ffc6" }}
              >
                ✓
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-auto pt-3 mb-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-full"
            style={{
              background: "rgba(255,106,0,0.08)",
              border: "1px solid rgba(255,106,0,0.2)",
              color: "#ff6a00",
            }}
          >
            ⏱ {service.deliveryTime}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{
              background: "rgba(0,255,198,0.08)",
              border: "1px solid rgba(0,255,198,0.3)",
              color: "#00ffc6",
            }}
          >
            🛡 100% Money Back
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2">
          {/* Get Started */}
          <button
            type="button"
            onClick={() => onSelect(service)}
            data-ocid="service.card.primary_button"
            className="text-[11px] font-bold py-1.5 rounded-lg w-full text-center transition-all duration-200"
            style={{
              background: "#ff6a00",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Get Started →
          </button>

          {/* WhatsApp Us */}
          <a
            href={`https://wa.me/919182768591?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="service.card.whatsapp_button"
            className="text-[11px] font-bold py-1.5 rounded-lg w-full text-center transition-all duration-200"
            style={{
              background: "rgba(37,211,102,0.12)",
              border: "1px solid rgba(37,211,102,0.35)",
              color: "#25d366",
              cursor: "pointer",
              display: "block",
            }}
          >
            💬 WhatsApp Us
          </a>

          {/* Book Free Call */}
          <a
            href="#apply"
            data-ocid="service.card.call_button"
            className="text-[11px] font-bold py-1.5 rounded-lg w-full text-center transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid rgba(0,255,198,0.3)",
              color: "#00ffc6",
              cursor: "pointer",
              display: "block",
            }}
          >
            📞 Book Free Call
          </a>
        </div>
      </div>
    </RevealSection>
  );
}

// ── Parse enterprise plan price string to paise ──────────────
function parseEnterprisePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[₹,]/g, "").trim();
  const num = Number.parseInt(cleaned, 10);
  return Number.isNaN(num) ? 0 : num * 100;
}

// ── Enterprise Plan Card ────────────────────────────────────
function EnterprisePlanCard({
  plan,
  index,
}: { plan: EnterprisePlan; index: number }) {
  const { openPayment } = useRazorpay();
  const [payState, setPayState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handlePay = async () => {
    setPayState("loading");
    try {
      await openPayment({
        amount: parseEnterprisePrice(plan.price),
        name: "Quick Bee Agency",
        description: `${plan.name} Enterprise Plan — One-Time Payment`,
        prefill: { name: "", email: "", contact: "" },
        onSuccess: () => setPayState("success"),
        onDismiss: () => setPayState("idle"),
      });
    } catch {
      setPayState("error");
    }
  };

  return (
    <RevealSection delay={index * 150}>
      <div
        className={`glass-panel card-neon-hover cursor-hover rounded-3xl p-7 h-full flex flex-col relative overflow-hidden ${plan.highlighted ? "glow-card" : ""}`}
        style={{
          border: plan.highlighted
            ? "2px solid rgba(255,106,0,0.5)"
            : "1px solid rgba(0,255,198,0.15)",
          boxShadow: plan.highlighted
            ? "0 0 60px rgba(255,106,0,0.15), 0 20px 60px rgba(0,0,0,0.4)"
            : "0 8px 40px rgba(0,0,0,0.35)",
        }}
      >
        {/* Most Popular badge */}
        {plan.highlighted && (
          <div
            className="absolute top-0 right-0 px-5 py-2 text-xs font-black tracking-wider uppercase rounded-bl-2xl"
            style={{ background: "#ff6a00", color: "#fff" }}
          >
            Most Popular
          </div>
        )}

        {/* Plan name */}
        <div
          className="text-xs font-black tracking-[0.3em] uppercase mb-2"
          style={{ color: plan.highlighted ? "#ff6a00" : "#00ffc6" }}
        >
          {plan.name}
        </div>

        {/* Price */}
        <div className="mb-1">
          <span className="text-4xl font-black" style={{ color: "#fff" }}>
            {plan.price}
          </span>
          <span
            className="text-xs ml-2 font-bold px-2 py-0.5 rounded-full"
            style={{
              background: plan.highlighted
                ? "rgba(255,106,0,0.15)"
                : "rgba(0,255,198,0.1)",
              border: `1px solid ${plan.highlighted ? "rgba(255,106,0,0.4)" : "rgba(0,255,198,0.3)"}`,
              color: plan.highlighted ? "#ff6a00" : "#00ffc6",
            }}
          >
            one-time
          </span>
        </div>

        {/* Money Back Badge */}
        <div className="mb-3">
          <span
            className="text-[11px] font-black px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(0,255,198,0.1)",
              border: "1px solid rgba(0,255,198,0.35)",
              color: "#00ffc6",
              display: "inline-block",
            }}
          >
            🛡 100% Money Back Guarantee
          </span>
        </div>

        {/* Tagline */}
        <p
          className="text-sm font-semibold mb-6"
          style={{ color: plan.highlighted ? "#ff6a00" : "#00ffc6" }}
        >
          {plan.tagline}
        </p>

        {/* Divider */}
        <div
          className="mb-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        />

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <span
                className="mt-0.5 flex-shrink-0 font-bold"
                style={{ color: plan.highlighted ? "#ff6a00" : "#00ffc6" }}
              >
                ✓
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        {payState === "success" ? (
          <div
            className="rounded-2xl p-4 text-center"
            style={{
              background: "rgba(0,255,198,0.07)",
              border: "1px solid rgba(0,255,198,0.3)",
            }}
          >
            <div className="text-2xl mb-1">🎉</div>
            <p className="text-sm font-bold text-white">Payment Successful!</p>
            <p className="text-xs text-gray-400 mt-1">
              Our team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pay Now */}
            <button
              type="button"
              onClick={handlePay}
              disabled={payState === "loading"}
              data-ocid="enterprise.card.primary_button"
              className="w-full py-4 rounded-2xl font-black text-sm text-center transition-all duration-200"
              style={
                plan.highlighted
                  ? {
                      background:
                        payState === "loading"
                          ? "rgba(255,106,0,0.5)"
                          : "#ff6a00",
                      color: "#fff",
                      boxShadow:
                        payState === "loading"
                          ? "none"
                          : "0 4px 25px rgba(255,106,0,0.35)",
                      cursor:
                        payState === "loading" ? "not-allowed" : "pointer",
                      letterSpacing: "0.04em",
                    }
                  : {
                      background:
                        payState === "loading"
                          ? "rgba(0,255,198,0.05)"
                          : "rgba(0,255,198,0.1)",
                      border: "1px solid rgba(0,255,198,0.4)",
                      color: "#00ffc6",
                      cursor:
                        payState === "loading" ? "not-allowed" : "pointer",
                      letterSpacing: "0.04em",
                    }
              }
            >
              {payState === "loading"
                ? "Loading..."
                : `💳 Pay ${plan.price} (One-Time)`}
            </button>

            {payState === "error" && (
              <p className="text-xs text-center" style={{ color: "#ff6b6b" }}>
                Payment gateway unavailable. Try again or contact us.
              </p>
            )}

            {/* WhatsApp for enterprise */}
            <a
              href={`https://wa.me/919182768591?text=${encodeURIComponent(`Hi, I'm interested in the ${plan.name} Enterprise Plan`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="enterprise.card.whatsapp_button"
              className="w-full py-3 rounded-2xl font-bold text-sm text-center block transition-all duration-200"
              style={{
                background: "rgba(37,211,102,0.1)",
                border: "1px solid rgba(37,211,102,0.35)",
                color: "#25d366",
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              💬 WhatsApp for Details
            </a>

            {/* Apply Now */}
            <a
              href="#apply"
              data-ocid="enterprise.card.secondary_button"
              className="w-full py-3 rounded-2xl font-bold text-sm text-center block transition-all duration-200"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.03em",
              }}
            >
              Apply Now →
            </a>

            {/* Money-back trust row */}
            <p
              className="text-center text-[11px] font-bold pt-1"
              style={{ color: "#00ffc6" }}
            >
              🛡 100% Money Back Guarantee · 🔒 Secured by Razorpay
            </p>
          </div>
        )}
      </div>
    </RevealSection>
  );
}

// ── Main Services Section ────────────────────────────────────
export default function ServicesSection({
  onOpenCheckout,
}: { onOpenCheckout?: (service: import("./ServicesData").Service) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showSlideHint, setShowSlideHint] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Hide slide hint once the user has scrolled the tabs at all
  const handleTabsScroll = () => {
    if (tabsRef.current && tabsRef.current.scrollLeft > 20) {
      setShowSlideHint(false);
    }
  };

  const filtered =
    activeCategory === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === activeCategory);

  return (
    <>
      {/* ── SERVICES CATALOGUE ── */}
      <section
        id="services"
        className="relative py-14 sm:py-20 md:py-32"
        style={{ background: "#0b0b0f" }}
      >
        {/* bg glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,255,198,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <RevealSection className="text-center mb-12">
            <div
              className="section-eyebrow"
              style={{
                background: "rgba(0,255,198,0.12)",
                border: "1px solid rgba(0,255,198,0.25)",
                color: "#00ffc6",
              }}
            >
              Our Services
            </div>
            <h2 className="text-headline text-white mb-5">
              122 Specialist Services Across{" "}
              <span className="teal-glow-text">19 Categories</span>
              <span
                className="animate-pulse"
                style={{
                  background: "rgba(255,106,0,0.15)",
                  border: "1px solid rgba(255,106,0,0.4)",
                  color: "#ff6a00",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "999px",
                  display: "inline-block",
                  marginLeft: "8px",
                  verticalAlign: "middle",
                  lineHeight: 1.6,
                }}
              >
                🔥 Sale On Now
              </span>
            </h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              From starter student packages to enterprise-grade revenue
              ecosystems — every service is precision-engineered for results.
            </p>
          </RevealSection>

          {/* Category Filter Tabs */}
          <RevealSection className="mb-8">
            <div className="relative">
              <div
                ref={tabsRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: "none" }}
                onScroll={handleTabsScroll}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    data-ocid="services.filter.tab"
                    className="cursor-hover flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                    style={
                      activeCategory === cat
                        ? {
                            background: "#00ffc6",
                            color: "#0b0b0f",
                            boxShadow: "0 0 16px rgba(0,255,198,0.35)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.6)",
                          }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Fade-out right edge */}
              <div
                className="absolute top-0 right-0 h-full w-16 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, transparent, #0b0b0f)",
                }}
              />
            </div>

            {/* Slide hint */}
            <div
              className="flex items-center gap-2 mt-3 mb-1 transition-all duration-500"
              style={{
                opacity: showSlideHint ? 1 : 0,
                pointerEvents: "none",
                height: showSlideHint ? "auto" : 0,
                overflow: "hidden",
              }}
            >
              {/* Animated bouncing arrows */}
              <span
                className="text-xs font-bold tracking-wide uppercase"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Slide right for more
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                  color: "#00ffc6",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="arrow right"
                    style={{
                      animation: "slideArrow 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.18}s`,
                      opacity: 1 - i * 0.25,
                    }}
                  >
                    <title>arrow right</title>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                ))}
              </span>
            </div>

            {/* Count badge */}
            <div className="mt-3 text-xs text-gray-500">
              Showing{" "}
              <span style={{ color: "#00ffc6" }} className="font-bold">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-white">
                {SERVICES_DATA.length}
              </span>{" "}
              services
            </div>
          </RevealSection>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                onSelect={setSelectedService}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE PLANS ── */}
      <section
        id="enterprise-plans"
        className="relative py-14 sm:py-20 md:py-32"
        style={{ background: "rgba(0,255,198,0.012)" }}
      >
        {/* bg glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,106,0,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <RevealSection className="text-center mb-14">
            <div
              className="section-eyebrow"
              style={{
                background: "rgba(255,106,0,0.07)",
                border: "1px solid rgba(255,106,0,0.25)",
                color: "#ff6a00",
              }}
            >
              Enterprise Solutions
            </div>
            <h2 className="text-headline text-white mb-5">
              3 Unique{" "}
              <span className="orange-glow-text">Enterprise Partnerships</span>
            </h2>
            <p className="text-subheadline max-w-2xl mx-auto">
              Fully managed, done-for-you growth partnerships for businesses
              serious about building a ₹1 Crore+ revenue machine.
            </p>
          </RevealSection>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-7 items-start">
            {ENTERPRISE_PLANS.map((plan, i) => (
              <EnterprisePlanCard key={plan.id} plan={plan} index={i} />
            ))}
          </div>

          {/* Bottom note */}
          <RevealSection className="text-center mt-10">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              All enterprise plans include a free 30-minute strategy call before
              commitment.{" "}
              <a
                href="#apply"
                style={{ color: "#00ffc6" }}
                className="font-bold hover:underline"
              >
                Apply now →
              </a>
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ── SERVICE DETAIL MODAL ── */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onOpenCheckout={onOpenCheckout}
      />
    </>
  );
}
