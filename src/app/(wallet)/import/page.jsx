"use client";

import ImportWallet from "../../../components/ImportWallet";
import { useRouter } from "next/navigation";

export default function ImportWalletPage() {
  const router = useRouter();

  return (
    <ImportWallet 
      onBack={() => router.push("/")} 
      onComplete={() => router.push("/dashboard")} 
    />
  );
}
