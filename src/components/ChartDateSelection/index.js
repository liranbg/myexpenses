import _ from 'lodash';
import React, { Component } from 'react';
import { Segment, SegmentGroup, Header, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ChartDateSelection extends Component {
  state = {
    fromValue: 0,
    toValue: 0
  };

  setFromValue = (e, { value }) => this.setState({ fromValue: value });
  setToValue = (e, { value }) => this.setState({ toValue: value });

  render() {
    const { maxYear, minYear } = this.props;
    let { fromValue, toValue } = this.state;
    let fromOptions = _.range(minYear, maxYear + 1).map(num => ({
      key: num,
      text: num.toString(),
      value: num
    }));
    fromValue = fromValue || fromOptions[0].value;

    let toOptions = _.range(fromValue, maxYear + 1).map(num => ({
      key: num,
      text: num.toString(),
      value: num
    }));
    toValue = (toValue >= fromValue ? toValue : false) || toOptions[0].value;

    return (
      <SegmentGroup horizontal>
        <Segment>
          <Header textAlign={'center'} content={'From Year'} />
          <Dropdown
            value={fromValue}
            onChange={this.setFromValue}
            placeholder="Year"
            fluid
            selection
            options={fromOptions}
          />
        </Segment>
        <Segment>
          <Header textAlign={'center'} content={'To Year'} />
          <Dropdown
            value={toValue}
            onChange={this.setToValue}
            placeholder="Year"
            fluid
            selection
            options={toOptions}
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
