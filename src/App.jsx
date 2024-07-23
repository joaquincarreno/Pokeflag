import { useEffect, useState } from "react";
import "./App.css";
import Map from "./modules/Map";
import Pokegrid from "./modules/Pokegrid";
import axios from "axios";

function App() {
  const [start, setStart] = useState(false);
  const maxPokemon = 1025;

  return (
    <div className="app-container">
      <Pokegrid start={start} />
      {!start && (
        <button className="start-button" onClick={() => setStart(true)}>
          Start
        </button>
      )}
      <Map maxPokemon={maxPokemon} />
    </div>
  );
}

export default App;
