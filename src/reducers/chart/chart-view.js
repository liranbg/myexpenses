import { SET_DATES_RANGE } from '../../actions';
import moment from 'moment';

export const INITIAL_STATE = {
  fromDate: moment
    .utc()
    .year(2014)
    .startOf('year'),
  toDate: moment
    .utc()
    .year(2018)
    .endOf('year'),
  selectedFromDate: moment
    .utc()
    .year(2014)
    .startOf('year'),
  selectedToDate: moment
    .utc()
    .year(2018)
    .endOf('year')
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
