import React, { Component } from 'react';
import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';
import { createBatch } from '../../firebase';
import {
	Message,
	Icon,
	Menu,
	Checkbox,
	Header,
	Container,
	Table,
	Button,
	TableHeaderCell,
	TableBody,
	TableCell,
	TableHeader,
	TableRow
} from 'semantic-ui-react';
import XLSX from 'xlsx';
import DateFormat from 'dateformat';
import TimeAgo from 'react-timeago/lib';
import { buildExpensesByRows, generateExpenseId } from '../../helpers';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import AddExpenseRow from '../../components/Expenses/AddExpenseRow';
import { connect } from 'react-redux';
import { Tag } from '../../proptypes';
import { acceptFiles } from '../../constants';

class AddExpensesScreen extends Component {
	tableHeaders = [
		{
			id: 'name',
			numeric: false,
			disablePadding: true,
			label: 'Name'
		},
		{
			id: 'date',
			numeric: false,
			disablePadding: false,
			label: 'Date'
		},
		{
			id: 'amount',
			numeric: true,
			disablePadding: false,
			label: 'Amount'
		},
		{
			id: 'currency',
			numeric: false,
			disablePadding: false,
			label: 'Currency'
		},
		{
			id: 'tag',
			numeric: false,
			disablePadding: false,
			label: 'Tag'
		},
		{
			id: 'notes',
			numeric: false,
			disablePadding: false,
			label: 'Notes'
		}
	];

	state = {
		showError: false,
		errorMessage: '',
		order: 'ascending',
		orderBy: null,
		selected: [],
		data: [],
		page: 0,
		rowsPerPage: 10,
		saveButtonLoading: false,
		importButtonLoading: false
	};

	expenseValueToNode = (expense, property) => {
		switch (property) {
			case 'date':
				return (
					<React.Fragment>
						{DateFormat(expense[property], 'mmmm dS, yyyy')} (<TimeAgo date={expense[property]} />)
					</React.Fragment>
				);
			case 'tag':
				const { tags } = this.props;
				const tag = tags.find(tag => tag.name === expense[property]);
				const tagName = tag.parent
					? `${tags.find(t => t.id === tag.parent).name}/${tag.name}`
					: tag.name;

				return <React.Fragment>{tagName}</React.Fragment>;
			default:
				return expense[property];
		}
	};

	workbookToSheetRows = (binaryFile, sheetNum = 0) => {
		const workbook = XLSX.read(binaryFile, {
			type: 'binary'
		});
		const ws = workbook.Sheets[workbook.SheetNames[sheetNum]];
		return XLSX.utils.sheet_to_json(ws, { header: 1 });
	};

	handleImport = e => {
		this.setState({ importButtonLoading: true, showError: false });
		const { expensesIds } = this.props;
		const value = e.target.value,
			files = e.target.files;
		if (this.validateXL(value)) {
			const f = files[0];
			const reader = new FileReader();
			reader.onload = e => {
				try {
					const wsRows = this.workbookToSheetRows(e.target.result);
					const expensesRows = buildExpensesByRows(wsRows);
					if (expensesRows.length === 0)
						return this.setState({
							showError: true,
							errorMessage: 'No expenses were found in your excel.'
						});
					this.setState({
						data: expensesRows
							.map(expense => ({
								...expense,
								id: generateExpenseId(
									expense.date,
									expense.name,
									expense.amount,
									expense.currency,
									expense.misparShover
								)
							}))
							.filter(expense => expensesIds.indexOf(expense.id) === -1)
					});
				} catch (err) {
					this.setState({ showError: true, errorMessage: 'There was an error reading your file' });
				} finally {
					e.target.value = null; // we can import again
					this.setState({ importButtonLoading: false });
				}
			};
			reader.readAsBinaryString(f);
		} else
			this.setState({
				importButtonLoading: false,
				showError: true,
				errorMessage: 'Invalid Excel File'
			});
	};

	validateXL = fName => {
		return ['.xlsx', '.xls'].reduce((a, b) => a || fName.endsWith(b), false);
	};

	handleSave = () => {
		const { data } = this.state;
		const { profile, firebase, expensesIds } = this.props;
		this.setState({ saveButtonLoading: true });
		let batch = createBatch();
		data
			.map(expense => ({
				...expense,
				date: expense.date.toJSDate(),
				createdBy: profile.email,
				createdOn: new Date()
			}))
			.filter(expense => expensesIds.indexOf(expense.id) === -1)
			.forEach(expense => {
				const docId = expense.id;
				delete expense.id;
				console.debug('Adding expense ID', docId);
				batch.set(
					firebase
						.firestore()
						.collection('expenses')
						.doc(docId.toString()),
					expense
				);
			});
		batch.commit().finally(() => this.setState({ saveButtonLoading: false, data: [] }));
	};

	handleDeleteSelected = () => {
		const { selected, data } = this.state;
		this.setState({
			data: data.filter(r => !includes(selected, r.id)),
			selected: []
		});
	};

	handleSort = column => () => {
		const { orderBy, data, order } = this.state;
		if (column !== orderBy) {
			this.setState({
				orderBy: column,
				data: sortBy(data, [column]),
				order: 'ascending'
			});
			return;
		}
		this.setState({
			data: data.reverse(),
			order: order === 'ascending' ? 'descending' : 'ascending'
		});
	};

	handleSelectAllClick = () => {
		this.setState({ selected: !!this.state.selected.length ? [] : this.state.data.map(n => n.id) });
	};

	handleRowClick = id => {
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		this.setState({
			selected: newSelected
		});
	};

	handleAddRow = (name, date, amount, currency, tag, notes) => {
		//This function will be called from add expense row
		const { firestore } = this.props;
		const expenseId = generateExpenseId(date, name, amount, currency);
		return firestore
			.firestore()
			.collection('expenses')
			.doc(expenseId)
			.get()
			.then(d => {
				if (d.exists || this.state.data.find(e => e.id === expenseId)) {
					this.setState({
						showError: true,
						errorMessage: `Expense '${name}' already exists (id: ${expenseId})`
					});
					return false;
				}
				let expDoc = {
					name,
					date: date,
					amount: parseInt(amount),
					currency: currency.toUpperCase(),
					localTransaction: currency.toUpperCase() === 'ILS',
					tag,
					notes,
					id: expenseId
				};
				this.setState({
					data: [expDoc, ...this.state.data],
					errorMessage: '',
					showError: false
				});
				return true;
			});
	};

	render() {
		const {
			showError,
			errorMessage,
			data,
			order,
			orderBy,
			selected,
			rowsPerPage,
			page,
			saveButtonLoading,
			importButtonLoading
		} = this.state;
		const ttlPages = Math.floor(data.length / rowsPerPage);
		const { tags } = this.props;

		return (
			<Container>
				<Header size="huge" content="Add Expenses" />
				<Container>
					<input
						style={{ display: 'none' }}
						accept={acceptFiles}
						id="expenses-file"
						type="file"
						onChange={this.handleImport}
					/>
					<Button
						disabled={!data.length || saveButtonLoading}
						loading={saveButtonLoading}
						onClick={this.handleSave}
						primary
					>
						Save
					</Button>
					<Button
						loading={importButtonLoading}
						disabled={importButtonLoading}
						primary
						as={'label'}
						htmlFor="expenses-file"
					>
						Import
					</Button>
					<Message negative hidden={!showError}>
						<Message.Header content={errorMessage} />
					</Message>
				</Container>
				<Table celled inverted selectable sortable>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>
								<Checkbox
									indeterminate={!!selected.length && selected.length < data.length}
									checked={!!selected.length && selected.length === data.length}
									onClick={this.handleSelectAllClick}
								/>
							</TableHeaderCell>
							{this.tableHeaders.map(header => (
								<TableHeaderCell
									onClick={this.handleSort(header.id)}
									sorted={orderBy === header.id ? order : null}
									key={header.id}
									content={header.label}
								/>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.slice(rowsPerPage * page, rowsPerPage * (page + 1)).map((n, i) => {
							const isSelected = includes(selected, n.id);
							return (
								<TableRow key={i} onClick={() => this.handleRowClick(n.id)}>
									<TableCell>
										<Checkbox onClick={() => this.handleRowClick(n.id)} checked={isSelected} />
									</TableCell>
									{this.tableHeaders.map(header => (
										<TableCell key={header.id}>{this.expenseValueToNode(n, header.id)}</TableCell>
									))}
								</TableRow>
							);
						})}
						<AddExpenseRow tags={tags} addRow={this.handleAddRow} />
					</TableBody>
					{!!data.length && (
						<Table.Footer>
							<Table.Row>
								<TableHeaderCell colSpan="3" style={{ borderColor: null }}>
									{!!selected.length && (
										<Button
											compact
											onClick={this.handleDeleteSelected}
											inverted
											icon={'delete'}
											content={`Delete ${selected.length} expenses`}
										/>
									)}
								</TableHeaderCell>
								<Table.HeaderCell colSpan="4">
									<Menu floated="right" pagination inverted>
										{!!page && (
											<Menu.Item
												as="a"
												icon
												onClick={() => {
													this.setState({ page: page - 1 });
												}}
											>
												<Icon name="chevron left" />
											</Menu.Item>
										)}
										{page < ttlPages && (
											<Menu.Item
												as="a"
												icon
												onClick={() => {
													this.setState({ page: page + 1 });
												}}
											>
												<Icon name="chevron right" />
											</Menu.Item>
										)}
									</Menu>
								</Table.HeaderCell>
							</Table.Row>
						</Table.Footer>
					)}
				</Table>
			</Container>
		);
	}
}

export default compose(
	firestoreConnect(),
	connect(({ firebase: { profile }, firestore: { ordered } }) => ({
		profile,
		expensesIds: ordered.expenses ? ordered.expenses.map(e => e.id) : [],
		tags: ordered.tags ? ordered.tags : []
	}))
)(AddExpensesScreen);
