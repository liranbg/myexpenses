export const SET_TAG = 'SET_TAG';
export const UNSET_TAG = 'UNSET_TAG';

export const FILTER_EXPENSES_BY_TAG = 'FILTER_EXPENSES_BY_TAG';
export const REM_FILTER_EXPENSES_BY_TAG = 'REM_FILTER_EXPENSES_BY_TAG';

export function filterExpensesByTag(tagName, replaceAll = false) {
  return {
    type: FILTER_EXPENSES_BY_TAG,
    payload: { tagName: tagName, replaceAll: replaceAll }
  };
}

export function remFilterExpensesByTag(tagName) {
  return { type: REM_FILTER_EXPENSES_BY_TAG, payload: { tagName: tagName } };
}

export function setExpenseTag(expenseKey, tagName, applyForAll = false) {
  return {
    type: SET_TAG,
    payload: { key: expenseKey, tag: tagName, applyForAll: applyForAll }
  };
}
