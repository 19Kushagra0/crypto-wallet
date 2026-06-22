import "./globals.css";

export const metadata = {
  title: "Aura Wallet",
  description: "A premium Web3 wallet experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
