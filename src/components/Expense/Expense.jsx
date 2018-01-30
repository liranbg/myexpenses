import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Input, Label, Card, Icon } from 'semantic-ui-react';
import { Expense, Tag } from '../../interfaces/interfaces';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ExpenseCard extends Component {
  componentWillMount() {
    this.resetSearchComponent();
  }

  resetSearchComponent = () =>
    this.setState({ isLoading: false, results: [], value: '' });

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    this.props.dispatch({
      ...this.props.expense,
      type: 'SET_TAG',
      tag: result.title
    });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetSearchComponent();
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.name);
      let results = _.filter(this.props.tags, isMatch);
      this.setState({
        isLoading: false,
        results: results.map((tag: Tag) => ({ ...tag, title: tag.name }))
      });
    }, 100);
  };

  render() {
    let expense: Expense = this.props.expense;
    const { isLoading, value, results } = this.state;
    return (
      <Card>
        <Card.Content header={expense.name} />
        <Card.Content>
          <Card.Meta>
            <p>
              <Icon name="calendar" /> {expense.date}
            </p>
            <p>
              <Icon name="money" /> {expense.amount}
            </p>
          </Card.Meta>
          <Card.Description>{expense.notes}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          {expense.tag ? (
            <Label as="a">
              <Icon name="tag" />
              {expense.tag}
            </Label>
          ) : (
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
                  label={{ tag: true, content: 'Set  Tag', as: 'a' }}
                  labelPosition="right"
                  placeholder="Enter tag"
                />
              }
            />
          )}
        </Card.Content>
      </Card>
    );
  }
}

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired
};
const mapStateToProps = state => ({ tags: state.tags });
ExpenseCard = connect(mapStateToProps)(ExpenseCard);

export default ExpenseCard;
