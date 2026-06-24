import Link from "next/link";
import { Cpu, ChevronDown, Lock, LogOut, Copy, Check, ShieldAlert } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NETWORKS } from "../utils/networks";
import styles from "../styles/Header.module.css";

export default function Header() {
  const { wallet, address, lockWallet, deleteWallet, currentNetwork, switchNetwork } = useWallet();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const handleLock = () => {
    lockWallet();
    setIsProfileOpen(false);
    router.push("/");
  };

  const handleReset = () => {
    deleteWallet();
    setIsResetOpen(false);
    router.push("/");
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getAvatarGradient = (addr) => {
    if (!addr) return "linear-gradient(135deg, #171717, #4d4d4d)";
    const c1 = addr.substring(2, 8);
    const c2 = addr.substring(addr.length - 6);
    return `linear-gradient(135deg, #${c1}, #${c2})`;
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
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
              <div className={styles.profileContainer} ref={profileDropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={styles.profileTrigger}
                >
                  <div 
                    className={styles.avatar} 
                    style={{ background: getAvatarGradient(address) }}
                  />
                  <span className={styles.addressText}>{truncateAddress(address)}</span>
                  <ChevronDown 
                    size={14} 
                    className={`${styles.chevronIcon} ${isProfileOpen ? styles.chevronIconOpen : ""}`} 
                  />
                </button>

                {isProfileOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownHeaderTitle}>Active Wallet</div>
                      <div className={styles.dropdownHeaderAddress}>{address}</div>
                    </div>
                    
                    <button onClick={handleCopy} className={styles.dropdownItem}>
                      {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                      <span>{copied ? "Copied!" : "Copy Address"}</span>
                    </button>

                    <button onClick={handleLock} className={styles.dropdownItem}>
                      <Lock size={16} />
                      <span>Lock Wallet</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsResetOpen(true);
                      }} 
                      className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    >
                      <LogOut size={16} />
                      <span>Reset Wallet (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {isResetOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalIconContainer}>
              <div className={styles.modalIconOuter}>
                <div className={styles.modalIconInner}>
                  <ShieldAlert size={24} />
                </div>
              </div>
            </div>
            <h2 className={styles.modalTitle}>Reset Aura Wallet</h2>
            <p className={styles.modalText}>
              Are you sure you want to reset? This action is irreversible and will remove all wallet data from this device.
            </p>
            <div className={styles.warningAlertBox}>
              <p className={styles.warningAlertText}>
                <strong>Warning:</strong> You can only restore access using your 12-word recovery phrase. If you don't have it saved, your funds will be <strong>lost forever</strong>.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setIsResetOpen(false)}
                className={styles.btnCancel}
              >
                Cancel
              </button>
              <button 
                onClick={handleReset}
                className={styles.btnConfirm}
              >
                Permanently Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

