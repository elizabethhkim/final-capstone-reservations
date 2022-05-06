import { useHistory } from "react-router";

export default function DateNav({ date, next, today, prev, setDate }) {

  const history = useHistory();

  const handleDateNav = (newDate) => {
    setDate(newDate);
    history.push(`/dashboard?date=${newDate}`)
  }

  return (
    <div className="date-nav">
      <button onClick={() => handleDateNav(prev(date))} type="button" className="btn dark-bg accent3 light-hover"><i className="fas fa-backward"></i> Previous</button>
      <button onClick={() => handleDateNav(today())} type="button" className="btn dark accent3-bg">Today</button>
      <button onClick={() => handleDateNav(next(date))} type="button" className="btn dark-bg accent3 light-hover">Next <i className="fas fa-forward"></i></button>
    </div>
  )
}