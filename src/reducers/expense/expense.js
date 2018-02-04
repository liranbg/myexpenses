import { SET_TAG, UNSET_TAG } from '../../actions';


function setTag(state, payload) {
  let expense = state.find(e => e.key === payload.key);
  if (payload.applyForAll) state.filter(e => e.name === expense.name).map(e => (e.tag = payload.tag));
  else expense.tag = payload.tag;
  return state;
}

function unSetTag(state, payload) {
  state.find(e => e.key === payload.key).tag = null;
  return state;
}

const expensesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_TAG:
      return [...setTag(state, action.payload)];
    case UNSET_TAG:
      return [...unSetTag(state, action.payload)];
    default:
      return state;
  }
};

export default expensesReducer;
