import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, CardGroup, Container, Button, SegmentGroup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import { expensesDatesMomentify, getFilteredExpensesByDates } from '../../helpers';
import { compose } from 'redux';
import ChartDateSelection from '../../components/Charts/ChartDateSelection';
import BarChartCard from '../../components/Charts/BarChartCard';
import PieChartCard from '../../components/Charts/DoughnutChartCard';
import { setDatesRange } from '../../actions';
import { firestoreConnect } from 'react-redux-firebase';

export class ChartsPage extends Component {
	static propTypes = {
		expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
		tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
		fromDate: PropTypes.object,
		toDate: PropTypes.object
	};

	narrowDatesByExpenses = () => {
		const { fromDate, toDate, expenses } = this.props;
		if (expenses.length > 1) {
			const minDate = moment(expenses[0].date).startOf('month');
			const maxDate = moment(expenses[expenses.length - 1].date).endOf('month');
			this.props.dispatch(setDatesRange(fromDate, toDate, minDate, maxDate));
		}
	};

	render() {
		const { tags, expenses, selectedFromDate, selectedToDate } = this.props;
		const filteredExpenses = getFilteredExpensesByDates(expenses, selectedFromDate, selectedToDate);
		const groupedExpenses = _.groupBy(filteredExpenses, 'tag');
		return (
			<Container>
				<Header size="huge" content="Charts" />
				<SegmentGroup>
					<ChartDateSelection />
					<Segment textAlign={'center'}>
						<Button onClick={this.narrowDatesByExpenses} content={'Narrow Dates'} />
					</Segment>
				</SegmentGroup>
				{!!Object.keys(groupedExpenses).length &&
					tags && (
						<CardGroup>
							<BarChartCard expenses={groupedExpenses} tags={tags} />
							<PieChartCard expenses={groupedExpenses} tags={tags} />
						</CardGroup>
					)}
			</Container>
		);
	}
}

const mapStateToProps = ({ firestore: { ordered }, chartsView }) => {
	return {
		expenses: ordered.expenses ? expensesDatesMomentify(ordered.expenses) : [],
		tags: ordered.tags,
		selectedFromDate: chartsView.selectedFromDate,
		selectedToDate: chartsView.selectedToDate,
		fromDate: chartsView.fromDate,
		toDate: chartsView.toDate
	};
};

export default compose(
	firestoreConnect(),
	connect(mapStateToProps)
)(ChartsPage);
