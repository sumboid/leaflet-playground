import React from 'react';
import ReactDOM from 'react-dom';
import 'index.module.scss';
import App from 'pages/main/App';

document.body.innerHTML += '<div id="root"/>';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
