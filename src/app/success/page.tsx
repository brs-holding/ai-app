// src/app/success/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";

export default function SuccessPage() {
  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto mt-24 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4"> Upgrade Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for upgrading your plan. Your credits and features should be active shortly.
        </p>
        <Link href="/">
          <Button className="px-6 py-2">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
