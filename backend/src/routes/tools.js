import { Router } from 'express';

// Routes /api/tools. Un emplacement par story : on ajoute son code JUSTE SOUS sa ligne
// [US-xx], sans toucher aux autres, pour éviter les conflits de merge.
// L'ordre compte pour Express : les chemins précis (/mine) avant /:id.
export function toolsRouter(db) {
  const router = Router();

  // [US-10] filtrer par catégorie (GET /?category=)

  // [US-11] rechercher par mot-clé (GET /?q=)

  // [US-01] catalogue (GET /)

  // [US-02] proposer un outil (POST /)

  // [US-12] mes outils et demandes reçues (GET /mine)

  // [US-14] historique des prêts d'un outil (GET /:id/loans)
  router.get('/:id/loans', (req, res) => {
    const tool = db.tools.find((t) => t.id === req.params.id);
    if (!tool) return res.status(404).json({ error: 'Outil introuvable' });

    const history = db.loans
      .filter((l) => l.toolId === tool.id && ['accepted', 'returned'].includes(l.status))
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .map((l) => ({ ...l, borrower: db.users.find((u) => u.id === l.borrowerId)?.firstName ?? null }));
    return res.status(200).json(history);
  });

  // [US-03] détail d'un outil (GET /:id)

  return router;
}
