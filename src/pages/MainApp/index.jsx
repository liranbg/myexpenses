import React, { Component } from 'react';
import { Route } from 'react-router';
import ExpensesPage from '../Expenses';
import { ConnectedRouter } from 'react-router-redux';
import ChartsPage from '../Charts';
import TagsPage from '../Tags';
import Header from '../../components/Header';
import SignIn from '../SignIn';

export default class MainApp extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <ConnectedRouter history={this.props.history}>
          <div>
            <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/expenses" component={ExpensesPage}/>
            <Route exact path="/tags" component={TagsPage}/>
            <Route exact path="/charts" component={ChartsPage}/>
          </div>
        </ConnectedRouter>
      </div>
    );
  }
}
