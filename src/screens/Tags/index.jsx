import React, { Component } from 'react';
import { Checkbox, Header, Container, Segment, Button, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import TagSegment from '../../components/Tags/TagSegment';
import { slugify, tagsToHierarchy } from '../../helpers';
import TagsDropDownSelection from '../../components/Tags/TagsDropDownSelection';

class TagAdder extends Component {
	static propTypes = {
		tags: PropTypes.arrayOf(PropTypes.shape(Tag))
	};

	state = {
		newTagName: '',
		newTagParent: 'untagged',
		createWithParent: false,
		actionAddTagLoading: false
	};

	setActionAddTagLoading = bool =>
		this.setState({
			actionAddTagLoading: bool
		});

	addTag = () => {
		if (!this.state.newTagName.trim()) return;
		this.setActionAddTagLoading(true);
		let tagName = this.state.newTagName.trim();
		const tagId = slugify(tagName);
		if (this.props.tags.find(tag => tag.id === tagId)) {
			this.setActionAddTagLoading(false);
			return;
		}
		console.log('Creating a new tag', tagId);
		this.props.firestore
			.set(
				`tags/${tagId}`,
				{
					name: tagName,
					parent: this.state.createWithParent ? this.state.newTagParent : null,
					color: '#fff',
					uses: 0
				},
				{ merge: true }
			) // in case it was exists? we shall merge it
			.finally(() => this.setActionAddTagLoading(false));
	};

	static jsUcfirst(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	newTagNameInputHandler = e => {
		this.setState({
			newTagName: TagAdder.jsUcfirst(e.target.value)
		});
	};

	newTagNameKeyPressed = e => {
		if (e.key === 'Enter') this.addTag();
	};

	render() {
		const { createWithParent, actionAddTagLoading } = this.state;
		return (
			<Segment>
				<Input
					onKeyPress={this.newTagNameKeyPressed}
					onChange={this.newTagNameInputHandler}
					size={'small'}
					icon="tags"
					iconPosition="left"
					focus
					placeholder="New Tag Name..."
				/>
				<Button
					loading={actionAddTagLoading}
					disabled={actionAddTagLoading}
					positive
					content="Add"
					floated="right"
					icon={'plus'}
					onClick={this.addTag}
				/>
				<div style={{ display: 'grid', float: 'right' }}>
					<Checkbox
						checked={createWithParent}
						onChange={() => this.setState({ createWithParent: !createWithParent })}
						label={'Parent'}
					/>
					<TagsDropDownSelection
						onChange={(e, { value }) => this.setState({ newTagParent: slugify(value) })}
						tags={this.props.tags || []}
					/>
				</div>
			</Segment>
		);
	}
}
TagAdder = compose(firestoreConnect(), connect())(TagAdder);

class TagsScreen extends Component {
	static propTypes = {
		tags: PropTypes.arrayOf(PropTypes.shape(Tag))
	};

	render() {
		const { tags } = this.props;
		return (
			<Container>
				<Header size="huge" content="Tags" />
				<TagAdder tags={tags} />
				{tags.map(tag => <TagSegment tag={tag} key={tag.id} />)}
			</Container>
		);
	}
}

export default compose(
	firestoreConnect(),
	connect(state => ({
		tags: state.firestore.ordered.tags ? tagsToHierarchy(state.firestore.ordered.tags) : []
	}))
)(TagsScreen);
