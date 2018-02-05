export function expensesToTagsUses(expenses) {
  let counts = {};
  const sorted = expenses.map(expense => expense.tag).sort();
  sorted.forEach(x => counts[x] = (counts[x] || 0) + 1);
  return counts;
}