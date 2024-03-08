import "./index.scss";
import React, { useState, useEffect, useCallback } from "react";
import CommonFormAction from "../../common/commonFormAction";
import CustomTable from "../../common/table";
import coulmn from "./tblCoulmn";
import InwardCoulmn from "./inwardCoulmn";
import InwdCoulmn from "./inwItemCoulmn";
import BillingInfo from "../purchaseInvoice/BillingInfo";
import TaxInfo from "../purchaseInvoice/TaxInfo";
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
  fnCRoundOff,
  updateStockIndDb,
  updateStockIndDbUpdate,
} from "../../common/commonFunction";
import {
  getTaxesByItemObj,
  getPercentCalc,
  formatDate,
  fixedToLength,
  fixedToLengthalt,
} from "../purchaseInvoice/commonfunction";

const PurchaseInwardGit = ({ pageNav }) => {
  const Obj = {
    InvoiceNo: "",
    InvoiceDate: "",
    PartyId: "",
    vendorCode: "",
    vendorName: "",
    invoicetype: 1,
    vendorList: [],
    invoiceList: [],
    inwardList: [],
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
    itemList: [],
    items: [],
    itemlistbyvendor: [],
    viewItems: [],
    stateList: [],
  };
  const itemObj = {
    InvoiceId: "",
    ItemId: "",
    ItemName: "",
    unit: "NOS",
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
  const [sabtabVal,setSabtabVal]=useState('billingInfo');
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [checkedItem, setCheckedItem] = useState();
  const [open, setOpen] = useState(false);
  const [viewopen, setViewopen] = useState(false);
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [saveEdit, setSaveEdit] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedObj, setUpdatedObj] = useState();
  const [addbtn, setAddbtn] = useState(false);
  const [updatetaxstatewise, setUpdatetaxstatewise] = useState(false);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
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
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.PurchaseInvoice.where("invoicetype")
          .equals(0)
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
        .equals(0)
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
        .equals(0)
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
  const subtab=(tab)=>{
    setSabtabVal(tab)
    }
  const change_state = (arg) => {
    switch (arg) {
      case "add": {
        setVal(arg);
        getoucherList();
        setSaveEdit(false);
        setEditcoulmn(true);
        return;
      }
      case "edit": {
        setVal(arg);
        getInvoiceList();
        setSaveEdit(true);
        setEditcoulmn(true);

        return;
      }
      case "view": {
        setVal(arg);
        getInvoiceList();
        setSaveEdit(false);
        setEditcoulmn(false);
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
    setCheckedItem([]);
    setSelectedItems([]);
    refreshtable();
  };
  const onchange = (e) => {
    // console.log("ddd")setUpdatetaxstatewise;
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
  };
  const statewiseTax = async (array) => {
    const newItemObjList = await calcItem(array, "update");
    const taxpageObj = getAndSetTaxOrAmount(newItemObjList);
    setSelectedItems(newItemObjList);
    setCreateObj({ ...createObj, taxpage: taxpageObj });
  };
  useEffect(() => {
    if (selectedItems.length > 0) {
      if (updatetaxstatewise) {
        statewiseTax(selectedItems);
      }
    }
  }, [updatetaxstatewise, selectedItems]);
  /****
   * add click event
   */
  const addEvent = async (invoiceNo) => {
    //const invoiceNo = Math.floor(100000000 + Math.random() * 900000000);
    const res = await db.IC_Master.toArray()
      .then()
      .catch((err) => console.log(err));
    const arr = await Promise.all(
      res.map(async (a) => {
        const vendor = await db.customerMaster
          .where("Id")
          .equals(a.PartyId)
          .first()
          .then()
          .catch((err) => console.log(err));
        return {
          PartyId: a.PartyId,
          vendorCode: vendor.PartyCode,
          vendorName: vendor.PartyName,
        };
      })
    );
    const vList = arr.filter(
      (e, i) => arr.findIndex((obj) => obj.vendorName === e.vendorName) === i
    );
    const StateList = await GetStateList();
    setCreateObj({
      ...createObj,
      InvoiceNo: invoiceNo,
      InvoiceDate: new Date(),
      stateList: StateList,
      vendorList: vList.sort((a, b) => a.PartyName.localeCompare(b.PartyName)),
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
  const getVendor = async (value) => {
    if (value) {
      const a = codeFocus === "VendorName" ? "code" : "name";
      const icList = await getInwardlist(value.PartyId);
      const icitem = await ObjItem(icList);
      setCreateObj({
        ...createObj,
        PartyId: value.PartyId,
        vendorCode: value.vendorCode,
        vendorName: value.vendorName,
        inwardList: icList,
        itemlistbyvendor: icitem,
      });
      setRequiredObj({ ...requiredObj, vendorName: false, vendorCode: false });
      setCodeFocus("");
      setDropDownOption("");
      setDropdown(a);
    }
  };
  const getInwardlist = async (id) => {
    const res = await db.IC_Master.where("PartyId")
      .equals(id)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const arr = res.map((a) => {
      return {
        ...a,
        inwarddateDMY: formatDate(a.InwardDate),
        ItemId: a.id,
        id: a.id,
      };
    });
    return arr;
  };
  const selectedRow = (item) => {
    setRefreshtbl(false);
    setSelectedTblRow(item);
    if (edit) {
      if (selectedTblRow) {
        const array = selectedItems.map((a) => {
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

  const tableInputOnchange = (e) => {
    setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    return e.target.value;
  };
  const tblOptionGet = async (option) => {
    const res = await getTaxesByItemObj(option);
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

  const updateAction = useCallback(async () => {
    if (updatedObj !== undefined) {
      const array = selectedItems.map((a) => {
        return a.id === selectedTblRow.id ? { ...a, ...updatedObj } : a;
      });
      const newItemObjList = await calcItem(array, "update");
      const taxpageObj = getAndSetTaxOrAmount(newItemObjList);
      setSelectedItems(newItemObjList);
      setCreateObj({ ...createObj, taxpage: taxpageObj });
      setEdit(false);
      setUpdatedObj();
      setAddbtn(false);
      refreshtable();
    } else {
      refreshtable();
    }
  }, [selectedTblRow, updatedObj, createObj]);
  const refreshtable = () => {
    setRefreshtbl(true);
    setTimeout(() => setRefreshtbl(false), 500);
  };

  const getInvoiceList = async () => {
    let userId = localStorage.getItem("UserId");
    const res1 = await db.PurchaseInvoice.where("invoicetype")
      .equals(0)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    // const itemlist = await db.itemMaster
    //   .toArray()
    //   .then()
    //   .catch((arr) => console.log(arr));
    const res = res1.filter((f) => f.CreatedBy === userId);

    if (res) {
      setCreateObj({ ...createObj, invoiceList: res });
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
      const items = await db.PurchaseInvoiceDetail.where("InvoiceId")
        .equals(value.id)
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
        let penqty = await getPendingQty(item.icdetailid);
        let totqty = await db.IC_Detail.where("id")
          .equals(item.icdetailid)
          .first()
          .then()
          .catch((err) => console.log(err));
        let x =
          parseInt(totqty.ReceiveBaseQty) +
          parseInt(item.Quantity) -
          parseInt(penqty);
        item.pinwardQuantity = x;
        item.pinwardaltqty = await itemAltqty(item.ItemId, x);
        item.unit = await getUnitName(item.UnitId);
        list.push(item);
      }

      let taxpageTotaligst = 0;
      let taxpageTotalcgst = 0;
      let taxpageTotalsgst = 0;
      let taxpageTotalAmount = 0;
      const itemarr = list.map((item) => {
        let tot =
          parseFloat(item.GrossAmount) - parseFloat(item.DiscountAmount);
        taxpageTotaligst =
          parseFloat(taxpageTotaligst) + parseFloat(item.igstamount);
        taxpageTotalcgst =
          parseFloat(taxpageTotalcgst) + parseFloat(item.cgstamount);
        taxpageTotalsgst =
          parseFloat(taxpageTotalsgst) + parseFloat(item.sgstamount);
        taxpageTotalAmount = parseFloat(taxpageTotalAmount) + parseFloat(tot);
        return {
          ...item,
          totalAmount: fixedToLength(item.Amount),
          finalDiscount: fixedToLength(tot),
          Rate: fixedToLength(item.Rate),
          DiscountAmount: fixedToLength(item.DiscountAmount),
          igstamount: fixedToLength(item.igstamount),
          cgstamount: fixedToLength(item.cgstamount),
          sgstamount: fixedToLength(item.sgstamount),
          Amount: fixedToLength(item.GrossAmount),
        };
      });
      let txPageObj = {
        ...createObj.taxpage,
        grossamount: fixedToLength(value.grossamount),
        discountamount: fixedToLength(value.discountamount),
        taxamount: fixedToLength(value.taxamount),
        netamount: fixedToLength(value.netamount),
        igstAmount: fixedToLength(taxpageTotaligst),
        cgstAmount: fixedToLength(taxpageTotalcgst),
        sgstAmount: fixedToLength(taxpageTotalsgst),
        totalAmount: fixedToLength(taxpageTotalAmount),
        roundOff: fixedToLength(fnCRoundOff(taxpageTotalAmount)),
      };
      setCreateObj({
        ...createObj,
        id: value.id,
        new: value.new,
        vendorName: vendor.PartyName,
        vendorCode: vendor.PartyCode,
        InvoiceNo: value.InvoiceNo,
        InvoiceDate: value.InvoiceDate,
        PartyId: value.PartyId,
        invoicetype: value.invoicetype,
        billingcountryid: value.billingcountryid,
        billingstateid: value.billingstateid,
        billingaddress: value.billingaddress,
        billinggstinno: value.billinggstinno,
        shippingcountryid: value.shippingcountryid,
        shippingstateid: value.shippingstateid,
        shippingaddress: value.shippingaddress,
        shippinggstinno: value.shippinggstinno,
        remark: value.remark,
        stateList: StateList,
        taxpage: { ...txPageObj },
      });
      setSeriesandVoucher({
        seriesId: value.seriesid,
        voucherId: value.seriesvouchertype,
      });
      setSelectedItems(itemarr);
    }
  };
  const saveData = async () => {
    const saveObj = {
      InvoiceNo: createObj.InvoiceNo,
      InvoiceDate: createObj.InvoiceDate,
      PartyId: parseInt(createObj.PartyId),
      invoicetype: 0,
      grossamount: fixedToLength(createObj.taxpage.grossamount),
      discountamount: fixedToLength(createObj.taxpage.discountamount),
      taxamount: fixedToLength(createObj.taxpage.taxamount),
      netamount: fixedToLength(createObj.taxpage.netamount),
      RoundOff: createObj.taxpage.roundOff,
      totalAmount: createObj.taxpage.totalAmount,
      igstAmount: createObj.taxpage.igstAmount,
      cgstAmount: createObj.taxpage.cgstAmount,
      sgstAmount: createObj.taxpage.sgstAmount,
      billingcountryid: await countoryId(parseInt(createObj.billingstateid)),
      billingstateid: parseInt(createObj.billingstateid),
      billingaddress: createObj.billingaddress,
      billinggstinno: createObj.billinggstinno,
      shippingcountryid: await countoryId(parseInt(createObj.shippingstateid)),
      shippingstateid: parseInt(createObj.shippingstateid),
      shippingaddress: createObj.shippingaddress,
      shippinggstinno: createObj.shippinggstinno,
      remark: createObj.remark,
      CreatedOn: new Date(),
      CreatedBy: localStorage.getItem("UserId"),
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
        new: createObj.new,
        update: 1,
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
  const countoryId = async (id) => {
    if(id){
      const Coid = await db.stateMaster
      .where("StateId")
      .equals(id)
      .first()
      .then()
      .catch((err) => console.log(err));
    return Coid.CountryId;
    }else{
      return "";
    }  
  };
  const saveItem = async (id) => {
    // const res = await db.PurchaseInvoice.where('[InvoiceNo+invoicetype]')
    //   .equals(createObj.InvoiceNo,0)
    //   .first()
    //   .then()
    //   .catch((err) => console.log(err));
    const itemArray = selectedItems.map((item) => {
      const saveItemObj = {
        InvoiceId: id,
        ItemId: item.ItemId,
        isaltrate: item.isaltrate,
        Quantity: parseInt(item.Quantity),
        altqty: item.altqty,
        UnitId: item.UnitId,
        pinwardQuantity: item.pinwardQuantity,
        pinwardaltqty: item.pinwardaltqty,
        Rate: fixedToLength(item.Rate),
        Amount: fixedToLength(item.totalAmount),
        GrossAmount: fixedToLength(item.Amount),
        DiscountPer: parseFloat(item.DiscountPer),
        DiscountAmount: fixedToLength(item.DiscountAmount),
        hsnclassificationid: parseInt(item.hsnclassificationid),
        igstrate: parseFloat(item.igstrate),
        cgstrate: parseFloat(item.cgstrate),
        sgstrate: parseFloat(item.sgstrate),
        igstamount: fixedToLength(item.igstamount),
        cgstamount: fixedToLength(item.cgstamount),
        sgstamount: fixedToLength(item.sgstamount),
        icdetailid: item.icdetailid,
        icmId: item.icmId,
      };
      if (saveEdit) {
        saveItemObj.id = item.id;
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
              const x = itemArray.map((c) => {
                const nObj = {
                  formId: pageNav.formid,
                  trId: id,
                  ItemId: c.ItemId,
                  qty: c.Quantity,
                  type: "inqty",
                };
                return nObj;
              });

              updateStockIndDb(x);
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
              const x = itemArray.map((c) => {
                const nObj = {
                  formId: pageNav.formid,
                  trId: id,
                  ItemId: c.ItemId,
                  qty: c.Quantity,
                  type: "inqty",
                };
                return nObj;
              });

              updateStockIndDbUpdate(x);
              refresh();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };
  const getCheckedRows = (res) => {
    setGetcheckedRows(res);
  };
  /**
   * open Item popup
   */
  const openInwardChallan = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  /**
   *close Item popup
   */
  const handleClose = (n) => {
    if (n === "inwitem") {
      setViewopen(false);
    } else {
      setOpen(false);
    }
  };
  /**
   * create item Object with add fields
   */
  const ObjItem = async (GetitemObj) => {
    const itemFrminward = await Promise.all(
      GetitemObj.map(async (a) => {
        let id = a.Id === 0 || a.Id === "" ? a.id : a.Id;
        const item = await db.IC_Detail.where("InwardId")
          .equals(id)
          .toArray()
          .then()
          .catch((err) => console.log(err));
        return item;
      })
    );
    if (itemFrminward) {
      let fnArray = [];
      itemFrminward.map((a) => {
        fnArray.push(...a);
        return a;
      });
      const newItemObjList = await calcItem(fnArray, "new");
      const objtaxes = getAndSetTaxOrAmount(newItemObjList);
      setCreateObj({ ...createObj, taxpage: { ...objtaxes } });
      return newItemObjList;
    }
  };
  const calcItem = async (fnArray, type) => {
    let newItemObjList = await Promise.all(
      fnArray.map(async (n) => {
        let res = await db.itemMaster
          .where("ItemId")
          .equals(n.ItemId)
          .first()
          .then()
          .catch((err) => console.log(err));
        let getpendqty = await getPendingQty(n.id);
        let penQty =
          type === "new"
            ? parseInt(
                type === "new"
                  ? n.ReceiveBaseQty
                  : type === "update"
                  ? n.pinwardQuantity
                  : 0
              ) - parseInt(getpendqty)
            : parseInt(
                type === "new"
                  ? n.ReceiveBaseQty
                  : type === "update"
                  ? n.pinwardQuantity
                  : 0
              );
        let getpenAltqty = await itemAltqty(n.ItemId, penQty);
        let invoiceQty = parseInt(
          type === "new" ? n.ReceiveBaseQty : type === "update" ? n.Quantity : 0
        );
        let invoiceAltQty = await itemAltqty(n.ItemId, invoiceQty);
        let grosAmt = parseInt(invoiceQty) * parseFloat(n.Rate);
        let taxes = await getTaxesByItemObj(res);
        let disc = getPercentCalc(
          type === "new"
            ? n.DiscountPercentage
            : type === "update"
            ? n.DiscountPer
            : 0,
          grosAmt
        );
        let fnlDisc = parseFloat(grosAmt) - parseFloat(disc);
        let igst =
          createObj.shippingstateid !== createObj.billingstateid
            ? getPercentCalc(taxes.igstRate, fnlDisc)
            : 0;
        let cgst =
          createObj.shippingstateid === createObj.billingstateid
            ? getPercentCalc(taxes.cgstRate, fnlDisc)
            : 0;
        let sgst =
          createObj.shippingstateid === createObj.billingstateid
            ? getPercentCalc(taxes.sgstRate, fnlDisc)
            : 0;
        let totAmt =
          parseFloat(igst) +
          parseFloat(cgst) +
          parseFloat(sgst) +
          parseFloat(fnlDisc);
        let unitname =
          type === "new"
            ? await getUnitName(n.UnitId)
            : type === "update"
            ? n.unit
            : "";
        return {
          id: n.id,
          InvoiceId: "",
          ItemId: n.ItemId,
          ItemName: res.ItemName,
          unit: unitname,
          UnitId: n.UnitId,
          isaltrate: "",
          pinwardQuantity: penQty,
          pinwardaltqty: fixedToLengthalt(getpenAltqty),
          Quantity: type === "new" ? penQty : invoiceQty,
          altqty:
            type === "new"
              ? fixedToLengthalt(getpenAltqty)
              : fixedToLengthalt(invoiceAltQty),
          Rate: n.Rate,
          Amount: fixedToLength(grosAmt),
          totalAmount: fixedToLength(totAmt),
          finalDiscount: fixedToLength(fnlDisc),
          DiscountPer:
            type === "new"
              ? n.DiscountPercentage
              : type === "update"
              ? n.DiscountPer
              : 0,
          DiscountAmount: fixedToLength(disc),
          hsnclassificationid: res.GSTClassification[0].HsnId,
          igstrate:
            createObj.shippingstateid !== createObj.billingstateid
              ? taxes.igstRate
              : 0,
          cgstrate:
            createObj.shippingstateid === createObj.billingstateid
              ? taxes.cgstRate
              : 0,
          sgstrate:
            createObj.shippingstateid === createObj.billingstateid
              ? taxes.sgstRate
              : 0,
          igstamount: fixedToLength(igst),
          cgstamount: fixedToLength(cgst),
          sgstamount: fixedToLength(sgst),
          icdetailid:
            type === "new"
              ? n.InwardDetailId
              : type === "update"
              ? n.icdetailid
              : "",
          icmId: type === "new" ? n.InwardId : type === "update" ? n.icmId : "",
        };
      })
    );
    return newItemObjList;
  };
  const getPendingQty = async (id) => {
    const items = await db.PurchaseInvoiceDetail.where("icdetailid")
      .equals(id)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (items) {
      if (items.length === 1) {
        return items[0].Quantity;
      } else {
        let qt = 0;
        items.map((qty) => {
          qt = qt + qty.Quantity;
          return qty;
        });
        return qt;
      }
    } else {
      return 0;
    }
  };
  const getAndSetTaxOrAmount = (tableItems) => {
    let grosAmt = 0;
    let totDis = 0;
    let totigst = 0;
    let totcgst = 0;
    let totsgst = 0;
    let ttotAmt = 0;
    tableItems.map((n) => {
      grosAmt = parseFloat(grosAmt) + parseFloat(n.Amount);
      totDis = parseFloat(totDis) + parseFloat(n.DiscountAmount);
      totigst = parseFloat(totigst) + parseFloat(n.igstamount);
      totcgst = parseFloat(totcgst) + parseFloat(n.cgstamount);
      totsgst = parseFloat(totsgst) + parseFloat(n.sgstamount);
      ttotAmt = parseFloat(ttotAmt) + parseFloat(n.totalAmount);
      return n;
    });
    return {
      grossamount: fixedToLength(grosAmt),
      discountamount: fixedToLength(totDis),
      taxamount: fixedToLength(
        parseFloat(totigst) + parseFloat(totcgst) + parseFloat(totsgst)
      ),
      netamount: fixedToLength(
        parseFloat(ttotAmt) + fnCRoundOff(fixedToLength(ttotAmt))
      ),
      roundOff: fnCRoundOff(fixedToLength(ttotAmt)),
      totalAmount: fixedToLength(ttotAmt),
      igstAmount: fixedToLength(totigst),
      cgstAmount: fixedToLength(totcgst),
      sgstAmount: fixedToLength(totsgst),
    };
  };
  /**
   * Popup ok button event
   */
  const okSubmit = async () => {
    const ids = getcheckedRows.map((a) => {
      return a.ItemId;
    });
    const objget = await ObjItem(getcheckedRows);
    if (objget.length > 0) {
      if (ids) {
        setCheckedItem(ids);
        if (!selectedItems) {
          setSelectedItems(objget);
        } else {
          const results = objget.filter(
            ({ id: id1 }) => !selectedItems.some(({ id: id2 }) => id2 === id1)
          );
          const results2 = selectedItems.filter(
            ({ id: id1 }) => !objget.some(({ id: id2 }) => id2 === id1)
          );
          if (results.length > 0) {
            setSelectedItems((prevArray) => [...prevArray, ...results]);
          }
          if (results2.length > 0) {
            const results3 = selectedItems.filter(
              ({ id: id1 }) => !results2.some(({ id: id2 }) => id2 === id1)
            );
            if (results3) {
              setSelectedItems(results3);
            }
          }
        }
      }
    } else {
      setCheckedItem([]);
      setSelectedItems([]);
    }

    setOpen(false);
  };
  const viewItem = (id) => {
    const viewitem = createObj.itemlistbyvendor.filter((a) => id === a.icmId);
    setCreateObj({ ...createObj, viewItems: viewitem });
    setViewopen(true);
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
  }, [
    createObj,
    selectedTblRow,
    updateAction,
    codeFocus,
    updatedObj,
    selectedItems,
    checkedItem,
  ]);
  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="purchaseInwardGit"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="purchaseInwardGitIn">
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
                        <Text content="Invoice No" />
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
                        <Text content="Invoice Date" />
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
                          getOptionLabel={(option) => option.vendorName}
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
                  <div className="col autoComp">
                    <div
                      className={
                        requiredObj.vendorCode === true
                          ? "formBox error"
                          : "formBox"
                      }
                    >
                      <label htmlFor="">
                        <Text content="Vendor Code" />
                        <span className="required">*</span>
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
                  </div>
                </div>
              </div>
              <div className="col w35">
                <button
                  className={
                    createObj.vendorName !== "" && val !== "view"
                      ? "btnGreen"
                      : "btnGreen disable"
                  }
                  onClick={
                    createObj.vendorName === ""
                      ? (e) => {
                          return false;
                        }
                      : val === "add" || val === "edit"
                      ? (e) => openInwardChallan(e)
                      : (e) => {
                          return false;
                        }
                  }
                >
                  <Text content="Inward Challan" />
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mt-2 mb-2">
              <div className="tableBox">
                <CustomTable
                  coulmn={coulmn}
                  data={selectedItems}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={createObj.itemList}
                  editStatus={edit}
                  // deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  refreshTable={refreshtbl}
                  // editbtnText="Add Item detail"
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
                    name="CreatedBy"
                    onChange={(e) => onchange(e)}
                    className="bgWhite"
                    value={createObj.CreatedByName}
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
      {open && val !== "view" ? (
        <div className="modalPopUp">
          <div className="modalPopUPin">
            <CustomTable
              coulmn={InwardCoulmn}
              data={createObj.inwardList}
              overFlowScroll={true}
              checkbox={true}
              selectedRows={checkedItem}
              getCheckedItem={(res) => getCheckedRows(res)}
              Viewbtnclick={(id) => viewItem(id)}
              Footer={true}
            />
            <div className="popupButton">
              <button
                onClick={() => okSubmit()}
                className="btn btnGreen mr-5 mlAuto"
              >
                <Text content="Ok" />
              </button>
              <button onClick={() => handleClose("inw")} className="btn btnRed">
                <Text content="Cancel" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {viewopen && (
        <div className="modalPopUp">
          <div className="modalPopUPin">
            <CustomTable
              coulmn={InwdCoulmn}
              data={createObj.viewItems}
              overFlowScroll={true}
              Viewbtnclick={(id) => viewItem(id)}
              Footer={true}
            />
            <div className="popupButton">
              <button
                onClick={() => handleClose("inwitem")}
                className="btn btnRed"
              >
                <Text content="Close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PurchaseInwardGit;
