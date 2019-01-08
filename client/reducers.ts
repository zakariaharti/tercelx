/**
 * Root Reducer
 */
import { combineReducers } from 'redux';
/*import { connectRouter } from 'connected-react-router';
import { History } from 'history';*/

// Import Reducers
import app from './modules/App/AppReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  appState: app,
});
