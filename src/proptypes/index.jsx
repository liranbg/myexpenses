import PropTypes from 'prop-types';

export const Tag = {
  key: PropTypes.string,
  name: PropTypes.string
};

export const Expense = {
  key: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  amount: PropTypes.number,
  tag: PropTypes.string,
  currency: PropTypes.string
};

export const ExpensesView = {
  filterTags: PropTypes.arrayOf(PropTypes.string)
};
