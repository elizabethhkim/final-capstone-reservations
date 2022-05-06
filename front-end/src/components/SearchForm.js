export default function SearchForm({
    handleSubmit,
    handleChange,
    mobile_number,
  }) {
    return (
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-item">
            <input
              type="text"
              name="mobile_number"
              className="search inp"
              value={mobile_number}
              onChange={handleChange}
              placeholder="Search by phone.."
              autoFocus
              required
            />
            <button type="submit" className="form-btn med-green-bg">
              Find
            </button>
        </div>
      </form>
    );
  }