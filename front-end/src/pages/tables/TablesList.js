import TableDetail from "./TableDetail";
import "./tables.css";

export default function TablesList({ tables, setError }) {
  return (
    <div className="list">
      {tables.length > 0 &&
        tables.map((table) => (
          <TableDetail key={table.table_id} table={table} setError={setError} />
        ))}
    </div>
  );
}