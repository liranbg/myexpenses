import React, { Component } from 'react';
import {
  Segment,
  Checkbox,
  Header,
  Card,
  Container,
  Divider
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Expense, ExpensesView, Tag } from '../../proptypes';
import ExpenseCard from '../../components/Expense';
import { connect } from 'react-redux';
import { firebaseTagsToArray } from '../../helpers';
import { filterExpensesByTag, remFilterExpensesByTag } from '../../actions';
import ExpensesSearch from '../../components/ExpenseSearch';
import { getExpensesFilterByTags } from '../../helpers';

class ExpensesPage extends Component {
  constructor() {
    super();
    this.state = {
      value: ''
    };
    this.selectedItem = this.selectedItem.bind(this);
  }

  selectedItem(value) {
    this.setState({ value: value });
  }

  handleFilterByTag = (e, { label, checked }) => {
    if (checked) this.props.dispatch(filterExpensesByTag(label));
    else this.props.dispatch(remFilterExpensesByTag(label));
  };

  render() {
    const { expenses, tags, expensesView } = this.props;
    const expensesToDisplay = this.state.value
      ? this.props.expenses.filter(r => r.name === this.state.value)
      : expenses;
    return (
      <Container>
        <Header size="huge" content="My Expenses" />
        <Divider />
        <ExpensesSearch onSelected={this.selectedItem} expenses={expenses} />
        <Segment.Group horizontal>
          {!tags.length && (
            <Segment secondary textAlign={'center'} content={'No Tags'} />
          )}
          {tags.map(tag => (
            <Segment key={tag.key}>
              <Checkbox
                checked={expensesView.filterTags.indexOf(tag.name) !== -1}
                label={tag.name}
                onClick={this.handleFilterByTag}
              />
            </Segment>
          ))}
        </Segment.Group>
        <Divider />
        <Card.Group itemsPerRow={3}>
          {expensesToDisplay.map((expense, i) => (
            <ExpenseCard key={i} expense={{ ...expense }} />
          ))}
        </Card.Group>
      </Container>
    );
  }
}

ExpensesPage.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
  tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
  expensesView: PropTypes.shape(ExpensesView)
};

const mapStateToProps = state => ({
  expenses: getExpensesFilterByTags(
    state.expenses,
    state.expensesView.filterTags
  ),
  expensesView: state.expensesView,
  tags: firebaseTagsToArray(state.firestore.ordered.tags)
});

ExpensesPage = compose(firestoreConnect(['tags']), connect(mapStateToProps))(
  ExpensesPage
);
export default ExpensesPage;
