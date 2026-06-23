"use client";

import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldAlert } from "lucide-react";
import styles from "../styles/ImportWallet.module.css"; // Reuse card styles

export default function UnlockWallet() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const { unlockWallet, deleteWallet } = useWallet();
  const router = useRouter();

  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setIsDecrypting(true);
    setError("");

    // Timeout allows DOM state to render spinner before CPU-heavy scrypt runs
    setTimeout(async () => {
      try {
        await unlockWallet(password);
        router.push("/dashboard");
      } catch (err) {
        // Intentionally not logging 'err' to console to avoid Next.js dev overlay
        setError("Incorrect password. Please try again.");
        setIsDecrypting(false);
      }
    }, 100);
  };

  const handleResetWallet = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    deleteWallet();
    router.push("/");
  };

  if (isDecrypting) {
    return (
      <main className={styles.main} style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" }}>
          <div style={{
            width: "3.5rem",
            height: "3.5rem",
            border: "3px solid var(--color-hairline)",
            borderTopColor: "var(--color-ink)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-ink)", margin: 0 }}>Unlocking Wallet</h2>
          <p style={{ color: "var(--color-body-text)", maxWidth: "300px", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
            Decrypting your private keys securely. This will take a few seconds...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className={styles.main} style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "var(--color-canvas)", borderRadius: "1rem", padding: "2rem", maxWidth: "400px", width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid var(--color-hairline)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldAlert size={24} />
              </div>
            </div>
            <h2 style={{ textAlign: "center", margin: "0 0 1rem 0", fontSize: "1.25rem", color: "var(--color-primary)" }}>Reset Wallet</h2>
            <p style={{ textAlign: "center", margin: "0 0 1.5rem 0", color: "var(--color-body-text)", fontSize: "0.95rem", lineHeight: 1.5 }}>
              Are you sure you want to reset your wallet? This will <strong>permanently delete</strong> your keys from this device. You can only restore access using your 12-word recovery phrase.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={() => setIsResetModalOpen(false)}
                style={{ flex: 1, padding: "0.75rem", backgroundColor: "var(--color-surface-container)", color: "var(--color-ink)", border: "1px solid var(--color-hairline)", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                style={{ flex: 1, padding: "0.75rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.card} style={{ maxWidth: "480px", gridTemplateColumns: "1fr" }}>
        <div className={styles.formSection}>
          <div className={styles.header} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{
              width: "3rem",
              height: "3rem",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-ink)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <KeyRound size={24} />
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.description}>
              Enter your password to unlock and decrypt your Aura Wallet.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleUnlockSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={styles.textarea}
                style={{ height: "auto", padding: "0.875rem 1rem", fontSize: "0.95rem" }}
                type="password"
                placeholder="Enter wallet password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
              />
              {error && (
                <p style={{ color: "red", fontSize: "0.825rem", marginTop: "0.5rem", margin: 0 }}>
                  {error}
                </p>
              )}
            </div>

            <div className={styles.actions} style={{ flexDirection: "column", gap: "1rem" }}>
              <button
                className={styles.btnSubmit}
                type="submit"
                style={{ width: "100%", padding: "1rem" }}
                disabled={!password}
              >
                Unlock Wallet
              </button>

              <button
                type="button"
                onClick={handleResetWallet}
                className={styles.btnReset}
              >
                <ShieldAlert size={16} />
                Reset Wallet (Lose Current Keys)
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
