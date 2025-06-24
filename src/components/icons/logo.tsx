import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        {/* The base of the launchpad */}
        <path
          d="M15 85 H85 L90 95 H10 Z"
          fill="hsl(var(--secondary))"
        />
        
        {/* The arrow representing launch/growth */}
        <path
          d="M50 5 L65 35 H35 Z"
          fill="hsl(var(--primary))"
        />
        
        {/* The trail/body of the rocket/arrow */}
        <rect
          x="42.5"
          y="30"
          width="15"
          height="55"
          fill="hsl(var(--primary))"
        />
      </g>
    </svg>
  );
}
