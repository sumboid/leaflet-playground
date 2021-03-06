import {createReducer} from 'typesafe-actions';

import * as Actions from './map.actions';
import {ConfigT} from './models/config';
import {RectangleT} from './models/rectangle';

type State = {
  config: ConfigT;
  overlappingRects: Set<number>;
  bounds: [number, number][];
  isLoading: boolean;
};

const DEFAULT_STATE: State = {
  config: [],
  overlappingRects: new Set(),
  bounds: [
    [54.8209536, 83.0806083],
    [54.8813348, 83.1260342],
  ],
  isLoading: false,
};

export default createReducer(DEFAULT_STATE)
  .handleAction(Actions.loadConfig.request, state => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(Actions.loadConfig.failure, state => ({
    ...state,
    isLoading: false,
  }))
  .handleAction(
    Actions.loadConfig.success,
    (state, {payload: {config, overlappingRects}}) => {
      const newBounds = [
        [
          config.reduce((r, p) => Math.min(r, minLat(p)), Infinity),
          config.reduce((r, p) => Math.min(r, minLng(p)), Infinity),
        ],
        [
          config.reduce((r, p) => Math.max(r, maxLat(p)), -Infinity),
          config.reduce((r, p) => Math.max(r, maxLng(p)), -Infinity),
        ],
      ] as [number, number][];

      const bounds = newBounds.some(xs =>
        xs.some(x => [Infinity, -Infinity].includes(x))
      )
        ? state.bounds
        : newBounds;

      return {
        ...state,
        config,
        overlappingRects,
        bounds,
        isLoading: false,
      };
    }
  );

const minLat = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.min(r, p[0]), Infinity);
const maxLat = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.max(r, p[0]), -Infinity);
const minLng = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.min(r, p[1]), Infinity);
const maxLng = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.max(r, p[1]), -Infinity);
