import {createReducer} from 'typesafe-actions';

import * as Actions from './map.actions';

type State = {
  label: string;
  isLoading: boolean;
};

const DEFAULT_STATE: State = {
  label: 'What is that?',
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
  .handleAction(Actions.loadConfig.success, state => ({
    ...state,
    isLoading: false,
  }));
