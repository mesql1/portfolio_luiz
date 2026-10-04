import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luiz Eduardo — Backend Developer",
  description: "Portfólio de Luiz Eduardo, desenvolvedor backend focado em Python, Django, APIs e automação.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
