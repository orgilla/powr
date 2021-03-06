import { LOCATION_PUSH } from '@powr/router';

export const INIT = 'AUTH_INIT';
export const LOGIN = 'AUTH_LOGIN';
export const LOGOUT = 'AUTH_LOGOUT';
export const SET = 'AUTH_SET';

export default ({ auth0, initialState = {} }) => {
  const name = 'auth';
  const reducer = (state = initialState, action) => {
    if (!action || !action.type) {
      return state;
    }
    switch (action.type) {
      case SET:
        return {
          ...state,
          user: action.payload,
          isAuthenticated: !!action.payload
        };
      default:
        return state;
    }
  };

  const middleware = ({ dispatch, getState }) => nextDispatch => action => {
    if (!auth0) {
      return nextDispatch(action);
    }
    if (action.type === LOGIN) {
      dispatch({
        type: LOCATION_PUSH,
        payload: {
          pathname: '/login'
        }
      });
    } else if (action.type === LOGOUT) {
      dispatch({
        type: LOCATION_PUSH,
        payload: {
          pathname: '/logout'
        }
      });
    } else if (
      action.type === 'LOCATION_CHANGE' &&
      action.payload.pathname === '/login'
    ) {
      auth0.login({ state: getState().location.url });
    } else if (
      action.type === 'LOCATION_CHANGE' &&
      action.payload.pathname === '/logout'
    ) {
      auth0.logout({ state: getState().location.url });
    } else {
      nextDispatch(action);
    }
  };

  return {
    reducer,
    middleware
  };
};
