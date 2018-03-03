import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { filterExpensesByName } from '../../../actions/index';
import { connect } from 'react-redux';

class ExpensesSearch extends Component {
	static propTypes = {
		expenses: PropTypes.array.isRequired
	};

	componentWillMount() {
		this.resetSearchComponent();
	}

	resetSearchComponent = () => {
		this.setState({
			isLoading: false,
			results: [],
			value: ''
		});
		this.props.dispatch(filterExpensesByName(''));
	};

	handleResultSelect = (e, { result }) => {
		this.setState({ value: result.title });
		this.props.dispatch(filterExpensesByName(result.title));
	};

	componentWillReceiveProps() {
		this.setState({ value: this.props.expenseName });
	}

	handleSearchChange = (e, { value }) => {
		this.setState({
			isLoading: true,
			value
		});
		setTimeout(() => {
			if (!this.state.value.length) return this.resetSearchComponent();
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
		const { isLoading, results } = this.state;
		const { expenseName } = this.props;
		return (
			<Search
				loading={isLoading}
				onResultSelect={this.handleResultSelect}
				onSearchChange={this.handleSearchChange}
				results={results}
				value={expenseName}
				input={<Input fluid icon="tags" iconPosition="left" placeholder="Enter an Expense name..." />}
			/>
		);
	}
}

ExpensesSearch = connect(({ expensesView }) => ({ expenseName: expensesView.expenseName }))(
	ExpensesSearch
);

export default ExpensesSearch;
