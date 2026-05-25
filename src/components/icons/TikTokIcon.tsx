import { SVGProps } from "react";

export const TikTokIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M19.6 6.32a5.43 5.43 0 0 1-3.77-1.5 5.42 5.42 0 0 1-1.54-3.32H10.6v13.13a2.7 2.7 0 1 1-2.7-2.7c.3 0 .58.05.85.13V8.27a6.39 6.39 0 0 0-.85-.06 6.4 6.4 0 1 0 6.4 6.4V8.94a8.78 8.78 0 0 0 5.3 1.77V6.92a5.4 5.4 0 0 1 0-.6Z" />
  </svg>
);

export default TikTokIcon;
