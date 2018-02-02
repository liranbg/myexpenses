import { combineReducers } from 'redux';
import expenses from './expense';
import expensesView from './expense-view';
import tags from './tags';
import { routerReducer} from 'react-router-redux';

const expensesApp = combineReducers({
  expensesView,
  expenses,
  tags,
  router: routerReducer
});

export default expensesApp;
