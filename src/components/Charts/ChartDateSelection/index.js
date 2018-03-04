import _ from 'lodash';
import React, { Component } from 'react';
import { Divider, Segment, SegmentGroup, Header, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setDatesRange } from '../../../actions/index';

class ChartDateSelection extends Component {
	monthsOptions = [
		{
			key: 0,
			text: 'January',
			value: 0
		},
		{
			key: 1,
			text: 'February',
			value: 1
		},
		{
			key: 2,
			text: 'March',
			value: 2
		},
		{
			key: 3,
			text: 'April',
			value: 3
		},
		{
			key: 4,
			text: 'May',
			value: 4
		},
		{
			key: 5,
			text: 'June',
			value: 5
		},
		{
			key: 6,
			text: 'July',
			value: 6
		},
		{
			key: 7,
			text: 'August',
			value: 7
		},
		{
			key: 8,
			text: 'September',
			value: 8
		},
		{
			key: 9,
			text: 'October',
			value: 9
		},
		{
			key: 10,
			text: 'November',
			value: 10
		},
		{
			key: 11,
			text: 'December',
			value: 11
		}
	];

	setFromYearValue = (e, { value }) => {
		const { fromDate, toDate, selectedFromDate, selectedToDate } = this.props;
		this.props.dispatch(
			setDatesRange(fromDate, toDate, selectedFromDate.year(value), selectedToDate)
		);
	};

	setFromMonthValue = (e, { value }) => {
		const { fromDate, toDate, selectedFromDate, selectedToDate } = this.props;

		const shouldUpdateToDate =
			selectedFromDate.year() === selectedToDate.year() &&
			selectedToDate.month() <= selectedFromDate.month(value).month();

		this.props.dispatch(
			setDatesRange(
				fromDate,
				toDate,
				selectedFromDate.month(value).startOf('month'),
				shouldUpdateToDate ? selectedToDate.month(value).endOf('month') : selectedToDate
			)
		);
	};

	setToYearValue = (e, { value }) => {
		const { fromDate, toDate, selectedFromDate, selectedToDate } = this.props;
		const shouldUpdateToDateMonth =
			selectedFromDate.year() === value && selectedFromDate.month() > selectedToDate.month();
		this.props.dispatch(
			setDatesRange(
				fromDate,
				toDate,
				selectedFromDate,
				shouldUpdateToDateMonth
					? selectedToDate.year(value).month(selectedFromDate.month())
					: selectedToDate.year(value)
			)
		);
	};

	setToMonthValue = (e, { value }) => {
		const { fromDate, toDate, selectedFromDate, selectedToDate } = this.props;
		this.props.dispatch(
			setDatesRange(fromDate, toDate, selectedFromDate, selectedToDate.month(value).endOf('month'))
		);
	};

	getFromYearsOptions() {
		const { fromDate, toDate } = this.props;
		return _.range(fromDate.year(), toDate.year() + 1).map(num => ({
			key: num,
			text: num.toString(),
			value: num
		}));
	}

	getToYearsOptions() {
		const { selectedFromDate, toDate } = this.props;
		return _.range(selectedFromDate.year(), toDate.year() + 1).map(num => ({
			key: num,
			text: num.toString(),
			value: num
		}));
	}

	render() {
		const { selectedFromDate, selectedToDate } = this.props;
		const fromOptions = this.getFromYearsOptions();
		const toOptions = this.getToYearsOptions();
		let fromMonthsOptions = this.monthsOptions;
		const shouldLimitMonthsSelection = selectedFromDate.year() === selectedToDate.year();

		const toMonthsOptions = shouldLimitMonthsSelection
			? fromMonthsOptions.slice(selectedFromDate.month())
			: fromMonthsOptions;
		return (
			<SegmentGroup horizontal>
				<Segment>
					<Header textAlign={'center'} content={'From Year'} />
					<Dropdown
						value={selectedFromDate.year()}
						onChange={this.setFromYearValue}
						placeholder="Year"
						fluid
						selection
						options={fromOptions}
					/>
					<Divider hidden />
					<Dropdown
						value={selectedFromDate.month()}
						onChange={this.setFromMonthValue}
						placeholder="Year"
						fluid
						selection
						options={fromMonthsOptions}
					/>
				</Segment>
				<Segment>
					<Header textAlign={'center'} content={'To Year'} />
					<Dropdown
						value={selectedToDate.year()}
						onChange={this.setToYearValue}
						placeholder="Year"
						fluid
						selection
						options={toOptions}
					/>
					<Divider hidden />
					<Dropdown
						value={selectedToDate.month()}
						onChange={this.setToMonthValue}
						placeholder="Year"
						fluid
						selection
						options={toMonthsOptions}
					/>
				</Segment>
			</SegmentGroup>
		);
	}
}

ChartDateSelection = connect(state => ({
	fromDate: state.chartsView.fromDate,
	toDate: state.chartsView.toDate,
	selectedFromDate: state.chartsView.selectedFromDate,
	selectedToDate: state.chartsView.selectedToDate
}))(ChartDateSelection);
export default ChartDateSelection;
