import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Input } from 'semantic-ui-react';
import { Expense, ExpensesView, Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import ExpensesPage from '../../pages/Expenses';

class ExpensesSearch extends Component {
	componentWillMount() {
		this.resetSearchComponent();
	}

	resetSearchComponent = () => {
		this.setState({
			isLoading: false,
			results: [],
			value: ''
		});
		this.props.onSelected('');
	};

	handleResultSelect = (e, { result }) => {
		this.setState({
			value: result.title
		});
		this.props.onSelected(result.title);
	};

	handleSearchChange = (e, { value }) => {
		this.setState({
			isLoading: true,
			value
		});
		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetSearchComponent();
			const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
			const isMatch = result => re.test(result.name);
			let results = _.uniqBy(_.filter(this.props.expenses, isMatch), 'name');
			this.setState({
				isLoading: false,
				results: results.map(expense => ({
					title: expense.name
				}))
			});
		}, 100);
	};

	render() {
		const { isLoading, value, results } = this.state;
		return (
			<Search
				loading={isLoading}
				onResultSelect={this.handleResultSelect}
				onSearchChange={this.handleSearchChange}
				results={results}
				value={value}
				input={<Input fluid icon="tags" iconPosition="left" placeholder="Enter an Expense name..." />}
			/>
		);
	}
}

ExpensesSearch.propTypes = {
	expenses: PropTypes.array.isRequired,
	onSelected: PropTypes.func.isRequired
};

export default ExpensesSearch;
