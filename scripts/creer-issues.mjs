// Crée les labels, milestones et issues BricoLoop sur GitHub, sans doublon.
// Ferme les doublons éventuels (garde le plus ancien). Relançable sans risque.
// Prérequis : gh connecté avec un compte qui a les droits sur le repo.
// Usage : node scripts/creer-issues.mjs
import { spawnSync } from 'node:child_process';

const REPO = 'valdis7/Atelier_Scrum';

const LOGIN = {
  Oussama: 'Ouss-M11',
  Leana: 'valdis7',
  Nesrine: 'nesrineben340-cyber',
  Morgane: 'x0m1dn8',
  Vanessa: 'VanessAL14',
};

const LABELS = [
  ['story', '1d76db', 'User story du backlog'],
  ['technique', '5319e7', 'Story technique / socle'],
  ['Must', 'b60205', 'Indispensable à la vidéo'],
  ['Should', 'fbca04', 'Important'],
  ['Could', '0e8a16', 'Si le temps le permet'],
  ['front', 'c5def5', 'Interface web'],
  ['bug', 'd73a4a', 'Bug'],
];

const MILESTONES = [
  ['Sprint 0', 'Socle technique (T-01 à T-04)'],
  ['Sprint 1', 'PO : Oussama'],
  ['Sprint 2', 'PO : Vanessa'],
  ['Sprint 3', 'PO : à définir'],
  ['Backlog', 'Stories non planifiées'],
];

const ISSUES = [
  {
    "title": "T-01 · Dépôt Git de l'équipe",
    "labels": [
      "technique"
    ],
    "milestone": "Sprint 0",
    "member": "Leana",
    "body": "- [ ] Tous les membres invités comme collaborateurs\n- [ ] `main` protégée : pas de push direct, 1 review obligatoire, CI obligatoire (`bash scripts/proteger-main.sh`)\n- [ ] README qui explique comment lancer et tester\n- [ ] Supprimer les branches mal nommées (`dev`, `US-03-Voir-le-détail-d'un-outil`, `US-18-Front`) une fois le socle mergé"
  },
  {
    "title": "T-02 · Outillage qualité",
    "labels": [
      "technique"
    ],
    "milestone": "Sprint 0",
    "member": "Nesrine",
    "body": "- [ ] `npm run lint`, `npm test` et `npm run check` fonctionnent dans `backend/`\n- [ ] Un premier test passe (GET /health → 200)\n\nFait dans la PR du socle (`chore/socle-projet`) : à vérifier et valider."
  },
  {
    "title": "T-03 · Données de démo",
    "labels": [
      "technique"
    ],
    "milestone": "Sprint 0",
    "member": "Morgane",
    "body": "- [ ] 4 voisins et 8 outils chargés au démarrage, dans au moins 3 catégories\n\nFait dans `backend/src/data/seed.js` : à vérifier et valider."
  },
  {
    "title": "T-04 · Intégration continue (bonus)",
    "labels": [
      "technique"
    ],
    "milestone": "Sprint 0",
    "member": "Vanessa",
    "body": "- [ ] Une GitHub Action lance `npm run check` sur chaque pull request\n\nFait dans `.github/workflows/ci.yml` (API + front) : vérifier que l'Action est verte sur la PR du socle."
  },
  {
    "title": "US-01 · Consulter le catalogue des outils",
    "labels": [
      "story",
      "Must"
    ],
    "milestone": "Sprint 1",
    "member": "Vanessa",
    "body": "**En tant que** voisin, **je veux** voir la liste des outils proposés **afin de** trouver celui dont j'ai besoin.\n\nValeur PO : 40 · Points : ? · Branche : `feature/US-01-catalogue`\n\n## Critères d'acceptation\n- [ ] GET /api/tools : pour chaque outil, nom, catégorie et statut (available, lent, unavailable)\n- [ ] Les outils disponibles apparaissent en premier\n- [ ] Aucun outil : liste vide (API) ou « Aucun outil pour le moment » (front)"
  },
  {
    "title": "US-02 · Proposer un outil au prêt",
    "labels": [
      "story",
      "Must"
    ],
    "milestone": "Sprint 1",
    "member": "Morgane",
    "body": "**En tant que** propriétaire, **je veux** ajouter un outil **afin que** mes voisins puissent l'emprunter.\n\nValeur PO : 35 · Points : ? · Branche : `feature/US-02-proposer-outil`\n\n## Critères d'acceptation\n- [ ] POST /api/tools : nom obligatoire (2 à 60 caractères), catégorie dans la liste autorisée, description facultative (300 max)\n- [ ] L'outil créé appartient à l'utilisateur courant (X-User-Id) et a le statut « available »\n- [ ] Donnée invalide : 400 avec un message qui indique le champ en cause"
  },
  {
    "title": "US-03 · Voir le détail d'un outil",
    "labels": [
      "story",
      "Must"
    ],
    "milestone": "Sprint 1",
    "member": "Nesrine",
    "body": "**En tant que** voisin, **je veux** voir la fiche d'un outil **afin de** décider si je l'emprunte.\n\nValeur PO : 20 · Points : ? · Branche : `feature/US-03-detail-outil`\n\n## Critères d'acceptation\n- [ ] GET /api/tools/:id : nom, catégorie, description, statut, prénom et quartier du propriétaire\n- [ ] Identifiant inconnu : 404"
  },
  {
    "title": "Front · Aligner l'interface sur l'énoncé",
    "labels": [
      "front"
    ],
    "milestone": "Sprint 1",
    "member": "Leana",
    "body": "- [ ] Catégories de l'énoncé : Perçage, Jardinage, Peinture, Nettoyage, Mesure, Autre\n- [ ] Retirer ce qui n'est pas dans le modèle de données (prix, note, distance) ou le garder en maquette\n- [ ] Mettre à jour Next.js (la 16.4.2 a une faille de sécurité connue)\n- [ ] Préparer le branchement sur l'API (GET /api/tools)"
  },
  {
    "title": "US-04 · Demander l'emprunt d'un outil",
    "labels": [
      "story",
      "Must"
    ],
    "milestone": "Sprint 2",
    "member": "Oussama",
    "body": "**En tant que** voisin, **je veux** demander l'emprunt d'un outil disponible pour des dates précises **afin de** faire mes travaux sans l'acheter.\n\nValeur PO : 50 · Points : ? · Branche : `feature/US-04-demande-emprunt`\n\n## Critères d'acceptation\n- [ ] Outil disponible + date de début et de fin : une demande « pending » est créée\n- [ ] Date de fin antérieure à la date de début : 400\n- [ ] Demander son propre outil : 400\n- [ ] Plusieurs demandes en attente possibles pour le même outil"
  },
  {
    "title": "US-05 · Accepter ou refuser une demande",
    "labels": [
      "story",
      "Must"
    ],
    "milestone": "Sprint 2",
    "member": "Leana",
    "body": "**En tant que** propriétaire, **je veux** accepter ou refuser une demande **afin de** garder la main sur mes outils.\n\nValeur PO : 45 · Points : ? · Branche : `feature/US-05-reponse-demande`\n\n## Critères d'acceptation\n- [ ] Seul le propriétaire peut répondre, sinon 403\n- [ ] Demande acceptée : statut « accepted » et outil « lent »\n- [ ] Demande refusée : statut « refused », l'outil ne change pas\n- [ ] Réponse seulement à une demande « pending », sinon 409"
  },
  {
    "title": "US-06 · Empêcher les emprunts qui se chevauchent",
    "labels": [
      "story",
      "Should"
    ],
    "milestone": "Sprint 2",
    "member": "Nesrine",
    "body": "**En tant que** propriétaire, **je veux** que deux prêts acceptés ne se chevauchent jamais **afin de** ne pas promettre le même outil à deux voisins.\n\nValeur PO : 30 · Points : ? · Branche : `feature/US-06-chevauchement`\n\n## Critères d'acceptation\n- [ ] Prêt accepté du 10 au 15, demande du 12 au 14 : 409\n- [ ] Une demande qui commence le lendemain de la fin d'un prêt est acceptable"
  },
  {
    "title": "US-07 · Déclarer le retour d'un outil",
    "labels": [
      "story",
      "Should"
    ],
    "milestone": "Sprint 2",
    "member": "Morgane",
    "body": "**En tant que** propriétaire, **je veux** déclarer qu'un outil m'a été rendu **afin qu'il** redevienne empruntable.\n\nValeur PO : 25 · Points : ? · Branche : `feature/US-07-retour`\n\n## Critères d'acceptation\n- [ ] Seul le propriétaire peut déclarer le retour, sinon 403\n- [ ] Le prêt passe « returned » et l'outil redevient « available »"
  },
  {
    "title": "US-08 · Voir mes emprunts",
    "labels": [
      "story",
      "Should"
    ],
    "milestone": "Sprint 3",
    "member": "Oussama",
    "body": "**En tant que** voisin, **je veux** voir mes demandes et mes emprunts **afin de** savoir ce que je dois rendre.\n\nValeur PO : 20 · Points : ? · Branche : `feature/US-08-mes-emprunts`\n\n## Critères d'acceptation\n- [ ] Mes demandes avec leur statut, triées par date de début\n- [ ] Je ne vois que les miennes"
  },
  {
    "title": "US-09 · Interface web du parcours d'emprunt",
    "labels": [
      "story",
      "Should",
      "front"
    ],
    "milestone": "Sprint 3",
    "member": "Leana",
    "body": "**En tant que** voisin, **je veux** une interface web simple **afin de** ne pas utiliser d'outil technique pour emprunter.\n\nValeur PO : 40 · Points : ? · Branche : `feature/US-09-interface-web`\n\n## Critères d'acceptation\n- [ ] Depuis une page : je choisis mon profil, je vois le catalogue, j'ouvre une fiche et j'envoie une demande\n- [ ] Les erreurs de l'API (400, 409...) sont affichées en clair"
  },
  {
    "title": "US-10 · Filtrer le catalogue par catégorie",
    "labels": [
      "story",
      "Should"
    ],
    "milestone": "Sprint 3",
    "member": "Vanessa",
    "body": "**En tant que** voisin, **je veux** filtrer par catégorie **afin de** trouver plus vite un outil.\n\nValeur PO : 15 · Points : ? · Branche : `feature/US-10-filtre-categorie`\n\n## Critères d'acceptation\n- [ ] Le filtre ne renvoie que les outils de la catégorie choisie\n- [ ] Catégorie inconnue : 400"
  },
  {
    "title": "US-11 · Rechercher un outil par mot-clé",
    "labels": [
      "story",
      "Could"
    ],
    "milestone": "Backlog",
    "member": "Morgane",
    "body": "Valeur PO : 15 · Points : ? · Branche : `feature/US-11-recherche`\n\n- [ ] Recherche sur le nom et la description, sans tenir compte des majuscules\n- [ ] Recherche sans résultat : liste vide"
  },
  {
    "title": "US-12 · Voir mes outils et les demandes reçues",
    "labels": [
      "story",
      "Could"
    ],
    "milestone": "Backlog",
    "member": "Nesrine",
    "body": "Valeur PO : 15 · Points : ? · Branche : `feature/US-12-mes-outils`\n\n- [ ] Mes outils et, pour chacun, le nombre de demandes en attente"
  },
  {
    "title": "US-13 · Noter l'emprunteur après le retour",
    "labels": [
      "story",
      "Could"
    ],
    "milestone": "Backlog",
    "member": "Vanessa",
    "body": "Valeur PO : 10 · Points : ? · Branche : `feature/US-13-note`\n\n- [ ] Note de 1 à 5, une seule par prêt, uniquement sur un prêt « returned »"
  },
  {
    "title": "US-14 · Historique des prêts d'un outil",
    "labels": [
      "story",
      "Could"
    ],
    "milestone": "Backlog",
    "member": "Oussama",
    "body": "Valeur PO : 5 · Points : ? · Branche : `feature/US-14-historique`\n\n- [ ] Prêts acceptés et rendus, du plus récent au plus ancien"
  }
];

function gh(args, input) {
  const r = spawnSync('gh', args, { input, encoding: 'utf8', shell: false });
  if (r.error) throw r.error;
  return { ok: r.status === 0, out: r.stdout ?? '', err: r.stderr ?? '' };
}
function ghOrDie(args, input) {
  const r = gh(args, input);
  if (!r.ok) { console.error(`Erreur gh ${args.slice(0, 3).join(' ')} :\n${r.err}`); process.exit(1); }
  return r.out;
}
const api = (path, method = 'GET', body) =>
  ghOrDie(['api', '-X', method, path, ...(body ? ['--input', '-'] : [])], body ? JSON.stringify(body) : undefined);
const lines = (out) => out.split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));

console.log('Labels...');
for (const [name, color, description] of LABELS) {
  ghOrDie(['label', 'create', name, '--color', color, '--description', description, '-R', REPO, '--force']);
}

console.log('Milestones...');
const msNum = {};
for (const m of lines(ghOrDie(['api', `repos/${REPO}/milestones?state=all&per_page=100`, '--jq', '.[] | {title, number} | tojson']))) {
  msNum[m.title] = m.number;
}
for (const [title, description] of MILESTONES) {
  if (!msNum[title]) msNum[title] = JSON.parse(api(`repos/${REPO}/milestones`, 'POST', { title, description })).number;
}

console.log('Issues existantes...');
const existing = lines(ghOrDie([
  'api', '--paginate', `repos/${REPO}/issues?state=all&per_page=100`,
  '--jq', '.[] | select(.pull_request == null) | {number, title, state} | tojson',
])).sort((a, b) => a.number - b.number);

// Doublons : on garde la plus ancienne ouverte, on ferme les autres.
const keep = new Map();
for (const is of existing) {
  if (is.state !== 'open') continue;
  if (!keep.has(is.title)) { keep.set(is.title, is.number); continue; }
  api(`repos/${REPO}/issues/${is.number}`, 'PATCH', { state: 'closed', state_reason: 'not_planned' });
  console.log(`Doublon fermé : #${is.number} ${is.title} (gardé #${keep.get(is.title)})`);
}

console.log('Création...');
for (const it of ISSUES) {
  if (keep.has(it.title)) { console.log(`Déjà là : #${keep.get(it.title)} ${it.title}`); continue; }
  const base = { title: it.title, body: it.body, labels: it.labels, milestone: msNum[it.milestone] };
  const login = LOGIN[it.member];
  let r = login ? gh(['api', '-X', 'POST', `repos/${REPO}/issues`, '--input', '-'], JSON.stringify({ ...base, assignees: [login] })) : { ok: false };
  if (!r.ok) {
    const body = `${it.body}\n\nResponsable prévu : ${it.member}`;
    r = { ok: true, out: api(`repos/${REPO}/issues`, 'POST', { ...base, body }) };
  }
  const created = JSON.parse(r.out);
  console.log(`Créée : #${created.number} ${it.title}${created.assignees?.length ? ' -> ' + created.assignees[0].login : ' (sans assignation)'}`);
}
console.log('Terminé.');
