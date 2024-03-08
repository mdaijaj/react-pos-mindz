import "./reasonMaster.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { Post, Put } from "../../common/commonFunction";
import Text from "../../common/text";

const CounterMaster = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    CounterName: "",
    CounterCode: "",
    Remarks: "",
    MachineId: 0,
  };
  const reqObj = {
    CounterName: "",
    CounterCode: "",
  };
  const [val, setVal] = useState();
  const [errorObj, setErrorObj] = useState(reqObj);
  const [createObj, setCreateObj] = useState(plainObj);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [counterList, setCounterList] = useState(null);
  const [counterNameDropDown, setCounterNameDropDown] = useState(false);
  const [counterCodeDropDown, setCounterCodeDropDown] = useState(false);
  const [counterNameFocus, setCounterNameFocus] = useState(false);
  const [counterCodeFocus, setCounterCodeFocus] = useState(false);
  const [counterName, setCounterName] = useState(false);
  const [counterCode, setCounterCode] = useState(false);
  const pageLoad = async () => {
    const counterlist = await db.counterMaster.toArray();
    setCounterList(counterlist);
  };
  const change_state = async (arg) => {
    if (arg === "add") {
      if (onlinestatus) {
        await pageLoad();
        setCreateObj(plainObj);
        return setVal(arg);
      } else {
        alert(
          "you are not online please try again after some time when you online"
        );
      }
    }

    if (arg === "edit") {
      await pageLoad();
      setCreateObj(plainObj);
      setCounterCode(true);
      setCounterName(true);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      setCreateObj(plainObj);
      setCounterCode(true);
      setCounterName(true);
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
      setCounterCode(false);
      setErrorObj(plainObj);
      setCounterName(false);
      return setVal(arg);
    }
  };
  const getDesinationName = async (value) => {
    if (value) {
      setCounterNameDropDown(false);
      setCounterName(false);
      setCounterCode(false);
      setCreateObj(value);
    }
  };

  const getDesinationCode = (value) => {
    if (value) {
      setCounterCodeDropDown(false);
      setCounterName(false);
      setCounterCode(false);
      setCreateObj(value);
    }
  };
  const submit = async () => {
    const obj = {
      CounterName: createObj.CounterName,
      CounterCode: createObj.CounterCode,
      Remarks: createObj.Remarks,
    };
    if (createObj && createObj.id) {
      let msgSuccess = await Put("/api/CounterMaster/", {
        ...obj,
        Id: createObj.Id,
      });
      if (msgSuccess.statuscode === 202) {
        db.counterMaster.update(createObj.id, obj).then((res) => {
          alert(msgSuccess.msg);
          change_state("refresh");
        });
      } else {
        alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
      }
    } else {
      let mid = await Post("/api/CounterMaster/", { ...obj, Id: 0 });
      if (mid.mid > 0 && mid.mid !== null) {
        db.counterMaster.add({ ...obj, Id: mid.mid }).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (value === "") {
      if (name === "CounterName") {
        setCounterName(true);
        setCreateObj({ ...createObj, [name]: value });
      } else if (name === "CounterCode") {
        setCounterCode(true);
        setCreateObj({ ...createObj, [name]: value });
      }
    } else {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({ ...errorObj, [name]: false, Remarks: false });
        } else {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({ ...errorObj, [name]: true });
        }
      } else {
        setCreateObj({ ...createObj, [name]: value });
        setErrorObj({ ...errorObj, [name]: false });
      }
    }
  };

  useEffect(() => {
    const getKey = (e) => {
      if (counterNameFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setCounterNameDropDown(true);
        }
      }
      if (counterCodeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setCounterCodeDropDown(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [counterList, val, counterNameFocus, counterCodeFocus]);

  const para = { val, change_state, disabledAction };

  return (
    <>
      <div
        className="customerMasterBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="reasonMasterSection">
          <div className="row">
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Counter Name" /></label>
                {counterName === true ? (
                  <Autocomplete
                    open={counterNameDropDown}
                    options={counterList}
                    onChange={(e, value) => getDesinationName(value)}
                    getOptionLabel={(option) => option.CounterName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Press ctrl + L"
                        onFocus={() => setCounterNameFocus(true)}
                        onBlur={() => {
                          setCounterNameFocus(false);
                          setCounterNameDropDown(false);
                        }}
                      />
                    )}
                  />
                ) : (
                  <input
                    type="text"
                    name="CounterName"
                    data-valid="varCharSpace"
                    onChange={handleChange}
                    className={
                      errorObj && errorObj.CounterName === true ? "error" : ""
                    }
                    readOnly={val === "view" ? true : false}
                    value={createObj && createObj.CounterName}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Counter Code" /></label>
                {counterCode === true ? (
                  <Autocomplete
                    open={counterCodeDropDown}
                    options={counterList}
                    onChange={(e, value) => getDesinationCode(value)}
                    getOptionLabel={(option) => option.CounterCode}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Counter Code"
                        onFocus={() => setCounterCodeFocus(true)}
                        onBlur={() => {
                          setCounterCodeFocus(false);
                          setCounterCodeDropDown(false);
                        }}
                      />
                    )}
                  />
                ) : (
                  <input
                    type="text"
                    name="CounterCode"
                    data-valid="varCharSpace"
                    readOnly={val === "view" ? true : false}
                    onChange={handleChange}
                    className={
                      errorObj && errorObj.CounterCode === true ? "error" : ""
                    }
                    value={createObj && createObj.CounterCode}
                  />
                )}
              </div>
            </div>
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Remarks" /></label>
                <input
                  type="text"
                  name="Remarks"
                  readOnly={val === "view" ? true : false}
                  onChange={handleChange}
                  // className={
                  //   errorObj && errorObj.Remarks === true ? "error" : ""
                  // }
                  value={createObj && createObj.Remarks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CounterMaster;
