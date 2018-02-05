import _ from 'lodash';
import {
  FILTER_EXPENSES_BY_TAG,
  REM_FILTER_EXPENSES_BY_TAG
} from '../../actions';

export const INITIAL_STATE = {
  filterTags: []
};

function setExpensesViewByTag(state, payload) {
  if (payload.replaceAll) state.filterTags = [payload.tagName];
  else state.filterTags = _.union(state.filterTags, [payload.tagName]);
  return state;
}

function remExpensesViewTags(state, payload) {
  state.filterTags = state.filterTags.filter(e => e !== payload.tagName);
  return state;
}

const expensesViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FILTER_EXPENSES_BY_TAG:
      return {
        ...Object.assign({}, setExpensesViewByTag(state, action.payload))
      };
    case REM_FILTER_EXPENSES_BY_TAG:
      return {
        ...Object.assign({}, remExpensesViewTags(state, action.payload))
      };
    default:
      return state;
  }
};

export default expensesViewReducer;
