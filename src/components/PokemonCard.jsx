import { memo } from "react";
import { TYPE_COLORS } from "../constants.js";
import { artworkUrl, formatNo } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";

function PokemonCard({ pokemon, types, isFavorite, onOpen }) {
  const tint = TYPE_COLORS[types?.[0]] ?? "#9aa8a0";

  return (
    <button
      className="tile"
      style={{ "--tint": tint }}
      onClick={() => onOpen(pokemon.id)}
      aria-label={`${pokemon.label}, number ${pokemon.id}`}
    >
      <span className="tile-no">#{formatNo(pokemon.id)}</span>
      {isFavorite && (
        <span className="tile-fav" aria-hidden="true">
          ★
        </span>
      )}
      <span className="tile-art">
        <img
          src={artworkUrl(pokemon.id)}
          alt=""
          loading="lazy"
          width="475"
          height="475"
        />
      </span>
      <span className="tile-name">{pokemon.label}</span>
      <span className="tile-types">
        {types?.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </span>
    </button>
  );
}

export default memo(PokemonCard);
