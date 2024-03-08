import { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./unitMaster.scss";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { Post, Put } from "../../common/commonFunction";
import Text from "../../common/text";

const UnitMaster = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    Id: 0,
    DecimalDigit: "",
    UnitName: "",
    UnitSymbol: "",
  };
  const [val, setVal] = useState(undefined);
  const [errorObj, setErrorObj] = useState(plainObj);
  const [createObj, setCreateObj] = useState(plainObj);
  const [unitMasterList, setUnitMasterList] = useState(null);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [editinput, setEditinput] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });

  const change_state = async (arg) => {
    if (arg === "add") {
      if (onlinestatus) {
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
      setEditinput(true);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      setCreateObj(plainObj);
      setEditinput(true);
      return setVal(arg);
    }

    if (arg === "save") {
      const objKey = Object.keys(errorObj);
      const objVal = Object.values(errorObj);
      const resVal = objVal.filter((a) => a === "" || a === true);
      if (resVal.length > 0) {
        var result = {};
        objKey.forEach(
          (key, i) =>
            (result[key] =
              objVal[i] === "" || objVal[i] === true ? true : false)
        );
        setErrorObj(result);
        return false;
      } else {
        if (onlinestatus) {
          submit();
        } else {
          alert(
            "you are not online please try again after some time when you online"
          );
        }

        return;
      }
    }

    if (arg === "refresh") {
      setCreateObj(plainObj);
      setErrorObj(plainObj);
      return setVal(arg);
    }
  };
  const pageLoad = async () => {
    const unitList = await db.unitMaster.toArray();
    setUnitMasterList(unitList);
  };
  const changeData = (e) => {
    let { name, value } = e.target;
    let validateType = e.target.getAttribute("data-valid");
    if (validateType) {
      if (name === "UnitSymbol") {
        if (value === "") {
          setCreateObj({ ...createObj, [name]: value });
          setCreateObj(plainObj);
          setErrorObj(plainObj);
          setEditinput(true);
        } else {
          let checkValidate = validate(e.target.value, validateType);
          if (checkValidate) {
            setCreateObj({ ...createObj, [name]: value });
            setErrorObj({ ...errorObj, [name]: false });
          } else {
            setCreateObj({ ...createObj, [name]: value });
            setErrorObj({ ...errorObj, [name]: true });
          }
        }
      } else {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({ ...errorObj, [name]: false });
        } else {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({ ...errorObj, [name]: true });
        }
      }
    }
  };
  const submit = async () => {
    const savObj = {
      DecimalDigit: parseInt(createObj.DecimalDigit),
      UnitName: createObj.UnitName,
      UnitSymbol: createObj.UnitSymbol,
    };
    if (createObj.id) {
      let msgSuccess = await Put("/api/UnitMaster/", {
        ...savObj,
        Id: createObj.Id,
      });
      if (msgSuccess.statuscode === 202) {
        db.unitMaster
          .update(createObj.id, { ...savObj, Id: createObj.Id })
          .then((res) => {
            alert(msgSuccess.msg);
            change_state("refresh");
          });
      } else {
        alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
      }
    } else {
      let mid = await Post("/api/UnitMaster/", { ...savObj, Id: 0 });
      if (mid.mid > 0 && mid.mid !== null) {
        db.unitMaster.add({ ...savObj, Id: mid.mid }).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    }
  };
  const onchange = (value) => {
    if (value) {
      setDropDownOption(false);
      setEditinput(false);
      const data = {
        Id: value.Id,
        id: value.id,
        UnitName: value.UnitName,
        UnitSymbol: value.UnitSymbol,
        DecimalDigit: value.DecimalDigit,
      };
      setErrorObj(data);
      setCreateObj(data);
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
  }, [unitMasterList, val, codeFocus]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="tabBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="unitMaster">
          <div
            className={
              errorObj && errorObj.UnitSymbol === true ? "error marg" : "marg"
            }
          >
            <label>
            <Text content="Short Name" />
              <span className="required">*</span>
            </label>
            {val === "view" || val === "edit" ? (
              editinput === true ? (
                <Autocomplete
                  options={unitMasterList}
                  open={dropDownOption}
                  onChange={(e, value) => onchange(value)}
                  getOptionLabel={(option) => option.UnitSymbol}
                  renderInput={(params) => (
                    <TextField
                      {...params}
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
                  name="UnitSymbol"
                  onChange={changeData}
                  type="text"
                  data-valid="varChar"
                  value={createObj && createObj.UnitSymbol}
                  className={
                    errorObj && errorObj.UnitSymbol === true ? "error" : ""
                  }
                  readOnly={val === "view" || val === undefined ? true : false}
                />
              )
            ) : (
              <input
                name="UnitSymbol"
                onChange={changeData}
                type="text"
                data-valid="varChar"
                value={createObj && createObj.UnitSymbol}
                className={
                  errorObj && errorObj.UnitSymbol === true ? "error" : ""
                }
                readOnly={val === "view" || val === undefined ? true : false}
              />
            )}
          </div>
          <div className="marg">
            <label>
            <Text content="Formal Name" />
              <span className="required">*</span>
            </label>
            <input
              name="UnitName"
              onChange={changeData}
              type="text"
              data-valid="varCharSpace"
              value={createObj && createObj.UnitName}
              className={errorObj && errorObj.UnitName === true ? "error" : ""}
              readOnly={val === "view" || val === undefined ? true : false}
            />
          </div>

          <div className="marg">
            <label>
            <Text content="No. of Decimal Place" />
              <span className="required">*</span>
            </label>
            <input
              name="DecimalDigit"
              onChange={changeData}
              type="text"
              data-valid="varChar"
              value={createObj && createObj.DecimalDigit}
              className={
                errorObj && errorObj.DecimalDigit === true ? "error" : ""
              }
              readOnly={val === "view" || val === undefined ? true : false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitMaster;
