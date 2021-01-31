import React from 'react';
import ReactDOM from 'react-dom';

import MainPage from 'pages/main/main.page';

import 'index.module.scss';

document.body.innerHTML += '<div id="root"/>';

ReactDOM.render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
  document.getElementById('root')
);
