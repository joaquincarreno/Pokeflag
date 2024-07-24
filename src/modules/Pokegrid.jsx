import { useState, useEffect } from "react";

import "./Pokegrid.css";
import "./RotatingAnimation.css";
import axios from "axios";
import PokeCard from "./PokeCard";
import PokedexEntry from "./PokedexEntry";

const POKEAPI = "https://pokeapi.co/api/v2/";
const POKEMON_API = POKEAPI + "pokemon";
const POKEBALL_SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

const createGrid = (pokeList, data, pokemonSetter) => {
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
              <PokeCard
                key={j}
                setter={pokemonSetter}
                pokemon={data[pokemon]}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const createGridController = (
  page,
  pageSetter,
  maxPage = 30,
  textFilter,
  textFilterSetter
) => {
  return (
    <div className="grid-controller">
      <button
        onClick={() => {
          page > 0 && pageSetter(page - 1);
        }}
      >
        {"<"}
      </button>
      <input
        value={textFilter}
        onInput={(e) => textFilterSetter(e.target.value)}
      />
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

function Pokegrid({ maxPokemonId }) {
  const [visReady, setVisReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const [pokemonDict, setPokemonDict] = useState({});
  const [pokemonToGet, setPokemonToGet] = useState(30);

  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [lastId, setLastId] = useState(1);

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [page, setPage] = useState(0);
  const [textFilter, setTextFilter] = useState("");

  // if textfilter changes, go to page 0
  useEffect(() => {
    setPage(0);
  }, [textFilter]);

  // check if more pokemon are needed
  useEffect(() => {
    console.log("page:", page, "filter:", textFilter);
    const pokeCount = Object.keys(pokemonDict).filter((name) =>
      name.includes(textFilter)
    ).length;
    // if page not filled and more pokemon available
    if (pokeCount < (page + 1) * 30 && lastId < maxPokemonId) {
      console.log("gimme more pokemon");
      setVisReady(false);
      setDataReady(false);
      setPokemonToGet(30);
    } else {
      console.log("it's enough pokemon");
      setDataReady(true);
    }
  }, [page, lastId, textFilter]);

  // fetch pokemon from the API
  useEffect(() => {
    console.log("need to get", pokemonToGet, "more pokemon");
    if (pokemonToGet > 0) {
      const dict = pokemonDict;
      const idsToGet = [...Array(pokemonToGet).keys()]
        .map((x) => x + lastId)
        .filter((id) => id < maxPokemonId);

      const promiseList = idsToGet.map((x) => {
        return axios.get(POKEMON_API + `/${x}`);
      });
      console.log("fetching", pokemonToGet, "pokemon");
      Promise.all(promiseList)
        .then((responseList) => {
          responseList.forEach((res) => {
            dict[res.data.name] = res.data;
          });
          setPokemonDict(dict);
          setLastId(lastId + responseList.length);
          setPokemonToGet(0);
          console.log("succeded fetching pokemon");
        })
        .catch(() => {
          console.log("failed to fetch pokemon");
        });
    }
  }, [pokemonToGet]);

  // if data is ready, update filtered
  useEffect(() => {
    if (dataReady) {
      console.log("data was ready");
      const filtered = Object.keys(pokemonDict)
        .filter((name) => name.includes(textFilter))
        .slice(page * 30, (page + 1) * 30);
      console.log("filtered", filtered.length, "pokemon");
      setFilteredPokemon(filtered);
      setVisReady(true);
    } else {
      console.log("data was not ready");
      setFilteredPokemon([]);
    }
  }, [dataReady, page, textFilter]);

  return selectedPokemon ? (
    <PokedexEntry pokedata={selectedPokemon} setter={setSelectedPokemon} />
  ) : (
    <div className="grid-wrapper">
      {createGridController(
        page,
        setPage,
        Math.ceil(1000 / 3),
        textFilter,
        setTextFilter
      )}
      {visReady ? (
        createGrid(filteredPokemon, pokemonDict, setSelectedPokemon)
      ) : (
        <div className="loading">
          cargando pokemon...
          <img src={POKEBALL_SPRITE_URL} className="rotating-pokeball" />
        </div>
      )}
    </div>
  );
}
export default Pokegrid;
