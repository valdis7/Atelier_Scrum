import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

describe('GET /api/tools/:id/loans (US-14)', () => {
  it('liste les prêts acceptés et rendus, du plus récent au plus ancien', async () => {
    const db = createSeed();
    db.loans.push(
      { id: 'l1', toolId: 't1', borrowerId: 'u2', startDate: '2026-10-01', endDate: '2026-10-02', status: 'returned' },
      { id: 'l2', toolId: 't1', borrowerId: 'u3', startDate: '2026-12-01', endDate: '2026-12-02', status: 'accepted' },
      { id: 'l3', toolId: 't1', borrowerId: 'u4', startDate: '2026-12-05', endDate: '2026-12-06', status: 'pending' },
      { id: 'l4', toolId: 't1', borrowerId: 'u4', startDate: '2026-11-01', endDate: '2026-11-02', status: 'refused' },
      { id: 'l5', toolId: 't3', borrowerId: 'u1', startDate: '2026-11-15', endDate: '2026-11-16', status: 'returned' },
    );
    const res = await request(createApp(db)).get('/api/tools/t1/loans');
    expect(res.status).toBe(200);
    expect(res.body.map((l) => l.id)).toEqual(['l2', 'l1']);
    expect(res.body[0].borrower).toBe('Inès');
  });

  it('un outil inconnu renvoie 404', async () => {
    const res = await request(createApp()).get('/api/tools/inconnu/loans');
    expect(res.status).toBe(404);
  });
});
