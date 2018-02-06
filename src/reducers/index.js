import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import expensesReducer from './expense/expense';
import tagsReducer from './tags/tags';
import { firebaseReducer } from 'react-redux-firebase';
import expensesViewReducer from './expense/expense-view';
import { firestoreReducer } from 'redux-firestore';

const expensesApp = combineReducers({
  expensesView: expensesViewReducer,
  expenses: expensesReducer,
  tags: tagsReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  router: routerReducer
});

export default expensesApp;
