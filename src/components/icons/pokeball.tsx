interface PokeballProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}

export function Pokeball({
  className = "",
  size = 48,
  color = "currentColor",
  opacity = 1,
  style,
}: PokeballProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, ...style }}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="4" />
      {/* Top half fill */}
      <path
        d="M50 2C74.5 2 94.5 19.5 97.5 42H66.5C64 34.5 57.5 29 50 29C42.5 29 36 34.5 33.5 42H2.5C5.5 19.5 25.5 2 50 2Z"
        fill={color}
      />
      {/* Center line */}
      <line x1="2" y1="50" x2="98" y2="50" stroke={color} strokeWidth="4" />
      {/* Center circle outer */}
      <circle cx="50" cy="50" r="16" stroke={color} strokeWidth="4" />
      {/* Center circle inner */}
      <circle cx="50" cy="50" r="8" fill={color} />
    </svg>
  );
}

export function PokeballFilled({
  className = "",
  size = 48,
}: PokeballProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top half - red */}
      <path
        d="M50 2C74.85 2 95.24 20.23 97.87 44H65.53C63.14 36.36 56.16 31 50 31C43.84 31 36.86 36.36 34.47 44H2.13C4.76 20.23 25.15 2 50 2Z"
        fill="#EF4444"
      />
      {/* Bottom half - white */}
      <path
        d="M50 98C25.15 98 4.76 79.77 2.13 56H34.47C36.86 63.64 43.84 69 50 69C56.16 69 63.14 63.64 65.53 56H97.87C95.24 79.77 74.85 98 50 98Z"
        fill="#F5F5F5"
      />
      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" stroke="#1A1A2E" strokeWidth="4" />
      {/* Center band */}
      <rect x="2" y="44" width="96" height="12" fill="#1A1A2E" />
      {/* Center button outer */}
      <circle cx="50" cy="50" r="16" fill="#1A1A2E" />
      {/* Center button inner */}
      <circle cx="50" cy="50" r="11" fill="#F5F5F5" stroke="#1A1A2E" strokeWidth="2" />
      {/* Center button dot */}
      <circle cx="50" cy="50" r="5" fill="#1A1A2E" />
      {/* Highlight */}
      <ellipse cx="35" cy="22" rx="12" ry="6" fill="rgba(255,255,255,0.2)" transform="rotate(-20 35 22)" />
    </svg>
  );
}

export function GreatBall({ className = "", size = 48 }: PokeballProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top half - blue */}
      <path
        d="M50 2C74.85 2 95.24 20.23 97.87 44H65.53C63.14 36.36 56.16 31 50 31C43.84 31 36.86 36.36 34.47 44H2.13C4.76 20.23 25.15 2 50 2Z"
        fill="#3B82F6"
      />
      {/* Red stripes on top */}
      <path d="M20 20 Q 35 15, 50 20 Q 65 25, 80 20" stroke="#EF4444" strokeWidth="5" fill="none" />
      {/* Bottom half */}
      <path
        d="M50 98C25.15 98 4.76 79.77 2.13 56H34.47C36.86 63.64 43.84 69 50 69C56.16 69 63.14 63.64 65.53 56H97.87C95.24 79.77 74.85 98 50 98Z"
        fill="#F5F5F5"
      />
      <circle cx="50" cy="50" r="48" stroke="#1A1A2E" strokeWidth="4" />
      <rect x="2" y="44" width="96" height="12" fill="#1A1A2E" />
      <circle cx="50" cy="50" r="16" fill="#1A1A2E" />
      <circle cx="50" cy="50" r="11" fill="#F5F5F5" stroke="#1A1A2E" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="#1A1A2E" />
    </svg>
  );
}

export function UltraBall({ className = "", size = 48 }: PokeballProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top half - black/yellow */}
      <path
        d="M50 2C74.85 2 95.24 20.23 97.87 44H65.53C63.14 36.36 56.16 31 50 31C43.84 31 36.86 36.36 34.47 44H2.13C4.76 20.23 25.15 2 50 2Z"
        fill="#1A1A2E"
      />
      {/* Yellow V shape */}
      <path d="M15 8 L50 35 L85 8" stroke="#F8D030" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom half */}
      <path
        d="M50 98C25.15 98 4.76 79.77 2.13 56H34.47C36.86 63.64 43.84 69 50 69C56.16 69 63.14 63.64 65.53 56H97.87C95.24 79.77 74.85 98 50 98Z"
        fill="#F5F5F5"
      />
      <circle cx="50" cy="50" r="48" stroke="#1A1A2E" strokeWidth="4" />
      <rect x="2" y="44" width="96" height="12" fill="#1A1A2E" />
      <circle cx="50" cy="50" r="16" fill="#1A1A2E" />
      <circle cx="50" cy="50" r="11" fill="#F5F5F5" stroke="#1A1A2E" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="#1A1A2E" />
    </svg>
  );
}
