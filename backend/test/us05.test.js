import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

// US-05 : accepter ou refuser une demande d'emprunt.
// t1 appartient à u1 (Camille). u2 demande à l'emprunter.
let db;
let app;

beforeEach(() => {
  db = createSeed();
  db.loans.push(
    { id: 'l1', toolId: 't1', borrowerId: 'u2', startDate: '2026-12-10', endDate: '2026-12-15', status: 'pending' },
    { id: 'l2', toolId: 't1', borrowerId: 'u3', startDate: '2026-12-20', endDate: '2026-12-22', status: 'pending' },
  );
  app = createApp(db);
});

const answer = (loanId, userId, decision) =>
  request(app).patch(`/api/loans/${loanId}`).set('X-User-Id', userId).send({ decision });

describe('PATCH /api/loans/:id (US-05)', () => {
  it('le propriétaire accepte : la demande passe « accepted » et l\'outil « lent »', async () => {
    const res = await answer('l1', 'u1', 'accepted');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
    expect(db.tools.find((t) => t.id === 't1').status).toBe('lent');
  });

  it('le propriétaire refuse : la demande passe « refused », l\'outil ne change pas', async () => {
    const res = await answer('l1', 'u1', 'refused');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('refused');
    expect(db.tools.find((t) => t.id === 't1').status).toBe('available');
  });

  it('un autre utilisateur que le propriétaire reçoit 403', async () => {
    const res = await answer('l1', 'u2', 'accepted');
    expect(res.status).toBe(403);
    expect(db.loans.find((l) => l.id === 'l1').status).toBe('pending');
  });

  it('sans utilisateur courant : 403', async () => {
    const res = await request(app).patch('/api/loans/l1').send({ decision: 'accepted' });
    expect(res.status).toBe(403);
  });

  it('répondre à une demande qui n\'est plus « pending » renvoie 409', async () => {
    await answer('l1', 'u1', 'refused');
    const res = await answer('l1', 'u1', 'accepted');
    expect(res.status).toBe(409);
  });

  it('une décision invalide renvoie 400 avec le champ en cause', async () => {
    const res = await answer('l1', 'u1', 'peut-être');
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('decision');
  });

  it('une demande inconnue renvoie 404', async () => {
    const res = await answer('l999', 'u1', 'accepted');
    expect(res.status).toBe(404);
  });
});
