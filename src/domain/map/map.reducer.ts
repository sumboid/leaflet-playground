import {createReducer} from 'typesafe-actions';

import * as Actions from './map.actions';
import {ConfigT} from './models/config';
import {RectangleT} from './models/rectangle';

type State = {
  config: ConfigT;
  bounds: [number, number][];
  isLoading: boolean;
};

const DEFAULT_STATE: State = {
  config: [],
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
  .handleAction(Actions.loadConfig.success, (state, {payload: config}) => ({
    ...state,
    config,
    bounds: [
      [
        config.reduce((r, p) => Math.min(r, minLat(p)), Infinity),
        config.reduce((r, p) => Math.min(r, minLng(p)), Infinity),
      ],
      [
        config.reduce((r, p) => Math.max(r, maxLat(p)), -Infinity),
        config.reduce((r, p) => Math.max(r, maxLng(p)), -Infinity),
      ],
    ].map(
      (xs, i) =>
        xs.map((x, j) => adjust(x, state.bounds[i][j])) as [number, number]
    ),
    isLoading: false,
  }));

const adjust = (val: number, def: number) =>
  [Infinity, -Infinity].includes(val) ? def : val;

const minLat = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.min(r, p[0]), Infinity);
const maxLat = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.max(r, p[0]), -Infinity);
const minLng = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.min(r, p[1]), Infinity);
const maxLng = (rect: RectangleT) =>
  rect.gcsPoints.reduce((r, p) => Math.max(r, p[1]), -Infinity);
