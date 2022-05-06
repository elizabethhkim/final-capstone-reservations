import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "./NotFound";
import CreateReservation from "../pages/reservations/CreateReservations";
import CreateTable from "../pages/tables/CreateTable";
import SeatReservation from "../pages/reservations/SeatReservation";
import SearchReservations from "../pages/reservations/SearchReservations";
import EditReservation from "../pages/reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/search">
        <SearchReservations />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
