import React, { Component } from 'react';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { Loader, Dimmer, Header, Grid, Container, Segment } from 'semantic-ui-react';
import GoogleButton from '../GoogleLoginButton';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';

class SignInForm extends Component {
	handleGoogleLogin = () => {
		this.props.firebase.login({
			provider: 'google',
			type: 'redirect'
		});
		this.props.dispatch(replace('/expenses'));
	};

	render() {
		const { profile } = this.props;
		if (!profile.isLoaded)
			return (
				<Dimmer active={!profile.isLoaded}>
					<Loader active={!profile.isLoaded} size="huge">
						Loading
					</Loader>
				</Dimmer>
			);
		return (
			<Container>
				<Grid
					textAlign="center"
					style={{
						height: '100%'
					}}
					verticalAlign="middle"
				>
					<Grid.Column
						style={{
							maxWidth: 450
						}}
					>
						<Segment padded>
							<Header textAlign="center" content="Sign In" />
							<GoogleButton
								style={{
									width: -1
								}}
								onClick={this.handleGoogleLogin}
								type={'dark'}
							/>
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
	profile: PropTypes.object
};
export default compose(
	firestoreConnect(),
	connect(({ firebase: { profile } }) => ({
		profile
	}))
)(SignInForm);
