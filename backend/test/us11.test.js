import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

const search = (q) => request(createApp()).get('/api/tools').query({ q });

describe('GET /api/tools?q= (US-11)', () => {
  it('cherche dans le nom, sans tenir compte des majuscules', async () => {
    const res = await search('PERCEUSE');
    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.id)).toEqual(['t1']);
  });

  it('cherche aussi dans la description', async () => {
    const res = await search('béton');
    expect(res.body.map((t) => t.id)).toEqual(['t7']);
  });

  it('une recherche sans résultat renvoie une liste vide', async () => {
    const res = await search('trottinette');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
