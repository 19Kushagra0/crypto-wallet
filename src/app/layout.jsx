import "./globals.css";
import { WalletProvider } from "../context/WalletContext";

export const metadata = {
  title: "Aura Wallet",
  description: "A premium Web3 wallet experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
