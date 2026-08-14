import { describe, expect, it } from "vitest";
import { hasLiveStripeConfiguration } from "./stripeConfig";

describe("Caffio Stripe configuration guard", () => {
  it("does not enable live checkout until both supported Stripe keys exist", () => {
    expect(hasLiveStripeConfiguration({})).toBe(false);
    expect(hasLiveStripeConfiguration({ secretKey: "sk_test_example" })).toBe(false);
    expect(hasLiveStripeConfiguration({ publishableKey: "pk_test_example" })).toBe(false);
    expect(hasLiveStripeConfiguration({ secretKey: "sk_test_example", publishableKey: "pk_test_example" })).toBe(true);
  });
});
