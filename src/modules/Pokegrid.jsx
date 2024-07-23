import { useState, useEffect } from "react";

import "./Pokegrid.css";
import axios from "axios";
import PokeCard from "./PokeCard";

const POKEAPI = "https://pokeapi.co/api/v2/";
const POKEMON_API = POKEAPI + "pokemon";

const createGrid = (pokeList, data) => {
  const rowSize = 3;
  // const nRows = 10;
  const nRows = Math.ceil(pokeList.length / rowSize);
  const rows = Array.from({ length: nRows }, (v, i) =>
    pokeList.slice(i * rowSize, i * rowSize + rowSize)
  );

  return (
    <div className="grid-container">
      {rows.map((row, i) => {
        return (
          <div className="grid-row">
            {row.map((pokemon, j) => (
              <PokeCard pokemon={data[pokemon]} />
            ))}
          </div>
        );
      })}
    </div>
  );
};


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
      <div className="grid-wrapper">
        {createGrid(Object.keys(pokemonDict), pokemonDict)}
      </div>
    );
  } else {
    return <></>;
  }
}
export default Pokegrid;
