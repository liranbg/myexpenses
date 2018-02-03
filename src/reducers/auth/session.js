import { SET_USER } from "../../actions";

export const INITIAL_STATE = {
  user: null,
};


function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER: {
      return {...Object.assign(state, {user: action.payload})};
    }
    default:
      return state;
  }
}

export default sessionReducer;