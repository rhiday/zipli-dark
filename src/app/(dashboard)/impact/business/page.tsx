import { CustomerInsights } from "../../dashboard/components/customer-insights"

export default function BusinessImpactPage() {
  return (
    <div className="px-6">
      <h1 className="text-2xl font-semibold">Business impact</h1>
      <div className="mt-6">
        <CustomerInsights />
      </div>
    </div>
  )
}


