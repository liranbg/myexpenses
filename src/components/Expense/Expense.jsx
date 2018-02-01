import _ from 'lodash';
import React, { Component } from 'react';
import {
  Search,
  Input,
  Label,
  Card,
  Icon,
  Checkbox,
  Segment
} from 'semantic-ui-react';
import { Expense, Tag } from '../../interfaces/interfaces';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { incTagUses, setExpenseTag } from '../../actions';
import TimeAgo from 'react-timeago';
import DateFormat from 'dateformat';

class ExpenseCard extends Component {
  componentWillMount() {
    this.resetSearchComponent();
  }

  resetSearchComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      value: '',
      applyForAll: false
    });

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    this.props.dispatch(
      setExpenseTag(
        this.props.expense.key,
        result.title,
        this.state.applyForAll
      )
    );
    this.props.dispatch(incTagUses(result.key));
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
              <Icon name="calendar" />
              <span>
                {DateFormat(new Date(expense.date), 'dddd, mmmm dS, yyyy')} (<TimeAgo
                  date={expense.date}
                />)
              </span>
            </p>
            <p>
              <Icon name="money" />
              <span>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: expense.currency
                }).format(expense.amount)}
              </span>
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
            <Segment vertical>
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
              <div style={{ marginTop: 20 }}>
                Apply for all expenses with the same name
                <Checkbox
                  toggle
                  style={{ float: 'right' }}
                  checked={this.state.applyForAll}
                  onChange={() =>
                    this.setState({ applyForAll: !this.state.applyForAll })
                  }
                />
              </div>
            </Segment>
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
