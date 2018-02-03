import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import MainApp from './pages/MainApp';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import reducers, { INITIAL_STATE } from './reducers';

const history = createHistory();
const middleware = routerMiddleware(history);


function mockData(state) {
  const tags = require('./mocks/tags');
  const expenses = require('./mocks/expenses');
  state.expenses = expenses;
  state.tags = tags;
  return state;
}

const store = createStore(reducers, mockData(INITIAL_STATE), applyMiddleware(middleware));

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
