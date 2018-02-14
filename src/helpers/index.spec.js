import {
  expensesToTagsUses,
  filterExpensesByTags,
  dateRangeToLabels,
  getFilteredExpensesByDates
} from './index';
import moment from 'moment';

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

describe('filterExpensesByTags', () => {
  it('Should return expenses filtered by a list of tags', () => {
    const expenses = [
      { name: 'a', tag: 't1' },
      { name: 'a', tag: 't1' },
      { name: 'b', tag: 't2' }
    ];
    const tags = ['t1'];
    expect(filterExpensesByTags(expenses, tags)).toEqual([
      { name: 'a', tag: 't1' },
      { name: 'a', tag: 't1' }
    ]);
  });
});

describe('dateRangeToLabels', () => {
  it('should aggregate 3 dates labels between months january and march', function() {
    let labelFormat = 'MMMM D, YYYY';
    let step = 1;
    let stepType = 'weeks';
    const startDate = moment('2017-01-01');
    const endDate = moment('2017-02-01');
    expect(
      dateRangeToLabels(startDate, endDate, step, labelFormat, stepType)
    ).toEqual([
      'January 1, 2017',
      'January 8, 2017',
      'January 15, 2017',
      'January 22, 2017',
      'January 29, 2017'
    ]);
  });

  it('should aggregate 3 dates labels between months january and march', function() {
    let labelFormat = 'MMMM YYYY';
    let step = 1;
    let stepType = 'month';
    const startDate = moment('2017-01-01');
    const endDate = moment('2017-03-01');
    expect(
      dateRangeToLabels(startDate, endDate, step, labelFormat, stepType)
    ).toEqual(['January 2017', 'February 2017', 'March 2017']);
  });

  it('should aggregate 2 dates labels between dec 2016 to jan 2017', function() {
    let labelFormat = 'MMMM YYYY';
    let step = 1;
    let stepType = 'month';
    const startDate = moment('2016-12-01');
    const endDate = moment('2017-01-01');
    expect(
      dateRangeToLabels(startDate, endDate, step, labelFormat, stepType)
    ).toEqual(['December 2016', 'January 2017']);
  });

  it('ignores dates days', function() {
    let labelFormat = 'MMMM YYYY';
    let step = 1;
    let stepType = 'month';
    const startDate = moment('2017-01-15');
    const endDate = moment('2017-02-15');
    expect(
      dateRangeToLabels(startDate, endDate, step, labelFormat, stepType)
    ).toEqual(['January 2017', 'February 2017']);
  });
});

describe('getFilteredExpensesByDates', () => {
  it('should filter expenses not in date range', function() {
    const expenses = [
      { date: moment('2018-01-01') },
      { date: moment('2018-02-01') },
      { date: moment('2018-03-01') },
      { date: moment('2018-04-01') }
    ];
    const fromDate = moment('2018-02-01');
    const toDate = moment('2018-03-01');

    expect(getFilteredExpensesByDates(expenses, fromDate, toDate)).toEqual([
      { date: moment('2018-02-01') },
      { date: moment('2018-03-01') }
    ]);
  });
});
