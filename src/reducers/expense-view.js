import _ from 'lodash';
import { FILTER_EXPENSES_BY_TAG, REM_FILTER_EXPENSES_BY_TAG } from '../actions';

const expensesView = (state = [], action) => {
  switch (action.type) {
    case FILTER_EXPENSES_BY_TAG:
      return {...state, filterTags: _.union(state.filterTags, [action.payload.tagName])};
    case REM_FILTER_EXPENSES_BY_TAG:
      return {...state, filterTags: _.filter(state.filterTags, [action.payload.tagName])};
    default:
      return state;
  }
};

export default expensesView;
