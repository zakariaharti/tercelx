import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from "react-hot-loader";

import { history } from './store';
import routes from './routes';

const isProdMode = process.env.NODE_ENV === 'production';

const App: React.SFC<object> = () => (
  <ConnectedRouter history={history}>
    {renderRoutes(routes)}
  </ConnectedRouter>
);

/**
 * use hot reloading in development
 */
export default (
  isProdMode ? App : hot(module)(App)
);
