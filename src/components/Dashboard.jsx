"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
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
  Check,
  X,
} from "lucide-react";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard({ onLogout }) {
  const [copied, setCopied] = useState(false);
  const { address, balance, wallet, provider } = useWallet();

  // Send transaction modal states
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [txStatus, setTxStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [txHash, setTxHash] = useState("");
  const [txError, setTxError] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [btcBalance, setBtcBalance] = useState("0.0000");

  // Fetch ERC-20 token balances
  useEffect(() => {
    if (!address || !provider) return;

    const fetchTokens = async () => {
      const ERC20_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];

      try {
        const usdcContract = new ethers.Contract("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", ERC20_ABI, provider);
        const usdcBal = await usdcContract.balanceOf(address);
        const usdcDecimals = await usdcContract.decimals();
        setUsdcBalance(ethers.formatUnits(usdcBal, usdcDecimals));
      } catch (err) {
        console.log("Could not fetch USDC balance");
      }

      try {
        const wbtcContract = new ethers.Contract("0x8a556858e805540aC668A6b6de162A4BB9a85Fbb", ERC20_ABI, provider);
        const wbtcBal = await wbtcContract.balanceOf(address);
        const wbtcDecimals = await wbtcContract.decimals();
        setBtcBalance(ethers.formatUnits(wbtcBal, wbtcDecimals));
      } catch (err) {
        console.log("Could not fetch WBTC balance");
      }
    };

    fetchTokens();
  }, [address, provider]);

  // Fetch transaction history
  useEffect(() => {
    if (!address) return;

    let isMounted = true;
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc`);
        const data = await res.json();
        
        if (data.status === "1" && isMounted) {
          setTransactions(data.result);
        } else if (isMounted) {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    };

    fetchHistory();
    
    return () => {
      isMounted = false;
    };
  }, [address]);

  const isMockWallet = !wallet;

  const displayAddress = address || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const ethPriceUSD = 3200; // Mock ETH price for premium visual design
  const btcPriceUSD = 65000;
  const usdcPriceUSD = 1;

  const ethValue = parseFloat(balance || "0") * ethPriceUSD;
  const btcValue = parseFloat(btcBalance || "0") * btcPriceUSD;
  const usdcValue = parseFloat(usdcBalance || "0") * usdcPriceUSD;
  
  const totalValueUSD = ethValue + btcValue + usdcValue;
  
  const balanceUSD = totalValueUSD.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const ethPercent = totalValueUSD > 0 ? ((ethValue / totalValueUSD) * 100).toFixed(1) : "0.0";
  const btcPercent = totalValueUSD > 0 ? ((btcValue / totalValueUSD) * 100).toFixed(1) : "0.0";
  const usdcPercent = totalValueUSD > 0 ? ((usdcValue / totalValueUSD) * 100).toFixed(1) : "0.0";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    if (!wallet) {
      setTxError("Wallet is not initialized.");
      setTxStatus("error");
      return;
    }

    // Validate address format
    if (!ethers.isAddress(recipientAddress)) {
      setTxError("Invalid Ethereum address format.");
      return;
    }

    // Validate amount
    const parsedAmount = parseFloat(sendAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setTxError("Amount must be a positive number.");
      return;
    }

    if (parsedAmount > parseFloat(balance)) {
      setTxError("Insufficient funds for transaction.");
      return;
    }

    setTxStatus("loading");
    setTxError("");

    try {
      // Send transaction
      const txResponse = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(sendAmount),
      });

      setTxHash(txResponse.hash);
      
      // Wait for 1 confirmation (mining)
      await txResponse.wait(1);
      setTxStatus("success");
    } catch (err) {
      console.error("Transaction failed:", err);
      setTxError(err.reason || err.message || "Transaction failed.");
      setTxStatus("error");
    }
  };

  return (
    <div>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>Total Balance</span>
            <h1 className={styles.heroBalance}>${balanceUSD}</h1>
            <div className={styles.heroChange}>
              <TrendingUp size={16} />
              <span>{balance || "0.0000"} ETH (Sepolia Testnet)</span>
            </div>
          </div>
          {/* Decorative atmospheric elements */}
          <div className={styles.heroOverlay} />
        </section>

        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Left Column: Actions */}
          <div className={styles.actionsColumn}>
            <button onClick={() => setIsSendModalOpen(true)} className={styles.actionBtn}>
              <div className={styles.actionBtnLeft}>
                <div className={styles.actionBtnIcon}>
                  <ArrowUp size={20} />
                </div>
                <span className={styles.actionBtnText}>Send</span>
              </div>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionBtnLeft}>
                <div className={styles.actionBtnIcon}>
                  <ArrowDown size={20} />
                </div>
                <span className={styles.actionBtnText}>Receive</span>
              </div>
            </button>
            <button className={styles.actionBtn}>
              <div className={styles.actionBtnLeft}>
                <div className={styles.actionBtnIcon}>
                  <ArrowRightLeft size={20} />
                </div>
                <span className={styles.actionBtnText}>Swap</span>
              </div>
            </button>
          </div>

          {/* Middle Column: Timeline */}
          <div className={styles.activityColumn}>
            <div className={styles.activityHeader}>
              <h2 className={styles.activityTitle}>Recent Activity</h2>
              <button className={styles.activityViewAll}>View All</button>
            </div>
            <div className={styles.activityList}>
              {isLoadingHistory ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--color-mute)", fontSize: "0.9rem" }}>
                  Loading history...
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((tx, index) => {
                  const isReceive = tx.to.toLowerCase() === address?.toLowerCase();
                  const valueEth = parseFloat(ethers.formatEther(tx.value)).toFixed(4);
                  
                  const date = new Date(tx.timeStamp * 1000);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  
                  return (
                    <div key={tx.hash}>
                      <div className={styles.activityItem}>
                        <div className={styles.activityItemLeft}>
                          <div className={styles.activityIconBox}>
                            {isReceive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <div className={styles.activityMainText}>
                              {isReceive ? "Received ETH" : "Sent ETH"}
                            </div>
                            <div className={styles.activitySubText}>
                              {isReceive ? `From ${tx.from.substring(0, 6)}...${tx.from.substring(tx.from.length - 4)}` 
                                         : `To ${tx.to.substring(0, 6)}...${tx.to.substring(tx.to.length - 4)}`}
                            </div>
                          </div>
                        </div>
                        <div className={styles.activityItemRight}>
                          <div className={styles.activityAmount} style={{ color: isReceive ? 'var(--color-ink)' : 'inherit' }}>
                            {isReceive ? '+' : '-'}{valueEth} ETH
                          </div>
                          <div className={styles.activitySubText}>
                            {isToday ? `Today, ${timeString}` : `${dateString}, ${timeString}`}
                          </div>
                        </div>
                      </div>
                      {index < transactions.length - 1 && <div className={styles.activityDivider} />}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--color-mute)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <History size={24} style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: "0.9rem" }}>No recent activity</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Assets & Address */}
          <div className={styles.assetsColumn}>
            {/* Address Card */}
            <div className={styles.walletCard}>
              <div className={styles.walletCardGlow} />
              <div className={styles.walletCardHeader}>
                <h3 className={styles.walletCardTitle}>Main Wallet</h3>
                <div onClick={handleCopy} className={styles.walletCardCopy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </div>
              </div>
              <div className={styles.walletCardAddress}>{displayAddress}</div>
              <div className={styles.qrContainer}>
                <div
                  className={styles.qrBox}
                  style={{
                    backgroundImage:
                      `url("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${displayAddress}")`,
                  }}
                ></div>
              </div>
            </div>

            {/* Asset Overview */}
            <div className={styles.assetOverview}>
              <h3 className={styles.assetOverviewTitle}>Asset Overview</h3>
              <div className={styles.assetList}>
                <div className={styles.assetRow}>
                  <span className={styles.assetName}>Ethereum (ETH)</span>
                  <span className={styles.assetPercent}>{ethPercent}%</span>
                </div>
                <div className={styles.assetBarTrack}>
                  <div
                    className={`${styles.assetBarFill} ${styles.assetEth}`}
                    style={{ width: `${ethPercent}%` }}
                  />
                </div>

                <div
                  className={styles.assetRow}
                  style={{ marginTop: "0.5rem" }}
                >
                  <span className={styles.assetName}>Bitcoin (BTC)</span>
                  <span className={styles.assetPercent}>{btcPercent}%</span>
                </div>
                <div className={styles.assetBarTrack}>
                  <div
                    className={`${styles.assetBarFill} ${styles.assetBtc}`}
                    style={{ width: `${btcPercent}%` }}
                  />
                </div>

                <div
                  className={styles.assetRow}
                  style={{ marginTop: "0.5rem" }}
                >
                  <span className={styles.assetName}>USD Coin (USDC)</span>
                  <span className={styles.assetPercent}>{usdcPercent}%</span>
                </div>
                <div className={styles.assetBarTrack}>
                  <div
                    className={`${styles.assetBarFill} ${styles.assetUsdc}`}
                    style={{ width: `${usdcPercent}%` }}
                  />
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

      {isSendModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Send ETH</h2>
              <button 
                onClick={() => {
                  setIsSendModalOpen(false);
                  setTxStatus("idle");
                  setRecipientAddress("");
                  setSendAmount("");
                  setTxError("");
                  setTxHash("");
                }} 
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            {txStatus === "idle" && (
              <form onSubmit={handleSendTransaction} className={styles.modalForm}>
                {isMockWallet && (
                  <div style={{
                    padding: "0.75rem",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: "0.5rem",
                    color: "#d97706",
                    fontSize: "0.8rem",
                    lineHeight: "1.4"
                  }}>
                    ⚠️ You are using a read-only mock wallet. Lock your session and create or import a real wallet to send transactions.
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="recipient">Recipient Address</label>
                  <input
                    className={`${styles.modalInput} ${txError && !recipientAddress ? styles.modalInputError : ""}`}
                    id="recipient"
                    type="text"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => {
                      setRecipientAddress(e.target.value);
                      setTxError("");
                    }}
                    disabled={isMockWallet}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.modalLabel} htmlFor="amount">Amount (ETH)</label>
                  <input
                    className={`${styles.modalInput} ${txError && parseFloat(sendAmount) > parseFloat(balance) ? styles.modalInputError : ""}`}
                    id="amount"
                    type="number"
                    step="any"
                    placeholder="0.0"
                    value={sendAmount}
                    onChange={(e) => {
                      setSendAmount(e.target.value);
                      setTxError("");
                    }}
                    disabled={isMockWallet}
                    required
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-mute)", textAlign: "right" }}>
                    Available: {balance} ETH
                  </span>
                </div>

                {txError && <p className={styles.errorText}>{txError}</p>}

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isMockWallet || !recipientAddress || !sendAmount}
                >
                  <Send size={16} />
                  Send Transaction
                </button>
              </form>
            )}

            {txStatus === "loading" && (
              <div className={styles.statusContainer}>
                <div className={styles.statusSpinner} />
                <h3 className={styles.statusText}>Sending Transaction...</h3>
                <p className={styles.statusSubText}>Broadcasting to Sepolia network and waiting for 1 block confirmation.</p>
                {txHash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.txLink}
                  >
                    View Tx: {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                  </a>
                )}
              </div>
            )}

            {txStatus === "success" && (
              <div className={styles.statusContainer}>
                <div className={styles.statusIconSuccess}>
                  <CheckCircle2 size={48} />
                </div>
                <h3 className={styles.statusText}>Transaction Confirmed!</h3>
                <p className={styles.statusSubText}>Your transaction has been successfully mined on Sepolia.</p>
                {txHash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.txLink}
                  >
                    View on Etherscan
                  </a>
                )}
                <button 
                  onClick={() => {
                    setIsSendModalOpen(false);
                    setTxStatus("idle");
                    setRecipientAddress("");
                    setSendAmount("");
                    setTxHash("");
                  }} 
                  className={styles.doneBtn}
                >
                  Close
                </button>
              </div>
            )}

            {txStatus === "error" && (
              <div className={styles.statusContainer}>
                <div className={styles.statusIconError}>
                  <CheckCircle2 size={48} style={{ transform: "rotate(45deg)", color: "#ef4444" }} />
                </div>
                <h3 className={styles.statusText}>Transaction Failed</h3>
                <p className={styles.statusSubText}>{txError || "An unexpected error occurred during execution."}</p>
                <button 
                  onClick={() => setTxStatus("idle")} 
                  className={styles.doneBtn}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
