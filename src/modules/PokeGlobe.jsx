import { useState, useEffect } from "react";

import { DeckGL } from "deck.gl";

import { IconLayer } from "@deck.gl/layers";
import { BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { _GlobeView as GlobeView } from "deck.gl";

const shinnyChance = 0.012;

const intervalMS = 50;
const step = 1;

function PokeGlobe({ maxPokemon = 0, started = false }) {
  const [time, setTime] = useState(0);
  const [iconLayerData, setIconLayerData] = useState([]);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [zoom, setZoom] = useState(0);

  const handleViewStateChange = ({
    viewState,
    interactionState,
    oldViewState,
  }) => {
    setLatitude(viewState.latitude);
    setLongitude(viewState.longitude);
    setZoom(viewState.zoom);
  };

  useEffect(() => {
    let positions = [];
    let shinyCount = 0;
    for (let x = 0; x <= 17; x++) {
      for (let y = 0; y <= 35; y++) {
        const shiny = Math.random() < shinnyChance;
        if (shiny) {
          shinyCount += 1;
        }
        positions.push({
          x: x * 10,
          y: y * 10,
          z: 150,
          id: Math.ceil(Math.random() * (maxPokemon - 1)),
          shinny: shiny,
        });
      }
    }
    setIconLayerData(positions);
    console.log("how lucky, you got", shinyCount, "shinies! ⭐");
  }, [maxPokemon]);

  // time passing
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        return t + step;
      });
    }, intervalMS);
    return () => clearInterval(interval);
  }, []);

  // rotation
  useEffect(() => {
    if (started) {
      setLongitude(longitude + 0.3);
    }
  }, [time]);

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

  const iconLayer = new IconLayer({
    id: "pokemon-layer",
    data: iconLayerData,
    getPosition: (pokemon) => {
      return [pokemon.x, pokemon.y, pokemon.z];
    },
    getSize: 210,
    getIcon: (pokemon) => {
      return {
        url:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
          (pokemon.shiny ? "shiny/" : "") +
          pokemon.id +
          ".png",
        width: 96,
        height: 96,
      };
    },
    pickable: true,
  });

  return (
    <DeckGL
      views={new GlobeView({ id: "globe", controller: true })}
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: zoom,
      }}
      onViewStateChange={handleViewStateChange}
      layers={[baseMapLayer, iconLayer]}
      controller={!started}
    />
  );
}
export default PokeGlobe;
