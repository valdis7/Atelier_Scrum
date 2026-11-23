import { Router } from 'express';
import { randomUUID } from 'node:crypto';

// Routes /api/loans. Un emplacement par story : on ajoute son code JUSTE SOUS sa ligne
// [US-xx], sans toucher aux autres, pour éviter les conflits de merge.
export function loansRouter(db) {
  const router = Router();

  // [US-08] mes emprunts (GET /mine)
  router.get('/mine', (req, res) => {
    if (!req.userId) return res.status(403).json({ error: 'En-tête X-User-Id requis' });

    const mine = db.loans
      .filter((l) => l.borrowerId === req.userId)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((l) => ({ ...l, toolName: db.tools.find((t) => t.id === l.toolId)?.name ?? null }));
    return res.status(200).json(mine);
  });

  // [US-06] empêcher les chevauchements (avant US-04, sur POST /)

  // [US-04] demander un emprunt (POST /)
  router.post('/', (req, res) => {
    if (!req.userId) return res.status(403).json({ error: 'En-tête X-User-Id requis' });

    const { toolId, startDate, endDate } = req.body ?? {};
    const isDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));
    if (!toolId) return res.status(400).json({ field: 'toolId', error: 'toolId est obligatoire' });
    if (!isDate(startDate)) return res.status(400).json({ field: 'startDate', error: 'Date au format AAAA-MM-JJ' });
    if (!isDate(endDate)) return res.status(400).json({ field: 'endDate', error: 'Date au format AAAA-MM-JJ' });
    if (endDate < startDate) {
      return res.status(400).json({ field: 'endDate', error: 'La date de fin est antérieure à la date de début' });
    }

    const tool = db.tools.find((t) => t.id === toolId);
    if (!tool) return res.status(404).json({ error: 'Outil introuvable' });
    if (tool.ownerId === req.userId) {
      return res.status(400).json({ field: 'toolId', error: 'Impossible de demander son propre outil' });
    }
    if (tool.status === 'unavailable') return res.status(409).json({ error: 'Outil indisponible' });

    const loan = { id: randomUUID(), toolId, borrowerId: req.userId, startDate, endDate, status: 'pending' };
    db.loans.push(loan);
    return res.status(201).json(loan);
  });

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
