"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";

type Option = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  placeholder: string;
  value?: string;
  options: Option[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function SearchableSelect({
  placeholder,
  value,
  options,
  disabled,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(
    () => options.find((item) => item.value === value)?.label ?? placeholder,
    [options, value, placeholder]
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((item) => item.label.toLowerCase().includes(q));
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={[
          "flex h-11 w-full items-center justify-between rounded-xl border p-3 text-left text-sm transition-all duration-200",
          disabled
            ? "cursor-not-allowed border-neutral-200 bg-neutral-200 opacity-50"
            : "cursor-pointer border-neutral-200 bg-white hover:border-[#c6ab6c] focus:outline-none focus:ring-2 focus:ring-[#c6ab6c]",
        ].join(" ")}
      >
        <span className={value ? "block truncate text-neutral-900" : "block truncate text-neutral-500"}>
          {selectedLabel}
        </span>
        <CaretDown
          size={14}
          className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={[
          "absolute z-20 mt-2 w-full min-w-44 origin-top overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200",
          open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        ].join(" ")}
        role="listbox"
      >
        <div className="border-b border-neutral-100 bg-white px-3 py-2">
          <div className="relative flex items-center">
            <MagnifyingGlass size={16} className="absolute left-2.5 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full rounded-lg bg-neutral-50 py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c6ab6c]/50"
            />
          </div>
        </div>

        <ul className="max-h-60 overflow-y-auto py-1">
          <li
            className="cursor-pointer border-b border-neutral-100 bg-neutral-100 px-4 py-2.5 text-sm text-neutral-400"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {placeholder}
          </li>

          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className="cursor-pointer px-4 py-2.5 text-sm text-neutral-900 transition-colors hover:bg-neutral-50"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}