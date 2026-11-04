// Blends the chosen vibes into one list of 5: takes turns between vibes
// (1st pick of each, then 2nd of each, ...) and skips repeats
export function blendPicks(country, chosen, count = 5) {
  const vibes = chosen.length ? chosen : ["tourist"];
  const seen = new Set();
  const out = [];
  for (let i = 0; out.length < count && i < 5; i++) {
    for (const vibe of vibes) {
      const name = country.picks[vibe]?.[i];
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push({ name, vibe });
      if (out.length === count) break;
    }
  }
  return out;
}

// Google Maps search for a pick, with the country added so it finds the right place
export function mapsLink(name, countryName) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${countryName}`)}`;
}
