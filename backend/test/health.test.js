import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';
import { CATEGORIES } from '../src/data/seed.js';

describe('GET /health', () => {
  it('répond 200', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('données de démo (T-03)', () => {
  it('charge 4 voisins et 8 outils dans au moins 3 catégories autorisées', () => {
    const { db } = createApp().locals;
    expect(db.users).toHaveLength(4);
    expect(db.tools).toHaveLength(8);
    const cats = new Set(db.tools.map((t) => t.category));
    expect(cats.size).toBeGreaterThanOrEqual(3);
    for (const c of cats) expect(CATEGORIES).toContain(c);
  });
});
