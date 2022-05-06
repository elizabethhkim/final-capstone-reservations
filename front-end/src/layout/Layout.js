import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import { Link } from "react-router-dom";


import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="body">
      <header className="dark-bg ">
        <Link to="/" className="light accent3-hover">
        <h1 className="logo">Periodic Tables</h1>
        </Link>
        <Menu />
      </header>
      <main className="content">
        <Routes />
      </main>
    </div>
  );
}

export default Layout;
