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
import { Expense, Tag } from '../../proptypes';
import ExpenseCard from '../../components/Expense';
import { connect } from 'react-redux';
import { filterExpensesByTag, remFilterExpensesByTag } from '../../actions';
import ExpensesSearch from '../../components/ExpenseSearch';
import { filterExpensesByTags } from '../../helpers';

class ExpensesPage extends Component {
  state = {
    value: '',
    activePage: 1,
    ttlCardsPerPage: 15
  };

  selectedItem = value => {
    this.setState({ value: value, activePage: 1 });
  };

  componentWillReceiveProps() {
    this.setState({ activePage: 1 });
  }

  handleFilterByTag = (e, { value }) => {
    const { filterTags } = this.props;
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
    const { activePage, ttlCardsPerPage } = this.state;
    const { expenses, tags, filterTags } = this.props;
    const expensesToDisplay = filterExpensesByTags(
      this.state.value
        ? this.props.expenses.filter(r => r.name === this.state.value)
        : expenses,
      filterTags
    );
    const ttlPages = Math.round(
      Math.ceil(expensesToDisplay.length / ttlCardsPerPage)
    );
    // const ttlAmount = Math.ceil(
    //   expensesToDisplay.reduce((a, b) => a + b.amount, 0)
    // );
    // console.debug(ttlAmount);
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
            value={filterTags}
            search
            selection
            options={tags.map(tag => ({
              key: tag.id,
              value: tag.name,
              text: tag.name
            }))}
          />
        )}
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
  filterTags: PropTypes.array
};

ExpensesPage.defaultProps = {
  expenses: [],
  tags: [],
  filterTags: []
};

ExpensesPage = connect(state => ({
  expenses: state.firestore.ordered.expenses,
  filterTags: state.expensesView.filterTags,
  tags: state.firestore.ordered.tags
}))(ExpensesPage);
export default ExpensesPage;
