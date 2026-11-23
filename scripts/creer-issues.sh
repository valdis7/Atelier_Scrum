#!/usr/bin/env bash
# Crée labels, milestones (sprints) et issues BricoLoop sur GitHub.
# Prérequis : gh installé et connecté (gh auth login) avec un compte qui a les droits sur le repo.
# Usage : bash scripts/creer-issues.sh
set -euo pipefail

REPO="valdis7/Atelier_Scrum"

# >>> Remplacez par les pseudos GitHub de chacun (laissez vide pour ne pas assigner)
declare -A LOGIN=(
  [Oussama]=""
  [Leana]=""   # valdis7 ? (c'est elle qui a créé le repo sur Trello)
  [Nesrine]=""
  [Morgane]=""
  [Vanessa]=""
)

label() { gh label create "$1" --color "$2" --description "$3" -R "$REPO" --force >/dev/null; }
milestone() {
  gh api "repos/$REPO/milestones" --jq ".[] | select(.title==\"$1\") | .number" | grep -q . ||
    gh api "repos/$REPO/milestones" -f title="$1" -f description="$2" >/dev/null
}
issue() { # titre labels milestone membre ; corps sur stdin
  local args=(-R "$REPO" --title "$1" --label "$2" --milestone "$3" --body-file -)
  [ -n "${4:-}" ] && [ -n "${LOGIN[$4]:-}" ] && args+=(--assignee "${LOGIN[$4]}")
  gh issue create "${args[@]}"
}

echo "Labels..."
label story 1d76db "User story du backlog"
label technique 5319e7 "Story technique / socle"
label Must b60205 "Indispensable à la vidéo"
label Should fbca04 "Important"
label Could 0e8a16 "Si le temps le permet"
label front c5def5 "Interface web"
label bug d73a4a "Bug"

echo "Milestones..."
milestone "Sprint 0" "Socle technique (T-01 à T-04)"
milestone "Sprint 1" "PO : Oussama"
milestone "Sprint 2" "PO : Vanessa"
milestone "Sprint 3" "PO : à définir"
milestone "Backlog" "Stories non planifiées"

echo "Issues..."

# ---------- Sprint 0 ----------
issue "T-01 · Dépôt Git de l'équipe" "technique" "Sprint 0" Leana <<'EOF'
- [ ] Tous les membres invités comme collaborateurs
- [ ] `main` protégée : pas de push direct, 1 review obligatoire, CI obligatoire (`bash scripts/proteger-main.sh`)
- [ ] README qui explique comment lancer et tester
- [ ] Supprimer les branches mal nommées (`dev`, `US-03-Voir-le-détail-d'un-outil`, `US-18-Front`) une fois le socle mergé
EOF
issue "T-02 · Outillage qualité" "technique" "Sprint 0" Nesrine <<'EOF'
- [ ] `npm run lint`, `npm test` et `npm run check` fonctionnent dans `backend/`
- [ ] Un premier test passe (GET /health → 200)

Fait dans la PR du socle (`chore/socle-projet`) : à vérifier et valider.
EOF
issue "T-03 · Données de démo" "technique" "Sprint 0" Morgane <<'EOF'
- [ ] 4 voisins et 8 outils chargés au démarrage, dans au moins 3 catégories

Fait dans `backend/src/data/seed.js` : à vérifier et valider.
EOF
issue "T-04 · Intégration continue (bonus)" "technique" "Sprint 0" Vanessa <<'EOF'
- [ ] Une GitHub Action lance `npm run check` sur chaque pull request

Fait dans `.github/workflows/ci.yml` (API + front) : vérifier que l'Action est verte sur la PR du socle.
EOF

# ---------- Sprint 1 (PO Oussama, il ne code pas) ----------
issue "US-01 · Consulter le catalogue des outils" "story,Must" "Sprint 1" Vanessa <<'EOF'
**En tant que** voisin, **je veux** voir la liste des outils proposés **afin de** trouver celui dont j'ai besoin.

Valeur PO : 40 · Points : ? · Branche : `feature/US-01-catalogue`

## Critères d'acceptation
- [ ] GET /api/tools : pour chaque outil, nom, catégorie et statut (available, lent, unavailable)
- [ ] Les outils disponibles apparaissent en premier
- [ ] Aucun outil : liste vide (API) ou « Aucun outil pour le moment » (front)
EOF
issue "US-02 · Proposer un outil au prêt" "story,Must" "Sprint 1" Morgane <<'EOF'
**En tant que** propriétaire, **je veux** ajouter un outil **afin que** mes voisins puissent l'emprunter.

Valeur PO : 35 · Points : ? · Branche : `feature/US-02-proposer-outil`

## Critères d'acceptation
- [ ] POST /api/tools : nom obligatoire (2 à 60 caractères), catégorie dans la liste autorisée, description facultative (300 max)
- [ ] L'outil créé appartient à l'utilisateur courant (X-User-Id) et a le statut « available »
- [ ] Donnée invalide : 400 avec un message qui indique le champ en cause
EOF
issue "US-03 · Voir le détail d'un outil" "story,Must" "Sprint 1" Nesrine <<'EOF'
**En tant que** voisin, **je veux** voir la fiche d'un outil **afin de** décider si je l'emprunte.

Valeur PO : 20 · Points : ? · Branche : `feature/US-03-detail-outil`

## Critères d'acceptation
- [ ] GET /api/tools/:id : nom, catégorie, description, statut, prénom et quartier du propriétaire
- [ ] Identifiant inconnu : 404
EOF
issue "Front · Aligner l'interface sur l'énoncé" "front" "Sprint 1" Leana <<'EOF'
- [ ] Catégories de l'énoncé : Perçage, Jardinage, Peinture, Nettoyage, Mesure, Autre
- [ ] Retirer ce qui n'est pas dans le modèle de données (prix, note, distance) ou le garder en maquette
- [ ] Mettre à jour Next.js (la 16.4.2 a une faille de sécurité connue)
- [ ] Préparer le branchement sur l'API (GET /api/tools)
EOF

# ---------- Sprint 2 (PO Vanessa, elle ne code pas) ----------
issue "US-04 · Demander l'emprunt d'un outil" "story,Must" "Sprint 2" Oussama <<'EOF'
**En tant que** voisin, **je veux** demander l'emprunt d'un outil disponible pour des dates précises **afin de** faire mes travaux sans l'acheter.

Valeur PO : 50 · Points : ? · Branche : `feature/US-04-demande-emprunt`

## Critères d'acceptation
- [ ] Outil disponible + date de début et de fin : une demande « pending » est créée
- [ ] Date de fin antérieure à la date de début : 400
- [ ] Demander son propre outil : 400
- [ ] Plusieurs demandes en attente possibles pour le même outil
EOF
issue "US-05 · Accepter ou refuser une demande" "story,Must" "Sprint 2" Leana <<'EOF'
**En tant que** propriétaire, **je veux** accepter ou refuser une demande **afin de** garder la main sur mes outils.

Valeur PO : 45 · Points : ? · Branche : `feature/US-05-reponse-demande`

## Critères d'acceptation
- [ ] Seul le propriétaire peut répondre, sinon 403
- [ ] Demande acceptée : statut « accepted » et outil « lent »
- [ ] Demande refusée : statut « refused », l'outil ne change pas
- [ ] Réponse seulement à une demande « pending », sinon 409
EOF
issue "US-06 · Empêcher les emprunts qui se chevauchent" "story,Should" "Sprint 2" Nesrine <<'EOF'
**En tant que** propriétaire, **je veux** que deux prêts acceptés ne se chevauchent jamais **afin de** ne pas promettre le même outil à deux voisins.

Valeur PO : 30 · Points : ? · Branche : `feature/US-06-chevauchement`

## Critères d'acceptation
- [ ] Prêt accepté du 10 au 15, demande du 12 au 14 : 409
- [ ] Une demande qui commence le lendemain de la fin d'un prêt est acceptable
EOF
issue "US-07 · Déclarer le retour d'un outil" "story,Should" "Sprint 2" Morgane <<'EOF'
**En tant que** propriétaire, **je veux** déclarer qu'un outil m'a été rendu **afin qu'il** redevienne empruntable.

Valeur PO : 25 · Points : ? · Branche : `feature/US-07-retour`

## Critères d'acceptation
- [ ] Seul le propriétaire peut déclarer le retour, sinon 403
- [ ] Le prêt passe « returned » et l'outil redevient « available »
EOF

# ---------- Sprint 3 ----------
issue "US-08 · Voir mes emprunts" "story,Should" "Sprint 3" Oussama <<'EOF'
**En tant que** voisin, **je veux** voir mes demandes et mes emprunts **afin de** savoir ce que je dois rendre.

Valeur PO : 20 · Points : ? · Branche : `feature/US-08-mes-emprunts`

## Critères d'acceptation
- [ ] Mes demandes avec leur statut, triées par date de début
- [ ] Je ne vois que les miennes
EOF
issue "US-09 · Interface web du parcours d'emprunt" "story,Should,front" "Sprint 3" Leana <<'EOF'
**En tant que** voisin, **je veux** une interface web simple **afin de** ne pas utiliser d'outil technique pour emprunter.

Valeur PO : 40 · Points : ? · Branche : `feature/US-09-interface-web`

## Critères d'acceptation
- [ ] Depuis une page : je choisis mon profil, je vois le catalogue, j'ouvre une fiche et j'envoie une demande
- [ ] Les erreurs de l'API (400, 409...) sont affichées en clair
EOF
issue "US-10 · Filtrer le catalogue par catégorie" "story,Should" "Sprint 3" Vanessa <<'EOF'
**En tant que** voisin, **je veux** filtrer par catégorie **afin de** trouver plus vite un outil.

Valeur PO : 15 · Points : ? · Branche : `feature/US-10-filtre-categorie`

## Critères d'acceptation
- [ ] Le filtre ne renvoie que les outils de la catégorie choisie
- [ ] Catégorie inconnue : 400
EOF

# ---------- Backlog (Could) ----------
issue "US-11 · Rechercher un outil par mot-clé" "story,Could" "Backlog" Morgane <<'EOF'
Valeur PO : 15 · Points : ? · Branche : `feature/US-11-recherche`

- [ ] Recherche sur le nom et la description, sans tenir compte des majuscules
- [ ] Recherche sans résultat : liste vide
EOF
issue "US-12 · Voir mes outils et les demandes reçues" "story,Could" "Backlog" Nesrine <<'EOF'
Valeur PO : 15 · Points : ? · Branche : `feature/US-12-mes-outils`

- [ ] Mes outils et, pour chacun, le nombre de demandes en attente
EOF
issue "US-13 · Noter l'emprunteur après le retour" "story,Could" "Backlog" Vanessa <<'EOF'
Valeur PO : 10 · Points : ? · Branche : `feature/US-13-note`

- [ ] Note de 1 à 5, une seule par prêt, uniquement sur un prêt « returned »
EOF
issue "US-14 · Historique des prêts d'un outil" "story,Could" "Backlog" Oussama <<'EOF'
Valeur PO : 5 · Points : ? · Branche : `feature/US-14-historique`

- [ ] Prêts acceptés et rendus, du plus récent au plus ancien
EOF

echo "Terminé."
