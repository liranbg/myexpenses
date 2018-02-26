import _ from 'lodash';
import React, { Component } from 'react';
import {
	Container,
	Search,
	CardContent,
	Input,
	Button,
	Label,
	Card,
	Icon,
	Checkbox,
	Segment
} from 'semantic-ui-react';
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../actions';
import TimeAgo from 'react-timeago';
import DateFormat from 'dateformat';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { createBatch } from '../../firebase';

class ExpenseCard extends Component {
	componentWillMount() {
		this.resetSearchComponent();
	}

	isExpenseUntagged = () => this.props.expense.tag === 'Untagged';

	resetSearchComponent = () =>
		this.setState({
			isLoading: false,
			results: [],
			value: '',
			applyForAll: true,
			applyForUntaggedOnly: true
		});

	handleResultSelect = (e, { result }) => {
		const { profile, expense, firestore } = this.props;
		const { applyForUntaggedOnly, applyForAll } = this.state;
		this.setState({
			value: result.title
		});
		const updatedDoc = {
			tag: result.title,
			modifiedBy: profile.email
		};
		if (applyForAll) {
			let getOptions = {
				collection: 'expenses',
				where: [['name', '==', expense.name]],
				storeAs: 'expensesSameName'
			};
			if (applyForUntaggedOnly) {
				getOptions.where.push(['tag', '==', 'Untagged']);
			}

			let batch = createBatch();
			firestore.get(getOptions).then(queryDocumentSnapshot => {
				queryDocumentSnapshot.forEach(doc => {
					batch.update(doc.ref, updatedDoc);
				});
				batch.commit();
			});
		} else {
			firestore.update(`expenses/${expense.id}`, updatedDoc);
		}
	};

	handleSearchChange = (e, { value }) => {
		const { expense, tags } = this.props;
		this.setState({
			isLoading: true,
			value
		});
		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetSearchComponent();
			const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
			const isMatch = result => re.test(result.name);
			let results = _.filter(tags.filter(tag => tag.name !== expense.tag), isMatch);
			this.setState({
				isLoading: false,
				results: results.map(tag => ({
					...tag,
					title: tag.name
				}))
			});
		}, 100);
	};

	deleteExpenseTag = () => {
		const { profile } = this.props;
		this.props.firestore.update(`expenses/${this.props.expense.id}`, {
			tag: 'Untagged',
			modifiedBy: profile.email
		});
		this.resetSearchComponent();
	};

	handleFilterByTag = (e, { content }) => {
		this.props.dispatch(filterExpensesByTag(content));
	};

	render() {
		const { expense, tags } = this.props;
		const { isLoading, value, results, applyForAll, applyForUntaggedOnly } = this.state;
		return (
			<Card
				style={{
					borderBottom: `2px solid ${tags.find(tag => tag.name === expense.tag).color}`
				}}
			>
				<Segment
					clearing
					basic
					secondary
					style={{
						marginBottom: 0,
						backgroundColor: '#42A5F5'
					}}
				>
					<Label
						basic
						as={expense.tag ? 'a' : ''}
						onClick={this.handleFilterByTag}
						icon={<Icon name="tag" />}
						content={expense.tag || 'Untagged'}
					/>
					{this.isExpenseUntagged() ? null : (
						<Button
							floated="right"
							compact
							basic
							negative
							onClick={this.deleteExpenseTag}
							icon={{
								name: 'trash'
							}}
							size="mini"
						/>
					)}
				</Segment>
				<Card.Header
					as="h1"
					content={expense.name}
					textAlign="center"
					style={{
						margin: 2
					}}
				/>
				<Card.Content>
					<Card.Meta>
						<Container>
							<Icon name="calendar" />
							<Label
								children={
									<span>
										{DateFormat(new Date(expense.date), 'mmmm dS, yyyy')} (<TimeAgo date={expense.date} />)
									</span>
								}
							/>
						</Container>
						<Container
							style={{
								marginTop: 6
							}}
						>
							<Icon name="money" />
							<Label
								children={
									<span>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: expense.currency
										}).format(expense.amount)}
									</span>
								}
							/>
						</Container>
						<Container
							style={{
								marginTop: 6
							}}
						>
							<Icon name={'user'} />
							<Label content={`Last updated by: ${expense.modifiedBy}`} />
						</Container>
					</Card.Meta>
					<Card.Description>{expense.notes}</Card.Description>
				</Card.Content>
				{this.isExpenseUntagged() && (
					<CardContent extra>
						<Segment
							vertical
							style={{
								padding: 0
							}}
						>
							<Container>
								<Checkbox
									label={<label>Apply for all expenses with the same name</label>}
									checked={applyForAll}
									onChange={() =>
										this.setState({
											applyForAll: !applyForAll
										})
									}
								/>
							</Container>
							<Container>
								<Checkbox
									disabled={!applyForAll}
									label={<label>Apply for 'Untagged' expenses only</label>}
									checked={applyForUntaggedOnly}
									onChange={() =>
										this.setState({
											applyForUntaggedOnly: !applyForUntaggedOnly
										})
									}
								/>
							</Container>
							<Search
								style={{
									marginTop: 15
								}}
								loading={isLoading}
								onResultSelect={this.handleResultSelect}
								onSearchChange={this.handleSearchChange}
								results={results}
								value={value}
								input={<Input fluid icon="tags" iconPosition="left" placeholder="Enter a Tag's name..." />}
							/>
						</Segment>
					</CardContent>
				)}
			</Card>
		);
	}
}

ExpenseCard.propTypes = {
	expense: PropTypes.object.isRequired,
	tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

ExpenseCard = compose(
	firestoreConnect(),
	connect(({ firebase: { profile } }) => ({
		profile
	}))
)(ExpenseCard);

export default ExpenseCard;
