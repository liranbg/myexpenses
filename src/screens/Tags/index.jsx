import React, { Component } from 'react';
import { Header, Container, Segment, Button, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
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

	addTag = () => {
		if (!this.state.newTagName.trim()) return;
		this.setActionAddTagLoading(true);
		let tagName = this.state.newTagName.trim();
		this.props.firestore
			.add('tags', {
				name: tagName,
				color: '#fff',
				uses: 0
			})
			.finally(() => this.setActionAddTagLoading(false));
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
				<Segment>
					<Button
						loading={this.state.actionAddTagLoading}
						disabled={this.state.actionAddTagLoading}
						positive
						content="Add"
						floated="right"
						icon={'plus'}
						onClick={this.addTag}
					/>
					<Input
						onKeyPress={this.newTagNameKeyPressed}
						onChange={this.newTagNameInputHandler}
						size={'small'}
						icon="tags"
						iconPosition="left"
						focus
						placeholder="New Tag Name..."
					/>
				</Segment>
				{tags.map(tag => <TagSegment tag={tag} key={tag.id} />)}
			</Container>
		);
	}
}

export default compose(
	firestoreConnect(),
	connect(state => ({
		tags: state.firestore.ordered.tags ? state.firestore.ordered.tags : []
	}))
)(TagsScreen);
