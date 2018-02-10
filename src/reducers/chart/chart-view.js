import { SET_DATES_RANGE } from '../../actions';
import moment from 'moment';

export const INITIAL_STATE = {
  fromDate: moment([2014, 0, 1]),
  toDate: moment([2018, 11, 31]), //months starts at 0
  selectedFromDate: moment([2014, 0, 1]),
  selectedToDate: moment([2018, 11, 31]) //months starts at 0
};

function setDate(payload) {
  return {
    fromDate: moment(payload.fromDate),
    toDate: moment(payload.toDate),
    selectedFromDate: moment(payload.selectedFromDate),
    selectedToDate: moment(payload.selectedToDate)
  };
}

const chartsViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_DATES_RANGE:
      return { ...state, ...setDate(action.payload) };
    default:
      return state;
  }
};

export default chartsViewReducer;
