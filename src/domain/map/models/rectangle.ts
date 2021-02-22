import * as t from 'io-ts';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';

export const RawRectangle = t.readonly(
  t.type({
    center_lat: t.number,
    center_lng: t.number,
    length: t.number,
    width: t.number,
    yaw_angle: t.number,
    color: t.string,
  })
);

export type RawRectangleT = t.TypeOf<typeof RawRectangle>;

export type RectangleT = Readonly<{
  lat: number;
  lng: number;
  length: number;
  width: number;
  yaw: number;
  color: string;
  center: [number, number];
  outerR: number;
  // [left-top, left-bottom, right-bottom, right-top]
  gcsPoints: [number, number][];
  // [left-top, left-bottom, right-bottom, right-top]
  crtPoints: [number, number][];
}>;

export const transform = (raw: RawRectangleT): RectangleT => {
  const base = {
    lat: raw.center_lat,
    lng: raw.center_lng,
    length: raw.length,
    width: raw.width,
    yaw: raw.yaw_angle,
    color: raw.color,
  };

  const center = new LatLon(base.lat, base.lng);
  const distance = Math.sqrt((base.length / 2) ** 2 + (base.width / 2) ** 2);
  const lwDeg = Math.atan(base.length / base.width) * (180 / Math.PI);
  const wlDeg = 90 - lwDeg;

  const lanLatPoints = [
    base.yaw + lwDeg,
    base.yaw + 90 + wlDeg,
    base.yaw - (wlDeg + 90),
    base.yaw - lwDeg,
  ].map(brng => center.destinationPoint(distance, brng));
  const crtPoints = lanLatPoints
    .map(pt => pt.toCartesian())
    .map(({x, y}) => [x, y] as [number, number]);
  const gcsPoints = lanLatPoints.map(
    pt => [pt.lat, pt.lng] as [number, number]
  );
  const crtCenter = center.toCartesian();

  return {
    ...base,
    center: [crtCenter.x, crtCenter.y],
    outerR: distance,
    crtPoints,
    gcsPoints,
  };
};
