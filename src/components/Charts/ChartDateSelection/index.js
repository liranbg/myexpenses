import React, { Component } from 'react';
import { Segment, SegmentGroup, Header, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { setDatesRange } from '../../../actions/index';
import PropTypes from 'prop-types';
import moment from 'moment';

class ChartDateSelection extends Component {
	static propTypes = {
		fromDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
		toDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
		selectedFromDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)]),
		selectedToDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.instanceOf(Date)])
	};

	handleChangeStart = d => {
		const { fromDate, toDate, selectedToDate } = this.props;
		this.props.dispatch(setDatesRange(fromDate, toDate, moment(d).startOf('day'), selectedToDate));
	};

	handleChangeEnd = d => {
		const { fromDate, toDate, selectedFromDate } = this.props;
		this.props.dispatch(setDatesRange(fromDate, toDate, selectedFromDate, moment(d).startOf('day')));
	};

	render() {
		const { selectedFromDate, selectedToDate, fromDate } = this.props;
		return (
			<SegmentGroup horizontal>
				<Segment>
					<Header textAlign={'center'} content={'From'} />
					<DatePicker
						className={'fluid'}
						customInput={
							<Button primary content={selectedFromDate.format('MMM Do, YYYY')} icon={'calendar'} />
						}
						selected={selectedFromDate}
						minDate={fromDate}
						selectsStart
						peekNextMonth
						fixedHeight
						showMonthDropdown
						showYearDropdown
						withPortal
						startDate={selectedFromDate}
						endDate={selectedToDate}
						onChange={this.handleChangeStart}
					/>
				</Segment>
				<Segment>
					<Header textAlign={'center'} content={'To'} />
					<DatePicker
						className={'fluid'}
						customInput={
							<Button primary content={selectedToDate.format('MMM Do, YYYY')} icon={'calendar'} />
						}
						selected={selectedToDate}
						minDate={fromDate}
						selectsEnd
						fixedHeight
						peekNextMonth
						showMonthDropdown
						showYearDropdown
						withPortal
						startDate={selectedFromDate}
						endDate={selectedToDate}
						onChange={this.handleChangeEnd}
					/>
				</Segment>
			</SegmentGroup>
		);
	}
}

export default connect(state => ({
	fromDate: state.chartsView.fromDate,
	toDate: state.chartsView.toDate,
	selectedFromDate: state.chartsView.selectedFromDate,
	selectedToDate: state.chartsView.selectedToDate
}))(ChartDateSelection);
