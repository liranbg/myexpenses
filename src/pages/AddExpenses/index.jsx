import React, { Component } from 'react';
import includes from 'lodash/includes';
import {
	Icon,
	Menu,
	Checkbox,
	Input,
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
import { buildExpensesByRows } from '../../helpers';

const acceptFiles =
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel, ' +
	'text/comma-separated-values, text/csv, application/csv';

class AddExpensesPage extends Component {
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
		order: 'asc',
		orderBy: 'name',
		selected: [],
		data: [],
		page: 0,
		rowsPerPage: 10,
		saveButtonLoading: false
	};

	expenseValueToNode = (expense, property) => {
		switch (property) {
			case 'date':
				return (
					<React.Fragment>
						{DateFormat(expense[property], 'mmmm dS, yyyy')} (<TimeAgo date={expense[property]} />)
					</React.Fragment>
				);
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
	    const value = e.target.value, files = e.target.files;
        // this.inputFileRef.value = "";
		if (!this.validateXL(value)) return;
		const f = files[0];
		const reader = new FileReader();
		reader.onload = e => {
			const wsRows = this.workbookToSheetRows(e.target.result);
			const expensesRows = buildExpensesByRows(wsRows);
			this.setState({
				data: expensesRows.map((expenseRow, index) => ({
					...expenseRow,
					id: index
				}))
			});
		};
		reader.readAsBinaryString(f);
        e.target.value = null; // we can import again
	};

	validateXL = fName => {
		return ['.xlsx', '.xls'].reduce((a, b) => a || fName.endsWith(b), false);
	};

	handleSave = e => {
	    this.setState({saveButtonLoading: !this.state.saveButtonLoading})
		// Cancel Button (or set as wait)
		// Save
		// Done
	};

	handleDeleteSelected = () => {
		const { selected, data } = this.state;
		this.setState({
			data: data.filter(r => !includes(selected, r.id)),
			selected: []
		});
	};

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		const data =
			order === 'desc'
				? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
				: this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

		this.setState({
			data,
			order,
			orderBy
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

	render() {
		const {
			data,
			order,
			orderBy,
			selected,
			rowsPerPage,
			page,
			saveButtonLoading
		} = this.state;
		const ttlPages = Math.floor(data.length / rowsPerPage);
		/*
		Add to sorting buttons
		headers={this.tableHeaders}
        numSelected={selected.length}
        order={order}
        orderBy={orderBy}
        onSelectAllClick={this.handleSelectAllClick}
        onRequestSort={this.handleRequestSort}
        rowCount={data.length}
		 */
		return (
			<Container>
				<Header size="huge" content="Add Expenses" />
				<Container>
					<Input
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
					<Button primary as={'label'} htmlFor="expenses-file">
						Import
					</Button>
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
							{this.tableHeaders.map(header => <TableHeaderCell key={header.id} content={header.label} />)}
						</TableRow>
					</TableHeader>
					{!!data.length && (
						<React.Fragment>
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
							</TableBody>
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
						</React.Fragment>
					)}
				</Table>
			</Container>
		);
	}
}

AddExpensesPage = compose(
	firestoreConnect([
		{ collection: 'expenses', orderBy: ['date'] },
		{ collection: 'tags', orderBy: 'name' }
	]),
	connect(({ firebase: { profile }, firestore: { ordered } }) => ({
		profile,
		expensesIds: ordered.expenses.map(e => e.id)
	}))
)(AddExpensesPage);
export default AddExpensesPage;
