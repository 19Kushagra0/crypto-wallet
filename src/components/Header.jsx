import Link from "next/link";
import { Cpu, ChevronDown } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NETWORKS } from "../utils/networks";
import styles from "../styles/Header.module.css";

export default function Header() {
  const { wallet, lockWallet, currentNetwork, switchNetwork } = useWallet();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLock = () => {
    lockWallet();
    router.push("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoGroup}>
          <Cpu className={styles.logoIcon} size={24} color="#000000" />
          <span className={styles.logoText}>Aura</span>
        </Link>
        <nav className={styles.navGroup}>
          {wallet && currentNetwork && (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-surface-hover)", border: "1px solid var(--color-hairline)", padding: "0.4rem 0.8rem", borderRadius: "1rem", cursor: "pointer", fontFamily: "inherit" }}
              >
                {currentNetwork.iconUrl ? (
                  <img src={currentNetwork.iconUrl} alt={currentNetwork.name} style={{ width: "18px", height: "18px", borderRadius: "50%", filter: currentNetwork.isTestnet ? "grayscale(100%) opacity(0.7)" : "none" }} />
                ) : (
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: currentNetwork.color || "#4CAF50" }} />
                )}
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-ink)" }}>{currentNetwork.name}</span>
                <ChevronDown size={14} color="var(--color-mute)" />
              </button>

              {isDropdownOpen && (
                <div style={{ position: "absolute", top: "110%", left: 0, background: "var(--color-surface)", border: "1px solid var(--color-hairline)", borderRadius: "0.8rem", padding: "0.5rem", minWidth: "180px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  {Object.values(NETWORKS).map((net) => (
                    <button
                      key={net.chainId}
                      onClick={() => {
                        switchNetwork(net.chainId);
                        setIsDropdownOpen(false);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", border: "none", background: currentNetwork.chainId === net.chainId ? "var(--color-surface-hover)" : "transparent", borderRadius: "0.5rem", cursor: "pointer", textAlign: "left", width: "100%" }}
                    >
                      {net.iconUrl ? (
                        <img src={net.iconUrl} alt={net.name} style={{ width: "18px", height: "18px", borderRadius: "50%", filter: net.isTestnet ? "grayscale(100%) opacity(0.7)" : "none" }} />
                      ) : (
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: net.color }} />
                      )}
                      <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-ink)" }}>{net.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
