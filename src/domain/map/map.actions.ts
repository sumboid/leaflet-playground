import {createAsyncAction} from 'typesafe-actions';

export const loadConfig = createAsyncAction(
  'CONFIG_LOAD_REQUESTED',
  'CONFIG_LOAD_SUCCEDED',
  'CONFIG_LOAD_FAILED'
)<File, any, Error>();
