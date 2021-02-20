import {createReducer} from 'typesafe-actions';

import * as Actions from './map.actions';
import {ConfigT} from './models/config';

type State = {
  label: string;
  config: ConfigT;
  isLoading: boolean;
};

const DEFAULT_STATE: State = {
  label: 'What is that?',
  config: [],
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
    isLoading: false,
  }));
