import "./PokeCard.css";

const capitalizeFirstLetter = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};

function PokeCard({ pokemon }) {
  // console.log(pokemon.id, pokemon.name);
  // console.log(pokemon);
  return (
    <div className="card-container">
      <div className="card-title">
        <div className="card-id">#{pokemon.id}: </div>
        <div className="card-name">{capitalizeFirstLetter(pokemon.name)}</div>
      </div>
      <img className="sprite" src={pokemon.sprites.front_default} />
    </div>
  );
}

export default PokeCard;
