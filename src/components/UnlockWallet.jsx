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
                onClick={() => setIsResetModalOpen(false)}
                className={styles.btnCancelModal}
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                className={styles.btnConfirmModal}
              >
                Permanently Reset
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
