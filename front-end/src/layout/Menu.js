import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav>
      <hr />
      <ul className="top-nav">
        <li className="top-nav-item">
          <Link className="light accent3-hover" to="/dashboard">
            <i className="nav-icon fas fa-tachometer-alt accent3"></i>
            <span className="menu-text"> Dashboard</span>
          </Link>
        </li>
        <li className="top-nav-item">
          <Link className="light accent3-hover" to="/search">
            <i className="nav-icon fas fa-search accent3"></i>
            <span className="menu-text"> Search</span>
          </Link>
        </li>
        <li className="top-nav-item">
          <Link className="light accent1-hover" to="/reservations/new">
            <i className="nav-icon fas fa-user-plus accent1"></i>
            <span className="menu-text"> New Reservation</span>
          </Link>
        </li>
        <li className="top-nav-item">
          <Link className="light accent2-hover" to="/tables/new">
            <i className="nav-icon fas fa-utensils accent2"></i>
            <span className="menu-text"> New Table</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
