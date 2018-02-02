import _ from 'lodash';
import React, { Component } from 'react';
import {
  Checkbox,
  Header,
  Card,
  Container,
  Search,
  Input,
  Divider
} from 'semantic-ui-react';
import { Expense } from '../../interfaces/interfaces';
import ExpenseCard from '../../components/Expense/Expense';
import { connect } from 'react-redux';
import { filterExpensesByTag, remFilterExpensesByTag } from "../../actions";

class ExpensesPage extends Component {
  constructor() {
    super();
    this.state = {
      tagsList: [],
      isLoading: false,
      results: [],
      value: '',
    };
  }

  componentWillMount() {
    this.resetSearchComponent();
    this.setState({tagsList: new Set(this.props.expenses.filter(e => e.tag).map(e => e.tag))});
  }

  resetSearchComponent = () => {
    this.setState({
      isLoading: false,
      results: [],
      value: ''
    });
  };

  handleResultSelect = (e, {result}) => {
    this.setState({
      value: result.title,
      expensesToDisplay: this.props.expenses.filter(expense => expense.name === result.title)
    });
  };

  handleSearchChange = (e, {value}) => {
    this.setState({isLoading: true, value});
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetSearchComponent();
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.name);
      let results = _.filter(this.props.expenses, isMatch);
      this.setState({
        isLoading: false,
        results: results.map((expense: Expense) => ({
          ...expense,
          title: expense.name
        }))
      });
    }, 100);
  };

  handleFilterByTag = (e, {label, checked}) => {
    if (checked)
      this.props.dispatch(filterExpensesByTag(label));
    else
      this.props.dispatch(remFilterExpensesByTag(label));
  };

  render() {
    const {tagsList, isLoading, value, results} = this.state;
    const expensesToDisplay = this.props.expenses;
    return (
      <Container>
        <Header size="huge">My Expenses</Header>
        <Divider/>
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          results={results}
          value={value}
          input={
            <Input
              fluid
              icon="tags"
              iconPosition="left"
              placeholder="Enter an Expense name..."
            />
          }
        />
        <Divider/>
        {
          Array.from(tagsList).map(tagName => (
            <Checkbox checked={this.props.expensesView.filterTags.indexOf(tagName) !== -1}
                      label={tagName}
                      key={tagName}
                      onClick={this.handleFilterByTag}
            />)
          )
        }
        <Divider/>
        <Card.Group itemsPerRow={3}>
          {expensesToDisplay.map((expense: Expense, i) => (
            <ExpenseCard key={i} expense={expense}/>
          ))}
        </Card.Group>
      </Container>
    );
  }
}

const getExpensesFilterByTags = (expenses, tags) => {
  if (!tags.length) return expenses;
  else return _.filter(expenses, (expense) => _.includes(tags, expense.tag));
};

const mapStateToProps = state => ({
  expenses: getExpensesFilterByTags(state.expenses, state.expensesView.filterTags),
  expensesView: state.expensesView
});
ExpensesPage = connect(mapStateToProps)(ExpensesPage);
export default ExpensesPage;
