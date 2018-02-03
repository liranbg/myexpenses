import React, { Component } from 'react';
import { Loader, Dimmer, Header, Grid, Container, Segment } from 'semantic-ui-react';
import { auth, firebase } from '../../firebase';
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { setUser } from "../../actions";
import GoogleButton from '../../components/GoogleLoginButton';


class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginLoading: !!localStorage.getItem('auth')
    };
  }

  setAuthRemember = () => localStorage.setItem('auth', {status: "inProcess"});

  rememberAfterRedirect = () => localStorage.getItem('auth');

  deleteAuthRemember = () => localStorage.removeItem('auth');

  setLoading = () => this.setState({loginLoading: true});

  backFromAuthPage() {
    if (this.rememberAfterRedirect()) {
      this.setLoading();
      this.deleteAuthRemember();
    }
  }

  handleGoogleLogin = () => {
    this.setAuthRemember();
    this.setLoading();
    firebase.auth.signInWithRedirect(firebase.authGoogleProvider);
  };

  componentWillMount() {
    // After coming back from auth-redirect
    this.backFromAuthPage();
    auth.onAuthStateChanged(user => {
      if (user) {
        // store the token
        this.props.dispatch(setUser(user));
        this.props.dispatch(push("/expenses"));
      }
    });
  }

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

SignInForm = connect()(SignInForm);
export default SignInForm;
