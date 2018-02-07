import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Card, CardGroup, Container } from 'semantic-ui-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { Expense, Tag } from '../../proptypes';
import { expensesToTagsUses } from '../../helpers';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

export class ChartsPage extends Component {
  render() {
    const { tags, expenses } = this.props;
    const tagsUses =
      expenses && expenses.length ? expensesToTagsUses(expenses) : {};
    return (
      <Container>
        <Header size="huge" content="Charts" />
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
                  'July'
                ],
                datasets: [
                  {
                    label: 'Tag B',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    lineTension: 0.2
                  },
                  {
                    label: 'Tag A',
                    data: [100, 2, 10, 81, 33, 78, 40],
                    fill: false,
                    borderColor: 'rgb(25, 160, 20)',
                    lineTension: 0.2
                  }
                ]
              }}
              options={{
                scales: {
                  yAxes: [
                    {
                      scaleLabel: {
                        display: true,
                        labelString: 'Total Spent'
                      }
                    }
                  ],
                  xAxes: [
                    {
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
  tags: []
};

const mapStateToProps = state => ({
  expenses: state.firestore.ordered.expenses,
  tags: state.firestore.ordered.tags
});

ChartsPage = compose(
  firestoreConnect(['tags', 'expenses']),
  connect(mapStateToProps)
)(ChartsPage);
export default ChartsPage;
