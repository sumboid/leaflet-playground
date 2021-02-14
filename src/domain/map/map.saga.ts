import {call} from 'redux-saga/effects';

export default function* () {
  yield call(() => console.log('hello world'));
}
