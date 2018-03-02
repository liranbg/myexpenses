import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Button, ButtonGroup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tag } from '../../../proptypes';
import { dateRangeToLabels } from '../../../helpers';

class BarChartCard extends Component {
	viewTypeFormatMap = {
		day: 'MMM Do',
		week: 'MMMM D',
		month: 'MMMM YYYY',
		quarter: '[Q]Q YYYY',
		year: 'YYYY'
	};

	state = {
		viewType: 'week'
	};

	componentWillReceiveProps() {
		this.setState({
			viewType: 'week'
		});
	}

	mapExpensesByLabels(expenses, labels) {
		let datapoints = [];
		const { tags } = this.props;
		Object.entries(expenses).forEach(entry => {
			let key = entry[0];
			let values = entry[1];
			const tag = tags.find(tag => tag.name === key);
			let datapoint = {
				label: key,
				data: Array(labels.length).fill(0),
				backgroundColor: tag ? tag.color : '#000'
			};

			let labelTip = 0;
			values.forEach(value => {
				while (labelTip < labels.length && labels[labelTip].isSameOrBefore(value.date)) labelTip++;
				datapoint.data[labelTip - 1] += value.amount;
			});
			datapoints.push(datapoint);
		});
		return datapoints;
	}

	render() {
		const { viewType } = this.state;
		const { expenses, fromDate, toDate } = this.props;
		const datesRange = dateRangeToLabels(fromDate, toDate, viewType);
		let mappedExpenses = this.mapExpensesByLabels(expenses, datesRange);
		const labels = datesRange.map(d => d.format(this.viewTypeFormatMap[viewType]));
		return (
			<Card fluid>
				<ButtonGroup toggle>
					{toDate.diff(fromDate, 'months') <= 1 && (
						<Button
							active={viewType === 'day'}
							onClick={() => {
								this.setState({
									viewType: 'day'
								});
							}}
							content={'Daily'}
						/>
					)}

					<Button
						active={viewType === 'week'}
						onClick={() => {
							this.setState({
								viewType: 'week'
							});
						}}
					>
						Weekly
					</Button>
					{toDate.diff(fromDate, 'weeks') > 4 && (
						<Button
							active={viewType === 'month'}
							onClick={() => {
								this.setState({
									viewType: 'month'
								});
							}}
							content={'Monthly'}
						/>
					)}
					{toDate.diff(fromDate, 'months') >= 8 && (
						<Button
							active={viewType === 'quarter'}
							onClick={() => {
								this.setState({
									viewType: 'quarter'
								});
							}}
							content={'Quarterly'}
						/>
					)}
					{toDate.diff(fromDate, 'years') >= 1 && (
						<Button
							active={viewType === 'year'}
							onClick={() => {
								this.setState({
									viewType: 'year'
								});
							}}
							content={'Yearly'}
						/>
					)}
				</ButtonGroup>
				<Bar
					data={{
						labels: labels,
						datasets: mappedExpenses
					}}
					options={{
						responsive: true,
						title: {
							display: false,
							text: ''
						},
						tooltips: {
							mode: 'index',
							// intersect: false,
							callbacks: {
								label: function(tooltipItem, data) {
									const corporation = data.datasets[tooltipItem.datasetIndex].label;
									const valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

									// Loop through all datasets to get the actual total of the index
									let total = 0;
									for (let i = 0; i < data.datasets.length; i++)
										total += data.datasets[i].data[tooltipItem.index];

									const datasetTooltip =
										corporation +
										' : ' +
										Math.ceil(valor)
											.toFixed(2)
											.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

									// If it is not the last dataset, you display it as you usually do
									if (tooltipItem.datasetIndex !== data.datasets.length - 1) {
										return datasetTooltip;
									} else {
										// .. else, you display the dataset and the total, using an array
										return [
											corporation +
												' : ' +
												Math.ceil(valor)
													.toFixed(2)
													.replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
											'Total : ' + Math.ceil(total).toFixed(2)
										];
									}
								}
							}
						},
						scales: {
							xAxes: [
								{
									stacked: true
								}
							],
							yAxes: [
								{
									stacked: true
								}
							]
						}
					}}
				/>
			</Card>
		);
	}
}

BarChartCard.propTypes = {
	expenses: PropTypes.object,
	tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

BarChartCard = connect(state => ({
	fromDate: state.chartsView.selectedFromDate,
	toDate: state.chartsView.selectedToDate
}))(BarChartCard);
export default BarChartCard;
