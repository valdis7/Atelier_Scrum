import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

// t1 (Camille) est déjà prêté à u3 du 10 au 15.
let app;
beforeEach(() => {
  const db = createSeed();
  db.tools.find((t) => t.id === 't1').status = 'lent';
  db.loans.push({ id: 'l1', toolId: 't1', borrowerId: 'u3', startDate: '2026-12-10', endDate: '2026-12-15', status: 'accepted' });
  app = createApp(db);
});

const ask = (startDate, endDate) =>
  request(app).post('/api/loans').set('X-User-Id', 'u2').send({ toolId: 't1', startDate, endDate });

describe('chevauchement des prêts (US-06)', () => {
  it('prêt accepté du 10 au 15, demande du 12 au 14 : 409', async () => {
    const res = await ask('2026-12-12', '2026-12-14');
    expect(res.status).toBe(409);
  });

  it('une demande qui chevauche le dernier jour est refusée (409)', async () => {
    const res = await ask('2026-12-15', '2026-12-17');
    expect(res.status).toBe(409);
  });

  it('une demande qui commence le lendemain de la fin du prêt est acceptable', async () => {
    const res = await ask('2026-12-16', '2026-12-18');
    expect(res.status).toBe(201);
  });
});
