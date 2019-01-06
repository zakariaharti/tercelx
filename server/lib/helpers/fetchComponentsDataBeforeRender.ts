import {
  matchRoutes,
  RouteConfig
} from 'react-router-config';

/**
* This looks at static needs parameter in components and waits for the promise to be fullfilled
* It is used to make sure server side rendered pages wait for APIs to resolve before returning res.end()
*/

export function fetchComponentDataBeforeRender(routes: RouteConfig[],pathname: string) {
  const matches = matchRoutes(routes, pathname);
  const promises = matches.map(({ route, match }) => {
    // @ts-ignore
    return route.loadDate ? route.loadDate(match) : Promise.resolve(null);
  });

  return Promise.all(promises);
}
