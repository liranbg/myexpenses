import { SET_TAG, UNSET_TAG } from '../actions';

const expenses = (state = [], action) => {
  switch (action.type) {
    case SET_TAG:
      state.find(e => e.key === action.payload.key).tag = action.payload.tag;
      return state;
    case UNSET_TAG:
      state.find(e => e.key === action.payload.key).tag = null;
      return state;
    default:
      return state;
  }
};

export default expenses;
