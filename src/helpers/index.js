export function expensesToTagsUses(expenses) {
  let counts = {};
  const sorted = expenses.map(expense => expense.tag).sort();
  sorted.forEach(x => (counts[x] = (counts[x] || 0) + 1));
  return counts;
}

export function firebaseTagsToArray(tags) {
  if (!tags) return [];
  let arrTagsValues = Object.values(tags);
  Object.keys(tags).forEach((key, index) => (arrTagsValues[index].key = key));
  return arrTagsValues;
}
