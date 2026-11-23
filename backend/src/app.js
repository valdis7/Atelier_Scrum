import express from 'express';
import { createSeed } from './data/seed.js';

// Chaque appel crée une app avec ses propres données : les tests restent indépendants.
export function createApp(db = createSeed()) {
  const app = express();
  app.use(express.json());

  // Utilisateur courant : en-tête X-User-Id (pas d'authentification réelle).
  app.use((req, _res, next) => {
    req.userId = req.get('X-User-Id') ?? null;
    next();
  });

  app.locals.db = db;

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Les routes des stories (US-01, US-02...) s'ajoutent ici ou dans src/routes/.

  return app;
}
