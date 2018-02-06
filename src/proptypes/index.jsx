import PropTypes from 'prop-types';

export const Tag = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export const Expense = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  amount: PropTypes.number.isRequired,
  tag: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired
};

export const ExpensesView = {
  filterTags: PropTypes.arrayOf(PropTypes.string.isRequired)
};
