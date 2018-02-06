import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import firebase from '../firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import { compose } from 'redux';

const history = createHistory();
const middleware = routerMiddleware(history);

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  reduxFirestore(firebase)
)(createStore);

const store = createStoreWithFirebase(reducers, applyMiddleware(middleware));

export default store;
export { history };
