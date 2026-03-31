import Link from "next/link";
import { LandingFilterSection } from "@/components/landing-filter-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
   <main className="min-h-screen bg-white text-black pt-[60px] md:pt-20">
      <SiteHeader />

    <section className="w-full flex flex-col md:relative md:block">
    <div className="relative w-full aspect-square overflow-hidden md:aspect-[1920/720]">
        <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-reference.jpg"
        >
        <source src="/banner-video.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео тег.
        </video>

        <div className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-r from-black/60 to-transparent md:block" />
    </div>

    <div className="flex w-full flex-col items-start justify-end bg-white px-6 py-10 md:absolute md:inset-0 md:z-20 md:w-[70%] md:bg-transparent md:px-[4%] lg:gap-4 xl:gap-6">
        <h1 className="mb-3 max-w-3xl whitespace-pre-line text-3xl font-semibold leading-[1.15] text-black md:text-[clamp(24px,3vw,42px)] md:text-white">
        {"Премиальный сервис по поиску\nи доставке любых\nтранспортных средств"}
        </h1>

        <p className="mb-6 max-w-lg whitespace-pre-line text-base text-neutral-900 md:text-[clamp(14px,1.1vw,20px)] md:text-white">
        {"В любую точку мира, в самые короткие сроки!"}
        </p>

        <div className="w-full md:w-max">
        <Link href="#contact">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c6ab6c] px-6 py-3 text-md font-semibold text-black transition-all duration-300 hover:bg-white hover:text-black hover:ring-2 hover:ring-[#c6ab6c] focus:outline-none focus:ring-2 focus:ring-[#e3cf9b]">
            Связаться с нами
            </button>
        </Link>
        </div>
    </div>
</section>

      <LandingFilterSection />

<section id="services" className="mx-auto w-full max-w-[1840px] px-4 py-8 sm:px-6 lg:px-8">
  <div className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-lg md:block md:min-h-[450px] md:rounded-3xl md:bg-black lg:min-h-[500px]">
    <div className="relative h-96 w-full md:hidden sm:h-80">
      <div className="absolute inset-0 bg-[url('/car-on-order-section-mobile.webp')] bg-cover bg-center" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-900 to-transparent" />
    </div>

    <div className="absolute top-0 hidden h-full w-full select-none md:block xl:w-[85%] right-0">
      <div className="absolute inset-0 bg-[url('/car-on-order-section.webp')] bg-cover bg-right" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,1)_30%,rgba(0,0,0,0.6)_58%,rgba(0,0,0,0)_100%)]" />
    </div>

    <div className="pointer-events-none flex flex-col gap-6 p-6 sm:p-8 md:absolute md:inset-0 md:z-10 md:h-full md:justify-between md:p-12 lg:p-16">
      <div className="pointer-events-auto flex max-w-full flex-col gap-4 md:max-w-[70%] md:gap-6 lg:max-w-[55%] xl:max-w-[50%]">
        <h2 className="whitespace-pre-line text-2xl font-bold leading-tight text-white sm:text-3xl md:text-3xl lg:text-4xl xl:text-[40px] 2xl:text-5xl">
          {"Автомобиль под заказ\nк дверям вашего дома"}
        </h2>

        <p className="mb-8 whitespace-pre-line text-lg leading-relaxed text-neutral-300 md:text-xl">
          {"Оставьте заявку, мы найдем и доставим автомобиль в нужном цвете и комплектации.\nВозьмем на себя полную ответственность и все коммуникации."}
        </p>
      </div>

      <div className="pointer-events-auto mt-2 md:mt-0">
        <Link href="#contact" className="block w-full md:w-auto">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c6ab6c] px-6 py-3.5 text-base font-bold text-black transition-all duration-300 hover:bg-[#beac7a] focus:outline-none focus:ring-2 focus:ring-[#e3cf9b] md:w-max md:py-3">
            Заказать авто
          </button>
        </Link>
      </div>
    </div>
  </div>
</section>

      <div id="about">
        <SiteFooter />
      </div>
    </main>
  );
}
