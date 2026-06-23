"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import {
  Copy,
  Check,
  Download,
  ArrowRight,
  AlertTriangle,
  PenLine,
  CloudOff,
  EyeOff,
} from "lucide-react";
import styles from "../styles/CreateWallet.module.css";

export default function CreateWallet({ onBack, onComplete }) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState("phrase"); // 'phrase' | 'password'
  const [tempWallet, setTempWallet] = useState(null);
  const [phrase, setPhrase] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);

  const { encryptAndSaveWallet } = useWallet();

  // Generate the wallet locally on mount
  useEffect(() => {
    try {
      const wallet = ethers.Wallet.createRandom();
      setTempWallet(wallet);
      setPhrase(wallet.mnemonic.phrase.split(" "));
    } catch (err) {
      console.error("Failed to generate random wallet:", err);
    }
  }, []);

  const handleCopy = () => {
    if (phrase.length > 0) {
      navigator.clipboard.writeText(phrase.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportTXT = () => {
    if (phrase.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([phrase.join(" ")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "aura-wallet-recovery-phrase.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        setError("Failed to secure and encrypt wallet. Please try again.");
        setIsEncrypting(false);
      }
    }, 100);
  };

  if (isEncrypting) {
    return (
      <div className={styles.wrapper}>
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
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-ink)", margin: 0 }}>Securing Your Wallet</h2>
            <p style={{ color: "var(--color-body-text)", maxWidth: "300px", margin: 0, fontSize: "0.9rem", lineHeight: "1.5" }}>
              Encrypting your private keys using PBKDF2/scrypt key derivation. This will take a few seconds...
            </p>
          </div>
        </main>
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
      <div className={styles.wrapper}>
        <main className={styles.main}>
          <section className={styles.secretPanel}>
            <div className={styles.headerGroup}>
              <h1 className={styles.title}>Create Password</h1>
              <p className={styles.description}>
                This password will encrypt your recovery phrase on this device. Aura cannot recover this password if you lose it.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "420px", marginTop: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-ink)" }} htmlFor="new-password">
                  New Password (min. 8 characters)
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--color-canvas)",
                    color: "var(--color-ink)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-ink)" }} htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    border: "1px solid var(--color-hairline)",
                    borderRadius: "0.5rem",
                    backgroundColor: "var(--color-canvas)",
                    color: "var(--color-ink)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>

              {error && (
                <p style={{ color: "red", fontSize: "0.825rem", margin: 0 }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => { setStep("phrase"); setError(""); }}
                  className={styles.secondaryActionBtn}
                  style={{ width: "100px", justifyContent: "center" }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  style={{ flexGrow: 1 }}
                  disabled={!password || !confirmPassword}
                >
                  Create Wallet
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </section>

          <aside className={styles.sidePanel}>
            <div className={styles.warningCard}>
              <div className={styles.warningCardHeader}>
                <AlertTriangle size={18} strokeWidth={2} />
                <h3 className={styles.warningCardTitle}>
                  Protect Your Password
                </h3>
              </div>
              <p className={styles.warningCardText}>
                If you forget this password, you must use your 12-word seed phrase to restore your wallet. Store both in a secure place.
              </p>
            </div>
          </aside>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Main Content Canvas */}
      <main className={styles.main}>
        {/* 2/3 Main Panel: Secret Phrase Grid */}
        <section className={styles.secretPanel}>
          <div className={styles.headerGroup}>
            <h1 className={styles.title}>Secret Recovery Phrase</h1>
            <p className={styles.description}>
              Write down these 12 words in exact order. This is the only way to
              recover your account if you lose access to this device.
            </p>
          </div>
          {/* The Grid */}
          <div className={styles.gridContainer}>
            {/* Atmospheric Mesh behind grid */}
            <div className={styles.meshBackground} />

            {phrase.map((word, index) => (
              <div key={index} className={styles.wordBox}>
                <span className={styles.wordIndex}>
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className={styles.wordValue}>{word}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.actionsRow}>
            <div className={styles.secondaryActions}>
              <button
                onClick={handleCopy}
                className={styles.secondaryActionBtn}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
              <button
                onClick={handleExportTXT}
                className={styles.secondaryActionBtn}
              >
                <Download size={15} />
                Export TXT
              </button>
            </div>
            <button onClick={() => setStep("password")} className={styles.primaryActionBtn}>
              I saved my phrase
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* 1/3 Side Panel: Security Guidance */}
        <aside className={styles.sidePanel}>
          {/* Warning Card */}
          <div className={styles.warningCard}>
            <div className={styles.warningCardHeader}>
              <AlertTriangle size={18} strokeWidth={2} />
              <h3 className={styles.warningCardTitle}>
                Critical Security Guidance
              </h3>
            </div>
            <p className={styles.warningCardText}>
              Never share this phrase with anyone. Anyone with these 12 words
              can access your funds.
            </p>
          </div>

          {/* Guidance List */}
          <div className={styles.guidanceCard}>
            <h4 className={styles.guidanceTitle}>Best Practices</h4>
            <ul className={styles.guidanceList}>
              <li className={styles.guidanceItem}>
                <PenLine size={16} className={styles.guidanceIcon} />
                <div className={styles.guidanceItemContent}>
                  <span className={styles.guidanceItemTitle}>
                    Write it down offline
                  </span>
                  <span className={styles.guidanceItemText}>
                    Store it on paper or metal in a secure, physical location
                    like a safe.
                  </span>
                </div>
              </li>
              <li className={styles.guidanceItem}>
                <CloudOff size={16} className={styles.guidanceIcon} />
                <div className={styles.guidanceItemContent}>
                  <span className={styles.guidanceItemTitle}>
                    Avoid digital storage
                  </span>
                  <span className={styles.guidanceItemText}>
                    Do not take screenshots, email it, or save it to cloud
                    drives.
                  </span>
                </div>
              </li>
              <li className={styles.guidanceItem}>
                <EyeOff size={16} className={styles.guidanceIcon} />
                <div className={styles.guidanceItemContent}>
                  <span className={styles.guidanceItemTitle}>
                    Beware of phishing
                  </span>
                  <span className={styles.guidanceItemText}>
                    Aura support will never ask for your recovery phrase.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
