import "./reasonMaster.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { Post, Put } from "../../common/commonFunction";
import Text from "../../common/text";

const ReasonMaster = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    ReasonName: "",
    reasonTypeId: "",
  };
  const [val, setVal] = useState();
  const [errorObj, setErrorObj] = useState(plainObj);
  const [createObj, setCreateObj] = useState(plainObj);
  const [reasonTypeList, setReasonTypeList] = useState(null);
  const [reasonList, setReasonList] = useState(null);
  const [reasonDropDown, setReasonDropDown] = useState(false);
  const [reasonFocus, setReasonFocus] = useState(false);
  const [reasondrop, setReasondrop] = useState(false);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [edit, setEdit] = useState(false);
  const pageLoad = async () => {
    const reason = await db.reasonMaster.toArray();
    const reasonType = await db.reasonTypeMaster.toArray();
    setReasonList(reason);
    setReasonTypeList(reasonType);
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
      setReasondrop(true);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      setCreateObj(plainObj);
      setReasondrop(true);
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
      setEdit(false);
      setErrorObj(plainObj);
      setReasondrop(false);
      return setVal(arg);
    }
  };

  const getreason = async (value) => {
    setReasonFocus(false);
    setReasonDropDown(false);
    setReasondrop(false);
    //const reasonType = await db.reasonTypeMaster.get({ Id: value.reasonType });
    // console.log(reasonType);
    const data = {
      id: value.id,
      Id: value.Id,
      ReasonName: value.ReasonName,
      reasonTypeId: value.ReasonTypeId,
    };
    setCreateObj(data);
  };

  const getreasonType = (e) => {
    setCreateObj({ ...createObj, reasonTypeId: e.target.value });
  };
  const submit = async () => {
    const reasonTypename = await db.reasonTypeMaster
      .where("Id")
      .equals(parseInt(createObj.reasonTypeId))
      .first();
    if (reasonTypename) {
      const obj = {
        ReasonTypeId: parseInt(createObj.reasonTypeId),
        ReasonName: createObj.ReasonName,
        ReasonTypeName: reasonTypename.ReasonTypeName,
      };
      if (createObj.id) {
        let msgSuccess = await Put("/api/reasonmaster/", {
          ...obj,
          Id: createObj.Id,
        });
        if (msgSuccess.statuscode === 202) {
          db.reasonMaster.update(createObj.id, obj).then((res) => {
            alert(msgSuccess.msg);
            change_state("refresh");
          });
        } else {
          alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
        }
      } else {
        let mid = await Post("/api/reasonmaster/", { ...obj, Id: 0 });
        if (mid.mid > 0 && mid.mid !== null) {
          db.reasonMaster.add({ ...obj, Id: mid.mid }).then((res) => {
            alert(mid.msg);
            change_state("refresh");
          });
        } else {
          alert(mid.msg, "statuscode:", mid.statuscode);
        }
      }
    }
  };

  useEffect(() => {
    const getKey = (e) => {
      if (reasonFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setReasonDropDown(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [reasonList, reasonTypeList, val, reasonFocus]);

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
                <label htmlFor=""><Text content="Reason Name"/></label>
                {reasondrop === true ? (
                  <Autocomplete
                    open={reasonDropDown}
                    options={reasonList}
                    onChange={(e, value) => getreason(value)}
                    getOptionLabel={(option) => option.ReasonName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Press ctrl + L"
                        onFocus={() => setReasonFocus(true)}
                        onBlur={() => {
                          setReasonFocus(false);
                          setReasonDropDown(false);
                        }}
                      />
                    )}
                  />
                ) : (
                  <input
                    type="text"
                    name="ReasonName"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setReasondrop(true);
                        setCreateObj({
                          ...createObj,
                          ReasonName: e.target.value,
                        });
                      } else {
                        setCreateObj({
                          ...createObj,
                          ReasonName: e.target.value,
                        });
                      }
                    }}
                    className={
                      errorObj && errorObj.ReasonName === true ? "error" : ""
                    }
                    readOnly={val === "view" ? true : false}
                    value={createObj && createObj.ReasonName}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col w35">
              <div className="formBox">
                <label htmlFor="">Reason Type</label>
                <select
                  name="reasonTypeId"
                  onChange={(e) => getreasonType(e)}
                  className={
                    errorObj && errorObj.reasonTypeId === true ? "error" : ""
                  }
                  value={createObj && createObj.reasonTypeId}
                >
                  <option value="">None</option>
                  {reasonTypeList &&
                    reasonTypeList.map((item) => (
                      <option value={item.id}>{item.ReasonTypeName}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReasonMaster;
