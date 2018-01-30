import { combineReducers } from 'redux';
import expenses from './expense';
import tags from './tags';

const expensesApp = combineReducers({
  expenses,
  tags
});

export default expensesApp;
