"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState("");
  const [address, setAddress] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // Helper to generate a new wallet
  const generateNewWallet = () => {
    try {
      const randomWallet = ethers.Wallet.createRandom();
      setWallet(randomWallet);
      setMnemonic(randomWallet.mnemonic.phrase);
      setAddress(randomWallet.address);
      setIsLocked(false);
      return {
        address: randomWallet.address,
        phrase: randomWallet.mnemonic.phrase,
      };
    } catch (error) {
      console.error("Error generating wallet:", error);
      throw error;
    }
  };

  // Helper to import wallet from mnemonic
  const importWalletFromMnemonic = (phrase) => {
    try {
      const trimmedPhrase = phrase.trim().toLowerCase();
      // Basic validation
      if (!ethers.Mnemonic.isValidMnemonic(trimmedPhrase)) {
        throw new Error("Invalid mnemonic phrase.");
      }
      const importedWallet = ethers.Wallet.fromPhrase(trimmedPhrase);
      setWallet(importedWallet);
      setMnemonic(trimmedPhrase);
      setAddress(importedWallet.address);
      setIsLocked(false);
      return importedWallet;
    } catch (error) {
      console.error("Error importing wallet:", error);
      throw error;
    }
  };

  // Lock / Unlock placeholders (used in Phase 3)
  const lockWallet = () => {
    setIsLocked(true);
    setWallet(null);
    setMnemonic("");
    setAddress("");
  };

  const unlockWallet = (password) => {
    // Password checking will be implemented in Phase 3
    setIsLocked(false);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        mnemonic,
        address,
        isLocked,
        generateNewWallet,
        importWalletFromMnemonic,
        lockWallet,
        unlockWallet,
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
