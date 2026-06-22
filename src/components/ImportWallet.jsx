"use client";

import { useState } from "react";
import { Key, Shield } from "lucide-react";
import styles from "../styles/ImportWallet.module.css";

export default function ImportWallet({ onBack, onComplete }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    
    const words = trimmed.split(/\s+/);
    if (![12, 18, 24].includes(words.length)) {
      setError("Recovery phrase must be exactly 12, 18, or 24 words.");
      return;
    }
    
    setError("");
    onComplete();
  };

  return (
    <div>
      {/* TopAppBar Semantic Shell: Linear/Transactional Intent -> Suppressed */}
      <main className={styles.main}>
        <div className={styles.card}>
          {/* Main Form Area */}
          <div className={styles.formSection}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                Import Wallet
              </h1>
              <p className={styles.description}>
                Paste your 12, 18, or 24-word recovery phrase to restore access
                to your account.
              </p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label
                  className={styles.label}
                  htmlFor="recovery-phrase"
                >
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
                {error && <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.5rem" }}>{error}</p>}
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
                  Import Wallet
                </button>
              </div>
            </form>
          </div>
          {/* Contextual Side Information */}
          <div className={styles.infoSection}>
            <div className={styles.infoBlock}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconBox}>
                  <Key size={20} />
                </div>
              </div>
              <h3 className={styles.infoTitle}>
                Your Keys, Your Crypto
              </h3>
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
              <h3 className={styles.infoTitle}>
                Keep It Safe
              </h3>
              <p className={styles.infoText}>
                Anyone with your recovery phrase can access your funds. Never
                share it with anyone, including Aura support.
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Footer Semantic Shell: Linear/Transactional Intent -> Rendered for legal links but simplified */}
    </div>
  );
}
