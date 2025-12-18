import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Food rescue dashboard",
  description: "Zipli — Food surplus management dashboard",
  icons: {
    icon: '/zipli-white.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased dark`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="nextjs-ui-theme">
          <SidebarConfigProvider>{children}</SidebarConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
