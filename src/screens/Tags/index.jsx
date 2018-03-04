import React, { Component } from 'react';
import { Header, Container, Segment, Button, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../actions';
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import TagSegment from '../../components/Tags/TagSegment';

class TagsScreen extends Component {
	static propTypes = {
		tags: PropTypes.arrayOf(PropTypes.shape(Tag))
	};

	state = {
		newTagName: '',
		actionAddTagLoading: false
	};

	setActionAddTagLoading = bool =>
		this.setState({
			actionAddTagLoading: bool
		});

	setTagColor = (color, tagId) => {
		console.debug('Setting Tags color', tagId);
		this.props.firestore.update(`tags/${tagId}`, {
			color: color
		});
	};

	deleteTag = (e, { tagid }) => {
		console.debug('Deleting Tag', tagid);
		this.props.firestore.delete(`tags/${tagid}`);
	};

	addTag = () => {
		if (!this.state.newTagName.trim()) return;
		this.setActionAddTagLoading(true);
		let tagName = this.state.newTagName.trim();
		this.props.firestore
			.add('tags', {
				name: tagName,
				color: '#000000',
				uses: 0
			})
			.then(() => this.setActionAddTagLoading(false));
	};

	static jsUcfirst(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	newTagNameInputHandler = e => {
		this.setState({
			newTagName: TagsScreen.jsUcfirst(e.target.value)
		});
	};

	newTagNameKeyPressed = e => {
		if (e.key === 'Enter') this.addTag();
	};

	render() {
		const { tags } = this.props;
		return (
			<Container>
				<Header size="huge" content="Tags" />
				{tags.map(tag => (
					<TagSegment
						key={tag.id}
						tagUses={tag.uses}
						tagColor={tag.color}
						tagId={tag.id}
						tagName={tag.name}
						onDeleteTag={this.deleteTag}
						onSelectUses={() => {
							this.props.dispatch(filterExpensesByTag([tag.name]));
							this.props.dispatch(push('/expenses'));
						}}
						onSelectTagColor={this.setTagColor}
					/>
				))}
				<Segment>
					<Button
						loading={this.state.actionAddTagLoading}
						disabled={this.state.actionAddTagLoading}
						compact
						positive
						content="Add"
						floated="right"
						icon={'plus'}
						size="small"
						onClick={this.addTag}
					/>
					<Input
						onKeyPress={this.newTagNameKeyPressed}
						onChange={this.newTagNameInputHandler}
						icon="tags"
						iconPosition="left"
						focus
						placeholder="New Tag Name..."
					/>
				</Segment>
			</Container>
		);
	}
}

export default compose(
	firestoreConnect([{ collection: 'tags', orderBy: ['name'] }]),
	connect(state => ({
		tags: state.firestore.ordered.tags ? state.firestore.ordered.tags : []
	}))
)(TagsScreen);
