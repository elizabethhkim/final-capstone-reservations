import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { cancelReservation } from "../../utils/api";
import dateFormat from "../../utils/dateFormat";
import formatTime from "../../utils/timeFormat";

export default function ReservationDetail({ reservation, setError }) {
  const history = useHistory();
  const {
    reservation_id,
    reservation_date,
    reservation_time,
    first_name,
    last_name,
    mobile_number,
    status,
    people,
  } = reservation;

  const handleCancel = async (e) => {
    const ac = new AbortController();
    const finish = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (finish) {
      try {
        setError(null);
        await cancelReservation(reservation_id, ac.signal);
        history.go();
      } catch (err) {
        setError(err);
      }
    }
  };

  return (
    <div key={reservation_id} className={`detail-card res-card ${status}`}>
      <p
        className={`res-status dark ${status} rounded-left-corners-rotated`}
        data-reservation-id-status={reservation_id}
      >
        {status}
      </p>
      <div className="res-details">
        <h4 className="res-name">
          {first_name} {last_name}
        </h4>
        <p className="expecting font-italic medium">
          <span>expecting</span> <span className="font-weight-bold">party of {people}</span>
        </p>
        <p className="font-weight-bold medium res-date">
          {dateFormat(reservation_date)} {formatTime(reservation_time)}
        </p>
        <p className="medium">contact: {mobile_number}</p>
      </div>
      {status !== "finished" && status !== "cancelled" && (
        <div className={`res-buttons rotate ${status}-buttons`}>
          {status === "booked" && (
            <Link
              to={`/reservations/${reservation_id}/seat`}
              className="res-btn medium-bg light accent2-hover"
            >
              Seat
            </Link>
          )}
          <Link
            to={`/reservations/${reservation_id}/edit`}
            className="res-btn med-dark-bg light accent1-hover"
          >
            Edit
          </Link>

          <button
            onClick={handleCancel}
            data-reservation-id-cancel={reservation_id}
            className="res-btn light dark-bg accent3-hover rounded-right-corners-rotated"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}