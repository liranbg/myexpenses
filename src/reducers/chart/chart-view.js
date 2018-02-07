import { SET_DATES_RANGE } from '../../actions';

export const INITIAL_STATE = {
  fromYearValue: 2014,
  fromMonthValue: 1,
  toYearValue: 2018,
  toMonthValue: 12
};

const chartsViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_DATES_RANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default chartsViewReducer;
