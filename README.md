# BricoLoop · Atelier_Scrum (EPSI B3)

Une perceuse ou un taille-haie ne servent que quelques heures par an. Avec BricoLoop, un voisin emprunte l'outil à quelqu'un de son quartier au lieu de l'acheter.

**Product Goal :** un voisin peut emprunter un outil disponible près de chez lui en quelques clics, et le propriétaire garde la main sur ses prêts.

## Équipe

Oussama, Léana, Nesrine, Morgane, Vanessa

| Séquence  | Product Owner | Scrum Master |
|-----------|---------------|--------------|
| Lancement | [à compléter] | pas de SM    |
| Sprint 1  | Oussama       | [à compléter] |
| Sprint 2  | Vanessa       | [à compléter] |
| Sprint 3  | [à compléter] | [à compléter] |

## Lancer le projet

Prérequis : Node.js 20 ou plus.

```bash
# API (port 3001)
cd backend
npm install
npm start          # http://localhost:3001/health
npm run check      # lint (0 warning) + tests

# Front (port 3000)
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + build
```

L'utilisateur courant est passé dans l'en-tête `X-User-Id` (u1 à u4 dans les données de démo).

## Structure

```
backend/    API Express, données en mémoire (src/data/seed.js), tests Vitest + Supertest
frontend/   Interface Next.js
.github/    CI (npm run check sur chaque PR), templates d'issue et de PR
```

## Comment on travaille

1. On prend une issue et on se l'assigne.
2. On crée une branche depuis `main` à jour : `feature/US-01-catalogue`, ou `fix/...` pour un bug.
3. On fait des commits préfixés : `feat:`, `fix:`, `test:`, `refactor:`, `docs:`.
4. On ouvre une PR avec `Closes #<issue>`. La CI doit être verte et un autre membre doit l'approuver.
5. On merge dans `main`. Aucun push direct sur `main`.

## Stories Done

| Story | PR |
|-------|----|
| [à compléter au fil des sprints] | |

## Vidéo

[lien à ajouter]

## Carnet de bord

Voir [CARNET_DE_BORD.md](CARNET_DE_BORD.md).
