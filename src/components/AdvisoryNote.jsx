export default function AdvisoryNote({ level }) {
  if (level !== 3 && level !== 4) return null;
  const isFour = level === 4;
  return (
    <div className={`advisory level-${level}`}>
      <strong>Level {level} · {isFour ? "Do not travel" : "Reconsider travel"}</strong>
      <span>
        {isFour
          ? "Dream list only: the U.S. State Dept advises against all travel here."
          : "The U.S. State Dept says to reconsider travel here."}{" "}
        <a href="https://travel.state.gov/traveladvisories" target="_blank" rel="noreferrer">Check the latest</a>
      </span>
    </div>
  );
}
