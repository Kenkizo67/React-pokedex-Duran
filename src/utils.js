import { STRIP_FORM_IDS } from "./constants.js";

const SPRITES =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const artworkUrl = (id) => `${SPRITES}/other/official-artwork/${id}.png`;
export const spriteUrl = (id) => `${SPRITES}/${id}.png`;

export const formatNo = (id) => String(id).padStart(3, "0");

export const titleCase = (slug) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const SPECIAL_NAMES = {
  "nidoran-f": "Nidoran ♀",
  "nidoran-m": "Nidoran ♂",
  "mr-mime": "Mr. Mime",
  "mime-jr": "Mime Jr.",
  farfetchd: "Farfetch'd",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "flabebe": "Flabébé",
};

export function displayName(slug, id) {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  if (STRIP_FORM_IDS.has(id)) return titleCase(slug.split("-")[0]);
  return titleCase(slug);
}

export function readableInk(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#14201a" : "#ffffff";
}
