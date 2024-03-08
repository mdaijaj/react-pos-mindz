import "./purchaseReturn.scss";
import CommonFormAction from "../../common/commonFormAction";
import calenderIcon from "../../../images/icon/calender.svg";
import { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import coulmn from "./column";
import CustomTable from "../../common/table";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
} from "../../common/commonFunction";

const PurchaseReturn = ({ pageNav }) => {
  const plainObj = {
    Id: "",
    documentdate: "",
    documentno: "",
    erpinvoice: "",
    gitno: "",
    inwardno: "",
    vendorcode: "",
    vendorname: "",
    items: [],
    vendorList: [],
    inwardList: [],
    inwardbyVendor: [],
    prList: [],
  };
  const required = {
    documentno: "",
    inwardno: "",
    documentdate: "",
    vendorcode: "",
    vendorname: "",
    gitno: "",
    erpinvoice: "",
  };
  const [requiredObj, setRequiredObj] = useState(required);
  const [createObj, setCreateObj] = useState(plainObj);
  const [val, setVal] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [saveEdit, setSaveEdit] = useState(false);
  const [edit, setEdit] = useState();
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [updatedObj, setUpdatedObj] = useState();
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });
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
        let count = await db.PR_Master.where("Manual").equals(0).toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        AddEvent(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.PR_Master.where("Manual").equals(0).toArray();
      let srCount = count.filter(
        (a) => a.SeriesId === (series.seriesId === "" ? 0 : series.seriesId)
      );
      let val = { ...series, digit: 5, dbcount: srCount };
      let sr = await getseriesNo(val, pageNav.formid);
      AddEvent(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count = await db.PR_Master.where("Manual").equals(0).toArray();
      let srCount = count.filter(
        (a) => a.SeriesId === (series.seriesId === "" ? 0 : series.seriesId)
      );
      let val = { ...series, dbcount: srCount };
      let sr = await getseriesNo(val, pageNav.formid);
      AddEvent(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  /**
   * genrate document No and get vendor list and get inward List
   */
  const AddEvent = async (DocumentNo) => {
    const inwardlist = await db.IC_Master.toArray();
    if (inwardlist) {
      let vendorIds = inwardlist.map((a) => {
        return a.PartyId;
      });
      let x = uniqueInarray(vendorIds);
      let vendors = [];
      for (let res in x) {
        let vendor = await db.customerMaster
          .where("Id")
          .equals(x[res])
          .first()
          .then()
          .catch((err) => console.log(err));
        let obj = {
          PartyId: x[res],
          vendorName: vendor.PartyName,
          vendorCode: vendor.PartyCode,
        };
        vendors.push(obj);
      }
      setCreateObj({
        ...createObj,
        documentno: DocumentNo,
        documentdate: new Date(),
        vendorList: vendors.sort((a, b) =>
          a.vendorName.localeCompare(b.vendorName)
        ),
        inwardList: inwardlist,
      });
    }
  };
  const uniqueInarray = (array) => {
    return [...new Set(array)];
  };
  /***
   * get Purchase Return list
   */
  const getPrList = async () => {
    let userID = localStorage.getItem("UserId");
    const Prlist1 = await db.PR_Master.where("Manual")
      .equals(0)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const Prlist = Prlist1.filter((f) => f.CreatedBy === userID);
    if (Prlist) {
      setCreateObj({ ...createObj, prList: Prlist });
    }
  };
  /***
   * get purchase return
   */
  const getPr = async (value) => {
    if (value) {
      setCodeFocus("");
      setDropDownOption("");
      let res = await db.PR_Detail.where("Prid")
        .equals(value.id)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      let inwdres = await db.IC_Master.where("id")
        .equals(res[0].InwardDetailId)
        .first();
      let venderRes = await db.customerMaster
        .where("Id")
        .equals(value.vendorid)
        .first();
      let Getgitno = await db.GITMaster.where("gitid")
        .equals(inwdres.GIT)
        .first()
        .then()
        .catch((err) => console.log(err));
      if (res) {
        let list = [];
        for (let item of res) {
          let proDetails = await db.itemMaster
            .where("ItemId")
            .equals(item.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          let itemobj = {
            id: item.id,
            InwardDetailId: item.InwardDetailId,
            Prid: item.Prid,
            ItemId: item.ItemId,
            returnQty: item.ReturnBaseQty,
            Rate: item.Rate,
            itemname: proDetails === undefined ? "" : proDetails.ItemName,
            itemcode: proDetails === undefined ? "" : proDetails.ItemCode,
            MRP: item.MRP,
          };
          list.push(itemobj);
        }
        let obj = {
          id: value.id,
          documentno: value.PurchaseReturnNo,
          documentdate: value.PurchaseReturnDate,
          venderId: value.vendorid,
          inwardno: inwdres.InwardNo,
          vendorcode: venderRes.PartyCode,
          vendorname: venderRes.PartyName,
          gitno: Getgitno.git_no,
          erpinvoice: Getgitno.git_no,
          items: list,
        };
        setCreateObj({ ...createObj, ...obj });
        setSeriesandVoucher({
          seriesId: value.SeriesId,
          voucherId: value.SeriesVoucherType,
        });
      }
    }
  };
  /***
   * refresh state
   */
  const rest = () => {
    setCreateObj(plainObj);
    setCodeFocus("");
    setDropDownOption("");
    setDropdown();
    setRequiredObj(required);
    setEditcoulmn(false);
    setSeriesandVoucher({
      seriesId: "",
      voucherId: "",
    });
  };
  /***
   * get vender detail
   */
  const getVendor = (value) => {
    if (value) {
      const a = codeFocus === "VendorName" ? "code" : "name";
      setCodeFocus("");
      setDropDownOption("");
      let inwardNolist = createObj.inwardList.filter(
        (v) => v.PartyId === value.PartyId
      );
      setCreateObj({
        ...createObj,
        vendorname: value.vendorName,
        vendorcode: value.vendorCode,
        venderId: value.PartyId,
        inwardbyVendor: inwardNolist,
      });
      setDropdown(a);
    }
  };

  const disableType = (e) => {
    e.preventDefault();
  };
  /***
   * get inward
   */
  const getInward = async (inward) => {
    if (inward) {
      const Getgitno = await db.GITMaster.where("gitid")
        .equals(inward.GIT)
        .first()
        .then()
        .catch((err) => console.log(err));
      const itemList = await db.IC_Detail.where("InwardNo")
        .equals(inward.InwardNo)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      if (itemList) {
        let list = [];
        for (let item of itemList) {
          let proDetails = await db.itemMaster
            .where("ItemId")
            .equals(item.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          item.itemname = proDetails === undefined ? "" : proDetails.ItemCode;
          item.itemcode = proDetails === undefined ? "" : proDetails.ItemName;
          item.returnQty = 0;
          list.push(item);
        }
        setCreateObj({
          ...createObj,
          gitno: Getgitno.git_no,
          erpinvoice: Getgitno.git_no,
          inwardno: inward.InwardNo,
          items: list,
        });
        setCodeFocus("");
        setDropDownOption("");
      }
    }
  };
  /******table event */
  const selectedRow = (item) => {
    setSelectedTblRow(item);
    setEdit(false);
  };

  const editItem = () => {
    setEdit(true);
  };
  const tableInputOnchange = (e) => {
    setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    return e.target.value;
  };
  const removeItem = () => {
    const res = createObj.items.filter(
      (a) => a.ItemId !== selectedTblRow.ItemId
    );
    if (res) {
      setCreateObj({ ...createObj, items: res });
    }
  };

  /******table event end*/
  const change_state = (arg) => {
    switch (arg) {
      case "edit": {
        setVal(arg);
        getPrList();
        setSaveEdit(true);
        setEditcoulmn(true);
        return;
      }
      case "refresh": {
        rest();
        setSaveEdit(false);
        setVal(arg);
        return;
      }
      case "view": {
        getPrList();
        setSaveEdit(false);
        setEditcoulmn(false);
        setVal(arg);
        return;
      }
      case "add": {
        getoucherList();
        setSaveEdit(false);
        setEditcoulmn(true);
        setVal(arg);
        return;
      }
      case "save": {
        const objKey = Object.keys(requiredObj);
        var result = {};
        objKey.forEach(
          (key) => (result[key] = createObj[key] === "" ? true : false)
        );
        setRequiredObj(result);
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
  const updateAction = useCallback(() => {
    const array = createObj.items.map((a) => {
      return a.ItemId === selectedTblRow.ItemId ? { ...a, ...updatedObj } : a;
    });
    setCreateObj({ ...createObj, items: array });
  }, [selectedTblRow, updatedObj, createObj]);
  const saveItemData = async () => {
    const getId = await db.PR_Master.where("PurchaseReturnNo")
      .equals(createObj.documentno)
      .first();
    if (getId) {
      const items = createObj.items.map((item) => {
        let obj = {
          Prid: getId.id,
          ItemId: item.ItemId,
          ReturnBaseQty: parseInt(item.returnQty),
          ReturnAltQty: 0,
          Rate: item.Rate,
          InwardDetailId: item.id,
          MRP: item.MRP,
        };
        if (!saveEdit) {
          return obj;
        } else {
          obj.id = item.id;
          obj.InwardDetailId = item.InwardDetailId;
          return obj;
        }
      });
      if (!saveEdit) {
        await db.PR_Detail.bulkAdd(items)
          .then(function (additem) {
            if (additem) {
              alert("data save successfully");
              rest();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      } else {
        await db.PR_Detail.bulkPut(items).then(function (update) {
          if (update) {
            alert("data update successfully");
            rest();
            setVal("save");
          }
        });
      }
    }
  };
  const saveData = async () => {
    const obj = {
      PurchaseReturnNo: createObj.documentno,
      PurchaseReturnDate: createObj.documentdate,
      vendorid: createObj.venderId,
      Manual: 0,
      InwardNo: createObj.inwardno,
      GITNo: createObj.gitno,
      CreatedBy: localStorage.getItem("UserId"),
      CreatedOn: new Date(),
      SeriesId:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      SeriesVoucherType:
        seriesandVoucher.voucherId === "" ? "" : seriesandVoucher.voucherId,
    };
    if (!saveEdit) {
      await db.PR_Master.add({ ...obj, new: 1, update: 0 })
        .then(function (add) {
          if (add) {
            saveItemData();
          }
        })
        .catch((err) => console.log(err));
    } else {
      await db.PR_Master.put(createObj.id, { ...obj, update: 1 })
        .then(function (add) {
          if (add) {
            saveItemData();
          }
        })
        .catch((err) => console.log(err));
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
      if (e.key === "Enter") {
        e.preventDefault();
        updateAction();
        setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [codeFocus, selectedTblRow, createObj, updateAction, requiredObj]);

  const para = { val, change_state, disabledAction };

  return (
    <>
      <div
        className="purchaseReturn"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="purchaseReturnIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div
                  className={
                    requiredObj && requiredObj.documentno === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Document No" />.
                  </label>
                  {val === "view" || val === "edit" ? (
                    <Autocomplete
                      open={dropDownOption === "DocumentNo" ? true : false}
                      options={createObj.prList}
                      onChange={(e, value) => getPr(value)}
                      getOptionLabel={(option) =>
                        option.PurchaseReturnNo.toString()
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("DocumentNo")}
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
                      name="documentNo"
                      readOnly={true}
                      value={createObj && createObj.documentno}
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div
                  className={
                    requiredObj && requiredObj.documentdate === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Document Date" />
                  </label>
                  <DatePicker
                    selected={createObj && createObj.documentdate}
                    minDate={createObj && createObj.documentdate}
                    maxDate={createObj && createObj.documentdate}
                    // onChange={(date) => onchangeDate(date)}
                    // dropdownMode="select"
                    onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    requiredObj && requiredObj.vendorname === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Name" />
                  </label>
                  {val === "add" && dropdown !== "name" ? (
                    <Autocomplete
                      open={dropDownOption === "VendorName" ? true : false}
                      options={createObj.vendorList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.vendorName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("VendorName")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      name="vendorName"
                      type="text"
                      readOnly={true}
                      value={createObj && createObj.vendorname}
                    />
                  )}
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    requiredObj && requiredObj.vendorcode === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Code" />
                  </label>
                  {val === "add" && dropdown !== "code" ? (
                    <Autocomplete
                      open={dropDownOption === "VendorCode" ? true : false}
                      options={createObj.vendorList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.vendorCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("VendorCode")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      name="vendorCode"
                      type="text"
                      readOnly={true}
                      value={createObj && createObj.vendorcode}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col w25 autoComp">
                <div
                  className={
                    requiredObj && requiredObj.inwardno === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Inward No" />.
                  </label>
                  {val === "add" ? (
                    <Autocomplete
                      open={dropDownOption === "InwardNo" ? true : false}
                      options={createObj.inwardbyVendor}
                      onChange={(e, value) => getInward(value)}
                      getOptionLabel={(option) => option.InwardNo.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("InwardNo")}
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
                      name="inwardNo"
                      readOnly={true}
                      value={createObj && createObj.inwardno}
                    />
                  )}
                </div>
              </div>
              <div className="col w25">
                <div
                  className={
                    requiredObj && requiredObj.gitno === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="GIT No" />.
                  </label>
                  <input
                    type="text"
                    name="gitNo"
                    readOnly={true}
                    value={createObj && createObj.gitno}
                  />
                </div>
              </div>
              <div className="col w25">
                <div
                  className={
                    requiredObj && requiredObj.erpinvoice === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="ERP Invoice" />
                  </label>
                  <input
                    type="text"
                    name="erpinvoice"
                    readOnly={true}
                    value={createObj && createObj.erpinvoice}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tableBox" style={{ marginBottom: "15px" }}>
            <CustomTable
              coulmn={coulmn}
              data={createObj.items}
              overFlowScroll={true}
              selectedTr={(item) => selectedRow(item)}
              editColumn={editcoulmn}
              editfunction={() => editItem()}
              editStatus={edit}
              //deleteRow={() => removeItem()}
              tblInputOnchange={(e) => tableInputOnchange(e)}
            />
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
export default PurchaseReturn;
