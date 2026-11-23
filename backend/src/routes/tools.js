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

  // [US-03] détail d'un outil (GET /:id)
  router.get('/:id', (req, res) => {
    const tool = db.tools.find((t) => t.id === req.params.id);
    if (!tool) return res.status(404).json({ error: 'Outil introuvable' });

    const owner = db.users.find((u) => u.id === tool.ownerId);
    return res.status(200).json({
      id: tool.id,
      name: tool.name,
      category: tool.category,
      description: tool.description ?? '',
      status: tool.status,
      owner: owner ? { firstName: owner.firstName, district: owner.district } : null,
    });
  });

  return router;
}
