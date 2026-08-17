export type ReflectionShowcaseState = "loading" | "empty" | "approved";

export function getReflectionShowcaseState({ isLoading, approvedCount }: { isLoading: boolean; approvedCount: number }): ReflectionShowcaseState {
  if (isLoading) return "loading";
  return approvedCount > 0 ? "approved" : "empty";
}
