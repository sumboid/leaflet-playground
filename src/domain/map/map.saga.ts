import {put, PutEffect, takeEvery, takeLatest} from 'redux-saga/effects';
import {ActionType, isActionOf} from 'typesafe-actions';
import {pipe} from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import settings from 'settings';

import * as Actions from './map.actions';
import {transform} from './models/rectangle';
import {ConfigT, RawConfig} from './models/config';
import {hasIntersection} from './map.utils';

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
  const configE = pipe(
    E.parseJSON(content, E.toError),
    E.chain((i: unknown) =>
      pipe(
        RawConfig.decode(i),
        E.mapLeft(() => Error('Failed to decode config'))
      )
    ),
    E.map(rawConfig => rawConfig.map(transform))
  );

  const overlappingRects = pipe(
    configE,
    E.map(config =>
      config.reduce((res, rect, i) => {
        if (res.has(i)) {
          return res;
        }

        const idx = config.findIndex((x, idx) =>
          idx === i ? false : hasIntersection(x)(rect)
        );

        if (idx >= 0) {
          res.add(i);
          res.add(idx);
        }

        return res;
      }, new Set<number>())
    )
  );

  yield pipe(
    configE,
    E.fold<Error, ConfigT, PutEffect>(
      error => put(Actions.loadConfig.failure(error)),
      config =>
        put(
          Actions.loadConfig.success({
            config,
            overlappingRects: pipe(
              overlappingRects,
              E.getOrElse(() => new Set<number>())
            ),
          })
        )
    )
  );
}

function handleConfigLoadFailed({
  payload: error,
}: ActionType<typeof Actions.loadConfig.failure>) {
  console.error(error);
}
