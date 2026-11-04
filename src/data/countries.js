// Joins the guide (guide.json) to the country shapes on the globe (world.json).
import world from "./world.json"; // country shapes (Natural Earth, simplified)
import guide from "./guide.json"; // 198 countries × 13 vibes × 5 picks
 
// Guide name → name the map uses, when they differ
const MAP_NAMES = {
  "Antigua and Barbuda": "Antigua and Barb.",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Burma": "Myanmar",
  "Cayman Islands": "Cayman Is.",
  "Central African Republic": "Central African Rep.",
  "Cook Islands": "Cook Is.",
  "Democratic Republic of the Congo": "Dem. Rep. Congo",
  "Dominican Republic": "Dominican Rep.",
  "Equatorial Guinea": "Eq. Guinea",
  "Holy See": "Vatican",
  "Marshall Islands": "Marshall Is.",
  "North Macedonia": "Macedonia",
  "Republic of the Congo": "Congo",
  "Saint Kitts and Nevis": "St. Kitts and Nevis",
  "Saint Vincent and the Grenadines": "St. Vin. and Gren.",
  "Solomon Islands": "Solomon Is.",
  "South Sudan": "S. Sudan",
  "United States": "United States of America"
};
 
// Other names people might type in the search bar
const SEARCH_ALIASES = {
  "Burma": ["Myanmar"],
  "Turkey": ["Türkiye", "Turkiye"],
  "Czechia": ["Czech Republic"],
  "Eswatini": ["Swaziland"],
  "Cabo Verde": ["Cape Verde"],
  "Côte d'Ivoire": ["Ivory Coast", "Cote d'Ivoire"],
  "Holy See": ["Vatican City"],
  "Timor-Leste": ["East Timor"],
  "The Netherlands": ["Netherlands", "Holland"],
  "The Bahamas": ["Bahamas"],
  "The Gambia": ["Gambia"],
  "United Kingdom": ["UK", "England", "Scotland", "Wales", "Britain"],
  "United Arab Emirates": ["UAE", "Dubai"],
  "South Korea": ["Korea"],
  "Democratic Republic of the Congo": ["DR Congo", "DRC"],
  "Republic of the Congo": ["Congo"],
  "North Macedonia": ["Macedonia"],
  "United States": ["USA", "US", "America", "United States of America"]
};
 
// Countries too small to have a shape on this map: the globe flies here and pulses
const FALLBACK_COORDS = {
  "Tuvalu": { lat: -8.52, lng: 179.2 }
};
 
const norm = s =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/^the /, "")
    .replace(/[^a-z]/g, "");
 
// ---- shapes ----
export const features = world.features;
 
const shapeByNorm = Object.fromEntries(features.map(f => [norm(f.properties.name), f]));
 
// ---- countries (guide entries + their shape) ----
export const countries = guide.map(c => {
  const shape = shapeByNorm[norm(MAP_NAMES[c.name] || c.name)] || null;
  const entry = { ...c, shape, fallback: FALLBACK_COORDS[c.name] || null, aliases: SEARCH_ALIASES[c.name] || [] };
  if (shape) shape.properties.guide = entry;
  return entry;
});
 
export const countryByName = Object.fromEntries(countries.map(c => [c.name, c]));
 
// Search: matches the start of the name first, then anywhere in it, including aliases
export function searchCountries(query, limit = 6) {
  const q = norm(query);
  if (!q) return [];
  const scored = [];
  for (const c of countries) {
    const names = [c.name, ...c.aliases].map(norm);
    if (names.some(n => n.startsWith(q))) scored.push([0, c]);
    else if (names.some(n => n.includes(q))) scored.push([1, c]);
  }
  return scored.sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name)).slice(0, limit).map(s => s[1]);
}
 
// Rough center + size of a shape (middle of its biggest landmass)
export function centerOf(shape) {
  const g = shape.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  let best = null, bestArea = -1;
  for (const poly of polys) {
    const ring = poly[0];
    let a = 0;
    for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    if (Math.abs(a) > bestArea) { bestArea = Math.abs(a); best = ring; }
  }
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of best) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  return { lat: (minY + maxY) / 2, lng: (minX + maxX) / 2, span: Math.max(maxX - minX, maxY - minY) };
}
 