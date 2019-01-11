import * as React from 'react';
import { Helmet } from 'react-helmet';

import Header from './Components/Header/Header';
import Welcome from './Components/Welcome';

const App: React.SFC<{}> = (props) => (
  <div>
    <Helmet
       title="Awesome app - Your App"
       titleTemplate="%s - Your App"
    >
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
    <Header />
    <Welcome />
    <div>
      {props.children}
    </div>
  </div>
);

export default App;
