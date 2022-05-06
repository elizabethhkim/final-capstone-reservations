export default function SelectTable({ table }) {
    if (!table.reservation_id) {
      return (
        <option value={table.table_id} key={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
    return <></>
  }
  