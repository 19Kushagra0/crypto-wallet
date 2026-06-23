import Link from "next/link";
import { Cpu } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useRouter } from "next/navigation";
import styles from "../styles/Header.module.css";

export default function Header() {
  const { wallet, lockWallet } = useWallet();
  const router = useRouter();

  const handleLock = () => {
    lockWallet();
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoGroup}>
          <Cpu className={styles.logoIcon} size={24} color="#000000" />
          <span className={styles.logoText}>Aura</span>
        </Link>
        <nav className={styles.navGroup}>
          {/* Navigation intent is transactional/onboarding */}
        </nav>
        <div>
          {wallet && (
            <button onClick={handleLock} className={styles.lockButton}>
              Lock
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
