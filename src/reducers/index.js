import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import expensesReducer from './expense/expense';
import tagsReducer from './tags/tags';
import expensesViewReducer, { INITIAL_STATE as expensesView } from './expense/expense-view';
import sessionReducer, { INITIAL_STATE as session } from './auth/session';

const expensesApp = combineReducers({
  session: sessionReducer,
  expensesView: expensesViewReducer,
  expenses: expensesReducer,
  tags: tagsReducer,
  router: routerReducer
});

export const INITIAL_STATE = {
  expenses: [],
  tags: [],
  expensesView,
  session
};

export default expensesApp;
