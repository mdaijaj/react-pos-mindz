import { useState, useEffect } from "react";
const Timer = (props) => {
  const [time, setTime] = useState();
  useEffect(() => {
    const interval = setInterval(() => {
      const getTime = new Date();
      const Hours = getTime.getHours() % 12;
      const amPm = getTime.getHours() >= 12 ? "PM" : "AM";
      const newTime =
        (Hours === 12 ? "00" : Hours === 0 ? "12" : Hours) +
        ":" +
        getTime.getMinutes() +
        ":" +
        getTime.getSeconds() +
        " " +
        amPm;

      setTime(newTime);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <input
      ref={props.reff}
      id="demo"
      type="text"
      value={time}
      readOnly={true}
      className={props.className}
    />
  );
};
export default Timer;
