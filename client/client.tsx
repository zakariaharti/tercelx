/**
 * Client entry point
 */
import * as React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import { configureStore } from './store';

// global stylesheet
import "./main.sass";

// Initialize store
// @ts-ignore
const store = configureStore(window.__INITIAL_STATE__);
const mountApp = document.getElementById('root');

hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  mountApp
);

// For hot reloading of react components
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./App', () => {

    hydrate(
      <App />,
      mountApp
    );
  });
}
