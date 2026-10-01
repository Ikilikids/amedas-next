export function isRecentAvailable(history: any[] | undefined): boolean {
  return !!history && history.length > 0;
}
