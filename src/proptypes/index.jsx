import PropTypes from 'prop-types';
import moment from 'moment';

moment.locale('en');

export const Tag = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export const Expense = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date)
  ]),
  amount: PropTypes.number.isRequired,
  tag: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  createdBy: PropTypes.string,
  modifiedBy: PropTypes.string
};

export const ExpensesView = {
  filterTags: PropTypes.arrayOf(PropTypes.string.isRequired)
};
