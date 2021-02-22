import {createAsyncAction} from 'typesafe-actions';
import {ConfigT} from './models/config';

export const loadConfig = createAsyncAction(
  'CONFIG_LOAD_REQUESTED',
  'CONFIG_LOAD_SUCCEDED',
  'CONFIG_LOAD_FAILED'
)<File, {config: ConfigT; overlappingRects: Set<number>}, Error>();
