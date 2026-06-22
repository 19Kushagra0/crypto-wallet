"use client";

import { useState } from "react";
import {
  LogOut,
  Copy,
  CheckCircle2,
  Send,
  QrCode,
  History,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Compass,
  Settings,
  Check
} from "lucide-react";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard({ onLogout }) {
  const [copied, setCopied] = useState(false);

  // Mock Data
  const mockAddress = "0x71C...976F";
  const fullMockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const mockBalance = "1.2450";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMockAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>
              Total Balance
            </span>
            <h1 className={styles.heroBalance}>
              $124,592.00
            </h1>
            <div className={styles.heroChange}>
              <TrendingUp size={16} />
              <span>+2.4% past 24h</span>
            </div>
          </div>
          {/* Decorative atmospheric elements */}
          <div className={styles.heroOverlay} />
        </section>
        
        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Left Column: Actions */}
          <div className={styles.actionsColumn}>
            <button className={styles.actionBtn}>
              <div className={styles.actionBtnLeft}>
                <div className={styles.actionBtnIcon}>
                  <ArrowUp size={20} />
                </div>
                <span className={styles.actionBtnText}>
                  Send
                </span>
              </div>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionBtnLeft}>
                <div className={styles.actionBtnIcon}>
                  <ArrowDown size={20} />
                </div>
                <span className={styles.actionBtnText}>
                  Receive
                </span>
              </div>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionBtnLeft}>
                <div className={styles.actionBtnIcon}>
                  <ArrowRightLeft size={20} />
                </div>
                <span className={styles.actionBtnText}>
                  Swap
                </span>
              </div>
            </button>
          </div>
          
          {/* Middle Column: Timeline */}
          <div className={styles.activityColumn}>
            <div className={styles.activityHeader}>
              <h2 className={styles.activityTitle}>
                Recent Activity
              </h2>
              <button className={styles.activityViewAll}>
                View All
              </button>
            </div>
            <div className={styles.activityList}>
              {/* Activity Item 1 */}
              <div className={styles.activityItem}>
                <div className={styles.activityItemLeft}>
                  <div className={styles.activityIconBox}>
                    <ArrowDownLeft size={16} />
                  </div>
                  <div>
                    <div className={styles.activityMainText}>
                      Received ETH
                    </div>
                    <div className={styles.activitySubText}>
                      From 0x4F...a9B2
                    </div>
                  </div>
                </div>
                <div className={styles.activityItemRight}>
                  <div className={styles.activityAmount}>
                    +1.42 ETH
                  </div>
                  <div className={styles.activitySubText}>
                    Today, 14:23
                  </div>
                </div>
              </div>
              <div className={styles.activityDivider} />
              
              {/* Activity Item 2 */}
              <div className={styles.activityItem}>
                <div className={styles.activityItemLeft}>
                  <div className={styles.activityIconBox}>
                    <ArrowUpRight size={16} />
                  </div>
                  <div>
                    <div className={styles.activityMainText}>
                      Sent USDC
                    </div>
                    <div className={styles.activitySubText}>
                      To 0x8A...3cD1
                    </div>
                  </div>
                </div>
                <div className={styles.activityItemRight}>
                  <div className={styles.activityAmount}>
                    -500.00 USDC
                  </div>
                  <div className={styles.activitySubText}>
                    Yesterday, 09:12
                  </div>
                </div>
              </div>
              <div className={styles.activityDivider} />
              
              {/* Activity Item 3 */}
              <div className={styles.activityItem}>
                <div className={styles.activityItemLeft}>
                  <div className={styles.activityIconBox}>
                    <ArrowRightLeft size={16} />
                  </div>
                  <div>
                    <div className={styles.activityMainText}>
                      Swapped BTC to ETH
                    </div>
                    <div className={styles.activitySubText}>
                      Via Uniswap
                    </div>
                  </div>
                </div>
                <div className={styles.activityItemRight}>
                  <div className={styles.activityAmount}>
                    0.5 BTC
                  </div>
                  <div className={styles.activitySubText}>
                    Oct 24, 11:45
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Assets & Address */}
          <div className={styles.assetsColumn}>
            {/* Address Card */}
            <div className={styles.walletCard}>
              <div className={styles.walletCardGlow} />
              <div className={styles.walletCardHeader}>
                <h3 className={styles.walletCardTitle}>
                  Main Wallet
                </h3>
                <div onClick={handleCopy} className={styles.walletCardCopy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
              <div className={styles.walletCardAddress}>
                {fullMockAddress}
              </div>
              <div className={styles.qrContainer}>
                <div
                  className={styles.qrBox}
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUU8GBC3N1fM61X4triWfsvbz-BOho5ObuZsi0J-3cM9DtLxEvQye9Y5qR2I66E6Ank4s6c-T6oGYmxUFRgV52fc7G5UcoMNQXOWD1bsvmLQd3o467mMPFAm0aau74f6tPf_pak-_cPjRSEt3-GlYcAKTy4g_CnjSXtqcDuABiphVq7qh5BOzK6iSIchbdtc5C9Rd2ABtFW50tu4u9D8anHHYDODU-7vJ9X3Q1n2_1aMefuLmMZ9TuE3aW6zxt2ShC-O50zmw1lpw")',
                  }}
                ></div>
              </div>
            </div>
            
            {/* Asset Overview */}
            <div className={styles.assetOverview}>
              <h3 className={styles.assetOverviewTitle}>
                Asset Overview
              </h3>
              <div className={styles.assetList}>
                <div className={styles.assetRow}>
                  <span className={styles.assetName}>
                    Ethereum (ETH)
                  </span>
                  <span className={styles.assetPercent}>45.2%</span>
                </div>
                <div className={styles.assetBarTrack}>
                  <div className={`${styles.assetBarFill} ${styles.assetEth}`} style={{ width: "45.2%" }} />
                </div>
                
                <div className={styles.assetRow} style={{ marginTop: "0.5rem" }}>
                  <span className={styles.assetName}>
                    Bitcoin (BTC)
                  </span>
                  <span className={styles.assetPercent}>30.8%</span>
                </div>
                <div className={styles.assetBarTrack}>
                  <div className={`${styles.assetBarFill} ${styles.assetBtc}`} style={{ width: "30.8%" }} />
                </div>
                
                <div className={styles.assetRow} style={{ marginTop: "0.5rem" }}>
                  <span className={styles.assetName}>
                    USD Coin (USDC)
                  </span>
                  <span className={styles.assetPercent}>24.0%</span>
                </div>
                <div className={styles.assetBarTrack}>
                  <div className={`${styles.assetBarFill} ${styles.assetUsdc}`} style={{ width: "24.0%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* BottomNavBar (Mobile Only) */}
      <nav className={styles.bottomNav}>
        <div className={`${styles.navItem} ${styles.navItemActive}`}>
          <Wallet size={24} />
        </div>
        <div className={styles.navItem}>
          <ArrowRightLeft size={24} />
        </div>
        <div className={styles.navItem}>
          <Compass size={24} />
        </div>
        <div className={styles.navItem}>
          <Settings size={24} />
        </div>
      </nav>
    </div>
  );
}
