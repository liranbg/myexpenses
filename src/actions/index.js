export const SET_TAGS = 'SET_TAGS';
export const REMOVE_TAG = 'REMOVE_TAG';

export const SET_TAG = 'SET_TAG';
export const UNSET_TAG = 'UNSET_TAG';

export const FILTER_EXPENSES_BY_TAG = 'FILTER_EXPENSES_BY_TAG';
export const REM_FILTER_EXPENSES_BY_TAG = 'REM_FILTER_EXPENSES_BY_TAG';

export const SET_USER = 'SET_USER';

export function setUser(authUser) {
  return {type: SET_USER, payload: authUser};
}

export function deleteTag(tagKey) {
  return {type: REMOVE_TAG, payload: {key: tagKey}};
}

export function filterExpensesByTag(tagName, replaceAll = false) {
  return {type: FILTER_EXPENSES_BY_TAG, payload: {'tagName': tagName, 'replaceAll': replaceAll}};
}

export function remFilterExpensesByTag(tagName) {
  return {type: REM_FILTER_EXPENSES_BY_TAG, payload: {'tagName': tagName}};
}

export function setTags(tags) {
  return {
    type: SET_TAGS,
    payload: tags
  };

}

export function setExpenseTag(expenseKey, tagName, applyForAll = false) {
  return {
    type: SET_TAG,
    payload: {key: expenseKey, tag: tagName, applyForAll: applyForAll}
  };
}
