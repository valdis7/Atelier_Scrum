"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

const categories = [
  { name: "Tout voir", emoji: "✨" },
  { name: "Bricolage", emoji: "🔧" },
  { name: "Jardin", emoji: "🌿" },
  { name: "Maison", emoji: "🪜" },
  { name: "Festivité", emoji: "🎉" },
];

const tools = [
  {
    id: 1,
    name: "Perceuse-visseuse Bosch",
    category: "Bricolage",
    price: 5,
    owner: "Camille",
    initials: "C",
    location: "Paris 11e",
    distance: "à 350 m",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Outils de bricolage prêts à l'emploi",
    color: "sage",
  },
  {
    id: 2,
    name: "Taille-haie électrique",
    category: "Jardin",
    price: 8,
    owner: "Thomas",
    initials: "T",
    location: "Paris 11e",
    distance: "à 600 m",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Jardin verdoyant à entretenir",
    color: "peach",
  },
  {
    id: 3,
    name: "Ponceuse excentrique",
    category: "Bricolage",
    price: 6,
    owner: "Inès",
    initials: "I",
    location: "Paris 10e",
    distance: "à 1,2 km",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Équipement et outils dans un atelier",
    color: "yellow",
  },
  {
    id: 4,
    name: "Escabeau 5 marches",
    category: "Maison",
    price: 4,
    owner: "Mehdi",
    initials: "M",
    location: "Paris 11e",
    distance: "à 800 m",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Matériel pour les petits travaux de la maison",
    color: "blue",
  },
];

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

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M16.25 8.333c0 4.583-6.25 9.167-6.25 9.167S3.75 12.916 3.75 8.333a6.25 6.25 0 1 1 12.5 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="8.333" r="2.083" stroke="currentColor" strokeWidth="1.5" />
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
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState({ query: "", location: "" });
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = search.query.trim().toLocaleLowerCase("fr");
    const normalizedLocation = search.location.trim().toLocaleLowerCase("fr");

    return tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "Tout voir" || tool.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${tool.name} ${tool.category} ${tool.owner}`
          .toLocaleLowerCase("fr")
          .includes(normalizedQuery);
      const matchesLocation =
        !normalizedLocation ||
        tool.location.toLocaleLowerCase("fr").includes(normalizedLocation);

      return matchesCategory && matchesQuery && matchesLocation;
    });
  }, [activeCategory, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch({ query, location });
    document.getElementById("outils")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleFavorite(id: number) {
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
          <a className="login-link" href="#connexion">Se connecter</a>
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
                placeholder="Un outil, un projet..."
              />
            </label>
            <span className="search-divider" />
            <label className="search-field search-field-location">
              <PinIcon />
              <span className="sr-only">Votre quartier</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Votre quartier"
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

        {filteredTools.length > 0 ? (
          <div className="tool-grid">
            {filteredTools.map((tool) => {
              const isFavorite = favorites.includes(tool.id);

              return (
                <article className="tool-card" key={tool.id}>
                  <div
                    className={`tool-image ${tool.color}`}
                    role="img"
                    aria-label={tool.imageAlt}
                    style={{ backgroundImage: `url("${tool.image}")` }}
                  >
                    <span className="available-tag"><span /> Disponible</span>
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
                      <span className="rating"><span>★</span> {tool.rating}</span>
                    </div>
                    <p className="tool-location"><PinIcon /> {tool.location} <span>· {tool.distance}</span></p>
                    <div className="tool-card-footer">
                      <div className="owner">
                        <span className={`owner-avatar owner-${tool.initials.toLowerCase()}`}>{tool.initials}</span>
                        <span>Prêté par <strong>{tool.owner}</strong></span>
                      </div>
                      <p className="tool-price"><strong>{tool.price}€</strong><span> / jour</span></p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">🔎</span>
            <h3>Pas encore d’outil par ici</h3>
            <p>Essayez un autre mot-clé ou un quartier voisin.</p>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                setQuery("");
                setLocation("");
                setSearch({ query: "", location: "" });
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
