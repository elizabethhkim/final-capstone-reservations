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
          <Link className="light med-neutral-hover" to="/dashboard">
            <i className="nav-icon fas fa-tachometer-alt dark-neutral"></i>
            <span className="menu-text"> Dashboard</span>
          </Link>
        </li>
        <li className="top-nav-item">
          <Link className="light med-neutral-hover" to="/search">
            <i className="nav-icon fas fa-search dark-neutral"></i>
            <span className="menu-text"> Search</span>
          </Link>
        </li>
        <li className="top-nav-item">
          <Link className="light med-neutral-hover" to="/reservations/new">
            <i className="nav-icon fas fa-user-plus dark-green"></i>
            <span className="menu-text"> New Reservation</span>
          </Link>
        </li>
        <li className="top-nav-item">
          <Link className="light med-neutral-hover" to="/tables/new">
            <i className="nav-icon fas fa-utensils dark-green"></i>
            <span className="menu-text"> New Table</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
