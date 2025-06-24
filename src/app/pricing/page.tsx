// app/pricing/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<null | string>(null);

  const handleUpgrade = async (plan: "free" | "pro" | "team") => {
    try {
      setLoadingPlan(plan);
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Check console.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0 / month",
      planId: "free",
      features: [
        " 5 AI credits per day",
        " Access to public projects",
        " Community support",
        " No private projects",
        " No custom domains",
        " Limited customization",
      ],
    },
    {
      name: "Pro",
      price: "$29 / month",
      planId: "pro",
      features: [
        " 100 AI credits / month",
        " Everything in Free",
        " Private projects",
        " Remove watermark",
        " Custom domain support",
        " 3 collaborators",
      ],
    },
    {
      name: "Team",
      price: "$49 / month",
      planId: "team",
      features: [
        " Everything in Pro",
        " 100 AI credits/month per seat",
        " 20 included seats",
        " Role-based access",
        " Priority support",
      ],
    },
  ];

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Pricing Plans</h1>
        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border rounded p-4 shadow hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="text-lg mb-3">{plan.price}</p>
              <ul className="text-sm space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.planId as "free" | "pro" | "team")}
                className="block w-full text-center bg-black text-white rounded py-2 mt-4 text-sm"
                disabled={loadingPlan === plan.planId}
              >
                {loadingPlan === plan.planId ? "Redirecting..." : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
