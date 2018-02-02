export const INC_TAG = 'INC_TAG';
export const DEC_TAG = 'DEC_TAG';
export const ADD_TAG = 'ADD_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';

export const SET_TAG = 'SET_TAG';
export const UNSET_TAG = 'UNSET_TAG';

export const FILTER_EXPENSES_BY_TAG = 'FILTER_EXPENSES_BY_TAG';
export const REM_FILTER_EXPENSES_BY_TAG = 'REM_FILTER_EXPENSES_BY_TAG';

export function addTag(tag) {
  return {type: ADD_TAG, payload: tag};
}

export function deleteTag(tagKey) {
  return {type: REMOVE_TAG, payload: {key: tagKey}};
}

export function filterExpensesByTag(tagName) {
  return {type: FILTER_EXPENSES_BY_TAG, payload: {'tagName': tagName}};
}

export function remFilterExpensesByTag(tagName) {
  return {type: REM_FILTER_EXPENSES_BY_TAG, payload: {'tagName': tagName}};
}

export function incTagUses(tagKey) {
  return {type: INC_TAG, payload: {key: tagKey}};
}

export function decTagUses(tagKey) {
  return {type: DEC_TAG, payload: {key: tagKey}};
}

export function setExpenseTag(expenseKey, tagName, applyForAll = false) {
  return {
    type: SET_TAG,
    payload: {key: expenseKey, tag: tagName, applyForAll: applyForAll}
  };
}

export function unsetExpenseTag(expenseKey) {
  return {type: UNSET_TAG, payload: {key: expenseKey}};
}
