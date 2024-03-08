import { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./unitMaster.scss";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { column } from "./column";
import { detailColumn } from "./detailsColumn";
import CustomTable from "../../common/table";
const ItemAttributeMaster = ({pageNav}) => {
  const [val, setVal] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDetailItems, setSelectedDetailItems] = useState([]);
  const [updatedObj, setUpdatedObj] = useState({});
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [selectedItemRow, setSelectedItemRow] = useState();
  const [edit, setEdit] = useState();
  const [updatedDetailObj, setUpdatedDetailObj] = useState({});
  const [editDetailcoulmn, setEditDetailcoulmn] = useState(true);
  const [selectedDetailItemRow, setSelectedDetailItemRow] = useState();
  const [editDetail, setEditDetail] = useState();
  const [tempData, setTempData] = useState([]);
  const [disabledAction, setDisabledAction] = useState({
    add:pageNav.AllowNew === false ? "disable":"",
    view:pageNav.AllowView === false ? "disable":"",
    edit:pageNav.AllowEdit === false ? "disable":"",
    authorize:pageNav.AllowAuthorize === false ? "disable":"",
    print:pageNav.AllowPrint === false ? "disable":"",
  });
  const change_state = async (arg) => {
    if (arg === "add") {
      let id = randomId();
      setSelectedItems([{ Id: id }]);
      setSelectedDetailItems([{ Id: id }]);
      setEdit(true);
      setEditDetail(true);

      setSelectedDetailItemRow();
      setEditDetailcoulmn(true);
      setSelectedItemRow();
      setEditcoulmn(true);
      return setVal(arg);
    }

    if (arg === "edit") {
      await pageLoad();
      setEditcoulmn(true);
      setEditDetailcoulmn(true);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      return setVal(arg);
    }

    if (arg === "save") {
      // let result = selectedItems.map(({ Id, ...rest }) => ({
      //   ...rest,
      // }));
      // db.attributeMaster.bulkAdd(result).then((res) => {
      //   let result = selectedDetailItems.map(({ Id, ...rest }) => ({
      //     ...rest,
      //     AttributeId: res,
      //   }));
      //   db.attributeMasterDetails.bulkAdd(result).then((res) => {
      //     alert(res);
      //   });
      // });
    }

    if (arg === "refresh") {
      setUpdatedObj();
      setEditcoulmn(false);
      setEdit(false);
      setSelectedItems([]);
      setEditDetailcoulmn(false);
      setEditDetail(false);
      setSelectedDetailItems([]);
      return setVal(arg);
    }
  };

  const pageLoad = async () => {
    const unitList = await db.attributeMaster.toArray();
    const detailList = await db.attributeMasterDetails.toArray();
    setSelectedItems(unitList);
    setSelectedDetailItems(detailList);
    setTempData(detailList);
  };

  const tableDate = async (e) => {
    return false;
  };

  const randomId = () => {
    let bill = "SO";
    bill += Date.now();
    return bill;
  };

  const addLine = async () => {
    let random = await randomId();

    const resVal = selectedItems.filter((a) => a.AttributeName === "");
    if (resVal.length > 0) {
      return false;
    } else {
      setSelectedItems([
        ...selectedItems,
        { Id: random, AttributeName: "", IsActive: false },
      ]);
      return;
    }
  };

  const addDetailLine = async () => {
    const Id = selectedItemRow && selectedItemRow.Id;
    let random = await randomId();
    const resVal = selectedDetailItems.filter(
      (a) => a.SizeCode === "" || a.Code === ""
    );
    if (resVal.length > 0) {
      return false;
    } else {
      setSelectedDetailItems([
        ...selectedDetailItems,
        {
          Id: random,
          SizeCode: "",
          Code: "",
          PrintName: "",
          IsActive: false,
        },
      ]);
      setUpdatedDetailObj();
      return;
    }
  };
  const selectedRow = async (item) => {
    setSelectedItemRow(item);
    if ((item && val === "view") || val === "edit") {
      const detail = tempData.filter((x) => x.AttributeId === item.Id);
      if (detail && detail.length > 0) {
        setSelectedDetailItems(detail);
      } else {
        let id = randomId();
        setSelectedDetailItems([{ Id: id }]);
      }
    }
  };
  const selectedDetailRow = async (item) => {
    setSelectedDetailItemRow(item);
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
  const detailInputOnchange = (e) => {
    setUpdatedDetailObj({
      ...updatedDetailObj,
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
  const editDetailItem = () => {
    setEditDetail(true);
  };
  const oncheck = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setUpdatedObj({
      ...updatedObj,
      [e.target.name]: value,
    });
    return value;
  };
  const onDetailcheck = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setUpdatedDetailObj({
      ...updatedDetailObj,
      [e.target.name]: value,
    });
    return value;
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
  const removeDetailItem = () => {
    const newList = selectedDetailItems.filter(
      (item) => item.Id !== selectedDetailItemRow.Id
    );
    if (newList && newList.length !== 0) {
      setSelectedDetailItems(newList);
    } else {
      setSelectedDetailItems([{}]);
      setEditDetail(true);
    }
  };

  /**
   * get updated item from item popup
   */

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

  const updateDetailItem = () => {
    const update = selectedDetailItems.map((item) => {
      if (item.Id === selectedDetailItemRow.Id) {
        return { ...item, ...updatedDetailObj };
      } else {
        return item;
      }
    });

    setSelectedDetailItems(update);
    setUpdatedDetailObj();
  };
  useEffect(() => {
    const getKey = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        updateItem();
        setEdit(false);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        updateDetailItem();
        setEditDetail(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    selectedItems,
    selectedItemRow,
    selectedDetailItemRow,
    selectedDetailItems,
    updatedObj,
    updatedDetailObj,
    editDetail,
    edit,
  ]);

  const para = { val, change_state,disabledAction };

  return (
    <>
      <div className="tabBox" style={{display:pageNav.hide === true ? "none":"block"}}>
        <CommonFormAction {...para} />

        <div className="unitMaster">
          <div className="row" style={{ width: "100%" }}>
            <div className="col w35">
              <div className="tableBox">
                <CustomTable
                  coulmn={column}
                  overFlowScroll={false}
                  data={selectedItems}
                  selectedTr={(item) => selectedRow(item)}
                  Footer={false}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  tableDate={(e) => tableDate(e)}
                  addLine={() => addLine()}
                  oncheck={(e) => oncheck(e)}
                />
              </div>
            </div>
            <div className="col w35">
              <div className="tableBox">
                <CustomTable
                  coulmn={detailColumn}
                  overFlowScroll={false}
                  data={selectedDetailItems}
                  selectedTr={(item) => selectedDetailRow(item)}
                  Footer={false}
                  editColumn={editDetailcoulmn}
                  editfunction={() => editDetailItem()}
                  editStatus={editDetail}
                  deleteRow={() => removeDetailItem()}
                  tblInputOnchange={(e) => detailInputOnchange(e)}
                  tableDate={(e) => {
                    return false;
                  }}
                  addLine={() => addDetailLine()}
                  oncheck={(e) => onDetailcheck(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemAttributeMaster;
