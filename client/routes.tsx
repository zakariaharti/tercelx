import { RouteConfig } from 'react-router-config';

import App from './modules/App/App';

const routes: RouteConfig[] = [
  {
    exact: true,
    path: '/',
    component: App
  }
];

export default routes;
