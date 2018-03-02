import moment from 'moment';

export const FILTER_EXPENSES_BY_TAG = 'FILTER_EXPENSES_BY_TAG';
export const FILTER_EXPENSES_BY_NAME = 'FILTER_EXPENSES_BY_NAME';
export const SET_DATES_RANGE = 'SET_DATES_RANGE';

export function filterExpensesByTag(tags) {
	return {
		type: FILTER_EXPENSES_BY_TAG,
		payload: {
			tags
		}
	};
}

export function filterExpensesByName(expenseName) {
	return {
		type: FILTER_EXPENSES_BY_NAME,
		payload: {
			expenseName
		}
	};
}

export function setDatesRange(fromDate, toDate, selectedFromDate, selectedToDate) {
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
