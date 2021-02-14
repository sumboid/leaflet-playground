import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import MainPage from 'pages/main/main.page';
import createStore from 'store';

import 'index.module.scss';

document.body.innerHTML += '<div id="root"/>';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore()}>
      <MainPage />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
