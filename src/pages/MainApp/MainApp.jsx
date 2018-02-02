import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { Segment, Icon, Menu, Container } from 'semantic-ui-react';
import ExpensesPage from '../Expenses/Expenses';
import { ChartsPage } from '../Charts/Charts';
import TagsPage from '../Tags/Tags';
import { BrowserRouter } from 'react-router-dom';
import './MainApp.css';

const Main = () => (
  <Container>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/expenses"/>}/>
      <Route exact path="/expenses" component={ExpensesPage}/>
      <Route exact path="/tags" component={TagsPage}/>
      <Route exact path="/charts" component={ChartsPage}/>
    </Switch>
  </Container>
);

class Header extends Component {
  state = {activeItem: '/expenses'};

  handleItemClick = (e, {to}) => this.setState({activeItem: to});

  render() {
    const {activeItem} = this.state;
    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Container>
            <Menu.Item header>
              <Icon name="won"/>
              My Expenses
            </Menu.Item>
            <Menu.Item
              as={Link}
              active={activeItem === '/expenses'}
              to={'/expenses'}
              onClick={this.handleItemClick}
            >
              Expenses
            </Menu.Item>
            <Menu.Item
              as={Link}
              active={activeItem === '/tags'}
              to={'/tags'}
              onClick={this.handleItemClick}
            >
              Tags
            </Menu.Item>
            <Menu.Item
              as={Link}
              active={activeItem === '/charts'}
              to={'/charts'}
              onClick={this.handleItemClick}
            >
              Charts
            </Menu.Item>
          </Container>
        </Menu>
      </Segment>
    );
  }
}

export default class MainApp extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header/>
          <Main/>
        </div>
      </BrowserRouter>
    );
  }
}
