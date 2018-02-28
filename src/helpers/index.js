import _ from 'lodash';
import moment from 'moment';
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

export function expensesDatesMomentify(expenses) {
	return expenses.map(expense => ({
		...expense,
		date: moment.utc(expense.date)
	}));
}

export function filterExpensesByTags(expenses, tags) {
	if (!tags.length) return expenses;
	else return _.filter(expenses, expense => _.includes(tags, expense.tag));
}

export function dateRangeToLabels(startDate, endDate, stepType = 'month') {
	let labels = [];
	let startIterator = moment(startDate).startOf(stepType);
	let endIterator = moment(endDate).endOf(stepType);
	while (startIterator.isSameOrBefore(endIterator)) {
		labels.push(moment(startIterator));
		startIterator = startIterator.add(1, stepType);
	}
	return labels;
}

export function getFilteredExpensesByDates(expenses, fromDate, toDate) {
	return expenses.filter(expense => expense.date.isBetween(fromDate, toDate, null, '[]'));
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
 * @param dateStr: DD/MM/YYYY
 * @param name
 * @param amount
 * @param currency
 * @param misparShover
 * @returns md5 string
 */
export function generateExpenseId(dateStr, name, amount, currency, misparShover = null) {
	return md5.default([dateStr, name, amount, currency, misparShover ? misparShover : ''].join());
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
			date: moment(r[dateIndex], 'DD/MM/YYYY'),
			tag: 'Untagged',
			amount: parseFloat(r[amountIndex]),
			notes: r[notesIndex],
			currency: currencySignToText(r[currencyIndex]),
			localTransaction: r[misparShoverIndex] !== '',
			misparShover: r[misparShoverIndex]
		}));
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
    idIndex = 6,
    notesIndex = 7;
  return rows
    .filter(r => !!r[dateIndex].match(regexDate) && r[nameIndex] !== '')
    .map(r => {
      if (r[dateIndex].match(regexDate) && r[dateIndex + 1].match(regexDate))
        // Foreign Transaction
        return [...r.slice(1), md5.default(r.slice(1, 5).join()), ''];
      return [
        ...r.slice(0, 6),
        md5.default(r.slice(0, 4).join() + r[idIndex]),
        r[notesIndex]
      ];
    })
    .map(r => ({
      id: r[idIndex],
      name: r[nameIndex],
      date: moment(r[dateIndex], 'DD/MM/YYYY'),
      tag: 'Untagged',
      amount: parseFloat(r[amountIndex]),
      notes: r[notesIndex],
      currency: currencySignToText(r[currencyIndex])
    }));
}
