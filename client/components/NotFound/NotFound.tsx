import * as React from 'react';

interface INotFound {
  staticContext?: any
}

const NotFound: React.SFC<INotFound> = (props) => {
  const { staticContext } = props;

  if(staticContext){
    staticContext.notFound = true;
  }

  return(
    <div>not found</div>
  );
}

export default NotFound;
