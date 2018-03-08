import React, { Component } from 'react';
import { Route } from 'react-router';
import ExpensesPage from '../Expenses';
import ChartsPage from '../Charts';
import TagsPage from '../Tags';
import AddExpensesPage from '../AddExpenses';
import Header from '../../components/Header';
import SignIn from '../../components/SignIn';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';

class MainApp extends Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.router.location.pathname === '/signin' && nextProps.profile.isLoaded)
			this.props.dispatch(replace('/expenses'));
	}
	render() {
		const { profile } = this.props;
		return (
			<React.Fragment>
				<Header />
				{profile.isEmpty ? (
					<SignIn />
				) : (
					<React.Fragment>
						<Route exact path="/expenses" component={ExpensesPage} />
						<Route exact path="/tags" component={TagsPage} />
						<Route exact path="/charts" component={ChartsPage} />
						<Route exact path="/addexpenses" component={AddExpensesPage} />
					</React.Fragment>
				)}
				<div
					style={{
						right: 0,
						bottom: 0,
						left: 0,
						padding: '1em 1em',
						textAlign: 'center',
						margin: '1em 1em 1em'
					}}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	firestoreConnect([
		{ collection: 'expenses', orderBy: ['date'] },
		{ collection: 'tags', orderBy: 'name' }
	]),
	connect(({ firebase: { profile }, router }) => ({
		profile,
		router
	}))
)(MainApp);
