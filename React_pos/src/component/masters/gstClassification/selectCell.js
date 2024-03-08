import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import "./stockGeneral.scss";

const SelectCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  data,
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [stateList, setStateList] = useState([]);

  const pageLoad = async () => {
    const states = await db.stateMaster.toArray();
    setStateList(states);
  };

  const onChange = (value) => {
    setDropDownOption(false);
    const data = {
      CountryId: value.CountryId,
      CountryName: value.CountryName,
      StateCode: value.StateCode,
      StateId: value.StateId,
      StateName: value.StateName,
    };
    updateMyData(id, index, data);
  };

  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
      pageLoad();
    };
  }, [codeFocus]);

  return (
    <div>
      {stateList && (
        <Autocomplete
          open={dropDownOption}
          options={stateList}
          onChange={(e, value) => onChange(value)}
          getOptionLabel={(option) => option.StateName}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Press ctrl + L"
              onFocus={() => setCodeFocus(true)}
              onBlur={() => {
                setCodeFocus(false);
                setDropDownOption(false);
                //onBlur();
              }}
            />
          )}
        />
      )}
    </div>
  );
};

export default SelectCell;
