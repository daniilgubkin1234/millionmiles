import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { QueryProvider } from "@/components/query-provider";

export const metadata: Metadata = {
  title: "Каталог автомобилей | Million Miles",
  description: "Premium landing and catalog for ENCAR-based vehicle listings",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
