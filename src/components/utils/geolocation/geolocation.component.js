import * as React from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";
import "./geolocation.component.css";
import "leaflet/dist/leaflet.css";

import mark from "../../../img/map-marker.png";

const { Map, TileLayer, Marker } = ReactLeaflet;

const Geolocation = (props) => {
  const [position, setPosition] = React.useState([
    props.location.latitude,
    props.location.longitude,
  ]);
  const [positionDefined, setPositionDefined] = React.useState(false);

  React.useEffect(() => {
    setPositionDefined(
      !!props.location &&
        props.location.latitude !== null &&
        props.location.longitude !== null
    );
    setPosition([props.location.latitude, props.location.longitude]);
    console.log(positionDefined);
  }, [props]);

  const icon = L.icon({
    iconUrl: mark,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  });
  return (
    <div style={{width: "100%", height: "200px"}}>
      {positionDefined && (
        <Map center={position} zoom={10}>
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} opacity={1} icon={icon}></Marker>
        </Map>
      )}
      {!positionDefined && (
        <div
          style={{
            backgroundColor: "#e0e1e2",
            textAlign: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <h5
            style={{ color: "gray", alignSelf: "center", paddingTop: "10px" }}
          >
            No location set
          </h5>
          <i
            className="fas fa-exclamation fa-4x"
            style={{
              color: "gray",
              alignContent: "center",
              paddingBottom: "10px",
            }}
          ></i>
        </div>
      )}
    </div>
  );
};

export default Geolocation;
