# Pokédex (Generations 1-IV)

React + Vite app that browses all 1025 Pokémon from Kanto to Kalos using the free [PokéAPI](https://pokeapi.co).

## Run it

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). An internet connection is needed because data and artwork load from PokéAPI.

## Build for production

```bash
npm run build
npm run preview
```

## Structure

```
src/
  api.js                 PokéAPI calls + caching
  constants.js           generation ranges, types, colours
  utils.js               name formatting, image URLs
  App.jsx                search, filters, grid, favourites
  components/
    PokemonCard.jsx      one grid tile
    PokemonDetails.jsx     detail view (stats, evolutions)
    TypeBadge.jsx
  styles.css
```
