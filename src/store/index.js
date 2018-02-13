import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import firebase from '../firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import { compose } from 'redux';

const middlewares = [];
const history = createHistory();
middlewares.push(routerMiddleware(history));

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  // middlewares.push(logger);
}

const store = createStoreWithFirebase(
  reducers,
  applyMiddleware(...middlewares)
);

export default store;
export { history };
