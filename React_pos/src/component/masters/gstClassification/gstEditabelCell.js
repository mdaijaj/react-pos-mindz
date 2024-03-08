import React, { useEffect, useState } from "react";
import { vNum } from "../../common/validation";
const GstEditabelCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  data,
  updateGstData,
  updateGstRow, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState({});
  const [codeFocus, setCodeFocus] = useState(false);
  const onChange = (e) => {
    if (vNum(e.target.value, 0, 17)) {
      setValue(e.target.value);
      setError({ [id + "error"]: "" });
    } else {
      setError({ [id + "error"]: "Please enter number" });
      setTimeout(() => {
        setError({ [id + "error"]: "" });
      }, 2000);
    }
    if (e.target.value === "") {
      setValue("");
    } else {
      setValue(e.target.value);
    }
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    setCodeFocus(false);

    updateGstData(index, id, value ? value : "");
  };

  // If the initialValue is changed external, sync it up with our state

  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.keyCode == 13) {
          e.preventDefault();
          updateGstRow(index, id, value);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
      setValue(initialValue);
    };
  }, [codeFocus, initialValue]);

  return (
    <>
      <input
        value={value}
        onFocus={() => {
          setCodeFocus(true);
        }}
        onChange={onChange}
        onBlur={onBlur}
      />
      <span style={{ color: "red" }}>{error[id + "error"]}</span>
    </>
  );
};

export default GstEditabelCell;
