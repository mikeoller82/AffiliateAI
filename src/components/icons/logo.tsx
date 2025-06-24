import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        {/* Left Bar */}
        <path d="M25 95 V60 L40 52 V87 Z" fill="hsl(var(--secondary))" />
        {/* Middle Bar */}
        <path d="M45 95 V40 L60 32 V87 Z" fill="hsl(var(--secondary))" />
        {/* Arrow (Base + Head) */}
        <path d="M65 95 V25 L80 17 V87 Z" fill="hsl(var(--primary))" />
        <path d="M55 22 L80 5 L105 22 L80 32 Z" fill="hsl(var(--primary))" />
      </g>
    </svg>
  );
}
