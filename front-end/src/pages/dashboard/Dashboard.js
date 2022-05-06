import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../../utils/api";
import { today, next, previous } from "../../utils/date-time";
import useQuery from "../../utils/useQuery";
import ErrorAlert from "../../layout/ErrorAlert";
import ReservationsList from "../Reservations/ReservationsList";
import DateNav from "../../layout/DateNav";
import dateFormat from "../../utils/dateFormat";
import TablesList from "../Tables/TablesList";
import "./dashboard.css";

function Dashboard() {
  const query = useQuery();
  const [date, setDate] = useState(query.get("date") || today());
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const ac = new AbortController();
    setError(null);
    async function loadReservations() {
      try {
        const loadedReservations = await listReservations({ date }, ac.signal);
        setReservations([...loadedReservations]);
        setError(null);
      } catch (err) {
        setError(err);
      }
    }
    async function loadTables() {
      try {
        setError(null);
        const loadedTables = await listTables(ac.signal);
        setTables([...loadedTables]);
      } catch (err) {
        setError(err);
      }
    }

    loadReservations();
    loadTables();
    return () => ac.abort();
  }

  return (
    <>
      <h1 className="title">Dashboard</h1>
      <ErrorAlert error={error} />
      <div className="dashboard-content">
        <section id="reservations">
          <div className="section-heading">
            <h2 className="sub-title">
              <i className="fas fa-user-friends accent1"></i> Reservations
            </h2>
            <p className="reservations-date">for {dateFormat(date)}</p>
          </div>

          <DateNav
            date={date}
            next={next}
            today={today}
            prev={previous}
            setDate={setDate}
          />

          {reservations.length < 1 && <h3>No reservations for this date</h3>}

          <ReservationsList
            reservations={reservations}
            setError={setError}
            date={date}
            next={next}
            today={today}
            prev={previous}
            setDate={setDate}
          />
        </section>
        <section id="tables">
          <div className="section-heading">
            <h2 className="sub-title">
              <i className="fas fa-utensils accent2"></i> {""} Tables
            </h2>
          </div>
          <TablesList tables={tables} setError={setError} />
        </section>
      </div>
    </>
  );
}

export default Dashboard;
