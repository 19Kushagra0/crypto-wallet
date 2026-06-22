"use client";

import CreateWallet from "../../../components/CreateWallet";
import { useRouter } from "next/navigation";

export default function CreateWalletPage() {
  const router = useRouter();

  return (
    <CreateWallet 
      onBack={() => router.push("/")} 
      onComplete={() => router.push("/dashboard")} 
    />
  );
}
