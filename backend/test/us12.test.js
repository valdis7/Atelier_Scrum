import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

describe('GET /api/tools/mine (US-12)', () => {
  it('affiche mes outils et, pour chacun, le nombre de demandes en attente', async () => {
    const db = createSeed();
    db.loans.push(
      { id: 'l1', toolId: 't1', borrowerId: 'u2', startDate: '2026-12-10', endDate: '2026-12-11', status: 'pending' },
      { id: 'l2', toolId: 't1', borrowerId: 'u3', startDate: '2026-12-12', endDate: '2026-12-13', status: 'pending' },
      { id: 'l3', toolId: 't2', borrowerId: 'u3', startDate: '2026-12-01', endDate: '2026-12-02', status: 'accepted' },
    );
    const res = await request(createApp(db)).get('/api/tools/mine').set('X-User-Id', 'u1');
    expect(res.status).toBe(200);
    expect(res.body.map((t) => [t.id, t.pendingRequests])).toEqual([
      ['t1', 2],
      ['t2', 0],
    ]);
  });

  it('sans utilisateur courant : 403', async () => {
    const res = await request(createApp()).get('/api/tools/mine');
    expect(res.status).toBe(403);
  });
});
