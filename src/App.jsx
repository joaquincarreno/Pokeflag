import { useState } from "react";
import "./App.css";
import PokeGlobe from "./modules/PokeGlobe";
import Pokegrid from "./modules/Pokegrid";

const maxPokemon = 1025;
function App() {
  const [start, setStart] = useState(false);

  return (
    <div className="app-container">
      {start ? (
        <Pokegrid maxPokemonId={maxPokemon} />
      ) : (
        <button className="start-button" onClick={() => setStart(true)}>
          Start
        </button>
      )}
      <PokeGlobe started={start} maxPokemon={maxPokemon} />
    </div>
  );
}

export default App;
