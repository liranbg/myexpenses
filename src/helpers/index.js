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

export function filterExpensesByTags(expenses, tags) {
  if (!tags.length) return expenses;
  else return _.filter(expenses, expense => _.includes(tags, expense.tag));
}

export function dateRangeToLabels(startDate, endDate, monthsStep, labelFormat) {
  let labels = [];
  let iterator = moment(startDate);
  while (iterator.isSameOrBefore(endDate)) {
    labels.push(iterator.format(labelFormat));
    iterator = iterator.add(monthsStep, 'months');
  }
  return labels;
}

export function getFilteredExpensesByDates(expenses, fromDate, toDate) {
  return _.sortBy(expenses, 'date').filter(expense =>
    moment(expense.date).isBetween(fromDate, toDate, null, '[]')
  );
}
