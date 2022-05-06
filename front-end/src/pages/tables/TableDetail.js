import { useHistory } from "react-router";
import { openTable } from "../../utils/api";

export default function TableDetail({ table, setError }) {
  const history = useHistory();

  const handleFinish = async (e) => {
    const finish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (finish) {
      try {
        await openTable(table.table_id);
        history.go();
      } catch (err) {
        setError(err);
      }
    }
  };

  const tableStatus = table.reservation_id ? (
    <p
      className="dark tab-status-detail occupied"
      data-table-id-status={table.table_id}
    >
      <span className="tab-status medium-bg  rounded-top-left-corner">
        Occupied
      </span>
      <button
        type="submit"
        data-table-id-finish={table.table_id}
        className="tab-btn light medium-bg rounded-bottom-left-corner"
        onClick={handleFinish}
      >
        Finish
      </button>
    </p>
  ) : (
    <p
      className="med-green-bg tab-status-detail rounded-left-corners"
      data-table-id-status={table.table_id}
    >
      Free
    </p>
  );

  const seated = table.reservation_id ? (
    <>
      seated: <span className="font-italic font-weight-bold dark">{table.reservation.last_name}</span>{" "}
      party of <span className="font-italic font-weight-bold dark">{table.reservation.people}</span>
    </>
  ) : (
    `seats ${table.capacity}`
  );

  return (
    <div key={table.table_id} className="detail-card tab-card">
      {tableStatus}
      <div className="tab-details">
        <h4 className="tab-name">{table.table_name}</h4>
        <p className="medium">{seated}</p>
      </div>
    </div>
  );
}