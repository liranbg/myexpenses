import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { Menu, Container } from 'semantic-ui-react';
import ExpensesPage from '../Expenses/Expenses';
import './MainApp.css';

const Main = () => (
  <main>
    <Container style={{ marginTop: '4em' }}>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/expenses" />} />
        <Route exact path="expenses" component={ExpensesPage} />
      </Switch>
    </Container>;
  </main>
);

const Header = () => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item as="a" header>
        Project Name
      </Menu.Item>
      <Menu.Item>
        <Link to="/expenses">Expenses</Link>
      </Menu.Item>
      <Menu.Item as="a">Tags</Menu.Item>
      <Menu.Item as="a">Charts</Menu.Item>
    </Container>
  </Menu>
);

class MainApp extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
      </div>
    );
  }
}

export default MainApp;
