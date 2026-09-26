export const MAX_ID = 1025;

export const GENERATIONS = [
  { id: 1, label: "Gen I", region: "Kanto", from: 1, to: 151 },
  { id: 2, label: "Gen II", region: "Johto", from: 152, to: 251 },
  { id: 3, label: "Gen III", region: "Hoenn", from: 252, to: 386 },
  { id: 4, label: "Gen IV", region: "Sinnoh", from: 387, to: 493 },
  { id: 5, label: "Gen V", region: "Unova", from: 494, to: 649 },
  { id: 6, label: "Gen VI", region: "Kalos", from: 650, to: 721 },
  { id: 7, label: "Gen VII", region: "Alola", from: 722, to: 809},
  { id: 8, label: "Gen VIII", region: "Galar", from: 810, to: 905},
  { id: 9, label: "Gen IV", region: "Paldea",from: 906, to: 1025}
];

export const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export const STRIP_FORM_IDS = new Set([
  386, 413, 487, 492, 550, 555, 641, 642, 645, 647, 648, 678, 681, 710, 711, 718,
]);
