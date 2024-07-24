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

function Pokegrid({ start = false }) {
  const [visReady, setVisReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const [pokemonDict, setPokemonDict] = useState({});
  const [pokemonToGet, setPokemonToGet] = useState(30);
  const [filteredPokemon, setFileteredPokemon] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [lastId, setLastId] = useState(1);

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [page, setPage] = useState(0);
  const [textFilter, setTextFilter] = useState("");

  // update filter
  useEffect(() => {
    const filtered = Object.keys(pokemonDict).filter((name) =>
      name.includes(textFilter)
    );
    console.log(filtered);
    setFileteredPokemon(filtered);
  }, [textFilter, dataReady]);

  // update page
  useEffect(() => {
    const pokeCount = Object.keys(pokemonDict).length;
    setVisReady(false);
    if ((page + 1) * 30 > pokeCount) {
      setDataReady(false);
      setPokemonToGet(30);
    }
    // console.log(page);
  }, [page]);

  // get pokemon from the API
  useEffect(() => {
    if (pokemonToGet > 0) {
      console.log("fetching pokemon");
      var dict = pokemonDict;
      var promiseList = [...Array(pokemonToGet).keys()].map((x) => {
        return axios.get(POKEMON_API + `/${lastId + x}`);
      });
      Promise.all(promiseList).then((responseList) => {
        responseList.forEach((res) => {
          dict[res.data.name] = res.data;
        });
        console.log("pokemon fetching succeded");
        setPokemonDict(dict);
        setLastId(lastId + responseList.length);
        setPokemonToGet(pokemonToGet - responseList.length);
        setDataReady(true);
      });
    } else {
      setDataReady(true);
    }
  }, [dataReady]);

  // update visible pokemon
  useEffect(() => {
    const pokeList = Object.keys(pokemonDict);
    // filtrar y dividir arreglo de pokemons
    // console.log("alos", pokeList);
    setVisiblePokemon(pokeList.slice(page * 30, (page + 1) * 30));
    setVisReady(true);
    console.log("updated visible pokemon");
  }, [dataReady]);

  if (start) {
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
          createGrid(visiblePokemon, pokemonDict, setSelectedPokemon)
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
