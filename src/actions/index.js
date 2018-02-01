export const INC_TAG = 'INC_TAG';
export const ADD_TAG = 'ADD_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';

export const SET_TAG = 'SET_TAG';
export const UNSET_TAG = 'UNSET_TAG';

export const addTag = tag => ({ type: ADD_TAG, payload: tag });

export const deleteTag = tagKey => ({
  type: REMOVE_TAG,
  payload: { key: tagKey }
});

export const incTagUses = tagKey => ({
  type: INC_TAG,
  payload: { key: tagKey }
});

export const setExpenseTag = (expenseKey, tagName) => ({
  type: SET_TAG,
  payload: { key: expenseKey, tag: tagName }
});

export const unsetExpenseTag = expenseKey => ({
  type: UNSET_TAG,
  payload: { key: expenseKey }
});
