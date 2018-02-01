import { SET_TAG, UNSET_TAG } from '../actions';

const expenses = (state = [], action) => {
  switch (action.type) {
    case SET_TAG:
      let expense = state.find(e => e.key === action.payload.key);
      expense.tag = action.payload.tag;
      if (action.payload.applyForAll)
        state
          .filter(e => e.name === expense.name && !e.tag)
          .map(e => (e.tag = action.payload.tag));

      return state;
    case UNSET_TAG:
      state.find(e => e.key === action.payload.key).tag = null;
      return state;
    default:
      return state;
  }
};

export default expenses;
