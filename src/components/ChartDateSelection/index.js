import _ from 'lodash';
import React, { Component } from 'react';
import {
  Divider,
  Segment,
  SegmentGroup,
  Header,
  Dropdown
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ChartDateSelection extends Component {
  state = {
    fromYearValue: 0,
    fromMonthValue: 1,
    toYearValue: 0,
    toMonthValue: 1
  };

  monthsOptions = [
    { key: 0, text: 'January', value: 1 },
    { key: 1, text: 'February', value: 2 },
    { key: 2, text: 'March', value: 3 },
    { key: 3, text: 'April', value: 4 },
    { key: 4, text: 'May', value: 5 },
    { key: 5, text: 'June', value: 6 },
    { key: 6, text: 'July', value: 7 },
    { key: 7, text: 'August', value: 8 },
    { key: 8, text: 'September', value: 9 },
    { key: 9, text: 'October', value: 10 },
    { key: 10, text: 'November', value: 11 },
    { key: 11, text: 'December', value: 12 }
  ];

  setFromYearValue = (e, { value }) => this.setState({ fromYearValue: value });

  setFromMonthValue = (e, { value }) =>
    this.setState({ fromMonthValue: value });

  setToYearValue = (e, { value }) => this.setState({ toYearValue: value });

  setToMonthValue = (e, { value }) => this.setState({ toMonthValue: value });

  render() {
    const { maxYear, minYear } = this.props;
    let {
      fromYearValue,
      toYearValue,
      fromMonthValue,
      toMonthValue
    } = this.state;
    const fromOptions = _.range(minYear, maxYear + 1).map(num => ({
      key: num,
      text: num.toString(),
      value: num
    }));
    fromYearValue = fromYearValue || fromOptions[0].value;

    const toOptions = _.range(fromYearValue, maxYear + 1).map(num => ({
      key: num,
      text: num.toString(),
      value: num
    }));
    toYearValue =
      (toYearValue >= fromYearValue ? toYearValue : false) ||
      toOptions[0].value;

    let fromMonthsOptions = this.monthsOptions;
    let toMonthsOptions = [...fromMonthsOptions];
    if (fromYearValue === toYearValue && fromMonthValue !== toMonthValue) {
      toMonthsOptions = toMonthsOptions.slice(fromMonthValue - 1);
      if (toMonthValue <= fromMonthValue) toMonthValue = fromMonthValue;
    }

    return (
      <SegmentGroup horizontal>
        <Segment>
          <Header textAlign={'center'} content={'From Year'} />
          <Dropdown
            value={fromYearValue}
            onChange={this.setFromYearValue}
            placeholder="Year"
            fluid
            selection
            options={fromOptions}
          />
          <Divider hidden />
          <Dropdown
            value={fromMonthValue}
            onChange={this.setFromMonthValue}
            placeholder="Year"
            fluid
            selection
            options={fromMonthsOptions}
          />
        </Segment>
        <Segment>
          <Header textAlign={'center'} content={'To Year'} />
          <Dropdown
            value={toYearValue}
            onChange={this.setToYearValue}
            placeholder="Year"
            fluid
            selection
            options={toOptions}
          />
          <Divider hidden />
          <Dropdown
            value={toMonthValue}
            onChange={this.setToMonthValue}
            placeholder="Year"
            fluid
            selection
            options={toMonthsOptions}
          />
        </Segment>
      </SegmentGroup>
    );
  }
}

ChartDateSelection.propTypes = {
  minYear: PropTypes.number.isRequired,
  maxYear: PropTypes.number.isRequired
};

export default ChartDateSelection;
