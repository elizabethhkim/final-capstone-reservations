export default function formatTime(time) {
    let hour = time[0] + time[1];
    let minutes = time[3] + time[4];
    let meridiem = "AM";
    if (Number(hour) >= 12) {
      meridiem = "PM";
      Number(hour) === 12 ? (hour = 12) : (hour -= 12);
    }
    return `${hour}:${minutes} ${meridiem}`;
  };