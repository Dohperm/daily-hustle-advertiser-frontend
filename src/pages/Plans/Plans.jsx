import React from "react";

const PLANS = [
  {
    name: "Basic",
    price: 0,
    features: [
      "Post up to 2 campaigns/month",
      "Standard campaign support",
      "Basic analytics",
    ],
    badge: "Free",
  },
  {
    name: "Pro",
    price: 5000,
    features: [
      "Unlimited campaigns",
      "Priority campaign approval",
      "Access premium analytics",
      "5% ad credit bonus",
    ],
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: 20000,
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
    badge: "Business",
  },
];

export default function Plans() {
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-gem text-pink me-2" />
        Pricing & Plans
      </h2>
      <div className="row g-4">
        {PLANS.map((plan) => (
          <div key={plan.name} className="col-md-4">
            <div className="card h-100 text-center shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="mb-2">
                  <span className="badge bg-primary">{plan.badge}</span>
                </div>
                <h5 className="card-title fw-bold">{plan.name}</h5>
                <h4 className="fw-bold text-primary mb-3">
                  {plan.price === 0
                    ? "Free"
                    : `₦${plan.price.toLocaleString()}/mo`}
                </h4>
                <ul className="list-unstyled text-start mb-4 flex-grow-1">
                  {plan.features.map((f) => (
                    <li key={f} className="mb-2">
                      <i className="bi bi-check-circle text-success me-1" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-custom fw-bold w-100"
                  disabled={plan.price === 0}
                >
                  {plan.price === 0 ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="alert alert-info mt-4">
        Unlock more scale, analytics, and account benefits when you upgrade.
      </div>
    </div>
  );
}
