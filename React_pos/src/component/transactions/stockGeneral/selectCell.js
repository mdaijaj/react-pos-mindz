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
  const [itemList, setItemList] = useState([]);
  const [units, setUnits] = useState({
    BaseUnit: "",
    AltUnit: "",
  });

  const pageLoad = async () => {
    const items = await db.itemMaster.toArray();
    setItemList(items);
  };

  // const getItem = (value) => {
  //   const item = itemList.find((x) => x.ItemName === value);
  //   setUnits((old) => {
  //     old.BaseUnit = item.BaseUnit;
  //   });
  // };

  const onChange = (value) => {
    setDropDownOption(false);
    if (id === "ItemName") {
      updateMyData(index, id, value);
    } else if (id === "ItemCode") {
      updateMyData(index, id, value);
    }
  };

  // We'll only update the external data when the input is blurred
  // const onBlur = () => {
  //   if (id === "ItemName" || id === "ItemCode") {
  //     updateMyData(id, value);
  //   } else {
  //     updateMyData(id, value);
  //   }
  // };

  // If the initialValue is changed external, sync it up with our state
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
  // const datas = [
  //   { ItemName: "deepak", ItemCode: "123" },
  //   { ItemName: "deepak", ItemCode: "123" },
  //   { ItemName: "deepak", ItemCode: "123" },
  //   { ItemName: "deepak", ItemCode: "123" },
  //   { ItemName: "deepak", ItemCode: "123" },
  // ];
  return (
    <div>
      {itemList && (
        <Autocomplete
          open={dropDownOption}
          options={itemList}
          onChange={(e, value) =>
            onChange(id === "ItemName" ? value.ItemName : value.ItemCode)
          }
          getOptionLabel={(option) =>
            id === "ItemName" ? option.ItemName : option.ItemCode
          }
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
