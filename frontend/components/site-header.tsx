"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";

type SiteHeaderProps = {
  compact?: boolean;
};

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/millionmiles.ae?igsh=MTlnYzAzbWU3eHowZg==", icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/share/19KUCZ1sFo", icon: FacebookIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@million.miles.ae?_t=ZS-8zrKRgks8gB&_r=1", icon: TikTokIcon },
  { label: "YouTube", href: "https://youtube.com/@millionmiles-ae?si=zxIjJUdv6ltJlyUn", icon: YouTubeIcon },
];

const serviceLinks = [
  { label: "Поиск автомобилей", href: "/find-car" },
  { label: "Продать автомобиль", href: "/sell-car" },
  { label: "Оформить страховку", href: "/insurance" },
  { label: "Купить в лизинг", href: "/lease-a-car" },
  { label: "Импорт и экспорт", href: "/import-and-export" },
  { label: "Логистические услуги", href: "/logistic" },
  { label: "Постановка на учет", href: "/registration" },
  { label: "Сервис и детейлинг", href: "/detailing" },
];

const aboutLinks = [
  { label: "Философия компании", href: "/philosophy" },
  { label: "Карьера", href: "/career" },
  { label: "Стать дилером", href: "/dealer" },
  { label: "Контакты", href: "/contacts" },
];

export function SiteHeader({ compact = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function closeMenu() {
    setMobileOpen(false);
    setServicesOpen(false);
    setAboutOpen(false);
  }

  return (
    <header className="fixed top-0 z-50 h-[60px] w-full bg-black transition-all md:h-20">
      <nav className="relative mx-auto flex h-full max-w-[1920px] items-center justify-between px-5 py-2.5 lg:px-16">
        <div className="z-20 flex flex-1 justify-start">
          <Link href="/" className="z-20 cursor-pointer">
            <Image
              src="/logo.svg"
              alt="Million Miles"
              width={176}
              height={34}
              className="min-w-44"
              priority
            />
          </Link>
        </div>

        <div className="hidden flex-none px-4 lg:flex">
          <div className="flex items-center justify-center gap-4 transition-all xl:gap-8">
            <Link href="/catalog" className="font-semibold text-white transition-colors duration-200 hover:text-[#c6ab6c]">
              Каталог
            </Link>
            <a href="/#services" className="font-semibold text-white transition-colors duration-200 hover:text-[#c6ab6c]">
              Услуги
            </a>
            <a href="/#filters" className="font-semibold text-white transition-colors duration-200 hover:text-[#c6ab6c]">
              Вопрос эксперту
            </a>
            <a href="/#about" className="font-semibold text-white transition-colors duration-200 hover:text-[#c6ab6c]">
              О компании
            </a>
          </div>
        </div>

        {!compact && (
          <>
            <div className="hidden flex-1 justify-end md:flex">
              <div className="flex items-center space-x-4 px-5">
                <button
                  type="button"
                  className="group inline-flex items-center justify-between bg-transparent text-sm font-medium text-white transition-colors hover:text-[#c6ab6c] focus:outline-none"
                >
                  <span className="mr-2 text-sm">RU</span>
                  <span className="mr-2">Русский</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="group inline-flex items-center justify-between bg-transparent text-sm font-medium text-white transition-colors hover:text-[#c6ab6c] focus:outline-none"
                >
                  <span className="mr-2">₩</span>
                  <span className="mr-2">KRW</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="hidden justify-end md:flex">
              <div className="z-20 flex gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="group relative flex size-10 items-center justify-center rounded-md bg-white/12 outline-1 outline-transparent transition-colors duration-300 hover:bg-[#c6ab6c]"
                  >
                    <Icon className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-black" />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="z-20 flex items-center md:hidden">
          {!compact && (
            <div className="mr-3 flex items-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label="Select language"
              >
                <span className="text-sm text-white">RU</span>
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label="Select currency"
              >
                <span className="text-xs font-semibold text-white">₩</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="cursor-pointer text-white transition-colors duration-200 hover:text-[#c6ab6c]"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 20 20" className="block h-6 w-6" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4A1 1 0 013 5zM3 10a1 1 0 011-1h12a1 1 0 110 2H4A1 1 0 013 10zM3 15a1 1 0 011-1h12a1 1 0 110 2H4A1 1 0 013 15z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 z-40 h-full w-[86%] max-w-[400px] transform bg-white backdrop-blur-sm transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex w-full items-center justify-between border-b border-[#e1e0e0] px-6 py-4">
            <Image
              src="/logo-no-text.svg"
              alt="Million Miles logo"
              width={32}
              height={32}
            />

            <button
              type="button"
              onClick={closeMenu}
              className="z-50 cursor-pointer text-black transition-colors duration-200 hover:text-[#c6ab6c]"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 20 20" className="block h-5 w-5" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="grow overflow-y-auto">
            <nav className="flex flex-col gap-10 py-8 text-black">
              <Link
                href="/catalog"
                className="px-6 font-semibold text-black transition-colors duration-200 hover:text-[#c6ab6c]"
                onClick={closeMenu}
              >
                Каталог
              </Link>

              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setServicesOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-6 font-semibold text-black transition-colors duration-200 hover:text-[#c6ab6c]"
                >
                  <span>Услуги</span>
                  <svg viewBox="0 0 256 256" className={`h-5 w-5 transition-transform duration-300 ${servicesOpen ? "rotate-45" : ""}`} fill="currentColor">
                    <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    servicesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-8 px-6 pb-2 pt-8 pl-10">
                    {serviceLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-sm text-black transition-colors duration-200 hover:text-[#c6ab6c]"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="/#filters"
                className="px-6 font-semibold text-black transition-colors duration-200 hover:text-[#c6ab6c]"
                onClick={closeMenu}
              >
                Вопрос эксперту
              </a>

              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setAboutOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-6 font-semibold text-black transition-colors duration-200 hover:text-[#c6ab6c]"
                >
                  <span>О компании</span>
                  <svg viewBox="0 0 256 256" className={`h-5 w-5 transition-transform duration-300 ${aboutOpen ? "rotate-45" : ""}`} fill="currentColor">
                    <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    aboutOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-8 px-6 pb-2 pt-8 pl-10">
                    {aboutLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-sm text-black transition-colors duration-200 hover:text-[#c6ab6c]"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex gap-2 p-6">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group relative flex size-10 items-center justify-center rounded-md bg-[#c6ab6c] transition-colors duration-300 hover:bg-[#e3cf9b]"
              >
                <Icon className="h-5 w-5 text-black" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}