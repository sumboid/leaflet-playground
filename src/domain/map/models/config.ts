import * as t from 'io-ts';

import {RawRectangle, RectangleT} from './rectangle';

export const RawConfig = t.readonlyArray(RawRectangle);
export type RawConfigT = t.TypeOf<typeof RawConfig>;

export type ConfigT = Readonly<RectangleT[]>;
