import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from "react-hot-loader";

import { historyObj } from './store';
import routes from './routes';
import NotFound from './components/NotFound/NotFound';

const isProdMode = process.env.NODE_ENV === 'production';


const App: React.SFC<object> = () => (
  <ConnectedRouter history={historyObj}>
    {renderRoutes(routes)}
    <Route component={NotFound} />
  </ConnectedRouter>
);

/**
 * use hot reloading in development
 */
export default (
  isProdMode ? App : hot(module)(App)
);
