import { TYPE_COLORS } from "../constants.js";
import { readableInk } from "../utils.js";

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type];
  return (
    <span className="badge" style={{ background: color, color: readableInk(color) }}>
      {type}
    </span>
  );
}
