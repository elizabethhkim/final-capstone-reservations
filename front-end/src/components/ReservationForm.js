import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate } from "../utils/date-time";

export default function ReservationForm() {
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [formData, setFormData] = useState({ ...initialFormData });
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();

  const history = useHistory();

  useEffect(loadFormData, [reservation_id]);

  function loadFormData() {
    const ac = new AbortController();

    async function loadReservation() {
      try {
        const loadedRes = await readReservation(reservation_id, ac.signal);

        setFormData({
          ...loadedRes,
          reservation_date: formatAsDate(loadedRes.reservation_date),
        });
      } catch (err) {
        setError(err);
      }
    }
    if (reservation_id) loadReservation();
    return () => ac.abort();
  }

  const formatPhoneNumber = (num) => {
    if (!num) return num;
    const mobNum = num.replace(/[^\d]/g, "");
    const len = mobNum.length;

    if (len < 4) return mobNum;
    if (len < 7) return `(${mobNum.slice(0, 3)}) ${mobNum.slice(3)}`;
    return `(${mobNum.slice(0, 3)}) ${mobNum.slice(3, 6)}-${mobNum.slice(
      6,
      10
    )}`;
  };

  const handleChange = ({ target }) => {
    if (target.type === "tel") {
      setFormData({
        ...formData,
        [target.name]: formatPhoneNumber(target.value),
      });
    } else if (target.type === "number") {
      setFormData({
        ...formData,
        [target.name]: Number(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ac = new AbortController();
    try {
      if (reservation_id) {
        await updateReservation(formData, ac.signal);
      } else {
        await createReservation(formData, ac.signal);
      }
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-item">
            <input
              type="tel"
              className="res-inp"
              name="mobile_number"
              id="mobile_number"
              placeholder=" "
              value={formData.mobile_number}
              onChange={handleChange}
              autoFocus
              required
            />
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
            </label>
          </div>
          <div className="form-item">
            <input
              type="text"
              className="res-inp"
              name="first_name"
              id="first_name"
              placeholder=" "
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
          </div>
          <div className="form-item">
            <input
              type="text"
              className="res-inp"
              name="last_name"
              id="last_name"
              placeholder=" "
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
          </div>
          <div className="form-item">
            <input
              type="number"
              className="res-inp"
              name="people"
              id="people"
              placeholder=" "
              min="1"
              value={formData.people}
              onChange={handleChange}
              required
            />
            <label className="form-label" htmlFor="people">
              Party Size
            </label>
          </div>
          <div className="form-item-dt date">
            <label className="form-label-dt" htmlFor="reservation_date">
              Reservation Date{" "}
              <span className="text-muted">(closed Tuesdays)</span>
            </label>
            <input
              type="date"
              className="inp"
              name="reservation_date"
              id="reservation_date"
              value={formData.reservation_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item-dt time">
            <label className="form-label-dt" htmlFor="reservation_time">
              Reservation Time
            </label>
            <input
              type="time"
              className="inp"
              name="reservation_time"
              id="reservation_time"
              value={formData.reservation_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <button
            className="form-btn dark-bg light"
            type="button"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <button className="form-btn accent1-bg" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
