import React, { Component } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Icon, Menu, Container } from 'semantic-ui-react';
import ExpensesPage from '../Expenses/Expenses';
import { ChartsPage } from '../Charts/Charts';
import TagsPage from '../Tags/Tags';
import PropTypes from 'prop-types';
import './MainApp.css';

const Main = ({ store }) => (
  <Container style={{ marginTop: '4em' }}>
    <Provider store={store}>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/expenses" />} />
        <Route exact path="/expenses" component={ExpensesPage} />
        <Route exact path="/tags" component={TagsPage} />
        <Route exact path="/charts" component={ChartsPage} />
      </Switch>
    </Provider>
  </Container>
);

Main.propTypes = {
  store: PropTypes.object.isRequired
};

const Header = () => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item header>
        <Icon name="won" />
        My Expenses
      </Menu.Item>
      <Menu.Item as={Link} to={'/expenses'}>
        Expenses
      </Menu.Item>
      <Menu.Item as={Link} to={'/tags'}>
        Tags
      </Menu.Item>
      <Menu.Item as={Link} to={'/charts'}>
        Charts
      </Menu.Item>
    </Container>
  </Menu>
);

export default class MainApp extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main store={this.props.store} />
      </div>
    );
  }
}

MainApp.propTypes = {
  store: PropTypes.object.isRequired
};
