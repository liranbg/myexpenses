import { SET_DATES_RANGE } from '../../actions';
import { DateTime } from 'luxon';

export const INITIAL_STATE = {
	fromDate: DateTime.utc(2016).startOf('year'),
	toDate: DateTime.utc(2018).endOf('year'),
	selectedFromDate: DateTime.utc(2016).startOf('year'),
	selectedToDate: DateTime.utc(2018).endOf('year')
};

function setDate(payload) {
	return {
		fromDate: payload.fromDate,
		toDate: payload.toDate,
		selectedFromDate: payload.selectedFromDate,
		selectedToDate: payload.selectedToDate
	};
}

const chartsViewReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_DATES_RANGE:
			return Object.assign({ ...state }, setDate(action.payload));
		default:
			return state;
	}
};

export default chartsViewReducer;
