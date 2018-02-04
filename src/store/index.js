import { createStore, applyMiddleware } from 'redux';
import { setTags } from "../actions";
import reducers, { INITIAL_STATE } from "../reducers";
import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import { tagsCollection } from "../firebase/tags";


const history = createHistory();
const middleware = routerMiddleware(history);


const useMock = false;
const initialState = (state) => {
  state.expenses = useMock ? require('../mocks/expenses') : [];
  state.tags = useMock ? require('../mocks/tags') : [];
  return state;
};

if (!useMock) {
  tagsCollection.onSnapshot((docs) =>
    store.dispatch(setTags(docs.docs.map(tag => (
      {
        key: tag.id,
        ...tag.data()
      }
    )))));
}

const store = createStore(reducers, initialState(INITIAL_STATE), applyMiddleware(middleware));


export default store;
export { history, useMock };