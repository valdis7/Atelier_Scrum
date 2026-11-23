import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

// t2 (taille-haie de u1) est prêté à u3.
let db;
let app;
beforeEach(() => {
  db = createSeed();
  db.loans.push({ id: 'l1', toolId: 't2', borrowerId: 'u3', startDate: '2026-12-01', endDate: '2026-12-03', status: 'accepted' });
  app = createApp(db);
});

const giveBack = (userId, loanId = 'l1') => request(app).patch(`/api/loans/${loanId}/return`).set('X-User-Id', userId);

describe('PATCH /api/loans/:id/return (US-07)', () => {
  it('le prêt passe « returned » et l\'outil redevient « available »', async () => {
    const res = await giveBack('u1');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('returned');
    expect(db.tools.find((t) => t.id === 't2').status).toBe('available');
  });

  it('seul le propriétaire peut déclarer le retour (403 sinon)', async () => {
    const res = await giveBack('u3');
    expect(res.status).toBe(403);
    expect(db.loans[0].status).toBe('accepted');
  });

  it('un prêt déjà rendu renvoie 409, un prêt inconnu 404', async () => {
    await giveBack('u1');
    expect((await giveBack('u1')).status).toBe(409);
    expect((await giveBack('u1', 'nope')).status).toBe(404);
  });
});
