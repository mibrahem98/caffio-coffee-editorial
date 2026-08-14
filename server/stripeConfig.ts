export type StripeConfiguration = {
  secretKey?: string;
  publishableKey?: string;
};

export function hasLiveStripeConfiguration(config: StripeConfiguration): boolean {
  return Boolean(config.secretKey?.startsWith("sk_") && config.publishableKey?.startsWith("pk_"));
}
