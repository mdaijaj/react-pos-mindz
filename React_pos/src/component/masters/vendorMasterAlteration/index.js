import React, { useEffect, useState } from "react";
import "./unitMaster.scss";
import CustomTable from "../../common/table";
import { column } from "./column";
import CommonFormAction from "../../common/commonFormAction";
import db from "../../../datasync/dbs";
const VendorMasterAlteration = ({pageNav}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedObj, setUpdatedObj] = useState({});
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [selectedItemRow, setSelectedItemRow] = useState();
  const [edit, setEdit] = useState();
  const [val, setVal] = useState("");
  const [disabledAction, setDisabledAction] = useState({
    add:pageNav.AllowNew === false ? "disable":"",
    view:pageNav.AllowView === false ? "disable":"",
    edit:pageNav.AllowEdit === false ? "disable":"",
    authorize:pageNav.AllowAuthorize === false ? "disable":"",
    print:pageNav.AllowPrint === false ? "disable":"",
  });
  const change_state = async (arg) => {
    // if (arg === "add") {
    //   await pageLoad();
    //   return setVal(arg);
    // }

    // if (arg === "edit") {
    //   await pageLoad();
    //   setEdit(true);
    //   return setVal(arg);
    // }

    if (arg === "view") {
      await pageLoad();
      return setVal(arg);
    }

    if (arg === "save") {
      await db.customerMaster.clear().then(() => {
        db.customerMaster
          .bulkPut(selectedItems)
          .then((res) => {
            alert("updated successfully", res);
          })
          .catch((err) => {
            alert("something went wrong", err);
          });
      });
      await change_state("refresh");
    }

    if (arg === "refresh") {
      setUpdatedObj();
      setEdit(false);
      setSelectedItems([]);
      return setVal(arg);
    }
  };
  const pageLoad = async () => {
    const unitList = await db.customerMaster.toArray();
    setSelectedItems(unitList);
  };
  const updateItem = () => {
    const update = selectedItems.map((item) => {
      if (item.Id === selectedItemRow.Id) {
        return { ...item, ...updatedObj };
      } else {
        return item;
      }
    });
    setSelectedItems(update);
    setUpdatedObj();
  };

  const selectedRow = (item) => {
    setSelectedItemRow(item);
    setEdit(true);
  };

  /**
   * table input handle change event
   */
  const tableInputOnchange = (e) => {
    setUpdatedObj({
      ...updatedObj,
      [e.target.name]: e.target.value,
    });
    return e.target.value;
  };

  /**
   * edit button status event
   */
  const editItem = () => {
    setEdit(true);
  };

  const removeItem = () => {
    const newList = selectedItems.filter(
      (item) => item.Id !== selectedItemRow.Id
    );
    if (newList && newList.length !== 0) {
      setSelectedItems(newList);
    } else {
      setSelectedItems([{}]);
      setEdit(true);
    }
  };
  const tableDate = () => {};
  const addLine = () => {};
  useEffect(() => {
    const getKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        updateItem();
        setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [selectedItems, selectedItemRow, updatedObj, edit]);

  const para = { val, change_state, disabledAction };

  return (
    <div className="tabBox" style={{display:pageNav.hide === true ? "none":"block"}}>
      <CommonFormAction {...para} />
      <div className="unitMaster">
          <div className="unitMaster">
            <div className="tableBox">
              <CustomTable
                coulmn={column}
                overFlowScroll={true}
                data={selectedItems}
                selectedTr={(item) => selectedRow(item)}
                Footer={true}
                //editColumn={editcoulmn}
               // editfunction={() => editItem()}
                editStatus={edit}
                deleteRow={() => removeItem()}
                tblInputOnchange={(e) => tableInputOnchange(e)}
                tableDate={(e) => tableDate(e)}
                addLine={() => addLine()}
              />
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default VendorMasterAlteration;
