import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment,
  Header,
  CardGroup,
  Container,
  Button,
  SegmentGroup
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import { getFilteredExpensesByDates } from '../../helpers';
import { compose } from 'redux';
import ChartDateSelection from '../../components/ChartDateSelection';
import BarChartCard from '../../components/Charts/BarChartCard';
import PieChartCard from '../../components/Charts/PieChartCard';
import { setDatesRange } from '../../actions';

export class ChartsPage extends Component {
  narrowDatesByExpenses = () => {
    const { fromDate, toDate, expenses } = this.props;
    if (expenses.length > 1) {
      const minDate = moment(expenses[0].date);
      const maxDate = moment(expenses[expenses.length - 1].date);
      this.props.dispatch(setDatesRange(fromDate, toDate, minDate, maxDate));
    }
  };

  render() {
    const { tags, expenses } = this.props;
    const groupedExpenses = _.groupBy(expenses, 'tag');
    const flattend = [].concat.apply([], [...Object.values(groupedExpenses)]);
    const ttlExpenses = Math.ceil(
      flattend.map(expense => expense.amount).reduce((a, b) => a + b, 0)
    );
    return (
      <Container>
        <Header size="huge" content="Charts" />
        <SegmentGroup>
          <ChartDateSelection />
          <Segment textAlign={'center'}>
            <Button
              onClick={this.narrowDatesByExpenses}
              content={'Narrow Dates'}
            />
          </Segment>
        </SegmentGroup>
        {!!Object.keys(groupedExpenses).length && (
          <CardGroup itemsPerRow={2}>
            <PieChartCard expenses={groupedExpenses} tags={tags} />
            <BarChartCard expenses={groupedExpenses} tags={tags} />
          </CardGroup>
        )}
      </Container>
    );
  }
}

ChartsPage.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape(Expense)),
  tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
  fromDate: PropTypes.object,
  toDate: PropTypes.object
};

function momtify(expenses) {
  return expenses.map(expense => ({ ...expense, date: moment(expense.date) }));
}
const mapStateToProps = state => {
  return {
    expenses: getFilteredExpensesByDates(
      momtify(state.firestore.ordered.expenses) || [],
      state.chartsView.selectedFromDate,
      state.chartsView.selectedToDate
    ),
    tags: state.firestore.ordered.tags,
    selectedFromDate: state.chartsView.selectedFromDate,
    selectedToDate: state.chartsView.selectedToDate,
    fromDate: state.chartsView.fromDate,
    toDate: state.chartsView.toDate
  };
};

ChartsPage = compose(connect(mapStateToProps))(ChartsPage);
export default ChartsPage;
