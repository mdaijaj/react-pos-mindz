import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const DateCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  data,
  updateGstDate, // This is a custom function that we supplied to our table instance
}) => {
  const [date, setDate] = useState();
  const onchange = (value) => {
    setDate(value);
    updateGstDate(index, id, value);
  };
  useEffect(() => {
    setDate(null);
  }, []);
  return (
    <>
      <DatePicker
        selected={date}
        onChange={(value) => onchange(value)}
        dateFormat="dd-MM-yyyy"
      />
    </>
  );
};

export default DateCell;
