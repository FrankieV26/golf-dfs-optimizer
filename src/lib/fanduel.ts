// ──────────────────────────────────────────────
// FanDuel API Client for Golf
// ──────────────────────────────────────────────
//
// FanDuel doesn't have a fully public API like DK.
// Two approaches: (1) scrape their public contest pages,
// or (2) accept CSV upload from users (FanDuel allows
// downloading player lists as CSV).
//
// For now we support CSV upload + a fetch attempt.
// ──────────────────────────────────────────────

import { Golfer } from './types';

/**
 * Parse a FanDuel salary CSV export into Golfer objects.
 *
 * Expected columns (FanDuel standard export):
 *   Id, Position, First Name, Last Name, FPPG, Played, Salary, Game, ...
 */
export function parseFanDuelCSV(csvText: string): Golfer[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
  const idxId = headers.indexOf('Id');
  const idxFirst = headers.indexOf('First Name');
  const idxLast = headers.indexOf('Last Name');
  const idxNickname = headers.indexOf('Nickname');
  const idxSalary = headers.indexOf('Salary');
  const idxFppg = headers.indexOf('FPPG');
  const idxGame = headers.indexOf('Game');

  return lines
    .slice(1)
    .map((line) => {
      const cols = line.split(',').map((c) => c.trim().replace(/"/g, ''));
      const salary = parseInt(cols[idxSalary], 10) || 0;
      const fppg = parseFloat(cols[idxFppg]) || 0;
      const name =
        idxNickname >= 0 && cols[idxNickname]
          ? cols[idxNickname]
          : `${cols[idxFirst] || ''} ${cols[idxLast] || ''}`.trim();

      return {
        id: parseInt(cols[idxId], 10) || 0,
        name,
        salary,
        fppg,
        team: '',
        gameInfo: cols[idxGame] || '',
        value: fppg > 0 && salary > 0 ? (fppg / salary) * 1000 : 0,
      };
    })
    .filter((g) => g.salary > 0 && g.fppg > 0)
    .sort((a, b) => b.fppg - a.fppg);
}
