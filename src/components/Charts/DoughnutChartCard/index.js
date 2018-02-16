import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tag } from '../../../proptypes';

class DoughnutChartCard extends Component {
  render() {
    const { expenses, tags } = this.props;
    const expensesTags = Object.keys(expenses);
    const data = expensesTags.map(expenseTag =>
      expenses[expenseTag].reduce((total, expense) => total + expense.amount, 0)
    );
    const colors = expensesTags.map(
      tagToFind => tags.find(tag => tag.name === tagToFind).color
    );
    const dataset = {
      data: data,
      backgroundColor: colors
    };
    return (
      <Card fluid>
        <Doughnut
          data={{
            labels: expensesTags,
            datasets: [dataset]
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
                  return `${data.labels[tooltipItem.index]}: ${Math.ceil(
                    currentValue
                  )} (${percentage}%)`;
                }
              }
            }
          }}
        />
      </Card>
    );
  }
}

DoughnutChartCard.propTypes = {
  expenses: PropTypes.object,
  tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

DoughnutChartCard = connect()(DoughnutChartCard);
export default DoughnutChartCard;
