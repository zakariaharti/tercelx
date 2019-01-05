import { Dispatch } from 'redux';
/**
* This looks at static needs parameter in components and waits for the promise to be fullfilled
* It is used to make sure server side rendered pages wait for APIs to resolve before returning res.end()
*/

export function fetchComponentDataBeforeRender(
  dispatch: Dispatch,
  components: any,
  params: any
) {
  const needs = components.reduce( (prev: any, current: any) => {
    return (current.need || [])
      .concat((current.WrappedComponent ? current.WrappedComponent.need : []) || [])
      .concat(prev);
    }, []);
    const promises = needs.map((need: any) => dispatch(need(params)));
    return Promise.all(promises);
}
