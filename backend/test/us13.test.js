import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

let app;
beforeEach(() => {
  const db = createSeed();
  db.loans.push(
    { id: 'l1', toolId: 't1', borrowerId: 'u2', startDate: '2026-11-01', endDate: '2026-11-02', status: 'returned' },
    { id: 'l2', toolId: 't1', borrowerId: 'u3', startDate: '2026-12-01', endDate: '2026-12-02', status: 'accepted' },
  );
  app = createApp(db);
});

const rate = (loanId, score, userId = 'u1') =>
  request(app).post(`/api/loans/${loanId}/rating`).set('X-User-Id', userId).send({ score });

describe('POST /api/loans/:id/rating (US-13)', () => {
  it('le propriétaire note de 1 à 5 un prêt rendu', async () => {
    const res = await rate('l1', 4);
    expect(res.status).toBe(201);
    expect(res.body.rating).toBe(4);
  });

  it('une note hors de 1 à 5 renvoie 400', async () => {
    expect((await rate('l1', 0)).status).toBe(400);
    expect((await rate('l1', 6)).status).toBe(400);
  });

  it('une seule note par prêt (409 la deuxième fois)', async () => {
    await rate('l1', 5);
    expect((await rate('l1', 3)).status).toBe(409);
  });

  it('uniquement sur un prêt « returned » (409 sinon)', async () => {
    expect((await rate('l2', 5)).status).toBe(409);
  });

  it('seul le propriétaire peut noter (403)', async () => {
    expect((await rate('l1', 5, 'u2')).status).toBe(403);
  });
});
