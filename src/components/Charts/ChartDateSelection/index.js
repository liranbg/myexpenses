import React, { Component } from 'react';
import { Segment, SegmentGroup, Header, Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { setDatesRange } from '../../../actions/index';
import { DateType } from '../../../proptypes';
import moment from 'moment';
import { DateTime } from 'luxon';

class ChartDateSelection extends Component {
	static propTypes = {
		fromDate: DateType,
		toDate: DateType,
		selectedFromDate: DateType,
		selectedToDate: DateType
	};

	state = {
		showFrom: false,
		showTo: false
	};

	toggleShowFromCalendar = () => {
		this.setState({ showFrom: !this.state.showFrom });
	};

	toggleShowToCalendar = () => {
		this.setState({ showTo: !this.state.showTo });
	};

	handleChangeStart = d => {
		const { fromDate, toDate, selectedToDate } = this.props;
		let newSelectedFromDate = DateTime.fromJSDate(
			moment(d)
				.startOf('day')
				.toDate()
		);
		this.props.dispatch(setDatesRange(fromDate, toDate, newSelectedFromDate, selectedToDate));
		this.toggleShowFromCalendar();
	};

	handleChangeEnd = d => {
		const { fromDate, toDate, selectedFromDate } = this.props;
		let newSelectedToDate = DateTime.fromJSDate(
			moment(d)
				.startOf('day')
				.toDate()
		);
		this.props.dispatch(setDatesRange(fromDate, toDate, selectedFromDate, newSelectedToDate));
		this.toggleShowToCalendar();
	};

	render() {
		const { selectedFromDate, selectedToDate, fromDate } = this.props;
		return (
			<SegmentGroup horizontal>
				<Segment>
					<Header textAlign={'center'} content={'From'} />
					<Button
						onClick={this.toggleShowFromCalendar}
						fluid
						primary
						content={selectedFromDate.toFormat('LLLL dd, yyyy')}
						icon={'calendar'}
					/>
					{this.state.showFrom && (
						<DatePicker
							selected={moment(selectedFromDate.toJSDate())}
							minDate={moment(fromDate.toJSDate())}
							inline
							selectsStart
							peekNextMonth
							fixedHeight
							showMonthDropdown
							showYearDropdown
							withPortal
							startDate={moment(selectedFromDate.toJSDate())}
							endDate={moment(selectedToDate.toJSDate())}
							onChange={this.handleChangeStart}
							onClickOutside={this.toggleShowFromCalendar}
						/>
					)}
				</Segment>
				<Segment>
					<Header textAlign={'center'} content={'To'} />
					<Button
						onClick={this.toggleShowToCalendar}
						fluid
						primary
						content={selectedToDate.toFormat('LLLL dd, yyyy')}
						icon={'calendar'}
					/>
					{this.state.showTo && (
						<DatePicker
							selected={moment(selectedToDate.toJSDate())}
							minDate={moment(fromDate.toJSDate())}
							inline
							selectsEnd
							fixedHeight
							peekNextMonth
							showMonthDropdown
							showYearDropdown
							withPortal
							startDate={moment(selectedFromDate.toJSDate())}
							endDate={moment(selectedToDate.toJSDate())}
							onChange={this.handleChangeEnd}
							onClickOutside={this.toggleShowToCalendar}
						/>
					)}
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
