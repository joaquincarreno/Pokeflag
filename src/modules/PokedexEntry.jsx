import axios from "axios";
import { useEffect, useState } from "react";

import "./PokedexEntry.css";
import "./RotatingAnimation.css";
const POKEBALL_SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

// colors retrieved from bulbapedia.bulbagarden.net
const games_colors = {
  red: "#DA3914",
  blue: "#2E50D8",
  yellow: "#FFD733",
  gold: "#DAA520",
  silver: "#C0C0C0",
  crystal: "#4FD9FF",
  ruby: "#CD2236",
  sapphire: "#3D51A7",
  emerald: "#009652",
  firered: "#F15C01",
  leafgreen: "#9FDC00",
  diamond: "#90BEED",
  pearl: "#DD7CB1",
  platinum: "#A0A08D",
  black: "#444444",
  white: "#E1E1E1",
  "black-2": "#303E51",
  "white-2": "#EBC5C3",
  heartgold: "#E8B502",
  soulsilver: "#AAB9CF",
  x: "#025DA6",
  y: "#EA1A3E",
  "alpha-sapphire": "#26649C",
  "omega-ruby": "#AB2813",
  "lets-go-eevee": "#D4924B",
  "lets-go-pikachu": "#F5DA26",
  sword: "#00A1E9",
  shield: "#BF004F",
  sun: "#F1912B",
  moon: "#5599CA",
  "ultra-sun": "#E95B2B",
  "ultra-moon": "#226DB5",
  "brilliant-diamond": "#44BAE5",
  "shining-pearl": "#DA7D99",
  "legends-arceus": "#36597B",
  scarlet: "#F34134",
  violet: "#8334B7",
};

const type_colors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
  stellar: "40B5A5",
};

function PokedexEntry({
  pokedata,
  setter,
  addFav = () => {},
  removeFav = () => {},
  favs = [],
}) {
  const [descriptions, setDescriptions] = useState(null);
  const cry = new Audio(pokedata.cries.latest);
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const [currDescription, setCurrDescription] = useState("");
  const [flip, setFlip] = useState(false);
  cry.volume = 0.1;

  const [isFav, setIsFav] = useState(favs.includes(pokedata));
  const [updater, setUpdater] = useState(0);

  useEffect(() => {
    setIsFav(favs.includes(pokedata));
  }, [updater]);

  useEffect(() => {
    axios.get(pokedata.species.url).then((response) => {
      const filtered = response.data.flavor_text_entries.filter(
        (entry) => entry.language.name == "en"
      );
      let unrepeated = {};
      filtered.forEach((e) => {
        const formatedText = e.flavor_text.replace("\f", "\n");
        if (unrepeated[formatedText]) {
          unrepeated[formatedText].push(e.version.name);
        } else {
          unrepeated[formatedText] = [e.version.name];
        }
      });
      setDescriptions(unrepeated);
      setCurrDescription(Object.keys(unrepeated)[0]);
    });
  }, []);
  return descriptions ? (
    <div className="entry-container">
      <div className="top-half">
        <div className="sprite-container">
          <div onClick={() => cry.play()} style={{ top: "0" }}>
            <img
              style={{ width: "100%" }}
              src={
                flip
                  ? pokedata.sprites.back_default
                  : pokedata.sprites.front_default
              }
            />
          </div>
        </div>
        <div className="data-container">
          <div className="name">
            <div className="id">
              <img style={{ height: "70px" }} src={POKEBALL_SPRITE_URL} />
              {pokedata.id < 1000 && "0"}
              {pokedata.id < 100 && "0"}
              {pokedata.id < 10 && "0"}
              {pokedata.id}
            </div>
            <p>{pokedata.name.toUpperCase()}</p>
          </div>
          <div className="type-container">
            {pokedata.types.map((t, i) => (
              <div
                key={i}
                className="type"
                style={{ backgroundColor: type_colors[t.type.name] }}
              >
                {t.type.name}
              </div>
            ))}
          </div>
          <div className="stats-container">
            <div className="stats">
              <div>HT</div>
              <div>{pokedata.height / 10} m</div>
            </div>
            <div className="stats">
              <div>WT</div>
              <div>{pokedata.weight / 10} kg</div>
            </div>
          </div>
        </div>
      </div>
      <div className="description-container">
        <div className="description-text">{currDescription}</div>
        <div className="description-origin">
          {descriptions[currDescription].map((game, i) => {
            return (
              <div key={i} style={{ backgroundColor: games_colors[game] }}>
                {game}
              </div>
            );
          })}
        </div>
        <div className="description-buttons">
          <div>
            <button onClick={() => setter(null)}>X</button>
          </div>
          <div>
            {flip ? (
              <button className="pixel-font" onClick={() => setFlip(!flip)}>
                &#9205;
              </button>
            ) : (
              <button onClick={() => setFlip(!flip)}>&#9204;</button>
            )}
            {isFav ? (
              <button
                onClick={() => {
                  setUpdater(updater + 1);
                  removeFav(pokedata);
                }}
              >
                &#x1F496;
              </button>
            ) : (
              <button
                onClick={() => {
                  setUpdater(updater + 1);
                  addFav(pokedata);
                }}
              >
                &#x1F5A4;
              </button>
            )}
          </div>
          <div>
            <button
              onClick={() => {
                const texts = Object.keys(descriptions);
                const newIndex =
                  (descriptionIndex + texts.length - 1) % texts.length;
                const text = texts[newIndex];
                setCurrDescription(text);
                setDescriptionIndex(newIndex);
              }}
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                const texts = Object.keys(descriptions);
                const newIndex = (descriptionIndex + 1) % texts.length;
                const text = texts[newIndex];
                setCurrDescription(text);
                setDescriptionIndex(newIndex);
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="entry-container">
      <div className="loading">
        cargando pokemon...
        <img src={POKEBALL_SPRITE_URL} className="rotating-pokeball" />
      </div>
    </div>
  );
}
export default PokedexEntry;
