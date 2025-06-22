import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fillRule="evenodd">
        <path fill="#1e3a8a" d="M60 210h136v16H60z" />
        <path fill="#1e3a8a" d="M80 180h16v30H80z" />
        <path fill="#3b82f6" d="M108 140c-2 15-4 30 20 40 24-10 22-25 20-40H108z" />
        <path fill="#1e3a8a" d="M128 10C108 40 108 90 108 140h40c0-50 0-100-20-130z" />
        <path fill="#1e3a8a" d="M108 100v40h-20c10-20 15-30 20-40z" />
        <path fill="#1e3a8a" d="M148 100v40h20c-10-20-15-30-20-40z" />
        <circle fill="#FFFFFF" cx="128" cy="60" r="12" />
      </g>
    </svg>
  );
}
