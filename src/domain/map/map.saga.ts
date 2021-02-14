import {put, PutEffect, takeEvery, takeLatest} from 'redux-saga/effects';
import {ActionType, isActionOf} from 'typesafe-actions';
import {pipe} from 'fp-ts/lib/pipeable';
import {chain, fold, mapLeft, parseJSON, toError} from 'fp-ts/lib/Either';

import settings from 'settings';

import * as Actions from './map.actions';
import {transform} from './models/rectangle';
import {RawConfig, RawConfigT} from './models/config';

export default function* () {
  yield takeLatest(
    isActionOf(Actions.loadConfig.request),
    handleConfigLoadRequested
  );

  yield takeEvery(
    isActionOf(Actions.loadConfig.failure),
    handleConfigLoadFailed
  );
}

function* handleConfigLoadRequested({
  payload: file,
}: ActionType<typeof Actions.loadConfig.request>) {
  if (file.size > settings.CONFIG_LIMIT) {
    yield put(
      Actions.loadConfig.failure(
        Error(
          `File size is greater than ${settings.CONFIG_LIMIT}: ${file.size}`
        )
      )
    );

    return;
  }

  const content: string = yield file.text();
  const decode = (i: unknown) =>
    pipe(
      RawConfig.decode(i),
      mapLeft(() => Error('Failed to decode config'))
    );

  yield pipe(
    parseJSON(content, toError),
    chain(decode),
    fold<Error, RawConfigT, PutEffect>(
      error => put(Actions.loadConfig.failure(error)),
      config => put(Actions.loadConfig.success(config.map(transform)))
    )
  );
}

function handleConfigLoadFailed({
  payload: error,
}: ActionType<typeof Actions.loadConfig.failure>) {
  console.error(error);
}
