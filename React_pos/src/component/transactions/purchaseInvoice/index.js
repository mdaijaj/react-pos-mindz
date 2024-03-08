
import "./index.scss";
import React, { useState, useEffect, useCallback } from "react";
import CommonFormAction from "../../common/commonFormAction";
import CustomTable from "../../common/table";
// import coulmn from "./tableColumn";
import coulmn_popup from "./tableCoulmn_popup";
import BillingInfo from "./BillingInfo";
import TaxInfo from "./TaxInfo";
import calenderIcon from "../../../images/icon/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import Text from "../../common/text";
import BatchNumberList from './batchNumberList';

import {
  getVoucherIds, getSeries, getseriesNo, getUnitName, itemAltqty, getItemstockQtyindexDb,
  getLastId
} from "../../common/commonFunction";

import { getTaxesByItemObj, getPercentCalc, getAndSetTaxOrAmount, fixedToLength, } from "./commonfunction";

import BatchModal from "./BatchModal";
// import { ItemMaster_obj } from "../../masters/itemMaster/store";
import SerialModal from "./SerialModal";
import BatchSerialDetailModal from "./BatchSerialDetailModal";
import { batch } from "react-redux";
// import ItemListModal from "./ItemListModal";
import { fn_PurchaseInvoice } from "../billPos/transactionDB";
import { vNum } from "../../common/validation";
import { v4 as uuidv4 } from 'uuid';

import ExistsModal from "./ExistsModal";

import BatchParentListModal from "./BatchParentListModal";
import { getBatchOrSerialNumber , getBatchOrSerialNumberById } from "../../common/commonFunction";
import BatchChildDetailModal from "./BatchChildDetailModal";

import Dexie from "dexie";

const PurchaseInvoice = ({ pageNav }) => {
  const [batchNumberList, setBatchNumberList] = useState([]);
  const [serialNumberList, setSerialNumberList] = useState([]);
  const [batchChildNumberList, setBatchChildNumberList] = useState([]);
  // console.log(pageNav,'pageNav, in pi')
  
  const Obj = {
    InvoiceNo: "",
    InvoiceDate: "",
    PartyId: "",
    vendorCode: "",
    vendorName: "",
    invoicetype: 0,
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
    CreatedBy: localStorage.getItem("UserId"),
    CreatedByName: localStorage.getItem("fname"),
    remark: "",
    dncn_against_pi: "",
    itemList: [],
    items: [],
    stateList: [],
    BatchNumberDetail: '',
    SerialNumberDetail: '',
    godown: '',
    godownId: 0,
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


  //   godownF: async function () {
  //     let result,newResult;
  //     result = await db.GodownMaster.toArray();
  //     newResult = result.map(data => {
  //       return { value: data.Storename, label: data.Storecode };
  //     })
  //     return newResult;
  // },

  const [godown, setGodown] = useState(null);

  useEffect(async () => {
    let result, newResult;
    result = await db.GodownMaster.toArray();
    newResult = result.map(data => {
      // return { value: data.Storename, label: data.Storecode };
      return { value: data.storeid + '|' + data.Storename, label: data.Storename };  //s
    })
    // console.log(newResult,'newResultnewResultnewResultnewResultnewResultnewResultnewResultnewResultnewResult');
    setGodown(newResult)
  }, [])

  const column = [
    {
      header: "Item Name", field: "ItemName", width: 250
      // , cell: "autocomplete" 
    },
    { header: "Unit", field: "unit" },
    {
      header: "Godown Name",
      field: "godown",
      cell: "select",
      slOption: godown,
    },
    // { header: "Stock", field: "stock" },
    { header: "MRP", field: "MRP", cell: "EditInput" },
    { header: "Invoice Qty", field: "Quantity", cell: "EditInput" },
    { header: "Invoice Alt Qty", field: "altqty" },
    { header: "Rate", field: "Rate", cell: "EditInput" },
    { header: "Disc (%)", field: "DiscountPer", cell: "EditInput" },
    { header: "Discount Amount", field: "DiscountAmount" },
    { header: "Gross Amount", field: "Amount" },
    { header: "Final Amount", field: "finalDiscount" },
    { header: "Total Amount", field: "totalAmount" },
    { header: "IGST Tax (%)", field: "igstrate" },
    { header: "IGST Amount", field: "igstamount" },
    { header: "CGST Tax (%)", field: "cgstrate" },
    { header: "CGST Amount", field: "cgstamount" },
    { header: "SGST Tax (%)", field: "sgstrate" },
    { header: "SGST Amount", field: "sgstamount" },
  ];

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

  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });
  const [sabtabVal, setSabtabVal] = useState('billingInfo');
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });

  // _____________________________________________________________________

  const [open, setOpen] = useState(false);
  const [selectedItemRow, setSelectedItemRow] = useState();
  const [itemList, setItemList] = useState();
  const [checkedItem, setCheckedItem] = useState();
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [updateEvent, setUpdateEvent] = useState();

  // P Starts

  const [batchModalShow, setBatchModalShow] = useState(false);
  const [serialModalShow, setSerialModalShow] = useState(false);
  const [batchSerialDetailModal, setBatchSerialDetailModal] = useState(false);
  const [quantityPut, setQuantityPut] = useState(false);
  const [serialQuantityPut, setSerialQuantityPut] = useState(false);
  const [BatchNumber, setBatchNumber] = useState({});
  const [childBatchNumber, setChildBatchNumber] = useState({});
  // const [batchChildNumberList, setBatchChildNumberList] = useState();
  
  
  const [altQty, setAltQty] = useState(0)
  const [SerialNumber, setSerialNumber] = useState('');
  const [CurrentSerialNumber, setCurrentSerialNumber] = useState('');

  const [currentBatchChildList, setCurrentBatchChildList] = useState('');
  const [batchChildDetailModal, setBatchChildDetailModal] = useState(false);



  var batch_number_list = [];


  //  console.log(serialNumberList,'serialNumberListserialNumberListserialNumberList')


  const [invoiceQuantity, setInvoiceQuantity] = useState(0);
  const [ItemDetail, setItemDetail] = useState(null);
  const [BatchSubmit, setBatchSubmit] = useState(false);

  const [UnitName, setUnitName] = useState('');
  const [selectedGodown, setSelectedGodown] = useState(false);

  const [batchParentExistModal,setBatchParentExistModal] = useState(false);
  const [batchParentListModalShow,setBatchParentListModalShow] = useState(false);
  // console.log(BatchSubmit,'BatchSubmitBatchSubmitBatchSubmitBatchSubmit')

  const [choosenBatchParent, setChoosenBatchParent] = useState('');
  const [batchParentListOk, setBatchParentListOk] = useState(false);
  
  const [ctrlF, setCtrlF] = useState(false);
  const [enteredMRP,setEnteredMRP] = useState(false);
  const [mrpValue,setMRPValue] = useState('');


  console.log(choosenBatchParent, 'choosenBatchParent choosenBatchParent')
  console.warn(BatchSubmit,'BatchSubmit in sss')
  const max_id_array = (myArray, id_key) => {
    myArray.reduce(function (prev, current) {
      if (+current.id_key > +prev.id_key) {
        return current;
      } else {
        return prev;
      }
    });
  }

  // P Ends

  const change_state = (arg) => {
    switch (arg) {
      case "add": {
        setVal(arg);
        getoucherList();
        setSaveEdit(false);
        setEditcoulmn(true);
        setAddbtn(true);
        getItems()
        setRequiredObj(reqObj)
        setUpdateEvent(false);
        return;
      }

      case "edit": {
        setVal(arg);
        getInvoiceList();
        setSaveEdit(true);
        setAddbtn(false);
        setEditcoulmn(true);
        getItems()
        setRequiredObj(reqObj)
        setUpdateEvent(false);
        return;
      }

      case "view": {
        setVal(arg);
        getInvoiceList();
        setSaveEdit(false);
        setEditcoulmn(false);
        setAddbtn(false);
        setRequiredObj(reqObj)
        // getItems()
        // setUpdateEvent(false);
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
        restData();
        setBatchParentExistModal(false);
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
  };

  const subtab = (tab) => {
    setSabtabVal(tab)
  }

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
          .equals(1)
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
        .equals(1)
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
        .equals(1)
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
      .where("LedgerType")
      .equals(2)
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
      InvoiceNo: invoiceNo,
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

  // const selectedRow = (item) => {
  //   setSelectedItemRow(item);
  // };

  const selectedRow = (item) => {
    
    setSelectedTblRow(item);

    console.log(item, 'lllllllllllllllllllllllllluuuuuuu')
    console.log(selectedTblRow, 'selectedTblRow , rr')

    if (edit) {
      if (selectedTblRow) {
        // const array = createObj.items.map((a) => {
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
        setSelectedItems(array)
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
    // const res = createObj.items.filter((a) =>
    const res = selectedItems.filter((a) =>
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
      setSelectedItems(nArray)
    }
  };



  // useEffect(() => {
  //   get_data().then((data)=>{
  //     setGodown(data);
  //   });
  // },[])

  // useEffect(() => {
  //   var godownIndex  = coulmn.findIndex((col => col.field == 'godown'));
  //   let goDownFiltered = godown && godown.map((gd,i) => {
  //     return { value: gd.Storename, label: gd.Storecode };
  //   })
  //     coulmn[godownIndex].slOption = goDownFiltered;
  // })

  

  // useEffect(
  const checkBatchExists =  async () => {
    const itemId = selectedTblRow && selectedTblRow.ItemId;
    console.log(itemId, 'item id from useeffect seelcted');
    if (itemId) {
      const pi = await db.PurchaseInvoiceDetail.where("ItemId")
        .equals(itemId)
        .toArray()
        .then()
        .catch((err) => console.log(err));
        const x = pi && pi.length > 0 ? true : false;
        if(x){
            setTimeout(() => {
              setBatchModalShow(false)
            }, 1001);
            
            setBatchParentExistModal(true);
        }
        return Promise.resolve(x);
    }
  }
  // ,[invoiceQuantity, batchModalShow])

  
  // P Starts
  const tableInputOnchange = e => {
    // alert("tableInputOnchange")
    // if(BatchNumber.batch_number == '' && ["Rate","DiscountPer"].includes(e.target.name)){
    //   e.target.setAttribute("disabled", "disabled");
    // }
    console.log(e, ' e in change input')
    console.log(e.target, ' e target in change input')
    // if (e.target.name === 'ItemName') {
      e.target.addEventListener("click", () => {
        // alert('kkkk')
        setCtrlF(true);
      })
    // }
    if (e.target.name === 'MRP') {
      if (e.target.value != undefined || e.target.value != '') {
        setEnteredMRP(true);
        setMRPValue(e.target.value);
      } else if (e.target.value != '') {
        e.target.nextSibling.innerHTML = "";
      }
    }

    if (e.target.name === 'Quantity' && e.target.value != '') {
      if (!selectedGodown) {
        alert('The Godown selection is required.');
        e.target.value = '';
        setSelectedGodown(false);
      } else if (!enteredMRP) {
        alert('The MRP field is required.');
        e.target.value = '';
        setEnteredMRP(false);
      } else {
        // if (vNum(e.target.value, 0, 17)) {
        setInvoiceQuantity(e.target.value);
        // if(allBatchNo.length){
        // }
         const y = checkBatchExists().then(value => value);
          // const yn = checkBatchExists();
          // console.warn(y,'bexitttttttttt');
          // console.warn(yn, 'dddljsejlsese');

          // if(y){
          //       setBatchModalShow(false);
          //       setBatchParentExistModal(true);
          // } else {
      
        if (selectedTblRow.IsLot == "true") {
          console.log(invoiceQuantity, 'nothing exists')       
                if (e.target.value != '') {
                  setTimeout(() => {
                    setBatchModalShow(true)
                  }, 1000);
                  e.target.addEventListener("click", () => {
                    if (e.target.value != '') {
                      setTimeout(() => {
                        setBatchModalShow(true)
                      }, 1000);
                    }
                  })
                }
        }
      
      // }

        if (selectedTblRow != undefined && selectedTblRow.IsLot == false && selectedTblRow.IsSerial == "true") {
          setTimeout(() => {
            setSerialModalShow(true)
          }, 1000)
        }
        // } else {
        //   e.target.value.splice(e.target.value.length, 1);
        //   alert('Please enter a number.')
        // }  
      }
    }

    if (e.target.name === 'godown') {
      // console.log(e, "eeeeeeeeeeeeeeeeeeee")
      var godownNameIdArr = e.target.value.split('|')
      var godownIdfromArr = parseInt(godownNameIdArr[0])
      var godownNamefromArr = godownNameIdArr[1]
      let batch_item_id = (selectedTblRow.ItemId != '') ? selectedTblRow.ItemId : '';
      console.log(batch_item_id, "batch_item_id batch_item_id")
      let itemStockCount = getItemstockQtyindexDb(batch_item_id, godownIdfromArr).then(value => value);    //s
      setUpdatedObj({ ...updatedObj, godownId: godownIdfromArr, [e.target.name]: godownNamefromArr, stock: itemStockCount });   //s
      // setUpdatedObj({ ...updatedObj, godownId: godownIdfromArr, [e.target.name]: godownNamefromArr});
      // console.log(updatedObj, "updateObj updateObj")
      if (e.target.value != undefined || e.target.value != '') {
        setSelectedGodown(true);
      } else if (e.target.value != '') {
        e.target.nextSibling.innerHTML = "";
      }
    } else {
      setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    }
    // console.log(updatedObj,'updatedObjupdatedObjupdatedObjupdatedObjupdatedObj in inputqnty')
    return e.target.value;
  };

  const getItemDetailwithTax = async (arry) => {
    let newArr = await Promise.all(arry.map(async (a) => {
      const res = await getTaxesByItemObj(a);
      let hsnid = a.GSTClassification[0].HsnId;
      // let unitName = await getUnitName(a.ItemId).then(res => res);
      return {
        ...a,
        ItemName: a.ItemName,
        ItemId: a.ItemId,
        igstrate: res.igstRate,
        cgstrate: res.cgstRate,
        sgstrate: res.sgstRate,
        hsnid: hsnid,
        unitId: a.UnitName,
        unit: a.unit,
        remark: "",
        RequiredQty: 0,
        RequiredAltQty: 0,
        Priority: "",
      }
    }))
    return newArr
  }


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
    // P Starts
    const PID = await getBatchOrSerialNumber();
    if(PID.purchaseinvoicedetail > 0){
    var lastBatchId = PID.batchparentlast;
    var lastBatchChildId = PID.batchchildlast;
    } else {
      var lastBatchId = await db.BatchMaster.reverse().limit(1).toArray()
      .then(value => value[0].batchid)
      .catch((err) => console.log(err));
      var lastBatchChildId = await db.BatchDetail.reverse().limit(1).toArray()
      .then(value => value[0].batchdetailid)
      .catch((err) => console.log(err));
    } 

      // batch detail without popup
    if (selectedTblRow.IsLot != "true") {
      
      // var item_name = '',item_code='';
      let batch_item_name = (selectedTblRow.ItemName != '') ? selectedTblRow.ItemName : '';
      let batch_item_code = (selectedTblRow.ItemCode != '') ? selectedTblRow.ItemCode : '';
      let batch_item_id = (selectedTblRow.ItemId != '') ? selectedTblRow.ItemId : '';

      let batchNumberDefault = 'BN-' + batch_item_code + new Date().getTime() + batch_item_id.toString().padStart(5, '0');
      let lotNumber = 'LOT-' + batch_item_code + new Date().getTime() + batch_item_id.toString().padStart(5, '0');

      // 'LOT-'+item_code + item_id.toString().padStart(5, '0')
      // var lastid = 1;
      // uuidv4() + j


      // console.log(SerialNumber, "serialNumber true")
      let newSerialObj = SerialNumber;
      // console.log(newSerialObj,"newSerialObj","newSerialObj","newSerialObj")
      let newSerialObj_batch = newSerialObj && newSerialObj.map(sn => ({ ...sn, batch_id: batchId }));
      // console.log(newSerialObj_batch,"newSerialObj_batchaa newSerialObj_batchaa") 
      setSerialNumber(newSerialObj_batch);
      // setSerialNumber(newSerialObj)
      // let x = serialNumberList.filter((a) => a.batch_id !== newSerialObj.batch_id);
      setSerialNumberList([...serialNumberList, newSerialObj_batch]);
      // setSerialNumberList([...x, newSerialObj]);


      // setSerialNumberList([...serialNumberList, newSerialObj_batch]);


      // entrydetailid: item.entrydetailid,
      // entryid: item.entryid,
      // entrytype: item.entrytype,
      var newBatchChildObj = {
          SerialDetail:newSerialObj_batch,
          createdon: new Date(),
          batchdetailid: lastBatchChildId + 1,
          batchid: lastBatchId + 1,
          entrydetailid: pageNav.formid, // P for now ony removable
          entryid: pageNav.formtype, // P for now ony removable
          entrytype: pageNav.formval, // P for now ony removable
          id: 2,
          inaltqty: "0.00",
          inqty: invoiceQuantity,
          itemid: batch_item_id,
          mrp: "", // p
          outaltqty: "0.00",
          outqty: "1.00",
          stockid: '',
          storeid: '',
      };
      
      // if( batchParentListModalShow && batchParentListOk && BatchSubmit ){
      if(  batchParentListOk  ){

          // alert("if default")
            var editablePID =  await getBatchOrSerialNumberById(choosenBatchParent.data_item_id);
            // await db.PurchaseInvoiceDetail.put({
            //   ItemId: choosenBatchParent.data_item_id,
            //   BatchNumber:editablePID[0].BatchNumber.BatchDetail.push(newBatchChildObj)
            // })
            // .then((a) => console.log(a))
            // .catch((err) => console.log(err));
            console.log(editablePID,'editablePid default')
            let bnl = editablePID.batchnumber.find(bd => bd.batchid == choosenBatchParent.data_batchid);
            console.log(bnl,'bnl bnl')
            // var UpdatedBatchold = bnl.BatchDetail.push(newBatchChildObj);
            // var UpdatedBatch = editablePID[0].BatchDetail.push(newBatchChildObj);
            console.log(editablePID,'editablePID ,editablePID')
            // console.log(UpdatedBatch,'Updated Batch')
            // console.log(UpdatedBatchold,'UpdatedBatchold')
    
            // // console.log(editable,'editable ,editable')
            // var ud = await db.PurchaseInvoiceDetail.update({
            //      "ItemId":  choosenBatchParent.data_item_id,
            //      "BatchId": choosenBatchParent.data_batchid
            //     },{
            //       "BatchNumber.BatchDetail":newBatchChildObj
            //     })
      } 
      // else {
        // alert('default else')
        setChildBatchNumber(newBatchChildObj);
      // console.log(childBatchNumber, 'childBatchNumber after set')
      // var newBatchObj = {
      //   ...BatchNumber,
      //   batch_id: uuidv4(),
      //   item_name: batch_item_name,
      //   item_code: batch_item_code,
      //   batch_number: batchNumberDefault,
      //   lot_no: lotNumber,
      //   qty_in: invoiceQuantity,
      // }

      // alteredon: new Date('Y-m-d h:i:s'),   // new
      // batchdate: new Date('Y-m-d h:i:s'),
      // createdon: new Date('Y-m-d h:i:s'),    // new
      var newBatchObj = {
        BatchDetail: [{ ...newBatchChildObj }],
        batchid: lastBatchId + 1,
        batchno: batchNumberDefault,
        branchid: 1,
        editlog: null,
        id: uuidv4(),
        iscancelled: false,
        itemid: batch_item_id,
        item_code: batch_item_code,
        item_name: batch_item_name,
        lotno: lotNumber,
        manufacturingdate: null, // p
        expirydate: null, // p
        seriescode: null,
        seriesid: null,
        seriesno: null,
      }

      var batchId = newBatchObj.batchid
      console.log(newBatchObj,' newBatchObj in parent')
      var batchChildId = newBatchChildObj.batchdetailid;
      setChildBatchNumber(newBatchChildObj);
      // if(batchChildNumberList.length > 0){
      // var c = batchChildNumberList.filter((a) => a.batchdetailid !== batchChildId);
      // setBatchChildNumberList([...c, newBatchChildObj]);
      // } else {
        // alert('b c else')
      setBatchChildNumberList(newBatchChildObj);
      // }

      console.log(newBatchChildObj,'in newBatchChildObj fuc')
      setBatchNumber(newBatchObj)
      // if(batchNumberList.length > 0){
      let x = batchNumberList && batchNumberList.filter((a) => a.batchid !== batchId);
      setBatchNumberList([...x, newBatchObj]);
      // } else {
      // setBatchNumberList(newBatchObj);
      // }

      // } //B L ends
      
    }
    

    if (selectedTblRow.IsLot == "true") {
      // alert("true")
      // console.log(BatchNumber, "BAtchNumber BatchNumber")

      let batch_item_name = (selectedTblRow.ItemName != '') ? selectedTblRow.ItemName : '';
      let batch_item_code = (selectedTblRow.ItemCode != '') ? selectedTblRow.ItemCode : '';
      let batch_item_id = (selectedTblRow.ItemId != '') ? selectedTblRow.ItemId : '';
      let lotNumber = 'LOT-' + batch_item_code + new Date().getTime() + batch_item_id.toString().padStart(5, '0');
      // alert(lotNumber)

      // let newBatchObj = {
      //   ...BatchNumber,
      //    item_name: batch_item_name,
      //   item_code: batch_item_code,
      //   lot_no: lotNumber,
      //   qty_in: invoiceQuantity
      // }

      // console.log(SerialNumber, "serialNumber true")
      let newSerialObj = SerialNumber;
      // console.log(newSerialObj,"newSerialObj","newSerialObj","newSerialObj")
      let newSerialObj_batch = newSerialObj && newSerialObj.map(sn => ({ ...sn, batch_id: batchId }));
      // console.log(newSerialObj_batch,"newSerialObj_batchaa newSerialObj_batchaa") 
      setSerialNumber(newSerialObj_batch);
      // setSerialNumber(newSerialObj)
      // let x = serialNumberList.filter((a) => a.batch_id !== newSerialObj.batch_id);
      setSerialNumberList([...serialNumberList, newSerialObj_batch]);
      // setSerialNumberList([...x, newSerialObj]);


      var newBatchChildObj = {
        SerialDetail:newSerialObj_batch,
        createdon: new Date(),
        batchdetailid: lastBatchChildId + 1,
        batchid: lastBatchId + 1,
        entrydetailid: pageNav.formid, // P for now ony removable
        entryid: pageNav.formtype, // P for now ony removable
        entrytype: pageNav.formval, // P for now ony removable
        id: 2,
        inaltqty: "0.00",
        inqty: BatchNumber?.qty_in ? BatchNumber.qty_in : invoiceQuantity,
        itemid: batch_item_id,
        mrp: BatchNumber.mrp, // p
        outaltqty: "0.00",
        outqty: "1.00",
        stockid: '',
        storeid: '',
      };

      console.log(batchParentListModalShow, 'batchParentListModalShow batchParentListModalShow');
      console.log(batchParentListOk,'batchParentListOk batchParentListOk');
      console.log(BatchSubmit,'BatchSubmit BatchSubmit');
      console.log(newBatchChildObj,'newBatchChildObj newBatchChildObj')
      // if( batchParentListModalShow && batchParentListOk && BatchSubmit ){
      if( batchParentListOk ){
        // alert("if batchPopup")
        // alert(choosenBatchParent.data_item_id)
            console.log(choosenBatchParent)
        
        //db.friends.update(friendId, {
        //   "address.zipcode": 12345
        //});

        let editablePID =  await getBatchOrSerialNumberById(Number(choosenBatchParent.data_item_id))
        let id = editablePID.item.find(bd => (bd.BatchId == choosenBatchParent.data_batchid) && bd.id );
        let bdetails = editablePID.batchnumber.find(bd => (bd.batchid == choosenBatchParent.data_batchid) && bd.BatchDetail );
        console.log(id,'bnl bnl')
        console.log(bdetails,'bdetailsss');
        // var updatedBatch = await bdetails.push(newBatchChildObj);
        // console.log(updatedBatch,'updated batch');
        // var UpdatedBatchold = bnl.BatchDetail.push(newBatchChildObj);
        // var UpdatedBatch = editablePID[0].BatchDetail.push(newBatchChildObj);
        console.log(editablePID,'editablePID ,editablePID')
        // console.log(UpdatedBatch,'Updated Batch')
        // console.log(UpdatedBatchold,'UpdatedBatchold')

        // console.log(editable,'editable ,editable')
        // {
        //   "ItemId":  choosenBatchParent.data_item_id,
        //   "BatchId": choosenBatchParent.data_batchid
      // }
        var ud = await db.PurchaseInvoiceDetail.update(id,{
              "BatchNumber.BatchDetail":newBatchChildObj
            })

          // await db.transaction("rw", db.PurchaseInvoiceDetail, async () => {
          //     await db.PurchaseInvoiceDetail.where("BatchId").equals(choosenBatchParent.data_batchid).modify({
          //         "BatchNumber.BatchDetail":newBatchChildObj
          //       });
          // }).catch (Dexie.ModifyError, error => {
          //     console.error(error.failures.length + " items failed to modify");
          // }).catch (error => {
          //     console.error("Generic error: " + error);
          // });    

        //     .then((a) => console.log(a))
        //     .catch((err) => console.log(err));
        //     console.log(ud,'udududud')
      } 

         // else {
      // alert("else batchPopup")

      // var newBatchObj = {
      //   ...BatchNumber,
      //   batch_id: uuidv4(),
      //   item_name: batch_item_name,
      //   item_code: batch_item_code,
      //   batch_number: batchNumberDefault,
      //   lot_no: lotNumber,
      //   qty_in: invoiceQuantity,
      // }

      // alteredon: new Date('Y-m-d h:i:s'),   // new
      // batchdate: new Date('Y-m-d h:i:s'),
      // createdon: new Date('Y-m-d h:i:s'),   // new

      // batchno: batchNumberDefault,
      var newBatchObj = {
        BatchDetail: [{ ...newBatchChildObj }],
        batchid: lastBatchId + 1,
        batchno: BatchNumber.batch_number,
        branchid: 1,
        editlog: null,
        id: uuidv4(),
        iscancelled: false,
        itemid: batch_item_id,
        item_code: batch_item_code,
        item_name: batch_item_name,
        lotno: lotNumber,
        manufacturingdate: BatchNumber.mfg_date, // p
        expirydate: BatchNumber.expiry_date, // p
        seriescode: null,
        seriesid: null,
        seriesno: null,
      }
      // manufacturingdate: null, // p
      // expirydate: null, // p

      var batchChildId = newBatchChildObj.batchdetailid;
      setChildBatchNumber(newBatchChildObj);
      let c = batchChildNumberList && batchChildNumberList.filter((a) => a.batchdetailid !== batchChildId);
      setBatchChildNumberList([...c, newBatchChildObj]);
      
      var batchId = newBatchObj.batchid
      setBatchNumber(newBatchObj)
      let x = batchNumberList && batchNumberList.filter((a) => a.batchid !== batchId);
      setBatchNumberList([...x, newBatchObj]);

      // } // B L ends
    }

    // // console.log(SerialNumber, "serialNumber true")
    // let newSerialObj = SerialNumber;
    // // console.log(newSerialObj,"newSerialObj","newSerialObj","newSerialObj")
    // let newSerialObj_batch = newSerialObj && newSerialObj.map(sn => ({ ...sn, batch_id: batchId }));
    // // console.log(newSerialObj_batch,"newSerialObj_batchaa newSerialObj_batchaa") 
    // setSerialNumber(newSerialObj_batch);
    // // setSerialNumber(newSerialObj)
    // // let x = serialNumberList.filter((a) => a.batch_id !== newSerialObj.batch_id);
    // setSerialNumberList([...serialNumberList, newSerialObj_batch]);
    // // setSerialNumberList([...x, newSerialObj]);

    // P Ends  
    // console.log(updatedObj,'updatedObjupdatedObj in updateAction')
    // console.log(selectedTblRow,'selectedTblRow in selectedTblRow')


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
      let mrp =
        updatedObj.MRP !== undefined
          ? updatedObj.MRP
          : selectedTblRow.MRP !== ""
            ? selectedTblRow.MRP
            : 0;
      // P Starts
      // let batchNumber =
      //   updatedObj.BatchNumber !== undefined
      //     ? updatedObj.BatchNumber
      //     : selectedTblRow.BatchNumber !== ""
      //     ? selectedTblRow.BatchNumber
      //     : 0;
      // let serialNumber =
      //     updatedObj.SerialNumber !== undefined
      //       ? updatedObj.SerialNumber
      //       : selectedTblRow.SerialNumber !== ""
      //       ? selectedTblRow.SerialNumber
      //       : 0;
      let godown =
        updatedObj.godown !== undefined
          ? updatedObj.godown
          : selectedTblRow.godown !== ""
            ? selectedTblRow.godown
            : 0;
      let godownId =
        updatedObj.godownId !== undefined
          ? updatedObj.godownId
          : selectedTblRow.godownId !== ""
            ? selectedTblRow.godownId
            : 0;
      let Stock =
        updatedObj.stock !== undefined
          ? updatedObj.Stock
          : selectedTblRow.Stock !== ""
            ? selectedTblRow.Stock
            : 0;
      
      //  P Ends   

      // console.log(updatedObj,'updatedObjupdatedObj in updateAction After')
      // console.log(selectedTblRow,'selectedTblRow in selectedTblRow After')



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
        BatchNumberDetail: BatchNumber,
        SerialNumberDetail: SerialNumber,
        godown: godown,
        godownId: godownId,
        stock: Stock,
        MRP: mrp,
        BatchParentId:lastBatchId + 1
      };

      // console.log(newUpdateObj, 'newUpdateObjnewUpdateObjnewUpdateObj')
      const array = selectedItems.map((a) => {
        if (a.id === undefined) {
          return a.staticid === selectedTblRow.staticid
            ? { ...a, ...newUpdateObj }
            : a;
        } else {
          return a.id === selectedTblRow.id ? { ...a, ...newUpdateObj } : a;
        }
      });


      let taxpageObj = getAndSetTaxOrAmount(array);
      setCreateObj({ ...createObj, taxpage: taxpageObj });
      setSelectedItems(array);
      setEdit(false);
      setUpdatedObj();
      // setAddbtn(false);
      refreshtable();
    } else {
      refreshtable();
    }

  }, [selectedTblRow, updatedObj, createObj, selectedItems, SerialNumber, BatchNumber]);

  // console.log(selectedItems,'selectedItemsselectedItemsselectedItems in update Action')
  console.log(BatchNumber, 'BatchNumber BatchNumber BatchNumber');
  console.log(childBatchNumber, 'new batch child number list');
  console.log(batchChildNumberList,'batchChildNumberList outside ua');

  useEffect(() => {
    if (selectedTblRow != undefined && selectedTblRow.IsLot == "true") {
      // alert('hii')
      if (BatchSubmit && selectedTblRow.IsSerial == "true") {
        // alert('by')
        // setTimeout(() => {
        setSerialModalShow(true)
        setBatchSubmit(false);
        setBatchParentExistModal(false);
        // },1000)  
      }
      //  else {
      //   setSerialModalShow(false)
      // }
    }
  }, [BatchSubmit])




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
      setCreateObj({
        ...createObj,
        // items: caluArray, 
        taxpage: taxpageObj
      });
      setSelectedItems(caluArray)

      console.log(createObj, 'createObjcreateObjcreateObj in StatewiseTax')

    }
  };
  useEffect(() => {
    // if (createObj.items.length > 0) {
    if (selectedItems.length > 0) {
      if (updatetaxstatewise) {
        // let arr = createObj.items.filter((a)=> a.ItemId !== "");
        let arr = selectedItems.filter((a) => a.ItemId !== "");
        if (arr.length > 0) {
          statewiseTax(arr);
        }
      }
    }
  }, [updatetaxstatewise, selectedItems]);
  // }, [updatetaxstatewise, createObj.items]);

  const getInvoiceList = async () => {
    let userId = localStorage.getItem("UserId");
    const res1 = await db.PurchaseInvoice.where("invoicetype")
      .equals(1)
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
    // console.log(value,'sssddssssssssss')
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
      // console.log(vendor,'vendorvendorvendorvendor')

      const items = await db.PurchaseInvoiceDetail.where("InvoiceId")
        .equals(value.Id)
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
          let itemStockCount = await getItemstockQtyindexDb(item.ItemId, item.GodownId);    //s
          item.ItemName = proDetails === undefined ? "" : proDetails.ItemName;
          item.unit = unitName;
          item.stock = itemStockCount;    //s
          list.push(item);

          console.log(item.ItemId, 'hhhhhhhhhhhhhh', itemStockCount, 'ItemStock in getItems in PurchaseInvoice')
        }
      }
      // console.log(items,'itemsitemsitemsitems')
      console.log(list, 'listssssss')

      const itemarr = list.map((item) => {
        return {
          ...item,
          InvoiceId: item.InvoiceId,
          ItemId: item.ItemId,
          isaltrate: item.isaltrate,
          Quantity: parseInt(item.Quantity),
          altqty: item.altqty,
          godown: item.Godown,
          stock: item.stock,   //s
          BatchNumber: item.BatchNumber,
          SerialNumber: item.SerialNumber,
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
        //   items: itemarr,
      });
      console.log(itemarr, "itemarrrrrrrrrrrrrr")
      setSelectedItems(itemarr)
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
    if (id) {
      const Coid = await db.stateMaster
        .where("StateId")
        .equals(id)
        .first()
        .then()
        .catch((err) => console.log(err));
      return Coid.CountryId;
    } else {
      return "";
    }

  };
  const saveData = async () => {
    // console.log(createObj,'saveData created obj')
    const saveObj = {
      // Number(createObj.InvoiceNo)   // Removing Leading Zeros
      InvoiceNo: createObj.InvoiceNo,
      InvoiceDate: createObj.InvoiceDate,
      PartyId: parseInt(createObj.PartyId),
      // PartyId: updateEvent === false ? pId.Id : createObj.PartyId,   // from indent
      invoicetype: 1,
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
      CreatedBy: localStorage.getItem("UserId"),
      CreatedOn: new Date(),
      seriesid:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      seriesvouchertype:
        seriesandVoucher.voucherId === "" ? "" : seriesandVoucher.voucherId,
    };

    if (!saveEdit) {
      // console.log({ ...saveObj, new: 1, update: 0 }, "ouosoaoauoaahahah");
      // saveItem();
      db.PurchaseInvoice.add({ ...saveObj, new: 1, update: 0 })
        .then((update) => {
          // console.log(update,'updateupdateupdateupdateupdateupdate')
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
            // P from indent start
            restData();
            // P from indent ends
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const saveItem = async (id) => {
    // var bmdata = await db.BatchMaster.toArray()
    // var lastBatchId = await getLastId('BatchMaster','batchId');
    const lastBatchId = await db.BatchMaster.reverse().limit(1).toArray()
      .then(value => value[0].batchid)
      .catch((err) => console.log(err));


    // var bmdataA = await db.BatchMaster.toArray().reverse().limit(1)
    setRequiredObj(reqObj)
    console.log(selectedItems, 'selectedItems selectedItems in saveItem')
    // const itemArray = createObj.items.map((item) => {
    console.log(SerialNumber, "Serial number in saveItem")
    const itemArray = selectedItems.map((item, index) => {
      const saveItemObj = {
        InvoiceId: id,
        ItemId: item.ItemId,
        BatchId: item.BatchParentId,
        isaltrate: item.isaltrate,
        Quantity: parseInt(item.Quantity),
        altqty: item.altqty,
        BatchNumber: BatchNumber,
        // SerialNumber: item.SerialNumberDetail,
        SerialNumber: SerialNumber,
        Godown: item.godown,
        GodownId: item.godownId,
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
        MRP: item.MRP
      };
      // P Starts
      // BatchMaster:
      // "++id,batchid,batchno,batchdate,lotno,branchid,itemid,manufacturingdate,expirydate,seriesid,seriesno,seriescode,editlog,iscancelled,createdon,alteredon",
      // BatchDetail:
      // "++id,batchdetailid,batchid,stockid,entrytype,entryid,entrydetailid,itemid,storeid,mrp,inqty,outqty,inaltqty,outaltqty,createdon",

      // .reverse()
      console.log(lastBatchId, 'bmdatabmdatabmdata in this same data');
      // console.log(bmdataA,'bmdatabmdatabmdata in this same data');


      // batch_id: batch_item_id,
      // item_name: batch_item_name,
      // item_code: batch_item_code,
      // batch_number: batchNumber,
      // lot_no: lotNumber,
      // qty_in: invoiceQuantity

      // item_name: '',
      // item_code: '',
      // lot_no: '',
      // qty_in: '',
      // batch_date: '',
      // mfg_date: '',
      // expiry_date: '',
      // mrp: ''

      // await db.BatchMaster.add({ 
      //   batchid:lastBatchId + index + 1,
      //   batchno:item.BatchNumberDetail.batch_number,
      //   batchdate:item.BatchNumberDetail.batch_date,
      //   lotno:item.BatchNumberDetail.lot_no,
      //   branchid:'',
      //   itemid:item.BatchNumberDetail.batch_id,
      //   manufacturingdate:item.BatchNumberDetail.mfg_date,
      //   expirydate:item.BatchNumberDetail.expiry_date,
      //   seriesid:'',
      //   seriesno:'',
      //   seriescode:'',
      //   editlog:'',
      //   iscancelled:'',
      //   createdon:'',
      //   alteredon:''
      //  })
      // .then((update) => {
      //   console.log(update,'updateupdateupdateupdateupdateupdate saveItem')
      //   // if (update) {
      //   //   saveItem(update);
      //   // }
      // })
      // .catch((err) => console.log(err));

      // P Ends

      if (saveEdit) {
        saveItemObj.id = item.id;
        saveItemObj.InvoiceId = item.InvoiceId;
        return saveItemObj;
      } else {
        return saveItemObj;
      }
    });

    console.log(itemArray, 'itemArray in save item')
    if (itemArray) {
      if (!saveEdit) {
        db.PurchaseInvoiceDetail.bulkAdd(itemArray)
          .then((update) => {
            if (update) {
              alert("data save successfully");
              // P from indent start
              restData();
              // P from indent ends
              refresh();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
        // P Starts
        const saveRes = await fn_PurchaseInvoice(itemArray, id, pageNav.formid)
        // P Ends
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
  // start______________________________________________________________



  const handleOpen = () => {
    setOpen(true);
  };
  /**
   *close Item popup
   */
  const handleClose = () => {
    setOpen(false);
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };

  const ObjItem = async (itemObj) => {
    let object = await getItemDetailwithTax(itemObj);
    // console.log(x,"array")
    // const object = itemObj.map((o) => {
    //   return {
    //     ...o,
    //     remark: "",
    //     RequiredQty: 0,
    //     RequiredAltQty: 0,
    //     Priority: "",
    //   };
    // });
    return object;
  };

  const getCheckedRows = (res) => {
    setGetcheckedRows(res);
  };

  const okSubmit = async () => {
    console.log(getcheckedRows,'getcheckedRowsgetcheckedRowsgetcheckedRows');
    const ids = getcheckedRows.map((a) => {
      return a.ItemId;
    });

    const objget = await ObjItem(getcheckedRows);
    // console.log(objget,"ddddddddddd")
    // console.log(objget,'idsidsidsidsidsidsidsidsidsids')
    if (objget.length > 0) {
      if (ids) {
        setCheckedItem(ids);

        if (!selectedItems) {
          // let newArray =await getItemDetailwithTax(objget)
          setSelectedItems(objget);
        } else {
          const results = objget.filter(
            ({ ItemId: id1 }) =>
              !selectedItems.some(({ ItemId: id2 }) => id2 === id1)
          );

          const results2 = selectedItems.filter(
            ({ ItemId: id1 }) => !objget.some(({ ItemId: id2 }) => id2 === id1)
          );
          // console.log(results2,'resltlllllllll')
          if (results.length > 0) {
            setSelectedItems((prevArray) => [...prevArray, ...results]);
          }
          if (results2.length > 0) {
            const results3 = selectedItems.filter(
              ({ ItemId: id1 }) =>
                !results2.some(({ ItemId: id2 }) => id2 === id1)
            );
            if (results3) {
              setSelectedItems(results3);
            }
          }
        }
      }
    }

    setOpen(false);
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };

  const updatedItemStock = async itemId => {
    const items = await db.PurchaseInvoiceDetail.where("ItemId")
      .equals(itemId)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    return items.length;
  }

  const getItems = async () => {
    let itemlist = await db.itemMaster.toArray();
    let productTemp = [];
    itemlist = await Promise.all(
      itemlist.map(async (item) => {
        let unitName = await db.unitMaster
          .where("Id")
          .equals(item.UnitName)
          .first();
        let itemGroup = await db.itemGroup.where("Id").equals(item.GroupId).first().then().catch(err => console.log(err));
        var itemStockCount = await getItemstockQtyindexDb(item.ItemId, null);
        // console.log(item.ItemId,'hhhhhhhhhhhhhh',itemStockCount,'ItemStock in getItems in PurchaseInvoice')

        // if(itemStockCount > 0){
        productTemp.push({
          ...item,
          id: item.Id,
          GroupName: itemGroup.GroupName,
          unit: unitName.UnitName,
          Stock: itemStockCount,
          // Stock: await updatedItemStock(item.Id),
        })
        // }
        return {
          ...item,
          id: item.Id,
          GroupName: itemGroup.GroupName,
          unit: unitName.UnitName,
          Stock: itemStockCount,
          // Stock: await updatedItemStock(item.Id),
        };
      })
    );
    var pTempSorted = productTemp.sort((a, b) => parseFloat(b.Stock) - parseFloat(a.Stock));
    setItemList(pTempSorted);
    // setItemList(itemlist);
  };



  const restData = () => {
    setCreateObj({ ...Obj, PurchaseInvoiceDate: new Date() });
    // setErrorObj(reqObj);
    setRequiredObj(reqObj);
    setVal("refresh");
    setUpdatedObj({});
    setEditcoulmn(false);
    setUpdateEvent(false);
    // setCustomerList();
    setSeriesandVoucher({
      seriesId: "",
      voucherId: "",
    });
    setCheckedItem([]);
    setSelectedItems([]);
  };

  // const selectedRow = (item) => {
  //   setSelectedItemRow(item);
  // };



  // const updateItem = useCallback(() => {
  //   // console.log(selectedItems, "selectedItems");
  //   // console.log(updatedObj, "updatedObj");
  //   // console.log(selectedItemRow, "updatedObj");
  //   const update = selectedItems.map((item) => {
  //     if (item.ItemId === selectedItemRow.ItemId) {
  //       return { ...item, ...updatedObj };
  //     } else {
  //       return item;
  //     }
  //   });
  //   setSelectedItems(update);
  //   setUpdatedObj({});
  // }, [updatedObj, selectedItemRow]);

  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(codeFocus);
        }
      }
      if (e.key === "Enter" && batchModalShow == false &&  serialModalShow == false) {
        e.preventDefault();
        // updateItem();
          updateAction();
        setEdit(false);
      }
      // myObj).length;
      // if(Object.keys(column.map(f => f.field == 'ItemName')).length > 0) {
        
          
            if (e.ctrlKey && (e.key === "f" || e.key === "F")) {
              e.preventDefault();
              if (val === "add" || val === "edit") {
                // if(ctrlF){
                  handleOpen();
                // }
              }
            }
          
      // }     
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    val,
    createObj,
    codeFocus,
    itemList,
    getcheckedRows,
    checkedItem,
    selectedItems,
    selectedItemRow,
    updatedObj,
    edit,
    // errorObj, 
    requiredObj, // replace errObj with requireObj
    // customerList,
    updateEvent,
    selectedTblRow,
    updateAction
  ]);



  //end______________________________________________________


  // useEffect(() => {
  //   const getKey = (e) => {
  //     if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
  //       e.preventDefault();
  //       setDropDownOption(codeFocus);
  //     }

  //     if (e.key === "Enter") {
  //       e.preventDefault();
  //       updateAction();
  //       // setEdit(false);
  //     }
  //   };
  //   window.addEventListener("keydown", getKey);
  //   return () => {
  //     window.removeEventListener("keydown", getKey);
  //   };
  // }, [createObj, selectedTblRow, updateAction, codeFocus, updatedObj]);

  const setBatchChildDetailF = batch_id => {
    // alert(batch_id,'batch_id')
    console.log(batchChildNumberList,'in set fun batchChildNumberList')
    var bcl = batchChildNumberList && batchChildNumberList.map(BC => (Number(BC.batchid) == Number(batch_id)) && BC);
    console.log(bcl, 'bclbclbclbcl')
    setCurrentBatchChildList(bcl)
    setBatchChildDetailModal(true)
  }

  const setBatchSerialDetailF = (batch_id,batch_detail_id) => {
    // alert("kjhkjhkj")
    // console.log(serialNumberList, 'serialNumberListserialNumberList')
    // console.log(batch_id, 'batch_id')
    var snt = batchChildNumberList && batchChildNumberList.find((SN) => ( (SN.batchid == batch_id) && (SN.batchdetailid == batch_detail_id) ) && SN.SerialDetail );
    console.log(snt, 'sntsntsntsnt')
    setBatchChildDetailModal(false);
    setCurrentSerialNumber(snt.SerialDetail)
    setBatchSerialDetailModal(true)
  }
  const para = { val, change_state, disabledAction };



  // useEffect(()=>{
  //   // var i = checkedArray.indexOf(item.id);
  //   // if (i > -1) {
  //     //   checkedArray.splice(i, 1); // 2nd parameter means remove one item only
  //     // }

  //     // console.log("useEffect fires")
  //   // pos = myArray.map(function(e) { return e.hello; }).indexOf('stevie');
  //   // var pos = batchNumberList.map(function(e) { return e.batch_id; }).indexOf("batch_id");



  //   let i = batchNumberList.findIndex(x => x.batch_id == x.batch_id)
  //   if (i > -1) {
  //     batchNumberList.splice(i, 1); // 2nd parameter means remove one item only
  //     // setUpdatedBatchList(batchNumberList,"batchNumberLsit updated")
  //     console.log(batchNumberList,"batchNumber list in conditin")
  //   }
  //   console.log(i,"posssssssss")

  //   // var i = batchNumberList.indexOf(batchNumberList[0]?.batch_id);
  //   // console.log(i,"iiiiiiiiii")
  //   // if (i > -1) {
  //     //   batchNumberList.splice(i, 1); // 2nd parameter means remove one item only
  //     //   console.log(batchNumberList,"batchNumberList in if")
  //     // }
  //   },[batchNumberList])

  //   // console.log(updatedBatchList,"updatedBatccList")
  //   console.log(batchNumberList, "3333333333333 outside")




  console.log(createObj,'createObjcreateObjcreateObjcreateObjcreateObjcreateObjcreateObjcreateObj')
  // console.log(updatedObj,'updatedObjupdatedObjupdatedObjupdatedObjupdatedObjupdatedObjupdatedObj')




  const [updatedBatchList, setUpdatedBatchList] = useState([]);

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
                  </div>
                </div>
              </div>
              <div className="col w35"></div>
            </div>
          </div>

        { open && val !== "view" ? (
          <div className="modalPopUp">
              <div className="modalPopUPin">  
                <CustomTable
                  coulmn={coulmn_popup}
                  data={itemList}
                  overFlowScroll={true}
                  checkbox={true}
                  selectedRows={checkedItem}
                  getCheckedItem={(res) => getCheckedRows(res)}
                  Footer={true}
                  filter={true}
                  // defaultFilterMethod={(filter, row) =>
                  //   String(row[filter.id]) === filter.value} //P
                />
                <div className="popupButton">
                  <button
                    onClick={() => okSubmit()}
                    className="btn btnGreen mr-5 mlAuto"
                  >
                    <Text content="Ok" />
                  </button>
                  <button onClick={() => handleClose()} className="btn btnRed">
                    <Text content="Cancel" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* {console.log(BatchNumber.batch_id, 'BatchNumber.batch_id')} */}
          {console.log(selectedItems, "selectedItems selectedItems")}
          {console.log(createObj.itemList, "createObj.itemList")}

          {val && val !== "view" ? (

            <div>
              <BatchModal
                show={batchModalShow}
                onHide={() => setBatchModalShow(false)}
                onClickOk={setBatchNumber}
                ItemDetail={selectedTblRow}
                onChangedInvoiceQuantity={invoiceQuantity}
                batchMRP={mrpValue}
                didBatchSubmit={setBatchSubmit}
                parentExists={ choosenBatchParent && choosenBatchParent != '' ? true : false }
                parent={choosenBatchParent}
              />

              <SerialModal
                show={serialModalShow}
                onHide={() => setSerialModalShow(false)}
                onClickOk={setSerialNumber}
                onChangedInvoiceQuantity={BatchNumber?.qty_in ? BatchNumber.qty_in : invoiceQuantity}
                ItemDetail={selectedTblRow}
                BatchID={BatchNumber}
                // BatchID={SerialNumber.batch_id}
                SerialsBatchNumber={BatchNumber.batch_number}
              />

               <BatchChildDetailModal
                show={batchChildDetailModal}
                onHide={() => setBatchChildDetailModal(false)}
                cursor={'pointer'}
                BatchChildDetail={currentBatchChildList}
                ScListF={setBatchSerialDetailF}
              />

              <BatchSerialDetailModal
                show={batchSerialDetailModal}
                onHide={() => setBatchSerialDetailModal(false)}
                cursor={'pointer'}
                BatchSerialDetail={CurrentSerialNumber}
              />
              
              <ExistsModal
                show={batchParentExistModal}
                onHide={() => setBatchParentExistModal(false)}
                onClickNo = {
                        (e) => {
                            setBatchModalShow(e)
                            setChoosenBatchParent('')
                        } 
                      }
                onClickYes={setBatchParentListModalShow}
                // ItemDetail={selectedTblRow}
                // onChangedInvoiceQuantity={invoiceQuantity}
                // didBatchSubmit={setBatchSubmit}
              />

               <BatchParentListModal
                show={batchParentListModalShow}
                onHide={() => setBatchParentListModalShow(false)}
                itemDetail={selectedTblRow}
                checkedParent={setChoosenBatchParent}
                batchPopUp={setBatchModalShow}
                batchListOkClicked={setBatchParentListOk}
              />

            </div>
          ) : (
            <div>
            <BatchChildDetailModal
              show={batchSerialDetailModal}
              onHide={() => setBatchSerialDetailModal(false)}
              cursor={'pointer'}
              BatchSerialDetail={CurrentSerialNumber}
            />
            <BatchSerialDetailModal
              show={batchSerialDetailModal}
              onHide={() => setBatchSerialDetailModal(false)}
              cursor={'pointer'}
              BatchSerialDetail={CurrentSerialNumber}
            />
            </div>
          )}

          <div className="row">
            <div className="col mt-2 mb-2">
              <div className="tableBox">
                <CustomTable
                  coulmn={column}
                  data={selectedItems}
                  // data={createObj.items}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={createObj.itemList}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  // itemAdd={addbtn === true ? () => addItem() : false}
                  refreshTable={refreshtbl}
                  editbtnText="Add Item detail"
                />
              </div>
            </div>
          </div>
          <div className="subtabview">
            <ul style={{ marginTop: "0px" }}>
              <li className={sabtabVal === "taxInfo" ? "active" : ""} onClick={(e) => subtab('taxInfo')}>Tax Amount</li>
              <li className={sabtabVal === "billingInfo" ? "active" : ""} onClick={(e) => subtab('billingInfo')}>Billing Info</li>
              <li className={sabtabVal === "lot_and_batch" ? "active" : ""} onClick={(e) => subtab('lot_and_batch')}>Lot/Batch Detail</li>
            </ul>
          </div>
          <div className="tabBox withsubtab">
            <div className="box" style={{ display: sabtabVal === "billingInfo" ? "block" : "none" }}>
              <BillingInfo
                BillingObj={createObj}
                onchange={(e) => onchange(e)}
                requiredObj={requiredObj}
                val={val}
              />
            </div>
            <div className="box" style={{ display: sabtabVal === "taxInfo" ? "block" : "none" }}>
              <TaxInfo taxObject={createObj.taxpage} />
            </div>

            <div className="box" style={{ display: sabtabVal === "lot_and_batch" ? "block" : "none" }}>
              {/* {if (val === "add"){
                
                <BatchNumberList 
                BnList = {batchNumberList}
                SnListF = {setBatchSerialDetailF} 
              />
            } 
              else if(val = "view"){
                <BatchNumberList 
                BnList = {selectedItems}
                SnListF = {setBatchSerialDetailF}
              }
              else if(val  = "edit"){
                  <BatchNumberList 
                  BnList = {selectedItems}
                  SnListF = {setBatchSerialDetailF}
                }
              } */}
            {/* SnListF setBatchSerialDetailF*/}
              {val === "add" ? <BatchNumberList
                BnList={batchNumberList}
                BcListF={setBatchChildDetailF}
              />
                : val === "view" ? <BatchNumberList
                  BnList={selectedItems.BatchNumber}
                  BcListF={setBatchChildDetailF}
                />
                  : val === "edit" ?
                    <BatchNumberList
                      BnList={selectedItems.BatchNumber}
                      BcListF={setBatchChildDetailF}
                    />
                    : ("")
              }
            </div>
          </div>


          <div className="box blueBg" style={{ float: "left", width: "100%" }}>
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
}
export default PurchaseInvoice;