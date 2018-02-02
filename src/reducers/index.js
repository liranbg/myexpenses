import { combineReducers } from 'redux';
import expenses from './expense';
import expensesView from './expense-view';
import tags from './tags';

const expensesApp = combineReducers({
  expensesView,
  expenses,
  tags
});

export default expensesApp;
