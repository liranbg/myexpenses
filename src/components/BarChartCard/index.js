import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Button, ButtonGroup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tag } from '../../proptypes';
import { dateRangeToLabels } from '../../helpers';
import moment from 'moment';

class BarChartCard extends Component {
  viewTypeFormatMap = {
    day: 'MMM Do, YYYY',
    week: 'MMMM D, YYYY',
    month: 'MMMM YYYY',
    quarter: '[Q]Q YYYY',
    year: 'YYYY'
  };

  state = {
    viewType: 'week'
  };

  mapExpensesByLabels(expenses, labels) {
    let datapoints = [];
    const { viewType } = this.state;
    const { tags } = this.props;
    const labelsDates = labels.map(label =>
      moment(label, this.viewTypeFormatMap[viewType])
    );
    Object.entries(expenses).forEach(entry => {
      let key = entry[0];
      let values = entry[1];
      let datapoint = {
        label: key,
        data: Array(labels.length).fill(0),
        backgroundColor: tags.find(tag => tag.name === key).color
      };

      let labelTip = 0;
      values.forEach(value => {
        for (let i = labelTip; i < labelsDates.length; ++i) {
          if (labelsDates[i].isSameOrAfter(value.date)) {
            datapoint.data[i - 1] += value.amount;
            labelTip = i;
            break;
          } else if (i === labelsDates.length - 1) {
            // if expense's date is after every label -> assign it to last label
            datapoint.data[i] += value.amount;
            labelTip = i;
          }
        }
      });
      datapoints.push(datapoint);
    });
    return datapoints;
  }

  render() {
    const { viewType } = this.state;
    const { expenses, fromDate, toDate } = this.props;
    let labels = dateRangeToLabels(
      fromDate,
      toDate,
      1,
      this.viewTypeFormatMap[viewType],
      viewType
    );
    let mappedExpenses = this.mapExpensesByLabels(expenses, labels);

    return (
      <Card fluid>
        <ButtonGroup toggle>
          {toDate.diff(fromDate, 'months') <= 1 && (
            <Button
              active={viewType === 'day'}
              onClick={() => {
                this.setState({ viewType: 'day' });
              }}
              content={'Daily'}
            />
          )}

          <Button
            active={viewType === 'week'}
            onClick={() => {
              this.setState({ viewType: 'week' });
            }}
          >
            Weekly
          </Button>
          {toDate.diff(fromDate, 'weeks') >= 4 && (
            <Button
              active={viewType === 'month'}
              onClick={() => {
                this.setState({ viewType: 'month' });
              }}
              content={'Monthly'}
            />
          )}
          {toDate.diff(fromDate, 'months') >= 8 && (
            <Button
              active={viewType === 'quarter'}
              onClick={() => {
                this.setState({ viewType: 'quarter' });
              }}
              content={'Quarterly'}
            />
          )}
          {toDate.diff(fromDate, 'years') >= 1 && (
            <Button
              active={viewType === 'year'}
              onClick={() => {
                this.setState({ viewType: 'year' });
              }}
              content={'Yearly'}
            />
          )}
        </ButtonGroup>
        <Bar
          data={{
            labels: labels,
            datasets: mappedExpenses
          }}
          options={{
            responsive: true,
            title: {
              display: false,
              text: ''
            },
            tooltips: {
              mode: 'index',
              intersect: false
            },
            scales: {
              xAxes: [
                {
                  stacked: true
                }
              ],
              yAxes: [
                {
                  stacked: true
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
  expenses: PropTypes.object,
  tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

BarChartCard = connect(state => ({
  fromDate: state.chartsView.selectedFromDate,
  toDate: state.chartsView.selectedToDate
}))(BarChartCard);
export default BarChartCard;
