import _ from 'lodash';
import moment from 'moment';

export function expensesToTagsUses(expenses) {
  return Object.assign(
    {},
    ..._(expenses)
      .groupBy('tag')
      .values()
      .map(group => ({ [group[0].tag]: group.length }))
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
  return expenses.filter(expense =>
    expense.date.isBetween(fromDate, toDate, null, '[]')
  );
}
