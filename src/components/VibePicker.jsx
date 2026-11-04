import { VIBES, MAX_VIBES } from "../data/vibes.js";
import AdvisoryNote from "./AdvisoryNote.jsx";

export default function VibePicker({ country, chosen, onToggle, onSubmit }) {
  const full = chosen.length >= MAX_VIBES;

  return (
    <>
      <span className="eyebrow">📍 {country.name} · {country.region}</span>
      <h2>Why are you traveling?</h2>
      <p className="sub">Pick up to {MAX_VIBES}.</p>
      <AdvisoryNote level={country.advisory} />

      <div className="chips">
        {VIBES.map(v => {
          const on = chosen.includes(v.key);
          return (
            <button
              key={v.key}
              type="button"
              className={`chip ${on ? "on" : ""}`}
              disabled={full && !on}
              aria-pressed={on}
              title={v.blurb}
              onClick={() => onToggle(v.key)}
            >
              {v.emoji} {v.label}
            </button>
          );
        })}
      </div>

      <button className="primary" type="button" disabled={!chosen.length} onClick={onSubmit}>
        Show me 5 things →
      </button>
    </>
  );
}
