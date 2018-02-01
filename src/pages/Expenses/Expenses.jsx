import _ from 'lodash';
import React, { Component } from 'react';
import {
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

class ExpensesPage extends Component {
  constructor() {
    super();
    this.state = {
      expensesToDisplay: [],
      isLoading: false,
      results: [],
      value: ''
    };
  }

  componentWillMount() {
    this.resetSearchComponent();
  }

  resetSearchComponent = () => {
    this.setState({
      expensesToDisplay: this.props.expenses,
      isLoading: false,
      results: [],
      value: ''
    });
  };

  handleResultSelect = (e, { result }) => {
    this.setState({
      value: result.title,
      expensesToDisplay: this.props.expenses.filter(
        expense => expense.name === result.title
      )
    });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
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

  render() {
    const { expensesToDisplay, isLoading, value, results } = this.state;
    return (
      <Container>
        <Header size="huge">My Expenses</Header>
        <Divider />
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
              placeholder="Enter a Tag's name..."
            />
          }
        />
        <Divider hidden />
        <Card.Group itemsPerRow={3}>
          {expensesToDisplay.map((expense: Expense, i) => (
            <ExpenseCard key={i} expense={expense} />
          ))}
        </Card.Group>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ expenses: state.expenses });
ExpensesPage = connect(mapStateToProps)(ExpensesPage);
export default ExpensesPage;
