import React, { Component } from "react";
import { replace } from "react-router-redux";
import { connect } from "react-redux";
import { Segment, Icon, Menu, Container } from 'semantic-ui-react';


class Header extends Component {
  handleItemClick = (e, {to}) => this.props.dispatch(replace(to));

  render() {
    let activeItem = this.props.history.location ? this.props.history.location.pathname : "";
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
              active={activeItem === '/expenses'}
              to={'/expenses'}
              onClick={this.handleItemClick}
            >
              Expenses
            </Menu.Item>
            <Menu.Item
              as={"a"}
              active={activeItem === '/tags'}
              to={'/tags'}
              onClick={this.handleItemClick}
            >
              Tags
            </Menu.Item>
            <Menu.Item
              as={"a"}
              active={activeItem === '/charts'}
              to={'/charts'}
              onClick={this.handleItemClick}
            >
              Charts
            </Menu.Item>
          </Container>
        </Menu>
      </Segment>
    );
  }
}

Header = connect((state) => ({history: state.router}))(Header);

export default Header;