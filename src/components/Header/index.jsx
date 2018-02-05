import React, { Component } from 'react';
import { replace } from 'react-router-redux';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Item,
  Image,
  Segment,
  Icon,
  Menu,
  Container,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';

const SIGNED_IN_ROUTES = [
  { route: '/expenses', title: 'Expenses' },
  { route: '/tags', title: 'Tags' },
  { route: '/charts', title: 'Charts' }
];

class Header extends Component {
  handleSignOut = () => {
    this.props.firebase.logout();
  };

  handleItemClick = (e, { to }) => this.props.dispatch(replace(to));

  render() {
    const { router, profile } = this.props;
    let activeItem = router.location ? router.location.pathname : null;
    return (
      <Segment style={{ padding: 0, backgroundColor: '#42A5F5' }}>
        <Menu pointing secondary>
          <Container>
            <MenuItem style={{ alignSelf: 'normal' }} header>
              <Icon name="won" />
              My Expenses
            </MenuItem>
            {profile.isLoaded &&
              !profile.isEmpty &&
              SIGNED_IN_ROUTES.map(item => (
                <MenuItem
                  style={{ alignSelf: 'normal' }}
                  key={item.route}
                  as={'a'}
                  active={activeItem === item.route}
                  to={item.route}
                  onClick={this.handleItemClick}
                  content={item.title}
                />
              ))}
            {profile.isLoaded &&
              !profile.isEmpty && (
                <Item className={'right'}>
                  <Dropdown
                    icon={
                      <Image
                        centered
                        avatar
                        src={profile.photoURL}
                        title={profile.email}
                      />
                    }
                  >
                    <DropdownMenu style={{ marginTop: 12 }}>
                      <Dropdown.Header>
                        Hey {profile.displayName},
                      </Dropdown.Header>
                      <DropdownItem
                        content="SignOut"
                        onClick={this.handleSignOut}
                      />
                    </DropdownMenu>
                  </Dropdown>
                </Item>
              )}
          </Container>
        </Menu>
      </Segment>
    );
  }
}

Header.propTypes = {
  firebase: PropTypes.shape({
    logout: PropTypes.func.isRequired
  }),
  profile: PropTypes.object,
  router: PropTypes.object
};

export default compose(
  firestoreConnect(),
  connect(({ firebase: { profile }, router }) => ({
    profile,
    router
  }))
)(Header);
