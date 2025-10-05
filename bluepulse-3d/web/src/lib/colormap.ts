export function colorFor(v: number | null, vmin: number, vmax: number) {
  if (v == null) return `#000000`;
  const t = Math.max(0, Math.min(1, (v - vmin) / (vmax - vmin + 1e-9)));
  const hue = 200 - 200 * t; // blue→red
  return `hsl(${hue}, 80%, 55%)`;
}