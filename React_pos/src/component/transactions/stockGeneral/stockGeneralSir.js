import "./stockGeneral.scss";
import CommonFormAction from "../../common/commonFormAction";
import calenderIcon from "../../../images/icon/calender.svg";
import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import coulmn from "./tableCoulmn";
import CustomTable from "../../common/table";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  updateStockIndDb,
  updateStockIndDbUpdate,
} from "../../common/commonFunction";

const StockGeneral = ({ pageNav }) => {
  const obj = {
    transactionNo: "",
    sgDate: "",
    Remark: "",
    items: [],
    itemList: [],
    TrList: [],
  };

  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState(obj);
  const [edit, setEdit] = useState();
  const [refreshtbl, setRefreshtbl] = useState(false);
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [saveEdit, setSaveEdit] = useState(false);
  const [updatedObj, setUpdatedObj] = useState();
  const [codeFocus, setCodeFocus] = useState(false);
  const [addbtn, setAddbtn] = useState(false);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);

  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.AdjustmentMaster.toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        genTransactionNo(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.AdjustmentMaster.toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      genTransactionNo(sr);
    } else {
      let count = await db.AdjustmentMaster.toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      genTransactionNo(sr);
    }
    setVoucherStatus(false);
  };
  const genTransactionNo = async (transactionNo) => {
    const res = await db.itemMaster.toArray();
    setCreateObj({
      ...createObj,
      transactionNo: transactionNo,
      sgDate: new Date(),
      itemList: res,
    });
  };
  const reset = () => {
    setCreateObj(obj);
    setSaveEdit(false);
    setRefreshtbl(true);
  };
  const addItem = () => {
    if (addbtn === true && createObj.items.length > 0) {
      alert("please add item detail");
    } else {
      const ItemObj = {
        staticid: createObj.items.length + 1,
        ItemName: "",
        ItemCode: "",
        baseUnit: "",
        altUnit: "",
        MRP: 0,
        QuantityIn: 0,
        QuantityOut: 0,
      };
      let items = [...createObj.items, { ...ItemObj }];
      setCreateObj({ ...createObj, items: items });
      setAddbtn(true);
    }
  };
  const change_state = (arg) => {
    switch (arg) {
      case "view": {
        setVal(arg);
        setRefreshtbl(false);
        setSaveEdit(false);
        getTrlist();
        setEditcoulmn(false);
        return;
      }
      case "edit": {
        setRefreshtbl(false);
        setSaveEdit(true);
        setEditcoulmn(true);
        setVal(arg);
        getTrlist();

        return;
      }
      case "refresh": {
        setVal(arg);
        setCreateObj(obj);
        setSaveEdit(false);
        setRefreshtbl(true);
        return;
      }
      case "add": {
        getoucherList();
        setSaveEdit(false);
        setRefreshtbl(false);
        setEditcoulmn(true);
        setVal(arg);
        return;
      }
      case "save": {
        if (createObj.items.length < 1) {
          alert("please add at least one item");
        } else if (createObj.items.length > 0) {
          const fl = createObj.items.filter(
            (a) => a.ItemName !== "" && a.QuantityIn > 0
          );
          if (fl.length > 0) {
            saveData();
          } else {
            alert(
              "please add item and Item Detail item name and Quantity (+) required"
            );
          }
        }

        return;
      }
      default:
        return arg;
    }
  };
  const onchange = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
  };
  const getTrlist = async () => {
    let userID = localStorage.getItem("UserId");
    const res1 = await db.AdjustmentMaster.toArray();
    const res = res1.filter((f) => f.CreatedBy === parseInt(userID));
    const reslist = await db.itemMaster.toArray();
    setCreateObj({ ...createObj, TrList: res, itemList: reslist });
  };
  const getTrNo = async (value) => {
    if (value) {
      setCodeFocus("");
      setDropDownOption("");
      let valueid =
        value.Id === "" || value.Id === null || value.Id === undefined
          ? value.id
          : value.Id;
      let res = await db.AdjustmentDetail.where("stockadjustmentid")
        .equals(valueid)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      // console.log(res,"ressssss");
      if (res) {
        let list = [];
        for (let item of res) {
          let proDetails = await db.itemMaster
            .where("ItemId")
            .equals(item.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          let unitName = await db.unitMaster
            .where("Id")
            .equals(proDetails.UnitName)
            .first();
          let AltunitName = await db.unitMaster
            .where("Id")
            .equals(proDetails.UnitAltName)
            .first();
          let itemobj = {
            id: item.id,
            ItemCode: proDetails === undefined ? "" : proDetails.ItemCode,
            ItemName: proDetails === undefined ? "" : proDetails.ItemName,
            baseUnit: unitName.UnitName,
            altUnit: AltunitName.UnitName,
            ItemId: item.ItemId,
            MRP: item.MRP,
            QuantityIn: item.QuantityIn,
            QuantityOut: item.QuantityOut,
          };
          list.push(itemobj);
        }
        let objDoc = {
          transactionNo: value.AdjusmentNo,
          sgDate: value.AdjusmentDate,
          Remark: value.Remarks,
          items: list,
        };
        setCreateObj({ ...createObj, ...objDoc });
      }
    }
  };
  const tblOptionGet = async (option) => {
    let unitName = await db.unitMaster
      .where("Id")
      .equals(option.UnitName)
      .first();
    let AltunitName = await db.unitMaster
      .where("Id")
      .equals(option.UnitAltName)
      .first();

    const array = createObj.items.map((a) => {
      return a.staticid === selectedTblRow.staticid
        ? {
            ...a,
            ItemName: option.ItemName,
            ItemCode: option.ItemCode,
            baseUnit: unitName.UnitName,
            altUnit: AltunitName.UnitName,
          }
        : a;
    });
    setCreateObj({ ...createObj, items: array });
    setUpdatedObj({
      ...updatedObj,
      ItemName: option.ItemName,
      ItemCode: option.ItemCode,
      ItemId: option.ItemId,
      baseUnit: unitName.UnitName,
      altUnit: AltunitName.UnitName,
    });
  };
  const removeItem = () => {
    const res = createObj.items.filter((a) =>
      a.id !== undefined
        ? a.id !== selectedTblRow.id
        : a.staticid !== selectedTblRow.staticid
    );
    if (res) {
      const nArray = res.map((a, index) => {
        if (a.id === undefined) {
          return { ...a, staticid: index + 1 };
        } else {
          return a;
        }
      });
      setCreateObj({ ...createObj, items: nArray });
    }
  };
  const selectedRow = (item) => {
    setSelectedTblRow(item);
    if (edit) {
      if (selectedTblRow) {
        console.log(selectedTblRow, "selectedTblRow1");
        const array = createObj.items.map((a) => {
          return a.id !== undefined
            ? a.id === selectedTblRow.id
              ? { ...a, ...selectedTblRow }
              : a
            : a.staticid === selectedTblRow.staticid
            ? { ...a, ...selectedTblRow }
            : a;
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
  const updateAction = useCallback(() => {
    const array = createObj.items.map((a) => {
      if (a.id === undefined) {
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
    setAddbtn(false);
  }, [selectedTblRow, updatedObj, createObj]);
  /***********save data event */
  const saveItemData = async () => {
    const getId = await db.AdjustmentMaster.where("AdjusmentNo")
      .equals(createObj.transactionNo)
      .first()
      .then()
      .catch((err) => console.log(err));
    if (getId) {
      const Getitems = createObj.items.map((item) => {
        let objsaveitem = {
          stockadjustmentid: getId.id,
          ItemId: item.ItemId,
          MRP: parseInt(item.MRP),
          QuantityIn: parseInt(item.QuantityIn),
          QuantityOut: parseInt(item.QuantityOut),
        };
        if (!saveEdit) {
          return objsaveitem;
        } else {
          objsaveitem.id = item.id;
          return objsaveitem;
        }
      });
      const items = Getitems.filter((a) => a.ItemId !== "" && a.QuantityIn > 0);
      if (!saveEdit) {
        await db.AdjustmentDetail.bulkAdd(items)
          .then(function (additem) {
            if (additem) {
              alert("data save successfully");
              const x = items.map((c) => {
                const nObj = {
                  formId: pageNav.formid,
                  trId: getId.id,
                  ItemId: c.ItemId,
                  Inqty: c.QuantityIn,
                  Outqty: c.QuantityOut,
                  type: "stockG",
                };
                return nObj;
              });
              updateStockIndDb(x);
              reset();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      } else {
        await db.AdjustmentDetail.bulkPut(items).then(function (update) {
          if (update) {
            alert("data update successfully");
            const x = items.map((c) => {
              const nObj = {
                formId: pageNav.formid,
                trId: getId.id,
                ItemId: c.ItemId,
                Inqty: c.QuantityIn,
                Outqty: c.QuantityOut,
                type: "stockG",
              };
              return nObj;
            });
            updateStockIndDbUpdate(x);
            reset();
            setVal("save");
          }
        });
      }
    }
  };
  const saveData = async () => {
    const objsave = {
      AdjusmentNo: createObj.transactionNo,
      AdjusmentDate: createObj.sgDate,
      CreatedBy: parseInt(localStorage.getItem("UserId")),
      Remarks: createObj.Remark,
      CreatedOn: new Date(),
      new: 1,
      update: 0,
    };
    if (!saveEdit) {
      await db.AdjustmentMaster.add(objsave)
        .then(function (add) {
          if (add) {
            saveItemData();
          }
        })
        .catch((err) => console.log(err));
    } else {
      saveItemData();
    }
  };
  /***********save data event end*/
  useEffect(() => {
    const getKey = (e) => {
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setDropDownOption(codeFocus);
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
  }, [createObj, selectedTblRow, codeFocus, updateAction]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="stockGeneral"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="stockGeneralIn mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col col3 autoComp">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Transaction No" />.
                  </label>
                  {val === "view" || val === "edit" ? (
                    <Autocomplete
                      open={dropDownOption === "Transactionno" ? true : false}
                      options={createObj.TrList}
                      onChange={(e, value) => getTrNo(value)}
                      getOptionLabel={(option) => option.AdjusmentNo.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("Transactionno")}
                          onBlur={() => {
                            setCodeFocus("");
                            setDropDownOption("");
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="documentNo"
                      readOnly={true}
                      value={createObj && createObj.transactionNo}
                    />
                  )}
                </div>
              </div>
              <div className="col col3">
                <div className="formBox">
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Transaction Date" />
                  </label>
                  <DatePicker
                    selected={createObj && createObj.sgDate}
                    dropdownMode="select"
                    minDate={createObj && createObj.sgDate}
                    maxDate={createObj && createObj.sgDate}
                    // onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="tableBox">
                <CustomTable
                  coulmn={coulmn}
                  data={createObj.items}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={createObj.itemList}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  itemAdd={
                    val === "add" || val === "edit" ? () => addItem() : false
                  }
                  refreshTable={refreshtbl}
                  editbtnText="Add Item detail"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col w100">
              <div className="RemarkForm mb-2">
                <label htmlFor="">
                  <Text content="Remark" />
                </label>
                <textarea
                  name="Remark"
                  placeholder="Write remarks here"
                  onChange={(e) => onchange(e)}
                  value={createObj.Remark}
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
    </>
  );
};
export default StockGeneral;
