import { Fragment, useEffect, useRef, useState } from "react";
import { fetchDetails } from "../api.js";
import { STAT_LABELS, TYPE_COLORS } from "../constants.js";
import { artworkUrl, formatNo, spriteUrl, titleCase } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";

export default function PokemonModal({
  pokemon,
  types,
  isFavorite,
  onToggleFavorite,
  onClose,
  onPrev,
  onNext,
  onSelect,
}) {
  const [state, setState] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);
  const closeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null });
    fetchDetails(pokemon.id)
      .then((data) => !cancelled && setState({ status: "ready", data }))
      .catch(() => !cancelled && setState({ status: "error", data: null }));
    return () => {
      cancelled = true;
    };
  }, [pokemon.id, attempt]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const { data } = state;
  const shownTypes = data
    ? data.pokemon.types.map((t) => t.type.name)
    : types ?? [];
  const tint = TYPE_COLORS[shownTypes[0]] ?? "#9aa8a0";
  const total = data
    ? data.pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)
    : 0;

  return (
    <div
      className="scrim"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <article
        className="sheet"
        style={{ "--tint": tint }}
        role="dialog"
        aria-modal="true"
        aria-label={pokemon.label}
      >
        <div className="sheet-art">
          <img src={artworkUrl(pokemon.id)} alt={pokemon.label} />
          <div className="sheet-nav">
            <button className="btn" onClick={onPrev} disabled={!onPrev}>
              Previous
            </button>
            <button className="btn" onClick={onNext} disabled={!onNext}>
              Next
            </button>
          </div>
        </div>

        <div className="sheet-body">
          <div className="sheet-head">
            <div>
              <p className="sheet-no">#{formatNo(pokemon.id)}</p>
              <h2>{pokemon.label}</h2>
              {data?.genus && <p className="genus">{data.genus}</p>}
              <div className="sheet-types">
                {shownTypes.map((t) => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
            </div>
            <div className="sheet-actions">
              <button
                className="btn"
                aria-pressed={isFavorite}
                onClick={() => onToggleFavorite(pokemon.id)}
              >
                {isFavorite ? "★ Saved" : "☆ Save"}
              </button>
              <button
                ref={closeRef}
                className="btn"
                onClick={onClose}
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>

          {state.status === "loading" && <p className="muted">Loading entry…</p>}

          {state.status === "error" && (
            <div>
              <p className="muted">Couldn't load this entry from PokéAPI.</p>
              <button className="btn" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </button>
            </div>
          )}

          {data && (
            <>
              <p className="flavor">{data.flavor}</p>

              <dl className="facts">
                <div>
                  <dt>Height</dt>
                  <dd>{(data.pokemon.height / 10).toFixed(1)} m</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{(data.pokemon.weight / 10).toFixed(1)} kg</dd>
                </div>
                <div>
                  <dt>Abilities</dt>
                  <dd>
                    {data.pokemon.abilities.map((a, i) => (
                      <span key={a.ability.name}>
                        {i > 0 && ", "}
                        {titleCase(a.ability.name)}
                        {a.is_hidden && " (hidden)"}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <section>
                <h3>
                  Base stats <span className="total">Total {total}</span>
                </h3>
                <ul className="stats">
                  {data.pokemon.stats.map((s) => (
                    <li key={s.stat.name}>
                      <span className="stat-label">
                        {STAT_LABELS[s.stat.name] ?? s.stat.name}
                      </span>
                      <span className="stat-value">{s.base_stat}</span>
                      <span className="stat-track">
                        <span
                          className="stat-fill"
                          style={{
                            width: `${Math.min(100, (s.base_stat / 255) * 100)}%`,
                          }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {data.evolution.length > 1 && (
                <section>
                  <h3>Evolution</h3>
                  <div className="evo">
                    {data.evolution.map((stage, i) => (
                      <Fragment key={i}>
                        {i > 0 && (
                          <span className="evo-arrow" aria-hidden="true">
                            ›
                          </span>
                        )}
                        <div className="evo-stage">
                          {stage.map((evo) => (
                            <button
                              key={evo.id}
                              className={
                                evo.id === pokemon.id
                                  ? "evo-mon is-current"
                                  : "evo-mon"
                              }
                              onClick={() => onSelect(evo.id)}
                            >
                              <img src={spriteUrl(evo.id)} alt="" />
                              <span>{evo.label}</span>
                            </button>
                          ))}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </article>
    </div>
  );
}
