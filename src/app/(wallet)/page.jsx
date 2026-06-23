"use client";

import { useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { useRouter } from "next/navigation";
import Onboarding from "../../components/Onboarding";
import UnlockWallet from "../../components/UnlockWallet";

export default function OnboardingPage() {
  const { hasWallet, isLocked } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // If the wallet is loaded and unlocked, redirect straight to dashboard
    if (hasWallet && !isLocked) {
      router.push("/dashboard");
    }
  }, [hasWallet, isLocked, router]);

  if (hasWallet && isLocked) {
    return <UnlockWallet />;
  }

  return <Onboarding />;
}
