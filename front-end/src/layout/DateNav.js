import { useHistory } from "react-router";

export default function DateNav({ date, next, today, prev, setDate }) {

  const history = useHistory();

  const handleDateNav = (newDate) => {
    setDate(newDate);
    history.push(`/dashboard?date=${newDate}`)
  }

  return (
    <div className="date-nav">
      <button onClick={() => handleDateNav(prev(date))} type="button" className="btn med-neutral-bg light"><i className="fas fa-backward"></i> Previous</button>
      <button onClick={() => handleDateNav(today())} type="button" className="btn dark med-green-bg">Today</button>
      <button onClick={() => handleDateNav(next(date))} type="button" className="btn med-neutral-bg light">Next <i className="fas fa-forward"></i></button>
    </div>
  )
}