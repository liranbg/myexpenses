import PropTypes from 'prop-types';

export const Tag = {
  key: PropTypes.string,
  name: PropTypes.string,
  icon: PropTypes.number,
};

export const Expense = {
  key: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  amount: PropTypes.number,
  tag: PropTypes.string,
  currency: PropTypes.string
};
