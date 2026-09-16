// Simple recreation of the Nexora mark (orbiting cube) in inline SVG so the
// app doesn't depend on an image asset. Swap in the real logo file if you
// have one exported as SVG/PNG.
export default function Logo({ size = 28 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="27" rx="19" ry="7" stroke="#7DD3FC" strokeWidth="2" />
        <path
          d="M24 9 L35 15.5 V28.5 L24 35 L13 28.5 V15.5 Z"
          stroke="#E7EAF0"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M24 9 V22 M13 15.5 L24 22 L35 15.5"
          stroke="#E7EAF0"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="font-semibold tracking-[0.15em] text-[#E7EAF0]"
        style={{ fontSize: size * 0.5 }}
      >
        NEXORA
      </span>
    </div>
  );
}
