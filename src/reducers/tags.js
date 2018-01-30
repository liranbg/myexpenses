const tags = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TAG':
      return [...state, { ...action }];
    case 'REMOVE_TAG':
      return state.filter(f => f.key !== action.key);
    default:
      return state;
  }
};

export default tags;
