import * as React from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";
import "./geolocation.component.css";
import "leaflet/dist/leaflet.css";
import _ from "lodash";
import mark from "../../../img/map-marker.png";
import { Dimmer } from "semantic-ui-react"

const { Map, TileLayer, Marker, Circle } = ReactLeaflet;

const Geolocation = (props) => {
  /**
   * @param props:
   *   location: Object {longitude: (float), latitude: (float)}
   *   gatewaysLocations: Array
   */

  const [position, setPosition] = React.useState([
    _.get(props, "location.latitude"),
    _.get(props, "location.longitude"),
  ]);
  const [positionDefined, setPositionDefined] = React.useState(false);
  const [gatewaysLocations, setGatewaysLocation] = React.useState([]);
  const [
    gatewaysLocationsAvailable,
    setgatewaysLocationsAvailable,
  ] = React.useState(false);

  React.useEffect(() => {
    setPositionDefined(
      !!props.location &&
        props.location.latitude !== null &&
        props.location.longitude !== null
    );

    setPosition([
      _.get(props, "location.latitude"),
      _.get(props, "location.longitude"),
    ]);

    if (
      _.hasIn(props, "gatewaysLocations") &&
      !_.isNull(props.gatewaysLocations) &&
      !_.isUndefined(props.gatewaysLocations)
    ) {
      let gatewaysLocations = props.gatewaysLocations.map((gw) => {
        const key = Object.keys(gw)[0];
        const gwDetails = gw[key];
        gwDetails.id = key;
        return gwDetails;
      });
      gatewaysLocations = gatewaysLocations.filter(
        (gw) => !_.isNull(gw.latitude) && !_.isNull(gw.longitude)
      );
      setGatewaysLocation(gatewaysLocations);
      setgatewaysLocationsAvailable(gatewaysLocations.length > 0);
    }
  }, [props]);

  const icon = L.icon({
    iconUrl: mark,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  });

  const gwCount = gatewaysLocations.length;
  let mapCenter = null;

  if (gwCount > 0) {
    mapCenter = gatewaysLocations
      .map((gw) => {
        return [gw.latitude, gw.longitude];
      })
      .reduce((position, gwLocation) => [
        position[0] + gwLocation[0],
        position[1] + gwLocation[1],
      ])
      .map((e) => e / gwCount);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {(positionDefined || gatewaysLocationsAvailable) && (
        <Map center={positionDefined ? position : mapCenter} zoom={10}>
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {positionDefined && (
            <Marker position={position} opacity={1} icon={icon}></Marker>
          )}

          {gatewaysLocationsAvailable &&
            !positionDefined &&
            gatewaysLocations.map((gw) => {
              return (
                <Circle
                  center={{ lat: gw.latitude, lng: gw.longitude }}
                  fillColor={props.circleColor}
                  radius={props.radius}
                />
              );
            })}
        </Map>
      )}
      {!positionDefined && !gatewaysLocationsAvailable && (
        <Map
          viewport={{ center: [31.505, -0.05], zoom: 0.5 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Dimmer active style={{opacity: 0.8}}>
            <span style={{color: 'white', fontSize: "1.3em", fontStyle: 'bold', fontWeight:900}}>Not available</span>
          </Dimmer>
        </Map>
      )}
    </div>
  );
};

export default Geolocation;
