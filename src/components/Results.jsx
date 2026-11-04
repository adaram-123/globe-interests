import { useState } from "react";
import { VIBE_BY_KEY } from "../data/vibes.js";
import { blendPicks, mapsLink } from "../utils/recommend.js";
import AdvisoryNote from "./AdvisoryNote.jsx";

export default function Results({ country, chosen, onBack, onNewCountry }) {
  const [tab, setTab] = useState("mix");

  const picks = tab === "mix"
    ? blendPicks(country, chosen)
    : country.picks[tab].map(name => ({ name, vibe: tab }));

  return (
    <>
      <span className="eyebrow">📍 {country.name} · {country.region}</span>
      <h2>Your 5 in {country.name}</h2>
      <AdvisoryNote level={country.advisory} />

      {chosen.length > 1 && (
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "mix"} className={tab === "mix" ? "on" : ""} onClick={() => setTab("mix")}>
            ✨ Mix
          </button>
          {chosen.map(k => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
              {VIBE_BY_KEY[k].emoji} {VIBE_BY_KEY[k].label}
            </button>
          ))}
        </div>
      )}

      <ol className="recs" key={tab}>
        {picks.map((p, i) => (
          <li className="rec" key={p.name} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="num">{i + 1}</div>
            <div className="rec-body">
              <a className="rec-name" href={mapsLink(p.name, country.name)} target="_blank" rel="noreferrer">
                {p.name}
              </a>
              <div className="tags">
                <span className="tag">{VIBE_BY_KEY[p.vibe].emoji} {VIBE_BY_KEY[p.vibe].label}</span>
                {country.nearby.includes(p.name) && <span className="tag nearby">Just over the border</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <details className="sources">
        <summary>Dig deeper</summary>
        <ul>
          {country.sources.map(s => (
            <li key={s.url + s.label}>
              <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </details>

      <div className="row">
        <button className="ghost" type="button" onClick={onBack}>← Change vibes</button>
        <button className="ghost" type="button" onClick={onNewCountry}>New country</button>
      </div>
      <p className="note">Tap a pick to see it on a map. Hours, prices and access change, so check before you go.</p>
    </>
  );
}
