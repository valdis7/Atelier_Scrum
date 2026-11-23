import express from 'express';
import { createSeed } from './data/seed.js';
import { toolsRouter } from './routes/tools.js';
import { loansRouter } from './routes/loans.js';
import { usersRouter } from './routes/users.js';

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

  // Le code des stories va dans src/routes/, chacune à son emplacement [US-xx].
  app.use('/api/tools', toolsRouter(db));
  app.use('/api/loans', loansRouter(db));
  app.use('/api/users', usersRouter(db));

  return app;
}
