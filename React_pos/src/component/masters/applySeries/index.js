import React, { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./applyseries.scss";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from "date-fns/locale";
import { Post } from "../../common/commonFunction";
import Text from "../../common/text";

const ApplySeriesMaster = ({ onlinestatus, pageNav }) => {
  const obj = {
    ssf: "",
    sname: "",
    voucherList: [],
    applyList: [],
    seriesId: "",
  };
  const reqObj = {};

  const [errorObj, setErrorObj] = useState(reqObj);
  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState({
    ...obj,
    indentDate: new Date(),
  });
  const [serieslist, setSerieslist] = useState([]);
  const [autofocus, setAutofocus] = useState(false);
  const [autocomeStatus, setAutocomeStatus] = useState(false);
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
        setCreateObj(obj);
        return setVal(arg);
      } else {
        alert(
          "you are not online please try again after some time when you online"
        );
      }
    }

    if (arg === "edit") {
      await pageLoad();
      setCreateObj(obj);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      setCreateObj(obj);
      return setVal(arg);
    }

    if (arg === "save") {
      if (createObj.seriesId) {
        if (onlinestatus) {
          saveObj();
        } else {
          alert(
            "you are not online please try again after some time when you online"
          );
        }
      } else {
        alert("Please select Series Name");
      }
    }

    if (arg === "refresh") {
      setCreateObj(obj);
      return setVal(arg);
    }
  };

  const pageLoad = async () => {
    const seriesMlist = await db.seriesMaster.toArray();
    setSerieslist(seriesMlist);
  };

  const onchangeselect = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
  };
  const getSeriesName = async (value) => {
    if (value) {
      setAutocomeStatus(false);
      setAutofocus(false);
      const vlist = await db.VoucherList.toArray();
      if (vlist) {
        const list = vlist.map((a) => {
          return { ...a, checked: false, date: new Date() };
        });
        setCreateObj({
          ...createObj,
          sname: value.SeriesName,
          voucherList: list,
          seriesId:
            value.Id === undefined || value.Id === "" ? value.id : value.Id,
        });
      }
    }
  };
  const checkOnchange = async (e, item) => {
    if (e.target.checked) {
      const arr = createObj.voucherList.map((a) => {
        if (a.Id === item.Id) {
          return { ...a, checked: e.target.checked };
        } else {
          return a;
        }
      });
      const aplyList = await db.seriesApply
        .where("VoucherId")
        .equals(item.Id)
        .toArray();
      setCreateObj({
        ...createObj,
        voucherList: arr,
        applyList: [...createObj.applyList, ...aplyList],
      });
    } else {
      const arr = createObj.voucherList.map((a) => {
        if (a.Id === item.Id) {
          return { ...a, checked: e.target.checked };
        } else {
          return a;
        }
      });
      const uncheckList = createObj.applyList.filter(
        (a) => a.VoucherId !== item.Id
      );
      console.log(uncheckList, "uncheckList");
      setCreateObj({ ...createObj, voucherList: arr, applyList: uncheckList });
    }
  };
  const onchangeDate = (date, id) => {
    const arr = createObj.voucherList.map((a) => {
      if (a.Id === id) {
        return { ...a, date: date };
      } else {
        return a;
      }
    });
    setCreateObj({ ...createObj, voucherList: arr });
  };
  const saveObj = async () => {
    const slected = createObj.voucherList.filter((a) => a.checked === true);
    if (slected.length > 0) {
      const list = slected.map((a) => {
        return {
          Id: 0,
          SeriesId: createObj.seriesId,
          VoucherId: a.Id,
          VoucherName: a.VoucherName,
          ItemId: null,
          ApplicableFrom: formatDate(a.date),
          BranchId: 1,
          CreatedBy: localStorage.getItem("UserId"),
          CreatedByName: localStorage.getItem("fname"),
          CreatedOn: formatDate(new Date()),
          EditLog: null,
          alteredon: "",
        };
      });
      if (list.length > 0) {
        let arr = [];
        for (let listobj of list) {
          let mid = await Post("/api/SeriesApply/", listobj);
          if (mid.mid > 0 && mid.mid !== null) {
            arr.push({ ...listobj, Id: mid.mid });
          } else {
            alert(mid.msg, "statuscode:", mid.statuscode);
          }
        }
        let x = await Promise.all(arr);
        if (arr) {
          await db.seriesApply.bulkAdd(arr).then((res) => {
            if (res) {
              alert("data save successfuly");
              setCreateObj(obj);
              change_state("refresh");
            }
          });
        }
      }
    } else {
      alert("please select atleast one voucher");
    }
  };
  const formatDate = (date) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, monthNames[d.getMonth()], year].join("-");
  };
  useEffect(() => {
    const getKey = (e) => {
      if (autofocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setAutocomeStatus(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [createObj, errorObj, autofocus]);

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
              <Text content="Select Series for" />
            </label>
            {val === "view" || val === "edit" || val === "add" ? (
              <select
                name="ssf"
                value={createObj.ssf}
                onChange={(e) => onchangeselect(e)}
              >
                <option value="">Select</option>
                <option value="1">Item (Batch No.)</option>
                <option value="2">Item (Seiral No.)</option>
                <option value="3">Transaction</option>
                <option value="4">Master (Item)</option>
                <option value="5">Master (Party)</option>
              </select>
            ) : (
              <select>
                <option value="">Select</option>
              </select>
            )}
          </div>
        </div>
        <div className="unitMaster">
          <div className="marg">
            <label>
              <Text content="Series Name" />
            </label>
            {createObj.ssf === "3" ? (
              <Autocomplete
                options={serieslist}
                open={autocomeStatus}
                onChange={(e, value) => getSeriesName(value)}
                getOptionLabel={(option) => option.SeriesName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Press Ctrl + L"
                    onFocus={() => setAutofocus(true)}
                    onBlur={() => {
                      setAutofocus(false);
                    }}
                  />
                )}
              />
            ) : (
              <input />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col w50">
            <div className="left_tbl">
              <div className="tableBox">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>
                        <Text content="Apply on" />
                      </th>
                      <th>
                        <Text content="Name" />
                      </th>
                      <th>
                        <Text content="Abbreviation" />
                      </th>
                      <th>
                        <Text content="Applycable form" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {createObj.voucherList &&
                      createObj.voucherList.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={(e) => checkOnchange(e, item)}
                            />
                          </td>
                          <td>{item.VoucherName}</td>
                          <td></td>
                          <td>
                            <DatePicker
                              minDate={new Date()}
                              selected={item.date}
                              onChange={(date) => {
                                onchangeDate(date, item.Id);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col w50">
            <div className="left_tbl">
              <div className="tableBox">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>
                        <Text content="Abbr" />
                      </th>
                      <th>
                        <Text content="Applycable form" />
                      </th>
                      <th>
                        <Text content="Applied Series" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {createObj.applyList &&
                      createObj.applyList.map((item, i) => (
                        <tr>
                          <td>{i + 1}</td>
                          <td></td>
                          <td>
                            <input
                              readOnly="true"
                              value={item.ApplicableFrom}
                            />
                          </td>
                          <td>{item.VoucherName}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplySeriesMaster;
