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
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../actions';
import TimeAgo from 'react-timeago';
import DateFormat from 'dateformat';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { getBatch } from '../../firebase';

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
      applyForAll: true,
      applyForUntaggedOnly: true
    });

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    if (this.state.applyForAll) {
      let getOptions = {
        collection: 'expenses',
        where: [['name', '==', this.props.expense.name]]
      };
      if (this.state.applyForUntaggedOnly)
        getOptions.where.push(['tag', '==', 'Untagged']);
      this.props.firestore.get(getOptions).then(queryDocumentSnapshot => {
        const batch = getBatch();
        queryDocumentSnapshot.forEach(doc => {
          batch.update(doc.ref, { tag: result.title });
        });
        batch.commit();
      });
    } else {
      this.props.firestore.update(`expenses/${this.props.expense.id}`, {
        tag: result.title
      });
    }
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
    this.props.firestore.update(`expenses/${this.props.expense.id}`, {
      tag: 'Untagged'
    });
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
        <Segment
          clearing
          basic
          secondary
          style={{ marginBottom: 0, backgroundColor: '#42A5F5' }}
        >
          <Label
            basic
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
            <Container>
              <Icon name="calendar" />
              <Label>
                {DateFormat(new Date(expense.date), 'dddd, mmmm dS, yyyy')} (<TimeAgo
                  date={expense.date}
                />)
              </Label>
            </Container>
            <Container style={{ marginTop: 6 }}>
              <Icon name="money" />
              <Label>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: expense.currency
                }).format(expense.amount)}
              </Label>
            </Container>
          </Card.Meta>
          <Card.Description>{expense.notes}</Card.Description>
        </Card.Content>
        {!this.isExpenseUntagged() ? null : (
          <Card.Content extra>
            <Segment vertical>
              <Container>
                <Checkbox
                  label={
                    <label>Apply for all expenses with the same name</label>
                  }
                  checked={this.state.applyForAll}
                  onChange={() =>
                    this.setState({ applyForAll: !this.state.applyForAll })
                  }
                />
              </Container>
              <Container>
                <Checkbox
                  disabled={!this.state.applyForAll}
                  label={<label>Apply for 'Untagged' expenses only</label>}
                  checked={this.state.applyForUntaggedOnly}
                  onChange={() =>
                    this.setState({
                      applyForUntaggedOnly: !this.state.applyForUntaggedOnly
                    })
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
  expense: PropTypes.object.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

ExpenseCard = compose(firestoreConnect(), connect())(ExpenseCard);

export default ExpenseCard;
