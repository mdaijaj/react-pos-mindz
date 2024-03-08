import React, { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./voucherTypes.scss";
import { data } from "./voucherData";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import { formatDate, Post, Put } from "../../common/commonFunction";
import { FlareSharp } from "@material-ui/icons";
import Text from "../../common/text"

const VoucherTypes = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    voucherName: "",
    AppliedOn: "",
    tallyVoucherName: "",
    shortName: "",
    SetAsDefault: false,
    IsActive: false,
  };

  const requiredObj = {
    voucherName: "",
    AppliedOn: "",
  };

  const [createObj, setCreateObj] = useState(plainObj);
  let [val, setVal] = useState("");
  const [errorObj, setErrorObj] = useState(requiredObj);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [editname, setEditname] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [voucherformList, setVoucherformList] = useState([]);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const pageLoad = async () => {
    const voucherListget = await db.VoucherList.toArray();
    const voucherformListget = await db.VoucherFormMaster.toArray();
    setVoucherList(voucherListget);
    setVoucherformList(voucherformListget);
  };

  const change_state = async (arg) => {
    if (arg === "add") {
      if (onlinestatus) {
        pageLoad();
        return setVal(arg);
      } else {
        alert(
          "you are not online please try again after some time when you online"
        );
      }
    }

    if (arg === "edit") {
      pageLoad();
      setEditname(true);
      return setVal(arg);
    }

    if (arg === "view") {
      pageLoad();
      setEditname(true);
      return setVal(arg);
    }

    if (arg === "save") {
      const objKey = Object.keys(errorObj);
      var result = {};
      objKey.forEach(
        (key) =>
          (result[key] =
            createObj[key] === "" ||
            createObj[key] === null ||
            errorObj[key] === true
              ? true
              : false)
      );
      setErrorObj(result);
      const error = Object.values(result).filter((a) => a === true);
      if (error.length > 0) {
        alert("please fill all the field");
      } else {
        if (onlinestatus) {
          submit();
        } else {
          alert(
            "you are not online please try again after some time when you online"
          );
        }
      }
    }
    if (arg === "refresh") {
      setCreateObj(plainObj);
      setErrorObj(requiredObj);
      return setVal(arg);
    }
  };

  const submit = async () => {
    const obj = {
      VoucherName: createObj.voucherName,
      ApplyOnFormId: parseInt(createObj.AppliedOn),
      IsDefault: createObj.SetAsDefault,
      ShortName: createObj.shortName,
      IsActive: createObj.IsActive,
      CreatedBy: parseInt(localStorage.getItem("UserId")),
      CreatedByName: localStorage.getItem("fname"),
      EditLog: null,
      CreatedOn: formatDate(new Date()),
      alteredon: "",
    };
    if (createObj && createObj.id) {
      let msgSuccess = await Put("/api/voucher/", { ...obj, Id: createObj.Id });
      if (msgSuccess.statuscode === 202) {
        db.VoucherList.update(createObj.id, obj).then((res) => {
          alert(msgSuccess.msg);
          change_state("refresh");
        });
      } else {
        alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
      }
    } else {
      let mid = await Post("/api/voucher/", { ...obj, Id: 0 });
      if (mid.mid > 0 && mid.mid !== null) {
        db.VoucherList.add({ ...obj, Id: mid.mid }).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "voucherName") {
      if (value === "") {
        setEditname(true);
        setCreateObj({
          ...createObj,
          [name]: value,
        });
      } else {
        setCreateObj({
          ...createObj,
          [name]: value,
        });
        setErrorObj({
          ...errorObj,
          [name]: value,
        });
      }
    } else {
      setCreateObj({
        ...createObj,
        [name]: value,
      });
      setErrorObj({
        ...errorObj,
        [name]: value,
      });
    }
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
    };
  }, [createObj, codeFocus, val]);

  const handleChecked = (e) => {
    let { name, checked } = e.target;
    setCreateObj({
      ...createObj,
      [name]: checked,
    });
  };

  const handleVoucherChange = (value) => {
    try {
      if (value) {
        setDropDownOption(false);
        setEditname(false);
        setCreateObj(plainObj);
        setErrorObj(requiredObj);
        const data = {
          id: value.id,
          Id: value.Id,
          voucherName: value.VoucherName,
          AppliedOn: value.ApplyOnFormId,
          shortName: value.ShortName,
          SetAsDefault: value.IsDefault,
          IsActive: value.IsActive,
        };
        setCreateObj(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onchangeselect = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
  };

  const para = { val, change_state, disabledAction };

  return (
    <div
      className="voucherType"
      style={{ display: pageNav.hide === true ? "none" : "block" }}
    >
      <CommonFormAction {...para} />
      <div className="voucherTypeSection">
        <div className="box">
          <div className="formBox">
            <div className="row ">
              <div className="col w35 ">
                <label><Text content="Voucher Name"/></label>
                {val === "view" || val === "edit" ? (
                  editname === true ? (
                    <Autocomplete
                      open={dropDownOption}
                      options={voucherList}
                      onChange={(e, value) => {
                        handleVoucherChange(value);
                      }}
                      getOptionLabel={(option) => option.VoucherName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          value=""
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus(true)}
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
                      name="voucherName"
                      onChange={(e) => handleChange(e)}
                      className={
                        errorObj && errorObj.voucherName === true ? "error" : ""
                      }
                      readOnly={
                        val === "view" || val === "refresh" ? true : false
                      }
                      value={createObj.voucherName}
                    />
                  )
                ) : (
                  <input
                    type="text"
                    name="voucherName"
                    onChange={(e) => handleChange(e)}
                    className={
                      errorObj && errorObj.voucherName === true ? "error" : ""
                    }
                    readOnly={
                      val === "view" || val === "refresh" ? true : false
                    }
                    value={createObj.voucherName}
                  />
                )}
              </div>
              <div className="col w35">
                <label><Text content="Applied On" /></label>
                <select
                  name="AppliedOn"
                  value={createObj.AppliedOn}
                  onChange={(e) => onchangeselect(e)}
                >
                  <option value="">Select</option>
                  {voucherformList &&
                    voucherformList.map((a, index) => (
                      <option key={index} value={a.formid}>
                        {a.caption}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col w35">
                <label><Text content="Tally Vch. Name" /></label>
                <input
                  type="text"
                  name="tallyVoucherName"
                  className={
                    errorObj && errorObj.tallyVoucherName === true
                      ? "error"
                      : ""
                  }
                  readOnly={true}
                />
              </div>
            </div>
          </div>
          <div className="formBox">
            <div className="row">
              <div className="col w35">
                <label><Text content="Short Name" /></label>
                <input
                  type="text"
                  className={
                    errorObj && errorObj.shortName === true ? "error" : ""
                  }
                  name="shortName"
                  readOnly={val === "view" || val === "refresh" ? true : false}
                  onChange={(e) => handleChange(e)}
                  value={createObj.shortName}
                />
              </div>
              <div className="col w35">
                <div className="checkboxNew">
                  <input
                    type="checkbox"
                    disabled={
                      val === "view" || val === "refresh" ? true : false
                    }
                    id="checkboxOne"
                    checked={createObj.IsActive}
                    onChange={(e) => handleChecked(e)}
                    name="IsActive"
                  />

                  <label htmlFor="checkboxOne"><Text content="IsActive" /></label>
                </div>
              </div>
              <div className="col w35">
                <div className="checkboxNew">
                  <input
                    disabled={
                      val === "view" || val === "refresh" ? true : false
                    }
                    type="checkbox"
                    id="checkboxTwo"
                    checked={createObj.SetAsDefault}
                    onChange={(e) => handleChecked(e)}
                    name="SetAsDefault"
                  />

                  <label htmlFor="checkboxTwo"><Text content="set as default" /></label>
                </div>
              </div>
            </div>
          </div>
          <div className="formBox">
            <div className="row">
              {/* <div className="col w35">
                <div className="checkboxNew">
                  <input
                    type="checkbox"
                    readOnly={true}
                    id="checkboxThird"
                    name="isImeiApplicable"
                  />

                  <label htmlFor="checkboxThird">Is IMEI Applicable </label>
                </div>
              </div> */}
              {/* <div className="col w35">
                <div className="checkboxNew">
                  <input
                    type="checkbox"
                    readOnly={true}
                    id="checkboxFour"
                    name="enableDataBackEntry"

                  />

                  <label htmlFor="checkboxFour">Enable Back Date Entry</label>
                </div>
              </div> */}
              {/* <div className="col w35">
                <div className="checkboxNew">
                  <input
                    readOnly={true}
                    type="checkbox"
                    id="checkboxFive"

                    name="itemLevelRoundingOff"

                  />

                  <label htmlFor="checkboxFive">Item Level Rounding Off</label>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherTypes;
