# Carnet de bord · Projet BricoLoop

**Équipe :** Atelier_Scrum (EPSI B3)
**Membres :** Oussama, Léana, Nesrine, Morgane, Vanessa
**Dépôt GitHub :** https://github.com/valdis7/Atelier_Scrum
**Vidéo :** [à ajouter]
**Date :** 22 octobre 2026

**Product Goal :** un voisin peut emprunter un outil disponible près de chez lui en quelques clics, et le propriétaire garde la main sur ses prêts.

## Table de rotation PO / SM effective

| Séquence  | Product Owner | Scrum Master |
|-----------|---------------|--------------|
| Lancement | [à compléter] | pas de SM    |
| Sprint 1  | Oussama       | [à compléter] |
| Sprint 2  | Vanessa       | [à compléter] |
| Sprint 3  | [à compléter] | [à compléter] |

Règles : le PO du sprint ne code pas, et le PO et le SM d'un même sprint sont deux personnes différentes.

---

## Lancement (10:30 à 11:15)

### Estimation du backlog (Planning Poker)

| Ordre | ID    | Story                                     | Priorité | Valeur PO | Points |
|-------|-------|-------------------------------------------|----------|-----------|--------|
| 1     | US-01 | Consulter le catalogue des outils         | Must     | 40        | [?]    |
| 2     | US-02 | Proposer un outil au prêt                 | Must     | 35        | [?]    |
| 3     | US-03 | Voir le détail d'un outil                 | Must     | 20        | [?]    |
| 4     | US-04 | Demander l'emprunt d'un outil             | Must     | 50        | [?]    |
| 5     | US-05 | Accepter ou refuser une demande           | Must     | 45        | [?]    |
| 6     | US-06 | Empêcher les emprunts qui se chevauchent  | Should   | 30        | [?]    |
| 7     | US-07 | Déclarer le retour d'un outil             | Should   | 25        | [?]    |
| 8     | US-08 | Voir mes emprunts                         | Should   | 20        | [?]    |
| 9     | US-09 | Interface web du parcours d'emprunt       | Should   | 40        | [?]    |
| 10    | US-10 | Filtrer le catalogue par catégorie        | Should   | 15        | [?]    |
| 11    | US-11 | Rechercher un outil par mot-clé           | Could    | 15        | [?]    |
| 12    | US-12 | Voir mes outils et les demandes reçues    | Could    | 15        | [?]    |
| 13    | US-13 | Noter l'emprunteur après le retour        | Could    | 10        | [?]    |
| 14    | US-14 | Historique des prêts d'un outil           | Could    | 5         | [?]    |

### Décisions du PO du lancement

- Priorités retenues pour le Sprint 1 : US-01, US-02, US-03.
- Organisation : tableau Trello en 5 colonnes (Backlog initial, À faire, En cours, In review, Terminé).
- Stack : [à compléter, ex. Node.js 20 + Express, Vitest + Supertest, ESLint flat].

### État du Sprint 0 à 11:15

| ID   | Story technique                                              | État          |
|------|--------------------------------------------------------------|---------------|
| T-01 | Dépôt créé, membres invités, main protégée, README           | [à vérifier]  |
| T-02 | `npm run lint`, `npm test`, `npm run check`, test GET /health | [à vérifier]  |
| T-03 | Seed : 4 voisins et 8 outils dans au moins 3 catégories      | [à vérifier]  |
| T-04 | Bonus : GitHub Action `npm run check` sur chaque PR          | [à vérifier]  |

---

## Sprint 1 (11:15 à 12:30)

**PO :** Oussama · **SM :** [à compléter]
**Sprint Goal :** permettre aux voisins de consulter le catalogue, d'ouvrir la fiche d'un outil et de proposer un outil au prêt.
**Points engagés :** [?] · **Points Done (vélocité) :** [?]

### Stories du sprint

| Story | Points | Tâches principales                                          | Dev          | Done ? (DoD) |
|-------|--------|-------------------------------------------------------------|--------------|--------------|
| US-01 | [?]    | GET /api/tools, tri disponibles en premier, liste vide       | [à compléter] | [?]         |
| US-02 | [?]    | POST /api/tools, validation, owner et statut côté serveur, tests Vitest/Supertest | Morgane | [?] |
| US-03 | [?]    | GET /api/tools/:id avec prénom et quartier du propriétaire, 404 | Nesrine  | [?]          |

### Burndown (points restants)

| Début du sprint | Daily 1 (+15) | Daily 2 (+30) | Fin du dev | Vélocité |
|-----------------|---------------|---------------|------------|----------|
| [?]             | [?]           | [?]           | [?]        | [?]      |

### Fiche d'auto-review

| Story | Critère d'acceptation                                   | Démontré ? | Test associé |
|-------|---------------------------------------------------------|------------|--------------|
| US-01 | Nom, catégorie et statut affichés                       | [?]        | [?]          |
| US-01 | Outils disponibles en premier                           | [?]        | [?]          |
| US-01 | Aucun outil : liste vide                                | [?]        | [?]          |
| US-02 | Nom 2 à 60 car., catégorie autorisée, description 300 max | [?]      | [?]          |
| US-02 | Outil créé appartient à l'utilisateur courant, statut disponible | [?] | [?]        |
| US-02 | Donnée invalide : 400 avec le champ en cause            | [?]        | [?]          |
| US-03 | Fiche : nom, catégorie, description, statut, prénom et quartier du propriétaire | [?] | [?] |
| US-03 | Identifiant inconnu : 404                               | [?]        | [?]          |

| Story | Tests verts | Lint 0 warning | PR relue et mergée | Décision du PO |
|-------|-------------|----------------|--------------------|----------------|
| US-01 | [?]         | [?]            | [PR #?]            | [acceptée / refusée] |
| US-02 | [?]         | [?]            | [PR #?]            | [acceptée / refusée] |
| US-03 | [?]         | [?]            | [PR #?]            | [acceptée / refusée] |

**Stories refusées et pourquoi :** [à compléter]

### Imprévus et réaction de l'équipe

[à compléter]

### Décisions du PO (comité produit avec le CEO)

[à compléter]

### Rétrospective

| Start         | Stop          | Continue      |
|---------------|---------------|---------------|
| [à compléter] | [à compléter] | [à compléter] |

**Action retenue :** [à compléter] · **Responsable :** [à compléter]
**L'action du lancement a-t-elle été appliquée ?** [à compléter]

---

## Sprint 2 (13:30 à 14:45)

**PO :** Vanessa · **SM :** [à compléter]
**Sprint Goal :** [à compléter]
**Points engagés :** [?] · **Points Done :** [?]

[Même structure que le Sprint 1 : stories, burndown, auto-review, imprévus, décisions du PO, rétro, action précédente appliquée ?]

---

## Sprint 3 (15:00 à 16:15)

**PO :** [à compléter] · **SM :** [à compléter]
**Sprint Goal :** [à compléter]
**Points engagés :** [?] · **Points Done :** [?]

[Même structure que le Sprint 1.]

---

## Bilan

**Vélocité :** Sprint 1 : [?] · Sprint 2 : [?] · Sprint 3 : [?]

**Ce qui a bien marché :** [à compléter]
**Ce qui a coincé :** [à compléter]

### Retour de chaque PO (3 à 4 lignes)

- **[PO lancement] :** [à compléter]
- **Oussama (Sprint 1) :** [à compléter]
- **Vanessa (Sprint 2) :** [à compléter]
- **[PO Sprint 3] :** [à compléter]

### Un apprentissage par membre

- **Oussama :** [à compléter]
- **Léana :** [à compléter]
- **Nesrine :** [à compléter]
- **Morgane :** [à compléter]
- **Vanessa :** [à compléter]
