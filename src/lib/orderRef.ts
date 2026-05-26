// Returns a short, human-friendly order reference.
// Prefers the sequential order_number (e.g. ZEY-12). Falls back to a
// deterministic short hash of the legacy paypal/db id for very old rows
// that may not have an order_number yet.
export function getShortOrderRef(
  orderNumber?: number | null,
  fallbackId?: string | null,
): string {
  if (typeof orderNumber === "number" && orderNumber > 0) {
    return `ZEY-${orderNumber}`;
  }
  const id = fallbackId || "";
  if (!id) return "ZEY-0";
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const num = (hash % 900) + 100; // 3 digits fallback
  return `ZEY-${num}`;
}
