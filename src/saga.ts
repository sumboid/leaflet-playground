import {all} from 'redux-saga/effects';

import mapSaga from 'domain/map/map.saga';

export default function* () {
  yield all([mapSaga()]);
}
