import { DEFAULT_PRICING, type PricingSettings } from "@/lib/shared/pricing";
import { supabase } from "@/lib/supabase";

const PRICING_KEY = "rush_photo_pricing";

export async function getPricing(): Promise<PricingSettings> {
  const { data, error } = await supabase
    .from("pricing_config")
    .select("value")
    .eq("key", PRICING_KEY)
    .single();

  if (error || !data) {
    // Return default if not found (or maybe initialize it?)
    // If not found, best to initialize it lazily or just return default.
    return DEFAULT_PRICING;
  }

  return data.value as PricingSettings;
}

export async function setPricing(nextPricing: PricingSettings): Promise<void> {
  const { error } = await supabase
    .from("pricing_config")
    .upsert({ key: PRICING_KEY, value: nextPricing }, { onConflict: "key" });

  if (error) {
    throw new Error(`Failed to update pricing: ${error.message}`);
  }
}
