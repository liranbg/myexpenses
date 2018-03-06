import React, { Component } from 'react';
import { CardGroup, Pagination, Segment, Header, Container, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Expense, Tag } from '../../proptypes';
import ExpenseCard from '../../components/Expenses/Expense';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../actions';
import ExpensesSearch from '../../components/Expenses/ExpenseSearch';
import { filterExpensesByTags, filterExpensesByName } from '../../helpers';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import TagsSelection from '../../components/TagsSelection';

class ExpensesScreen extends Component {
	static propTypes = {
		expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
		tags: PropTypes.arrayOf(PropTypes.shape(Tag))
	};

	state = {
		activePage: 1,
		ttlCardsPerPage: 15
	};

	componentWillReceiveProps() {
		this.setState({
			activePage: 1
		});
	}

	handleFilterByTag = (e, { value }) => {
		const next = new Set(value);
		this.props.dispatch(filterExpensesByTag(next));
	};

	handlePaginationChange = (e, { activePage }) => {
		this.setState({
			activePage
		});
	};

	render() {
		const { activePage, ttlCardsPerPage } = this.state;
		const { expenses, tags, selectedTags } = this.props;
		const ttlPages = Math.round(Math.ceil(expenses.length / ttlCardsPerPage));

		return (
			<Container>
				<Header size="huge" content="My Expenses" />
				<Divider />
				<ExpensesSearch expenses={expenses} />
				<Divider hidden />
				<TagsSelection
					multiSelection={true}
					selectedTags={selectedTags}
					tags={tags}
					onChange={this.handleFilterByTag}
				/>
				{expenses.length >= ttlCardsPerPage && (
					<Segment basic textAlign={'center'}>
						<Pagination
							activePage={activePage}
							onPageChange={this.handlePaginationChange}
							totalPages={ttlPages}
						/>
					</Segment>
				)}
				<Divider />
				<CardGroup stackable itemsPerRow={3}>
					{expenses
						.slice((activePage - 1) * ttlCardsPerPage, activePage * ttlCardsPerPage)
						.map((expense, i) => <ExpenseCard key={i} expense={{ ...expense }} tags={tags} />)}
				</CardGroup>
			</Container>
		);
	}
}

export default compose(
	firestoreConnect(),
	connect(({ firestore: { ordered }, expensesView }) => {
		return {
			expenses: ordered.expenses
				? filterExpensesByTags(
						!!expensesView.expenseName
							? filterExpensesByName(ordered.expenses, expensesView.expenseName)
							: ordered.expenses,
						expensesView.selectedTags
				  )
				: [],
			tags: ordered.tags ? ordered.tags : [],
			selectedTags: expensesView.selectedTags
		};
	})
)(ExpensesScreen);
