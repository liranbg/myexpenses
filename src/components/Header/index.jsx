import React, { Component } from "react";
import { push, replace } from "react-router-redux";
import { connect } from "react-redux";
import { auth, firebase } from '../../firebase';
import {
  Image, Segment, Icon, Menu, Container, MenuItem,
  Dropdown, DropdownMenu, DropdownItem
} from 'semantic-ui-react';
import { setUser } from "../../actions";


const SIGNED_IN_ROUTES = [
  {route: "/expenses", title: "Expenses"},
  {route: "/tags", title: "Tags"},
  {route: "/charts", title: "Charts"},
];

class Header extends Component {

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.dispatch(setUser(user));
        this.props.dispatch(push("/expenses"));
      }
    });
  }

  handleSignOut = () => {
    auth.doSignOut().then(() => {
      this.props.dispatch(setUser(null));
      this.props.dispatch(replace("/signin"));
    });

  };

  handleItemClick = (e, {to}) => this.props.dispatch(replace(to));

  render() {
    const {user} = this.props.session;
    let activeItem = this.props.history.location ? this.props.history.location.pathname : "";
    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Container>
            <MenuItem header>
              <Icon name="won"/>
              My Expenses
            </MenuItem>
            {
              user ?
                SIGNED_IN_ROUTES.map(item => (
                  <MenuItem
                    key={item.route}
                    as={"a"}
                    active={activeItem === item.route}
                    to={item.route}
                    onClick={this.handleItemClick}
                    content={item.title}
                  />
                ))
                :
                <MenuItem
                  as={"a"}
                  active={true}
                  to={'/signin'}
                  onClick={this.handleItemClick} content="Sign In"
                />
            }

            {
              user &&
              <Segment className={"item right"} style={{width: 64}}>
                <Image
                  avatar
                  style={{width: "100%"}}
                  src={user.photoURL}
                  title={user.email}
                />
                <Dropdown pointing>
                  <DropdownMenu>
                    <DropdownItem
                      content="SignOut"
                      onClick={this.handleSignOut}
                    />
                  </DropdownMenu>
                </Dropdown>
              </Segment>
            }
          </Container>
        </Menu>
      </Segment>
    );
  }
}

/*
<Dropdown pointing>
                  <DropdownMenu>
                    <DropdownItem>SignOut</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
 */
Header = connect((state) => ({history: state.router, session: state.session}))(Header);

export default Header;