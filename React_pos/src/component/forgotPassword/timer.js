import React, { useState, useEffect } from "react";
const Timer = (props) => {
  const [time, setTime] = useState({
    h: 0,
    m: 0,
    s: 0,
  });
  const [countTimer, setCountTimer] = useState(props.minute);
  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  };
  //   const startTimer = (m) => {
  //     let x = m;
  //     const timer = setInterval(() => {
  //       x = x - 1;
  //       if (x >= 1) {
  //         countDown(x);
  //       } else {
  //         if (props.count > 2) {
  //           alert("please try again after some time");
  //           return () => clearInterval(timer);
  //         }
  //         return () => clearInterval(timer);
  //       }
  //     }, 1000);
  //   };
  const countDown = (m) => {
    //let t = m - 1;
    setTime(secondsToTime(m));
    setCountTimer(m);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      let x = countTimer - 1;
      if (x >= 0) {
        countDown(x);
      } else if (countTimer === 0) {
        setCountTimer(-1);
        props.resbtn();
      } else {
        return () => clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countTimer, props]);
  return (
    <>
      <span>
        {time.m} : {time.s}
      </span>
    </>
  );
};
export default Timer;
