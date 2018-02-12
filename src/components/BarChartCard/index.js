import moment from 'moment';
import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Button, ButtonGroup } from 'semantic-ui-react';
import PropTypes from "prop-types";
import { connect } from "react-redux";


class BarChartCard extends Component {
  state = {
    minDate: moment('2016-01-01'),
    maxDate: moment('2018-12-31'),
    viewType: 'week'
  };

  render() {
    const {viewType} = this.state;
    const {expenses, tags, fromDate, toDate} = this.props;
    console.log(toDate.diff(fromDate, 'months'));
    return (
      <Card fluid>
        <ButtonGroup toggle>
          {toDate.diff(fromDate, 'months') <= 1 &&
          <Button
            active={viewType === 'day'}
            onClick={() => {
              this.setState({viewType: 'day'});
            }}
            content={"Daily"}
          />
          }

          <Button
            active={viewType === 'week'}
            onClick={() => {
              this.setState({viewType: 'week'});
            }}
          >
            Weekly
          </Button>
          {toDate.diff(fromDate, 'weeks') >= 4 && <Button
            active={viewType === 'month'}
            onClick={() => {
              this.setState({viewType: 'month'});
            }}
            content={"Monthly"}
          />}
          {toDate.diff(fromDate, 'months') >= 8 && <Button
            active={viewType === 'quarter'}
            onClick={() => {
              this.setState({viewType: 'quarter'});
            }}
            content={"Quarterly"}
          />}
          {toDate.diff(fromDate, 'years') >= 1 && <Button
            active={viewType === 'year'}
            onClick={() => {
              this.setState({viewType: 'year'});
            }}
            content={"Yearly"}
          />}

        </ButtonGroup>
        <Bar
          data={{
            datasets: Object.entries(expenses).map(a => ({
              label: a[0],
              data: a[1].map(expense => ({
                x: expense.date,
                y: expense.amount
              })),
              backgroundColor: tags.find(tag => tag.name === a[0]).color
            }))
          }}
          options={{
            responsive: true,
            title: {
              display: false,
              text: ''
            },
            scales: {
              xAxes: [
                {
                  barThickness: 12,
                  type: 'time',
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: 'Date'
                  },
                  time: {
                    min: fromDate,
                    max: toDate,
                    unit: viewType,
                    round: 'true'
                  },
                  ticks: {
                    suggestedMin: fromDate
                  }
                }
              ],
              yAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: 'Total Spent'
                  },
                  ticks: {
                    suggestedMin: 0

                  }
                }
              ]
            }
          }}
        />
      </Card>
    );
  }
}

BarChartCard.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.object),
  tags: PropTypes.arrayOf(PropTypes.object)
};

BarChartCard = connect(state => ({
  fromDate: state.chartsView.selectedFromDate,
  toDate: state.chartsView.selectedToDate,
}))(BarChartCard);
export default BarChartCard;
