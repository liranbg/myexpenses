import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import MainApp from './pages/MainApp/MainApp';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import expensesApp from './reducers/index';

const expenses = require('./mocks/expenses');
const tags = require('./mocks/tags');

const store = createStore(expensesApp, { expenses: expenses, tags: tags });

ReactDOM.render(
  <BrowserRouter>
    <MainApp store={store} />
  </BrowserRouter>,
  document.getElementById('root')
);
