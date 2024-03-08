import "./../purchaseInvoice/index.scss";
import React, { useState, useEffect, useCallback } from "react";
import CommonFormAction from "../../common/commonFormAction";
import CustomTable from "../../common/table";
import coulmn from "./../purchaseInvoice/tableColumn";
import BillingInfo from "./../purchaseInvoice/BillingInfo";
import TaxInfo from "./../purchaseInvoice/TaxInfo";
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
  getUnitName,
  itemAltqty,
} from "../../common/commonFunction";

import {
  getTaxesByItemObj,
  getPercentCalc,
  getAndSetTaxOrAmount,
  fixedToLength,
} from "./../purchaseInvoice/commonfunction";

const DebitNoteMaster = ({ pageNav }) => {
  const Obj = {
    InvoiceNo: "",
    InvoiceDate: "",
    PartyId: "",
    vendorCode: "",
    vendorName: "",
    LedgerType: "",
    invoicetype: 4,
    salesInvoiceNo: "",
    IsPurchaseInvoice: false,
    vendorList: [],
    invoiceList: [],
    slPrList: [],
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
    CreatedBy: localStorage.getItem("UserId"),
    CreatedByName: localStorage.getItem("fname"),
    remark: "",
    dncn_against_pi: "",
    referencetype: "",
    referenceid: "",
    itemList: [],
    items: [],
    stateList: [],
  };
  const itemObj = {
    InvoiceId: "",
    ItemId: "",
    ItemName: "",
    unit: "",
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
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [updatetaxstatewise, setUpdatetaxstatewise] = useState(false);
  const [dropdownsts, setDropdownsts] = useState(true);
  const [sabtabVal,setSabtabVal]=useState('billingInfo');
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
    refreshtable();
    setDropdownsts(true);
  };
  const handleChecked = async (e) => {
    let { name, checked } = e.target;
    const invoices =
      checked === true
        ? await db.PurchaseInvoice.where("PartyId")
            .equals(createObj.PartyId)
            .toArray()
            .then()
            .catch((err) => console.log(err))
        : await db.salesInvoice
            .where("partyid")
            .equals(createObj.PartyId)
            .toArray()
            .then()
            .catch((err) => console.log(err));
    const newInoviceList =
      createObj.IsPurchaseInvoice === true
        ? invoices.filter((a) => a.invoicetype === 0 || a.invoicetype === 1)
        : invoices;
    const itemlist = await db.itemMaster
      .toArray()
      .then()
      .catch((arr) => console.log(arr));
    setCreateObj({
      ...createObj,
      [name]: checked,
      slPrList: newInoviceList,
      salesInvoiceNo: "",
      taxpage: Obj.taxpage,
      items: [],
      itemList: itemlist,
    });
    refreshtable();
    setAddbtn(true);
  };
  const onchange = (e) => {
    if (e.target.name === "billingstateid") {
      if (createObj.billingstateid !== e.target.value) {
        setUpdatetaxstatewise(true);
        setTimeout(() => {
          setUpdatetaxstatewise(false);
        }, 1000);
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
      }
    } else if (e.target.name === "shippingstateid") {
      if (createObj.shippingstateid !== e.target.value) {
        setUpdatetaxstatewise(true);
        setTimeout(() => {
          setUpdatetaxstatewise(false);
        }, 1000);
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
      }
    } else {
      setCreateObj({ ...createObj, [e.target.name]: e.target.value });
      if (e.target.value === "") {
        setRequiredObj({ ...requiredObj, [e.target.name]: "" });
      } else {
        setRequiredObj({ ...requiredObj, [e.target.name]: false });
      }
    }
    // console.log("ddd");
  };
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.PurchaseInvoice.where("invoicetype")
          .equals(4)
          .toArray();
        let srCount = count.filter((a) => a.seriesid === 0);
        let val = { series: "", sCount: 0, digit: 5, dbcount: srCount };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        addEvent(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.PurchaseInvoice.where("invoicetype")
        .equals(4)
        .toArray();
      let srCount = count.filter(
        (a) => a.seriesid === (series.seriesId === "" ? 0 : series.seriesId)
      );
      let val = { ...series, digit: 5, dbcount: srCount };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count = await db.PurchaseInvoice.where("invoicetype")
        .equals(4)
        .toArray();
      let srCount = count.filter(
        (a) => a.seriesid === (series.seriesId === "" ? 0 : series.seriesId)
      );
      let val = { ...series, dbcount: srCount };
      let sr = await getseriesNo(val, pageNav.formid);
      addEvent(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  /****
   * add click event
   */
  const addEvent = async (invoiceNo) => {
    const res = await db.customerMaster
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const vendorlist =
      res && res.sort((a, b) => a.PartyName.localeCompare(b.PartyName));
    const itemlist = await db.itemMaster
      .toArray()
      .then()
      .catch((arr) => console.log(arr));
    const StateList = await GetStateList();
    setCreateObj({
      ...createObj,
      InvoiceNo: invoiceNo,
      InvoiceDate: new Date(),
      vendorList: vendorlist,
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
  const subtab=(tab)=>{
    setSabtabVal(tab)
    }
  /***
   * get vendor
   */
  const getVendor = async (value) => {
    if (value) {
      const invoiceList =
        createObj.IsPurchaseInvoice === true
          ? await db.PurchaseInvoice.where("PartyId")
              .equals(value.Id)
              .toArray()
              .then()
              .catch((err) => console.log(err))
          : await db.salesInvoice
              .where("partyid")
              .equals(value.Id)
              .toArray()
              .then()
              .catch((err) => console.log(err));
      const newInoviceList =
        createObj.IsPurchaseInvoice === true
          ? invoiceList.filter(
              (a) => a.invoicetype === 0 || a.invoicetype === 1
            )
          : invoiceList;
      setCreateObj({
        ...createObj,
        PartyId: value.Id,
        vendorCode: value.PartyCode,
        vendorName: value.PartyName,
        LedgerType: value.LedgerType,
        slPrList: newInoviceList,
      });

      setRequiredObj({ ...requiredObj, vendorName: false, vendorCode: false });
      setCodeFocus("");
      setDropDownOption("");
      //setDropdown("vander");
      setDropdownsts(false);
    }
    // setCodeFocus("");
    // setDropDownOption("");
  };
  const vendorOnchange = (e) => {
    if (e.target.value === "") {
      setDropdownsts(true);
      setCreateObj({ ...createObj, vendorCode: "", vendorName: "" });
    } else {
      setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    }
  };
  const getslPrid = async (id) => {
    if (id) {
      const getId = id.Id === 0 || id.Id === "" ? id.id : id.Id;
      const list =
        createObj.IsPurchaseInvoice === true
          ? await db.PurchaseInvoiceDetail.where("InvoiceId")
              .equals(getId)
              .toArray()
              .then()
              .catch((err) => console.log(err))
          : await db.saleInvoiceDetail
              .where("invoiceid")
              .equals(getId)
              .toArray()
              .then()
              .catch((err) => console.log(err));
      const itemArr = [];
      for (let listitem of list) {
        const getItem = await db.itemMaster
          .where("Id")
          .equals(
            createObj.IsPurchaseInvoice === true
              ? listitem.ItemId
              : listitem.itemid
          )
          .first()
          .then()
          .catch((err) => console.log(err));
        if (getItem) {
          itemArr.push(getItem);
        }
      }

      setCreateObj({
        ...createObj,
        salesInvoiceNo:
          createObj.IsPurchaseInvoice === false ? id.invoiceno : id.InvoiceNo,
        referenceid: id.Id,
        itemList: itemArr,
      });
    }

    setCodeFocus("");
    setDropDownOption("");
  };
  const selectedRow = (item) => {
    setSelectedTblRow(item);
    if (edit) {
      if (selectedTblRow) {
        const array = createObj.items.map((a) => {
          return a.id !== undefined
            ? a.id === selectedTblRow.id
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
  const refreshtable = () => {
    setRefreshtbl(true);
    setTimeout(() => setRefreshtbl(false), 500);
  };
  const removeItem = () => {
    const res = createObj.items.filter((a) =>
      a.id !== undefined
        ? a.id !== selectedTblRow.id
        : a.staticid !== selectedTblRow.staticid
    );
    if (res) {
      const nArray = res.map((a, index) => {
        if (a.id === undefined) {
          return { ...a, staticid: index + 1 };
        } else {
          return a;
        }
      });
      setCreateObj({ ...createObj, items: nArray });
    }
  };
  const tableInputOnchange = (e) => {
    setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    return e.target.value;
  };
  const tblOptionGet = async (option) => {
    if (createObj.items.length > 0) {
      const x = createObj.items.find((a) => a.ItemId === option.ItemId);
      if (x) {
        alert("you have already select this item");
        return false;
      } else {
        const res = await getTaxesByItemObj(option);
        if (option) {
          let hsnid = option.GSTClassification[0].HsnId;
          let unitName = await getUnitName(option.ItemId);
          setUpdatedObj({
            ...updatedObj,
            ItemName: option.ItemName,
            ItemId: option.ItemId,
            igstrate: res.igstRate,
            cgstrate: res.cgstRate,
            sgstrate: res.sgstRate,
            hsnid: hsnid,
            unitId: option.UnitName,
            unit: unitName,
          });
        }
      }
    } else {
      const res = await getTaxesByItemObj(option);
      if (option) {
        let hsnid = option.GSTClassification[0].HsnId;
        let unitName = await getUnitName(option.ItemId);
        setUpdatedObj({
          ...updatedObj,
          ItemName: option.ItemName,
          ItemId: option.ItemId,
          igstrate: res.igstRate,
          cgstrate: res.cgstRate,
          sgstrate: res.sgstRate,
          hsnid: hsnid,
          unitId: option.UnitName,
          unit: unitName,
        });
      }
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
      let itemAltQty = await itemAltqty(selectedTblRow.ItemId, qty);
      let newUpdateObj = {
        ...updatedObj,
        ItemName:
          updatedObj.ItemName !== undefined
            ? updatedObj.ItemName
            : selectedTblRow.ItemName !== undefined
            ? selectedTblRow.ItemName
            : "",
        igstamount:
          createObj.billingstateid !== createObj.shippingstateid
            ? fixedToLength(igst)
            : 0,
        cgstamount:
          createObj.billingstateid === createObj.shippingstateid
            ? fixedToLength(cgst)
            : 0,
        sgstamount:
          createObj.billingstateid === createObj.shippingstateid
            ? fixedToLength(sgst)
            : 0,
        Quantity: qty,
        igstrate:
          createObj.billingstateid !== createObj.shippingstateid ? igstRate : 0,
        cgstrate:
          createObj.billingstateid === createObj.shippingstateid ? cgstRate : 0,
        sgstrate:
          createObj.billingstateid === createObj.shippingstateid ? sgstRate : 0,
        Rate: fixedToLength(rate),
        DiscountPer: fixedToLength(disPer),
        Amount: fixedToLength(amount),
        DiscountAmount: fixedToLength(disAmount),
        totalAmount: fixedToLength(totlAmt),
        altqty: itemAltQty,
        finalDiscount: fixedToLength(fnDisc),
        hsnid:
          updatedObj.hsnid !== undefined
            ? updatedObj.hsnid
            : selectedTblRow.hsnid !== undefined
            ? selectedTblRow.hsnid
            : "",
      };
      const array = createObj.items.map((a) => {
        if (a.id === undefined) {
          return a.staticid === selectedTblRow.staticid
            ? { ...a, ...newUpdateObj }
            : a;
        } else {
          return a.id === selectedTblRow.id ? { ...a, ...newUpdateObj } : a;
        }
      });
      let taxpageObj = getAndSetTaxOrAmount(array);
      setCreateObj({ ...createObj, items: array, taxpage: taxpageObj });
      setEdit(false);
      setUpdatedObj();
      // setAddbtn(false);
      refreshtable();
    } else {
      refreshtable();
    }
  }, [selectedTblRow, updatedObj, createObj]);
  const statewiseTax = async (array) => {
    if (array.length > 0) {
      const caluArray = await Promise.all(
        array.map(async (a) => {
          const item = await db.itemMaster
            .where("Id")
            .equals(a.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          const res = await getTaxesByItemObj(item);
          let igst = getPercentCalc(res.igstRate, a.Amount);
          let cgst = getPercentCalc(res.cgstRate, a.Amount);
          let sgst = getPercentCalc(res.sgstRate, a.Amount);
          return {
            ...a,
            igstrate:
              parseInt(createObj.billingstateid) !==
              parseInt(createObj.shippingstateid)
                ? res.igstRate
                : 0,
            cgstrate:
              parseInt(createObj.billingstateid) ===
              parseInt(createObj.shippingstateid)
                ? res.cgstRate
                : 0,
            sgstrate:
              parseInt(createObj.billingstateid) ===
              parseInt(createObj.shippingstateid)
                ? res.sgstRate
                : 0,
            igstamount:
              parseInt(createObj.billingstateid) !==
              parseInt(createObj.shippingstateid)
                ? fixedToLength(igst)
                : 0,
            cgstamount:
              parseInt(createObj.billingstateid) ===
              parseInt(createObj.shippingstateid)
                ? fixedToLength(cgst)
                : 0,
            sgstamount:
              parseInt(createObj.billingstateid) ===
              parseInt(createObj.shippingstateid)
                ? fixedToLength(sgst)
                : 0,
          };
        })
      );
      let taxpageObj = getAndSetTaxOrAmount(caluArray);
      setCreateObj({ ...createObj, items: caluArray, taxpage: taxpageObj });
    }
  };
  useEffect(() => {
    if (createObj.items.length > 0) {
      if (updatetaxstatewise) {
        let arr = createObj.items.filter((a)=> a.ItemId !== "");
        if(arr.length > 0){
          statewiseTax(arr);
        } 
      }
    }
  }, [updatetaxstatewise, createObj.items]);
  const getInvoiceList = async () => {
    let userId = localStorage.getItem("UserId");
    const res1 = await db.PurchaseInvoice.where("invoicetype")
      .equals(4)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const itemlist = await db.itemMaster
      .toArray()
      .then()
      .catch((arr) => console.log(arr));

    const res = res1.filter((f) => f.CreatedBy === userId);

    if (res) {
      setCreateObj({ ...createObj, invoiceList: res, itemList: itemlist });
    }
  };
  const getInvoice = async (value) => {
    if (value) {
      setCodeFocus("");
      setDropDownOption("");
      const StateList = await GetStateList();
      const vendor = await db.customerMaster
        .where("Id")
        .equals(value.PartyId)
        .first()
        .then()
        .catch((err) => console.log(err));
      const vid = value.Id === 0 || value.Id === "" || value.Id === undefined ? value.id : value.Id;
      const items = await db.PurchaseInvoiceDetail.where("InvoiceId")
        .equals(vid)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      let list = [];
      if (items) {
        for (let item of items) {
          let proDetails = await db.itemMaster
            .where("ItemId")
            .equals(item.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          let unitName = await getUnitName(item.UnitId);
          item.ItemName = proDetails === undefined ? "" : proDetails.ItemName;
          item.unit = unitName;
          list.push(item);
        }
      }

      const itemarr = list.map((item) => {
        return {
          ...item,
          InvoiceId: item.InvoiceId,
          ItemId: item.ItemId,
          isaltrate: item.isaltrate,
          Quantity: parseInt(item.Quantity),
          altqty: item.altqty,
          unitId: item.UnitId,
          Rate: fixedToLength(item.Rate),
          totalAmount: fixedToLength(item.Amount),
          Amount: fixedToLength(item.GrossAmount),
          DiscountPer: parseFloat(item.DiscountPer),
          DiscountAmount: fixedToLength(item.DiscountAmount),
          finalDiscount:
            fixedToLength(item.GrossAmount) -
            fixedToLength(item.DiscountAmount),
          hsnid: parseInt(item.hsnclassificationid),
          igstrate: parseFloat(item.igstrate),
          cgstrate: parseFloat(item.cgstrate),
          sgstrate: parseFloat(item.sgstrate),
          igstamount: fixedToLength(item.igstamount),
          cgstamount: fixedToLength(item.cgstamount),
          sgstamount: fixedToLength(item.sgstamount),
        };
      });
      setCreateObj({
        ...createObj,
        id: value.id,
        Id: value.Id,
        new: value.new,
        InvoiceDate: value.InvoiceDate,
        InvoiceNo: value.InvoiceNo,
        PartyId: parseInt(value.PartyId),
        invoicetype: value.invoicetype,
        vendorName: vendor.PartyName,
        vendorCode: vendor.PartyCode,
        billingcountryid: value.billingcountryid,
        billingstateid: parseInt(value.billingstateid),
        billingaddress: value.billingaddress,
        billinggstinno: value.billinggstinno,
        shippingcountryid: value.shippingcountryid,
        shippingstateid: parseInt(value.shippingstateid),
        shippingaddress: value.shippingaddress,
        shippinggstinno: value.shippinggstinno,
        remark: value.remark,
        CreatedBy: value.CreatedBy,
        taxpage: {
          grossamount: value.grossamount,
          discountamount: value.discountamount,
          taxamount: value.taxamount,
          netamount: value.netamount,
          RoundOff: value.roundOff,
          totalAmount: value.totalAmount,
          igstAmount: value.igstAmount,
          cgstAmount: value.cgstAmount,
          sgstAmount: value.sgstAmount,
        },
        stateList: StateList,
        items: itemarr,
      });
      setSeriesandVoucher({
        seriesId: value.seriesid,
        voucherId: value.seriesvouchertype,
      });
      if (val === "view") {
        setAddbtn(false);
      } else {
        setAddbtn(true);
      }
    }
  };
  const countoryId = async (id) => {
    const Coid = await db.stateMaster
      .where("StateId")
      .equals(id)
      .first()
      .then()
      .catch((err) => console.log(err));
    return Coid.CountryId;
  };
  const saveData = async () => {
    const saveObj = {
      InvoiceNo: createObj.InvoiceNo,
      InvoiceDate: createObj.InvoiceDate,
      PartyId: parseInt(createObj.PartyId),
      invoicetype: 4,
      grossamount: fixedToLength(createObj.taxpage.grossamount),
      discountamount: fixedToLength(createObj.taxpage.discountamount),
      taxamount: fixedToLength(createObj.taxpage.taxamount),
      netamount: fixedToLength(createObj.taxpage.netamount),
      RoundOff: createObj.taxpage.roundOff,
      totalAmount: createObj.taxpage.totalAmount,
      igstAmount: createObj.taxpage.igstAmount,
      cgstAmount: createObj.taxpage.cgstAmount,
      sgstAmount: createObj.taxpage.sgstAmount,
      billingcountryid:createObj.billingstateid !== "" ? await countoryId(parseInt(createObj.billingstateid)):"",
      billingstateid: parseInt(createObj.billingstateid),
      billingaddress: createObj.billingaddress,
      billinggstinno: createObj.billinggstinno,
      shippingcountryid:createObj.shippingstateid !== "" ? await countoryId(parseInt(createObj.shippingstateid)):"",
      shippingstateid: parseInt(createObj.shippingstateid),
      shippingaddress: createObj.shippingaddress,
      shippinggstinno: createObj.shippinggstinno,
      remark: createObj.remark,
      dncn_against_pi: createObj.IsPurchaseInvoice,
      referencetype: createObj.referencetype,
      referenceid: createObj.referenceid,
      CreatedBy: localStorage.getItem("UserId"),
      CreatedOn: new Date(),
      seriesid:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      seriesvouchertype:
        seriesandVoucher.voucherId === "" ? "" : seriesandVoucher.voucherId,
    };
    if (!saveEdit) {
      db.PurchaseInvoice.add({ ...saveObj, new: 1, update: 0 })
        .then((update) => {
          if (update) {
            saveItem(update);
          }
        })
        .catch((err) => console.log(err));
    } else {
      let editObj = {
        ...saveObj,
        id: createObj.id,
        update: 1,
        new: createObj.new,
        Id: createObj.Id,
      };

      db.PurchaseInvoice.put(editObj)
        .then((update) => {
          if (update) {
            saveItem(update);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const saveItem = async (id) => {
    // const res = await db.PurchaseInvoice.where('[InvoiceNo+invoicetype]')
    //   .equals(createObj.InvoiceNo,4)
    //   .first()
    //   .then()
    //   .catch((err) => console.log(err));
    const itemArray = createObj.items.map((item) => {
      const saveItemObj = {
        InvoiceId: id,
        ItemId: item.ItemId,
        isaltrate: item.isaltrate,
        Quantity: parseInt(item.Quantity),
        altqty: item.altqty,
        UnitId: item.unitId,
        Rate: fixedToLength(item.Rate),
        Amount: fixedToLength(item.totalAmount),
        GrossAmount: fixedToLength(item.Amount),
        DiscountPer: parseFloat(item.DiscountPer),
        DiscountAmount: fixedToLength(item.DiscountAmount),
        hsnclassificationid: parseInt(item.hsnid),
        igstrate: parseFloat(item.igstrate),
        cgstrate: parseFloat(item.cgstrate),
        sgstrate: parseFloat(item.sgstrate),
        igstamount: fixedToLength(item.igstamount),
        cgstamount: fixedToLength(item.cgstamount),
        sgstamount: fixedToLength(item.sgstamount),
        icdetailid: "",
        icmId: "",
      };
      if (saveEdit) {
        saveItemObj.id = item.id;
        saveItemObj.InvoiceId = item.InvoiceId;
        return saveItemObj;
      } else {
        return saveItemObj;
      }
    });
    if (itemArray) {
      if (!saveEdit) {
        db.PurchaseInvoiceDetail.bulkAdd(itemArray)
          .then((update) => {
            if (update) {
              alert("data save successfully");
              refresh();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      } else {
        db.PurchaseInvoiceDetail.bulkPut(itemArray)
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
        className="purchaseInvoice"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="purchaseInvoiceIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col w100">
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
                        <Text content="Debit No" />
                        <span className="required">*</span>
                      </label>
                      {val === "edit" || val === "view" ? (
                        <Autocomplete
                          open={dropDownOption === "InvoiceNo" ? true : false}
                          options={createObj.invoiceList}
                          onChange={(e, value) => getInvoice(value)}
                          getOptionLabel={(option) =>
                            option.InvoiceNo.toString()
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("InvoiceNo")}
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
                          value={createObj.InvoiceNo}
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
                        <Text content="Debit Date" />
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
                  <div className="col"></div>
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
                        <Text content="Vendor/customer Name" />
                        <span className="required">*</span>
                      </label>
                      {val === "add" ? (
                        dropdownsts === true ? (
                          <Autocomplete
                            open={
                              dropDownOption === "VendorName" ? true : false
                            }
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
                            readOnly={val === "view" ? true : false}
                            onChange={(e) => vendorOnchange(e)}
                            value={createObj && createObj.vendorName}
                          />
                        )
                      ) : (
                        <input
                          name="vendorName"
                          type="text"
                          readOnly={val === "view" ? true : false}
                          onChange={(e) => vendorOnchange(e)}
                          value={createObj && createObj.vendorName}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col autoComp">
                    <div
                      className={
                        requiredObj.vendorCode === true
                          ? "formBox error"
                          : "formBox"
                      }
                    >
                      <label htmlFor="">
                        <Text content="Vendor/customer Code" />
                        <span className="required">*</span>
                      </label>
                      {val === "add" ? (
                        dropdownsts === true ? (
                          <Autocomplete
                            open={
                              dropDownOption === "VendorCode" ? true : false
                            }
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
                            readOnly={val === "view" ? true : false}
                            onChange={(e) => vendorOnchange(e)}
                            value={createObj && createObj.vendorCode}
                          />
                        )
                      ) : (
                        <input
                          name="vendorCode"
                          type="text"
                          readOnly={val === "view" ? true : false}
                          onChange={(e) => vendorOnchange(e)}
                          value={createObj && createObj.vendorCode}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col"></div>
                </div>
                <div className="row">
                  <div className="col autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Type" />
                      </label>
                      <select
                        name="referencetype"
                        value={createObj.referencetype}
                        disabled={
                          val === "add" || val === "edit" ? "" : "disabled"
                        }
                        onChange={(e) => {
                          setCreateObj({
                            ...createObj,
                            referencetype: e.target.value,
                          });
                        }}
                      >
                        <option value="1">Qty Diffrence</option>
                        <option value="2">Rate Diffrence</option>
                      </select>
                    </div>
                  </div>
                  <div className="col autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        {createObj.IsPurchaseInvoice === false
                          ? "Sales Invoice No."
                          : "Purchase Invoice No."}
                      </label>
                      {val === "add" || val === "edit" ? (
                        createObj.salesInvoiceNo === "" ? (
                          <Autocomplete
                            open={dropDownOption === "slPrList" ? true : false}
                            options={createObj.slPrList}
                            onChange={(e, value) => getslPrid(value)}
                            getOptionLabel={(option) =>
                              createObj.IsPurchaseInvoice === false
                                ? option.invoiceno.toString()
                                : option.InvoiceNo.toString()
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Press ctrl + L"
                                onFocus={() => setCodeFocus("slPrList")}
                                onBlur={() => {
                                  setCodeFocus("");
                                  setDropDownOption("");
                                }}
                              />
                            )}
                          />
                        ) : (
                          <input
                            value={createObj && createObj.salesInvoiceNo}
                            name="salesInvoiceNo"
                            readOnly={true}
                          />
                        )
                      ) : (
                        <input
                          value={createObj && createObj.salesInvoiceNo}
                          name="salesInvoiceNo"
                          readOnly={true}
                        />
                      )}
                      {/* <input
                        onChange={(e) => onchange(e)}
                        name="salesInvoiceNo"
                        value={createObj && createObj.salesInvoiceNo}
                        readOnly={
                          val === "add" || val === "edit" ? false : true
                        }
                        data-valid="varChar"
                      /> */}
                    </div>
                  </div>
                  <div
                    className="col"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div className="checkboxNew">
                      <input
                        type="checkbox"
                        disabled={
                          val === "add" || val === "edit" ? false : true
                        }
                        id="drNoteIspurchase"
                        name="IsPurchaseInvoice"
                        checked={createObj && createObj.IsPurchaseInvoice}
                        onClick={(e) => handleChecked(e)}
                        value={createObj.IsPurchaseInvoice}
                      />

                      <label htmlFor="drNoteIspurchase">
                        <Text content="IsPurchaseInvoice" />
                      </label>
                    </div>
                  </div>
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
          <div className="subtabview">
            <ul style={{marginTop:"0px"}}>
              <li className={sabtabVal === "billingInfo" ? "active":""} onClick={(e)=>subtab('billingInfo')}>Billing Info</li>
              <li className={sabtabVal === "taxInfo" ? "active":""} onClick={(e)=>subtab('taxInfo')}>Tax Amount</li>
            </ul>
          </div>
          <div className="tabBox withsubtab">
            <div className="box" style={{display:sabtabVal === "billingInfo" ? "block":"none"}}>
            <BillingInfo
                BillingObj={createObj}
                onchange={(e) => onchange(e)}
                requiredObj={requiredObj}
                val={val}
              />
            </div>
            <div className="box" style={{display:sabtabVal === "taxInfo" ? "block":"none"}}>
            <TaxInfo taxObject={createObj.taxpage} />
            </div>
          </div>
          {/* <div className="row">
            <div className="col">
              <BillingInfo
                BillingObj={createObj}
                onchange={(e) => onchange(e)}
                requiredObj={requiredObj}
                val={val}
              />
            </div>
            <div className="col">
              <TaxInfo taxObject={createObj.taxpage} />
            </div>
          </div> */}
          <div className="box blueBg" style={{float:"left",width:"100%"}}>
            <div className="row">
              <div className="col w25 mr-auto">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Invoice By" />
                  </label>
                  <input
                    type="text"
                    name="CreatedByName"
                    //onChange={(e) => onchange(e)}
                    className="bgWhite"
                    value={createObj.CreatedByName}
                    readOnly={true}
                  />
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
              <div className="RemarkForm mt-1 mb-2">
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
export default DebitNoteMaster;
