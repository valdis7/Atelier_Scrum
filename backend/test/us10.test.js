import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('GET /api/tools?category= (US-10)', () => {
  it('ne renvoie que les outils de la catégorie choisie', async () => {
    const res = await request(createApp()).get('/api/tools').query({ category: 'Jardinage' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((t) => t.category === 'Jardinage')).toBe(true);
  });

  it('une catégorie inconnue renvoie 400', async () => {
    const res = await request(createApp()).get('/api/tools').query({ category: 'Cuisine' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('category');
  });
});
