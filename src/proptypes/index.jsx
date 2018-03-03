import PropTypes from 'prop-types';
import moment from 'moment';

moment.locale('en');

export const Tag = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired
};

export const Expense = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	date: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
	amount: PropTypes.number.isRequired,
	tag: PropTypes.string.isRequired,
	currency: PropTypes.string.isRequired,
	localTransaction: PropTypes.bool.isRequired,
	misparShover: PropTypes.string,
	notes: PropTypes.string,
	createdBy: PropTypes.string.isRequired,
	createdOn: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
	modifiedBy: PropTypes.string
};
