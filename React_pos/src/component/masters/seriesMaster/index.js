import React, { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./unitMaster.scss";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { formatDate, Post } from "../../common/commonFunction";
import Text from "../../common/text";

const SeriesMasterLot = ({ onlinestatus, pageNav }) => {
  const obj = {
    SeriesName: "",
    RestartSeries: "",
    DigitPadding: "",
    IsActive: false,
    SeriesFieldDetail: [],
  };
  const requiredObj = {
    SeriesName: "",
    DigitPadding: "",
  };
  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState(obj);
  const [errorObj, setErrorObj] = useState(requiredObj);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [serieslist, setSerieslist] = useState([]);
  const [seriesFields, setSeriesFields] = useState([]);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const change_state = async (arg) => {
    if (arg === "view") {
      await pageLoad();
      setCreateObj(obj);
      return setVal(arg);
    }
    if (arg === "add") {
      if (onlinestatus) {
        await pageLoad();
        setCreateObj(obj);
        return setVal(arg);
      } else {
        alert(
          "you are not online please try again after some time when you online"
        );
      }
    }
    if (arg === "refresh") {
      setCreateObj(obj);
      setSeriesFields([]);
      setErrorObj(requiredObj);
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
          save();
        } else {
          alert(
            "you are not online please try again after some time when you online"
          );
        }
      }
    }
  };

  const pageLoad = async () => {
    const serieslistm = await db.seriesMaster.toArray();
    const seriesfield = await db.seriesfieldMaster.toArray();
    const list =
      seriesfield &&
      seriesfield.map((a) => {
        return {
          ...a,
          checked: false,
          FieldValue: "",
          Seperator: null,
          Sno: 0,
        };
      });
    setSeriesFields(list);
    setSerieslist(serieslistm);
  };
  const onchange = async (e, value) => {
    if (value) {
      let id = value.Id;
      let sid = "SeriesId";
      const seArr = await db.seriesMasterDetail.where(sid).equals(id).toArray();
      const arr =
        seriesFields &&
        seriesFields.map((a) => {
          let x = seArr.find((f) => f.FieldId === a.FieldId);
          if (x) {
            return {
              ...a,
              checked: true,
              FieldValue: x.FieldValue,
              Seperator: x.Seperator,
              Sno: parseInt(x.Sno),
            };
          } else {
            return a;
          }
        });
      const obj = {
        SeriesName: value.SeriesName,
        RestartSeries: value.RestartSeries,
        DigitPadding: value.DigitPadding,
        IsActive: value.IsActive,
      };
      setCreateObj(obj);
      setSeriesFields(arr);
      setDropDownOption(false);
      setCodeFocus(false);
    }
  };
  const onchangeformInput = (e) => {
    if (e.target.value !== "") {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCreateObj({ ...createObj, [e.target.name]: e.target.value });
          setErrorObj({ ...errorObj, [e.target.name]: false });
        }
      } else {
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
      }
    } else {
      setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    }
  };
  const isactive = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.checked });
  };
  const onchangeCheck = (e, item) => {
    const list =
      seriesFields &&
      seriesFields.map((a) => {
        if (a.FieldId === item.FieldId) {
          return { ...a, checked: e.target.checked };
        } else {
          return a;
        }
      });
    setSeriesFields(list);
  };
  const onchangeInput = (e, item) => {
    if (e.target.name === "Sno") {
      if (e.target.value !== "") {
        let checkValidate = validate(e.target.value, "number");
        if (checkValidate) {
          const list =
            seriesFields &&
            seriesFields.map((a) => {
              if (a.FieldId === item.FieldId) {
                return { ...a, [e.target.name]: parseInt(e.target.value) };
              } else {
                return a;
              }
            });
          setSeriesFields(list);
        }
      } else {
        const list =
          seriesFields &&
          seriesFields.map((a) => {
            if (a.FieldId === item.FieldId) {
              return { ...a, [e.target.name]: e.target.value };
            } else {
              return a;
            }
          });
        setSeriesFields(list);
      }
    } else {
      const list =
        seriesFields &&
        seriesFields.map((a) => {
          if (a.FieldId === item.FieldId) {
            return { ...a, [e.target.name]: e.target.value };
          } else {
            return a;
          }
        });
      setSeriesFields(list);
    }
  };
  const saveItem = async (getlist, mid) => {
    // let x = await db.seriesMaster.where("SeriesName").equals(createObj.SeriesName).first()
    // const list = seriesFields.filter((a)=> a.checked === true);
    if (getlist) {
      const lst = getlist.map((a) => {
        return {
          SeriesId: mid.mid,
          FieldId: a.FieldId,
          FieldName: a.FieldName,
          FieldValue: a.FieldValue,
          Seperator: a.Seperator,
          Sno: parseInt(a.Sno),
        };
      });
      db.seriesMasterDetail.bulkAdd(lst).then(function (res) {
        if (res) {
          alert(mid.msg);
          setCreateObj(obj);
          setSeriesFields([]);
          setErrorObj(requiredObj);
          setVal("save");
        }
      });
    }
  };
  const save = async () => {
    const list = seriesFields.filter((a) => a.checked === true);
    if (list.length > 0) {
      const saveobj = {
        SeriesName: createObj.SeriesName,
        RestartSeries: createObj.RestartSeries,
        DigitPadding: parseInt(createObj.DigitPadding),
        BranchId: "1",
        IsActive: createObj.IsActive,
        InactiveDate: "",
        CreatedBy: parseInt(localStorage.getItem("UserId")),
        CreatedByName: localStorage.getItem("fname"),
        CreatedOn: formatDate(new Date()),
        EditLog: "",
        alteredon: "",
      };
      const Listsid = list.map((s) => {
        return {
          SeriesId: 0,
          FieldId: s.FieldId,
          FieldName: s.FieldName,
          FieldValue: s.FieldValue,
          Seperator: s.Seperator,
          Sno: parseInt(s.Sno),
        };
      });
      let mid = await Post("/api/seriesmaster/", {
        ...saveobj,
        Id: 0,
        SeriesFieldDetail: Listsid,
      });
      console.log(mid, "mid");
      if (mid.mid > 0 && mid.mid !== null) {
        db.seriesMaster.add({ ...saveobj, Id: mid.mid }).then((res) => {
          if (res) {
            saveItem(Listsid, mid);
          }
        });
      } else {
        alert(mid.msg, "statuscode:", mid.statuscode);
      }
    } else {
      alert("please select atleast 1 Particulars");
    }
  };
  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(codeFocus);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [createObj, codeFocus, dropDownOption, errorObj]);

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
            <label><Text content="Series Name" /></label>
            {val === "view" || val === "edit" ? (
              <Autocomplete
                options={serieslist}
                open={dropDownOption}
                onChange={(e, value) => onchange(e, value)}
                getOptionLabel={(option) => option.SeriesName}
                renderInput={(params) => (
                  <TextField
                    placeholder="Press Ctrl + L"
                    onFocus={() => setCodeFocus(true)}
                    onBlur={() => {
                      setCodeFocus(false);
                      setDropDownOption(false);
                    }}
                    {...params}
                  />
                )}
              />
            ) : (
              <input
                name="SeriesName"
                type="text"
                data-valid="varCharSpace"
                value={createObj && createObj.SeriesName}
                onChange={(e) => onchangeformInput(e)}
                readOnly={val === "add" ? false : true}
                className={
                  errorObj && errorObj.SeriesName === true ? "error" : ""
                }
              />
            )}
          </div>
          <div className="marg">
            <label><Text content="Restart Series No" /></label>
            <select
              name="RestartSeries"
              onChange={(e) => onchangeformInput(e)}
              value={createObj && createObj.RestartSeries}
            >
              <option value="null">none</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="unitMaster">
          <div className="marg">
            <label><Text content="Total Digit of Series No" /></label>
            <input
              name="DigitPadding"
              type="text"
              data-valid="number"
              onChange={(e) => onchangeformInput(e)}
              value={createObj && createObj.DigitPadding}
              className={
                errorObj && errorObj.DigitPadding === true ? "error" : ""
              }
              readOnly={val === "add" ? false : true}
            />
          </div>
          <div className="margo">
            <div className="isActive">
              <label><Text content="IsActive" /></label>
              <input
                name="IsActive"
                type="checkbox"
                onChange={(e) => isactive(e)}
                checked={createObj && createObj.IsActive}
                disabled={val === "add" ? false : true}
              />
            </div>
          </div>
        </div>
        <div className="unitMaster">
          <div className="tableBox" style={{ width: "100%" }}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th><Text content="Particulars" /></th>
                  <th><Text content="Value" /></th>
                  <th><Text content="Seprator" /></th>
                  <th><Text content="order" /></th>
                </tr>
              </thead>
              <tbody>
                {seriesFields.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        checked={a.checked}
                        onChange={(e) => onchangeCheck(e, a)}
                      />
                    </td>
                    <td>{a.FieldName}</td>
                    {/* <td>{a.checked === "true" && val === "edit" ? <input type="text" name="FieldValue" value={a.FieldValue}/>:a.FieldValue}</td> */}
                    <td>
                      {val === "add" && a.checked === true ? (
                        <input
                          onChange={(e) => onchangeInput(e, a)}
                          type="text"
                          name="FieldValue"
                          value={a.FieldValue}
                          style={{ width: "100px" }}
                        />
                      ) : (
                        a.FieldValue
                      )}
                    </td>
                    <td>
                      {val === "add" && a.checked === true ? (
                        <select
                          onChange={(e) => onchangeInput(e, a)}
                          name="Seperator"
                          value={a.Seperator}
                          style={{ width: "100px" }}
                        >
                          <option value="">none</option>
                          <option value="/">/</option>
                          <option value="\">\</option>
                          <option value="-">-</option>
                          <option value="|">|</option>
                        </select>
                      ) : (
                        a.Seperator
                      )}
                    </td>
                    <td>
                      {val === "add" && a.checked === true ? (
                        <input
                          onChange={(e) => onchangeInput(e, a)}
                          type="text"
                          name="Sno"
                          value={a.Sno}
                          style={{ width: "100px" }}
                        />
                      ) : (
                        a.Sno
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeriesMasterLot;
