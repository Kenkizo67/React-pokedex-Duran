import { useCallback, useEffect, useMemo,useRef, useState } from "react";
import { fetchPokemonIndex, fetchTypeMap } from "./api.js";
import { GENERATIONS, TYPES, TYPE_COLORS } from "./constants.js";
import { readableInk } from "./utils.js";
import PokemonCard from "./components/PokemonCard.jsx";
import PokemonModal from "./components/PokemonDetails.jsx";

const FAVORITES_KEY = "pokedex:favorites";

function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [status, setStatus] = useState("loading");
  const [typeMap, setTypeMap] = useState({});
  const [typesReady, setTypesReady] = useState(false);

  const [query, setQuery] = useState("");
  const [gen, setGen] = useState(0);
  const [types, setTypes] = useState(() => new Set());
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dropdownRef = useRef(null);

  const load = useCallback(() => {
    setStatus("loading");
    fetchPokemonIndex()
      .then((list) => {
        setPokemon(list);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    fetchTypeMap()
      .then((map) => {
        setTypeMap(map);
        setTypesReady(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch {
    }
  }, [favorites]);
  useEffect(() => {
    if(!filtersOpen) return;
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setFiltersOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("mousedown",onPointerDown);
    document.addEventListener("keydown",onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onkey);
    };
  }, [filtersOpen]);

  const toggleFavorite = useCallback((t) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const toggleType = useCallback((t) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "");
    const range = GENERATIONS.find((g) => g.id === gen);
    const isNumber = /^\d+$/.test(q);
    return pokemon.filter((p) => {
      if (range && (p.id < range.from || p.id > range.to)) return false;
      if (types.size && ![...types].every((t) => typeMap[p.id]?.includes(t))) return false;
      if (onlyFavs && !favorites.has(p.id)) return false;
      if (!q) return true;
      return isNumber
        ? String(p.id).startsWith(String(Number(q)))
        : p.label.toLowerCase().includes(q);
    });
  }, [pokemon, typeMap, query, gen, types, onlyFavs, favorites]);

  const close = useCallback(() => setSelectedId(null), []);

  const selected = selectedId ? pokemon.find((p) => p.id === selectedId) : null;
  let prev = null;
  let next = null;
  if (selected) {
    const list = visible.some((p) => p.id === selected.id) ? visible : pokemon;
    const pos = list.findIndex((p) => p.id === selected.id);
    prev = list[pos - 1] ?? null;
    next = list[pos + 1] ?? null;
  }

  const hasFilters = query || gen || types.size > 0 || onlyFavs;
  const clearFilters = () => {
    setQuery("");
    setGen(0);
    setTypes(new Set());
    setOnlyFavs(false);
  };

  return (
    <div className="dex">
      <header className="brand">
        <div className="lens" aria-hidden="true" />
        <div>
          <h1>Pokédex</h1>
          <p>Generations I to IV, 1025 Pokémon</p>
        </div>
      </header>

      <main className="screen">
        <div className="searchbar">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or number"
            aria-label="Search Pokémon by name or number"
          />
          <button
            className="btn"
            aria-pressed={onlyFavs}
            onClick={() => setOnlyFavs((v) => !v)}
          >
            ★ Saved{favorites.size ? ` (${favorites.size})` : ""}
          </button>
        </div>

        <section className="filters" aria-label="Filters">
          <div className="gens">
            <button
              className="gen"
              aria-pressed={gen === 0}
              onClick={() => setGen(0)}
            >
              <span>All</span>
              <small>I–VI</small>
            </button>
            {GENERATIONS.map((g) => (
              <button
                key={g.id}
                className="gen"
                aria-pressed={gen === g.id}
                onClick={() => setGen(gen === g.id ? 0 : g.id)}
              >
                <span>{g.label}</span>
                <small>{g.region}</small>
              </button>
            ))}
          </div>

          <div className="types" role="group" aria-label="Filter by type">
            {TYPES.map((t) => (
              <button
                key={t}
                className="chip"
                style={{
                  "--c": TYPE_COLORS[t],
                  "--chip-ink": readableInk(TYPE_COLORS[t]),
                }}
                aria-pressed={types.has(t)}
                disabled={!typesReady}
                onClick={() => toggleType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {status === "loading" && (
          <div className="state">
            <p>Loading the Pokédex…</p>
          </div>
        )}

        {status === "error" && (
          <div className="state">
            <p>Couldn't reach PokéAPI. Check your connection and try again.</p>
            <button className="btn" onClick={load}>
              Try again
            </button>
          </div>
        )}

        {status === "ready" && (
          <>
            <p className="count" aria-live="polite">
              Showing {visible.length} of {pokemon.length}
            </p>

            {visible.length > 0 ? (
              <ul className="grid">
                {visible.map((p) => (
                  <li key={p.id}>
                    <PokemonCard
                      pokemon={p}
                      types={typeMap[p.id]}
                      isFavorite={favorites.has(p.id)}
                      onOpen={setSelectedId}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="state">
                <p>
                  {onlyFavs && favorites.size === 0
                    ? "No saved Pokémon yet. Open an entry and choose Save."
                    : "No Pokémon match these filters."}
                </p>
                {hasFilters && (
                  <button className="btn" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <PokemonModal
          key="modal"
          pokemon={selected}
          types={typeMap[selected.id]}
          isFavorite={favorites.has(selected.id)}
          onToggleFavorite={toggleFavorite}
          onClose={close}
          onPrev={prev ? () => setSelectedId(prev.id) : null}
          onNext={next ? () => setSelectedId(next.id) : null}
          onSelect={setSelectedId}
        />
      )}
    </div>
  );
}
