import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import MainApp from './pages/MainApp/MainApp';
import { createStore } from 'redux';
import expensesApp from './reducers/index';
import { Provider } from 'react-redux';

const expenses = require('./mocks/expenses');
const tags = require('./mocks/tags');

const store = createStore(expensesApp, {
  expenses: expenses,
  tags: tags,
  expensesView: {
    filterTags: []
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MainApp/>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.dispose(() => ({}));
  module.hot.accept(() => ({}));
}
