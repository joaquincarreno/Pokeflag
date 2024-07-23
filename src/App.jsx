import { useEffect, useState } from "react";
import Map from "./modules/Map";

function App() {
  const [start, setStart] = useState(false);
  const maxPokemon = 1025;

  return (
    <div className="app-container">
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
      <Map maxPokemon={maxPokemon} />
      </div>
  );
}

export default App;
