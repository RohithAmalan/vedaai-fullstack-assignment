export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F78A23" />
          <stop offset="40%" stopColor="#D94C1D" />
          <stop offset="100%" stopColor="#7A1015" />
        </linearGradient>
        
        {/* Shadow for 3D effect */}
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
        
        <linearGradient id="leftArm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <linearGradient id="rightArm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      {/* Background Rounded Rect */}
      <rect x="0" y="0" width="100" height="100" rx="30" fill="url(#bgGrad)" />

      {/* V Shape - Right Arm (Behind) */}
      <path
        d="M 52 75 L 82 25 L 60 25 L 40 75 Z"
        fill="url(#rightArm)"
      />

      {/* V Shape - Left Arm (Front) */}
      <path
        d="M 18 25 L 42 25 L 56 75 L 32 75 Z"
        fill="url(#leftArm)"
        filter="url(#shadow)"
      />
    </svg>
  );
}
