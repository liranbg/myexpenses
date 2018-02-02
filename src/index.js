import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import MainApp from './pages/MainApp/MainApp';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import reducers from './reducers';

const tags = require('./mocks/tags');
const expenses = require('./mocks/expenses');

const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(
  reducers,
  {
    expenses: expenses,
    tags: tags,
    expensesView: {
      filterTags: []
    }
  },
  applyMiddleware(middleware)
);

ReactDOM.render(
  <Provider store={store}>
    <MainApp history={history}/>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.dispose(() => ({}));
  module.hot.accept(() => ({}));
}
