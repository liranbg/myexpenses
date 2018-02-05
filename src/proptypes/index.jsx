import PropTypes from 'prop-types';

export const Tag = {
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export const Expense = {
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  tag: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired
};

export const ExpensesView = {
  filterTags: PropTypes.arrayOf(PropTypes.string.isRequired)
};
