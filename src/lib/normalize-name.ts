// ──────────────────────────────────────────────
// Shared name normalization for player matching
// ──────────────────────────────────────────────
// Safe for both client and server usage (no env deps).

/**
 * Normalize a player name for fuzzy matching.
 * Data Golf: "Scheffler, Scottie"
 * DraftKings: "Scottie Scheffler"
 * FanDuel:    "Scottie Scheffler"
 */
export function normalizeName(name: string): string {
  // Handle "Last, First" format
  if (name.includes(',')) {
    const [last, first] = name.split(',').map(s => s.trim());
    return `${first} ${last}`.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
  }
  return name.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
}
