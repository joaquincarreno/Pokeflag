import { useEffect, useState } from "react";
import "./App.css";
import PokeGlobe from "./modules/PokeGlobe";
import Pokegrid from "./modules/Pokegrid";
import axios from "axios";

function App() {
  const [start, setStart] = useState(false);
  const maxPokemon = 1025;

  return (
    <div className="app-container">
      {start ? (
        <Pokegrid maxPokemonId={maxPokemon} />
      ) : (
        <button className="start-button" onClick={() => setStart(true)}>
          Start
        </button>
      )}
      <PokeGlobe maxPokemon={maxPokemon} />
    </div>
  );
}

export default App;
