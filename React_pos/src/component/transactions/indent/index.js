import "./indent.scss";
import calenderIcon from "../../../images/icon/calender.svg";
import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import db from "../../../datasync/dbs";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CommonFormAction from "../../common/commonFormAction";
import CustomTable from "../../common/table";
import coulmn from "./tableCoulmn";
import indentCoulmn from "./indentItemCoulmn";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
} from "../../common/commonFunction";
import srLatn from "date-fns/locale/sr-Latn/index";

const Indent = ({ pageNav }) => {
  const obj = {
    indentNo: "",
    indentDate: "",
    vendorName: "",
    vendorCode: "",
    indentBy: "",
    remark: "",
    indentList: [],
  };
  const reqObj = {
    indentNo: "",
    indentDate: "",
    vendorName: "",
    vendorCode: "",
    indentBy: "",
  };
  const [errorObj, setErrorObj] = useState(reqObj);
  const [val, setVal] = useState("");
  const [createObj, setCreateObj] = useState({
    ...obj,
    indentDate: new Date(),
  });
  const [customerList, setCustomerList] = useState([]);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [itemList, setItemList] = useState();
  const [updateEvent, setUpdateEvent] = useState();
  const [codeFocus, setCodeFocus] = useState(false);
  const [checkedItem, setCheckedItem] = useState();
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedObj, setUpdatedObj] = useState({});
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [selectedItemRow, setSelectedItemRow] = useState();
  const [edit, setEdit] = useState();
  const [open, setOpen] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const createBy = async () => {
    let userId = localStorage.getItem("UserId");
    let users = await db.userMaster.toArray();
    if (users) {
      const crtby = users.find((a) => a.Id === parseInt(userId));
      console.log(crtby.UserName, "");
      return crtby.UserName;
    }
  };
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let crBy = await createBy();
        console.log(crBy, "indentBy: crBy");
        let count = await db.IndentMaster.toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        let sr = await getseriesNo(val, pageNav.formid);
        setCreateObj({ ...createObj, indentNo: sr, indentBy: crBy });
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    let crBy = await createBy();
    if (series.digit === undefined) {
      let count =
        series.seriesId === ""
          ? await db.IndentMaster.where("SeriesId").equals(0).toArray()
          : await db.IndentMaster.where("SeriesId")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, digit: 5, dbcount: count.length > 0 ? count : [] };
      let sr = await getseriesNo(val, pageNav.formid);
      setCreateObj({ ...createObj, indentNo: sr, indentBy: crBy });
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count =
        series.seriesId === ""
          ? await db.IndentMaster.where("SeriesId").equals(0).toArray()
          : await db.IndentMaster.where("SeriesId")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, dbcount: count.length > 0 ? count : [] };
      let sr = await getseriesNo(val, pageNav.formid);
      setCreateObj({ ...createObj, indentNo: sr, indentBy: crBy });
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  
  const change_state = (arg) => {
    switch (arg) {
      case "add": {
        getoucherList();
        setUpdateEvent(false);
        setEditcoulmn(true);
        getCustomers();
        setVal(arg);
        getItems();
        return;
      }
      case "save": {
        saveData();
        return;
      }
      case "edit": {
        setUpdateEvent(true);
        setVal(arg);
        setEditcoulmn(true);
        setErrorObj(reqObj);
        getCustomers();
        getIndentList();
        getItems();
        return;
      }

      case "refresh": {
        restData();
        return;
      }
      case "print": {
        return;
      }
      case "view": {
        setErrorObj(reqObj);
        setEditcoulmn(false);
        getIndentList();
        setVal(arg);
        return;
      }
      default:
        return arg;
    }
  };
  /**
   * Reset fields event
   */
  const restData = () => {
    setCreateObj({ ...obj, indentDate: new Date() });
    setErrorObj(reqObj);
    setVal("refresh");
    setUpdatedObj({});
    setEditcoulmn(false);
    setUpdateEvent(false);
    // setCustomerList();
    setSeriesandVoucher({
      seriesId: "",
      voucherId: "",
    });
    setCheckedItem([]);
    setSelectedItems([]);
  };

  /**
   * get indentNo
   */
  const getIndentList = async () => {
    let userId = localStorage.getItem("UserId");
    const res1 = await db.IndentMaster.toArray();
    const res = res1.filter((f) => f.CreatedBy === parseInt(userId));
    setCreateObj({ ...createObj, indentList: res });
  };
  /**
   * Select Indent
   */
  const getIndent = async (indent) => {
    // alert(indent)
    if (indent) {
      let x = await db.userMaster.toArray();
      const crtby = x.find((a) => a.Id === parseInt(indent.CreatedBy));
      const IndentObj = {
        indentNo: indent.IndentNo,
        indentDate: indent.IndentDate,
        Id: indent.Id,
        id: indent.id,
        vendorName: indent.PartyName,
        vendorCode: indent.vendorCode,
        indentBy: crtby.UserName,
        remark: indent.Remarks,
        PartyId: indent.PartyId,
        new: indent.new,
        update: indent.update,
      };
      const indentItem = await db.IndentDetail.where("IndentNo")
        .equals(indent.IndentNo)
        .toArray();
      setCreateObj({ ...createObj, ...IndentObj });
      setCodeFocus("");
      setDropDownOption("");
      if (await indentItem) {
        const indItem = [];
        indentItem.map(async (item) => {
          await db.itemMaster
            .where("ItemId")
            .equals(parseInt(item.ItemId))
            .first()
            .then((a) => {
              var res = {
                Id: item.Id,
                id: item.id,
                IndentId: item.IndentId,
                RequiredQty: item.Quantity,
                indentNo: item.IndentNo,
                ItemId: item.ItemId,
                Remark: item.ItemRemarks,
                Priority: item.Priority,
                ItemName: a.ItemName,
                ItemCode: a.ItemCode,
                unit: "NOS",
                StockBaseQty: 0,
                StockAltQty: 0,
                RequiredAltQty: 0,
              };
              indItem.push(res);
              if (indItem.length === indentItem.length) {
                setSelectedItems(indItem);
              }
            });
        });
      }
    }
  };
  /**
   * Handle change for input field
   */
  const handleChange = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setErrorObj({ ...errorObj, [e.target.name]: true });
    } else {
      setErrorObj({ ...errorObj, [e.target.name]: false });
    }
  };
  const disableType = (e) => {
    e.preventDefault();
  };
  /**
   * Get vendor List
   */
  const getCustomers = async () => {
    const getCustomerList = await db.customerMaster
      .where("LedgerType")
      .equals(2)
      .toArray();
    setCustomerList(
      getCustomerList.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
    );
  };
  /**
   * select vendor
   */
  const getVendor = (vendor) => {
    if (vendor) {
      setCreateObj({
        ...createObj,
        vendorCode: vendor.PartyCode,
        vendorName: vendor.PartyName,
      });
      setErrorObj({
        ...errorObj,
        vendorCode: false,
        vendorName: false,
      });
      setCodeFocus("");
      setDropDownOption("");
    }
  };
  /**
   * get Item list from DB
   */
  const getItems = async () => {
    let itemlist = await db.itemMaster.toArray();
    itemlist = await Promise.all(
      itemlist.map(async (item) => {
        let unitName = await db.unitMaster
          .where("Id")
          .equals(item.UnitName)
          .first();
        return {
          ...item,
          id: item.Id,
          unit: unitName.UnitName,
          baseQty: 0,
          StockAltQty: 0,
        };
      })
    );
    setItemList(itemlist);
  };
  /**
   * open Item popup
   */
  const handleOpen = () => {
    setOpen(true);
  };
  /**
   *close Item popup
   */
  const handleClose = () => {
    setOpen(false);
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };
  /**
   * get checked items from popup items
   */
  const getCheckedRows = (res) => {
    setGetcheckedRows(res);
  };

  /**
   * create item Object with add fields
   */
  const ObjItem = (itemObj) => {
    const object = itemObj.map((o) => {
      return {
        ...o,
        remark: "",
        RequiredQty: 0,
        RequiredAltQty: 0,
        Priority: "",
      };
    });
    return object;
  };
  /**
   * Popup ok button event
   */
  const okSubmit = () => {
    const ids = getcheckedRows.map((a) => {
      return a.ItemId;
    });
    const objget = ObjItem(getcheckedRows);
    if (objget.length > 0) {
      if (ids) {
        setCheckedItem(ids);
        if (!selectedItems) {
          setSelectedItems(objget);
        } else {
          const results = objget.filter(
            ({ ItemId: id1 }) =>
              !selectedItems.some(({ ItemId: id2 }) => id2 === id1)
          );
          const results2 = selectedItems.filter(
            ({ ItemId: id1 }) => !objget.some(({ ItemId: id2 }) => id2 === id1)
          );
          if (results.length > 0) {
            setSelectedItems((prevArray) => [...prevArray, ...results]);
          }
          if (results2.length > 0) {
            const results3 = selectedItems.filter(
              ({ ItemId: id1 }) =>
                !results2.some(({ ItemId: id2 }) => id2 === id1)
            );
            if (results3) {
              setSelectedItems(results3);
            }
          }
        }
      }
    }

    setOpen(false);
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };
  /**
   * get selected item row for edit item
   */
  const selectedRow = (item) => {
    setSelectedItemRow(item);
  };
  /**
   * table input handle change event
   */
  const tableInputOnchange = (e) => {
    setUpdatedObj({
      ...updatedObj,
      [e.target.name]:
        e.target.name === "RequiredQty"
          ? parseInt(e.target.value)
          : e.target.value,
    });
    return e.target.value;
  };
  /**
   * edit button status event
   */
  const editItem = () => {
    setEdit(true);
  };
  const removeItem = () => {};
  /**
   * get updated item from item popup
   */
  const updateItem = useCallback(() => {
    // console.log(selectedItems, "selectedItems");
    // console.log(updatedObj, "updatedObj");
    // console.log(selectedItemRow, "updatedObj");
    const update = selectedItems.map((item) => {
      if (item.ItemId === selectedItemRow.ItemId) {
        return { ...item, ...updatedObj };
      } else {
        return item;
      }
    });
    setSelectedItems(update);
    setUpdatedObj({});
  }, [updatedObj, selectedItemRow]);
  /**
   *Save data event
   */
  const saveItem = async (itmeObj) => {
    let id = await db.IndentMaster.where("IndentNo")
      .equals(createObj.indentNo)
      .first()
      .then()
      .catch((err) => console.log(err));
    if (id){
      let newarray = itmeObj.map((a) => {
        return { ...a, IndentId: id.id };
      });
      db.IndentDetail.bulkAdd(newarray).then(function (itemsave) {
        if (itemsave) {
          alert("Indent item save successfully");
          restData();
        } else {
          alert("Indent item save fail");
        }
      });
    }
  };

  const saveData = async () => {
    const objKey = Object.keys(errorObj);
    var result = {};
    objKey.forEach(
      (key) => (result[key] = createObj[key] === "" ? true : false)
    );
    setErrorObj(result);
    if (selectedItems && selectedItems.length === 0) {
      alert("Please add items");
    } else {  
      const error = Object.values(result).filter((a) => a === true);
      if (error && error.length > 0) {
        alert("Please fill all the fields");
      } else {
        const pId = await customerList.find(
          (a) => a.PartyCode === createObj.vendorCode
        );

        const indObj = {
          IndentNo: createObj.indentNo,
          IndentDate: createObj.indentDate,
          PartyId: updateEvent === false ? pId.Id : createObj.PartyId,
          PartyName: createObj.vendorName,
          CreatedBy: parseInt(localStorage.getItem("UserId")),
          CreatedOn: new Date(),
          Remarks: createObj.remark,
          SeriesId:
            seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
          SeriesVoucherType: seriesandVoucher.voucherId,
          vendorCode: createObj.vendorCode,
          new:
            createObj.new === undefined || createObj.new === ""
              ? 0
              : createObj.new,
          update:
            createObj.update === undefined || createObj.update === ""
              ? 0
              : createObj.update,
        };
        if (updateEvent) {
          indObj["Id"] = createObj.Id;
          indObj["id"] = createObj.id;
          indObj["update"] = 1;
        }
        const itemObj =
          selectedItems &&
          selectedItems.map((item) => {
            if (!updateEvent) {
              return {
                Quantity: item.RequiredQty,
                IndentNo: createObj.indentNo,
                ItemId: item.ItemId,
                ItemRemarks: item.Remark === undefined ? "" : item.Remark,
                Priority: item.Priority,
              };
            } else {
              return {
                Quantity: item.RequiredQty,
                IndentNo: createObj.indentNo,
                ItemId: item.ItemId,
                ItemRemarks: item.Remark === undefined ? "" : item.Remark,
                Priority: item.Priority,
                IndentId: item.IndentId,
                id: item.id,
              };
            }
          });
        if (!updateEvent) {
          if (itemObj && itemObj.length > 0) {
            db.IndentMaster.add({ ...indObj, new: 1 }).then(function (save) {
              if (save) {
                saveItem(itemObj);
              } else {
                console.log("save fail");
              }
            });
          } else {
            console.log("not save");
          }
        } else {
          await db.IndentMaster.put({ ...indObj, update: 1 }).then(function (
            update
          ) {
            if (update) {
              db.IndentDetail.bulkPut(itemObj).then(function (itemupdate) {
                if (itemupdate) {
                  alert("update successfully");
                  restData();
                }
              });
            }
          });
        }
        // console.log(indObj, "indObj");
      }
    }
  };
  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(codeFocus);
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        updateItem();
        setEdit(false);
      }

      if (e.ctrlKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        if (val === "add" || val === "edit") {
          handleOpen();
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    updateItem,
    val,
    createObj,
    codeFocus,
    itemList,
    getcheckedRows,
    checkedItem,
    selectedItems,
    selectedItemRow,
    updatedObj,
    edit,
    errorObj,
    customerList,
    updateEvent,
  ]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="indent"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="indentIn mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Indent No" />
                    <span className="required">*</span>
                  </label>
                  {val === "edit" || val === "view" ? (
                    <Autocomplete
                      open={dropDownOption === "IndentNo" ? true : false}
                      options={createObj.indentList}
                      onChange={(e, value) => getIndent(value)}
                      getOptionLabel={(option) => option.IndentNo.toString()}
                      renderInput={(params) => (
                        <TextField {...params} placeholder={"Press ctrl + L"} />
                      )}
                      onFocus={() => setCodeFocus("IndentNo")}
                      onBlur={() => {
                        setCodeFocus("");
                        setDropDownOption("");
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      name="indentNo"
                      onChange={(e) => handleChange(e)}
                      value={createObj && createObj.indentNo}
                      readOnly={true}
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Indent Date" />
                    <span className="required">*</span>
                  </label>
                  <DatePicker
                    name="indentDate"
                    selected={createObj && createObj.indentDate}
                    minDate={createObj && createObj.indentDate}
                    maxDate={createObj && createObj.indentDate}
                    onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    errorObj.vendorCode === true ? "error formBox" : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Name" />
                    <span className="required">*</span>
                  </label>
                  {val === "add" ? (
                    <Autocomplete
                      open={dropDownOption === "name" ? true : false}
                      options={customerList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.PartyName}
                      renderInput={(params) => (
                        <TextField {...params} placeholder={"Press ctrl + L"} />
                      )}
                      onFocus={() => setCodeFocus("name")}
                      onBlur={() => {
                        setCodeFocus("");
                        setDropDownOption("");
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      name="vendorName"
                      readOnly={true}
                      value={createObj && createObj.vendorName}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col3">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Vendor Code" />
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="vendorCode"
                    value={createObj && createObj.vendorCode}
                    readOnly={true}
                    className={errorObj.vendorCode === true ? "error" : ""}
                  />
                </div>
              </div>
              <div className="col col3">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Indent By" />
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="indentBy"
                    value={createObj && createObj.indentBy}
                    onChange={(e) => handleChange(e)}
                    className={errorObj.indentBy === true ? "error" : ""}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col col3">
                {val === "edit" || val === "add" ? (
                  <div className="showText">
                    <Text content=" Press Ctrl + F for show all Item List" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="tableBox">
                <CustomTable
                  coulmn={indentCoulmn}
                  overFlowScroll={true}
                  data={selectedItems}
                  selectedTr={(item) => selectedRow(item)}
                  Footer={false}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col w100">
              <div className="RemarkForm mt-2 mb-2">
                <label htmlFor="">
                  <Text content="Remark" />
                </label>
                <textarea
                  placeholder="Write remarks here"
                  name="remark"
                  value={createObj && createObj.remark}
                  onChange={(e) => handleChange(e)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        {voucherStatus && (
          <div className="voucherPop">
            <div className="voucherPopin">
              <h3>
                <Text content="Voucher List" />
              </h3>
              <ul>
                {voucherList.map((a) => (
                  <li onClick={(e) => getVoucher(e, a)}>{a.VoucherName}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {open && val !== "view" ? (
        <div className="modalPopUp">
          <div className="modalPopUPin">
            <CustomTable
              coulmn={coulmn}
              data={itemList}
              overFlowScroll={true}
              checkbox={true}
              selectedRows={checkedItem}
              getCheckedItem={(res) => getCheckedRows(res)}
              Footer={true}
              filter={true}
            />
            <div className="popupButton">
              <button
                onClick={() => okSubmit()}
                className="btn btnGreen mr-5 mlAuto"
              >
                <Text content="Ok" />
              </button>
              <button onClick={() => handleClose()} className="btn btnRed">
                <Text content="Cancel" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default Indent;
