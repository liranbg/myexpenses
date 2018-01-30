import React, { Component } from 'react';
import { Card, Icon, Image, Menu, Container } from 'semantic-ui-react';
import './MainApp.css';

class MainApp extends Component {
  render() {
    return (
      <div className="App">
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              Project Name
            </Menu.Item>
            <Menu.Item as="a">Expenses</Menu.Item>
            <Menu.Item as="a">Tags</Menu.Item>
            <Menu.Item as="a">Charts</Menu.Item>
          </Container>
        </Menu>
        <Container style={{ marginTop: '4em' }}>
          <h1 className="App-Title">1 React-Parcel Example</h1>
          <Card.Group>
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i}>
                <Image src={require('../../assets/images/matthew.png')} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </div>
    );
  }
}

export default MainApp;
