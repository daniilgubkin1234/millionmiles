"use client";

import Image from "next/image";
import { useState } from "react";
import { Car, formatMileage, formatPriceDisplay } from "@/lib/api";

type CarCardProps = {
  car: Car;
  compact?: boolean;
};

const FALLBACK_IMAGE = "/car-placeholder.svg";

export function CarCard({ car, compact = false }: CarCardProps) {
  const [imgSrc, setImgSrc] = useState(car.image_url || FALLBACK_IMAGE);

  if (compact) {
    return (
      <article className="group/card relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:shadow-lg">
        <div className="group/carousel relative w-full overflow-hidden bg-neutral-100 aspect-[4/3]">
          <Image
            src={imgSrc}
            alt={car.title}
            fill
            unoptimized
            className="object-cover transition duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />

          <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-neutral-900 shadow-sm backdrop-blur-sm">
            <span className="text-[#c6ab6c]">●</span>
            KR
          </div>
        </div>

        <a
          href={car.source_url}
          target="_blank"
          rel="noreferrer"
          className="flex grow flex-col p-5 text-neutral-950"
        >
          <div className="mb-4 min-h-[68px]">
            <h3
              className="overflow-hidden text-lg font-bold uppercase leading-tight"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {car.brand && car.model ? `${car.brand} ${car.model}` : car.title}
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              {car.year ? `${car.year}` : "—"}
            </p>
          </div>

          <div className="mb-6 border-b border-neutral-100 pb-4 text-sm text-neutral-600">
            <div>
              <span className="block text-xs text-neutral-400">Пробег</span>
              <span>{formatMileage(car.mileage_km)}</span>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs uppercase text-neutral-400">Цена</span>
              <span className="whitespace-nowrap text-xl font-bold text-[#c6ab6c]">
                {formatPriceDisplay(car)}
              </span>
            </div>

            <a
      href={car.source_url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 min-w-[136px] items-center justify-center rounded-xl bg-[#c6ab6c] px-5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#b89d5f] hover:shadow-md"
    >
      Подробнее
    </a>
          </div>
        </a>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#ece3d1] bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.10)]">
      <div className="relative h-64 overflow-hidden bg-[#f6f2e8]">
        <Image
          src={imgSrc}
          alt={car.title}
          fill
          unoptimized
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-medium text-[#151515] backdrop-blur">
          {car.brand}
        </div>
      </div>

      <div className="space-y-4 p-6 text-[#151515]">
        <div>
          <h3 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">
            {car.brand && car.model ? `${car.brand} ${car.model}` : car.title}
          </h3>
          <p className="mt-2 text-sm text-black/60">
            {car.year ? `${car.year}` : "—"} • {formatMileage(car.mileage_km)}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-black/45">Price</p>
            <p className="mt-1 text-4xl font-semibold leading-none text-[#151515]">
              {formatPriceDisplay(car)}
            </p>
          </div>

          <a
            href={car.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#c6ab6c] bg-[#c6ab6c] px-5 text-sm font-semibold text-[#151515] transition hover:brightness-95"
          >
            View source
          </a>
        </div>
      </div>
    </article>
  );
}