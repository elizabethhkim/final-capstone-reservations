import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function TableForm() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [error, setError] = useState(null);

  const history = useHistory();

  const handleChange = ({ target }) => {
    if (target.type === "number") {
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
      await createTable(formData, ac.signal);
      history.push("/");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <form className="table-form" onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-item">
            <input
              type="text"
              className="res-inp"
              name="table_name"
              id="table_name"
              placeholder=" "
              value={formData.table_name}
              onChange={handleChange}
              autoFocus
              required
            />

            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
          </div>
          <div className="form-item">
            <input
              type="number"
              className="res-inp"
              name="capacity"
              id="capacity"
              placeholder=" "
              value={formData.capacity}
              onChange={handleChange}
              required
            />
            <label className="form-label" htmlFor="capacity">
              Table Capacity
            </label>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="form-btn dark-bg light"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <button type="submit" className="form-btn accent2-bg">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
