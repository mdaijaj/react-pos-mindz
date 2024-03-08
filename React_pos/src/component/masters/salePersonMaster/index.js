import "./salePersonMaster.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { Post, Put } from "../../common/commonFunction";
import Text from "../../common/text";

const SalePersonMaster = ({ onlinestatus, pageNav }) => {
  const plainObj = {
    SalePersonName: "",
    SalePersonCode: "",
    Commission: "",
    CommissionValue: "",
    DesginationId: "",
    EmailId: "",
  };
  const [createObj, setCreateObj] = useState(plainObj);
  const [val, setVal] = useState();
  const [errorObj, setErrorObj] = useState(plainObj);
  const [salesPersonList, setSalePersonList] = useState(null);
  const [designationlist, setDesignationlist] = useState([]);
  const [salePersonNameFocus, setSalePersonNameFocus] = useState(false);
  const [salePersonCodeFocus, setSalePersonCodeFocus] = useState(false);
  const [salePersonNamedropDown, setSalePersonNameDropDown] = useState(false);
  const [salePersonCodedropdown, setSalePersonCodeDropDown] = useState(false);
  const [selected, setSelected] = useState({
    SalePersonName: false,
    SalePersonCode: false,
  });
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
        pageLoad();
        setCreateObj(plainObj);
        setSelected({ SalePersonName: false, SalePersonCode: false });
        return setVal(arg);
      } else {
        alert(
          "you are not online please try again after some time when you online"
        );
      }
    }

    if (arg === "edit") {
      pageLoad();
      setCreateObj(plainObj);
      setSelected({ SalePersonName: false, SalePersonCode: false });
      return setVal(arg);
    }

    if (arg === "view") {
      pageLoad();
      setCreateObj(plainObj);
      setSelected({ SalePersonName: false, SalePersonCode: false });
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
      setErrorObj(plainObj);
      setSelected({ SalePersonName: false, SalePersonCode: false });
      return setVal(arg);
    }
  };
  const handleselectChange = (e) => {
    setCreateObj({ ...createObj, DesginationId: e.target.value });
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (value === "") {
      setCreateObj({ ...createObj, [name]: value });
      setSelected({ ...selected, [name]: false });
    } else {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({
            ...errorObj,
            [name]: false,
            Designation: false,
            EmailId: false,
            CommisionPercentage: false,
            CommisionValue: false,
          });
        } else {
          setCreateObj({ ...createObj, [name]: value });
          setErrorObj({
            ...errorObj,
            [name]: true,
            Designation: false,
            EmailId: false,
            CommisionPercentage: false,
            CommisionValue: false,
          });
        }
      }
    }
  };
  const submit = async () => {
    const obj = {
      SalePersonName: createObj.SalePersonName,
      SalePersonCode: createObj.SalePersonCode,
      Commission: createObj.Commission,
      CommissionValue: createObj.CommissionValue,
      DesginationId: createObj.DesginationId,
      EmailId: createObj.EmailId,
    };
    if (createObj.id) {
      let msgSuccess = await Put("/api/SalePerson/", {
        ...obj,
        Id: createObj.Id,
      });
      if (msgSuccess.statuscode === 202) {
        db.salesPersonMaster.update(createObj.id, obj).then((res) => {
          alert(msgSuccess.msg);
          change_state("refresh");
        });
      } else {
        alert(msgSuccess.msg, "statuscode:", msgSuccess.statuscode);
      }
    } else {
      let mid = await Post("/api/SalePerson/", { ...obj, Id: 0 });
      if (mid.mid > 0 && mid.mid !== null) {
        db.salesPersonMaster.add({ ...obj, Id: mid.mid }).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    }

    // if (createObj.id) {
    //   db.salesPersonMaster
    //     .update(createObj.id,obj)
    //     .then((res) => alert("updated successfully"));
    // } else {
    //   db.salesPersonMaster
    //     .add(obj)
    //     .then((res) => alert("saved successfully"));
    // }
    // change_state("refresh");
  };
  const getSalesPersonByName = (value) => {
    if (!value) {
      setCreateObj(plainObj);
      return;
    }
    setSalePersonNameFocus(false);
    setSalePersonNameDropDown(false);
    setSelected({ ...selected, SalePersonName: true, SalePersonCode: true });
    const data = {
      id: value.id,
      Id: value.Id,
      SalePersonName: value.SalePersonName,
      SalePersonCode: value.SalePersonCode,
      Commission: value.Commission,
      CommissionValue: value.CommissionValue,
      DesginationId: value.DesginationId,
      EmailId: value.EmailId,
    };
    setErrorObj(data);
    setCreateObj(data);
  };
  const getSalesPersonByCode = (value) => {
    if (!value) {
      setCreateObj(plainObj);
      return;
    }
    setSalePersonCodeFocus(false);
    setSalePersonCodeDropDown(false);
    setSelected({ ...selected, SalePersonName: true, SalePersonCode: true });
    const data = {
      id: value.id,
      Id: value.Id,
      SalePersonName: value.SalePersonName,
      SalePersonCode: value.SalePersonCode,
      Commission: value.Commission,
      CommissionValue: value.CommissionValue,
      DesginationId: value.DesginationId,
      EmailId: value.EmailId,
    };
    setErrorObj(data);
    setCreateObj(data);
  };
  const pageLoad = async () => {
    const salePersonList = await db.salesPersonMaster.toArray();
    const desination = await db.designationMaster.toArray();
    setSalePersonList(salePersonList);
    setDesignationlist(desination);
  };

  useEffect(() => {
    setErrorObj({
      Designation: false,
      EmailId: false,
      CommisionPercentage: false,
      CommisionValue: false,
    });
    const getKey = (e) => {
      if (salePersonNameFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setSalePersonNameDropDown(true);
        }
      }
      if (salePersonCodeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setSalePersonCodeDropDown(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [salesPersonList, val, salePersonNameFocus, salePersonCodeFocus]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="customerMasterBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="salePersonMaster">
          <div className="row">
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Sale Person Name"/></label>
                {val === "view" || val === "edit" ? (
                  selected.SalePersonName === false ? (
                    <Autocomplete
                      open={salePersonNamedropDown}
                      options={salesPersonList}
                      onChange={(e, value) => getSalesPersonByName(value)}
                      getOptionLabel={(option) => option.SalePersonName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setSalePersonNameFocus(true)}
                          onBlur={() => {
                            setSalePersonNameFocus(false);
                            setSalePersonNameDropDown(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="SalePersonName"
                      data-valid="varCharSpace"
                      //readOnly={true}
                      onChange={handleChange}
                      value={createObj && createObj.SalePersonName}
                    />
                  )
                ) : (
                  <input
                    name="SalePersonName"
                    onChange={handleChange}
                    type="text"
                    data-valid="varCharSpace"
                    className={
                      errorObj && errorObj.SalePersonName === true
                        ? "error"
                        : ""
                    }
                    value={createObj && createObj.SalePersonName}
                    // readOnly={val === "add" ? false : true}
                  />
                )}
              </div>
            </div>
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Sale Person Code"/></label>
                {val === "view" || val === "edit" ? (
                  selected.SalePersonCode === false ? (
                    <Autocomplete
                      open={salePersonCodedropdown}
                      options={salesPersonList}
                      onChange={(e, value) => getSalesPersonByCode(value)}
                      getOptionLabel={(option) => option.SalePersonCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setSalePersonCodeFocus(true)}
                          onBlur={() => {
                            setSalePersonCodeFocus(false);
                            setSalePersonCodeDropDown(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="SalePersonCode"
                      data-valid="varChar"
                      onChange={handleChange}
                      //readOnly={true}
                      value={createObj && createObj.SalePersonCode}
                    />
                  )
                ) : (
                  <input
                    name="SalePersonCode"
                    onChange={handleChange}
                    type="text"
                    data-valid="varChar"
                    className={
                      errorObj && errorObj.SalePersonCode === true
                        ? "error"
                        : ""
                    }
                    value={createObj && createObj.SalePersonCode}
                    // readOnly={val === "add" ? false : true}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="box greyBg">
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Commision Percentage (%)"/></label>
                  <input
                    name="Commission"
                    onChange={handleChange}
                    type="text"
                    data-valid="number"
                    className={
                      errorObj && errorObj.Commission === true ? "error" : ""
                    }
                    value={createObj && createObj.Commission}
                    readOnly={val === "add" || val === "edit" ? false : true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Commission Value"/></label>
                  <input
                    name="CommissionValue"
                    onChange={handleChange}
                    type="text"
                    data-valid="number"
                    className={
                      errorObj && errorObj.CommissionValue === true
                        ? "error"
                        : ""
                    }
                    value={createObj && createObj.CommissionValue}
                    readOnly={val === "add" || val === "edit" ? false : true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Desgination"/></label>
                  <select
                    name="Designation"
                    onChange={(e) => handleselectChange(e)}
                    value={createObj && createObj.DesginationId}
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
                  <label htmlFor=""><Text content="Email ID"/></label>
                  <input
                    name="EmailId"
                    onChange={handleChange}
                    type="text"
                    data-valid="email"
                    // className={
                    //   errorObj && errorObj.EmailId === true ? "error" : ""
                    // }
                    value={createObj && createObj.EmailId}
                    readOnly={val === "add" || val === "edit" ? false : true}
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
export default SalePersonMaster;
