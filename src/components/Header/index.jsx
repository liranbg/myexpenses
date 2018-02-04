import React, { Component } from "react";
import { push, replace } from "react-router-redux";
import { connect } from "react-redux";
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
import { setUser } from "../../actions";


const SIGNED_IN_ROUTES = [
  {route: "/expenses", title: "Expenses"},
  {route: "/tags", title: "Tags"},
  {route: "/charts", title: "Charts"},
];

class Header extends Component {

  componentWillMount() {
    // auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.props.dispatch(setUser(user));
    //   }
    // });
  }

  handleSignOut = () => {
    // auth.doSignOut().then(() => {
    //   this.props.dispatch(setUser(null));
    //   this.props.dispatch(replace("/signin"));
    // });

  };

  handleItemClick = (e, {to}) => this.props.dispatch(replace(to));

  render() {
    let activeItem = this.props.history.location ? this.props.history.location.pathname : "";
    return (
      <Segment style={{padding: 0, backgroundColor: "#42A5F5"}}>
        <Menu pointing secondary>
          <Container>
            <MenuItem style={{alignSelf: "normal"}} header>
              <Icon name="won"/>
              My Expenses
            </MenuItem>
            {
              this.props.profile.isLoaded ?
                SIGNED_IN_ROUTES.map(item => (
                  <MenuItem
                    style={{alignSelf: "normal"}}
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
                  style={{alignSelf: "normal"}}
                  onClick={this.handleItemClick} content="Sign In"
                />
            }
            {
              this.props.profile.isLoaded &&
              <Item className={"right"}>
                <Dropdown icon={
                  <Image
                    centered
                    avatar
                    src={this.props.profile.photoURL}
                    title={this.props.profile.email}
                  />
                }>
                  <DropdownMenu style={{marginTop: 12}}>
                    <Dropdown.Header>
                      Hey {this.props.profile.displayName},
                    </Dropdown.Header>
                    <DropdownItem
                      content="SignOut"
                      onClick={this.handleSignOut}
                    />
                  </DropdownMenu>
                </Dropdown>
              </Item>
            }
          </Container>
        </Menu>
      </Segment>
    );
  }
}

Header = connect((state) => ({history: state.router, session: state.session}))(Header);

export default connect(({ firebase: { profile } }) => ({ profile }))(Header);