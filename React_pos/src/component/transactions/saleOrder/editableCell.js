import React from "react";
import { vNum } from "../../common/validation";
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  data,
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState({});
  const onChange = (e) => {
    if (id === "Rate" || id === "quantity") {
      if (e.target.value === "0") {
        setError({ [id + "error"]: "Please enter value greater than 0" });
        setTimeout(() => {
          setError({ [id + "error"]: "" });
        }, 2000);
      } else {
        if (vNum(e.target.value, 0, 17)) {
          setValue(e.target.value);
          setError({ [id + "error"]: "" });
        } else {
          setError({ [id + "error"]: "Please enter number" });
          setTimeout(() => {
            setError({ [id + "error"]: "" });
          }, 2000);
        }
      }
    } else {
      setValue(e.target.value);
    }
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    if (id === "Rate" || id === "quantity") {
      updateMyData(index, id, value ? value : 0);
    } else {
      updateMyData(index, id, value);
    }
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div>
      <input
        value={value}
        onFocus={() => {
          setValue("");
        }}
        onChange={onChange}
        onBlur={onBlur}
      />
      <span style={{ color: "red" }}>{error[id + "error"]}</span>
    </div>
  );
};

export default EditableCell;
