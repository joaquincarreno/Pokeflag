import { useState, useEffect } from "react";

import "./Pokegrid.css";
import axios from "axios";
import PokeCard from "./PokeCard";

const POKEAPI = "https://pokeapi.co/api/v2/";
const POKEMON_API = POKEAPI + "pokemon";
const POKEBALL_SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

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
          <div key={i} className="grid-row">
            {row.map((pokemon, j) => (
              <PokeCard key={j} pokemon={data[pokemon]} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const createGridController = (page, pageSetter, maxPage = 30) => {
  return (
    <div>
      <button
        onClick={() => {
          page > 0 && pageSetter(page - 1);
        }}
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          page < maxPage && pageSetter(page + 1);
        }}
      >
        {">"}
      </button>
    </div>
  );
};

function Pokegrid({ start = false }) {
  const [dataReady, setDataReady] = useState(false);

  const [pokemonDict, setPokemonDict] = useState({});
  const [pokemonToGet, setPokemonToGet] = useState(30);
  const [lastId, setLastId] = useState(1);

  const [page, setPage] = useState(0);

  // update filters
  useEffect(() => {
    const pokeCount = Object.keys(pokemonDict).length;
    if ((page + 1) * 30 > pokeCount) {
      setDataReady(false);
      setPokemonToGet(30);
    }
    // console.log(page);
  }, [page]);

  // get pokemon from the API
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
    setDataReady(true);
  }, []);

  console.log(Object.keys(pokemonDict));
  if (start) {
    return (
      <div className="grid-wrapper">
        {createGridController(page, setPage)}
        {dataReady ? (
          createGrid(Object.keys(pokemonDict), pokemonDict)
        ) : (
          <div className="loading">
            cargando pokemon...
            <img src={POKEBALL_SPRITE_URL} className="rotating-pokeball" />
          </div>
        )}
      </div>
    );
  } else {
    return <></>;
  }
}
export default Pokegrid;
