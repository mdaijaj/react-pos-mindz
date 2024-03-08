import "./employeeMaster.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { Post, Put } from "../../common/commonFunction";
import Text from "../../common/text";

const EmployeeMaster = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    Id: 0,
    EmployeeName: "",
    EmployeeCode: "",
    ReportingToWhom: "",
    Designation: "",
    EmailId: "",
    ContactNo: "",
  };
  const require = {
    EmployeeName: "",
    EmployeeCode: "",
    // ReportingToWhom: "",
    // Designation: "",
    EmailId: "",
    // ContactNo: "",
  };
  const [createObj, setCreateObj] = useState(plainObj);
  const [errorObj, setErrorObj] = useState(require);
  const [employeeList, setEmployeeList] = useState(null);
  const [employeeDropDown, setEmployeeDropDown] = useState(false);
  const [employeeFocus, setEmployeeFocus] = useState(false);
  const [reportFocus, setReportFocus] = useState(false);
  const [designationlist, setDesignationlist] = useState(null);
  const [desigFocus, setDesigFocus] = useState(false);
  const [editinput, setEditinput] = useState(false);
  const [val, setVal] = useState();
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });

  const pageLoad = async () => {
    const employees = await db.employeeMaster.toArray();
    const desination = await db.designationMaster.toArray();
    if (employees) {
      setEmployeeList(employees);
    }
    if (desination) {
      setDesignationlist(desination);
    }
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
      setEditinput(true);
      return setVal(arg);
    }

    if (arg === "view") {
      pageLoad();
      setEditinput(true);
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
        return;
      }
    }

    if (arg === "refresh") {
      setCreateObj(plainObj);
      setErrorObj(require);
      return setVal(arg);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    let validateType = e.target.getAttribute("data-valid");
    if (value === "") {
      if (name === "EmployeeName") {
        setEditinput(true);
        setCreateObj({ ...createObj, [name]: value });
      } else {
        setCreateObj({ ...createObj, [name]: value });
        setErrorObj({ ...errorObj, [name]: false });
      }
    } else {
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({ ...errorObj, [name]: false });
        } else {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({ ...errorObj, [e.target.name]: true });
        }
      } else {
        setCreateObj({ ...createObj, [name]: value });
      }
    }
  };
  const getEmployeeDetails = async (value) => {
    if (!value) return;
    setEmployeeFocus(false);
    setEmployeeDropDown(false);
    setEditinput(false);
    setCreateObj({
      ...createObj,
      id: value.id,
      Id: value.Id,
      EmployeeName: value.EmployeeName,
      EmployeeCode: value.EmployeeCode,
      ReportingToWhom: value.ReportingTo,
      Designation: value.Designationid,
      EmailId: value.Email,
      ContactNo: value.PresentContactNo,
    });
  };

  const handleselectChange = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const getKey = (e) => {
      if (employeeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setEmployeeDropDown(true);
          setEmployeeFocus(false);
        }
      }
      if (reportFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setReportFocus(false);
        }
      }
      if (desigFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDesigFocus(false);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [employeeList, val, employeeFocus, reportFocus, desigFocus, createObj]);

  const submit = async () => {
    const obj = {
      EmployeeName: createObj.EmployeeName,
      EmployeeCode: createObj.EmployeeCode,
      PresentContactNo: createObj.ContactNo,
      Designationid: createObj.Designation,
      ReportingTo: createObj.ReportingToWhom,
      Email: createObj.EmailId,
    };
    if (createObj && createObj.id) {
      let msgSuccess = await Put("/api/EmployeeMaster/", {
        ...obj,
        Id: createObj.Id,
      });
      if (msgSuccess.statuscode === 202) {
        db.employeeMaster
          .update(createObj.id, { ...obj, Id: createObj.Id })
          .then((res) => {
            alert(msgSuccess.msg);
            change_state("refresh");
          });
      } else {
        alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
      }
    } else {
      let mid = await Post("/api/EmployeeMaster/", {
        ...obj,
        Id: 0,
      });
      if (mid.mid > 0 && mid.mid !== null) {
        db.employeeMaster.add({ ...obj, Id: mid.mid }).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    }
  };
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="customerMasterBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="employeeMasterSection mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col">
                <div
                  className={
                    errorObj && errorObj.EmployeeName === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor=""><Text content="Employee Name"/></label>
                  {val === "view" || val === "edit" ? (
                    editinput === true ? (
                      <Autocomplete
                        open={employeeDropDown}
                        options={employeeList}
                        onChange={(e, value) => getEmployeeDetails(value)}
                        getOptionLabel={(option) => option.EmployeeName}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Press ctrl + L"
                            onFocus={() => setEmployeeFocus(true)}
                            onBlur={() => {
                              setEmployeeFocus(false);
                              setEmployeeDropDown(false);
                            }}
                          />
                        )}
                      />
                    ) : (
                      <input
                        type="text"
                        name="EmployeeName"
                        onChange={handleChange}
                        className={
                          errorObj && errorObj.EmployeeName === true
                            ? "error"
                            : ""
                        }
                        readOnly={
                          val === "add" || val === "edit" ? false : true
                        }
                        value={createObj && createObj.EmployeeName}
                        data-valid="varChar"
                      />
                    )
                  ) : (
                    <input
                      type="text"
                      name="EmployeeName"
                      onChange={handleChange}
                      className={
                        errorObj && errorObj.EmployeeName === true
                          ? "error"
                          : ""
                      }
                      readOnly={val === "add" || val === "edit" ? false : true}
                      value={createObj && createObj.EmployeeName}
                      data-valid="varChar"
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Employee Code"/></label>
                  <input
                    type="text"
                    name="EmployeeCode"
                    onChange={handleChange}
                    className={
                      errorObj && errorObj.EmployeeCode === true ? "error" : ""
                    }
                    readOnly={val === "add" || val === "edit" ? false : true}
                    value={createObj && createObj.EmployeeCode}
                    data-valid="varChar"
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Reporting To whom"/></label>
                  <select
                    name="ReportingToWhom"
                    onChange={(e) => handleselectChange(e)}
                    value={createObj && createObj.ReportingToWhom}
                    id=""
                  >
                    <option value="0">None</option>
                    {employeeList &&
                      employeeList.map((a) => (
                        <option value={a.Id}>
                          {a.EmployeeName} [{a.EmployeeCode}]
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Designation"/></label>
                  <select
                    name="Designation"
                    onChange={(e) => handleselectChange(e)}
                    value={createObj && createObj.Designation}
                    id=""
                  >
                    <option value="0">None</option>
                    {designationlist &&
                      designationlist.map((a) => (
                        <option value={a.Id}>{a.DesignationName}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Email Id"/></label>
                  <input
                    type="text"
                    name="EmailId"
                    onChange={handleChange}
                    className={
                      errorObj && errorObj.EmailId === true ? "error" : ""
                    }
                    readOnly={val === "add" || val === "edit" ? false : true}
                    value={createObj && createObj.EmailId}
                    data-valid="email"
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Contact No"/></label>
                  <input
                    type="text"
                    name="ContactNo"
                    onChange={handleChange}
                    className={
                      errorObj && errorObj.ContactNo === true ? "error" : ""
                    }
                    readOnly={val === "add" || val === "edit" ? false : true}
                    value={createObj && createObj.ContactNo}
                    data-valid="monumber"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmployeeMaster;
