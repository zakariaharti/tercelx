import * as React from 'react';
import { renderRoutes } from 'react-router-config';
//import { ConnectedRouter } from 'connected-react-router';
import { hot } from "react-hot-loader";
import { BrowserRouter } from 'react-router-dom';

//import { historyObj } from './store';
import routes from './routes';

const isProdMode = process.env.NODE_ENV === 'production';

const App: React.SFC<object> = () => (
  <BrowserRouter>
    {renderRoutes(routes)}
  </BrowserRouter>
);

/**
 * use hot reloading in development
 */
export default (
  isProdMode ? App : hot(module)(App)
);
