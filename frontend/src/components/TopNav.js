import React, { useState, useContext } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavLink,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { UserContext } from "../user-context";

const TopNav = ({ eventFilter }) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  const [collapsed, setCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleNavbar = () => setCollapsed(!collapsed);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <div>
      <Navbar color="dark" dark expand="lg">
        <NavbarToggler onClick={toggleNavbar}></NavbarToggler>
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">HOME</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/events">CREATE EVENTS</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/myregistrations">REGISTRATION REQUESTS</NavLink>
            </NavItem>

            <Dropdown nav inNavbar isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle nav caret>
                FILTER
              </DropdownToggle>
              <DropdownMenu>
                {eventFilter.list.map((item, index) => (
                  <DropdownItem
                    active={index === eventFilter.index}
                    key={item.name}
                    onClick={() => eventFilter.update(index)}
                  >
                    {item.display}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Nav>

          <NavLink
            href="/login"
            onClick={logoutHandler}
            style={{ float: "right" }}
          >
            <img src="https://img.icons8.com/fluent-systems-filled/38/000000/export.png" />
          </NavLink>
        </Collapse>
      </Navbar>
    </div>
  ) : (
    <div> </div>
  );
};

export default TopNav;
