import React, { Component } from 'react';
import { Route } from 'react-router';
import ExpensesPage from '../Expenses';
import ChartsPage from '../Charts';
import TagsPage from '../Tags';
import Header from '../../components/Header';
import SignIn from '../../components/SignIn';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

class MainApp extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { firestore } = this.context.store;
    firestore.setListeners([
      { collection: 'expenses', orderBy: ['date'] },
      { collection: 'tags', orderBy: ['name'] }
    ]);
  }

  componentWillUnmount() {
    const { firestore } = this.context.store;
    firestore.unsetListeners([
      { collection: 'expenses' },
      { collection: 'tags' }
    ]);
  }

  render() {
    const { profile } = this.props;
    return (
      <div className="App">
        <Header />
        {profile.isEmpty ? (
          <div>
            <SignIn />
          </div>
        ) : (
          <React.Fragment>
            <Route exact path="/expenses" component={ExpensesPage} />
            <Route exact path="/tags" component={TagsPage} />
            <Route exact path="/charts" component={ChartsPage} />
          </React.Fragment>
        )}
        <Segment
          vertical
          style={{ margin: '1em 0em 0em', padding: '1em 0em' }}
        />
      </div>
    );
  }
}

export default compose(
  firestoreConnect(),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile }))
)(MainApp);
