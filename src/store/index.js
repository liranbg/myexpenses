import { createStore, applyMiddleware } from 'redux';
import reducers, { INITIAL_STATE } from '../reducers';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import firebase from '../firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import { compose } from 'redux';

const history = createHistory();
const middleware = routerMiddleware(history);

const useMock = true;
const initialState = state => {
  state.expenses = useMock ? require('../mocks/expenses') : [];
  state.tags = useMock ? require('../mocks/tags') : [];
  return state;
};

const rrfConfig = {
  userProfile: 'users',
  presence: 'presence',
  sessions: 'sessions',
  useFirestoreForProfile: true
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const store = createStoreWithFirebase(
  reducers,
  initialState(INITIAL_STATE),
  applyMiddleware(middleware)
);

export default store;
export { history };
