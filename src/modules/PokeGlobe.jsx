import { useState, useEffect } from "react";

import { DeckGL } from "deck.gl";

import { IconLayer } from "@deck.gl/layers";
import { BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { _GlobeView as GlobeView } from "deck.gl";

// const step = 5;
// const intervalMS = 50;
// const [time, setTime] = useState(0);
// const [viewState, setViewState] = useState({});
// useEffect(() => {
//   setViewState({
//     latitude: 0,
//     longitude: time / 5,
//     zoom: 1,
//   });
// }, [time]);

// useEffect(() => {
//   const interval = setInterval(() => {
//     setTime((t) => {
//       return t + step;
//     });
//   }, intervalMS);
//   return () => clearInterval(interval);
// }, []);
function PokeGlobe({ maxPokemon = 0 }) {
  const [iconLayerData, setIconLayerData] = useState([]);

  useEffect(() => {
    let positions = [];
    for (let x = 0; x <= 17; x++) {
      for (let y = 0; y <= 35; y++) {
        positions.push({
          x: x * 10,
          y: y * 10,
          z: 150,
          pokemon: Math.ceil(Math.random() * (maxPokemon - 1)),
        });
      }
    }
    setIconLayerData(positions);
  }, [maxPokemon]);

  const iconLayer = new IconLayer({
    id: "pokemon-layer",
    data: iconLayerData,
    getPosition: (d) => {
      return [d.x, d.y, d.z];
    },
    getSize: 210,
    getIcon: (d) => {
      return {
        url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.pokemon}.png`,
        width: 96,
        height: 96,
      };
    },
    pickable: true,
  });

  const baseMapLayer = new TileLayer({
    id: "base-map",
    data: "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
    pickable: false,
  });

  return (
    <DeckGL
      views={new GlobeView({ id: "globe", controller: true })}
      initialViewState={{
        latitude: 0,
        longitude: 0,
        zoom: 1,
      }}
      layers={[baseMapLayer, iconLayer]}
    />
  );
}
export default PokeGlobe;
