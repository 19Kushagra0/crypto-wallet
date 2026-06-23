"use client";

import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { Key, Shield, AlertTriangle, ArrowRight } from "lucide-react";
import styles from "../styles/ImportWallet.module.css";

export default function ImportWallet({ onBack, onComplete }) {
  const [step, setStep] = useState("import"); // 'import' | 'password'
  const [tempWallet, setTempWallet] = useState(null);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);

  const { encryptAndSaveWallet } = useWallet();

  const handleMnemonicSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    const words = trimmed.split(/\s+/);
    if (![12, 18, 24].includes(words.length)) {
      setError("Recovery phrase must be exactly 12, 18, or 24 words.");
      return;
    }

    try {
      if (!ethers.Mnemonic.isValidMnemonic(trimmed)) {
        throw new Error("Invalid mnemonic recovery phrase checksum.");
      }
      const wallet = ethers.Wallet.fromPhrase(trimmed);
      setTempWallet(wallet);
      setError("");
      setStep("password");
    } catch (err) {
      setError(err.message || "Invalid mnemonic recovery phrase.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsEncrypting(true);
    setError("");

    // Timeout allows DOM state to update and render spinner before CPU-heavy scrypt runs
    setTimeout(async () => {
      try {
        await encryptAndSaveWallet(tempWallet, password);
        onComplete();
      } catch (err) {
        console.error(err);
        setError("Failed to encrypt and import wallet. Please try again.");
        setIsEncrypting(false);
      }
    }, 100);
  };

  if (isEncrypting) {
    return (
      <div className={styles.main} style={{ justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" }}>
          <div style={{
            width: "3.5rem",
            height: "3.5rem",
            border: "3px solid var(--color-hairline)",
            borderTopColor: "var(--color-ink)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-ink)", margin: 0 }}>Importing Your Wallet</h2>
          <p style={{ color: "var(--color-body-text)", maxWidth: "300px", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
            Encrypting and securing your private keys. This will take a few seconds...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (step === "password") {
    return (
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.formSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>Secure Your Wallet</h1>
              <p className={styles.description}>
                Create a password to encrypt this wallet on your device. Aura cannot recover this password for you.
              </p>
            </div>

            <form className={styles.form} onSubmit={handlePasswordSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="new-password">
                  Password (min. 8 characters)
                </label>
                <input
                  id="new-password"
                  className={styles.textarea}
                  style={{ height: "auto", padding: "0.875rem 1rem", fontSize: "0.95rem" }}
                  type="password"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  className={styles.textarea}
                  style={{ height: "auto", padding: "0.875rem 1rem", fontSize: "0.95rem" }}
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  required
                />
              </div>

              {error && (
                <p style={{ color: "red", fontSize: "0.825rem", margin: "0.5rem 0 0" }}>
                  {error}
                </p>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.btnCancel}
                  type="button"
                  onClick={() => { setStep("import"); setError(""); }}
                >
                  Back
                </button>
                <button
                  className={styles.btnSubmit}
                  type="submit"
                  disabled={!password || !confirmPassword}
                >
                  Import Wallet
                </button>
              </div>
            </form>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconBox}>
                  <AlertTriangle size={20} style={{ color: "#eab308" }} />
                </div>
              </div>
              <h3 className={styles.infoTitle}>Password Recovery</h3>
              <p className={styles.infoText}>
                If you forget this password, the only way to recover your wallet is using your 12-word seed phrase. Write it down!
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.formSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>Import Wallet</h1>
              <p className={styles.description}>
                Paste your 12, 18, or 24-word recovery phrase to restore access
                to your account.
              </p>
            </div>
            <form className={styles.form} onSubmit={handleMnemonicSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="recovery-phrase">
                  Recovery Phrase
                </label>
                <textarea
                  className={styles.textarea}
                  id="recovery-phrase"
                  placeholder="word1 word2 word3..."
                  rows={6}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError("");
                  }}
                />
                {error && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.btnCancel}
                  type="button"
                  onClick={onBack}
                >
                  Cancel
                </button>
                <button
                  className={styles.btnSubmit}
                  type="submit"
                  disabled={!input.trim()}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconBox}>
                  <Key size={20} />
                </div>
              </div>
              <h3 className={styles.infoTitle}>Your Keys, Your Crypto</h3>
              <p className={styles.infoText}>
                Aura is a non-custodial wallet. We never have access to your
                funds, private keys, or recovery phrase.
              </p>
            </div>
            <div className={styles.divider} />
            <div className={styles.infoBlock}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconBox}>
                  <Shield size={20} />
                </div>
              </div>
              <h3 className={styles.infoTitle}>Keep It Safe</h3>
              <p className={styles.infoText}>
                Anyone with your recovery phrase can access your funds. Never
                share it with anyone, including Aura support.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
