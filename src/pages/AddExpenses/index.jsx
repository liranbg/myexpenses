import React, { Component } from 'react';
import includes from 'lodash/includes';
import { Header, Container} from 'semantic-ui-react';
import { withStyles } from 'material-ui/styles';
import { Table, Button, InputLabel } from 'material-ui';
import XLSX from 'xlsx';
import {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import { FileUpload, Save } from 'material-ui-icons';
import EnhancedTableHead, { EnhancedTableToolbar } from './TableHead';
import DateFormat from 'dateformat';
import TimeAgo from 'react-timeago/lib/index';
import { buildExpensesByRows } from '../../helpers';

class AddExpensesPage extends Component {
  tableHeaders = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
    {
      id: 'currency',
      numeric: false,
      disablePadding: false,
      label: 'Currency'
    },
    { id: 'tag', numeric: false, disablePadding: false, label: 'Tag' },
    { id: 'notes', numeric: false, disablePadding: false, label: 'Notes' }
  ];

  state = {
    order: 'asc',
    orderBy: 'name',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10
  };

  workbookToSheetRows = (binaryFile, sheetNum = 0) => {
    const workbook = XLSX.read(binaryFile, { type: 'binary' });
    const ws = workbook.Sheets[workbook.SheetNames[sheetNum]];
    return XLSX.utils.sheet_to_json(ws, { header: 1 });
  };

  handleImport = e => {
    if (!this.validateXL(e.target.value)) return;
    const f = e.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const wsRows = this.workbookToSheetRows(e.target.result);
      const expensesRows = buildExpensesByRows(wsRows);
      this.setState({ data: expensesRows.map((expenseRow, index)=>({...expenseRow, id: index}))});
    };
    reader.readAsBinaryString(f);
  };

  validateXL = fName => {
    return ['.xlsx', '.xls'].reduce((a, b) => a || fName.endsWith(b), false);
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

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
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

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Container>
        <Header size="huge" content="Add Expenses" />
          <Container>
              <input
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
             application/vnd.ms-excel, text/comma-separated-values, text/csv, application/csv"
                  className={classes.input}
                  id="expenses-file"
                  type="file"
                  onChange={this.handleImport}
              />
              <Button
                  disabled={true}
                  className={classes.button}
                  component="span"
                  variant="raised"
                  color="primary"
              >
                  Save
                  <Save className={classes.rightIcon} />
              </Button>
              <InputLabel htmlFor="expenses-file">
                  <Button
                      className={classes.button}
                      component="span"
                      variant="raised"
                      color="primary"
                  >
                      Import
                      <FileUpload className={classes.rightIcon} />
                  </Button>
              </InputLabel>
          </Container>
        {!!data.length && (
          <Paper className={classes.root}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              onDelete={this.handleDeleteSelected}
            />
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
                <EnhancedTableHead
                  headers={this.tableHeaders}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      const isSelected = includes(this.state.selected, n.id);
                      return (
                        <TableRow
                          hover
                          onClick={event => this.handleClick(event, n.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isSelected} />
                          </TableCell>
                          <TableCell>{n.name}</TableCell>
                          <TableCell>
                            {DateFormat(n.date, 'mmmm dS, yyyy')} (<TimeAgo
                              date={n.date}
                            />)
                          </TableCell>
                          <TableCell numeric>{n.amount}</TableCell>
                          <TableCell>{n.currency}</TableCell>
                          <TableCell>{n.tag}</TableCell>
                          <TableCell>{n.notes}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={6}
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      backIconButtonProps={{
                        'aria-label': 'Previous Page'
                      }}
                      nextIconButtonProps={{
                        'aria-label': 'Next Page'
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Paper>
        )}
      </Container>
    );
  }
}

export default withStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
    // float: 'right'
  },
  input: {
    display: 'none'
  }
}))(AddExpensesPage);
