import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/utils/config";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + Hardhat",
  description: "A React + Web3 starter created with create-react-web3-cli",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Restore the wallet connection from the request cookies so wagmi
  // hydrates with the same state the server rendered.
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie"),
  );

  return (
    <html lang="en">
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
