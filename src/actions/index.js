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
