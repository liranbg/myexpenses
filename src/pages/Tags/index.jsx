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
import { fetchTags, addTag as addTagFirebase, deleteTag as deleteTagFirebase } from '../../firebase/tags';
import { connect } from 'react-redux';
import { addTag, deleteTag, filterExpensesByTag, setTags } from '../../actions';
import { Tag } from "../../proptypes";
import PropTypes from "prop-types";
import { push } from "react-router-redux";


const INITIAL_STATE = {newTagName: '', actionAddTagLoading: false, actionDeleteTagLoading: false};

class TagsPage extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

    this.addTag = this.addTag.bind(this);
    this.newTagNameInputHandler = this.newTagNameInputHandler.bind(this);
    this.newTagNameKeyPressed = this.newTagNameKeyPressed.bind(this);
  }

  setActionAddTagLoading = (bool) => this.setState({actionAddTagLoading: bool});

  setActionDeleteTagLoading = (bool) => this.setState({actionDeleteTagLoading: bool});

  componentWillMount() {
    fetchTags().then(tags => {
      this.props.dispatch(setTags(tags));
    });
  }

  deleteTag(tag) {
    this.setActionDeleteTagLoading(true);
    this.props.dispatch(deleteTag(tag.key));
    //Deletion is under the hood
    deleteTagFirebase(tag.key).then(() => this.setActionDeleteTagLoading(false));
  }

  addTag() {
    if (!this.state.newTagName.trim()) return;
    this.setActionAddTagLoading(true);
    let tagName = this.state.newTagName.trim();
    addTagFirebase(tagName).then(newTag => {
      this.setActionAddTagLoading(false);
      this.props.dispatch(addTag(newTag));
    });
  }

  jsUcfirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  newTagNameInputHandler(e) {
    this.setState({newTagName: this.jsUcfirst(e.target.value)});
  }

  newTagNameKeyPressed(e) {
    if (e.key === 'Enter') this.addTag();
  }

  render() {
    return (
      <Container>
        <Header size="huge" content="Tags"/>
        {this.props.tags.map((tag, index) => (
          <Segment key={index}>
            <Button
              compact
              negative
              loading={this.state.actionDeleteTagLoading}
              disabled={this.state.actionDeleteTagLoading}
              content="Delete"
              floated="right"
              icon={'trash'}
              size="small"
              onClick={() => this.deleteTag(tag)}
            />
            <Icon name="tag"/> {tag.name}{' '}
            <Label circular as={"a"} onClick={() => {
              this.props.dispatch(filterExpensesByTag(tag.name, true));
              this.props.dispatch(push("/expenses"));
            }

            }>{tag.uses} uses</Label>
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
  tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
};
TagsPage = connect(state => ({tags: state.tags}))(TagsPage);
export default TagsPage;
