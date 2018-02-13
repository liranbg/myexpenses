import _ from 'lodash'
import React, { Component } from 'react';
import {
  CardGroup,
  Dropdown,
  Pagination,
  Segment,
  Header,
  Container,
  Divider
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Expense, ExpensesView, Tag } from '../../proptypes';
import ExpenseCard from '../../components/Expense';
import { connect } from 'react-redux';
import { filterExpensesByTag, remFilterExpensesByTag } from '../../actions';
import ExpensesSearch from '../../components/ExpenseSearch';
import { getExpensesFilterByTags } from '../../helpers';

class ExpensesPage extends Component {
  state = {
    value: '',
    activePage: 1
  };

  selectedItem = value => {
    this.setState({ value: value, activePage: 1 });
  };

  componentWillReceiveProps() {
    this.setState({ activePage: 1 });
  }

  handleFilterByTag = (e, { value }) => {
    const { expensesView: { filterTags } } = this.props;
    let current = new Set(filterTags);
    let next = new Set(value);
    if (current.size <= next.size) {
      const labelAdded = [...next].find(x => !current.has(x));
      this.props.dispatch(filterExpensesByTag(labelAdded));
    } else {
      const labelRemoved = [...current].find(x => !next.has(x));
      this.props.dispatch(remFilterExpensesByTag(labelRemoved));
    }
  };

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

  render() {
    const ttlCardsPerPage = 15;
    const { activePage } = this.state;
    const { expenses, tags, expensesView } = this.props;
    const expensesToDisplay = this.state.value
      ? this.props.expenses.filter(r => r.name === this.state.value)
      : expenses;
    const ttlPages = Math.round(
      Math.ceil(expensesToDisplay.length / ttlCardsPerPage)
    );
    return (
      <Container>
        <Header size="huge" content="My Expenses" />
        <Divider />
        <ExpensesSearch onSelected={this.selectedItem} expenses={expenses} />
        <Divider hidden />
        {!!tags.length && (
          <Dropdown
            onChange={this.handleFilterByTag}
            placeholder="Filter by Tags"
            fluid
            multiple
            value={expensesView.filterTags}
            search
            selection
            options={tags.map(tag => ({
              key: tag.id,
              value: tag.name,
              text: tag.name
            }))}
          />
        )}
        {/*<Divider hidden={expensesToDisplay.length >= ttlCardsPerPage} />*/}
        {expensesToDisplay.length >= ttlCardsPerPage && (
          <React.Fragment>
            <Segment basic textAlign={'center'}>
              <Pagination
                activePage={activePage}
                onPageChange={this.handlePaginationChange}
                totalPages={ttlPages}
              />
            </Segment>
          </React.Fragment>
        )}
        <Divider />
        <CardGroup stackable itemsPerRow={3}>
          {expensesToDisplay
            .slice(
              (activePage - 1) * ttlCardsPerPage,
              activePage * ttlCardsPerPage
            )
            .map((expense, i) => (
              <ExpenseCard key={i} expense={expense} tags={tags} />
            ))}
        </CardGroup>
      </Container>
    );
  }
}

ExpensesPage.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
  tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
  expensesView: PropTypes.shape(ExpensesView)
};

ExpensesPage.defaultProps = {
  expenses: [],
  tags: [],
  expensesView: { filterTags: [] }
};

const mapStateToProps = state => ({
  expenses: _.sortBy(getExpensesFilterByTags(
    state.firestore.ordered.expenses,
    state.expensesView.filterTags
  ), 'date'),
  expensesView: state.expensesView,
  tags: state.firestore.ordered.tags
});

ExpensesPage = compose(connect(mapStateToProps))(ExpensesPage);
export default ExpensesPage;
