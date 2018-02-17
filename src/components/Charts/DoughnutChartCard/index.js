import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tag } from '../../../proptypes';
import 'chart.piecelabel.js';

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
            },
            pieceLabel: {
              // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
              render: 'label',

              // precision for percentage, default is 0
              precision: 0,

              // identifies whether or not labels of value 0 are displayed, default is false
              showZero: false,

              // font size, default is defaultFontSize
              fontSize: 12,

              // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
              fontColor: '#fff',

              // font style, default is defaultFontStyle
              // fontStyle: 'normal',

              // font family, default is defaultFontFamily
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

              // draw label in arc, default is false
              arc: true,

              // position to draw label, available value is 'default', 'border' and 'outside'
              // default is 'default'
              position: 'default',

              // draw label even it's overlap, default is false
              overlap: true
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
