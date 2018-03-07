import {
	expensesToTagsUses,
	filterExpensesByTags,
	dateRangeToLabels,
	getFilteredExpensesByDates
} from './index';
import { DateTime } from 'luxon';

describe('expensesToTagsUses', () => {
	it('Should aggregate expenses tags', () => {
		const expenses = [
			{
				name: 'a',
				tag: 't1'
			},
			{
				name: 'a',
				tag: 't1'
			},
			{
				name: 'b',
				tag: 't2'
			}
		];
		const tags = expensesToTagsUses(expenses);
		expect(tags).toEqual({
			t1: 2,
			t2: 1
		});
	});
});

describe('filterExpensesByTags', () => {
	it('Should return expenses filtered by a list of tags', () => {
		const expenses = [
			{
				name: 'a',
				tag: 't1'
			},
			{
				name: 'a',
				tag: 't1'
			},
			{
				name: 'b',
				tag: 't2'
			}
		];
		const tags = ['t1'];
		expect(filterExpensesByTags(expenses, tags)).toEqual([
			{
				name: 'a',
				tag: 't1'
			},
			{
				name: 'a',
				tag: 't1'
			}
		]);
	});
});

describe('dateRangeToLabels', () => {
	it('should aggregate weeks of date labels within one month', function() {
		let labelFormat = 'LLLL dd, yyyy';
		let stepType = 'weeks';
		const startDate = DateTime.local(2017, 1, 1);
		const endDate = DateTime.local(2017, 2, 1);
		expect(dateRangeToLabels(startDate, endDate, stepType).map(d => d.toFormat(labelFormat))).toEqual(
			[
				'January 01, 2017',
				'January 08, 2017',
				'January 15, 2017',
				'January 22, 2017',
				'January 29, 2017'
			]
		);
	});

	it('should aggregate years from 2014 to 2018 include', function() {
		let labelFormat = 'yyyy';
		let stepType = 'year';
		const startDate = DateTime.local(2014, 1, 1);
		const endDate = DateTime.local(2018, 1, 1);
		expect(dateRangeToLabels(startDate, endDate, stepType).map(d => d.toFormat(labelFormat))).toEqual(
			['2014', '2015', '2016', '2017', '2018']
		);
	});

	it('should aggregate 3 dates labels between months january and march', function() {
		let labelFormat = 'LLLL yyyy';
		let stepType = 'month';
		const startDate = DateTime.local(2017, 1, 1);
		const endDate = DateTime.local(2017, 3, 1);
		expect(dateRangeToLabels(startDate, endDate, stepType).map(d => d.toFormat(labelFormat))).toEqual(
			['January 2017', 'February 2017', 'March 2017']
		);
	});

	it('should aggregate 2 dates labels between dec 2016 to jan 2017', function() {
		let labelFormat = 'LLLL yyyy';
		let stepType = 'month';
		const startDate = DateTime.local(2016, 12, 1);
		const endDate = DateTime.local(2017, 1, 1);
		expect(dateRangeToLabels(startDate, endDate, stepType).map(d => d.toFormat(labelFormat))).toEqual(
			['December 2016', 'January 2017']
		);
	});

	it('ignores dates days', function() {
		let labelFormat = 'LLLL yyyy';
		let stepType = 'month';
		const startDate = DateTime.local(2017, 1, 15);
		const endDate = DateTime.local(2017, 2, 15);
		expect(dateRangeToLabels(startDate, endDate, stepType).map(d => d.toFormat(labelFormat))).toEqual(
			['January 2017', 'February 2017']
		);
	});
});

describe('getFilteredExpensesByDates', () => {
	it('should filter expenses not in date range', function() {
		const expenses = [
			{
				date: DateTime.local(2018, 1, 1)
			},
			{
				date: DateTime.local(2018, 2, 1)
			},
			{
				date: DateTime.local(2018, 3, 1)
			},
			{
				date: DateTime.local(2018, 4, 1)
			}
		];
		const fromDate = DateTime.local(2018, 2, 1);
		const toDate = DateTime.local(2018, 3, 1);

		expect(getFilteredExpensesByDates(expenses, fromDate, toDate)).toEqual([
			{
				date: DateTime.local(2018, 2, 1)
			},
			{
				date: DateTime.local(2018, 3, 1)
			}
		]);
	});
});
