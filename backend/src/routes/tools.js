import { Router } from 'express';
import { CATEGORIES } from '../data/seed.js';

// Routes /api/tools. Un emplacement par story : on ajoute son code JUSTE SOUS sa ligne
// [US-xx], sans toucher aux autres, pour éviter les conflits de merge.
// L'ordre compte pour Express : les chemins précis (/mine) avant /:id.
export function toolsRouter(db) {
  const router = Router();

  // [US-10] filtrer par catégorie (GET /?category=)
  router.get('/', (req, res, next) => {
    const { category } = req.query;
    if (category === undefined) return next();
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ field: 'category', error: `Catégorie inconnue : ${category}` });
    }
    const rank = { available: 0, lent: 1, unavailable: 2 };
    const list = db.tools
      .filter((t) => t.category === category)
      .map((t) => ({ id: t.id, name: t.name, category: t.category, status: t.status }))
      .sort((a, b) => rank[a.status] - rank[b.status]);
    return res.status(200).json(list);
  });

  // [US-11] rechercher par mot-clé (GET /?q=)
  router.get('/', (req, res, next) => {
    const { q } = req.query;
    if (q === undefined) return next();
    const needle = String(q).toLocaleLowerCase('fr');
    const list = db.tools
      .filter((t) => `${t.name} ${t.description ?? ''}`.toLocaleLowerCase('fr').includes(needle))
      .map((t) => ({ id: t.id, name: t.name, category: t.category, status: t.status }));
    return res.status(200).json(list);
  });

  // [US-01] catalogue (GET /)
  router.get('/', (req, res) => {
    const rank = { available: 0, lent: 1, unavailable: 2 };
    const list = db.tools
      .map((t) => ({ id: t.id, name: t.name, category: t.category, status: t.status }))
      .sort((a, b) => rank[a.status] - rank[b.status]);
    return res.status(200).json(list);
  });

  // [US-02] proposer un outil (POST /)

  // [US-12] mes outils et demandes reçues (GET /mine)
  router.get('/mine', (req, res) => {
    if (!req.userId) return res.status(403).json({ error: 'En-tête X-User-Id requis' });

    const mine = db.tools
      .filter((t) => t.ownerId === req.userId)
      .map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        status: t.status,
        pendingRequests: db.loans.filter((l) => l.toolId === t.id && l.status === 'pending').length,
      }));
    return res.status(200).json(mine);
  });

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
