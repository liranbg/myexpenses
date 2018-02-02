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
import { Expense, Tag } from '../../interfaces/interfaces';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterExpensesByTag, incTagUses, setExpenseTag } from '../../actions';
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
      value: this.props.expense.tag || "",
      applyForAll: false
    });

  handleResultSelect = (e, {result}) => {
    this.setState({value: result.title});
    this.props.dispatch(setExpenseTag(this.props.expense.key, result.title, this.state.applyForAll));
    this.props.dispatch(incTagUses(result.key));
  };

  handleSearchChange = (e, {value}) => {
    this.setState({isLoading: true, value});
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetSearchComponent();
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.name);
      let results = _.filter(this.props.tags, isMatch);
      this.setState({
        isLoading: false,
        results: results.map((tag: Tag) => ({...tag, title: tag.name}))
      });
    }, 100);
  };

  handleFilterByTag = (e, {content}) => {
    this.props.dispatch(filterExpensesByTag(content));
  };

  render() {
    let expense: Expense = this.props.expense;
    const {isLoading, value, results} = this.state;
    return (
      <Card>
        <Segment clearing basic secondary style={{marginBottom: 0}}>
          <Label as={expense.tag ? "a" : ""}
                 onClick={this.handleFilterByTag}
                 icon={<Icon name="tag"/>}
                 content={expense.tag || "Untagged"}
          />
          <Button floated="right" compact basic negative icon={{name: "trash"}} size="mini"/></Segment>
        <Card.Header as="h1" content={expense.name} textAlign="center" style={{margin: 12}}/>
        <Card.Content>
          <Card.Meta>
            <p>
              <Icon name="calendar"/>
              <span>
                {DateFormat(new Date(expense.date), 'dddd, mmmm dS, yyyy')} (<TimeAgo
                date={expense.date}
              />)
              </span>
            </p>
            <p>
              <Icon name="money"/>
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
            <Container style={{marginTop: 20}}>
              Apply for all expenses with the same name
              <Checkbox
                toggle
                style={{float: 'right'}}
                checked={this.state.applyForAll}
                onChange={() =>
                  this.setState({applyForAll: !this.state.applyForAll})
                }
              />
            </Container>
          </Segment></Card.Content>
        {!expense.tag ? (
          null
        ) : null}

      </Card>
    );
  }
}

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired
};
const mapStateToProps = state => ({tags: state.tags});
ExpenseCard = connect(mapStateToProps)(ExpenseCard);

export default ExpenseCard;
