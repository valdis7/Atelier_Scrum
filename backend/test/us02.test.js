import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

const post = (body, userId = 'u2') => request(createApp()).post('/api/tools').set('X-User-Id', userId).send(body);

describe('POST /api/tools (US-02)', () => {
  it('l\'outil créé appartient à l\'utilisateur courant et est disponible', async () => {
    const res = await post({ name: 'Scie sauteuse', category: 'Autre', description: 'Lames bois et métal' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Scie sauteuse', ownerId: 'u2', status: 'available' });
  });

  it('la description est facultative', async () => {
    const res = await post({ name: 'Mètre ruban', category: 'Mesure' });
    expect(res.status).toBe(201);
  });

  it('un nom trop court ou trop long renvoie 400 sur le champ name', async () => {
    expect((await post({ name: 'S', category: 'Autre' })).body.field).toBe('name');
    expect((await post({ name: 'x'.repeat(61), category: 'Autre' })).status).toBe(400);
    expect((await post({ category: 'Autre' })).status).toBe(400);
  });

  it('une catégorie hors liste renvoie 400 sur le champ category', async () => {
    const res = await post({ name: 'Scie', category: 'Cuisine' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('category');
  });

  it('une description de plus de 300 caractères renvoie 400', async () => {
    const res = await post({ name: 'Scie', category: 'Autre', description: 'x'.repeat(301) });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('description');
  });
});
