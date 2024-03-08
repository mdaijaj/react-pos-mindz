import "./index.scss";
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

const CreditNoteRefund = ({ pageNav }) => {
  const obj = {
    customerList: [],
    creditNOList: [],
    mainObj: {
      creditnoteno: "",
      creditnotedate: "",
      partyid: "",
      customerName: "",
      creditnoteamount: "",
      creditnoterefundamount: "",
      remarks: "",
      createdby: localStorage.getItem("UserId"),
      amountadjusted: "",
      new: 1,
      update: 0,
    },
  };
  const reqObj = {
    creditnoteno: "",
    creditnotedate: "",
    customerName: "",
    creditnoteamount: "",
    creditnoterefundamount: "",
  };
  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState({
    ...obj,
    mainObj: { ...obj.mainObj, creditnotedate: new Date() },
  });
  const [requireObj, setRequireObj] = useState(reqObj);
  const [saveEdit, setSaveEdit] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
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
        let count = await db.creditNoteRefund.toArray();
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
      let count = await db.creditNoteRefund.toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
    } else {
      let count = await db.creditNoteRefund.toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
    }
    setVoucherStatus(false);
  };
  const addEvent = async (adjNo) => {
    // const adjNo = Math.floor(100000000 + Math.random() * 900000000);
    const res = await db.customerMaster
      .where("LedgerType")
      .equals(1)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const cuslist =
      res && res.sort((a, b) => a.PartyName.localeCompare(b.PartyName));
    setCreateObj({
      ...createObj,
      customerList: cuslist,
      mainObj: { ...createObj.mainObj, creditnoteno: adjNo },
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
        console.log("dd", checkValidate);
        // setCreateObj({
        //   ...createObj,
        //   mainObj: { ...createObj.mainObj, [e.target.name]: "" },
        // });
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
      mainObj: { ...obj.mainObj, creditnotedate: new Date() },
    });
    setRequireObj(reqObj);
    setSaveEdit(false);
  };
  const getcreditNOList = async () => {
    const res = await db.creditNoteRefund
      .toArray()
      .then()
      .catch((err) => console.log(err));
    setCreateObj({ ...createObj, creditNOList: res });
  };
  const getCreditNo = async (value) => {
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
        getcreditNOList();
        setSaveEdit(true);
        setVal(arg);
        return;
      }
      case "view": {
        setVal(arg);
        getcreditNOList();
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
    if (!saveEdit) {
      db.creditNoteRefund
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
      db.creditNoteRefund
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
    console.log(requireObj, "dfgfgf");
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
        className="CreditNoteRefund"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="CreditNoteRefundIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div
                  className={
                    requireObj.creditnoteno === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Credit Note No" />
                  </label>
                  {val === "edit" || val === "view" ? (
                    <Autocomplete
                      open={dropDownOption === "creditNoteNo" ? true : false}
                      options={createObj.creditNOList}
                      onChange={(e, value) => getCreditNo(value)}
                      getOptionLabel={(option) =>
                        option.creditnoteno.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("creditNoteNo")}
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
                      value={createObj.mainObj.creditnoteno}
                      readOnly={true}
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div
                  className={
                    requireObj.creditnotedate === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Credit Note Date" />
                  </label>
                  <DatePicker
                    selected={createObj.mainObj.creditnotedate}
                    minDate={createObj.mainObj.creditnotedate}
                    maxDate={createObj.mainObj.creditnotedate}
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
                    requireObj.creditnoteamount === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Credit Note Amount" />
                  </label>
                  <input
                    type="text"
                    name="creditnoteamount"
                    value={createObj.mainObj.creditnoteamount}
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
                    requireObj.creditnoterefundamount === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Refund Amount" />
                  </label>
                  <input
                    type="text"
                    name="creditnoterefundamount"
                    value={createObj.mainObj.creditnoterefundamount}
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
                    type="text"
                    value={createObj.mainObj.amountadjusted}
                    readOnly={true}
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
export default CreditNoteRefund;
