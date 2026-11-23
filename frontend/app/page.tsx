"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ToolPanel } from "./tool-panel";

type ToolStatus = "available" | "lent" | "unavailable";

type Tool = {
  id: string;
  name: string;
  category: string;
  status: ToolStatus;
};

// Catégories autorisées par l'énoncé.
const categories = [
  { name: "Tout voir", emoji: "✨" },
  { name: "Perçage", emoji: "🔩" },
  { name: "Jardinage", emoji: "🌿" },
  { name: "Peinture", emoji: "🎨" },
  { name: "Nettoyage", emoji: "🧽" },
  { name: "Mesure", emoji: "📏" },
  { name: "Autre", emoji: "🧰" },
];

const statusLabel: Record<ToolStatus, string> = {
  available: "Disponible",
  lent: "Prêté",
  unavailable: "Indisponible",
};

// Visuel d'illustration par catégorie (le modèle de données n'a pas de photo).
const categoryVisual: Record<string, { image: string; color: string }> = {
  Perçage: { image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=85", color: "sage" },
  Jardinage: { image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85", color: "peach" },
  Peinture: { image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=85", color: "yellow" },
  Nettoyage: { image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85", color: "blue" },
};
const defaultVisual = categoryVisual["Perçage"];

function ArrowRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
      <path
        d="M17.083 7.083c0 4.167-7.083 9.167-7.083 9.167S2.917 11.25 2.917 7.083a3.75 3.75 0 0 1 7.083-1.667 3.75 3.75 0 0 1 7.083 1.667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <circle cx="8.75" cy="8.75" r="5.417" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12.708 12.708 4.167 4.167" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Tout voir");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "error">("loading");
  const [users, setUsers] = useState<{ id: string; firstName: string; district: string }[]>([]);
  const [userId, setUserId] = useState("");
  const [openToolId, setOpenToolId] = useState<string | null>(null);

  // Profils pour choisir l'utilisateur courant (US-09 : GET /api/users).
  useEffect(() => {
    fetch("/api/users")
      .then((res) => (res.ok ? res.json() : []))
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  // Catalogue chargé depuis l'API (US-01 : GET /api/tools).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/tools")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Tool[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setTools(data);
          setLoadState("ok");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTools = useMemo(() => {
    const normalizedQuery = search.trim().toLocaleLowerCase("fr");

    return tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "Tout voir" || tool.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${tool.name} ${tool.category}`.toLocaleLowerCase("fr").includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [tools, activeCategory, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(query);
    document.getElementById("outils")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="BricoLoop, accueil">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M8.1 17.5c0-5.1 4.1-9.2 9.2-9.2h5.3M23.9 14.5c0 5.1-4.1 9.2-9.2 9.2H9.4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="m19.5 5.7 4 2.6-4 2.6M12.5 26.3l-4-2.6 4-2.6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>brico<span className="brand-loop">loop</span></span>
        </a>

        <nav className="main-nav" aria-label="Navigation principale">
          <a href="#outils">Les outils</a>
          <a href="#comment-ca-marche">Comment ça marche</a>
          <a href="#engagements">Notre idée</a>
        </nav>

        <div className="header-actions">
          <label className="profile-select">
            <span className="sr-only">Votre profil</span>
            <select value={userId} onChange={(event) => setUserId(event.target.value)}>
              <option value="">Choisir mon profil</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} ({user.district})
                </option>
              ))}
            </select>
          </label>
          <a className="button button-dark button-small" href="#proposer">
            Prêter un outil <ArrowRight />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            LE BON OUTIL, AU BON ENDROIT
          </div>
          <h1>
            Les bons outils
            <br />
            sont <span>juste à côté.</span>
          </h1>
          <p className="hero-description">
            Pourquoi acheter ce qu’on peut emprunter ? Trouvez l’outil qu’il
            vous faut chez vos voisins, et faites vivre votre quartier.
          </p>

          <form className="search-panel" onSubmit={handleSearch}>
            <label className="search-field search-field-tool">
              <SearchIcon />
              <span className="sr-only">Quel outil recherchez-vous ?</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Une perceuse, une ponceuse..."
              />
            </label>
            <button className="search-submit" type="submit" aria-label="Rechercher">
              <SearchIcon />
            </button>
          </form>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span className="avatar avatar-one">A</span>
              <span className="avatar avatar-two">L</span>
              <span className="avatar avatar-three">M</span>
              <span className="avatar avatar-four">+</span>
            </div>
            <span>
              <strong>Déjà 1 200+</strong> voisins se rendent service
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Des outils et un jardin à portée de main">
          <div className="hero-photo" />
          <div className="hero-sticker">
            <span className="sticker-icon">↗</span>
            <span>Moins d’achats,<br /><strong>plus de partage.</strong></span>
          </div>
          <div className="hero-note">
            <span className="note-dot" />
            <span><strong>À deux pas</strong><br />de chez vous</span>
          </div>
          <span className="hero-sparkle sparkle-one" aria-hidden="true">✳</span>
          <span className="hero-sparkle sparkle-two" aria-hidden="true">✳</span>
        </div>

        <div className="hero-bottom">
          <span>UN PETIT GESTE, UN GRAND COUP DE MAIN</span>
          <a href="#outils">Explorer les outils <ArrowRight /></a>
        </div>
      </section>

      <section className="tools-section" id="outils">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" />PRÈS DE CHEZ VOUS</div>
            <h2>Ça se trouve <span>au coin de la rue.</span></h2>
            <p>Des outils disponibles autour de vous, partagés par vos voisins.</p>
          </div>
          <a className="text-link" href="#outils">Voir tous les outils <ArrowRight /></a>
        </div>

        <div className="category-list" aria-label="Filtrer par catégorie">
          {categories.map((category) => (
            <button
              className={`category-chip${activeCategory === category.name ? " active" : ""}`}
              key={category.name}
              type="button"
              aria-pressed={activeCategory === category.name}
              onClick={() => setActiveCategory(category.name)}
            >
              <span aria-hidden="true">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {loadState === "loading" && (
          <div className="empty-state">
            <span aria-hidden="true">⏳</span>
            <h3>Chargement du catalogue...</h3>
          </div>
        )}

        {loadState === "error" && (
          <div className="empty-state">
            <span aria-hidden="true">🔌</span>
            <h3>Le catalogue est injoignable</h3>
            <p>Vérifiez que l’API tourne (cd backend, puis npm start).</p>
          </div>
        )}

        {loadState === "ok" && tools.length === 0 && (
          <div className="empty-state">
            <span aria-hidden="true">🧰</span>
            <h3>Aucun outil pour le moment</h3>
          </div>
        )}

        {loadState === "ok" && tools.length > 0 && filteredTools.length > 0 && (
          <div className="tool-grid">
            {filteredTools.map((tool) => {
              const isFavorite = favorites.includes(tool.id);
              const visual = categoryVisual[tool.category] ?? defaultVisual;

              return (
                <article className="tool-card" key={tool.id}>
                  <div
                    className={`tool-image ${visual.color}`}
                    role="img"
                    aria-label={`Illustration ${tool.category}`}
                    style={{ backgroundImage: `url("${visual.image}")` }}
                  >
                    <span className={`available-tag status-${tool.status}`}><span /> {statusLabel[tool.status]}</span>
                    <button
                      className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
                      type="button"
                      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(tool.id)}
                    >
                      <HeartIcon filled={isFavorite} />
                    </button>
                  </div>
                  <div className="tool-details">
                    <div className="tool-title-row">
                      <h3>{tool.name}</h3>
                    </div>
                    <p className="tool-location">{tool.category}</p>
                    <button className="text-link" type="button" onClick={() => setOpenToolId(tool.id)}>
                      Voir la fiche <ArrowRight />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {loadState === "ok" && tools.length > 0 && filteredTools.length === 0 && (
          <div className="empty-state">
            <span aria-hidden="true">🔎</span>
            <h3>Pas d’outil pour cette recherche</h3>
            <p>Essayez un autre mot-clé ou une autre catégorie.</p>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                setQuery("");
                setSearch("");
                setActiveCategory("Tout voir");
              }}
            >
              Réinitialiser la recherche <ArrowRight />
            </button>
          </div>
        )}

        <div className="browse-more">
          <a className="button button-outline" href="#outils">Découvrir tous les outils <ArrowRight /></a>
          <span>Des centaines d’objets n’attendent que vous.</span>
        </div>
      </section>

      <section className="how-section" id="comment-ca-marche">
        <div className="how-intro">
          <div className="eyebrow"><span className="eyebrow-dot" />SIMPLE COMME BONJOUR</div>
          <h2>Un coup de main<br />en <span>3 étapes.</span></h2>
          <p>Un outil, un voisin, et votre projet peut commencer.</p>
          <a className="button button-dark" href="#outils">Trouver mon outil <ArrowRight /></a>
        </div>
        <div className="steps">
          <article className="step-card">
            <span className="step-number">01</span>
            <span className="step-emoji" aria-hidden="true">🔍</span>
            <h3>Trouvez</h3>
            <p>Parcourez les outils disponibles dans votre quartier.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <span className="step-emoji" aria-hidden="true">👋</span>
            <h3>Rencontrez</h3>
            <p>Échangez avec votre voisin et convenez d’un moment.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <span className="step-emoji" aria-hidden="true">🛠️</span>
            <h3>Réalisez</h3>
            <p>Votre projet avance, sans acheter un outil de plus.</p>
          </article>
        </div>
      </section>

      <section className="impact-section" id="engagements">
        <div className="impact-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />ENSEMBLE, ON FAIT MIEUX</div>
          <h2>Le partage, ça<br />fait du <span>bien.</span></h2>
          <p>
            Moins d’objets qui dorment au garage, moins de ressources
            consommées, et plus de liens entre voisins. C’est ça, l’esprit
            BricoLoop.
          </p>
          <div className="impact-stats">
            <div><strong>2 400<span>+</span></strong><small>objets partagés</small></div>
            <span className="stat-separator" />
            <div><strong>8<span> t</span></strong><small>de CO₂ économisées</small></div>
          </div>
        </div>
        <div className="impact-visual">
          <div className="impact-photo" />
          <div className="impact-caption">
            <span className="caption-icon">🌱</span>
            <span><strong>La bonne idée du quartier</strong><br />Emprunter plutôt qu’acheter.</span>
          </div>
        </div>
      </section>

      <section className="join-section" id="proposer">
        <div className="join-decoration" aria-hidden="true">✳</div>
        <div className="eyebrow"><span className="eyebrow-dot" />ET SI ON S’Y METTAIT ?</div>
        <h2>Votre garage a peut-être<br />le prochain <span>coup de cœur.</span></h2>
        <p>Un outil qui ne sert plus ? Il peut rendre service juste à côté.</p>
        <a className="button button-light" href="mailto:bonjour@bricoloop.fr">
          Prêter mon premier outil <ArrowRight />
        </a>
      </section>

      {openToolId && (
        <ToolPanel toolId={openToolId} userId={userId} onClose={() => setOpenToolId(null)} />
      )}

      <footer className="site-footer" id="connexion">
        <a className="brand footer-brand" href="#" aria-label="BricoLoop, accueil">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M8.1 17.5c0-5.1 4.1-9.2 9.2-9.2h5.3M23.9 14.5c0 5.1-4.1 9.2-9.2 9.2H9.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="m19.5 5.7 4 2.6-4 2.6M12.5 26.3l-4-2.6 4-2.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>brico<span className="brand-loop">loop</span></span>
        </a>
        <p>Les voisins ont de bonnes idées.</p>
        <span className="footer-copyright">© 2026 BricoLoop · Fait avec soin, près de chez vous.</span>
      </footer>
    </main>
  );
}
