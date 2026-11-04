import { useEffect, useState } from "react";
import GlobeView from "./components/GlobeView.jsx";
import SearchBar from "./components/SearchBar.jsx";
import VibePicker from "./components/VibePicker.jsx";
import Results from "./components/Results.jsx";
import { MAX_VIBES } from "./data/vibes.js";
import { countries } from "./data/countries.js";

const SPIN_MAX_MS = 8000;

export default function App() {
  const [country, setCountry] = useState(null);  
  const [missing, setMissing] = useState(null);  
  const [chosen, setChosen] = useState([]);  
  const [view, setView] = useState("pick");     
  const [query, setQuery] = useState("");
  const [spinning, setSpinning] = useState(false);

  const panelOpen = Boolean(country || missing);

  function selectCountry(c) {
    setMissing(null);
    setCountry(c);
    setChosen([]);
    setView("pick");
    setQuery(c.name);
  }

  function showMissing(name) {
    setCountry(null);
    setMissing(name);
  }

  function toggleVibe(key) {
    setChosen(prev =>
      prev.includes(key) ? prev.filter(k => k !== key)
      : prev.length < MAX_VIBES ? [...prev, key]
      : prev
    );
  }

  function close() {
    setCountry(null);
    setMissing(null);
    setQuery("");
  }

  function startSpin() {
    close();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return landOnRandom();
    setSpinning(true);
  }

  function landOnRandom() {
    setSpinning(false);
    const pick = countries[Math.floor(Math.random() * countries.length)];
    selectCountry(pick);
  }

  useEffect(() => {
    if (!spinning) return;
    const t = setTimeout(landOnRandom, SPIN_MAX_MS);
    return () => clearTimeout(t);
  }, [spinning]);

  function newCountry() {
    close();
    setTimeout(() => document.getElementById("countryInput")?.focus(), 300);
  }

  const cardKey = country ? `${country.name}-${view}` : `missing-${missing}`;

  return (
    <>
      <GlobeView
        selected={country}
        onCountryClick={selectCountry}
        onMissingClick={showMissing}
        spinning={spinning}
        onSpinStop={landOnRandom}
      />

      {spinning && (
        <p className="spin-hint" role="status">
          <span className="hint-mouse">Hover over the globe to stop it! 🌀</span>
          <span className="hint-touch">Tap the globe to stop it! 🌀</span>
        </p>
      )}

      <header className="site-header">
        <h1>Unique Traveler</h1>
        <p>Pick a country. Get 5 things worth doing.</p>
      </header>

      <SearchBar
        panelOpen={panelOpen}
        onSelect={selectCountry}
        value={query}
        setValue={setQuery}
        onSpin={startSpin}
        spinning={spinning}
      />

      <aside className={`panel ${panelOpen ? "open" : ""}`} aria-hidden={!panelOpen}>
        {panelOpen && (
          <div className="card" key={cardKey}>
            <button className="close" type="button" aria-label="Close" onClick={close}>×</button>

            {missing && (
              <>
                <span className="eyebrow">📍 {missing}</span>
                <h2>Not in the guide yet</h2>
                <p className="sub">We don't have picks for {missing} yet. Try a neighbor!</p>
                <div className="row">
                  <button className="ghost" type="button" onClick={newCountry}>Search a country</button>
                </div>
              </>
            )}

            {country && view === "pick" && (
              <VibePicker country={country} chosen={chosen} onToggle={toggleVibe} onSubmit={() => setView("results")} />
            )}

            {country && view === "results" && (
              <Results country={country} chosen={chosen} onBack={() => setView("pick")} onNewCountry={newCountry} />
            )}
          </div>
        )}
      </aside>
    </>
  );
}