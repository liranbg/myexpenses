import { createStore, applyMiddleware } from 'redux';
import reducers, { INITIAL_STATE } from "../reducers";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import { tagsCollection } from "../firebase/tags";
import { setTags } from "../actions";


const history = createHistory();
const middleware = routerMiddleware(history);


function mockData(state) {
  const tags = require('../mocks/tags');
  const expenses = require('../mocks/expenses');
  state.expenses = expenses;
  state.tags = tags;
  return state;
}

const store = createStore(reducers, mockData(INITIAL_STATE), applyMiddleware(middleware));

tagsCollection.onSnapshot((docs) =>
  store.dispatch(setTags(docs.docs.map(tag => ({key: tag.id, ...tag.data()}))))
);

export default store;
export { history };