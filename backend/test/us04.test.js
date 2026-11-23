import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

// t1 appartient à u1 (Camille), t5 est indisponible.
let db;
let app;
beforeEach(() => {
  db = createSeed();
  app = createApp(db);
});

const ask = (userId, body) => request(app).post('/api/loans').set('X-User-Id', userId).send(body);

describe('POST /api/loans (US-04)', () => {
  it('outil disponible + dates : une demande « pending » est créée', async () => {
    const res = await ask('u2', { toolId: 't1', startDate: '2026-12-10', endDate: '2026-12-15' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ toolId: 't1', borrowerId: 'u2', status: 'pending' });
    expect(db.loans).toHaveLength(1);
  });

  it('une date de fin antérieure à la date de début renvoie 400', async () => {
    const res = await ask('u2', { toolId: 't1', startDate: '2026-12-15', endDate: '2026-12-10' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('endDate');
  });

  it('demander son propre outil renvoie 400', async () => {
    const res = await ask('u1', { toolId: 't1', startDate: '2026-12-10', endDate: '2026-12-15' });
    expect(res.status).toBe(400);
  });

  it('plusieurs demandes en attente peuvent exister pour le même outil', async () => {
    await ask('u2', { toolId: 't1', startDate: '2026-12-10', endDate: '2026-12-15' });
    const res = await ask('u3', { toolId: 't1', startDate: '2026-12-11', endDate: '2026-12-12' });
    expect(res.status).toBe(201);
    expect(db.loans.filter((l) => l.status === 'pending')).toHaveLength(2);
  });

  it('une date mal formée renvoie 400 avec le champ en cause', async () => {
    const res = await ask('u2', { toolId: 't1', startDate: '10/12/2026', endDate: '2026-12-15' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('startDate');
  });

  it('un outil inconnu renvoie 404, un outil indisponible 409', async () => {
    expect((await ask('u2', { toolId: 'nope', startDate: '2026-12-10', endDate: '2026-12-15' })).status).toBe(404);
    expect((await ask('u1', { toolId: 't5', startDate: '2026-12-10', endDate: '2026-12-15' })).status).toBe(409);
  });
});
