import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseReducer } from 'react-redux-firebase';
import expensesViewReducer from './expense/expense-view';
import { firestoreReducer } from 'redux-firestore';

const expensesApp = combineReducers({
  expensesView: expensesViewReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  router: routerReducer
});

export default expensesApp;
