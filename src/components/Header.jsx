import Link from "next/link";
import { Cpu } from "lucide-react";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoGroup}>
          <Cpu className={styles.logoIcon} size={24} color="#000000" />
          <span className={styles.logoText}>
            Aura
          </span>
        </Link>
        <nav className={styles.navGroup}>
          {/* Navigation intent is transactional/onboarding */}
        </nav>
        <div>
          <button className={styles.lockButton}>
            Lock
          </button>
        </div>
      </div>
    </header>
  );
}

