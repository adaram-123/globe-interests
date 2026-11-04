import { useState } from "react";
import { searchCountries } from "../data/countries.js";

export default function SearchBar({ panelOpen, onSelect, value, setValue, onSpin, spinning }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = open ? searchCountries(value) : [];

  function choose(country) {
    setOpen(false);
    setValue(country.name);
    onSelect(country);
  }

  function onKeyDown(e) {
    if (!matches.length) return;
    if (e.key === "ArrowDown") { setActive((active + 1) % matches.length); e.preventDefault(); }
    if (e.key === "ArrowUp") { setActive((active - 1 + matches.length) % matches.length); e.preventDefault(); }
    if (e.key === "Enter") { choose(matches[active]); e.target.blur(); }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className={`search ${panelOpen ? "with-panel" : ""}`}>
      {open && value.trim() && (
        <ul className="suggestions" role="listbox">
          {matches.length ? (
            matches.map((c, i) => (
              <li
                key={c.name}
                role="option"
                aria-selected={i === active}
                className={i === active ? "active" : ""}
                onMouseDown={() => choose(c)}
                onMouseEnter={() => setActive(i)}
              >
                {c.name}
                <span className="suggestion-region">{c.region}</span>
              </li>
            ))
          ) : (
            <li className="empty">Not in the guide yet ✨</li>
          )}
        </ul>
      )}
      <div className="search-row">
      <input
        id="countryInput"
        type="text"
        placeholder="Search a country…"
        autoComplete="off"
        aria-label="Search a country"
        value={value}
        onChange={e => { setValue(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
      />
      <button
        type="button"
        className={`spin-btn ${spinning ? "on" : ""}`}
        onClick={onSpin}
        disabled={spinning}
        aria-label="Surprise me: spin the globe and land on a random country"
        title="Surprise me!"
      >
        🎲
      </button>
      </div>
    </div>
  );
}