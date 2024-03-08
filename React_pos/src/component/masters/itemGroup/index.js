import { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./unitMaster.scss";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { Post, Put } from "../../common/commonFunction";
import Text from "../../common/text";

const ItemGroupMaster = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    Id: 0,
    GroupCode: "",
    GroupName: "",
    ParentGroupCode: "",
    ParentGroupId: "",
    ParentGroupName: "",
  };
  const requiredObj = {
    GroupCode: "",
    GroupName: "",
    ParentGroupName: "",
  };
  const [val, setVal] = useState(undefined);
  const [errorObj, setErrorObj] = useState(requiredObj);
  const [createObj, setCreateObj] = useState(plainObj);
  const [itemGroupList, setItemGroupList] = useState([]);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [parentGroupDropDown, setParentGroupDropDown] = useState(false);
  const [editinput, setEditinput] = useState(false);
  const [editPgroup, setEditPgroup] = useState(false);
  const [parentGroupCodeFocus, setParentGroupCodeFocus] = useState(false);
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
        await pageLoad();
        setCreateObj(plainObj);
        setEditPgroup(true);
        return setVal(arg);
      } else {
        alert(
          "you are not online please try again after some time when you online"
        );
      }
    }

    if (arg === "edit") {
      await pageLoad();
      setEditinput(true);
      setCreateObj(plainObj);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      setEditinput(true);
      setCreateObj(plainObj);
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
      setDropDownOption(false);
      setEditPgroup(false);
      return setVal(arg);
    }
  };
  const pageLoad = async () => {
    const unitList = await db.itemGroup.toArray();
    setItemGroupList(unitList);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    let validateType = e.target.getAttribute("data-valid");
    if (validateType) {
      if (value === "") {
        if (name === "GroupName") {
          setEditinput(true);
          setCreateObj({ ...createObj, [name]: value });
        } else if (name === "ParentGroupName") {
          setEditPgroup(true);
          setCreateObj({ ...createObj, [name]: value });
        } else {
          setCreateObj({ ...createObj, [name]: value });
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
    } else {
      setCreateObj({ ...createObj, [name]: value });
    }
  };

  const submit = async () => {
    const savObj = {
      GroupCode: createObj.GroupCode,
      GroupName: createObj.GroupName,
      ParentGroupCode: createObj.ParentGroupCode,
      ParentGroupId: parseInt(createObj.ParentGroupId),
      ParentGroupName: createObj.ParentGroupName,
      CreatedBy: parseInt(localStorage.getItem("UserId")),
    };
    if (createObj && createObj.id) {
      let msgSuccess = await Put("/api/ItemGroup/", {
        ...savObj,
        Id: createObj.Id,
      });
      if (msgSuccess.statuscode === 202) {
        db.itemGroup
          .update(createObj.id, { ...savObj, Id: createObj.Id })
          .then((res) => {
            alert(msgSuccess.msg);
            change_state("refresh");
          });
      } else {
        alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
      }
    } else {
      let mid = await Post("/api/ItemGroup/", { ...savObj, Id: 0 });
      if (mid.mid > 0 && mid.mid !== null) {
        db.itemGroup.add({ ...savObj, Id: mid.mid }).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    }
  };
  const onParentGroupChange = (value) => {
    if (!value) return;
    setParentGroupDropDown(false);
    setErrorObj({
      ...errorObj,
      ParentGroupName: value.ParentGroupName,
    });
    setCreateObj((old) => {
      old.ParentGroupId = value.Id;
      old.ParentGroupCode = value.GroupCode;
      old.ParentGroupName = value.GroupName;
      return { ...old };
    });
  };
  const onchange = (value) => {
    if (!value) {
      return;
    } else {
      setDropDownOption(false);
      const data = {
        Id: value.Id,
        id: value.id,
        GroupCode: value.GroupCode,
        GroupName: value.GroupName,
        ParentGroupCode: value.ParentGroupCode,
        ParentGroupId: value.ParentGroupId,
        ParentGroupName: value.ParentGroupName,
      };
      setErrorObj({
        ...errorObj,
        GroupName: value.GroupName,
        GroupCode: value.GroupCode,
        ParentGroupName: value.ParentGroupName,
      });
      setCreateObj(data);
      setEditinput(false);
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
      if (parentGroupCodeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setParentGroupDropDown(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [itemGroupList, val, codeFocus, parentGroupCodeFocus]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="tabBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="unitMaster">
          <div className="marg">
            <label>
              <Text content="Group Name" />
              <span className="required">*</span>
            </label>
            {val === "view" || val === "edit" ? (
              editinput === true ? (
                <Autocomplete
                  options={itemGroupList}
                  open={dropDownOption}
                  onChange={(e, value) => onchange(value)}
                  getOptionLabel={(option) => option.GroupName}
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
                  name="GroupName"
                  onChange={handleChange}
                  type="text"
                  value={createObj && createObj.GroupName}
                  className={
                    errorObj && errorObj.GroupName === true ? "error" : ""
                  }
                  data-valid="varCharSpace"
                  readOnly={val === "view" || val === undefined ? true : false}
                />
              )
            ) : (
              <input
                name="GroupName"
                onChange={handleChange}
                type="text"
                value={createObj && createObj.GroupName}
                className={
                  errorObj && errorObj.GroupName === true ? "error" : ""
                }
                data-valid="varCharSpace"
                readOnly={val === "view" || val === undefined ? true : false}
              />
            )}
          </div>
          <div className="marg">
            <label>
            <Text content="Group Code" />
              <span className="required">*</span>
            </label>
            <input
              name="GroupCode"
              onChange={handleChange}
              type="text"
              data-valid="varChar"
              value={createObj && createObj.GroupCode}
              className={errorObj && errorObj.GroupCode === true ? "error" : ""}
              readOnly={val === "view" || val === undefined ? true : false}
            />
          </div>

          <div className="marg">
            <label><Text content="Parent Group" /></label>
            {val === "add" || val === "edit" ? (
              editPgroup === true ? (
                <Autocomplete
                  options={itemGroupList}
                  open={parentGroupDropDown}
                  onChange={(e, value) => onParentGroupChange(value)}
                  getOptionLabel={(option) =>
                    `${option.GroupCode} [${option.GroupName}]`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Press ctrl + L"
                      onFocus={() => setParentGroupCodeFocus(true)}
                      onBlur={() => {
                        setParentGroupCodeFocus(false);
                        setParentGroupDropDown(false);
                      }}
                    />
                  )}
                />
              ) : (
                <input
                  name="ParentGroupName"
                  onChange={handleChange}
                  type="text"
                  data-valid="varChar"
                  value={createObj && createObj.ParentGroupName}
                  className={
                    errorObj && errorObj.ParentGroupName === true ? "error" : ""
                  }
                  readOnly={val === "view" ? true : false}
                />
              )
            ) : (
              <input
                name="ParentGroupName"
                onChange={handleChange}
                type="text"
                data-valid="varChar"
                value={createObj && createObj.ParentGroupName}
                className={
                  errorObj && errorObj.ParentGroupName === true ? "error" : ""
                }
                readOnly={val === "view" ? true : false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemGroupMaster;
