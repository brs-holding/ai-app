// app/pricing/page.tsx
import Header from "@/components/ui/Header";

export default function PricingPage() {
  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Pricing Plans</h1>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              name: "Free",
              price: "$0 / month",
              features: [
                "✅ 5 AI credits per day",
                "✅ Access to public projects",
                "✅ Community support",
                "🚫 No private projects",
                "🚫 No custom domains",
                "🚫 Limited customization",
              ],
            },
            {
              name: "Pro",
              price: "$29 / month",
              features: [
                "✅ 100 AI credits / month",
                "✅ Everything in Free",
                "✅ Private projects",
                "✅ Remove watermark",
                "✅ Custom domain support",
                "✅ 3 collaborators",
              ],
            },
            {
              name: "Team",
              price: "$49 / month",
              features: [
                "✅ Everything in Pro",
                "✅ 100 AI credits/month per seat",
                "✅ 20 included seats",
                "✅ Role-based access",
                "✅ Priority support",
              ],
            },
          ].map((plan) => (
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
              <a
                href="#"
                className="block text-center bg-black text-white rounded py-2 mt-4 text-sm"
              >
                Upgrade
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
