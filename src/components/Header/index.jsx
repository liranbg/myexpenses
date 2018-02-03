import React, { Component } from "react";
import { replace } from "react-router-redux";
import { connect } from "react-redux";
import { Segment, Icon, Menu, Container } from 'semantic-ui-react';


class Header extends Component {
  handleItemClick = (e, {to}) => this.props.dispatch(replace(to));

  render() {
    const {user} = this.props.session;
    let activeItem = this.props.history.location ? this.props.history.location.pathname : "";
    if (!user)
      return (
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Container>
              <Menu.Item header>
                <Icon name="won"/>
                My Expenses
              </Menu.Item>
              <Menu.Item
                as={"a"}
                active={activeItem === '/signin'}
                to={'/signin'}
                onClick={this.handleItemClick} content="Sign In"
              />
            </Container>
          </Menu>
        </Segment>);
    else return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Container>
            <Menu.Item header>
              <Icon name="won"/>
              My Expenses
            </Menu.Item>
            <Menu.Item
              as={"a"}
              active={activeItem === '/expenses'}
              to={'/expenses'}
              onClick={this.handleItemClick} content="Expenses"
            />
            <Menu.Item
              as={"a"}
              active={activeItem === '/tags'}
              to={'/tags'}
              onClick={this.handleItemClick}
              content="Tags"
            />
            <Menu.Item
              as={"a"}
              active={activeItem === '/charts'}
              to={'/charts'}
              onClick={this.handleItemClick}
              content="Charts"
            />
          </Container>
        </Menu>
      </Segment>
    );
  }
}

Header = connect((state) => ({history: state.router, session: state.session}))(Header);

export default Header;