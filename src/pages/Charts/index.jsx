import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Card, CardGroup, Container } from 'semantic-ui-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import { expensesToTagsUses } from '../../helpers';
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

  filterExpensesByDates(expenses) {
    const {
      fromYearValue,
      fromMonthValue,
      toYearValue,
      toMonthValue
    } = this.props.chartsView;
    const fromDate = new Date(fromYearValue, fromMonthValue - 1, 1);
    const toDate = new Date(toYearValue, toMonthValue - 1, 31);
    return expenses.filter(
      expense =>
        expense.date.getTime() <= toDate.getTime() &&
        expense.date.getTime() >= fromDate.getTime()
    );
  }

  render() {
    const { tags, expenses } = this.props;
    const filteredExpenses = this.filterExpensesByDates(expenses);
    const tagsUses =
      filteredExpenses && filteredExpenses.length
        ? expensesToTagsUses(filteredExpenses)
        : {};
    return (
      <Container>
        <Header size="huge" content="Charts" />
        <ChartDateSelection
          onSelected={this.onSelected}
          minYear={2014}
          maxYear={2018}
        />
        <CardGroup stackable itemsPerRow={2}>
          <Card>
            <Line
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December'
                ],
                datasets: [
                  {
                    label: 'Tag B',
                    data: [1, 2, 3, 4, 1, 6, 7, 3, 15, 3, 5, 4],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    lineTension: 0.2
                  }
                ]
              }}
              options={{
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true
                      },
                      scaleLabel: {
                        display: true,
                        labelString: 'Total Spent'
                      }
                    }
                  ],
                  xAxes: [
                    {
                      time: {
                        unit: 'month',
                        displayFormats: {
                          quarter: 'MMM YYYY'
                        },
                        distribution: 'series'
                      },
                      scaleLabel: {
                        display: true,
                        labelString: 'Monthly'
                      }
                    }
                  ]
                }
              }}
            />
          </Card>
          {!!Object.keys(tagsUses).length && (
            <Card>
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
                      backgroundColor: [
                        '#F7464A',
                        '#46BFBD',
                        '#FDB45C',
                        '#949FB1',
                        '#4D5360'
                      ]
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
          )}
          <Card>
            <Bar
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
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

const mapStateToProps = state => ({
  expenses: state.firestore.ordered.expenses,
  tags: state.firestore.ordered.tags,
  chartsView: state.chartsView
});

ChartsPage = compose(
  firestoreConnect(['tags', 'expenses']),
  connect(mapStateToProps)
)(ChartsPage);
export default ChartsPage;
