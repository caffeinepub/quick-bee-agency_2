import { useEffect, useRef, useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import type { Service } from "./ServicesData";

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
}

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

type PaymentState = "idle" | "loading" | "success" | "error";

export default function ServiceDetailModal({
  service,
  onClose,
}: ServiceDetailModalProps) {
  const { openPayment } = useRazorpay();
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Reset payment state whenever a new service is opened
  const prevServiceId = useRef<number | undefined>(undefined);
  if (service?.id !== prevServiceId.current) {
    prevServiceId.current = service?.id;
    setPaymentState("idle");
    setErrorMessage("");
  }

  // Open/close the native dialog element
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (service) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [service]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (service) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [service]);

  const handlePay = async () => {
    if (!service) return;
    setPaymentState("loading");
    setErrorMessage("");

    try {
      await openPayment({
        amount: service.price * 100,
        name: "Quick Bee Agency",
        description: service.name,
        prefill: { name: "", email: "", contact: "" },
        onSuccess: (_paymentId: string) => {
          setPaymentState("success");
        },
        onDismiss: () => {
          setPaymentState("idle");
        },
      });
    } catch {
      setPaymentState("error");
      setErrorMessage(
        "Payment gateway could not be loaded. Please try again or contact us.",
      );
    }
  };

  const handleStrategyCall = () => {
    onClose();
    window.location.hash = "apply";
  };

  if (!service) return null;

  return (
    <>
      <style>{`
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPanelIn {
          from { opacity: 0; transform: scale(0.93) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmerBar {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .service-dialog::backdrop {
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: modalOverlayIn 0.25s ease-out;
        }
        .service-dialog {
          background: transparent;
          border: none;
          padding: 0;
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .service-dialog[open] {
          display: flex;
        }
        .service-dialog-inner {
          pointer-events: all;
        }
      `}</style>

      <dialog
        ref={dialogRef}
        className="service-dialog fixed inset-0 z-50 p-4"
        aria-label={service.name}
        onClose={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div
          className="service-dialog-inner relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(18,18,28,0.98) 0%, rgba(11,11,15,0.99) 100%)",
            border: "1px solid rgba(0,255,198,0.25)",
            boxShadow:
              "0 0 80px rgba(0,255,198,0.08), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            animation: "modalPanelIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,255,198,0.2) transparent",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
            aria-label="Close modal"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,106,0,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,106,0,0.4)";
              (e.currentTarget as HTMLButtonElement).style.color = "#ff6a00";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.7)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Header gradient bar */}
          <div
            className="h-1.5 rounded-t-3xl"
            style={{
              background: "linear-gradient(90deg, #00ffc6, #ff6a00, #00ffc6)",
              backgroundSize: "200% 100%",
              animation: "shimmerBar 3s linear infinite",
            }}
          />

          <div className="px-7 pt-7 pb-8 sm:px-9 sm:pt-8">
            {/* Top area: icon + name + badges */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-16 h-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: "rgba(0,255,198,0.08)",
                  border: "1px solid rgba(0,255,198,0.2)",
                }}
              >
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {service.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(0,255,198,0.1)",
                      border: "1px solid rgba(0,255,198,0.3)",
                      color: "#00ffc6",
                    }}
                  >
                    {service.category}
                  </span>
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(255,106,0,0.1)",
                      border: "1px solid rgba(255,106,0,0.3)",
                      color: "#ff6a00",
                    }}
                  >
                    ⏱ {service.deliveryTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div
              className="flex items-center gap-3 mb-5 p-4 rounded-2xl"
              style={{
                background: "rgba(0,255,198,0.05)",
                border: "1px solid rgba(0,255,198,0.15)",
              }}
            >
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-0.5">
                  Investment
                </div>
                <div
                  className="text-4xl font-black"
                  style={{
                    color: "#00ffc6",
                    textShadow:
                      "0 0 30px rgba(0,255,198,0.4), 0 0 60px rgba(0,255,198,0.15)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {formatPrice(service.price)}
                </div>
              </div>
              <div
                className="ml-auto text-right hidden sm:block"
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}
              >
                One-time project fee
                <br />
                GST applicable
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {service.description}
            </p>

            {/* Features */}
            <div className="mb-7">
              <h3
                className="text-xs font-black tracking-[0.2em] uppercase mb-4"
                style={{ color: "#00ffc6" }}
              >
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{
                        background: "rgba(0,255,198,0.12)",
                        color: "#00ffc6",
                        border: "1px solid rgba(0,255,198,0.25)",
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-sm text-gray-300 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div
              className="mb-7"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            />

            {/* CTA Area */}
            {paymentState === "success" ? (
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "rgba(0,255,198,0.07)",
                  border: "1px solid rgba(0,255,198,0.3)",
                }}
              >
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-lg font-black text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-sm text-gray-300">
                  Our team will contact you within 24 hours to kick off your
                  project. Check your email for confirmation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Pay Now button */}
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={paymentState === "loading"}
                  className="w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 relative overflow-hidden"
                  style={{
                    background:
                      paymentState === "loading"
                        ? "rgba(255,106,0,0.5)"
                        : "linear-gradient(135deg, #ff6a00 0%, #ff3d00 100%)",
                    color: "#fff",
                    boxShadow:
                      paymentState === "loading"
                        ? "none"
                        : "0 0 30px rgba(255,106,0,0.4), 0 8px 30px rgba(0,0,0,0.4)",
                    letterSpacing: "0.05em",
                    cursor:
                      paymentState === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {paymentState === "loading" ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg
                        className="animate-spin"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Loading Payment Gateway...
                    </span>
                  ) : (
                    `💳 PAY NOW — ${formatPrice(service.price)}`
                  )}
                </button>

                {/* Error message */}
                {paymentState === "error" && (
                  <div
                    className="rounded-xl px-4 py-3 text-sm text-center"
                    style={{
                      background: "rgba(255,50,50,0.08)",
                      border: "1px solid rgba(255,50,50,0.25)",
                      color: "#ff6b6b",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Strategy Call button */}
                <button
                  type="button"
                  onClick={handleStrategyCall}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-center block transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "1.5px solid rgba(0,255,198,0.35)",
                    color: "#00ffc6",
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(0,255,198,0.07)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(0,255,198,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(0,255,198,0.35)";
                  }}
                >
                  📞 BOOK A STRATEGY CALL FIRST
                </button>

                {/* Trust note */}
                <p className="text-center text-xs text-gray-600 pt-1">
                  🔒 Secured by Razorpay · 256-bit SSL encryption
                </p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
