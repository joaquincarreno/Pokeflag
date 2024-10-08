import "./PokeCard.css";

const capitalizeFirstLetter = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};

function PokeCard({ pokemon, setter }) {
  // console.log(pokemon.id, pokemon.name);
  // console.log(pokemon);
  return (
    <div onClick={() => setter(pokemon)} className="card-container">
      <div className="card-title">
        <div className="card-name">{capitalizeFirstLetter(pokemon.name)}</div>
        <div className="card-id">#{pokemon.id}: </div>
      </div>
      <img src={pokemon.sprites.front_default} />
    </div>
  );
}

export default PokeCard;
