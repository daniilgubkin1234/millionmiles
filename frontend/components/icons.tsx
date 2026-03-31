import type { SVGProps } from "react";

function BaseIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props} />;
}

export function MarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path d="M15.5 2 19 9l-7.5-3.5L15.5 2Z" fill="#c6ab6c" />
      <path d="M30 15.5 23 19l3.5-7.5L30 15.5Z" fill="#c6ab6c" />
      <path d="M16.5 30 13 23l7.5 3.5L16.5 30Z" fill="#c6ab6c" />
      <path d="M2 16.5 9 13l-3.5 7.5L2 16.5Z" fill="#c6ab6c" />
      <path d="m9.2 9.2 4.1 1.6-5.7 1.8 1.6-3.4Z" fill="#c6ab6c" opacity=".9" />
      <path d="m22.8 9.2-1.6 4.1 5.7-1.8-4.1-2.3Z" fill="#c6ab6c" opacity=".9" />
      <path d="m22.8 22.8-4.1-1.6 5.7-1.8-1.6 3.4Z" fill="#c6ab6c" opacity=".9" />
      <path d="m9.2 22.8 1.6-4.1-5.7 1.8 4.1 2.3Z" fill="#c6ab6c" opacity=".9" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M13.4 20v-6.2h2.2l.4-2.8h-2.6V9.2c0-.9.3-1.5 1.6-1.5H16V5.3c-.3 0-.9-.1-1.8-.1-2.7 0-4.3 1.6-4.3 4.5V11H7.6v2.8H10V20h3.4Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M14.4 5.5c.7 1.9 2 3.1 4 3.5v2.5c-1.3 0-2.5-.3-3.6-1v4.3c0 3-2 5-4.8 5-2.6 0-4.6-1.9-4.6-4.5 0-2.8 2.1-4.7 4.9-4.7.3 0 .6 0 1 .1v2.6c-.3-.1-.5-.1-.8-.1-1.3 0-2.3.8-2.3 2s1 2 2.2 2c1.3 0 2.2-.8 2.2-2.4V5.5h1.8Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M20.2 8.2c-.2-.9-.9-1.6-1.8-1.8-1.6-.4-7-.4-8.8 0-.9.2-1.6.9-1.8 1.8-.4 1.6-.4 6 0 7.6.2.9.9 1.6 1.8 1.8 1.7.4 7.1.4 8.8 0 .9-.2 1.6-.9 1.8-1.8.4-1.6.4-6 0-7.6Z" />
      <path d="m10.4 15.5 4.7-2.7-4.7-2.7v5.4Z" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}
