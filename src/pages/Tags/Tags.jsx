import React, { Component } from 'react';
import {
  Container,
  Segment,
  Button,
  Icon,
  Label,
  Input
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { addTag, deleteTag } from '../../actions';
import { Tag } from "../../interfaces";
import PropTypes from "prop-types";

class TagsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {newTagName: ''};

    this.addTag = this.addTag.bind(this);
    this.newTagNameInputHandler = this.newTagNameInputHandler.bind(this);
    this.newTagNameKeyPressed = this.newTagNameKeyPressed.bind(this);
  }

  deleteTag(tag) {
    this.props.dispatch(deleteTag(tag.key));
  }

  addTag() {
    if (!this.state.newTagName.trim()) return;
    let newTag = {
      key: (this.props.tags.length + 10).toString(),
      name: this.state.newTagName.trim(),
      uses: 0
    };
    this.props.dispatch(addTag(newTag));
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
        <h1 className="App-Title">1 React-Parcel Example</h1>
        {this.props.tags.map((tag, index) => (
          <Segment key={index}>
            <Button
              compact
              negative
              content="Delete"
              floated="right"
              icon={'trash'}
              size="small"
              onClick={() => this.deleteTag(tag)}
            />
            <Icon name="tag"/> {tag.name}{' '}
            <Label circular>{tag.uses} uses</Label>
          </Segment>
        ))}
        <Segment>
          <Button
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
