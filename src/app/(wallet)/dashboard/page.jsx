"use client";

import { useEffect } from "react";
import { useWallet } from "../../../context/WalletContext";
import Dashboard from "../../../components/Dashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { hasWallet, isLocked } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home/unlock if wallet is missing or locked
    if (!hasWallet || isLocked) {
      router.push("/");
    }
  }, [hasWallet, isLocked, router]);

  if (!hasWallet || isLocked) {
    return null;
  }

  return (
    <Dashboard 
      onLogout={() => router.push("/")} 
    />
  );
}
