import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';
import { createSeed } from '../src/data/seed.js';

describe('GET /api/tools (US-01)', () => {
  it('affiche pour chaque outil le nom, la catégorie et le statut', async () => {
    const res = await request(createApp()).get('/api/tools');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(8);
    for (const tool of res.body) {
      expect(tool).toEqual({ id: expect.any(String), name: expect.any(String), category: expect.any(String), status: expect.any(String) });
    }
  });

  it('les outils disponibles apparaissent en premier', async () => {
    const res = await request(createApp()).get('/api/tools');
    const statuses = res.body.map((t) => t.status);
    const firstOther = statuses.findIndex((s) => s !== 'available');
    expect(statuses.slice(firstOther).every((s) => s !== 'available')).toBe(true);
  });

  it('sans aucun outil, la réponse est une liste vide', async () => {
    const db = createSeed();
    db.tools = [];
    const res = await request(createApp(db)).get('/api/tools');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
