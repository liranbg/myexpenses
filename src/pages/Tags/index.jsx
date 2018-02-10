import React, { Component } from 'react';
import { Header, Container, Segment, Button, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../actions';
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import { expensesToTagsUses } from '../../helpers';
import TagSegment from '../../components/TagSegment';

const INITIAL_STATE = {
  newTagName: '',
  actionAddTagLoading: false
};

class TagsPage extends Component {
  state = { ...INITIAL_STATE };

  setActionAddTagLoading = bool => this.setState({ actionAddTagLoading: bool });

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
      .add('tags', { name: tagName, color: '#000000' })
      .then(() => this.setActionAddTagLoading(false));
  };

  static jsUcfirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  newTagNameInputHandler = e => {
    this.setState({ newTagName: TagsPage.jsUcfirst(e.target.value) });
  };

  newTagNameKeyPressed = e => {
    if (e.key === 'Enter') this.addTag();
  };

  render() {
    const { tags, tagsUses } = this.props;
    return (
      <Container>
        <Header size="huge" content="Tags" />
        {tags.map(tag => (
          <TagSegment
            key={tag.id}
            tagUses={tagsUses[tag.name] || 0}
            tagColor={tag.color}
            tagId={tag.id}
            tagName={tag.name}
            onDeleteTag={this.deleteTag}
            onSelectUses={() => {
              this.props.dispatch(filterExpensesByTag(tag.name, true));
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

TagsPage.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
  tagsUses: PropTypes.object.isRequired
};

TagsPage.defaultProps = {
  tags: [],
  tagsUses: {}
};

const mapStateToProps = state => ({
  tags: state.firestore.ordered.tags,
  tagsUses: state.firestore.ordered.expenses
    ? expensesToTagsUses(state.firestore.ordered.expenses)
    : {}
});

TagsPage = compose(
  firestoreConnect(['tags', 'expenses']),
  connect(mapStateToProps)
)(TagsPage);

export default TagsPage;
