import { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import { features, centerOf } from "../data/countries.js";
 
const OCEAN = "#cfe4ee";
const LAND = "#cfe6c6";
const LAND_EDGE = "#aecba4";
const LAND_NO_GUIDE = "#e3ecdc";
const HIGHLIGHT = "#f2a58c";
const HIGHLIGHT_SIDE = "rgba(233,120,91,0.45)";
 
const FAST_SPIN = 45;
const SPIN_GRACE_MS = 700;
 
export default function GlobeView({ selected, onCountryClick, onMissingClick, spinning, onSpinStop }) {
  const mountRef = useRef(null);
  const globeRef = useRef(null);
  const selectedShapeRef = useRef(null);
  const handlers = useRef({});
  handlers.current = { onCountryClick, onMissingClick, onSpinStop };
  const spin = useRef({ on: false, since: 0, stoppedAt: 0 });
  const [globeError, setGlobeError] = useState(null);
 
  useEffect(() => {
    const el = mountRef.current;
    let world;
    try {
    world = Globe()(el)
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(true)
      .atmosphereColor("#bcdcea")
      .atmosphereAltitude(0.16)
      .polygonsData(features)
      .polygonStrokeColor(() => LAND_EDGE)
      .polygonsTransitionDuration(450)
      .polygonLabel(f => {
        if (spin.current.on) return "";
        const g = f.properties.guide;
        const name = g ? g.name : f.properties.name;
        const sub = g ? "" : `<div class="globe-tip-sub">Not in the guide yet</div>`;
        return `<div class="globe-tip">${name}${sub}</div>`;
      })
      .onPolygonClick(f => {
        if (spin.current.on || Date.now() - spin.current.stoppedAt < 500) return;
        const g = f.properties.guide;
        if (g) handlers.current.onCountryClick(g);
        else handlers.current.onMissingClick(f.properties.name);
      })
      .ringColor(() => t => `rgba(233,120,91,${1 - t})`)
      .ringMaxRadius(6)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod(900);
 
    const mat = world.globeMaterial();
    mat.color.set(OCEAN);
    mat.emissive.set(OCEAN);
    mat.emissiveIntensity = 0.3;
    } catch (err) {
      console.error("Globe failed to start:", err);
      setGlobeError(String(err?.message || err));
      return;
    }
 
    world.pointOfView({ lat: 20, lng: 10, altitude: 2.4 });
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.35;
 
    const onResize = () => world.width(window.innerWidth).height(window.innerHeight);
    window.addEventListener("resize", onResize);
 
    const stopIfOnGlobe = e => {
      const st = spin.current;
      if (!st.on || Date.now() - st.since < SPIN_GRACE_MS) return;
      const rect = el.getBoundingClientRect();
      const onGlobe = world.toGlobeCoords(e.clientX - rect.left, e.clientY - rect.top);
      if (!onGlobe) return; 
      st.on = false;
      st.stoppedAt = Date.now();
      handlers.current.onSpinStop();
    };
    el.addEventListener("pointermove", stopIfOnGlobe);
    el.addEventListener("pointerdown", stopIfOnGlobe);
 
    globeRef.current = world;
    applyStyles();
 
    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointermove", stopIfOnGlobe);
      el.removeEventListener("pointerdown", stopIfOnGlobe);
      if (world._destructor) world._destructor();
      el.innerHTML = "";
    };
  }, []);
 
  function applyStyles() {
    const world = globeRef.current;
    if (!world) return;
    const sel = selectedShapeRef.current;
    world
      .polygonCapColor(f => (f === sel ? HIGHLIGHT : f.properties.guide ? LAND : LAND_NO_GUIDE))
      .polygonSideColor(f => (f === sel ? HIGHLIGHT_SIDE : "rgba(150,190,140,0.12)"))
      .polygonAltitude(f => (f === sel ? 0.06 : 0.008));
  }
 
  useEffect(() => {
    const world = globeRef.current;
    if (!world) return;
    selectedShapeRef.current = selected?.shape || null;
    applyStyles();
 
    if (!selected) {
      world.ringsData([]);
      world.controls().autoRotate = true;
      world.controls().autoRotateSpeed = spin.current.on ? FAST_SPIN : 0.35;
      world.pointOfView({ altitude: 2.4 }, 1200);
      return;
    }
 
    world.controls().autoRotate = false;
    world.controls().autoRotateSpeed = 0.35;
    let target = null;
    if (selected.shape) {
      const c = centerOf(selected.shape);
      target = { lat: c.lat, lng: c.lng, altitude: Math.min(2.2, Math.max(0.9, c.span / 28)) };
    } else if (selected.fallback) {
      target = { ...selected.fallback, altitude: 1.1 };
    }
    if (!target) return;
 
    const phone = window.innerWidth <= 720;
    world.pointOfView({
      lat: target.lat - (phone ? target.altitude * 10 : 0),
      lng: target.lng + (phone ? 0 : target.altitude * 12),
      altitude: target.altitude
    }, 1400);
    world.ringsData([{ lat: target.lat, lng: target.lng }]);
  }, [selected]);
 
  useEffect(() => {
    const world = globeRef.current;
    if (!world) return;
    if (spinning) {
      spin.current.on = true;
      spin.current.since = Date.now();
      world.controls().autoRotate = true;
      world.controls().autoRotateSpeed = FAST_SPIN;
      world.pointOfView({ altitude: 2.6 }, 600);
    } else if (spin.current.on) {
      spin.current.on = false;
      spin.current.stoppedAt = Date.now();
    }
  }, [spinning]);
 
  return (
    <>
      <div id="globe" ref={mountRef} />
      {globeError && (
        <p className="globe-error">
          The 3D globe couldn't load in this browser ({globeError}). Search still works below.
        </p>
      )}
    </>
  );
}
 