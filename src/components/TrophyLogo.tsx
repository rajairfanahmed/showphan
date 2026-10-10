import React from "react";

interface TrophyLogoProps {
  className?: string;
  size?: number;
}

export function TrophyLogo({ className = "", size = 32 }: TrophyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Showphan Trophy Logo"
    >
      {/* 
        Trophy Silhouette with Code Brackets { } cut out in the center,
        recreated precisely from public/logo.jpg
      */}
      {/* Trophy Body with Handle */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 29 19
          C 29 19, 41 17, 50 17
          C 59 17, 71 19, 71 19
          C 71 19, 70 33, 67 43
          C 64 53, 58 60, 56 63
          C 54 65, 52 67, 52 70
          C 52 72, 57 74, 59 75
          L 63 75
          L 63 79
          L 65 79
          L 65 83
          L 35 83
          L 35 79
          L 37 79
          L 37 75
          L 41 75
          C 43 74, 48 72, 48 70
          C 48 67, 46 65, 44 63
          C 42 60, 36 53, 33 43
          C 30 33, 29 19, 29 19
          Z

          M 71 24
          L 77 24
          C 81 24, 82 30, 80 39
          C 78 45, 73 50, 68 52
          L 67 48
          C 70 46, 74 42, 75 37
          C 76 31, 75 28, 71 28
          L 71 24
          Z
        "
        fill="currentColor"
      />

      {/* Inner Cutout: Code Curly Brackets { } and Central Thread (White / Transparent in Dark/Light) */}
      {/* Top curved thread */}
      <path
        d="M 50 17 C 50 20, 52 23, 52 27 L 52 32"
        stroke="var(--background)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Left Curly Bracket { */}
      <path
        d="
          M 47 28
          C 43 28, 41 30, 41 33
          L 41 37
          C 41 39, 39 41, 36 41
          C 39 41, 41 43, 41 45
          L 41 49
          C 41 52, 43 54, 47 54
        "
        stroke="var(--background)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Curly Bracket } */}
      <path
        d="
          M 53 28
          C 57 28, 59 30, 59 33
          L 59 37
          C 59 39, 61 41, 64 41
          C 61 41, 59 43, 59 45
          L 59 49
          C 59 52, 57 54, 53 54
        "
        stroke="var(--background)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom curved thread connecting brackets to base */}
      <path
        d="M 50 50 C 50 56, 48 62, 44 68"
        stroke="var(--background)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
