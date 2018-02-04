import { REMOVE_TAG, SET_TAGS } from '../../actions';

const tagsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_TAGS:
      return [...action.payload];
    case REMOVE_TAG:
      return [...state.filter(f => f.key !== action.payload.key)];
    default:
      return state;
  }
};

export default tagsReducer;
