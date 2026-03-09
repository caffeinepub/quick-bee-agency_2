import { useEffect, useRef, useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import type { EnterprisePlan, Service } from "./ServicesData";
import { getServiceOffer } from "./ServicesSection";

interface CheckoutPageProps {
  service?: Service;
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
    price: "₹4,999",
    icon: "🔍",
    desc: "Rank on Google Page 1",
  },
  {
    name: "Logo & Brand Kit",
    price: "₹2,999",
    icon: "🎨",
    desc: "Professional brand identity",
  },
  {
    name: "Hosting Setup",
    price: "₹1,999",
    icon: "🖥️",
    desc: "Fast & secure hosting",
  },
  {
    name: "Monthly Maintenance",
    price: "₹3,999",
    icon: "🔧",
    desc: "Ongoing support & updates",
  },
];

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
  const topRef = useRef<HTMLDivElement>(null);

  const itemName = service ? service.name : plan ? plan.name : "";
  const rawPrice = service
    ? service.price
    : plan
      ? Number.parseInt(plan.price.replace(/[^0-9]/g, ""), 10)
      : 0;
  const displayPrice = `₹${rawPrice.toLocaleString("en-IN")}`;
  const features = service ? service.features : plan ? plan.features : [];
  const deliveryTime = service ? service.deliveryTime : "Custom Timeline";
  const offer = service ? getServiceOffer(service) : null;

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
    try {
      await openPayment({
        amount: rawPrice * 100,
        name: "Quick Bee Agency",
        description: itemName,
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
                      "{t.text}"
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
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
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
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
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
              {paying ? "Opening Payment..." : `Pay ${displayPrice} Now →`}
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

        {/* Bonus */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,106,0,0.08),rgba(0,255,198,0.06))",
            border: "1px solid rgba(255,106,0,0.25)",
          }}
        >
          <div className="text-2xl mb-2">🎁</div>
          <div className="font-black text-lg mb-1" style={{ color: "#ff6a00" }}>
            BONUS: Free Strategy Session Included
          </div>
          <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Every purchase includes a FREE 30-minute strategy call — valued at
            ₹5,000.
          </div>
        </div>

        {/* Upsells */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(0,255,198,0.12)",
          }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#00ffc6" }}>
            Recommended Add-ons
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UPSELLS.map((u) => (
              <div
                key={u.name}
                className="p-4 rounded-xl text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,255,198,0.1)",
                }}
              >
                <div className="text-2xl mb-1">{u.icon}</div>
                <div className="text-xs font-semibold mb-1">{u.name}</div>
                <div
                  className="text-xs mb-2"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {u.desc}
                </div>
                <div className="text-sm font-bold" style={{ color: "#00ffc6" }}>
                  {u.price}
                </div>
              </div>
            ))}
          </div>
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
              Terms & Conditions
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
