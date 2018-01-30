import React, { Component } from 'react';
import { Card, Icon, Image, Container } from 'semantic-ui-react';

class ExpensesPage extends Component {
  render() {
    return (
      <Container>
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
    );
  }
}

export default ExpensesPage;
