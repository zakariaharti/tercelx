import { RouteConfig } from 'react-router-config';

import App from './modules/App/App';
import NotFound from './components/NotFound/NotFound';

const routes: RouteConfig[] = [
  {
    exact: true,
    path: '/',
    component: App
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
