import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('GET /api/users (US-09)', () => {
  it('liste les profils pour choisir l\'utilisateur courant', async () => {
    const res = await request(createApp()).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    expect(res.body[0]).toEqual({ id: 'u1', firstName: 'Camille', district: 'Antigone' });
  });
});
