import React, { Component } from 'react';
import {
  Header,
  Container,
  Segment,
  Button,
  Icon,
  Label,
  Input
} from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { filterExpensesByTag } from '../../actions';
import { Tag } from '../../proptypes';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import { expensesToTagsUses, firebaseTagsToArray } from '../../helpers';

const INITIAL_STATE = {
  newTagName: '',
  actionAddTagLoading: false,
  actionDeleteTagLoading: false
};

class TagsPage extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.newTagNameInputHandler = this.newTagNameInputHandler.bind(this);
    this.newTagNameKeyPressed = this.newTagNameKeyPressed.bind(this);
  }

  setActionAddTagLoading = bool => this.setState({ actionAddTagLoading: bool });

  setActionDeleteTagLoading = bool =>
    this.setState({ actionDeleteTagLoading: bool });

  componentWillMount() {}

  deleteTag(e, { tagid }) {
    console.debug('Deleting Tag', tagid);
    this.setActionDeleteTagLoading(true);
    this.props.firestore.delete(`tags/${tagid}`).then(() => {
      this.setActionDeleteTagLoading(false);
    });
  }

  addTag() {
    if (!this.state.newTagName.trim()) return;
    this.setActionAddTagLoading(true);
    let tagName = this.state.newTagName.trim();
    this.props.firestore
      .add('tags', { name: tagName })
      .then(() => this.setActionAddTagLoading(false));
  }

  jsUcfirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  newTagNameInputHandler(e) {
    this.setState({ newTagName: this.jsUcfirst(e.target.value) });
  }

  newTagNameKeyPressed(e) {
    if (e.key === 'Enter') this.addTag();
  }

  render() {
    const { tags } = this.props;
    return (
      <Container>
        <Header size="huge" content="Tags" />
        {tags.map(tag => (
          <Segment key={tag.key}>
            <Button
              tagid={tag.id}
              compact
              negative
              loading={this.state.actionDeleteTagLoading}
              disabled={this.state.actionDeleteTagLoading || !!this.props.tagsUses[tag.name]}
              content={'Delete'}
              floated={'right'}
              icon={'trash'}
              size={'small'}
              onClick={this.deleteTag}
            />
            <Icon name="tag" /> {tag.name}{' '}
            <Label
              circular
              as={'a'}
              onClick={() => {
                this.props.dispatch(filterExpensesByTag(tag.name, true));
                this.props.dispatch(push('/expenses'));
              }}
            >
              {this.props.tagsUses[tag.name] || 0} uses
            </Label>
          </Segment>
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
  tags: PropTypes.arrayOf(PropTypes.shape(Tag))
};

const mapStateToProps = state => ({
  tags: firebaseTagsToArray(state.firestore.ordered.tags),
  tagsUses: expensesToTagsUses(state.expenses)
});

TagsPage = compose(firestoreConnect(['tags']), connect(mapStateToProps))(
  TagsPage
);

export default TagsPage;
