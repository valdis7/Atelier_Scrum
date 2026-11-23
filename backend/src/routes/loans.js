import { Router } from 'express';

// Routes /api/loans. Un emplacement par story : on ajoute son code JUSTE SOUS sa ligne
// [US-xx], sans toucher aux autres, pour éviter les conflits de merge.
export function loansRouter(db) {
  const router = Router();

  // [US-08] mes emprunts (GET /mine)

  // [US-06] empêcher les chevauchements (avant US-04, sur POST /)

  // [US-04] demander un emprunt (POST /)

  // [US-05] accepter ou refuser une demande (PATCH /:id)

  // [US-07] déclarer le retour (PATCH /:id/return)

  // [US-13] noter l'emprunteur (POST /:id/rating)

  return router;
}
