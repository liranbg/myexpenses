import { expensesToTagsUses, getExpensesFilterByTags } from './index';

describe('expensesToTagsUses', () => {
  it('Should aggregate expenses tags', () => {
    const expenses = [
      { name: 'a', tag: 't1' },
      { name: 'a', tag: 't1' },
      { name: 'b', tag: 't2' }
    ];
    const tags = expensesToTagsUses(expenses);
    expect(tags).toEqual({ t1: 2, t2: 1 });
  });
});

describe('getExpensesFilterByTags', () => {
  it('Should return expenses filtered by a list of tags', () => {
    const expenses = [
      { name: 'a', tag: 't1' },
      { name: 'a', tag: 't1' },
      { name: 'b', tag: 't2' }
    ];
    const tags = ['t1'];
    expect(getExpensesFilterByTags(expenses, tags)).toEqual([
      { name: 'a', tag: 't1' },
      { name: 'a', tag: 't1' }
    ]);
  });
});
