import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import { Link } from "react-router-dom";

import "./Layout.css"

function Layout() {
  return (
    <div className="body">
      <header className="light-neutral-bg">
        <Link to="/" className="light med-neutral-hover">
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
