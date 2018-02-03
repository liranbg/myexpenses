import _ from 'lodash';
import React, { Component } from 'react';
import {
  Segment,
  Checkbox,
  Header,
  Card,
  Container,
  Search,
  Input,
  Divider
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Expense, ExpensesView, Tag } from '../../proptypes';
import ExpenseCard from '../../components/Expense';
import { connect } from 'react-redux';
import { filterExpensesByTag, remFilterExpensesByTag } from "../../actions";

class ExpensesPage extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      results: [],
      value: '',
    };
  }

  componentWillMount() {
    this.resetSearchComponent();
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
        results: results.map((expense) => ({
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
    const {isLoading, value, results} = this.state;
    const {expenses, tags, expensesView} = this.props;
    return (
      <Container>
        <Header size="huge" content="My Expenses"/>
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
        <Segment.Group horizontal>
          {
            tags.map(tag => (
              <Segment key={tag.key}>
                <Checkbox checked={expensesView.filterTags.indexOf(tag.name) !== -1}
                          label={tag.name}
                          onClick={this.handleFilterByTag}
                />
              </Segment>
            ))}
        </Segment.Group>
        <Divider/>
        <Card.Group itemsPerRow={3}>
          {
            expenses.map((expense, i) => (
              <ExpenseCard key={i} expense={expense}/>
            ))
          }
        </Card.Group>
      </Container>
    );
  }
}

const getExpensesFilterByTags = (expenses, tags) => {
  if (!tags.length) return expenses;
  else return _.filter(expenses, (expense) => _.includes(tags, expense.tag));
};

ExpensesPage.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
  tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
  expensesView: PropTypes.shape(ExpensesView)
};
const mapStateToProps = state => ({
  expenses: getExpensesFilterByTags(state.expenses, state.expensesView.filterTags),
  expensesView: state.expensesView,
  tags: state.tags
});
ExpensesPage = connect(mapStateToProps)(ExpensesPage);
export default ExpensesPage;
