import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Background3D from "./components/Background3D";
import CustomCursor from "./components/CustomCursor";
import HeroCanvas3D from "./components/HeroCanvas3D";
import ServicesSection from "./components/ServicesSection";
import {
  useCounter,
  useIntersectionObserver,
} from "./hooks/useIntersectionObserver";
import { useMagneticHover } from "./hooks/useMagneticHover";
import { useIncrementPageView, useSubmitLead } from "./hooks/useQueries";
import { preloadRazorpay } from "./hooks/useRazorpay";

// Preload Razorpay script immediately so Pay Now has zero lag
preloadRazorpay();

// ============================================================
// SECTION REVEAL WRAPPER
// ============================================================
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
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

// ============================================================
// ANIMATED COUNTER
// ============================================================
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  label,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });
  const count = useCounter(target, isVisible, 2200);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center group"
    >
      <div
        className="counter-number"
        style={{
          fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#00ffc6" }}>{prefix}</span>
        <span className="text-white">{count.toLocaleString("en-IN")}</span>
        <span style={{ color: "#00ffc6" }}>{suffix}</span>
      </div>
      <div
        className="mt-3"
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Systems", href: "#systems" },
    { label: "Services", href: "#services" },
    { label: "Integration", href: "#integration" },
    { label: "Results", href: "#results" },
    { label: "Process", href: "#process" },
    { label: "Apply", href: "#apply" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b0b0f]/95 backdrop-blur-xl border-b border-[#00ffc6]/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/quickbee-logo-no-bg.dim_400x400.png"
              alt="Quick Bee Agency"
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="font-extrabold text-white text-sm tracking-widest uppercase block leading-tight">
                QUICK BEE
              </span>
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-medium"
                style={{ color: "#00ffc6" }}
              >
                AGENCY
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="cursor-hover text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: "#00ffc6" }}
                />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* 3D Call Button */}
            <a
              href="tel:+919182768591"
              title="Call Us: +91 9182768591"
              className="group relative flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(14,165,233,0.15), rgba(0,255,198,0.08))",
                boxShadow:
                  "0 4px 20px rgba(0,255,198,0.25), 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
                border: "1px solid rgba(0,255,198,0.3)",
                transform: "translateZ(0) perspective(500px) rotateX(0deg)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform =
                  "translateZ(0) perspective(500px) rotateX(-5deg) translateY(-2px)";
                el.style.boxShadow =
                  "0 12px 35px rgba(0,255,198,0.45), 0 6px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)";
                el.style.background =
                  "linear-gradient(145deg, rgba(14,165,233,0.25), rgba(0,255,198,0.15))";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform =
                  "translateZ(0) perspective(500px) rotateX(0deg)";
                el.style.boxShadow =
                  "0 4px 20px rgba(0,255,198,0.25), 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)";
                el.style.background =
                  "linear-gradient(145deg, rgba(14,165,233,0.15), rgba(0,255,198,0.08))";
              }}
            >
              {/* 3D phone icon */}
              <div
                className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                style={{
                  filter:
                    "drop-shadow(0 3px 8px rgba(0,255,198,0.6)) drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                }}
              >
                <img
                  src="/assets/generated/icon-3d-phone-transparent.dim_128x128.png"
                  alt="Call"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(0,255,198,0.7)" }}
                >
                  Direct Call
                </span>
                <span className="text-white text-sm font-bold">
                  +91 91827 68591
                </span>
              </div>
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
            </a>

            {/* 3D WhatsApp Button */}
            <a
              href="https://wa.me/919182768591"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp: +91 9182768591"
              className="group relative flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(37,211,102,0.15), rgba(18,140,126,0.08))",
                boxShadow:
                  "0 4px 20px rgba(37,211,102,0.25), 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)",
                border: "1px solid rgba(37,211,102,0.3)",
                transform: "translateZ(0) perspective(500px) rotateX(0deg)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform =
                  "translateZ(0) perspective(500px) rotateX(-5deg) translateY(-2px)";
                el.style.boxShadow =
                  "0 12px 35px rgba(37,211,102,0.45), 0 6px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)";
                el.style.background =
                  "linear-gradient(145deg, rgba(37,211,102,0.25), rgba(18,140,126,0.15))";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform =
                  "translateZ(0) perspective(500px) rotateX(0deg)";
                el.style.boxShadow =
                  "0 4px 20px rgba(37,211,102,0.25), 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)";
                el.style.background =
                  "linear-gradient(145deg, rgba(37,211,102,0.15), rgba(18,140,126,0.08))";
              }}
            >
              {/* 3D WhatsApp icon */}
              <div
                className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{
                  filter:
                    "drop-shadow(0 3px 8px rgba(37,211,102,0.6)) drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                }}
              >
                <img
                  src="/assets/generated/icon-3d-whatsapp-transparent.dim_128x128.png"
                  alt="WhatsApp"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(37,211,102,0.7)" }}
                >
                  WhatsApp
                </span>
                <span className="text-white text-sm font-bold">
                  +91 91827 68591
                </span>
              </div>
              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
                }}
              />
            </a>

            <a
              href="#apply"
              className="btn-orange btn-orange-glow cursor-hover touch-target px-5 py-2.5 rounded-lg"
              style={{ touchAction: "manipulation" }}
            >
              Book Strategy Call
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg touch-target"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ touchAction: "manipulation" }}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass-panel rounded-2xl p-6 mb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white font-medium py-2 border-b border-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Call Button - 3D */}
            <a
              href="tel:+919182768591"
              className="flex items-center gap-4 w-full py-3.5 px-4 rounded-2xl font-bold text-white transition-all duration-300 mt-1 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(14,165,233,0.2), rgba(0,255,198,0.1))",
                boxShadow:
                  "0 6px 20px rgba(0,255,198,0.3), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.25)",
                border: "1px solid rgba(0,255,198,0.35)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              <div
                style={{
                  filter:
                    "drop-shadow(0 3px 10px rgba(0,255,198,0.7)) drop-shadow(0 1px 3px rgba(0,0,0,0.9))",
                }}
              >
                <img
                  src="/assets/generated/icon-3d-phone-transparent.dim_128x128.png"
                  alt="Call"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "rgba(0,255,198,0.75)" }}
                >
                  Direct Call
                </span>
                <span className="text-white text-base font-bold">
                  +91 9182768591
                </span>
              </div>
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(0,255,198,0.06) 50%, transparent 70%)",
                }}
              />
            </a>

            {/* Mobile WhatsApp Button - 3D */}
            <a
              href="https://wa.me/919182768591"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 w-full py-3.5 px-4 rounded-2xl font-bold text-white transition-all duration-300 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(37,211,102,0.2), rgba(18,140,126,0.1))",
                boxShadow:
                  "0 6px 20px rgba(37,211,102,0.3), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.25)",
                border: "1px solid rgba(37,211,102,0.35)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              <div
                style={{
                  filter:
                    "drop-shadow(0 3px 10px rgba(37,211,102,0.7)) drop-shadow(0 1px 3px rgba(0,0,0,0.9))",
                }}
              >
                <img
                  src="/assets/generated/icon-3d-whatsapp-transparent.dim_128x128.png"
                  alt="WhatsApp"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "rgba(37,211,102,0.75)" }}
                >
                  WhatsApp
                </span>
                <span className="text-white text-base font-bold">
                  +91 9182768591
                </span>
              </div>
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(37,211,102,0.06) 50%, transparent 70%)",
                }}
              />
            </a>

            <button
              type="button"
              className="btn-orange text-center py-3.5 rounded-xl mt-2 w-full"
              onClick={() => {
                setMenuOpen(false);
                window.location.hash = "#apply";
              }}
            >
              Book Strategy Call
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  const heroCtaMagnetic = useMagneticHover(0.3);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: "#0b0b0f" }}
    >
      {/* 3D Canvas background */}
      <HeroCanvas3D />

      {/* Animated grid background */}
      <div
        className="hero-grid-bg pointer-events-none"
        style={{ opacity: 0.3 }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,255,198,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <div
              className="section-eyebrow"
              style={{
                background: "rgba(0,255,198,0.12)",
                border: "1px solid rgba(0,255,198,0.3)",
                color: "#00ffc6",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#00ffc6" }}
              />
              Enterprise AI Automation Partner
            </div>

            <h1 className="text-display text-white mb-8 leading-[1.02]">
              We Engineer{" "}
              <span className="teal-glow-text heading-sweep">AI-Powered</span>{" "}
              Revenue Ecosystems for 8-Figure Businesses.
            </h1>

            <p className="text-subheadline mb-12 max-w-lg">
              Websites. Automation. CRM. Marketing. Integrated into one scalable
              AI growth engine that compounds your revenue every month.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-12">
              <a
                ref={heroCtaMagnetic.ref as React.RefObject<HTMLAnchorElement>}
                href="#apply"
                className="btn-orange btn-orange-hero btn-orange-glow cursor-hover touch-target inline-flex items-center w-full sm:w-auto justify-center gap-3 px-10 py-5 rounded-2xl"
                style={{
                  touchAction: "manipulation",
                  ...heroCtaMagnetic.style,
                }}
                onMouseMove={(e) =>
                  heroCtaMagnetic.onMouseMove(
                    e as React.MouseEvent<HTMLElement>,
                  )
                }
                onMouseLeave={heroCtaMagnetic.onMouseLeave}
              >
                <span>Book Private Strategy Call</span>
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#systems"
                className="btn-teal-outline cursor-hover touch-target inline-flex items-center w-full sm:w-auto justify-center gap-3 px-10 py-5 rounded-2xl"
                style={{ touchAction: "manipulation" }}
              >
                View Enterprise Systems
              </a>
            </div>

            {/* Ecosystem Flow */}
            <EcosystemFlow />
          </div>

          {/* Right: Hero Image */}
          <div className="relative hidden lg:block float-animation">
            <div
              className="absolute -inset-6 rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,255,198,0.12) 0%, transparent 65%)",
              }}
            />
            <img
              src="/assets/generated/hero-ai-ecosystem.dim_1200x800.jpg"
              alt="AI Ecosystem"
              className="relative z-10 w-full rounded-2xl"
              style={{
                boxShadow:
                  "0 0 80px rgba(0,255,198,0.12), 0 0 160px rgba(0,255,198,0.06), 0 40px 80px rgba(0,0,0,0.6)",
                border: "1px solid rgba(0,255,198,0.18)",
              }}
            />
            {/* Floating badges */}
            <div
              className="absolute -top-5 -right-5 glass-panel px-4 py-2.5 rounded-xl text-sm font-bold z-20"
              style={{
                color: "#00ffc6",
                boxShadow: "0 0 20px rgba(0,255,198,0.2)",
              }}
            >
              🤖 AI-Powered
            </div>
            <div
              className="absolute -bottom-5 -left-5 glass-panel px-4 py-2.5 rounded-xl text-sm font-bold z-20"
              style={{
                color: "#ff6a00",
                boxShadow: "0 0 20px rgba(255,106,0,0.25)",
              }}
            >
              ₹47Cr+ Generated
            </div>
          </div>
        </div>

        {/* Authority Metrics — elevated strip */}
        <div className="metrics-strip mt-24 grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden">
          {[
            {
              target: 47,
              prefix: "₹",
              suffix: "Cr+",
              label: "Revenue Generated",
            },
            {
              target: 2400,
              prefix: "",
              suffix: "+",
              label: "Automations Built",
            },
            { target: 180, prefix: "", suffix: "+", label: "Clients Scaled" },
            { target: 340, prefix: "", suffix: "%", label: "Average ROI" },
          ].map((m) => (
            <div key={m.label} className="py-6 px-3 sm:py-10 sm:px-6">
              <AnimatedCounter
                target={m.target}
                prefix={m.prefix}
                suffix={m.suffix}
                label={m.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ECOSYSTEM FLOW
// ============================================================
function EcosystemFlow() {
  const nodes = ["Traffic", "CRM", "Automation", "Sales", "Retention", "Scale"];

  return (
    <div className="flex items-center gap-1 flex-wrap overflow-x-auto pb-1">
      {nodes.map((node, i) => (
        <div key={node} className="flex items-center gap-1">
          <div
            className="ecosystem-node px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap"
            style={{
              background: "rgba(0,255,198,0.08)",
              border: "1px solid rgba(0,255,198,0.35)",
              color: "#00ffc6",
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {node}
          </div>
          {i < nodes.length - 1 && (
            <svg
              aria-hidden="true"
              width="28"
              height="12"
              viewBox="0 0 28 12"
              className="opacity-60"
            >
              <line
                x1="0"
                y1="6"
                x2="22"
                y2="6"
                stroke="#00ffc6"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              <path
                d="M19 3l4 3-4 3"
                stroke="#00ffc6"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ENTERPRISE GROWTH SYSTEM SECTION
// ============================================================
const SERVICES = [
  {
    title: "Enterprise Website Architecture",
    icon: "🏗️",
    impact: "₹12L–₹45L",
    automation: "Deep",
    scalability: "10x",
    roi: "280%",
  },
  {
    title: "Full Funnel Revenue Systems",
    icon: "🔄",
    impact: "₹18L–₹60L",
    automation: "Full",
    scalability: "Unlimited",
    roi: "420%",
  },
  {
    title: "AI Sales Automation",
    icon: "🤖",
    impact: "₹25L–₹80L",
    automation: "95%",
    scalability: "50x",
    roi: "580%",
  },
  {
    title: "CRM & Pipeline Engineering",
    icon: "⚙️",
    impact: "₹15L–₹50L",
    automation: "Complete",
    scalability: "Enterprise",
    roi: "310%",
  },
  {
    title: "Multi-Channel Marketing Systems",
    icon: "📡",
    impact: "₹20L–₹75L",
    automation: "Intelligent",
    scalability: "20x",
    roi: "490%",
  },
  {
    title: "Conversion Rate Optimization",
    icon: "📈",
    impact: "₹8L–₹30L",
    automation: "AI-Driven",
    scalability: "Infinite",
    roi: "650%",
  },
  {
    title: "Performance Ad Scaling",
    icon: "🚀",
    impact: "₹30L–₹1Cr",
    automation: "Algorithmic",
    scalability: "100x",
    roi: "780%",
  },
  {
    title: "Advanced Analytics & Tracking",
    icon: "📊",
    impact: "₹5L–₹20L",
    automation: "Real-time",
    scalability: "Global",
    roi: "240%",
  },
];

function EnterpriseSystemsSection() {
  return (
    <section
      id="systems"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "#0b0b0f" }}
    >
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,255,198,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-20">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(0,255,198,0.12)",
              border: "1px solid rgba(0,255,198,0.25)",
              color: "#00ffc6",
            }}
          >
            Enterprise Framework
          </div>
          <h2 className="text-headline text-white mb-5">
            Our <span className="teal-glow-text heading-sweep">₹1 Crore</span>{" "}
            Scaling Framework
          </h2>
          <p className="text-subheadline max-w-2xl mx-auto">
            Eight precision-engineered growth systems that work together to
            build unstoppable revenue momentum.
          </p>
        </RevealSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => (
            <RevealSection key={service.title} delay={i * 80}>
              <div
                className="glow-card card-neon-hover cursor-hover glass-panel rounded-2xl p-7 h-full"
                style={{
                  boxShadow: "0 4px 40px rgba(0,0,0,0.35)",
                }}
              >
                <div className="text-3xl mb-5">{service.icon}</div>
                <h3 className="text-white font-extrabold text-base mb-6 leading-snug tracking-tight">
                  {service.title}
                </h3>
                <div className="space-y-2.5">
                  <MetricRow label="Revenue Impact" value={service.impact} />
                  <MetricRow label="Automation" value={service.automation} />
                  <MetricRow label="Scalability" value={service.scalability} />
                  <MetricRow
                    label="ROI Potential"
                    value={service.roi}
                    highlight
                  />
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-xs font-medium"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </span>
      <span
        className="text-xs font-bold"
        style={{ color: highlight ? "#ff6a00" : "#00ffc6" }}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// AI INTEGRATION COMMAND CENTER
// ============================================================
const INTEGRATION_NODES = [
  { label: "Website", icon: "🌐", angle: 0 },
  { label: "CRM", icon: "📋", angle: 36 },
  { label: "Payment", icon: "💳", angle: 72 },
  { label: "WhatsApp", icon: "💬", angle: 108 },
  { label: "Email Auto.", icon: "📧", angle: 144 },
  { label: "Meta Ads", icon: "📘", angle: 180 },
  { label: "Google Ads", icon: "🔍", angle: 216 },
  { label: "Analytics", icon: "📊", angle: 252 },
  { label: "Bookings", icon: "📅", angle: 288 },
  { label: "AI Chatbots", icon: "🤖", angle: 324 },
];

function IntegrationSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });
  const radius = 180;

  return (
    <section
      id="integration"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "rgba(0,255,198,0.04)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,255,198,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-20">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(0,255,198,0.12)",
              border: "1px solid rgba(0,255,198,0.25)",
              color: "#00ffc6",
            }}
          >
            AI Command Center
          </div>
          <h2 className="text-headline text-white mb-5">
            Everything Connected.{" "}
            <span className="teal-glow-text heading-sweep">
              Fully Automated.
            </span>{" "}
            Zero Manual Work.
          </h2>
          <p
            className="text-subheadline max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            One unified AI core connects every touchpoint in your business —
            creating seamless automated workflows that run 24/7.
          </p>
        </RevealSection>

        {/* Mobile Integration Grid - shown only on small screens */}
        <div className="md:hidden grid grid-cols-2 gap-3 mb-12">
          {INTEGRATION_NODES.map((node) => (
            <div
              key={node.label}
              className="glass-panel rounded-xl p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{node.icon}</span>
              <span className="text-sm font-bold" style={{ color: "#00ffc6" }}>
                {node.label}
              </span>
            </div>
          ))}
        </div>

        {/* Integration Diagram — desktop only */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="hidden md:flex justify-center mb-20"
        >
          <div
            className="relative"
            style={{ width: "500px", height: "500px", maxWidth: "100%" }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 500 500"
              className="absolute inset-0 w-full h-full"
            >
              {INTEGRATION_NODES.map((node, i) => {
                const angle = (node.angle * Math.PI) / 180;
                const nx = 250 + radius * Math.cos(angle - Math.PI / 2);
                const ny = 250 + radius * Math.sin(angle - Math.PI / 2);
                return (
                  <g key={node.label}>
                    <line
                      x1="250"
                      y1="250"
                      x2={nx}
                      y2={ny}
                      stroke="#00ffc6"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                      opacity={isVisible ? 1 : 0}
                      style={{
                        transition: `opacity 0.5s ease ${i * 0.1}s`,
                        animation: isVisible
                          ? `linePulse 3s ease-in-out ${i * 0.3}s infinite`
                          : "none",
                      }}
                    />
                  </g>
                );
              })}
              {/* Outer ring */}
              <circle
                cx="250"
                cy="250"
                r={radius}
                fill="none"
                stroke="rgba(0,255,198,0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Hub */}
            <div
              className="absolute hub-pulse rounded-2xl flex flex-col items-center justify-center text-center p-4"
              style={{
                width: "120px",
                height: "120px",
                left: "calc(50% - 60px)",
                top: "calc(50% - 60px)",
                background:
                  "linear-gradient(135deg, rgba(0,255,198,0.15), rgba(0,255,198,0.05))",
                border: "2px solid rgba(0,255,198,0.5)",
                backdropFilter: "blur(20px)",
              }}
            >
              <img
                src="/assets/generated/quickbee-logo-no-bg.dim_400x400.png"
                alt="QB Core"
                className="w-8 h-8 object-contain mb-1"
              />
              <span
                className="text-[9px] font-black tracking-widest uppercase leading-tight"
                style={{ color: "#00ffc6" }}
              >
                QUICK BEE
                <br />
                AI CORE
              </span>
            </div>

            {/* Orbit nodes */}
            {INTEGRATION_NODES.map((node, i) => {
              const angle = (node.angle * Math.PI) / 180;
              const nx = 250 + radius * Math.cos(angle - Math.PI / 2);
              const ny = 250 + radius * Math.sin(angle - Math.PI / 2);
              return (
                <div
                  key={node.label}
                  className="absolute flex flex-col items-center justify-center glass-panel rounded-xl text-center"
                  style={{
                    width: "68px",
                    height: "64px",
                    left: `calc(${(nx / 500) * 100}% - 34px)`,
                    top: `calc(${(ny / 500) * 100}% - 32px)`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "scale(1)" : "scale(0.5)",
                    transition: `all 0.4s ease ${i * 0.08}s`,
                  }}
                >
                  <span className="text-base">{node.icon}</span>
                  <span
                    className="text-[8px] font-bold mt-0.5 leading-tight"
                    style={{ color: "#00ffc6" }}
                  >
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature callouts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "🔌",
              title: "API Integrations",
              desc: "Connect every platform with bi-directional data sync and real-time triggers",
            },
            {
              icon: "⚡",
              title: "Workflow Triggers",
              desc: "Advanced conditional workflows that react to every customer action automatically",
            },
            {
              icon: "🎯",
              title: "Lead Routing",
              desc: "AI-powered lead scoring and instant automated routing to the right sales rep",
            },
            {
              icon: "💰",
              title: "Revenue Tracking",
              desc: "Live dashboards showing every rupee from source to sale in real-time",
            },
          ].map((item, i) => (
            <RevealSection key={item.title} delay={i * 100}>
              <div className="glow-card card-neon-hover cursor-hover glass-panel rounded-2xl p-6 h-full">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {item.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PERFORMANCE MARKETING ENGINE
// ============================================================
function PerformanceSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  const cacData = [85, 72, 61, 48, 38, 28];
  const roasData = [180, 240, 310, 390, 480, 620];
  const maxRoas = Math.max(...roasData);

  return (
    <section
      id="performance"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "#0b0b0f" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(255,106,0,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-20">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(255,106,0,0.07)",
              border: "1px solid rgba(255,106,0,0.25)",
              color: "#ff6a00",
            }}
          >
            Performance Engine
          </div>
          <h2 className="text-headline text-white mb-5">
            AI-Driven Performance Marketing That{" "}
            <span className="orange-glow-text">Scales Aggressively</span>
          </h2>
          <p className="text-subheadline max-w-2xl mx-auto">
            Data-first campaigns engineered for maximum return at every rupee
            spent.
          </p>
        </RevealSection>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          {/* CAC Chart */}
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-white font-bold text-lg mb-2">
              Customer Acquisition Cost
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              CAC declining as AI optimization kicks in
            </p>
            <div className="flex items-end gap-3 h-40">
              {(["M1", "M2", "M3", "M4", "M5", "M6"] as const).map(
                (month, i) => {
                  const val = cacData[i];
                  return (
                    <div
                      key={month}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        ₹{val}k
                      </span>
                      <div
                        className="w-full rounded-t-lg transition-all duration-1000"
                        style={{
                          height: isVisible ? `${(val / 85) * 100}%` : "0%",
                          background:
                            i === cacData.length - 1
                              ? "linear-gradient(to top, #00ffc6, #00ffc6aa)"
                              : "rgba(255,255,255,0.1)",
                          transitionDelay: `${i * 0.1}s`,
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {month}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
            <div
              className="mt-4 text-sm font-bold"
              style={{ color: "#00ffc6" }}
            >
              ↓ 67% reduction in CAC over 6 months
            </div>
          </div>

          {/* ROAS Chart */}
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-white font-bold text-lg mb-2">
              Return on Ad Spend
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              ROAS scaling with AI campaign optimization
            </p>
            <div className="flex items-end gap-3 h-40">
              {(["M1", "M2", "M3", "M4", "M5", "M6"] as const).map(
                (month, i) => {
                  const val = roasData[i];
                  return (
                    <div
                      key={month}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {val}%
                      </span>
                      <div
                        className="w-full rounded-t-lg transition-all duration-1000"
                        style={{
                          height: isVisible
                            ? `${(val / maxRoas) * 100}%`
                            : "0%",
                          background:
                            i === roasData.length - 1
                              ? "linear-gradient(to top, #ff6a00, #ff8c42)"
                              : "rgba(255,106,0,0.25)",
                          transitionDelay: `${i * 0.1}s`,
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {month}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
            <div
              className="mt-4 text-sm font-bold"
              style={{ color: "#ff6a00" }}
            >
              ↑ 620% ROAS achieved — industry avg is 180%
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              platform: "Meta Ads",
              icon: "📘",
              metric: "+380%",
              sub: "ROAS improvement",
              color: "#00ffc6",
            },
            {
              platform: "Google Ads",
              icon: "🔍",
              metric: "-52%",
              sub: "CPC reduction",
              color: "#00ffc6",
            },
            {
              platform: "Retargeting",
              icon: "🎯",
              metric: "18x",
              sub: "Return on spend",
              color: "#ff6a00",
            },
            {
              platform: "Funnel Scaling",
              icon: "📈",
              metric: "+440%",
              sub: "Lead volume",
              color: "#ff6a00",
            },
          ].map((item, i) => (
            <RevealSection key={item.platform} delay={i * 100}>
              <div className="glow-card glass-panel rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div
                  className="text-3xl font-extrabold mb-1"
                  style={{ color: item.color }}
                >
                  {item.metric}
                </div>
                <div className="text-white font-semibold text-sm">
                  {item.platform}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {item.sub}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// REVENUE FUNNEL SECTION
// ============================================================
const FUNNEL_STAGES = [
  { label: "Traffic", pct: 100, color: "#00ffc6" },
  { label: "Lead Capture", pct: 42, color: "#00e8b3" },
  { label: "Qualification", pct: 28, color: "#00c99a" },
  { label: "Nurture", pct: 19, color: "#ff8c42" },
  { label: "Conversion", pct: 12, color: "#ff7520" },
  { label: "Upsell", pct: 8, color: "#ff6a00" },
  { label: "Retention", pct: 94, color: "#ff5500" },
];

function FunnelSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section
      id="funnel"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "rgba(0,255,198,0.04)" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-20">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(0,255,198,0.12)",
              border: "1px solid rgba(0,255,198,0.25)",
              color: "#00ffc6",
            }}
          >
            Revenue Architecture
          </div>
          <h2 className="text-headline text-white mb-5">
            Your <span className="teal-glow-text">Automated</span> Revenue
            Machine
          </h2>
          <p className="text-subheadline max-w-2xl mx-auto">
            QUICK BEE builds automated revenue machines — not just websites.
            Every stage is optimized and runs without human intervention.
          </p>
        </RevealSection>

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col items-center gap-2"
        >
          {FUNNEL_STAGES.map((stage, i) => {
            const widthPct = 40 + ((100 - i * 8) / 100) * 60;
            return (
              <div
                key={stage.label}
                className="w-full flex items-center gap-4"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scaleX(1)" : "scaleX(0.3)",
                  transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                }}
              >
                <div className="w-20 sm:w-28 text-right">
                  <span
                    className="text-[10px] sm:text-xs font-medium"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {stage.label}
                  </span>
                </div>
                <div className="flex-1 relative h-11 flex items-center justify-center">
                  <div
                    className="absolute rounded-lg flex items-center justify-center h-full"
                    style={{
                      width: `${widthPct}%`,
                      background: `linear-gradient(90deg, ${stage.color}25, ${stage.color}15)`,
                      border: `1px solid ${stage.color}40`,
                    }}
                  >
                    <span
                      className="text-sm font-black"
                      style={{ color: stage.color }}
                    >
                      {stage.pct}%
                    </span>
                  </div>
                </div>
                <div className="w-10 sm:w-16">
                  <div
                    className="text-xs font-bold"
                    style={{ color: stage.color }}
                  >
                    {stage.pct}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <RevealSection className="mt-12 text-center">
          <div
            className="inline-block glass-panel rounded-2xl p-6 max-w-2xl"
            style={{ border: "1px solid rgba(0,255,198,0.2)" }}
          >
            <p className="text-white font-bold text-lg mb-2">
              🔄 Fully Automated Pipeline
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Every stage runs 24/7 without manual intervention. AI nurtures
              leads, qualifies prospects, and converts buyers automatically —
              while you focus on scaling.
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ============================================================
// CASE STUDIES SECTION
// ============================================================
const CASE_STUDIES = [
  {
    client: "D2C Fashion Brand",
    icon: "👗",
    before: "₹8L/month",
    after: "₹67L/month",
    period: "4 months",
    roi: "738%",
    metric1: { label: "Revenue Growth", value: "8.4x" },
    metric2: { label: "Customer LTV", value: "+340%" },
    tag: "D2C & E-Commerce",
  },
  {
    client: "B2B SaaS Platform",
    icon: "💻",
    before: "₹1,200 CPL",
    after: "₹180 CPL",
    period: "3 months",
    roi: "567%",
    metric1: { label: "Lead Cost Reduction", value: "85%" },
    metric2: { label: "Demo Conversion", value: "3x" },
    tag: "SaaS & Tech",
  },
  {
    client: "Education Platform",
    icon: "🎓",
    before: "₹12L annual",
    after: "₹1.2Cr annual",
    period: "12 months",
    roi: "900%",
    metric1: { label: "Revenue Scale", value: "10x" },
    metric2: { label: "Enrollment Rate", value: "+580%" },
    tag: "EdTech",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Sharma",
    role: "CEO, TechVentures India",
    text: "Quick Bee transformed our entire revenue engine. Within 6 months, we went from ₹15L to ₹1.2Cr monthly. The AI automation they built is phenomenal — our team barely touches anything manually now.",
    avatar: "RS",
    stars: 5,
  },
  {
    name: "Priya Kapoor",
    role: "Founder, EdStart Academy",
    text: "The ROI we've seen is unreal. Quick Bee's full-funnel system generated ₹67L in new revenue in just 90 days. Their team thinks in systems, not just campaigns.",
    avatar: "PK",
    stars: 5,
  },
  {
    name: "Amit Gupta",
    role: "MD, HealthFirst Clinics",
    text: "Finally, an agency that thinks like a business partner. They built an automated patient acquisition system that runs 24/7. Bookings up 480% in 5 months.",
    avatar: "AG",
    stars: 5,
  },
];

function CaseStudiesSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="results"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "#0b0b0f" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(255,106,0,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-20">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(255,106,0,0.07)",
              border: "1px solid rgba(255,106,0,0.25)",
              color: "#ff6a00",
            }}
          >
            Proven Results
          </div>
          <h2 className="text-headline text-white mb-5">
            Enterprise <span className="orange-glow-text">Growth Results</span>
          </h2>
          <p className="text-subheadline max-w-2xl mx-auto">
            Real numbers from real clients. Zero vanity metrics.
          </p>
        </RevealSection>

        {/* Case study cards */}
        <div className="grid md:grid-cols-3 gap-7 mb-20">
          {CASE_STUDIES.map((cs, i) => (
            <RevealSection key={cs.client} delay={i * 120}>
              <div className="glow-card glass-panel rounded-2xl p-7 h-full">
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{
                    background: "rgba(255,106,0,0.1)",
                    border: "1px solid rgba(255,106,0,0.2)",
                    color: "#ff6a00",
                  }}
                >
                  {cs.tag}
                </div>
                <div className="text-3xl mb-3">{cs.icon}</div>
                <h3 className="text-white font-bold text-lg mb-6">
                  {cs.client}
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 glass-panel rounded-xl p-4 text-center">
                    <div
                      className="text-xs mb-1"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      Before
                    </div>
                    <div className="text-white font-bold text-sm">
                      {cs.before}
                    </div>
                  </div>
                  <div className="text-2xl" style={{ color: "#00ffc6" }}>
                    →
                  </div>
                  <div className="flex-1 glass-panel rounded-xl p-4 text-center">
                    <div
                      className="text-xs mb-1"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      After
                    </div>
                    <div
                      className="font-black text-sm"
                      style={{ color: "#00ffc6" }}
                    >
                      {cs.after}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass-panel rounded-xl p-3 text-center">
                    <div
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {cs.metric1.label}
                    </div>
                    <div
                      className="font-black text-lg mt-1"
                      style={{ color: "#00ffc6" }}
                    >
                      {cs.metric1.value}
                    </div>
                  </div>
                  <div className="glass-panel rounded-xl p-3 text-center">
                    <div
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {cs.metric2.label}
                    </div>
                    <div
                      className="font-black text-lg mt-1"
                      style={{ color: "#00ffc6" }}
                    >
                      {cs.metric2.value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {cs.period}
                  </span>
                  <span
                    className="font-black text-xl"
                    style={{ color: "#ff6a00" }}
                  >
                    {cs.roi} ROI
                  </span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Testimonial slider */}
        <RevealSection className="mb-16">
          <h3 className="text-center text-white font-bold text-xl mb-8">
            What Our Clients Say
          </h3>
          <div className="glass-panel rounded-2xl p-5 sm:p-8 max-w-3xl mx-auto relative overflow-hidden">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="transition-all duration-500"
                style={{
                  display: i === activeTestimonial ? "block" : "none",
                }}
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.stars)
                    .fill(0)
                    .map((_, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: star rating, order never changes
                      <span key={j} style={{ color: "#ff6a00" }}>
                        ★
                      </span>
                    ))}
                </div>
                <p
                  className="text-sm sm:text-lg italic leading-relaxed mb-6"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
                    style={{
                      background: "rgba(0,255,198,0.15)",
                      border: "2px solid rgba(0,255,198,0.4)",
                      color: "#00ffc6",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold">{t.name}</div>
                    <div
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-2 justify-center mt-6">
              {TESTIMONIALS.map((t, i) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setActiveTestimonial(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i === activeTestimonial
                        ? "#00ffc6"
                        : "rgba(255,255,255,0.2)",
                    transform:
                      i === activeTestimonial ? "scale(1.4)" : "scale(1)",
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Video placeholder cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            "₹8L to ₹67L in 4 Months",
            "85% CAC Reduction — Live Demo",
            "10x Revenue Scale Story",
          ].map((title, i) => (
            <RevealSection key={title} delay={i * 120}>
              <div
                className="glow-card glass-panel rounded-2xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: "16/9" }}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-3 relative"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,255,198,0.05), rgba(255,106,0,0.05))",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "rgba(255,106,0,0.2)",
                      border: "2px solid rgba(255,106,0,0.5)",
                      boxShadow: "0 0 25px rgba(255,106,0,0.3)",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 ml-1"
                      style={{ color: "#ff6a00" }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-bold text-center px-4">
                    {title}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#00ffc6" }}
                  >
                    Watch Case Study →
                  </span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// 6-STEP PROCESS SECTION
// ============================================================
const STEPS = [
  {
    num: "01",
    title: "Deep Business Audit",
    desc: "Complete analysis of your revenue model, gaps, and growth blockers",
    icon: "🔍",
  },
  {
    num: "02",
    title: "Revenue Strategy Mapping",
    desc: "Custom blueprint designed around your specific growth targets",
    icon: "🗺️",
  },
  {
    num: "03",
    title: "Infrastructure Build",
    desc: "Enterprise-grade tech stack built for scale from day one",
    icon: "🏗️",
  },
  {
    num: "04",
    title: "Full System Integration",
    desc: "Every tool, platform, and workflow connected into one AI core",
    icon: "⚙️",
  },
  {
    num: "05",
    title: "Marketing Launch & Optimization",
    desc: "AI-powered campaigns launched across all high-ROI channels",
    icon: "🚀",
  },
  {
    num: "06",
    title: "Aggressive Scale & Expansion",
    desc: "Systems amplified to maximum velocity for compounding returns",
    icon: "📈",
  },
];

function ProcessSection() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });

  return (
    <section
      id="process"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "rgba(0,255,198,0.04)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-20">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(0,255,198,0.12)",
              border: "1px solid rgba(0,255,198,0.25)",
              color: "#00ffc6",
            }}
          >
            Our Method
          </div>
          <h2 className="text-headline text-white mb-5">
            Our <span className="teal-glow-text">6-Step</span> Scaling Blueprint
          </h2>
          <p className="text-subheadline max-w-2xl mx-auto">
            A systematic approach to building businesses that generate revenue
            on autopilot.
          </p>
        </RevealSection>

        {/* Desktop timeline */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="hidden lg:block relative"
        >
          {/* Connector line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-gray-800 mx-16">
            <div
              className="h-full transition-all duration-2000"
              style={{
                width: isVisible ? "100%" : "0%",
                background: "linear-gradient(90deg, #00ffc6, #ff6a00)",
                transition: "width 1.5s ease-out",
              }}
            />
          </div>

          <div className="grid grid-cols-6 gap-4 relative">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s ease ${i * 0.15}s`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10 font-black text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,255,198,0.15), rgba(0,255,198,0.05))",
                    border: "2px solid rgba(0,255,198,0.4)",
                    color: "#00ffc6",
                    boxShadow: "0 0 20px rgba(0,255,198,0.2)",
                  }}
                >
                  {step.num}
                </div>
                <div className="text-xl mb-2">{step.icon}</div>
                <h4 className="text-white font-bold text-sm mb-2 leading-tight">
                  {step.title}
                </h4>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="lg:hidden flex flex-col gap-0 relative">
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "rgba(0,255,198,0.2)" }}
          />
          {STEPS.map((step, i) => (
            <RevealSection key={step.num} delay={i * 100}>
              <div className="flex gap-6 pb-8 relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs z-10 relative"
                  style={{
                    background: "rgba(0,255,198,0.1)",
                    border: "2px solid rgba(0,255,198,0.4)",
                    color: "#00ffc6",
                    boxShadow: "0 0 15px rgba(0,255,198,0.2)",
                  }}
                >
                  {step.num}
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{step.icon}</span>
                    <h4 className="text-white font-bold">{step.title}</h4>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LEAD CAPTURE FORM SECTION
// ============================================================
function LeadCaptureSection() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    monthlyRevenue: "",
    budgetRange: "",
    growthGoals: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submitLead = useSubmitLead();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (
        !formData.name ||
        !formData.email ||
        !formData.company ||
        !formData.phone
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }
      try {
        await submitLead.mutateAsync(formData);
        setSubmitted(true);
        toast.success(
          "Application submitted! We'll be in touch within 24 hours.",
        );

        // Send all form details to WhatsApp
        const message = `*New Enterprise Strategy Application - Quick Bee Agency*\n\n*Name:* ${formData.name}\n*Company:* ${formData.company}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Monthly Revenue:* ${formData.monthlyRevenue || "Not specified"}\n*Budget Range:* ${formData.budgetRange || "Not specified"}\n*Growth Goals:* ${formData.growthGoals || "Not specified"}`;

        const whatsappUrl = `https://wa.me/919182768591?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    },
    [formData, submitLead],
  );

  return (
    <section
      id="apply"
      className="relative py-14 sm:py-20 md:py-40"
      style={{ background: "#0b0b0f" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,198,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection className="text-center mb-12">
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(255,106,0,0.08)",
              border: "1px solid rgba(255,106,0,0.3)",
              color: "#ff6a00",
            }}
          >
            🔒 Private Access Only
          </div>
          <h2 className="text-headline text-white mb-5">
            Apply For <span className="teal-glow-text">Private Growth</span>{" "}
            Partnership
          </h2>
          <p className="text-subheadline">
            We partner with only{" "}
            <strong style={{ color: "#ff6a00" }}>
              3–5 serious scaling businesses
            </strong>{" "}
            per month. If you're ready to build a revenue machine, apply below.
          </p>
        </RevealSection>

        {submitted ? (
          <RevealSection>
            <div
              className="glass-panel-strong rounded-3xl p-12 text-center"
              style={{ border: "1px solid rgba(0,255,198,0.3)" }}
            >
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-black text-white mb-3">
                Application Received!
              </h3>
              <p className="text-gray-400 mb-4">
                Your application is under review. Expect a response within{" "}
                <strong style={{ color: "#00ffc6" }}>24 hours</strong>.
              </p>
              <p className="text-gray-500 text-sm">
                Only qualified businesses receive a strategy call invitation.
              </p>
            </div>
          </RevealSection>
        ) : (
          <RevealSection>
            <form
              onSubmit={handleSubmit}
              className="glass-panel-strong rounded-3xl p-5 sm:p-8 md:p-10 space-y-5"
              style={{ border: "1px solid rgba(0,255,198,0.2)" }}
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    placeholder="Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    className="form-input"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,198,0.2)",
                      color: "white",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm font-medium">
                    Company Name *
                  </Label>
                  <Input
                    placeholder="TechVentures India"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, company: e.target.value }))
                    }
                    required
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,198,0.2)",
                      color: "white",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    placeholder="rajesh@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,198,0.2)",
                      color: "white",
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, phone: e.target.value }))
                    }
                    required
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,255,198,0.2)",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm font-medium">
                    Current Monthly Revenue *
                  </Label>
                  <Select
                    value={formData.monthlyRevenue}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, monthlyRevenue: v }))
                    }
                  >
                    <SelectTrigger
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,255,198,0.2)",
                        color: formData.monthlyRevenue
                          ? "white"
                          : "rgb(156,163,175)",
                      }}
                    >
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "#1a1a20",
                        border: "1px solid rgba(0,255,198,0.2)",
                        color: "white",
                      }}
                    >
                      <SelectItem value="Below ₹5L">Below ₹5L</SelectItem>
                      <SelectItem value="₹5L–₹25L">₹5L–₹25L</SelectItem>
                      <SelectItem value="₹25L–₹1Cr">₹25L–₹1Cr</SelectItem>
                      <SelectItem value="₹1Cr+">₹1Cr+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-sm font-medium">
                    Investment Budget *
                  </Label>
                  <Select
                    value={formData.budgetRange}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, budgetRange: v }))
                    }
                  >
                    <SelectTrigger
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(0,255,198,0.2)",
                        color: formData.budgetRange
                          ? "white"
                          : "rgb(156,163,175)",
                      }}
                    >
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "#1a1a20",
                        border: "1px solid rgba(0,255,198,0.2)",
                        color: "white",
                      }}
                    >
                      <SelectItem value="₹5L–₹10L">₹5L–₹10L</SelectItem>
                      <SelectItem value="₹10L–₹25L">₹10L–₹25L</SelectItem>
                      <SelectItem value="₹25L+">₹25L+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-sm font-medium">
                  Describe Your Growth Goals *
                </Label>
                <Textarea
                  placeholder="Tell us about your revenue targets, current challenges, and what you want to achieve in the next 12 months..."
                  value={formData.growthGoals}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, growthGoals: e.target.value }))
                  }
                  rows={4}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,255,198,0.2)",
                    color: "white",
                    resize: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitLead.isPending}
                className="btn-orange touch-target w-full py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                style={{
                  touchAction: "manipulation",
                  background: submitLead.isPending
                    ? "rgba(255,106,0,0.5)"
                    : undefined,
                }}
              >
                {submitLead.isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>Apply for Enterprise Strategy Call →</>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs">
                🔒 Your information is 100% confidential. No spam, ever.
              </p>
            </form>
          </RevealSection>
        )}
      </div>
    </section>
  );
}

// ============================================================
// FINAL CTA SECTION
// ============================================================
function FinalCTASection() {
  const finalCtaMagnetic = useMagneticHover(0.3);

  return (
    <section
      className="relative py-14 sm:py-20 md:py-40 overflow-hidden"
      style={{ background: "#0b0b0f" }}
    >
      {/* Dramatic glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(0,255,198,0.08) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 70% 50%, rgba(255,106,0,0.08) 0%, transparent 60%)",
        }}
      />
      {/* Grid bg */}
      <div className="hero-grid-bg pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <RevealSection>
          <div
            className="section-eyebrow"
            style={{
              background: "rgba(255,106,0,0.08)",
              border: "1px solid rgba(255,106,0,0.3)",
              color: "#ff6a00",
            }}
          >
            ⚡ Limited Spots Available
          </div>

          <h2 className="text-display text-white mb-8">
            Ready To Build Your{" "}
            <span className="teal-glow-text heading-sweep">₹1 Crore</span> AI
            Revenue Engine?
          </h2>

          <p className="text-subheadline mb-12 max-w-2xl mx-auto">
            Limited spots available. Apply before they're gone. Only 3–5
            partnerships open per month for serious 8-figure scaling businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              ref={finalCtaMagnetic.ref as React.RefObject<HTMLAnchorElement>}
              href="#apply"
              className="btn-orange btn-orange-hero btn-orange-glow cursor-hover touch-target inline-flex items-center w-full sm:w-auto justify-center gap-3 px-12 py-6 rounded-2xl"
              style={{ touchAction: "manipulation", ...finalCtaMagnetic.style }}
              onMouseMove={(e) =>
                finalCtaMagnetic.onMouseMove(e as React.MouseEvent<HTMLElement>)
              }
              onMouseLeave={finalCtaMagnetic.onMouseLeave}
            >
              Start My Enterprise Growth System
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="https://wa.me/919182768591"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal-outline cursor-hover touch-target inline-flex items-center w-full sm:w-auto justify-center gap-3 px-12 py-6 rounded-2xl"
              style={{ touchAction: "manipulation" }}
            >
              Book Free 30-Min Strategy Call
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12">
            {[
              "✅ No long-term lock-ins",
              "✅ ROI guarantee or refund",
              "✅ Dedicated growth team",
              "✅ Weekly performance reports",
            ].map((item) => (
              <span
                key={item}
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {item}
              </span>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="relative pt-16 pb-8"
      style={{
        background: "#080810",
        borderTop: "1px solid rgba(0,255,198,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/quickbee-logo-no-bg.dim_400x400.png"
                alt="Quick Bee Agency"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="font-extrabold text-white text-sm tracking-widest uppercase block">
                  QUICK BEE AGENCY
                </span>
                <span
                  className="text-[10px] tracking-widest"
                  style={{ color: "#00ffc6" }}
                >
                  Enterprise AI Automation Partner
                </span>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              We engineer AI-powered revenue ecosystems for 8-figure businesses.
              From websites to automation, CRM to marketing — fully integrated
              and fully automated.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-bold text-xs tracking-widest uppercase mb-4"
              style={{ color: "#00ffc6" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ["Systems", "#systems"],
                ["Services", "#services"],
                ["Enterprise Plans", "#enterprise-plans"],
                ["Integration", "#integration"],
                ["Results", "#results"],
                ["Process", "#process"],
                ["Apply Now", "#apply"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold text-xs tracking-widest uppercase mb-4"
              style={{ color: "#00ffc6" }}
            >
              Contact
            </h4>
            <ul className="space-y-2">
              <li
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                📧 hello@quickbeeagency.com
              </li>
              <li
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                📞 +91 91827 68591
              </li>
              <li
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                📍 Uma Nagar, Old Town, Anantapur
              </li>
              <li>
                <a
                  href="https://wa.me/919182768591"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold transition-colors"
                  style={{ color: "#25d366" }}
                >
                  💬 WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            © {year} Quick Bee Agency. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: "#00ffc6" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// WHATSAPP FLOATING BUTTON
// ============================================================
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919182768591"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center whatsapp-pulse touch-target cursor-hover"
      style={{
        background: "#25d366",
        boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
        touchAction: "manipulation",
      }}
      aria-label="Chat on WhatsApp"
    >
      <span className="sr-only">Chat on WhatsApp</span>
      <svg
        aria-hidden="true"
        className="w-7 h-7 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// ============================================================
// PAGE VIEW TRACKER
// ============================================================
function PageViewTracker() {
  const { mutate: incrementPageView } = useIncrementPageView();

  useEffect(() => {
    incrementPageView();
  }, [incrementPageView]);

  return null;
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0b0b0f", color: "#ffffff" }}
    >
      {/* Custom cursor — renders above everything */}
      <CustomCursor />

      {/* Global 3D particle background — fixed, behind everything */}
      <Background3D />

      <PageViewTracker />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(11,11,15,0.95)",
            border: "1px solid rgba(0,255,198,0.3)",
            color: "#ffffff",
          },
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <EnterpriseSystemsSection />
        <ServicesSection />
        <IntegrationSection />
        <PerformanceSection />
        <FunnelSection />
        <CaseStudiesSection />
        <ProcessSection />
        <LeadCaptureSection />
        <FinalCTASection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
