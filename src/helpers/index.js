import _ from 'lodash';
import { DateTime, Interval } from 'luxon';
import * as md5 from 'md5';

export function expensesToTagsUses(expenses) {
	return Object.assign(
		{},
		..._(expenses)
			.groupBy('tag')
			.values()
			.map(group => ({
				[group[0].tag]: group.length
			}))
	);
}

export function expensesDatesLuxonify(expenses) {
	return expenses.map(expense => ({
		...expense,
		date: DateTime.fromJSDate(expense.date)
	}));
}

export function filterExpensesByTags(expenses, tags) {
	if (!tags.length) return expenses;
	else return _.filter(expenses, expense => _.includes(tags, expense.tag));
}

export function filterExpensesByName(expenses, name) {
	return _.filter(expenses, expense => expense.name === name);
}

export function dateRangeToLabels(startDate, endDate, stepType = 'month') {
	let labels = [];
	const allowedStartOf = ['year', 'years', 'months', 'month', 'day', 'days'];
	let startIterator =
		allowedStartOf.indexOf(stepType) !== -1 ? startDate.startOf(stepType) : startDate;
	let endIterator = allowedStartOf.indexOf(stepType) !== -1 ? endDate.endOf(stepType) : endDate;
	while (startIterator <= endIterator) {
		labels.push(startIterator);
		startIterator = startIterator.plus({ [stepType]: 1 });
	}
	return labels;
}

export function getFilteredExpensesByDates(expenses, fromDate, toDate) {
	return expenses.filter(expense =>
		Interval.fromDateTimes(fromDate, toDate.plus({ days: 1 })).contains(expense.date)
	);
}

function currencySignToText(sign) {
	switch (sign) {
		case '₪':
			return 'ILS';
		case '$':
			return 'USD';
		case '€':
			return 'EUR';
		default:
			return 'UNKNOWN';
	}
}

/**
 * This function generate md5 ID upon its parameters
 * @param d: Luxon Object!
 * @param name
 * @param amount
 * @param currency
 * @param misparShover
 * @returns md5 string
 */
export function generateExpenseId(d, name, amount, currency, misparShover = null) {
	return md5.default(
		[d.toFormat('dd/MM/yyyy'), name, amount, currency, misparShover ? misparShover : ''].join()
	);
}

export function buildExpensesByRows(rows) {
	// ILS Transaction
	//["07/12/2017", "GETT", "46", "₪", "46", "₪", "3425519", ""]
	// Foreign Transaction
	//["02/01/2018", "04/01/2018", "ONLINE", "39.99", "€", "39.99", "€"]
	const regexDate = /\d{2}\/\d{2}\/\d{4}/i;
	const dateIndex = 0,
		nameIndex = 1,
		amountIndex = 4,
		currencyIndex = 5,
		misparShoverIndex = 6,
		notesIndex = 7;
	return rows
		.filter(r => r.length && !!r[dateIndex].match(regexDate) && r[nameIndex] !== '')
		.map(r => {
			// Foreign Transaction -> Add space for MisparShover & Notes
			if (r[dateIndex].match(regexDate) && r[dateIndex + 1].match(regexDate))
				return r.slice(1).concat(['', '']);
			return r;
			//Now we can treat each line the same
		})
		.map(r => ({
			name: r[nameIndex],
			date: DateTime.fromFormat(r[dateIndex], 'dd/MM/yyyy'),
			tag: 'Untagged',
			amount: parseFloat(r[amountIndex]),
			notes: r[notesIndex],
			currency: currencySignToText(r[currencyIndex]),
			localTransaction: r[misparShoverIndex] !== '',
			misparShover: r[misparShoverIndex]
		}));
}
