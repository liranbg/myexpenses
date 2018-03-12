import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TagColorPicker from '../TagColorPicker/index';
import { Segment, Button, Icon } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import { filterExpensesByTag } from '../../../actions';
import { Tag } from '../../../proptypes';
import { connect } from 'react-redux';

class TagSegmentGroup extends Component {
	static propTypes = {
		tag: PropTypes.shape(Tag)
	};

	render() {
		const { tag } = this.props;
		const mainTag = (
			<TagSegment
				style={{
					borderLeftWidth: 8,
					borderLeftStyle: 'solid',
					borderLeftColor: tag.color
				}}
				tag={tag}
			/>
		);

		if (tag.children.length) {
			return (
				<Segment.Group>
					{mainTag}
					<Segment.Group>
						{tag.children.map(subTag => (
							<TagSegment
								style={{
									borderLeftWidth: 8,
									borderLeftStyle: 'solid',
									borderLeftColor: subTag.color
								}}
								key={subTag.id}
								tag={subTag}
							/>
						))}
					</Segment.Group>
				</Segment.Group>
			);
		} else {
			return mainTag;
		}
	}
}

class TagSegment extends Component {
	static propTypes = {
		tag: PropTypes.shape(Tag),
		style: PropTypes.object
	};

	state = {
		isDeleting: false,
		isSettingColor: false
	};

	setTagColor = color => {
		console.debug('Setting Tags color', this.props.tag.id);
		this.setState({ isSettingColor: true });
		this.props.firestore
			.update(`tags/${this.props.tag.id}`, {
				color: color
			})
			.finally(() => this.setState({ isSettingColor: false }));
	};

	deleteTag = () => {
		console.debug('Deleting Tag', this.props.tag.id);
		this.props.firestore.delete(`tags/${this.props.tag.id}`);
	};

	handleUsesClick = () => {
		this.props.dispatch(filterExpensesByTag([this.props.tag.name]));
		this.props.dispatch(push('/expenses'));
	};

	render() {
		const { tag } = this.props;
		return (
			<Segment style={this.props.style}>
				<Button
					loading={this.state.isDeleting}
					active={!this.state.isDeleting && tag.uses === 0}
					tagid={tag.id}
					compact
					negative
					disabled={!!tag.uses}
					floated={'right'}
					icon={'trash'}
					size={'small'}
					onClick={this.deleteTag}
				/>
				<Icon name="tag" /> {tag.name}{' '}
				<TagColorPicker
					loading={this.state.isSettingColor}
					active={!this.state.isSettingColor}
					onSelectTagColor={this.setTagColor}
					selectedColor={tag.color}
				/>
				<Button
					style={{ minWidth: 100, textAlign: 'left' }}
					basic
					icon={'credit card alternative'}
					secondary
					compact
					floated={'right'}
					size={'small'}
					onClick={this.handleUsesClick}
					content={`${tag.uses} uses`}
				/>
			</Segment>
		);
	}
}

TagSegment = compose(firestoreConnect(), connect())(TagSegment);

export default compose(firestoreConnect(), connect())(TagSegmentGroup);
