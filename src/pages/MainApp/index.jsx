import React, { Component } from 'react';
import { Route } from 'react-router';
import ExpensesPage from '../Expenses';
import ChartsPage from '../Charts';
import TagsPage from '../Tags';
import Header from '../../components/Header';
import SignIn from '../SignIn';
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

class MainApp extends Component {
  render() {
    const {profile} = this.props;
    return (
      <div className="App">
        <Header/>
        {
          profile.isEmpty ?
            <div>
              <SignIn/>
            </div>
            :
            <div>
              <Route exact path="/expenses" component={ExpensesPage}/>
              <Route exact path="/tags" component={TagsPage}/>
              <Route exact path="/charts" component={ChartsPage}/>
            </div>
        }
      </div>
    );
  }
}

export default compose(
  firestoreConnect(),
  connect(({firebase: {auth, profile}}) => ({auth, profile}))
)(MainApp);
