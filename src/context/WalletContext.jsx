"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.0000");
  const [isLocked, setIsLocked] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [provider, setProvider] = useState(null);

  // Initialize provider and check for existing keystore
  useEffect(() => {
    try {
      const rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";
      const prov = new ethers.JsonRpcProvider(rpcUrl);
      setProvider(prov);

      if (typeof window !== "undefined") {
        const keystore = localStorage.getItem("aura_wallet_keystore");
        const savedAddress = localStorage.getItem("aura_wallet_address");
        if (keystore && savedAddress) {
          setHasWallet(true);
          setIsLocked(true);
          setAddress(savedAddress);
        }
      }
    } catch (error) {
      console.error("Failed to initialize wallet provider/storage:", error);
    }
  }, []);

  // Fetch balance periodically if we have an address
  useEffect(() => {
    if (!provider || !address) {
      setBalance("0.0000");
      return;
    }

    let isMounted = true;

    const fetchBalance = async () => {
      try {
        const rawBalance = await provider.getBalance(address);
        const formatted = ethers.formatEther(rawBalance);
        if (isMounted) {
          setBalance(parseFloat(formatted).toFixed(4));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [provider, address]);

  // Auto-locking mechanism (5 minutes of inactivity)
  useEffect(() => {
    if (!wallet || isLocked) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Auto-lock after 5 minutes of no activity
      timeoutId = setTimeout(() => {
        console.log("Auto-locking wallet due to inactivity.");
        lockWallet();
      }, 5 * 60 * 1000);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [wallet, isLocked]);

  // Helper to encrypt and save a wallet to localStorage
  const encryptAndSaveWallet = async (walletInstance, password) => {
    try {
      // Encrypt private key using user password (scrypt derivation)
      const keystoreJson = await walletInstance.encrypt(password);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("aura_wallet_keystore", keystoreJson);
        localStorage.setItem("aura_wallet_address", walletInstance.address);
      }

      const connectedWallet = provider ? walletInstance.connect(provider) : walletInstance;
      setWallet(connectedWallet);
      setAddress(walletInstance.address);
      setMnemonic(walletInstance.mnemonic ? walletInstance.mnemonic.phrase : "");
      setIsLocked(false);
      setHasWallet(true);
      return connectedWallet;
    } catch (error) {
      console.error("Error encrypting/saving wallet:", error);
      throw error;
    }
  };

  // Helper to unlock the wallet using password
  const unlockWallet = async (password) => {
    try {
      let keystoreJson = null;
      if (typeof window !== "undefined") {
        keystoreJson = localStorage.getItem("aura_wallet_keystore");
      }
      if (!keystoreJson) {
        throw new Error("No keystore found on this device.");
      }

      // Decrypt keystore
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(keystoreJson, password);
      const connectedWallet = provider ? decryptedWallet.connect(provider) : decryptedWallet;
      
      setWallet(connectedWallet);
      setAddress(connectedWallet.address);
      setMnemonic(connectedWallet.mnemonic ? connectedWallet.mnemonic.phrase : "");
      setIsLocked(false);
      return connectedWallet;
    } catch (error) {
      // Intentionally not logging this error to console to prevent 
      // Next.js dev overlay from catching expected user errors.
      throw new Error("Incorrect password. Verification failed.");
    }
  };

  // Lock the wallet session
  const lockWallet = () => {
    setWallet(null);
    setMnemonic("");
    setBalance("0.0000");
    setIsLocked(true);
  };

  // Delete the wallet completely (Reset)
  const deleteWallet = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("aura_wallet_keystore");
      localStorage.removeItem("aura_wallet_address");
    }
    setWallet(null);
    setMnemonic("");
    setAddress("");
    setBalance("0.0000");
    setIsLocked(false);
    setHasWallet(false);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        mnemonic,
        address,
        balance,
        isLocked,
        hasWallet,
        provider,
        encryptAndSaveWallet,
        unlockWallet,
        lockWallet,
        deleteWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
