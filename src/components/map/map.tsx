import React, {memo} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L, {LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import styles from './map.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});

type Props = {
  position: LatLngExpression;
};

const mapStyle = {height: '100%'};

const Map: React.FC<Props> = ({position}) => {
  return (
    <div className={styles.root}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={mapStyle}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>What is that?</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default memo(Map);
