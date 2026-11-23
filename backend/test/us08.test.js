import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

function appWithLoans() {
  const db = createSeed();
  db.loans.push(
    { id: 'l1', toolId: 't3', borrowerId: 'u1', startDate: '2026-12-20', endDate: '2026-12-21', status: 'pending' },
    { id: 'l2', toolId: 't4', borrowerId: 'u1', startDate: '2026-12-05', endDate: '2026-12-06', status: 'accepted' },
    { id: 'l3', toolId: 't3', borrowerId: 'u2', startDate: '2026-12-01', endDate: '2026-12-02', status: 'pending' },
  );
  return createApp(db);
}

describe('GET /api/loans/mine (US-08)', () => {
  it('liste mes demandes avec leur statut, triées par date de début', async () => {
    const res = await request(appWithLoans()).get('/api/loans/mine').set('X-User-Id', 'u1');
    expect(res.status).toBe(200);
    expect(res.body.map((l) => [l.id, l.status])).toEqual([
      ['l2', 'accepted'],
      ['l1', 'pending'],
    ]);
  });

  it('je ne vois que les miennes', async () => {
    const res = await request(appWithLoans()).get('/api/loans/mine').set('X-User-Id', 'u2');
    expect(res.body.map((l) => l.id)).toEqual(['l3']);
  });

  it('sans utilisateur courant : 403', async () => {
    const res = await request(appWithLoans()).get('/api/loans/mine');
    expect(res.status).toBe(403);
  });
});
