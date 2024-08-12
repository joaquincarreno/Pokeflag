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

const createGrid = (pokeList, data, pokemonSetter, currPage) => {
  const rowSize = 3;
  // const nRows = 10;
  const nRows = Math.ceil(pokeList.length / rowSize);
  const rows = Array.from({ length: nRows }, (v, i) =>
    pokeList.slice(i * rowSize, i * rowSize + rowSize)
  );
  return (
    <div className="grid-container">
      <div className="grid-page-indicator"> page {currPage}</div>
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
      <div className="grid-page-indicator"> page {currPage}</div>
    </div>
  );
};

const createGridController = (
  page,
  pageSetter,
  maxPage = 30,
  textFilter,
  textFilterSetter,
  showFavourites,
  setShowFavourites
) => {
  return (
    <div className="grid-controller">
      <button
        onClick={() => {
          page > 0 ? pageSetter(page - 1) : alert("This is the first page!");
        }}
      >
        {"<"}
      </button>
      <input
        placeholder="Search by name"
        style={{ textAlign: "center" }}
        value={textFilter}
        onInput={(e) => textFilterSetter(e.target.value)}
      />
      {showFavourites ? (
        <button
          onClick={() => {
            setShowFavourites(false);
          }}
        >
          &#x1F496;
        </button>
      ) : (
        <button
          onClick={() => {
            setShowFavourites(true);
          }}
        >
          &#x1F5A4;
        </button>
      )}
      <button
        onClick={() => {
          page < maxPage
            ? pageSetter(page + 1)
            : alert("No more pokemon to display D: (for now...)");
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

  const [favourites, setFavourites] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);

  const checkFav = (pokemon) => {
    return favourites.includes(pokemon);
  };
  const addFav = (pokemon) => {
    const newFav = favourites;
    if (favourites.length) {
      let keep = true;
      let i = 0;
      while (keep && i < favourites.length) {
        console.log(i);
        if (favourites[i].id > pokemon.id) {
          // tiene id mayor, aquí va
          keep = false;
        } else {
          // id menor, sigue buscando
          i += 1;
        }
      }
      newFav.splice(i, 0, pokemon);
    } else {
      newFav.push(pokemon);
    }
    // console.log(newFav);
    setFavourites(newFav);
  };
  const removeFav = (pokemon) => {
    const newFav = favourites;
    const index = favourites.indexOf(pokemon);
    newFav.splice(index, 1);
    // console.log(index);
    // console.log(newFav);
    setFavourites(newFav);
  };

  // if textfilter changes, go to page 0
  useEffect(() => {
    setPage(0);
  }, [textFilter]);

  // fetch pokemon count from the API
  useEffect(() => {
    axios.get(POKEMON_API).then((res) => {
      // console.log("hola", res.data.count);
      setPokemonToGet(res.data.count);
    });
  }, []);

  // fetch pokemon from the API
  useEffect(() => {
    if (pokemonToGet > 0) {
      console.log("need to get", pokemonToGet, " pokemon");
      const dict = pokemonDict;

      axios.get(POKEMON_API + "?limit=" + pokemonToGet).then((res) => {
        const promiseList = res.data.results.map((entry) =>
          axios.get(entry.url)
        );
      Promise.all(promiseList)
        .then((responseList) => {
          responseList.forEach((res) => {
            dict[res.data.name] = res.data;
          });
          setPokemonDict(dict);
            setDataReady(true);
          console.log("succeded fetching pokemon");
        })
        .catch(() => {
          console.log("failed to fetch pokemon");
        });
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
    <PokedexEntry
      pokedata={selectedPokemon}
      setter={setSelectedPokemon}
      addFav={addFav}
      removeFav={removeFav}
      favs={favourites}
    />
  ) : (
    <div className="grid-wrapper">
      {createGridController(
        page,
        setPage,
        showFavourites
          ? favourites.length
          : textFilter && Object.keys(pokemonDict).length == maxPokemonId - 1
          ? Math.ceil(
              Object.keys(pokemonDict).filter((name) =>
                name.includes(textFilter)
              ).length / 30
            ) - 1
          : Math.ceil(maxPokemonId / 30) - 1,
        textFilter,
        setTextFilter,
        showFavourites,
        setShowFavourites
      )}
      {visReady ? (
        createGrid(
          showFavourites ? Object.keys(favourites) : filteredPokemon,
          showFavourites ? favourites : pokemonDict,
          setSelectedPokemon,
          page + 1
        )
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
