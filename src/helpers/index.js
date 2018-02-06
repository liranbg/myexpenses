import _ from 'lodash';

export function expensesToTagsUses(expenses) {
  let counts = {};
  expenses
    .map(expense => expense.tag)
    .sort()
    .forEach(x => (counts[x] = (counts[x] || 0) + 1));
  return counts;
}

export function getExpensesFilterByTags(expenses, tags) {
  if (!tags.length) return expenses;
  else return _.filter(expenses, expense => _.includes(tags, expense.tag));
}
