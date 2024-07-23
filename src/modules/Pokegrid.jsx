import { useState, useEffect } from "react";

import "./Pokegrid.css";
import axios from "axios";
import GridElement from "./GridElement";

const POKEAPI = "https://pokeapi.co/api/v2/";
const POKEMON_API = POKEAPI + "pokemon";

function Pokegrid({ start = true }) {
  const [pokemonDict, setPokemonDict] = useState({});
  const [pokemonToGet, setPokemonToGet] = useState(30);
  const [lastId, setLastId] = useState(1);

  useEffect(() => {
    var dict = pokemonDict;
    for (let i = 0; i < pokemonToGet; i++) {
      axios.get(POKEMON_API + `/${lastId + i}`).then((response) => {
        const data = response.data;
        dict[data.name] = data;
      });
    }
    setPokemonDict(dict);
    setLastId(lastId + pokemonToGet);
    setPokemonToGet(0);
  }, []);

  console.log(Object.keys(pokemonDict));
  if (start) {
    return (
      <div className="grid-container">
        {Object.keys(pokemonDict).map((pokemon) => (
          <GridElement pokemon={pokemonDict[pokemon]} />
        ))}
      </div>
    );
  } else {
    return <></>;
  }
}
export default Pokegrid;
