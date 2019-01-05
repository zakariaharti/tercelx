import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { createBrowserHistory } from 'history';
import { hot } from "react-hot-loader";

import routes from './routes';

const isProdMode = process.env.NODE_ENV === 'production';

interface IApp {
  store: Store;
}

const App: React.SFC<IApp> = (props) => (
  <Provider store={props.store}>
    <ConnectedRouter history={createBrowserHistory()}>
      <Router>
        {routes}
      </Router>
    </ConnectedRouter>
  </Provider>
);

/**
 * use hot reloading in development
 */
export default (
  isProdMode ? App : hot(App)(module)
);
