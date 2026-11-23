import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('GET /api/tools/:id (US-03)', () => {
  it('affiche nom, catégorie, description, statut, prénom et quartier du propriétaire', async () => {
    const res = await request(createApp()).get('/api/tools/t1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 't1',
      name: 'Perceuse-visseuse',
      category: 'Perçage',
      description: 'Perceuse sans fil 18 V avec deux batteries.',
      status: 'available',
      owner: { firstName: 'Camille', district: 'Antigone' },
    });
  });

  it('un identifiant inconnu renvoie 404', async () => {
    const res = await request(createApp()).get('/api/tools/inconnu');
    expect(res.status).toBe(404);
  });
});
