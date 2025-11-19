import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../../packages/ui/src/styles/globals.css";
import { Providers } from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZKSign Holder Wallet",
  description: "Manage your verifiable credentials with privacy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

