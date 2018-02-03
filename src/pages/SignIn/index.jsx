import React, { Component } from 'react';
import { Header, Button, Grid, Message, Form, Segment, Container } from 'semantic-ui-react';
import { auth } from '../../firebase';
import { push } from "react-router-redux";
import { connect } from "react-redux";
import { setUser } from "../../actions";


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {...INITIAL_STATE};
    this.state = {
      email: 'liranbg@gmail.com',
      password: 'G6K*$BAq*h45W1df',
      error: {message: "Demo Bad Credentials"}
    };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    this.props.dispatch(setUser({email: email}));
    // this.props.dispatch(push("/expenses"));

    // auth.doSignInWithEmailAndPassword(email, password)
    // .then((e) => {
    //   console.log(e);
    //   this.setState(() => ({...INITIAL_STATE}));
    //   this.props.dispatch({type: "AUTH_USER_SET", authUser: {email: e.email}});
    //   this.props.dispatch(push("/expenses"));
    // })
    // .catch(error => {
    //   this.setState({error: error});
    // });
    // event.preventDefault();
  };

  render() {
    const {email, password, error} = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <Container>
        <Grid
          textAlign='center'
          style={{height: '100%'}}
          verticalAlign='middle'
        >
          <Grid.Column style={{maxWidth: 450}}>
            <Header as='h2' color='teal' textAlign='center' content="Log-in to your account"/>
            <Form size='large' onSubmit={this.onSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  value={email}
                  onChange={event => this.setState({email: event.target.value})}
                  icon='user'
                  iconPosition='left'
                  placeholder='Email Address'
                />
                <Form.Input
                  fluid
                  value={password}
                  onChange={event => this.setState({password: event.target.value})}
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  autoComplete='true'
                  type='password'
                />
                <Button disabled={isInvalid} color='teal' fluid size='large'>Sign In</Button>
              </Segment>
            </Form>
            {error && <Message negative content={error.message}/>}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

SignInForm = connect()(SignInForm);
export default SignInForm;
