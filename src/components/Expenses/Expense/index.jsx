import _ from 'lodash';
import React, { Component } from 'react';
import {
	Modal,
	Header,
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
import { Expense, Tag } from '../../../proptypes/index';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../../actions/index';
import TimeAgo from 'react-timeago';
import DateFormat from 'dateformat';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { createBatch } from '../../../firebase/index';
import { tagsToHierarchy } from '../../../helpers';

class DeleteExpenseModal extends Component {
	state = { modalOpen: false };

	static propTypes = {
		handleDelete: PropTypes.func,
		expense: PropTypes.shape(Expense)
	};

	handleOpen = () => this.setState({ modalOpen: true });

	handleClose = () => this.setState({ modalOpen: false });

	handleDeleteApproved = () => {
		this.handleClose();
		this.props.handleDelete();
	};

	render() {
		const { expense } = this.props;
		const { modalOpen } = this.state;
		return (
			<Modal
				dimmer={'blurring'}
				style={{ display: 'block' }}
				trigger={
					<Button
						onClick={this.handleOpen}
						negative
						icon={'trash'}
						floated={'right'}
						basic
						compact
						content={'Delete Expense'}
					/>
				}
				open={modalOpen}
				onClose={this.handleClose}
				basic
				size="small"
			>
				<Header icon="alarm" content="Deleting an Expense" />
				<Modal.Content>
					<p>You are about to delete an Expense named '{expense.name}'</p>
					<p>Are you sure?</p>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={this.handleClose} icon={'remove'} content={'No'} color="red" />
					<Button onClick={this.handleDeleteApproved} icon={'checkmark'} content={'Yes'} color="green" />
				</Modal.Actions>
			</Modal>
		);
	}
}

class ExpenseCard extends Component {
	static propTypes = {
		expense: PropTypes.object.isRequired,
		tags: PropTypes.arrayOf(PropTypes.shape(Tag))
	};

	componentWillMount() {
		this.resetSearchComponent();
	}

	isExpenseUntagged = () => this.props.expense.tag === 'Untagged';

	resetSearchComponent = () =>
		this.setState({
			isLoading: false,
			results: [],
			value: '',
			applyForAll: false,
			applyForUntaggedOnly: true
		});

	setTag = async (expenseName, expenseId, tag, modifiedBy, applyForAll, applyForUntaggedOnly) => {
		const { firestore } = this.props;

		const updatedDoc = {
			tag,
			modifiedBy: modifiedBy
		};

		if (applyForAll) {
			let batch = createBatch();
			let getOptions = {
				collection: 'expenses',
				where: [['name', '==', expenseName]],
				storeAs: 'expensesSameName'
			};
			if (applyForUntaggedOnly) {
				getOptions.where.push(['tag', '==', 'Untagged']);
			}

			const queryDocumentSnapshot = await firestore.get(getOptions);
			queryDocumentSnapshot.docs.map(doc => {
				if (tag !== doc.data().tag) {
					batch.update(doc.ref, updatedDoc);
				}
			});
			batch.commit();
		} else {
			firestore.update({ collection: 'expenses', doc: expenseId }, updatedDoc);
		}
	};

	handleResultSelect = async (e, { result }) => {
		const { profile, expense } = this.props;
		const { applyForUntaggedOnly, applyForAll } = this.state;
		await this.setTag(
			expense.name,
			expense.id,
			result.title,
			profile.email,
			applyForAll,
			applyForUntaggedOnly
		);
		this.resetSearchComponent();
	};

	handleSearchChange = (e, { value }) => {
		const { expense, tags } = this.props;
		this.setState({
			isLoading: true,
			value
		});
		const tagsTree = tagsToHierarchy(tags);
		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetSearchComponent();
			const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
			const isMatch = result => re.test(result.title);
			const source = tagsTree.reduce((memo, tag) => {
				if (tag.name === expense.tag) return memo;
				memo[tag.name] = {
					name: tag.name,
					results: [
						{ title: tag.name },
						...tag.children.reduce((m, c, i) => {
							m[i] = { title: c.name };
							return m;
						}, [])
					]
				};
				return memo;
			}, {});
			const filteredResults = _.reduce(
				source,
				(memo, data, name) => {
					const results = _.filter(data.results, isMatch);
					if (results.length) memo[name] = { name, results };
					return memo;
				},
				{}
			);
			this.setState({
				isLoading: false,
				results: filteredResults
			});
		}, 100);
	};

	deleteExpense = () => {
		console.debug('Deleting expense:', this.props.expense.name);
		this.props.firestore.delete(`expenses/${this.props.expense.id}`);
		this.resetSearchComponent();
	};

	deleteExpenseTag = async () => {
		const { profile, firestore } = this.props;
		const newTag = 'Untagged';
		firestore.update(`expenses/${this.props.expense.id}`, {
			//set as untagged
			tag: newTag,
			modifiedBy: profile.email
		});
		this.resetSearchComponent();
	};

	handleFilterByTag = (e, { content }) => {
		this.props.dispatch(filterExpensesByTag([content]));
	};

	render() {
		const { expense, tags } = this.props;
		const tag = tags.find(tag => tag.name === expense.tag);
		const { isLoading, value, results, applyForAll, applyForUntaggedOnly } = this.state;
		return (
			<Card
				style={{
					borderBottom: `2px solid ${tag ? tag.color : '#000'}`
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
					{this.isExpenseUntagged() ? (
						<DeleteExpenseModal expense={this.props.expense} handleDelete={this.deleteExpense} />
					) : (
						<Button
							floated="right"
							compact
							basic
							negative
							content={'Delete tag'}
							onClick={this.deleteExpenseTag}
							icon={{
								name: 'trash'
							}}
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
							<Label
								content={`Last updated by: ${expense.modifiedBy ? expense.modifiedBy : expense.createdBy}`}
							/>
						</Container>
						{expense.notes && (
							<Container
								style={{
									marginTop: 6
								}}
							>
								<Icon name={'file text'} />
								<Label content={expense.notes} />
							</Container>
						)}
					</Card.Meta>
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
								category
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

export default compose(
	firestoreConnect(),
	connect(({ firebase: { profile } }) => ({
		profile
	}))
)(ExpenseCard);
