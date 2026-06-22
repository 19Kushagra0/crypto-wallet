"use client";

import { useState } from "react";
import { Copy, Check, Download, ArrowRight, AlertTriangle, PenLine, CloudOff, EyeOff } from "lucide-react";
import styles from "../styles/CreateWallet.module.css";

export default function CreateWallet({ onBack, onComplete }) {
  const [copied, setCopied] = useState(false);

  // Mock generated phrase for UI phase
  const mockPhrase =
    "abandon ability able about above absent absorb abstract absurd abuse access accident".split(
      " ",
    );

  const handleCopy = () => {
    navigator.clipboard.writeText(mockPhrase.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      {/* Main Content Canvas */}
      <main className={styles.main}>
        {/* 2/3 Main Panel: Secret Phrase Grid */}
        <section className={styles.secretPanel}>
          <div className={styles.headerGroup}>
            <h1 className={styles.title}>
              Secret Recovery Phrase
            </h1>
            <p className={styles.description}>
              Write down these 12 words in exact order. This is the only way to
              recover your account if you lose access to this device.
            </p>
          </div>
          {/* The Grid */}
          <div className={styles.gridContainer}>
            {/* Atmospheric Mesh behind grid */}
            <div className={styles.meshBackground} />
            
            {mockPhrase.map((word, index) => (
              <div key={index} className={styles.wordBox}>
                <span className={styles.wordIndex}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <span className={styles.wordValue}>
                  {word}
                </span>
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
              <button className={styles.secondaryActionBtn}>
                <Download size={15} />
                Export TXT
              </button>
            </div>
            <button 
              onClick={onComplete}
              className={styles.primaryActionBtn}
            >
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
            <h4 className={styles.guidanceTitle}>
              Best Practices
            </h4>
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
