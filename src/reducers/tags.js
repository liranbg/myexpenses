import { INC_TAG, ADD_TAG, REMOVE_TAG } from '../actions';

const tags = (state = [], action) => {
  switch (action.type) {
    case INC_TAG:
      state.find(s => s.key === action.payload.key).uses++;
      return [...state];
    case ADD_TAG:
      return [...state, { ...action.payload }];
    case REMOVE_TAG:
      return state.filter(f => f.key !== action.payload.key);
    default:
      return state;
  }
};

export default tags;
