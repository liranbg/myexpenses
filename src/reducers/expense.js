const expenses = (state = [], action) => {
  switch (action.type) {
    case 'SET_TAG':
      state.find(e => e.key === action.key).tag = action.tag;
      return state;
    case 'UNSET_TAG':
      return {
        ...state,
        tag: null
      };
    default:
      return state;
  }
};

export default expenses;
