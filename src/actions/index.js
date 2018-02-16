import moment from 'moment';

export const FILTER_EXPENSES_BY_TAG = 'FILTER_EXPENSES_BY_TAG';
export const REM_FILTER_EXPENSES_BY_TAG = 'REM_FILTER_EXPENSES_BY_TAG';
export const SET_DATES_RANGE = 'SET_DATES_RANGE';

export function filterExpensesByTag(tagName, replaceAll = false) {
  return {
    type: FILTER_EXPENSES_BY_TAG,
    payload: { tagName: tagName, replaceAll: replaceAll }
  };
}

export function remFilterExpensesByTag(tagName) {
  return { type: REM_FILTER_EXPENSES_BY_TAG, payload: { tagName: tagName } };
}

export function setDatesRange(
  fromDate,
  toDate,
  selectedFromDate,
  selectedToDate
) {
  return {
    type: SET_DATES_RANGE,
    payload: {
      fromDate: moment(fromDate),
      toDate: moment(toDate),
      selectedFromDate: moment(selectedFromDate),
      selectedToDate: moment(selectedToDate)
    }
  };
}
