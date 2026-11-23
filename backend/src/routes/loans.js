import { Router } from 'express';

// Routes /api/loans. Un emplacement par story : on ajoute son code JUSTE SOUS sa ligne
// [US-xx], sans toucher aux autres, pour éviter les conflits de merge.
export function loansRouter(db) {
  const router = Router();

  // [US-08] mes emprunts (GET /mine)

  // [US-06] empêcher les chevauchements (avant US-04, sur POST /)

  // [US-04] demander un emprunt (POST /)

  // [US-05] accepter ou refuser une demande (PATCH /:id)
  router.patch('/:id', (req, res) => {
    const loan = db.loans.find((l) => l.id === req.params.id);
    if (!loan) return res.status(404).json({ error: 'Demande introuvable' });

    const tool = db.tools.find((t) => t.id === loan.toolId);
    if (!tool || !req.userId || tool.ownerId !== req.userId) {
      return res.status(403).json({ error: 'Seul le propriétaire de l\'outil peut répondre' });
    }

    const { decision } = req.body ?? {};
    if (!['accepted', 'refused'].includes(decision)) {
      return res.status(400).json({ field: 'decision', error: 'decision doit valoir "accepted" ou "refused"' });
    }
    if (loan.status !== 'pending') {
      return res.status(409).json({ error: `Demande déjà traitée (${loan.status})` });
    }

    loan.status = decision;
    if (decision === 'accepted') tool.status = 'lent';
    return res.status(200).json(loan);
  });

  // [US-07] déclarer le retour (PATCH /:id/return)

  // [US-13] noter l'emprunteur (POST /:id/rating)

  return router;
}
