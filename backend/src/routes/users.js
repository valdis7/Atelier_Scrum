import { Router } from 'express';

// Routes /api/users. On ajoute son code JUSTE SOUS sa ligne [US-xx].
export function usersRouter(db) {
  const router = Router();

  // [US-09] liste des profils pour choisir l'utilisateur courant (GET /)
  router.get('/', (req, res) => {
    return res.status(200).json(db.users.map((u) => ({ id: u.id, firstName: u.firstName, district: u.district })));
  });

  return router;
}
