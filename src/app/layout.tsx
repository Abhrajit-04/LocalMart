import type { Metadata } from "next";

import "./globals.css";
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/initUser";

export const metadata: Metadata = {
  title: "LoKart | The Neighborhood Marketplace",
  description: "Your neighborhood marketplace. Discover and shop directly with local businesses right around the corner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="w-full min-h-screen bg-gradient-to-b from-emerald-100 via-green-200 to-amber-100">
        <Provider>
          <StoreProvider>
          <InitUser/>
            {children}
          </StoreProvider>

        </Provider>

        </body>
    </html>
  );
}
