import { INC_TAG, REMOVE_TAG, DEC_TAG, SET_TAGS } from '../../actions';

const tagsReducer = (state = [], action) => {
  switch (action.type) {
    case DEC_TAG:
      state.find(s => s.key === action.payload.key).uses--;
      return [...state];
    case INC_TAG:
      state.find(s => s.key === action.payload.key).uses++;
      return [...state];
    case SET_TAGS:
      return [...action.payload];
    case REMOVE_TAG:
      return [...state.filter(f => f.key !== action.payload.key)];
    default:
      return state;
  }
};

export default tagsReducer;
