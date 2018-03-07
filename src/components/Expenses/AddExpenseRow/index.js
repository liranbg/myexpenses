import React, { Component } from 'react';
import { Tag } from '../../../proptypes';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TagsDropDownSelection from '../../Tags/TagsDropDownSelection';
import { DateTime } from 'luxon';
import { currencyOptions } from '../../../constants';
import { Label, Dropdown, Input, Button, TableCell, TableRow } from 'semantic-ui-react';

const INITIAL_STATE = {
	addButton: false,
	name: '',
	amount: '',
	currency: 'ils',
	tag: 'Untagged',
	notes: '',
	date: moment()
};

class AddExpenseRow extends Component {
	static propTypes = {
		addRow: PropTypes.func,
		tags: PropTypes.arrayOf(PropTypes.shape(Tag))
	};

	state = { ...INITIAL_STATE };

	componentWillMount() {
		this.reset();
	}

	reset() {
		this.setState({ ...INITIAL_STATE });
	}

	handleChangeDate = date => this.setState({ date: date.startOf('day') });

	handleSetTag = (e, { value }) => this.setState({ tag: value });

	handleAddRow = async () => {
		this.setState({ addButton: true });
		const { name, date, amount, currency, tag, notes } = this.state;
		//TODO once DatePicker stops using moment(), we can update this section
		if (
			await this.props.addRow(
				name,
				DateTime.fromJSDate(moment(date).toDate()),
				amount,
				currency,
				tag,
				notes
			)
		)
			this.reset();
		else this.setState({ addButton: false });
	};

	validInput = () => {
		const { name, amount, currency, tag } = this.state;
		return !!name.length && amount > 0 && !!currency.length && !!tag.length;
	};

	render() {
		const { date, currency, name, amount, notes, addButton } = this.state;
		const { tags } = this.props;
		const defaultCurrency = currencyOptions.find(curr => curr.key === 'ils').value;
		return (
			<TableRow>
				<TableCell
					children={
						this.validInput() ? (
							<Button
								loading={addButton}
								onClick={this.handleAddRow}
								compact
								positive
								circular
								icon="add"
							/>
						) : null
					}
				/>
				<TableCell
					children={
						<Input
							value={name}
							onChange={(e, { value }) => this.setState({ name: value })}
							size={'mini'}
							placeholder={'Expense Name'}
						/>
					}
				/>
				<TableCell
					children={
						<div className={'input ui mini'}>
							<DatePicker
								showYearDropdown
								dateFormat="MMMM Do, YYYY"
								onChange={this.handleChangeDate}
								selected={date}
								minDate={moment()
									.year(2014)
									.startOf('year')}
								maxDate={moment()}
								placeholderText="Click to select a date"
							/>
						</div>
					}
				/>
				<TableCell
					children={
						<Input
							labelPosition="right"
							onChange={(e, { value }) => this.setState({ amount: value })}
							fluid
							size={'mini'}
							placeholder={'Amount'}
							type={'number'}
						>
							<Label basic>{currencyOptions.find(curr => curr.key === currency).sign}</Label>
							<input value={amount} />
							<Label>.00</Label>
						</Input>
					}
				/>
				<TableCell
					children={
						<Dropdown
							onChange={(e, { value }) => this.setState({ currency: value })}
							defaultValue={defaultCurrency}
							compact
							inline
							labeled
							placeholder="Currency"
							search
							options={currencyOptions}
						/>
					}
				/>
				<TableCell children={<TagsDropDownSelection onChange={this.handleSetTag} tags={tags} />} />
				<TableCell
					children={
						<Input
							value={notes}
							onChange={(e, { value }) => this.setState({ notes: value })}
							fluid
							size={'mini'}
							placeholder={'Notes'}
						/>
					}
				/>
			</TableRow>
		);
	}
}

export default AddExpenseRow;
