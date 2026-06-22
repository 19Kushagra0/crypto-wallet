import Link from "next/link";
import { PlusCircle, ArrowRight, Download, ShieldCheck } from "lucide-react";
import styles from "../styles/Onboarding.module.css";

export default function Onboarding() {
  return (
    <div className={styles.container}>
      {/* Left Side: Headline & Brand */}
      <div className={styles.leftSide}>
        <h1 className={styles.headline}>
          Secure your digital assets with Aura.
        </h1>
        <p className={styles.description}>
          Your keys. Your crypto. Always. Take full ownership of your digital
          assets with a wallet built for the next generation of Web3.
        </p>
      </div>

      {/* Right Side: Asymmetric Action Areas */}
      <div className={styles.rightSide}>
        {/* Primary Action Card (Elevated Level 2) */}
        <div className={styles.primaryCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconContainer}>
              <PlusCircle size={24} />
            </div>
            <h2 className={styles.cardTitle}>
              Create a New Wallet
            </h2>
            <p className={styles.cardDescription}>
              Generate a fresh, secure seed phrase and establish your presence
              on-chain in seconds.
            </p>
          </div>
          <Link href="/create" className={styles.primaryButton}>
            Get Started
            <ArrowRight size={18} />
          </Link>
          <div className={styles.cardFooterText}>
            <span className={styles.estTime}>
              EST. TIME: ~2 MIN
            </span>
          </div>
        </div>

        {/* Secondary Action Area (Ghost/Supporting) */}
        <div className={styles.secondaryCard}>
          <div>
            <h3 className={styles.secondaryCardTitle}>
              Import Existing
            </h3>
            <p className={styles.secondaryCardDesc}>
              Restore via seed phrase or private key.
            </p>
          </div>
          <Link href="/import" className={styles.secondaryButton}>
            Import
            <Download size={16} />
          </Link>
        </div>

        {/* Decorative element */}
        <div className={styles.decorativeBlur}></div>
      </div>
    </div>
  );
}
