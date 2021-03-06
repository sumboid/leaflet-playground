import React, {memo, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {MapContainer, TileLayer, Polygon, useMap} from 'react-leaflet';
import L, {LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import type {RootState} from 'store';
import settings from 'settings';

import styles from './map.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});

const MapController: React.FC<{bounds: [number, number][]}> = memo(
  ({bounds}) => {
    const map = useMap();

    useEffect(() => {
      map.fitBounds(bounds);
    }, [bounds]);

    return null;
  }
);

const mapStyle = {height: '100%'};

const Map: React.FC<{}> = () => {
  const config = useSelector((state: RootState) => state.map.config);
  const overlappingReact = useSelector(
    (state: RootState) => state.map.overlappingRects
  );

  const bounds = useSelector((state: RootState) => state.map.bounds);
  const polygons = config.map((rect, idx) => (
    <Polygon
      key={idx}
      positions={rect.gcsPoints}
      pathOptions={{
        color: overlappingReact.has(idx) ? 'red' : rect.color,
        fillColor: rect.color,
        fillOpacity: 0.5,
      }}
    />
  ));

  return (
    <div className={styles.root}>
      <MapContainer
        center={settings.DEFAULT_POSITION}
        zoom={13}
        scrollWheelZoom={true}
        style={mapStyle}
      >
        <MapController bounds={bounds} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {polygons}
      </MapContainer>
    </div>
  );
};

export default memo(Map);
