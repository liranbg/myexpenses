export const INC_TAG = 'INC_TAG';
export const ADD_TAG = 'ADD_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';

export const SET_TAG = 'SET_TAG';
export const UNSET_TAG = 'UNSET_TAG';

export function addTag(tag) {
  return { type: ADD_TAG, payload: tag };
}

export function deleteTag(tagKey) {
  return { type: REMOVE_TAG, payload: { key: tagKey } };
}

export function incTagUses(tagKey) {
  return { type: INC_TAG, payload: { key: tagKey } };
}

export function setExpenseTag(expenseKey, tagName, applyForAll = false) {
  return {
    type: SET_TAG,
    payload: { key: expenseKey, tag: tagName, applyForAll: applyForAll }
  };
}

export function unsetExpenseTag(expenseKey) {
  return { type: UNSET_TAG, payload: { key: expenseKey } };
}
