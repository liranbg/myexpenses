import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, CardGroup, Container, Button, SegmentGroup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import {
	expensesDatesLuxonify,
	getFilteredExpensesByDates,
	slugify,
	tagsToHierarchy
} from '../../helpers';
import { compose } from 'redux';
import ChartDateSelection from '../../components/Charts/ChartDateSelection';
import BarChartCard from '../../components/Charts/BarChartCard';
import PieChartCard from '../../components/Charts/DoughnutChartCard';
import { setDatesRange } from '../../actions';
import { firestoreConnect } from 'react-redux-firebase';
import TagsSelection from '../../components/TagsSelection';

export class ChartsPage extends Component {
	static propTypes = {
		expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
		tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
		fromDate: PropTypes.object,
		toDate: PropTypes.object
	};

	state = {
		selectedTag: null
	};

	narrowDatesByExpenses = () => {
		const { fromDate, toDate, expenses } = this.props;
		if (expenses.length > 1) {
			const minDate = expenses[0].date.startOf('month');
			const maxDate = expenses[expenses.length - 1].date.endOf('month');
			this.props.dispatch(setDatesRange(fromDate, toDate, minDate, maxDate));
		}
	};

	aggregateExpensesTagsByParent = (expensesTagGroup, parentTag) => {
		let aggregatedTags = {
			[parentTag.name]: [...expensesTagGroup[parentTag.name]]
		};
		parentTag.children.map(
			childTag => (aggregatedTags[childTag.name] = expensesTagGroup[childTag.name])
		);
		aggregatedTags[parentTag.name] = _.sortBy(aggregatedTags[parentTag.name], ['date']);
		return aggregatedTags;
	};

	aggregateExpensesByTagsParents = (expensesTagGroup, tagsHierarchy) => {
		//NOTE: Assumption - Hierarchy depth is 2 (parent->child) only.
		let aggregatedTags = {};
		tagsHierarchy.forEach(parentTag => {
			aggregatedTags[parentTag.name] = [...expensesTagGroup[parentTag.name]];
			parentTag.children.map(childTag => {
				const childTagExpenses = expensesTagGroup[childTag.name].map(o => ({
					...o,
					tag: parentTag.name
				}));
				aggregatedTags[parentTag.name].push(...childTagExpenses);
			});
			aggregatedTags[parentTag.name] = _.sortBy(aggregatedTags[parentTag.name], ['date']);
		});
		return aggregatedTags;
	};

	handleSelectTag = (e, { value }) => {
		this.setState({ selectedTag: value });
	};

	renderSingleTagCharts(groupedExpenses, tagsHierarchy) {
		const houseTag = tagsHierarchy.find(t => t.id === slugify(this.state.selectedTag));
		const houseTags = [houseTag, ...houseTag.children];
		return (
			<React.Fragment>
				<BarChartCard
					expenses={this.aggregateExpensesTagsByParent(groupedExpenses, houseTag)}
					tags={houseTags}
				/>
				<PieChartCard
					expenses={this.aggregateExpensesTagsByParent(groupedExpenses, houseTag)}
					tags={houseTags}
				/>
			</React.Fragment>
		);
	}

	render() {
		const { tags, expenses, selectedFromDate, selectedToDate } = this.props;
		const filteredExpenses = getFilteredExpensesByDates(expenses, selectedFromDate, selectedToDate);
		const groupedExpenses = _.groupBy(filteredExpenses, 'tag');
		const tagsHierarchy = tagsToHierarchy(tags);

		const parentalGroupedExpenses = this.aggregateExpensesByTagsParents(
			groupedExpenses,
			tagsHierarchy
		);
		return (
			<Container>
				<Header size="huge" content="Charts" />
				<SegmentGroup>
					<ChartDateSelection />
					<Segment textAlign={'center'}>
						<Button basic primary onClick={this.narrowDatesByExpenses} content={'Narrow Dates'} />
					</Segment>
					<Segment.Group horizontal>
						<Segment>
							<TagsSelection
								tags={tagsHierarchy}
								multiSelection={false}
								onChange={this.handleSelectTag}
								selectedTags={this.state.selectedTag}
							/>
						</Segment>
						<Segment style={{ flex: 'inherit' }}>
							<Button
								basic
								negative
								onClick={() => this.setState({ selectedTag: null })}
								content={'X'}
								icon={'trash'}
							/>
						</Segment>
					</Segment.Group>
				</SegmentGroup>
				{tags &&
					!!Object.keys(groupedExpenses).length &&
					(this.state.selectedTag ? (
						this.renderSingleTagCharts(groupedExpenses, tagsHierarchy)
					) : (
						<CardGroup>
							<BarChartCard expenses={parentalGroupedExpenses} tags={tagsHierarchy} />
							<PieChartCard expenses={parentalGroupedExpenses} tags={tagsHierarchy} />
						</CardGroup>
					))}
			</Container>
		);
	}
}

const mapStateToProps = ({ firestore: { ordered }, chartsView }) => {
	return {
		expenses: ordered.expenses ? expensesDatesLuxonify(ordered.expenses) : [],
		tags: ordered.tags,
		selectedFromDate: chartsView.selectedFromDate,
		selectedToDate: chartsView.selectedToDate,
		fromDate: chartsView.fromDate,
		toDate: chartsView.toDate
	};
};

export default compose(firestoreConnect(), connect(mapStateToProps))(ChartsPage);
