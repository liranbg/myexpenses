import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Card, CardGroup, Container } from 'semantic-ui-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import { expensesToTagsUses, getFilteredExpensesByDates } from '../../helpers';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import ChartDateSelection from '../../components/ChartDateSelection';
import { setDatesRange } from '../../actions';

const INITIAL_DATE_RANGE = {
  fromYearValue: 2014,
  fromMonthValue: 1,
  toYearValue: 2018,
  toMonthValue: 12
};

export class ChartsPage extends Component {
  onSelected = value => {
    this.props.dispatch(
      setDatesRange(
        value.fromYearValue,
        value.toYearValue,
        value.fromMonthValue,
        value.toMonthValue
      )
    );
  };

  componentWillUnmount() {
    this.props.dispatch(
      setDatesRange(
        INITIAL_DATE_RANGE.fromYearValue,
        INITIAL_DATE_RANGE.toYearValue,
        INITIAL_DATE_RANGE.fromMonthValue,
        INITIAL_DATE_RANGE.toMonthValue
      )
    );
  }

  render() {
    const { fromDate, toDate, tags, expenses } = this.props;
    const groupedExpenses = _.groupBy(expenses, 'tag');
    const tagsUses = expensesToTagsUses(expenses);
    return (
      <Container>
        <Header size="huge" content="Charts" />
        <ChartDateSelection
          onSelected={this.onSelected}
          minYear={2014}
          maxYear={2018}
        />
        {!!Object.keys(groupedExpenses).length && (
          <CardGroup>
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
                  scaleBeginAtZero: true,
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
                          min: fromDate,
                          max: toDate,
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
            <Card fluid>
              <Bar
                //TODO: This chart should sum all expenses within each month
                //TODO This chart should support month view and year view
                data={{
                  labels: [
                    'Red',
                    'Blue',
                    'Yellow',
                    'Green',
                    'Purple',
                    'Orange'
                  ],
                  datasets: [
                    {
                      label: 'Summary',
                      data: Array.from({ length: 6 }, () =>
                        Math.floor(Math.random() * 20)
                      ),
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true
                        }
                      }
                    ]
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
  tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

ChartsPage.defaultProps = {
  expenses: [],
  tags: [],
  chartsView: INITIAL_DATE_RANGE
};

const mapStateToProps = state => {
  let fromYear = state.chartsView.fromYearValue
    ? state.chartsView.fromYearValue
    : INITIAL_DATE_RANGE.fromYearValue;
  let fromMonth = state.chartsView.fromMonthValue
    ? state.chartsView.fromMonthValue
    : INITIAL_DATE_RANGE.fromMonthValue;

  let toYear = state.chartsView.toYearValue
    ? state.chartsView.toYearValue
    : INITIAL_DATE_RANGE.toYearValue;
  let toMonth = state.chartsView.toMonthValue
    ? state.chartsView.toMonthValue
    : INITIAL_DATE_RANGE.toMonthValue;

  const fromDate = moment.utc([fromYear, fromMonth - 1, 1]);
  const toDate = moment.utc([toYear, toMonth - 1, 1]);

  return {
    expenses: getFilteredExpensesByDates(
      state.firestore.ordered.expenses || [],
      fromDate,
      toDate
    ),
    tags: state.firestore.ordered.tags,
    chartsView: state.chartsView,
    fromDate: fromDate,
    toDate: toDate
  };
};

ChartsPage = compose(
  firestoreConnect(['tags', 'expenses']),
  connect(mapStateToProps)
)(ChartsPage);
export default ChartsPage;
