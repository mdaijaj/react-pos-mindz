import "./advanceAdjustment.scss";
import React, { useState, useEffect } from "react";
import CommonFormAction from "../../common/commonFormAction";
import calenderIcon from "../../../images/icon/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import db from "../../../datasync/dbs";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
} from "../../common/commonFunction";

const AdvanceAdjustment = ({ pageNav }) => {
  const obj = {
    customerList: [],
    adjustNOList: [],
    mainObj: {
      advanceadjustmentno: "",
      advanceadjustmentdate: "",
      partyid: "",
      customerName: "",
      advanceadjustmentamount: "",
      advanceadjustmentrefundamount: "",
      remarks: "",
      createdby: localStorage.getItem("UserId"),
      amountadjusted: "",
      new: 1,
      update: 0,
    },
  };
  const reqObj = {
    advanceadjustmentno: "",
    advanceadjustmentdate: "",
    customerName: "",
    advanceadjustmentamount: "",
    advanceadjustmentrefundamount: "",
  };
  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState({
    ...obj,
    mainObj: { ...obj.mainObj, advanceadjustmentdate: new Date() },
  });
  const [requireObj, setRequireObj] = useState(reqObj);
  const [saveEdit, setSaveEdit] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.advanceAdjustment.toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        addEvent(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.advanceAdjustment.toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
    } else {
      let count = await db.advanceAdjustment.toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
    }
    setVoucherStatus(false);
  };
  const addEvent = async (docNo) => {
    // const adjNo = Math.floor(100000000 + Math.random() * 900000000);
    const res = await db.customerMaster
      .where("LedgerType")
      .equals(1)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    setCreateObj({
      ...createObj,
      customerList: res.sort((a, b) => a.PartyName.localeCompare(b.PartyName)),
      mainObj: { ...createObj.mainObj, advanceadjustmentno: docNo },
    });
  };
  const getCustomer = (value) => {
    if (value) {
      setCreateObj({
        ...createObj,
        mainObj: {
          ...createObj.mainObj,
          partyid: value.Id,
          customerName: value.PartyName,
        },
      });
      setRequireObj({ ...requireObj, customerName: false });
      setCodeFocus(false);
      setDropDownOption(false);
    }
  };
  const onchange = (e) => {
    let validateType = e.target.getAttribute("data-valid");
    if (validateType) {
      let checkValidate = validate(e.target.value, validateType);
      if (checkValidate) {
        setCreateObj({
          ...createObj,
          mainObj: { ...createObj.mainObj, [e.target.name]: e.target.value },
        });
        setRequireObj({ ...requireObj, [e.target.name]: false });
      } else {
        if (!e.target.value) {
          setCreateObj({
            ...createObj,
            mainObj: { ...createObj.mainObj, [e.target.name]: "" },
          });
        }
        setRequireObj({ ...requireObj, [e.target.name]: true });
      }
    } else {
      setCreateObj({
        ...createObj,
        mainObj: { ...createObj.mainObj, [e.target.name]: e.target.value },
      });
    }
  };
  const refreash = () => {
    setCreateObj({
      ...obj,
      mainObj: { ...obj.mainObj, advanceadjustmentdate: new Date() },
    });
    setRequireObj(reqObj);
    setSaveEdit(false);
  };
  const getAdjustNoList = async () => {
    let userId = localStorage.getItem("UserId");
    const res1 = await db.advanceAdjustment
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const res = res1.filter((d) => d.createdby === userId);
    setCreateObj({ ...createObj, adjustNOList: res });
  };
  const getAdjustNo = async (value) => {
    if (value) {
      const cusName = await db.customerMaster
        .where("Id")
        .equals(value.partyid)
        .first()
        .then()
        .catch((err) => console.log(err));
      setCreateObj({
        ...createObj,
        mainObj: { ...value, customerName: cusName.PartyName },
      });
    }
    setCodeFocus(false);
    setDropDownOption(false);
  };
  const change_state = (arg) => {
    switch (arg) {
      case "add": {
        getoucherList();
        setSaveEdit(false);
        setVal(arg);
        return;
      }
      case "edit": {
        getAdjustNoList();
        setSaveEdit(true);
        setVal(arg);
        return;
      }
      case "view": {
        setVal(arg);
        getAdjustNoList();
        setSaveEdit(false);
        return;
      }
      case "refresh": {
        refreash();
        setVal(arg);
        return;
      }
      case "save": {
        const objKey = Object.keys(requireObj);
        var result = {};
        objKey.forEach(
          (key) => (result[key] = createObj.mainObj[key] === "" ? true : false)
        );
        setRequireObj(result);
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
  const removeProperty = (objet, propertyName) => {
    let { [propertyName]: _, ...result } = objet;
    return result;
  };
  const saveData = () => {
    let newObj = removeProperty(createObj.mainObj, "customerName");
    console.log(newObj, "newObjnewObj");
    if (!saveEdit) {
      db.advanceAdjustment
        .add({ ...newObj, createdon: new Date() })
        .then((update) => {
          if (update) {
            alert("data add successfully");
            refreash();
            setVal("save");
          }
        })
        .catch((err) => console.log(err));
    } else {
      db.advanceAdjustment
        .put({ ...newObj, update: 1 })
        .then((update) => {
          if (update) {
            alert("data update successfully");
            refreash();
            setVal("save");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    console.log(createObj, "dfgfgf");
    const getKey = (e) => {
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setDropDownOption(codeFocus);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [createObj, codeFocus, requireObj]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="advanceAdjustment"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="advanceAdjustmentIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div
                  className={
                    requireObj.advanceadjustmentno === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Adv Adjustment No" />
                  </label>
                  {val === "edit" || val === "view" ? (
                    <Autocomplete
                      open={dropDownOption === "adjustmentNo" ? true : false}
                      options={createObj.adjustNOList}
                      onChange={(e, value) => getAdjustNo(value)}
                      getOptionLabel={(option) =>
                        option.advanceadjustmentno.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("adjustmentNo")}
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
                      value={createObj.mainObj.advanceadjustmentno}
                      readOnly={true}
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div
                  className={
                    requireObj.advanceadjustmentdate === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Adv Adjustment Date" />
                  </label>
                  <DatePicker
                    selected={createObj.mainObj.advanceadjustmentdate}
                    minDate={createObj.mainObj.advanceadjustmentdate}
                    maxDate={createObj.mainObj.advanceadjustmentdate}
                    // onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    requireObj.customerName === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Customer Name" />
                  </label>
                  {val === "add" ? (
                    <Autocomplete
                      open={dropDownOption === "customer" ? true : false}
                      options={createObj.customerList}
                      onChange={(e, value) => getCustomer(value)}
                      getOptionLabel={(option) => option.PartyName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("customer")}
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
                      value={createObj.mainObj.customerName}
                      readOnly={true}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div
                  className={
                    requireObj.advanceadjustmentamount === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Adv Amount" />
                  </label>
                  <input
                    type="text"
                    name="advanceadjustmentamount"
                    value={createObj.mainObj.advanceadjustmentamount}
                    data-valid="number"
                    onChange={
                      val === "view"
                        ? () => {
                            return false;
                          }
                        : (e) => onchange(e)
                    }
                  />
                </div>
              </div>
              <div className="col">
                <div
                  className={
                    requireObj.advanceadjustmentrefundamount === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Refund Amount" />
                  </label>
                  <input
                    type="text"
                    name="advanceadjustmentrefundamount"
                    value={createObj.mainObj.advanceadjustmentrefundamount}
                    onChange={
                      val === "view"
                        ? () => {
                            return false;
                          }
                        : (e) => onchange(e)
                    }
                    data-valid="number"
                  />
                </div>
              </div>

              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Adjustment Amount" />
                  </label>
                  <input
                    name="amountadjusted"
                    type="text"
                    value={createObj.mainObj.amountadjusted}
                    onChange={
                      val === "view"
                        ? () => {
                            return false;
                          }
                        : (e) => onchange(e)
                    }
                    readOnly={false}
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
                    name="remarks"
                    placeholder="Write remarks here"
                    onChange={
                      val === "view"
                        ? () => {
                            return false;
                          }
                        : (e) => onchange(e)
                    }
                    value={createObj.mainObj.remarks}
                  ></textarea>
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
      </div>
    </>
  );
};
export default AdvanceAdjustment;
