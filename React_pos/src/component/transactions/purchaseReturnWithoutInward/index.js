import React, { useState, useEffect, useCallback } from "react";
import "./index.scss";
import calenderIcon from "../../../images/icon/calender.svg";
import CommonAction from "../../common/commonFormAction";
import db from "../../../datasync/dbs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import CustomTable from "../../common/table";
import column from "./column";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
} from "../../common/commonFunction";

const PreturnWithoutInward = ({ pageNav }) => {
  const obj = {
    documentNo: "",
    documentDate: "",
    vendorCode: "",
    vendorName: "",
    items: [],
    vendorList: [],
    itemlist: [],
    prList: [],
  };
  const requaire = {
    documentNo: "",
    documentDate: "",
    vendorCode: "",
    vendorName: "",
  };
  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState(obj);
  const [requiredObj, setRequiredObj] = useState(requaire);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [edit, setEdit] = useState();
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [saveEdit, setSaveEdit] = useState(false);
  const [updatedObj, setUpdatedObj] = useState();
  const [autocompleteOption, setAutocompleteOption] = useState([]);
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [refreshtbl, setRefreshtbl] = useState(false);
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
  const disableType = (e) => {
    e.preventDefault();
  };
  const reset = () => {
    setCreateObj(obj);
    setRequiredObj(requaire);
    setDropDownOption(false);
    setCodeFocus("");
    setDropdown("");
  };
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.PR_Master.where("Manual").equals(1).toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        AddEvent(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.PR_Master.where("Manual").equals(1).toArray();
      let srCount = count.filter(
        (a) => a.SeriesId === (series.seriesId === "" ? 0 : series.seriesId)
      );
      let val = { ...series, digit: 5, dbcount: srCount };
      let sr = await getseriesNo(val, pageNav.formid);
      AddEvent(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count = await db.PR_Master.where("Manual").equals(1).toArray();
      let srCount = count.filter(
        (a) => a.SeriesId === (series.seriesId === "" ? 0 : series.seriesId)
      );
      let val = { ...series, dbcount: srCount };
      let sr = await getseriesNo(val, pageNav.formid);
      AddEvent(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  /***
   * add event
   */
  const AddEvent = async (DocumentNo) => {
    const res = await db.customerMaster.where("LedgerType").equals(2).toArray();
    if (res) {
      setCreateObj({
        ...createObj,
        documentNo: DocumentNo,
        documentDate: new Date(),
        vendorList: res.sort((a, b) => a.PartyName.localeCompare(b.PartyName)),
      });
    }
  };
  const getitemlist = async () => {
    const itemList = await db.itemMaster.toArray();
    setAutocompleteOption(itemList);
  };
  const getVendor = (value) => {
    console.log(value, "vendor");
    if (value) {
      const a = codeFocus === "VendorName" ? "code" : "name";
      setCreateObj({
        ...createObj,
        venderId: value.Id,
        vendorCode: value.PartyCode,
        vendorName: value.PartyName,
      });
      setRequiredObj({ ...requiredObj, vendorCode: false, vendorName: false });
      setCodeFocus("");
      setDropDownOption("");
      setDropdown(a);
    }
  };
  const addItem = () => {
    let itemObj = {
      staticid: createObj.items.length + 1,
      ItemName: "",
      ItemCode: "",
      ItemId: "",
      returnQty: 0,
      MRP: 0,
    };
    let items = [...createObj.items, { ...itemObj }];
    setCreateObj({ ...createObj, items: items });
  };
  const tblOptionGet = (option) => {
    const array = createObj.items.map((a) => {
      return a.staticid === selectedTblRow.staticid
        ? { ...a, ItemName: option.ItemName, ItemCode: option.ItemCode }
        : a;
    });
    setCreateObj({ ...createObj, items: array });
    setUpdatedObj({
      ...updatedObj,
      ItemName: option.ItemName,
      ItemCode: option.ItemCode,
      ItemId: option.ItemId,
    });
    console.log(selectedTblRow, "selectedTblRow");
    console.log(option, "option");
  };
  /***
   * get Purchase Return list
   */
  const getPrList = async () => {
    let userID = localStorage.getItem("UserId");
    const Prlist1 = await db.PR_Master.where("Manual")
      .equals(1)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const Prlist = Prlist1.filter((f) => f.CreatedBy === userID);
    if (Prlist) {
      console.log(Prlist, "Prlist");
      setCreateObj({ ...createObj, prList: Prlist });
    }
  };
  /***
   * get purchase return
   */
  const getPr = async (value) => {
    if (value) {
      setCodeFocus("");
      setDropDownOption("");
      let res = await db.PR_Detail.where("Prid")
        .equals(value.id)
        .toArray()
        .then()
        .catch((err) => console.log(err));

      let venderRes = await db.customerMaster
        .where("Id")
        .equals(value.vendorid)
        .first();
      if (res) {
        let list = [];
        for (let item of res) {
          let proDetails = await db.itemMaster
            .where("ItemId")
            .equals(item.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          let itemobj = {
            id: item.id,
            Prid: item.Prid,
            ItemId: item.ItemId,
            returnQty: item.ReturnBaseQty,
            Rate: item.Rate,
            ItemCode: proDetails === undefined ? "" : proDetails.ItemCode,
            ItemName: proDetails === undefined ? "" : proDetails.ItemName,
            MRP: item.MRP,
          };
          list.push(itemobj);
        }
        let objDoc = {
          id: value.id,
          Id: value.Id,
          documentNo: value.PurchaseReturnNo,
          documentDate: value.PurchaseReturnDate,
          venderId: value.vendorid,
          vendorCode: venderRes.PartyCode,
          vendorName: venderRes.PartyName,
          new: value.new,
          items: list,
        };
        setCreateObj({ ...createObj, ...objDoc });
      }
    }
  };
  const change_state = (arg) => {
    switch (arg) {
      case "edit": {
        setVal(arg);
        setRefreshtbl(false);
        setSaveEdit(true);
        setEditcoulmn(true);
        getPrList();
        return;
      }
      case "refresh": {
        reset();
        setVal(arg);
        setRefreshtbl(true);
        setSaveEdit(false);
        return;
      }
      case "view": {
        setRefreshtbl(false);
        setSaveEdit(false);
        setEditcoulmn(false);
        getPrList();
        setVal(arg);

        return;
      }
      case "add": {
        getoucherList();
        setRefreshtbl(false);
        setSaveEdit(false);
        getitemlist();
        setEditcoulmn(true);
        setVal(arg);
        return;
      }
      case "save": {
        const objKey = Object.keys(requiredObj);
        var result = {};
        objKey.forEach(
          (key) => (result[key] = createObj[key] === "" ? true : false)
        );
        setRequiredObj(result);
        const error = Object.values(result).filter((a) => a === true);
        if (error.length > 0) {
          alert("please fill all the field");
        } else {
          saveData();
        }
        return;
      }

      default:
        return arg;
    }
  };
  /***********save data event */
  const saveItemData = async () => {
    const getId = await db.PR_Master.where("PurchaseReturnNo")
      .equals(createObj.documentNo)
      .first()
      .then()
      .catch((err) => console.log(err));
    if (getId) {
      const items = createObj.items.map((item) => {
        let objsaveitem = {
          Prid: getId.id,
          ItemId: item.ItemId,
          ReturnBaseQty: parseInt(item.returnQty),
          ReturnAltQty: 0,
          MRP: item.MRP,
        };
        if (!saveEdit) {
          return objsaveitem;
        } else {
          objsaveitem.id = item.id;
          return objsaveitem;
        }
      });
      if (!saveEdit) {
        await db.PR_Detail.bulkAdd(items)
          .then(function (additem) {
            if (additem) {
              alert("data save successfully");
              reset();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      } else {
        await db.PR_Detail.bulkPut(items).then(function (update) {
          if (update) {
            alert("data update successfully");
            reset();
            setVal("save");
          }
        });
      }
    }
  };
  const saveData = async () => {
    const objsave = {
      PurchaseReturnNo: createObj.documentNo,
      PurchaseReturnDate: createObj.documentDate,
      vendorid: createObj.venderId,
      CreatedBy: localStorage.getItem("UserId"),
      CreatedOn: new Date(),
      SeriesId:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      SeriesVoucherType:
        seriesandVoucher.voucherId === "" ? "" : seriesandVoucher.voucherId,
      Manual: 1,
    };
    if (!saveEdit) {
      await db.PR_Master.add({ ...objsave, new: 1, update: 0 })
        .then(function (add) {
          if (add) {
            saveItemData();
          }
        })
        .catch((err) => console.log(err));
    } else {
      const obj = { ...objsave, Id: createObj.Id, update: 1 };
      await db.PR_Master.put(createObj.id, obj)
        .then(function (add) {
          if (add) {
            saveItemData();
          }
        })
        .catch((err) => console.log(err));
    }
  };
  /***********save data event end*/
  /******table event */
  const selectedRow = (item) => {
    setSelectedTblRow(item);
    if (edit) {
      if (selectedTblRow) {
        console.log(selectedTblRow, "selectedTblRow1");
        const array = createObj.items.map((a) => {
          if (val === "add") {
            return a.staticid === selectedTblRow.staticid
              ? { ...a, ...selectedTblRow }
              : a;
          } else {
            return a.id === selectedTblRow.id ? { ...a, ...selectedTblRow } : a;
          }
        });
        setCreateObj({ ...createObj, items: array });
      }
    }
    setEdit(false);
  };

  const editItem = () => {
    setEdit(true);
  };
  const tableInputOnchange = (e) => {
    setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    return e.target.value;
  };
  const removeItem = () => {
    const res = createObj.items.filter((a) =>
      val === "add"
        ? a.staticid !== selectedTblRow.staticid
        : a.id !== selectedTblRow.id
    );
    if (res) {
      if (val === "add") {
        const nArray = res.map((a, index) => {
          return { ...a, staticid: index + 1 };
        });
        setCreateObj({ ...createObj, items: nArray });
      } else {
        setCreateObj({ ...createObj, items: res });
      }
    }
  };
  const updateAction = useCallback(() => {
    const array = createObj.items.map((a) => {
      if (val === "add") {
        return a.staticid === selectedTblRow.staticid
          ? { ...a, ...updatedObj }
          : a;
      } else {
        return a.id === selectedTblRow.id ? { ...a, ...updatedObj } : a;
      }
    });
    setCreateObj({ ...createObj, items: array });
    setEdit(false);
    setUpdatedObj();
  }, [selectedTblRow, updatedObj, createObj, val]);
  /******table event end*/
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
        updateAction();
        // setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    codeFocus,
    createObj,
    requiredObj,
    selectedTblRow,
    updatedObj,
    updateAction,
  ]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="purchaseRWI"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonAction {...para} />
        <div className="purchaseRWIIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div
                  className={
                    requiredObj && requiredObj.documentNo === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label>
                    <Text content="Document No" />.
                  </label>
                  {val === "view" || val === "edit" ? (
                    <Autocomplete
                      open={dropDownOption === "DocumentNo" ? true : false}
                      options={createObj.prList}
                      onChange={(e, value) => getPr(value)}
                      getOptionLabel={(option) =>
                        option.PurchaseReturnNo.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("DocumentNo")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="documentNo"
                      readOnly={true}
                      value={createObj && createObj.documentNo}
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div
                  className={
                    requiredObj && requiredObj.documentDate === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label>
                    <Text content="Document Date" />
                  </label>
                  <DatePicker
                    selected={createObj.documentDate}
                    minDate={createObj.documentDate}
                    maxDate={createObj.documentDate}
                    // onChange={(date) => onchangeDate(date)}
                    dropdownMode="select"
                    onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    requiredObj && requiredObj.vendorName === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Name" />
                  </label>
                  {val === "add" && dropdown !== "name" ? (
                    <Autocomplete
                      open={dropDownOption === "VendorName" ? true : false}
                      options={createObj.vendorList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.PartyName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("VendorName")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      name="vendorName"
                      type="text"
                      readOnly={true}
                      value={createObj && createObj.vendorName}
                    />
                  )}
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    requiredObj && requiredObj.vendorCode === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Code" />
                  </label>
                  {val === "add" && dropdown !== "code" ? (
                    <Autocomplete
                      open={dropDownOption === "VendorCode" ? true : false}
                      options={createObj.vendorList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.PartyCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("VendorCode")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      name="vendorCode"
                      type="text"
                      readOnly={true}
                      value={createObj && createObj.vendorCode}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mt-1 mb-2">
              <div className="tableBox">
                <CustomTable
                  coulmn={column}
                  data={createObj.items}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={autocompleteOption}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  itemAdd={val === "add" ? () => addItem() : false}
                  refreshTable={refreshtbl}
                  editbtnText="Add Item detail"
                />
              </div>
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
    </>
  );
};
export default PreturnWithoutInward;
