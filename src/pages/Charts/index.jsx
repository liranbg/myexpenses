import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment,
  Header,
  Card,
  CardGroup,
  Container,
  Button,
  SegmentGroup
} from 'semantic-ui-react';
import { Doughnut, Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import { expensesToTagsUses, getFilteredExpensesByDates } from '../../helpers';
import { compose } from 'redux';
import ChartDateSelection from '../../components/ChartDateSelection';
import BarChartCard from '../../components/BarChartCard';
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
    const { selectedFromDate, selectedToDate, tags, expenses } = this.props;
    let groupedExpenses = _.groupBy(expenses, 'tag');
    groupedExpenses = Object.assign(
      {},
      ...Object.entries(groupedExpenses).map(entry => {
        let reducer = {};
        const tag = entry[0];
        let expenses = entry[1];
        expenses.reduce((a, b) => {
          reducer[b.date.toISOString()] =
            (reducer[b.date.toISOString()] || 0) + b.amount;
        });
        expenses = Object.entries(reducer).map(a => ({
          date: moment(a[0]),
          amount: a[1]
        }));
        entry[1] = expenses;
        return { [tag]: expenses };
      })
    );
    const tagsUses = expensesToTagsUses(expenses);
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
          <CardGroup>
            <BarChartCard expenses={groupedExpenses} tags={tags} />
            <Card fluid>
              <Line
                data={{
                  datasets: Object.entries(groupedExpenses).map(a => ({
                    label: a[0],
                    data: a[1].map(expense => ({
                      x: expense.date,
                      y: expense.amount
                    })),
                    fill: false,
                    backgroundColor: tags.find(tag => tag.name === a[0]).color,
                    lineTension: 0.2
                  }))
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  // scaleBeginAtZero: true,
                  scales: {
                    yAxes: [
                      {
                        type: 'linear',
                        scaleLabel: {
                          display: true,
                          labelString: 'Total Spent'
                        },
                        ticks: {
                          suggestedMin: 0
                        }
                      }
                    ],
                    xAxes: [
                      {
                        type: 'time',
                        scaleLabel: {
                          display: true,
                          labelString: 'Timeline'
                        },
                        time: {
                          min: moment(selectedFromDate),
                          max: moment(selectedToDate),
                          unit: 'month'
                        }
                      }
                    ]
                  }
                }}
              />
            </Card>
            <Card fluid>
              <Doughnut
                data={{
                  labels: tags
                    .filter(tag => tagsUses[tag.name])
                    .map(tag => tag.name),
                  datasets: [
                    {
                      data: tags
                        .filter(tag => tagsUses[tag.name])
                        .map(tag => tagsUses[tag.name] || 0),
                      backgroundColor: tags
                        .filter(tag => tagsUses[tag.name])
                        .map(tag => tag.color)
                    }
                  ]
                }}
                options={{
                  title: {
                    display: true,
                    text: 'Tags uses Doughnut Chart'
                  },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const total = dataset.data.reduce(
                          (previousValue, currentValue) =>
                            previousValue + currentValue
                        );
                        const currentValue = dataset.data[tooltipItem.index];
                        const percentage = Math.floor(
                          currentValue / total * 100 + 0.5
                        );
                        return percentage + '%';
                      }
                    }
                  }
                }}
              />
            </Card>
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

const mapStateToProps = state => {
  return {
    expenses: getFilteredExpensesByDates(
      state.firestore.ordered.expenses || [],
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
