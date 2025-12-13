import { DEFAULT_PRICING, type PricingSettings } from "@/lib/shared/pricing";
import { readDataFile, writeDataFile } from "@/lib/server/storage";

const PRICING_FILE = "pricing.json";

export async function getPricing(): Promise<PricingSettings> {
  return await readDataFile<PricingSettings>(PRICING_FILE, DEFAULT_PRICING);
}

export async function setPricing(nextPricing: PricingSettings): Promise<void> {
  await writeDataFile(PRICING_FILE, nextPricing);
}


