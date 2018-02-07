import _ from 'lodash';

export function expensesToTagsUses(expenses) {
  return Object.assign(
    {},
    ..._(expenses)
      .groupBy('tag')
      .values()
      .map(group => ({ [group[0].tag]: group.length }))
  );
}

export function getExpensesFilterByTags(expenses, tags) {
  if (!tags.length) return expenses;
  else return _.filter(expenses, expense => _.includes(tags, expense.tag));
}
