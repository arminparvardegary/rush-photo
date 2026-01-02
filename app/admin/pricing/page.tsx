import { getPricing } from "@/lib/server/pricing";
import PricingEditor from "@/components/admin/PricingEditor";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
    const pricing = await getPricing();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Pricing Settings</h1>
                <p className="text-gray-500 font-medium">Configure service rates and packages.</p>
            </div>

            <PricingEditor initialPricing={pricing} />
        </div>
    );
}
