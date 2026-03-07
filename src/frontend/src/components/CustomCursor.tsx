import { useEffect, useRef, useState } from "react";

/**
 * 3D Robotic Bee Cursor
 * - SVG robotic bee (teal + orange) that follows the mouse pointer tip
 * - Flying bobbing + wing-flap animation
 * - Larger glow ring trails behind
 * - Scales up and turns orange-dominant on interactive hover
 * - Hidden on touch devices
 */
export default function CustomCursor() {
  const beeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -300, y: -300 });
  const ring = useRef({ x: -300, y: -300 });
  const rafId = useRef<number | null>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        !!target.closest(
          "a, button, [role='button'], .cursor-hover, input, textarea, select, [tabindex]",
        ),
      );
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.1);

      // Bee tip is at top-left of the SVG (stinger/head area) — offset so pointer tip aligns
      if (beeRef.current) {
        beeRef.current.style.transform = `translate(${mouse.current.x - 6}px, ${mouse.current.y - 6}px)`;
      }
      if (ringRef.current) {
        const s = isHovering ? 64 : 44;
        ringRef.current.style.transform = `translate(${ring.current.x - s / 2}px, ${ring.current.y - s / 2}px)`;
        ringRef.current.style.width = `${s}px`;
        ringRef.current.style.height = `${s}px`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [isTouch, isHovering, isVisible]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        @keyframes beeFly {
          0%   { transform: translateY(0px) rotate(-4deg); }
          25%  { transform: translateY(-5px) rotate(2deg); }
          50%  { transform: translateY(-2px) rotate(-2deg); }
          75%  { transform: translateY(-7px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(-4deg); }
        }
        @keyframes wingFlapLeft {
          0%, 100% { transform: rotate(-20deg) scaleY(1); opacity: 0.85; }
          50%       { transform: rotate(-50deg) scaleY(0.7); opacity: 0.55; }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: rotate(20deg) scaleY(1); opacity: 0.85; }
          50%       { transform: rotate(50deg) scaleY(0.7); opacity: 0.55; }
        }
        @keyframes antennaPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .bee-body-inner { animation: beeFly 0.55s ease-in-out infinite; }
        .bee-wing-l { transform-origin: 60% 80%; animation: wingFlapLeft  0.12s linear infinite; }
        .bee-wing-r { transform-origin: 40% 80%; animation: wingFlapRight 0.12s linear infinite; }
        .bee-antenna { animation: antennaPulse 1.2s ease-in-out infinite; }
      `}</style>

      {/* Robotic Bee */}
      <div
        ref={beeRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "52px" : "40px",
          height: isHovering ? "52px" : "40px",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.3s ease",
          willChange: "transform",
          filter: isHovering
            ? "drop-shadow(0 0 8px #ff6a00) drop-shadow(0 0 16px #ff6a0080)"
            : "drop-shadow(0 0 6px #00ffc6) drop-shadow(0 0 12px #00ffc660)",
        }}
      >
        <div
          className="bee-body-inner"
          style={{ width: "100%", height: "100%" }}
        >
          <svg
            viewBox="0 0 48 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%" }}
            role="img"
            aria-label="Robotic bee cursor"
          >
            <title>Robotic bee cursor</title>
            {/* ── Antennae ── */}
            <g className="bee-antenna">
              {/* Left antenna */}
              <line
                x1="18"
                y1="8"
                x2="11"
                y2="1"
                stroke="#00ffc6"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="10.5"
                cy="0.8"
                r="2"
                fill="#ff6a00"
                stroke="#00ffc6"
                strokeWidth="0.8"
              />
              {/* Right antenna */}
              <line
                x1="30"
                y1="8"
                x2="37"
                y2="1"
                stroke="#00ffc6"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="37.5"
                cy="0.8"
                r="2"
                fill="#ff6a00"
                stroke="#00ffc6"
                strokeWidth="0.8"
              />
            </g>

            {/* ── Wings (behind body) ── */}
            {/* Left wing */}
            <ellipse
              className="bee-wing-l"
              cx="13"
              cy="18"
              rx="9"
              ry="5"
              fill="rgba(0,255,198,0.18)"
              stroke="#00ffc6"
              strokeWidth="1"
            />
            {/* Right wing */}
            <ellipse
              className="bee-wing-r"
              cx="35"
              cy="18"
              rx="9"
              ry="5"
              fill="rgba(0,255,198,0.18)"
              stroke="#00ffc6"
              strokeWidth="1"
            />

            {/* ── Head ── */}
            <ellipse
              cx="24"
              cy="12"
              rx="8"
              ry="7"
              fill="#0B0B0F"
              stroke="#00ffc6"
              strokeWidth="1.5"
            />
            {/* Visor / eye band */}
            <rect
              x="17"
              y="10"
              width="14"
              height="5"
              rx="2.5"
              fill="#00ffc6"
              opacity="0.18"
              stroke="#00ffc6"
              strokeWidth="0.8"
            />
            {/* Eyes */}
            <circle
              cx="20.5"
              cy="12.5"
              r="2.2"
              fill="#0B0B0F"
              stroke="#ff6a00"
              strokeWidth="1"
            />
            <circle cx="20.5" cy="12.5" r="0.9" fill="#ff6a00" />
            <circle
              cx="27.5"
              cy="12.5"
              r="2.2"
              fill="#0B0B0F"
              stroke="#ff6a00"
              strokeWidth="1"
            />
            <circle cx="27.5" cy="12.5" r="0.9" fill="#ff6a00" />
            {/* Eye glints */}
            <circle cx="21.2" cy="11.8" r="0.5" fill="white" opacity="0.7" />
            <circle cx="28.2" cy="11.8" r="0.5" fill="white" opacity="0.7" />

            {/* ── Body (thorax + abdomen) ── */}
            {/* Thorax */}
            <ellipse
              cx="24"
              cy="22"
              rx="8"
              ry="6"
              fill="#1a1a2e"
              stroke="#00ffc6"
              strokeWidth="1.2"
            />
            {/* Abdomen stripes */}
            <ellipse
              cx="24"
              cy="33"
              rx="8"
              ry="10"
              fill="#0B0B0F"
              stroke="#00ffc6"
              strokeWidth="1.2"
            />
            {/* Stripe 1 — orange */}
            <rect
              x="16.5"
              y="28"
              width="15"
              height="3.5"
              rx="1.8"
              fill="#ff6a00"
              opacity="0.85"
            />
            {/* Stripe 2 — teal */}
            <rect
              x="16.5"
              y="33"
              width="15"
              height="3.5"
              rx="1.8"
              fill="#00ffc6"
              opacity="0.6"
            />
            {/* Stripe 3 — orange */}
            <rect
              x="17"
              y="38"
              width="14"
              height="3"
              rx="1.5"
              fill="#ff6a00"
              opacity="0.7"
            />
            {/* Body highlight */}
            <ellipse
              cx="21"
              cy="26"
              rx="3"
              ry="2"
              fill="white"
              opacity="0.06"
            />

            {/* ── Stinger / tail ── */}
            <polygon
              points="24,50 21,43 27,43"
              fill="#ff6a00"
              stroke="#00ffc6"
              strokeWidth="0.8"
            />

            {/* ── Circuit detail on thorax ── */}
            <line
              x1="21"
              y1="20"
              x2="23"
              y2="20"
              stroke="#00ffc6"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="23"
              y1="20"
              x2="23"
              y2="23"
              stroke="#00ffc6"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="25"
              y1="20"
              x2="27"
              y2="20"
              stroke="#00ffc6"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <line
              x1="25"
              y1="20"
              x2="25"
              y2="23"
              stroke="#00ffc6"
              strokeWidth="0.6"
              opacity="0.6"
            />
            <circle cx="24" cy="23.5" r="0.8" fill="#ff6a00" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Trailing glow ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: `1.5px solid ${isHovering ? "#ff6a00" : "#00ffc6"}`,
          pointerEvents: "none",
          zIndex: 99998,
          opacity: isVisible ? (isHovering ? 0.75 : 0.45) : 0,
          boxShadow: isHovering
            ? "0 0 18px #ff6a0066, 0 0 36px #ff6a0030"
            : "0 0 14px #00ffc644, 0 0 28px #00ffc620",
          transition:
            "border-color 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease",
          willChange: "transform, width, height",
        }}
      />
    </>
  );
}
