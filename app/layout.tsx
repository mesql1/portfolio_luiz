import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luiz Mesquita — Backend Developer",
  description: "Portfólio de Luiz Mesquita, desenvolvedor backend focado em Python, Django, APIs e automação.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`, shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
