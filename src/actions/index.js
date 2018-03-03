import moment from 'moment';

export const FILTER_EXPENSES_BY_TAG = 'FILTER_EXPENSES_BY_TAG';
export const FILTER_EXPENSES_BY_NAME = 'FILTER_EXPENSES_BY_NAME';
export const SET_DATES_RANGE = 'SET_DATES_RANGE';

const filterExpensesByTag = tags => {
	return {
		type: FILTER_EXPENSES_BY_TAG,
		payload: {
			tags
		}
	};
};

const filterExpensesByName = expenseName => {
	return {
		type: FILTER_EXPENSES_BY_NAME,
		payload: {
			expenseName
		}
	};
};

const setDatesRange = (fromDate, toDate, selectedFromDate, selectedToDate) => {
	return {
		type: SET_DATES_RANGE,
		payload: {
			fromDate: moment(fromDate),
			toDate: moment(toDate),
			selectedFromDate: moment(selectedFromDate),
			selectedToDate: moment(selectedToDate)
		}
	};
};

export { filterExpensesByName, filterExpensesByTag, setDatesRange };
