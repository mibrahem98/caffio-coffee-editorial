export type SearchStatusAction = "filter" | "sort" | "saved";

type SearchStatusInput = {
  resultCount: number;
  resultLabel: string;
  activeCount: number;
  activeLabel: string;
  isUpdating: boolean;
  updatingLabel: string;
  action: SearchStatusAction;
  sortedLabel: string;
  sortLabel: string;
  preferencesClearedLabel: string;
};

export function describeSearchStatus({ resultCount, resultLabel, activeCount, activeLabel, isUpdating, updatingLabel, action, sortedLabel, sortLabel, preferencesClearedLabel }: SearchStatusInput) {
  if (isUpdating) return updatingLabel;
  const status = [`${resultCount} ${resultLabel}`];
  if (activeCount) status.push(`${activeCount} ${activeLabel}`);
  if (action === "sort") status.push(`${sortedLabel}: ${sortLabel}`);
  if (action === "saved") status.push(preferencesClearedLabel);
  return status.join(" · ");
}
