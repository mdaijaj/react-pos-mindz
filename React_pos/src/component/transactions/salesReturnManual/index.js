import "./index.scss";
import React, { useState, useEffect, useCallback } from "react";
import CommonFormAction from "../../common/commonFormAction";
import CustomTable from "../../common/table";
import coulmn from "./tableColumn";
import TaxInfo from "./TaxInfo";
import calenderIcon from "../../../images/icon/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
} from "../../common/commonFunction";
import {
  getTaxesByItemObj,
  getPercentCalc,
  getAndSetTaxOrAmount,
  fixedToLength,
} from "./commonfunction";

const SalesReturnManual = ({ pageNav }) => {
  const Obj = {
    Id: 0,
    Invoiceno: "",
    InvoiceDate: "",
    PartyId: "",
    vendorCode: "",
    vendorName: "",
    invoicetype: "",
    vendorList: [],
    invoiceList: [],
    taxpage: {
      grossamount: "0.00",
      discountamount: "0.00",
      taxamount: "0.00",
      netamount: "0.00",
      roundOff: "0.00",
      totalAmount: "0.00",
      igstAmount: "0.00",
      cgstAmount: "0.00",
      sgstAmount: "0.00",
    },
    billingcountryid: "",
    billingstateid: "",
    billingaddress: "",
    billinggstinno: "",
    shippingcountryid: "",
    shippingstateid: "",
    shippingaddress: "",
    shippinggstinno: "",
    CreatedBy: "",
    remark: "",
    dncn_against_pi: "",
    itemList: [],
    items: [],
    stateList: [],
  };
  const itemObj = {
    InvoiceId: "",
    ItemId: "",
    ItemName: "",
    unit: "0",
    isaltrate: "",
    Quantity: "",
    altqty: "",
    Rate: "",
    Amount: "",
    totalAmount: "",
    finalDiscount: "",
    DiscountPer: "",
    DiscountAmount: "",
    hsnclassificationid: "",
    igstrate: 0,
    cgstrate: 0,
    sgstrate: 0,
    igstamount: 0,
    cgstamount: 0,
    sgstamount: 0,
  };
  const reqObj = {
    // billingstateid: "",
    // billingaddress: "",
    // billinggstinno: "",
    // shippingstateid: "",
    // shippingaddress: "",
    // shippinggstinno: "",
    InvoiceNo: "",
    InvoiceDate: "",
    vendorCode: "",
    vendorName: "",
  };
  const [val, setVal] = useState();
  const [requiredObj, setRequiredObj] = useState(reqObj);
  const [createObj, setCreateObj] = useState(Obj);
  const [edit, setEdit] = useState();
  const [refreshtbl, setRefreshtbl] = useState(false);
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [saveEdit, setSaveEdit] = useState(false);
  const [updatedObj, setUpdatedObj] = useState();
  const [addbtn, setAddbtn] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const change_state = (arg) => {
    switch (arg) {
      case "add": {
        setVal(arg);
        getoucherList();
        setSaveEdit(false);
        setEditcoulmn(true);
        setAddbtn(true);
        return;
      }
      case "edit": {
        setVal(arg);
        getInvoiceList();
        setSaveEdit(true);
        setAddbtn(false);
        setEditcoulmn(true);

        return;
      }
      case "view": {
        setVal(arg);
        getInvoiceList();
        setSaveEdit(false);
        setEditcoulmn(false);
        setAddbtn(false);
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
        //setVal(arg);
        return;
      }
      case "refresh": {
        refresh();
        setSaveEdit(false);
        setEditcoulmn(false);
        setAddbtn(false);
        setVal(arg);
        return;
      }
      default:
        return arg;
    }
  };
  const refresh = () => {
    setCreateObj(Obj);
    setCodeFocus("");
    setDropDownOption("");
    setDropdown("");
    setRequiredObj(reqObj);
  };
  const onchange = (e) => {
    // console.log("ddd");
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      console.log(e.target.name, "ll");
      setRequiredObj({ ...requiredObj, [e.target.name]: "" });
    } else {
      console.log(e.target.name, "mm");
      setRequiredObj({ ...requiredObj, [e.target.name]: false });
    }
  };
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.salesReturn.toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        addEvent(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.salesReturn.toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
      // setBillSeries(sr);
    } else {
      let count = await db.salesReturn.toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
      // setBillSeries(sr);
    }
    setVoucherStatus(false);
  };
  /****
   * add click event
   */
  const addEvent = async (invoiceNo) => {
    //const invoiceNo = Math.floor(100000000 + Math.random() * 900000000);
    const res = await db.customerMaster
      .where("LedgerType")
      .equals(1)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const itemlist = await db.itemMaster
      .toArray()
      .then()
      .catch((arr) => console.log(arr));
    const StateList = await GetStateList();
    setCreateObj({
      ...createObj,
      Invoiceno: invoiceNo,
      InvoiceDate: new Date(),
      vendorList: res.sort((a, b) => a.PartyName.localeCompare(b.PartyName)),
      itemList: itemlist,
      stateList: StateList,
    });
  };
  const GetStateList = async () => {
    const seen = new Set();
    let arr = await db.cityMaster.toArray();
    const filteredArr = arr.filter((el) => {
      const duplicate = seen.has(el.StateName);
      seen.add(el.StateName);
      return !duplicate;
    });
    return filteredArr;
  };
  /***
   * get vendor
   */
  const getVendor = (value) => {
    if (value) {
      const a = codeFocus === "VendorName" ? "code" : "name";
      setCreateObj({
        ...createObj,
        PartyId: value.Id,
        vendorCode: value.PartyCode,
        vendorName: value.PartyName,
      });
      setRequiredObj({ ...requiredObj, vendorName: false, vendorCode: false });
      setCodeFocus("");
      setDropDownOption("");
      setDropdown(a);
    }
  };
  const selectedRow = (item) => {
    setRefreshtbl(false);
    setSelectedTblRow(item);
    if (edit) {
      if (selectedTblRow) {
        console.log(selectedTblRow, "selectedTblRow1");
        const array = createObj.items.map((a) => {
          return a.Id !== undefined
            ? a.Id === selectedTblRow.Id
              ? { ...a, ...selectedTblRow }
              : a
            : a.staticid === selectedTblRow.staticid
            ? { ...a, ...selectedTblRow }
            : a;
        });
        setCreateObj({ ...createObj, items: array });
      }
    }
    setEdit(false);
  };
  const editItem = () => {
    setEdit(true);
  };
  const removeItem = () => {
    const res = createObj.items.filter((a) =>
      a.Id !== undefined
        ? a.Id !== selectedTblRow.Id
        : a.staticid !== selectedTblRow.staticid
    );
    if (res) {
      const nArray = res.map((a, index) => {
        if (a.Id === undefined) {
          return { ...a, staticid: index + 1 };
        } else {
          return a;
        }
      });
      setCreateObj({ ...createObj, items: nArray });
    }
  };
  const tableInputOnchange = (e) => {
    console.log("tableInputOnchange invice", e);
    setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    return e.target.value;
    // if (e.target.value === "") {
    //   alert(
    //     "you can't remove last digit from input press Ctrl + A and change value 0 or any digit"
    //   );
    //   return e.target.value;
    // } else {
    //   setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    //   return e.target.value;
    // }
  };
  const tblOptionGet = async (option) => {
    console.log(option, "option");
    const res = await getTaxesByItemObj(option);
    console.log(option, "option");
    if (option) {
      let hsnid = option.GSTClassification[0].HsnId;
      setUpdatedObj({
        ...updatedObj,
        ItemName: option.ItemName,
        ItemId: option.ItemId,
        igstrate: res.igstRate,
        cgstrate: res.cgstRate,
        sgstrate: res.sgstRate,
        hsnid: hsnid,
      });
    }
  };
  const addItem = () => {
    let item = { ...itemObj, staticid: createObj.items.length + 1 };
    let items = [...createObj.items, { ...item }];
    setCreateObj({ ...createObj, items: items });
    setAddbtn(true);
  };

  const updateAction = useCallback(async () => {
    if (updatedObj !== undefined) {
      let qty =
        updatedObj.Quantity !== undefined
          ? updatedObj.Quantity
          : selectedTblRow.Quantity !== ""
          ? selectedTblRow.Quantity
          : 0;
      let rate =
        updatedObj.Rate !== undefined
          ? updatedObj.Rate
          : selectedTblRow.Rate !== ""
          ? selectedTblRow.Rate
          : 0;
      let disPer =
        updatedObj.DiscountPer !== undefined
          ? updatedObj.DiscountPer
          : selectedTblRow.DiscountPer !== ""
          ? selectedTblRow.DiscountPer
          : 0;
      let igstRate =
        updatedObj.igstrate !== undefined
          ? updatedObj.igstrate
          : selectedTblRow.igstrate !== ""
          ? selectedTblRow.igstrate
          : 0;
      let cgstRate =
        updatedObj.cgstrate !== undefined
          ? updatedObj.cgstrate
          : selectedTblRow.cgstrate !== ""
          ? selectedTblRow.cgstrate
          : 0;
      let sgstRate =
        updatedObj.sgstrate !== undefined
          ? updatedObj.sgstrate
          : selectedTblRow.sgstrate !== ""
          ? selectedTblRow.sgstrate
          : 0;
      let amount = qty * rate;
      let disAmount = (disPer * amount) / 100;
      let igst = getPercentCalc(igstRate, amount);
      let cgst = getPercentCalc(cgstRate, amount);
      let sgst = getPercentCalc(sgstRate, amount);
      let fnDisc = amount - disAmount;
      let totlAmt =
        parseFloat(fnDisc) +
        parseFloat(igst) +
        parseFloat(cgst) +
        parseFloat(sgst);
      let newUpdateObj = {
        ...updatedObj,
        ItemName:
          updatedObj.ItemName !== undefined
            ? updatedObj.ItemName
            : selectedTblRow.ItemName !== undefined
            ? selectedTblRow.ItemName
            : "",
        igstamount: fixedToLength(igst),
        cgstamount: fixedToLength(cgst),
        sgstamount: fixedToLength(sgst),
        Quantity: qty,
        Rate: fixedToLength(rate),
        DiscountPer: fixedToLength(disPer),
        Amount: fixedToLength(amount),
        DiscountAmount: fixedToLength(disAmount),
        totalAmount: fixedToLength(totlAmt),
        altqty: updatedObj.altqty !== undefined ? updatedObj.altqty : qty,
        finalDiscount: fixedToLength(fnDisc),
        hsnid:
          updatedObj.hsnid !== undefined
            ? updatedObj.hsnid
            : selectedTblRow.hsnid !== undefined
            ? selectedTblRow.hsnid
            : "",
      };
      const array = createObj.items.map((a) => {
        if (a.Id === undefined) {
          return a.staticid === selectedTblRow.staticid
            ? { ...a, ...newUpdateObj }
            : a;
        } else {
          return a.Id === selectedTblRow.Id ? { ...a, ...newUpdateObj } : a;
        }
      });
      let taxpageObj = getAndSetTaxOrAmount(array);
      setCreateObj({ ...createObj, items: array, taxpage: taxpageObj });
      setEdit(false);
      setUpdatedObj();
      // setAddbtn(false);
      setRefreshtbl(true);
    } else {
      setRefreshtbl(true);
    }
  }, [selectedTblRow, updatedObj, createObj]);
  // const fixedToLength = (data) => {
  //   return data ? parseFloat(data).toFixed(2) : data;
  // };
  const getInvoiceList = async () => {
    let userID = localStorage.getItem("UserId");
    const res1 = await db.salesReturn
      .toArray()
      .then()
      .catch((err) => console.log(err));

    const res = res1.filter((f) => f.CreatedBy === userID);

    const itemlist = await db.SaleReturnDetail.toArray()
      .then()
      .catch((arr) => console.log(arr));
    console.log("transaction purchase invoice res vvk", res);

    if (res) {
      setCreateObj({ ...createObj, invoiceList: res, itemList: itemlist });
    }
  };
  const getInvoice = async (value) => {
    //console.log("value.PartyId@@@@@@@@@@@@@@@@@@@@@@@@@",value.PartyId);
    if (value) {
      setCodeFocus("");
      setDropDownOption("");
      //  const StateList = await GetStateList();
      const vendor = await db.customerMaster
        .where("Id")
        .equals(value.PartyId)
        .first()
        .then()
        .catch((err) => console.log(err));

      const salesReturn = await db.salesReturn
        .where("Invoiceno")
        .equals(value.Invoiceno)
        .first()
        .then()
        .catch((err) => console.log(err));

      const items = await db.SaleReturnDetail.where("InvoiceId")
        .equals(salesReturn.id)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      let list = [];
      for (let item of items) {
        let proDetails = await db.itemMaster
          .where("ItemId")
          .equals(item.ItemId)
          .first()
          .then()
          .catch((err) => console.log(err));
        item.ItemName = proDetails === undefined ? "" : proDetails.ItemName;
        list.push(item);
      }

      const itemarr = list.map((item) => {
        let fnDisc =
          parseFloat(item.GrossAmount) - parseFloat(item.ManualDiscountAmount);
        let tot =
          parseFloat(fnDisc) +
          parseFloat(item.IgstAmount) +
          parseFloat(item.CgstAmount) +
          parseFloat(item.SgstAmount);
        return {
          ...item,

          totalAmount: fixedToLength(tot),
          finalDiscount: fixedToLength(fnDisc),
          Rate: fixedToLength(item.MRP),
          DiscountPer: fixedToLength(item.ManualDiscount),
          DiscountAmount: fixedToLength(item.ManualDiscountAmount),
          igstamount: fixedToLength(item.IgstAmount),
          cgstamount: fixedToLength(item.CgstAmount),
          sgstamount: fixedToLength(item.SgstAmount),
          Amount: fixedToLength(item.GrossAmount),
          igstrate: fixedToLength(item.IgstRate),
          cgstrate: fixedToLength(item.CgstRate),
          sgstrate: fixedToLength(item.SgstRate),
          unit: "NOS",
        };
      });
      let txPageObj = getAndSetTaxOrAmount(itemarr);
      setCreateObj({
        ...createObj,
        id: value.id,
        //vendorName: vendor.PartyName,
        vendorCode: vendor.PartyCode,
        Invoiceno: value.Invoiceno,
        InvoiceDate: value.InvoiceDate,
        PartyId: value.PartyId,
        remark: salesReturn.remark,
        taxpage: txPageObj,
        items: itemarr,
      });

      setAddbtn(true);
    }
  };

  const saveData = () => {
    const saveObj = {
      Id: createObj.Id,
      BranchId: "",
      Invoiceno: createObj.Invoiceno,
      SeriesId: "",
      RTaxAmount: parseFloat(createObj.taxpage.taxamount),
      InvoiceDate: createObj.InvoiceDate,
      PartyId: parseInt(createObj.PartyId),
      GrossAmount: parseFloat(createObj.taxpage.grossamount),
      EditLog: "",
      SeriesVoucherType: "",
      TotalBillQty: 0,
      DiscountAmount: parseFloat(createObj.taxpage.discountamount),
      IsAuthorized: "",
      InvoiceType: "",
      ReceiveAmount: parseFloat(createObj.taxpage.netamount),
      Remarks: createObj.remark,
      CopunterId: "",
      InvoiceId: createObj.InvoiceNo,
      CreatedBy: localStorage.getItem("UserId"),
      NetAmount: parseFloat(createObj.taxpage.netamount),
      Stype: "M",
      CreatedOn: new Date(),
      new: 1,
      update: 0,
    };
    if (!saveEdit) {
      db.salesReturn
        .add(saveObj)
        .then((update) => {
          if (update) {
            saveItem();
          }
        })
        .catch((err) => console.log(err));
    } else {
      let editObj = { ...saveObj, id: createObj.id };
      db.salesReturn
        .put(editObj)
        .then((update) => {
          if (update) {
            saveItem();
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const saveItem = async () => {
    //const res = await db.salesReturn.toArray();

    const res = await db.salesReturn
      .where("Invoiceno")
      .equals(createObj.Invoiceno)
      .first();
    const itemArray = createObj.items.map((item) => {
      const saveItemObj = {
        InvoiceId: res.id,
        TotalTaxAmount: item.totalAmount,
        AutoDiscountAmount: parseFloat(item.DiscountAmount),
        SgstAmount: item.sgstamount,
        SgstAmount: item.sgstamount,
        ManualDiscountAmount: parseFloat(item.DiscountAmount),
        GrossAmount: parseFloat(item.Amount),
        SgstRate: item.sgstrate,
        ItemId: item.ItemId,
        Quantity: parseInt(item.Quantity),
        CgstAmount: item.cgstamount,
        MRP: parseFloat(item.Rate),
        IgstRate: parseFloat(item.igstrate),
        ManualDiscount: item.DiscountPer,
        ItemRemark: item.remark,
        CgstRate: parseFloat(item.cgstrate),
        SalePrice: item.saleprice,
        AgainstInvoiceDetailid: "",
        Hsnid: 0,
        TaxPercentage: item.taxper,
        AgainstInvoiceId: "",
        AltQuantity: parseInt(item.altqty),
        IgstAmount: item.igstamount,
        SaleReturnId: item.InvoiceNo,
        AutoDiscount: parseFloat(item.DiscountPer),
        FinalDiscount: parseFloat(item.finalDiscount),
      };
      if (saveEdit) {
        saveItemObj.Id = item.Id;
        return saveItemObj;
      } else {
        return saveItemObj;
      }
    });
    if (itemArray) {
      if (!saveEdit) {
        db.SaleReturnDetail.bulkAdd(itemArray)
          .then((update) => {
            if (update) {
              alert("data save successfully");
              refresh();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      } else {
        db.SaleReturnDetail.bulkPut(itemArray)
          .then((update) => {
            if (update) {
              alert("data Update successfully");
              refresh();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };
  useEffect(() => {
    console.log(createObj, "createObj4444");
    const getKey = (e) => {
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setDropDownOption(codeFocus);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        updateAction();
        // setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [createObj, selectedTblRow, updateAction, codeFocus, updatedObj]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="salereturnManual"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="salereturnManualIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col w65">
                <div className="row">
                  <div className="col autoComp">
                    <div
                      className={
                        requiredObj.InvoiceNo === true
                          ? "formBox error"
                          : "formBox"
                      }
                    >
                      <label htmlFor="">
                        <Text content="Sales Return No" />
                        <span className="required">*</span>
                      </label>
                      {val === "edit" || val === "view" ? (
                        <Autocomplete
                          open={dropDownOption === "Invoiceno" ? true : false}
                          options={createObj.invoiceList}
                          onChange={(e, value) => getInvoice(value)}
                          getOptionLabel={(option) =>
                            option.Invoiceno.toString()
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("Invoiceno")}
                              onBlur={() => {
                                setCodeFocus("");
                                setDropDownOption("");
                              }}
                            />
                          )}
                        />
                      ) : (
                        <input
                          type="text"
                          value={createObj.Invoiceno}
                          readOnly={true}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className={
                        requiredObj.InvoiceDate === true
                          ? "formBox error"
                          : "formBox"
                      }
                    >
                      <img src={calenderIcon} className="calIcon" alt="" />
                      <label htmlFor="">
                        <Text content="Sales Return Date" />
                        <span className="required">*</span>
                      </label>
                      <DatePicker
                        selected={createObj && createObj.InvoiceDate}
                        onChange={
                          val === "add"
                            ? (date) =>
                                setCreateObj({
                                  ...createObj,
                                  InvoiceDate: date,
                                })
                            : () => {
                                return false;
                              }
                        }
                        minDate={createObj && createObj.InvoiceDate}
                        // onChangeRaw={(e) => disableType(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col autoComp">
                    <div
                      className={
                        requiredObj.vendorName === true
                          ? "formBox error"
                          : "formBox"
                      }
                    >
                      <label htmlFor="">
                        <Text content="Vendor Name" />
                        <span className="required">*</span>
                      </label>
                      {val === "add" && dropdown !== "name" ? (
                        <Autocomplete
                          open={dropDownOption === "VendorName" ? true : false}
                          options={createObj.vendorList}
                          onChange={(e, value) => getVendor(value)}
                          getOptionLabel={(option) => option.PartyName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("VendorName")}
                              onBlur={() => {
                                setCodeFocus("");
                                setDropDownOption("");
                              }}
                            />
                          )}
                        />
                      ) : (
                        <input
                          name="vendorName"
                          type="text"
                          readOnly={true}
                          value={createObj && createObj.vendorName}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div className="col autoComp"> */}
                  {/* <div
                      className={
                        requiredObj.vendorCode === true
                          ? "formBox error"
                          : "formBox"
                      }
                    >
                      <label htmlFor="">
                        Vendor Code<span className="required">*</span>
                      </label>
                      {val === "add" && dropdown !== "code" ? (
                        <Autocomplete
                          open={dropDownOption === "VendorCode" ? true : false}
                          options={createObj.vendorList}
                          onChange={(e, value) => getVendor(value)}
                          getOptionLabel={(option) => option.PartyCode}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("VendorCode")}
                              onBlur={() => {
                                setCodeFocus("");
                                setDropDownOption("");
                              }}
                            />
                          )}
                        />
                      ) : (
                        <input
                          name="vendorCode"
                          type="text"
                          readOnly={true}
                          value={createObj && createObj.vendorCode}
                        />
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="col w35"></div>
            </div>
          </div>
          <div className="row">
            <div className="col mt-2 mb-2">
              <div className="tableBox">
                <CustomTable
                  coulmn={coulmn}
                  data={createObj.items}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={createObj.itemList}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  itemAdd={addbtn === true ? () => addItem() : false}
                  refreshTable={refreshtbl}
                  editbtnText="Add Item detail"
                />
              </div>
            </div>
          </div>
          <div className="row">
            {/* <div className="col">
              <BillingInfo
                BillingObj={createObj}
                onchange={(e) => onchange(e)}
                requiredObj={requiredObj}
                val={val}
              />
            </div> */}
            <div className="col">
              <TaxInfo taxObject={createObj.taxpage} />
            </div>
          </div>
          <div className="box blueBg mt-2">
            <div className="row">
              <div className="col w25 mr-auto">
                <div className="formBox">
                  {/* <label htmlFor="">Invoice By</label>
                  <input
                    type="text"
                    name="CreatedBy"
                    onChange={(e) => onchange(e)}
                    className="bgWhite"
                  /> */}
                </div>
              </div>
              <div className="col w25">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Total" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj.taxpage.netamount}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col w100">
              <div className="RemarkForm mt-2 mb-2">
                <label htmlFor="">
                  <Text content="Remark" />
                </label>
                <textarea
                  name="remark"
                  value={createObj.remark}
                  onChange={(e) => onchange(e)}
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
            </div>
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
export default SalesReturnManual;
