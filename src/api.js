import { MAX_ID, TYPES } from "./constants.js";
import { displayName } from "./utils.js";

const BASE = "https://pokeapi.co/api/v2";

const cache = new Map();

function get(url) {
  if (cache.has(url)) return cache.get(url);
  const request = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
  });
  cache.set(url, request);
  request.catch(() => cache.delete(url));
  return request;
}

export const idFromUrl = (url) => Number(url.match(/\/(\d+)\/?$/)[1]);

export async function fetchPokemonIndex() {
  const data = await get(`${BASE}/pokemon?limit=${MAX_ID}`);
  return data.results.map(({ name, url }) => {
    const id = idFromUrl(url);
    return { id, name, label: displayName(name, id) };
  });
}

export async function fetchTypeMap() {
  const results = await Promise.all(TYPES.map((t) => get(`${BASE}/type/${t}`)));
  const map = {};
  results.forEach((data, i) => {
    for (const entry of data.pokemon) {
      const id = idFromUrl(entry.pokemon.url);
      if (id > MAX_ID) continue; 
      (map[id] ||= [])[entry.slot - 1] = TYPES[i];
    }
  });
  for (const id of Object.keys(map)) map[id] = map[id].filter(Boolean);
  return map;
}

function evolutionStages(node, depth = 0, stages = []) {
  const id = idFromUrl(node.species.url);
  if (id > MAX_ID) return stages;
  (stages[depth] ||= []).push({
    id,
    label: displayName(node.species.name, id),
  });
  node.evolves_to.forEach((child) => evolutionStages(child, depth + 1, stages));
  return stages;
}

export async function fetchForm(id) {
  return get(`${BASE}/pokemon/${id}`);
}

export async function fetchDetails(id) {
  const [pokemon, species] = await Promise.all([
    get(`${BASE}/pokemon/${id}`),
    get(`${BASE}/pokemon-species/${id}`),
  ]);
  const chain = await get(species.evolution_chain.url);

  const english = species.flavor_text_entries.filter(
    (e) => e.language.name === "en"
  );
  const flavor = (english[english.length - 1]?.flavor_text ?? "")
    .replace(/\u00ad\n?/g, "")
    .replace(/[\n\f]/g, " ");

  const forms = species.varieties
    .filter((v) => v.is_default)
    .map((v) => ({
    id: idFromUrl(v.pokemon.url),
    label: displayName(v.pokemon.name, idFromUrl(v.pokemon.url)),
  }));
  
  return {
    pokemon,
    genus: species.genera.find((g) => g.language.name === "en")?.genus ?? "",
    flavor,
    evolution: evolutionStages(chain.chain),
    forms,
  };
}
