import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

export const DateType = PropTypes.oneOfType([
	PropTypes.instanceOf(DateTime),
	PropTypes.instanceOf(Date)
]);

export const Tag = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	uses: PropTypes.number
};

export const Expense = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	date: DateType,
	amount: PropTypes.number.isRequired,
	tag: PropTypes.string.isRequired,
	currency: PropTypes.string.isRequired,
	localTransaction: PropTypes.bool.isRequired,
	misparShover: PropTypes.string,
	notes: PropTypes.string,
	createdBy: PropTypes.string.isRequired,
	createdOn: DateType,
	modifiedBy: PropTypes.string
};
