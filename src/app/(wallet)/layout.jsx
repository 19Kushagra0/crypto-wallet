"use client";

import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/WalletLayout.module.css";

export default function WalletLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={`${styles.layout} ${isHome ? "mesh-gradient" : ""}`}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

