import { type CSSProperties, useCallback, useRef, useState } from "react";

interface MagneticHoverResult {
  ref: React.RefObject<HTMLElement | null>;
  style: CSSProperties;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

/**
 * Magnetic hover effect — element gently pulls toward the cursor.
 * Returns ref + style + event handlers to spread onto the element.
 * Max movement: 12px in any direction.
 */
export function useMagneticHover(strength = 0.35): MagneticHoverResult {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Max 12px displacement
      const maxDist = 12;
      const x = Math.max(-maxDist, Math.min(maxDist, dx * strength));
      const y = Math.max(-maxDist, Math.min(maxDist, dy * strength));

      setOffset({ x, y });
      setIsActive(true);
    },
    [strength],
  );

  const onMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setIsActive(false);
  }, []);

  const style: CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: isActive
      ? "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
      : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    willChange: "transform",
  };

  return {
    ref: ref as React.RefObject<HTMLElement | null>,
    style,
    onMouseMove,
    onMouseLeave,
  };
}
