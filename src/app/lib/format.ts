export function formatCount(count: number): string {
  return count > 999 ? `${Math.floor(count / 1000)}k` : `${count}`;
}
