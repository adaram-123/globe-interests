// The 13 travel vibes from "Around the World in 13 Vibes".
// `key` matches the keys inside guide.json → picks.
export const VIBES = [
  { key: "cultural",   label: "Cultural",            emoji: "🏛️", blurb: "Heritage, faith, festivals & traditions" },
  { key: "nature",     label: "Nature",              emoji: "🌿", blurb: "Parks, peaks, deserts & wild places" },
  { key: "adventure",  label: "Adventure",           emoji: "🧗", blurb: "Hikes, climbs, rides & adrenaline" },
  { key: "food",       label: "Food & drink",        emoji: "🍜", blurb: "Signature dishes, markets & sips" },
  { key: "creativity", label: "Creativity",          emoji: "🎨", blurb: "Art, music, crafts & making things" },
  { key: "water",      label: "Water adventures",    emoji: "🌊", blurb: "Swim, dive, surf, paddle & sail" },
  { key: "urban",      label: "Urban",               emoji: "🏙️", blurb: "Neighborhoods, skylines & city life" },
  { key: "learning",   label: "Learning",            emoji: "📚", blurb: "Museums, history & ideas" },
  { key: "family",     label: "Family-friendly",     emoji: "👨‍👩‍👧", blurb: "Easy wins for all ages" },
  { key: "romantic",   label: "Romantic getaway",    emoji: "💕", blurb: "Sunsets, slow dinners & dreamy stays" },
  { key: "tourist",    label: "Tourist attractions", emoji: "📸", blurb: "The icons everyone comes for" },
  { key: "solo",       label: "Solo",                emoji: "🎒", blurb: "Easy to do on your own" },
  { key: "rural",      label: "Rural",               emoji: "🌾", blurb: "Villages, farmland & back roads" }
];

export const VIBE_BY_KEY = Object.fromEntries(VIBES.map(v => [v.key, v]));

export const MAX_VIBES = 3;