import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@zksign/ui/styles/globals.css";
import { Web3Provider, Toaster } from "@zksign/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZKSign Verifier",
  description: "Verify credentials with zero-knowledge proofs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}

