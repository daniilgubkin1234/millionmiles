"use client";

import Image from "next/image";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";

const socialLinks = [
  { label: "Instagram", icon: InstagramIcon },
  { label: "Facebook", icon: FacebookIcon },
  { label: "TikTok", icon: TikTokIcon },
  { label: "YouTube", icon: YouTubeIcon },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 w-full rounded-t-3xl bg-black text-white">
      <div className="mx-auto flex max-w-[1840px] flex-col gap-6 px-4 py-6 md:gap-10 md:px-8 md:py-10 xl:px-16">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-0">
          <a href="/" className="z-20 cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Million Miles"
              width={176}
              height={34}
              className="min-w-44"
            />
          </a>

          <div className="z-20 flex gap-2">
            {socialLinks.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="group relative flex size-10 items-center justify-center rounded-md bg-[#1a1a1a] outline outline-1 outline-transparent transition-colors duration-300 hover:outline-[#c6ab6c] hover:bg-[#c6ab6c] active:bg-[#c6ab6c]"
              >
                <Icon className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-black" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-b-2 border-neutral-700 pb-6 md:pb-10 lg:flex-row lg:items-start lg:gap-0">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 sm:text-left">
            <span className="text-sm md:text-base">Million Miles*</span>
            <span className="hidden text-white/45 sm:inline">|</span>
            <span className="text-sm md:text-base">
              Sara Building Showroom no.1 - Al Quoz 3 - Dubai
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 lg:text-right">
            <a
              href="#contact"
              className="text-sm transition-colors duration-300 hover:text-[#c6ab6c] md:text-base"
            >
              Связаться с нами
            </a>
            <span className="hidden text-white/45 sm:inline">|</span>
            <a
              href="tel:+971585990763"
              className="text-sm transition-colors duration-300 hover:text-[#c6ab6c] md:text-base"
            >
              +7 952 251-51-54
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-center text-xs text-white/65 sm:text-left md:text-sm">
          <a
            href="https://github.com/daniilgubkin1234"
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-[#c6ab6c]"
          >
            Github: github.com/daniilgubkin1234
          </a>
          <a
            href="https://t.me/pobichamshoot"
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-[#c6ab6c]"
          >
            Telegram: @pobichamshoot
          </a>
        </div>

        <span className="text-center text-xs sm:text-left md:text-sm">
          © 2026, Daniil Gubkin
        </span>
      </div>
    </footer>
  );
}