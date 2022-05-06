import { useState } from "react";
import SearchForm from "../../Components/SearchForm";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservations } from "../../utils/api";
import ReservationsList from "./ReservationsList";

export default function SearchReservations() {
  const [mobile_number, setMobile_number] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setMobile_number(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ac = new AbortController();
    setError(null);
    try {
      const loadedReservations = await listReservations(
        { mobile_number },
        ac.signal
      );
      setReservations([...loadedReservations]);
      setMobile_number("");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <h1 className="text-center">Search Reservations</h1>
      <SearchForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        mobile_number={mobile_number}
      />
      <ErrorAlert error={error} />
      {reservations.length < 1 && <h2>No reservations found</h2>}
      <div className="search-res-list">
        <ReservationsList reservations={reservations} setError={setError} />
      </div>
    </>
  );
}
