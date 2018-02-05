import _ from 'lodash';
import React, { Component } from 'react';
import {
  Container,
  Search,
  Input,
  Button,
  Label,
  Card,
  Icon,
  Checkbox,
  Segment
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterExpensesByTag, setExpenseTag } from '../../actions';
import TimeAgo from 'react-timeago';
import DateFormat from 'dateformat';

class ExpenseCard extends Component {
  componentWillMount() {
    this.resetSearchComponent();
  }

  isExpenseUntagged = () => this.props.expense.tag === 'Untagged';

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
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetSearchComponent();
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.name);
      let results = _.filter(
        this.props.tags.filter(tag => tag.name !== this.props.expense.tag),
        isMatch
      );
      this.setState({
        isLoading: false,
        results: results.map(tag => ({ ...tag, title: tag.name }))
      });
    }, 100);
  };

  deleteExpenseTag = () => {
    this.props.dispatch(setExpenseTag(this.props.expense.key, 'Untagged'));
    this.resetSearchComponent();
  };

  handleFilterByTag = (e, { content }) => {
    this.props.dispatch(filterExpensesByTag(content));
  };

  render() {
    let expense = this.props.expense;
    const { isLoading, value, results } = this.state;
    return (
      <Card>
        <Segment clearing basic secondary style={{ marginBottom: 0 }}>
          <Label
            as={expense.tag ? 'a' : ''}
            onClick={this.handleFilterByTag}
            icon={<Icon name="tag" />}
            content={expense.tag || 'Untagged'}
          />
          {this.isExpenseUntagged() ? null : (
            <Button
              floated="right"
              compact
              basic
              negative
              onClick={this.deleteExpenseTag}
              icon={{ name: 'trash' }}
              size="mini"
            />
          )}
        </Segment>
        <Card.Header
          as="h1"
          content={expense.name}
          textAlign="center"
          style={{ margin: 12 }}
        />
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
        {!this.isExpenseUntagged() ? null : (
          <Card.Content extra>
            <Segment vertical>
              <Container>
                Apply for all expenses with the same name
                <Checkbox
                  toggle
                  style={{ float: 'right' }}
                  checked={this.state.applyForAll}
                  onChange={() =>
                    this.setState({ applyForAll: !this.state.applyForAll })
                  }
                />
              </Container>
              <Search
                style={{ marginTop: 20 }}
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
            </Segment>
          </Card.Content>
        )}
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
