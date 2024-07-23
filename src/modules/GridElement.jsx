import "./GridElement.css";

const capitalizeFirstLetter = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};

function GridElement({ pokemon }) {
  console.log(pokemon.id, pokemon.name);
  console.log(pokemon);
  return (
    <div className="element-container">
      {capitalizeFirstLetter(pokemon.name)}
      <img src={pokemon.sprites.front_default} />{" "}
    </div>
  );
}

export default GridElement;
