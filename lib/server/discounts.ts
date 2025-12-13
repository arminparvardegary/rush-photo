import type { DiscountCode } from "@/lib/shared/discounts";
import { DEFAULT_DISCOUNT_CODES } from "@/lib/shared/discounts";
import { readDataFile, writeDataFile } from "@/lib/server/storage";

const DISCOUNTS_FILE = "discounts.json";

interface DiscountsFileShape {
  codes: DiscountCode[];
}

const DEFAULT_DISCOUNTS_FILE: DiscountsFileShape = {
  codes: DEFAULT_DISCOUNT_CODES,
};

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  const file = await readDataFile<DiscountsFileShape>(DISCOUNTS_FILE, DEFAULT_DISCOUNTS_FILE);
  return Array.isArray(file.codes) ? file.codes : DEFAULT_DISCOUNT_CODES;
}

export async function setDiscountCodes(codes: DiscountCode[]): Promise<void> {
  await writeDataFile(DISCOUNTS_FILE, { codes } satisfies DiscountsFileShape);
}

export function normalizeDiscountCode(input: string): string {
  return input.trim().toUpperCase();
}


