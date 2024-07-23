import "./GridElement.css";

function GridElement({ pokemon }) {
  console.log(pokemon.id, pokemon.name);
  console.log(pokemon);
  return (
    <div className="element-container">
      {pokemon.name} <img src={pokemon.sprites.front_default} />{" "}
    </div>
  );
}

export default GridElement;
