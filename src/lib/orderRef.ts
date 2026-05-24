// Generates a short, human-friendly order reference from a PayPal order ID.
// Deterministic: same input always returns same output.
export function getShortOrderRef(orderId: string): string {
  if (!orderId) return "ZEY-000000";
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) {
    hash = (hash * 31 + orderId.charCodeAt(i)) >>> 0;
  }
  const num = (hash % 900000) + 100000; // 6 digits, 100000-999999
  return `ZEY-${num}`;
}
