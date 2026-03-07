declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number; // in paise
  name: string;
  description: string;
  onSuccess?: (paymentId: string) => void;
  onDismiss?: () => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_KEY_ID = "rzp_live_SLp2q2xOcCwcEz";

let scriptLoadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  if (window.Razorpay) {
    scriptLoadPromise = Promise.resolve();
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Razorpay script failed to load")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay script failed to load"));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Preload the Razorpay script as early as possible to eliminate click-to-pay lag.
 * Call this once at app startup (e.g. in main.tsx or App.tsx).
 */
export function preloadRazorpay(): void {
  loadRazorpayScript().catch(() => {
    // silent — will retry on actual payment click
    scriptLoadPromise = null;
  });
}

export function useRazorpay() {
  const openPayment = async (options: RazorpayOptions) => {
    await loadRazorpayScript();

    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: "INR",
      name: options.name,
      description: options.description,
      prefill: options.prefill ?? {},
      theme: {
        color: "#00ffc6",
      },
      modal: {
        ondismiss: () => {
          options.onDismiss?.();
        },
      },
      handler: (response: { razorpay_payment_id: string }) => {
        options.onSuccess?.(response.razorpay_payment_id);
      },
    });

    rzp.open();
  };

  return { openPayment };
}
