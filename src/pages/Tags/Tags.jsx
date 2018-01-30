import React, { Component } from 'react';
import {
  Container,
  Segment,
  Button,
  Icon,
  Label,
  Input
} from 'semantic-ui-react';
import { Tag } from '../../interfaces/interfaces';
import { connect } from 'react-redux';

class TagsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { newTagName: '' };

    this.addTag = this.addTag.bind(this);
    this.newTagNameInputHandler = this.newTagNameInputHandler.bind(this);
    this.newTagNameKeyPressed = this.newTagNameKeyPressed.bind(this);
  }

  componentWillMount() {
    const tags = require('../../mocks/tags');
    this.setState({ tags: tags });
  }

  deleteTag(tag: Tag) {
    this.props.dispatch({
      key: tag.key,
      type: 'REMOVE_TAG'
    });
  }

  addTag() {
    if (!this.state.newTagName.trim()) return;
    let newTag: Tag = {
      id: this.state.tags.length + 1,
      name: this.state.newTagName.trim(),
      icon: ''
    };
    this.props.dispatch({
      ...newTag,
      type: 'ADD_TAG'
    });
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
    return (
      <Container>
        <h1 className="App-Title">1 React-Parcel Example</h1>
        {this.props.tags.map(tag => (
          <Segment key={tag.key}>
            <Button
              compact
              negative
              content="Delete"
              floated="right"
              icon={'trash'}
              size="small"
              onClick={() => this.deleteTag(tag)}
            />
            <Icon name="tag" /> {tag.name} <Label circular>0 uses</Label>
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

const mapStateToProps = state => ({ tags: state.tags });
TagsPage = connect(mapStateToProps)(TagsPage);

export default TagsPage;
