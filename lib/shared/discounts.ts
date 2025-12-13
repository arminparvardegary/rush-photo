export type DiscountType = "percent" | "fixed";

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number;
  active: boolean;
  /**
   * Optional minimum subtotal for the code to be valid.
   */
  minSubtotal?: number;
}

export const DEFAULT_DISCOUNT_CODES: DiscountCode[] = [
  { code: "WELCOME10", type: "percent", value: 10, active: true },
  { code: "RUSH20", type: "fixed", value: 20, active: true, minSubtotal: 100 },
];


