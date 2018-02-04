import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Loader, Dimmer, Header, Grid, Container, Segment } from 'semantic-ui-react';
import GoogleButton from '../../components/GoogleLoginButton';
import PropTypes from 'prop-types';
import { firestoreConnect } from "react-redux-firebase";


class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginLoading: !!localStorage.getItem('authRemember')
    };
  }

  componentWillReceiveProps() {
    if (this.props.auth.uid) {
      this.setLoading(false);
      //     this.props.dispatch(push("/expenses"));
    }
  }

  componentWillMount() {
    // After coming back from auth-redirect
    this.backFromAuthPage();
    if (this.props.auth) {
      // this.setLoading(false);
      //     this.props.dispatch(push("/expenses"));
    }
  }

  setAuthRemember = () => localStorage.setItem('authRemember', {status: "inProcess"});

  rememberAfterRedirect = () => localStorage.getItem('authRemember');

  deleteAuthRemember = () => localStorage.removeItem('authRemember');

  setLoading = (bool) => this.setState({loginLoading: bool});

  backFromAuthPage() {
    if (this.rememberAfterRedirect()) {
      this.setLoading(true);
      this.deleteAuthRemember();
    }
  }

  handleGoogleLogin = () => {
    this.setAuthRemember();
    this.setLoading(true);
    this.props.firebase.login({
      provider: 'google',
      type: 'redirect'
    });
  };

  render() {
    if (this.state.loginLoading)
      return (
        <Dimmer active={this.state.loginLoading}>
          <Loader active={this.state.loginLoading} size='huge'>Loading</Loader>
        </Dimmer>
      );
    return (
      <Container>
        <Grid
          textAlign='center'
          style={{height: '100%'}}
          verticalAlign='middle'
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Segment padded>
              <Header textAlign='center' content="Sign In"/>
              <GoogleButton style={{width: -1}} onClick={this.handleGoogleLogin} type={"dark"}/>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

SignInForm.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
};
export default compose(
  firestoreConnect(),
  connect(({firebase: {auth}}) => ({auth}))
)(SignInForm);
