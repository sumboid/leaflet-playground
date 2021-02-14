import * as t from 'io-ts';

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
}>;

export const transform = (raw: RawRectangleT): RectangleT => ({
  lat: raw.center_lat,
  lng: raw.center_lng,
  length: raw.length,
  width: raw.width,
  yaw: raw.yaw_angle,
  color: raw.color,
});
