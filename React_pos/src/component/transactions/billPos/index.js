import React, { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from "react";
import Table from "./table";
import "./billPos.scss";
import CommonFormAction from "../../common/commonFormAction";
import COLUMNS from "./columns";
import VIEWCOLUMNS from "./viewColumn";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Timer from "./timer";
//import Print from "./print";
import CustomTable from "../../common/table";
import db from "../../../datasync/dbs";
import Text from "../../common/text";
import ItemPopup from "../../common/itemPopup";

import BoughtSerialsBatchItemListModal from "./BoughtSerialsBatchItemListModal";

import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  fnCRoundOff,
  getItemstockQtyindexDb,
  globalsettingValueById,

  getBatchOrSerialNumberById
} from "../../common/commonFunction";
import {
  fn_GetItemMaster,
  fn_GetCustomerMaster,
  fn_SaveInvoice,
  fn_UpdateInvoice,
  // fn_GetSalesInvoice,
  fn_GetItemMasterDetail,
  getViewInvoiceDetails,
  fn_GetHoldSalesInvoice,
  fn_GetSaleInvoiceId,
  getEditInvoiceDetails,
  fn_GetLastSalesInvoice,
} from "./transactionDB";

// P Starts
import SerialListModal from "./SerialListModal";

import { Button } from "react-bootstrap";
import { LinkedCamera } from "@material-ui/icons";
// P Ends



const BillPos = ({ pageNav }) => {
  const billinfo = {
    bState: "",
    bCountry: "",
    bAddress: "",
    bGSTN: "",
    sState: "",
    sCountry: "",
    sAddress: "",
    sGSTN: "",
  };
  const reff = useRef();
  const [billingInfo, setBillingInfo] = useState(billinfo);
  const [stateList, setStateList] = useState([]);
  const [viewTaxinfo, setViewTaxinfo] = useState(false);
  const [viewBillinginfo, setViewBillinginfo] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [billCancel, setBillCancel] = useState(false);
  //const [selectedProduct, setProduct] = useState(null);
  const [product, setProducts] = useState([]);
  const [newInvoice, setNewInvoice] = useState(0);
  const [dropDownOption, setDropDownOption] = useState("");
  const [codeFocus, setCodeFocus] = useState("");
  const [invoiceId, setInvoiceId] = useState(0);
  const [serverInvoiceId, setServerInvoiceId] = useState(0);
  const [checkedItem, setCheckedItem] = useState();
  const [checkedItemSerial, setCheckedItemSerial] = useState();
  const [checkedItemPopup, setCheckedItemPopup] = useState([]);
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [slbatchArray, setSlbatchArray] = useState([]);
  const [slbatchArraysts, setSlbatchArraysts] = useState(false);
  const [slserialArray, setSlserialArray] = useState();
  // const [getcheckedRowsBatch, setGetcheckedRowsBatch] = useState();
  const [getcheckedRowsSrel, setGetcheckedRowsSrel] = useState();
  // const [selectRowBatch,setSelectRowBatch]=useState();
  // const [updateBatch,setUpdateBatch]=useState();
  // const [edit, setEdit] = useState();
  // const [refreshtbl,setRefreshtbl] =useState();
  const [getcheckedRowsPop, setGetcheckedRowsPop] = useState();
  const [open, setOpen] = useState(false);
  const [itemSeriralList, setItemSeriralList] = useState([]);
  const [serialSts, setSerialSts] = useState(false);
  const [batchSts, setBatchSts] = useState(false);
  const [batchArray, setBatchArray] = useState([]);
  const [custdropdn, setCustdropdn] = useState(false);
  const [popbtntext, setPopbtntext] = useState("");
  const [popuptableitem, setPopuptableitem] = useState([]);

  const [footerState, setFooterState] = useState({
    totalQty: 0,
    mrpValue: 0,
    grossAmount: 0,
    totalDiscount: 0,
    totalTax: 0,
    totalAmount: 0,
    totalDiscountPerc: 0,
    amountDiscPerc: 0,
    roundOff: 0,
    finalAmount: 0,
    receivedAmount: 0,
    balanceAmount: 0,
    cashReceived: 0,
    tender: 0,
    igstAmount: 0,
    sgstAmount: 0,
    cgstAmount: 0,
  });

  console.log(footerState, "footerState 1")

  //const [actionLink, setActionLink] = useState();
  const [customerList, setCustomerList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowInfoId, setRowInfoId] = useState();
  // To-maintain icons state
  let [val, setVal] = useState("");
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [billDate, setBillDate] = useState(null);
  const [error, setError] = useState({ mobileError: "", salesPerson: "" });
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [saleInvoiceData, setSaleInvoiceData] = useState({});
  const [billSeries, setBillSeries] = useState(null);
  //const [billSeriesList, setBillSeriesList] = useState(null);
  const [inputRemarks, setInputRemarks] = useState("");
  const [billTime, setBillTime] = useState("");
  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });
  const [recallsts, setRecallsts] = useState(false);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });

  // Method to show n hide autoComplete
  const [method, setMethod] = useState(false);
  const [salesPersonList, setSalesPersonList] = useState([]);
  const [salesPerson, setSalesPerson] = useState({
    slpName: "",
    slpId: null,
    slpdropdown: true,
  });
  // To store data from indexDB for invoice n details
  const [data, setData] = useState({ salesInvoice: [], saleInvoiceDetail: [] });

  // To store data from input fields for invoice n details
  //const [newData, setNewData] = useState("");
  const [billingTypedata, setBillingTypedata] = useState([]);
  const [billingTypevalue, setBillingTypevalue] = useState("");
  const [influencerlist, setInfluencerlist] = useState([]);
  const [influencerValue, setInfluencerValue] = useState("");
  const [influencerId, setInfluencerId] = useState(null);
  const [prosts, setProsts] = useState(true);
  const [itemListPopup, setItemListPopup] = useState([]);
  const [itemPopup, setItemPopup] = useState(false);


  // P Starts
  const [serialListModalShow, setSerialListModalShow] = useState(false)
  const [batchListModalShow, setBatchListModalShow] = useState(false)
  const [selectedSerialList, setSelectedSerialList] = useState([])
  const [selectedBatchList, setSelectedBatchList] = useState([])
  const [batchNumberOfItem, setBatchNumberOfItem] = useState([])
  const [serialNumberOfItem, setSerialNumberOfItem] = useState([])

  const [purchasedBatchSerials, setPurchasedBatchSerials] = useState([]);
  const [purchasedBatchSerialsList, setPurchasedBatchSerialsList] = useState([]);
  const [boughtSerialItemsModal, setBoughtSerialItemsModal] = useState(false);
  const [boughtSerial, setBoughtSerial] = useState([]);

  // s.......................... start //        
  const [viewCoulmnState, setViewcoulmnState] = useState("add");         //s
  // s.......................... end //

  // console.log(purchasedBatchSerials, "purchasedBatchSerials purchasedBatchSerials")

  // let x = purchasedBatchSerialsList.filter((a) => a.batch_id !== newBatchObj.batch_id);
  // useLayoutEffect(() => {
  //   setPurchasedBatchSerialsList([...purchasedBatchSerialsList, purchasedBatchSerials]);
  //   console.log(purchasedBatchSerialsList,'purchasedBatchSerialsList purchasedBatchSerialsList')
  // },[]);
  // console.log(purchasedBatchSerialsList, 'purchasedBatchSerialsList purchasedBatchSerialsList')
  // removable
  const [soldItems, setSoldItems] = useState([]);
  // P Ends
  // To get state list
  const getStateList = async () => {
    let sList = await db.stateMaster.toArray();
    if (sList) {
      setStateList(sList);
    }
  };

  const statewiseTax = () => {
    const calcData = calcProductAndFooter(1, product);
    console.log()
    setFooterState(() => {
      return { ...calcData.footer };
    });
    setProducts(calcData.products);
  };

  const billinfoOnchange = (e) => {
    if (e.target.name === "bState") {
      if (e.target.value === "") {
        setBillingInfo({
          ...billingInfo,
          [e.target.name]: "",
          bCountry: "",
        });
      } else {
        let cId = stateList.find((a) => a.StateId === parseInt(e.target.value));
        setBillingInfo({
          ...billingInfo,
          [e.target.name]: e.target.value,
          bCountry: cId.CountryId,
        });
      }
    } else if (e.target.name === "sState") {
      if (e.target.value === "") {
        setBillingInfo({
          ...billingInfo,
          [e.target.name]: "",
          sCountry: "",
        });
      } else {
        let cId = stateList.find((a) => a.StateId === parseInt(e.target.value));
        setBillingInfo({
          ...billingInfo,
          [e.target.name]: e.target.value,
          sCountry: cId.CountryId,
        });
      }
    } else {
      setBillingInfo({
        ...billingInfo,
        [e.target.name]: e.target.value,
      });
    }
  };
  useEffect(() => {
    statewiseTax();
  }, [billingInfo.bState, billingInfo.sState]);
  // To get data from indexDB for invoice n details
  const getDetails = async () => {
    let d = await getViewInvoiceDetails();
    setData({ ...d }); //
  };
  const getEditDetails = async () => {
    let d = await getEditInvoiceDetails();
    setData({ ...d }); //
  };

  console.log(data, 'data of invoice')

  const [partyId, setPartyId] = useState(null);
  const [prevInvoiceDetail, setPrevInvoiceDetail] = useState({
    billSeries: "N/A",
    debitCard: "N/A",
    creditCard: "N/A",
    advAmount: "N/A",
    totalQty: "N/A",
    couponAmount: "N/A",
    otherAmount: "N/A",
    cashAmount: "N/A",
    billDate: "N/A",
    netAmount: "N/A",
    totalMrp: "N/A",
  });

  const [required, setRequired] = useState({});
  const slpList = async () => {
    const list = await db.salesPersonMaster.toArray();
    if (list) {
      setSalesPersonList(list);
    }
  };

  // To change icons state
  const change_state = async (arg) => {
    if (arg === "add") {
      setCustdropdn(true);
      fnBindProduct();
      cusotmerList();
      setRecallsts(false);
      getoucherList();
      getStateList();
      billingType();
      InfluencerData();
      slpList();
      discard();
      setBillDate(new Date());
      setViewcoulmnState("add");
      // getItems()
      return setVal(arg);
    }

    if (arg === "edit") {
      fnBindProduct();
      cusotmerList();
      setRecallsts(false);
      billingType();
      InfluencerData();
      getStateList();
      getEditDetails();
      slpList();
      discard();
      setMethod(true);
      setSalesPerson({
        ...salesPerson,
        slpdropdown: false,
      });
      setViewcoulmnState("edit");      //s
      // getItems()
      return setVal(arg);
    }

    if (arg === "view") {
      fnBindProduct();
      cusotmerList();
      getStateList();
      getDetails();
      discard();
      setSalesPerson({
        ...salesPerson,
        slpdropdown: false,
      });
      setMethod(true);
      setViewcoulmnState("view");       //s



      return setVal(arg);
    }

    if (arg === "save") {
      if (billCancel) {
        alert("This bill already cancelled you can not edit it.");
      } else {
        submit("save");
      }
    }

    if (arg === "refresh") {
      setViewcoulmnState("add");       //s
      setMethod(false);
      setRecallsts(false);
      setCustdropdn(false);
      discard();
      return setVal(arg);
    }

    if (arg === "print") {
      print();
      return;
    }
  };

  const columns = useMemo(() => COLUMNS, []);
  const viewcolumns = useMemo(() => VIEWCOLUMNS, []);

  const billingType = async () => {
    let value = await globalsettingValueById(531);
    if (value) {
      const billingTArray = await db.billingType
        .toArray()
        .then()
        .catch((err) => console.log(err));
      setBillingTypedata(billingTArray);
    }
  };

  const InfluencerData = async () => {
    let value = await globalsettingValueById(523);
    if (value) {
      const influencers = await db.Influencer.toArray()
        .then()
        .catch((err) => console.log(err));
      setInfluencerlist(influencers);
      //console.log(influencers);
    }
  };

  const fnBindProduct = async () => {
    const productListTemp = await fn_GetItemMaster();
    setItemListPopup(productListTemp);
    // const stocklist = await db.getItemStock.toArray();
    // if (productListTemp && productListTemp.length > 0) {
    //   let productTemp = [];
    //   for (var x of productListTemp) {
    //     const ItemStock = await getItemstockQtyindexDb(x.ItemId);
    //     if (ItemStock > 0) {
    //       //productTemp.push({ value: x.ItemId, label: x.ItemName });
    //       productTemp.push(x);
    //     }
    //   }
    //   console.log(productTemp,"productTemp")
    //   setItemListPopup(productTemp);

    // }
  };

  const ShowItemList = () => {
    setItemPopup(true);
  }

  async function fnGetData() {
    //await fnBindProduct();
    // const CustomerData = await fn_GetCustomerMaster();
    // setCustomerList(CustomerData);
    await fnShowSalesInvoice();
  }

  const cusotmerList = async () => {
    const CustomerData = await fn_GetCustomerMaster();
    setCustomerList(
      CustomerData.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
    );
  };

  const getFormateDate = (date) => {
    let dateTemp = "";
    let month = "";
    let day = "";
    try {
      if (date) {
        dateTemp = new Date(date);
        month = ("0" + (dateTemp.getMonth() + 1)).slice(-2);
        day = ("0" + dateTemp.getDate()).slice(-2);
        dateTemp = [day, month, dateTemp.getFullYear()].join("-");
      }
    } catch (error) { }
    return dateTemp;
  };

  const getKey = (e) => {
    if (codeFocus) {
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setDropDownOption(codeFocus);
      }
    }
    if (e.key === "F9") {
      e.preventDefault();
      if (rowInfoId) {
        removeItemRow(rowInfoId);
      }
    }
  };
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let Tcount = await db.salesInvoice
          .where("seriesid")
          .equals(0)
          .toArray();
        let count =
          Tcount.length > 0 ? Tcount.filter((a) => a.ishold !== "true") : [];
        let val = {
          series: "",
          seriesId: 0,
          sCount: 0,
          digit: 5,
          dbcount: count,
        };
        let sr = await getseriesNo(val, pageNav.formid);
        setBillSeries(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let Tcount =
        series.seriesId === ""
          ? await db.salesInvoice.where("seriesid").equals(0).toArray()
          : await db.salesInvoice
            .where("seriesid")
            .equals(series.seriesId)
            .toArray();
      let count =
        Tcount.length > 0 ? Tcount.filter((a) => a.ishold !== "true") : [];
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      setBillSeries(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let Tcount =
        series.seriesId === ""
          ? await db.salesInvoice.where("seriesid").equals(0).toArray()
          : await db.salesInvoice
            .where("seriesid")
            .equals(series.seriesId)
            .toArray();
      let count =
        Tcount.length > 0 ? Tcount.filter((a) => a.ishold !== "true") : [];
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      setBillSeries(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  useEffect(() => {
    fnGetData();
  }, [val]);
  useEffect(() => {
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [codeFocus, dropDownOption, rowInfoId, custdropdn]);

  const handleProductChange = async (selectedOption) => {
    console.log(selectedOption, "selectedOption")
    setDropDownOption("");
    if (selectedOption && selectedOption.value > 0) {
      //setProduct(selectedOption.value);
      let itemMasterDetail = await fn_GetItemMasterDetail(
        selectedOption.value,
        getFormateDate(billDate)
      );

      const calcData = calcProductAndFooter(
        selectedOption.value,
        itemMasterDetail,
        "new"
      );
      setFooterState(() => {
        return { ...calcData.footer };
      });
      setProducts(calcData.products);
      setProsts(false);
      setTimeout(() => {
        setProsts(true);
      }, 100);
      console.log(product, "product")
    }
  };

  const calcProductAndFooter = (selectedOption, selectedProd, type) => {
    // alert("selectedOption,selectedProd")
    console.log(selectedOption, "vvv  selectedOption in calcProductAndFooter")
    console.log(selectedProd, "aaa  selectedProd in calcProductAndFooter")
    console.log(type, "type in calcProductAndFooter")
    console.log(product, "product in calcProductAndFooter")

    try {
      if (selectedOption > 0) {
        let salePrice = 0;
        let discountMPer = 0;
        let discountAPer = 0;
        let discountPer = 0;
        let discount = 0;
        let amountWithoutTax = 0;
        let sgstP = 0;
        let sgst = 0;
        let cgstP = 0;
        let cgst = 0;
        let igstP = 0;
        let igst = 0;
        let netTaxAmount = 0;
        let grossAmount = 0;
        let spMultiplyQ = 0;
        let isExclusive = false;
        let discountM = 0;
        let discountA = 0;

        let selectedProducts = [];
        let quantity = 0;
        let mrp = 0;
        let soldBatchSerials = {}  //P
        let amount = 0;
        let prevProducts = product;
        let roundOff = 0;
        let amountDiscPerc = 0;

        let totalQty = 0;
        let totalMrp = 0;
        // let storeid = 0;
        let igstAmount = 0;
        let totalSgstAmount = 0;
        let totalCgstAmount = 0;
        let totalIgstAmount = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        let totalDiscountPerc = 0;
        let finalAmount = 0;
        let totalAmount = 0;
        let totalGrossAmount = 0;
        //not implemented this time
        let receivedAmount = 0;
        let balanceAmount = 0;
        let cashReceived = 0;
        let tender = 0;

        //prevproduct with selected product making single array
        selectedProducts = Array.isArray(selectedProd)
          ? selectedProd
          : [selectedProd];

        console.log(purchasedBatchSerials, 'purchasedBatchSerials in calProductaAndFooter ')
        console.log(selectedProd, ' selectedProd selectedProd in cal faor')
        // selectedProd(...selectedProd,{'soldBatchSerials':purchasedBatchSerials})
        // purchasedBatchSerials && selectedProducts.map(SP => {
        //   if(SP.ItemId === purchasedBatchSerials.itemID){
        //       SP.soldBatchSerials = purchasedBatchSerials;
        //   }
        //  })
        console.log(selectedProd, ' selectedProd selectedProd in cal faor after')
        let spt = Array.isArray(selectedProd) ? selectedProd : [selectedProd];
        console.log(prevProducts, 'prevProducts in calProductaAndFooter')
        let tempProduct = prevProducts.find((m) => m.ItemId === selectedOption);

        if (
          type === "new" &&
          !(tempProduct && Object.keys(tempProduct).length > 0)
        ) {
          selectedProducts = [...prevProducts, ...spt];
        }
        else if (
          type === "new" &&
          tempProduct &&
          Object.keys(tempProduct).length > 0
        ) {
          selectedProducts = prevProducts;
        }
        console.log(selectedProducts, ' selectedProducts in cal footer ')
        selectedProducts = selectedProducts.map((item) => {
          item = fn_CheckItem(
            item,
            type === "new",
            selectedOption,
            prevProducts
          );

          console.log(item, ' item in cal footer ')

          item.soldBatchSerials = purchasedBatchSerials && (item.ItemId === purchasedBatchSerials.itemID)
            ? purchasedBatchSerials
            : {}    // P
          //each item calc
          sgstP =
            billingInfo.sState === billingInfo.bState && item.sgstRate > 0
              ? convertToFloat(item.sgstRate)
              : 0;
          cgstP =
            billingInfo.sState === billingInfo.bState && item.cgstRate > 0
              ? convertToFloat(item.cgstRate)
              : 0;
          igstP =
            billingInfo.sState !== billingInfo.bState && item.igstRate > 0
              ? convertToFloat(item.igstRate)
              : 0;
          quantity = item.quantity > 0 ? parseInt(item.quantity) : "";
          mrp = item.mrp > 0 ? convertToFloat(item.mrp) : 0;

          salePrice = item.Rate > 0 ? convertToFloat(item.Rate) : mrp;
          discountMPer =
            item.manualdiscountper > 0
              ? convertToFloat(item.manualdiscountper)
              : 0;
          spMultiplyQ = quantity * convertToFloat(salePrice);
          discountM =
            (convertToFloat(spMultiplyQ) * convertToFloat(discountMPer)) / 100;
          discountA =
            (convertToFloat(spMultiplyQ) * convertToFloat(discountAPer)) / 100;
          discountPer =
            convertToFloat(discountMPer) + convertToFloat(discountAPer);
          isExclusive = item.istaxinclusive;
          // gross amount formulla=
          // sp-dm-(sp-dm)*(cgstp+sgstp+igstp)/(100+cgstp+sgstp+igstp)
          discount =
            (convertToFloat(spMultiplyQ) * convertToFloat(discountPer)) / 100;
          grossAmount = isExclusive
            ? fn_GrossAmount(spMultiplyQ, discount, cgstP, sgstP, igstP)
            : spMultiplyQ;
          amountWithoutTax =
            convertToFloat(grossAmount) - convertToFloat(discount);
          sgst = isExclusive
            ? fn_Tax(sgstP, grossAmount)
            : fn_Tax(sgstP, amountWithoutTax);
          cgst = isExclusive
            ? fn_Tax(cgstP, grossAmount)
            : fn_Tax(cgstP, amountWithoutTax);
          igst = isExclusive
            ? fn_Tax(igstP, grossAmount)
            : fn_Tax(igstP, amountWithoutTax);
          netTaxAmount =
            convertToFloat(sgst) + convertToFloat(cgst) + convertToFloat(igst);
          amount =
            convertToFloat(amountWithoutTax) + convertToFloat(netTaxAmount);

          //total calc
          totalQty += quantity;
          totalMrp += convertToFloat(mrp) * quantity;
          totalAmount += convertToFloat(amount);
          totalDiscount += convertToFloat(discount);
          totalTax += convertToFloat(netTaxAmount);
          totalSgstAmount += convertToFloat(sgst);
          totalCgstAmount += convertToFloat(cgst);
          totalIgstAmount += convertToFloat(igst);
          totalGrossAmount += convertToFloat(grossAmount);
          //not implemented  this time
          receivedAmount += 0;
          balanceAmount += 0;
          cashReceived += 0;
          tender += 0;

          //item properties bind here
          item.quantity = quantity;
          item.mrp = mrp;
          item.grossamount = fixedToLength(salePrice * quantity);
          item.Rate = fixedToLength(salePrice);
          item.amount = fixedToLength(amount);
          item.cgst = fixedToLength(cgst);
          item.sgst = fixedToLength(sgst);
          item.igst = fixedToLength(igst);
          item.totaltaxamount = fixedToLength(cgst + sgst + igst);
          item.manualdiscountamount = fixedToLength(discountM);
          return item;
        });

        //footer calc
        totalMrp = fixedToLength(totalMrp);
        totalGrossAmount = fixedToLength(totalGrossAmount); //grosstotal
        totalDiscount = fixedToLength(totalDiscount);
        totalTax = fixedToLength(totalTax);
        totalAmount = fixedToLength(totalAmount);

        amountDiscPerc =
          footerState.totalDiscountPerc > 0
            ? (convertToFloat(footerState.totalDiscountPerc) *
              convertToFloat(totalAmount)) /
            100
            : 0;
        const final =
          convertToFloat(totalAmount) - convertToFloat(amountDiscPerc);
        roundOff = final > 0 ? fnRoundOff(final) : 0;
        finalAmount = final + convertToFloat(roundOff);
        finalAmount = fixedToLength(finalAmount);
        totalDiscountPerc = fixedToLength(footerState.totalDiscountPerc);
        amountDiscPerc = fixedToLength(amountDiscPerc);
        roundOff = fixedToLength(roundOff);
        finalAmount = fixedToLength(finalAmount);
        //this not implemented this time
        receivedAmount = fixedToLength(receivedAmount);
        balanceAmount = fixedToLength(balanceAmount);
        cashReceived = fixedToLength(cashReceived);

        ///////////////////////////////////upto this not implemented this time
        totalSgstAmount = fixedToLength(totalSgstAmount);
        totalCgstAmount = fixedToLength(totalCgstAmount);
        totalIgstAmount = fixedToLength(totalIgstAmount);
        //igstAmount = fixedToLength(igstAmount);
        console.log(selectedProducts, ' selectedProducts in cal footer after agina ')
        const calcData = {
          footer: {
            totalQty,
            mrpValue: totalMrp,
            grossAmount: totalGrossAmount,
            totalDiscount,
            totalTax,
            totalAmount,
            totalDiscountPerc,
            amountDiscPerc,
            roundOff,
            finalAmount,
            receivedAmount,
            balanceAmount,
            cashReceived,
            tender,
            sgstAmount: totalSgstAmount,
            cgstAmount: totalCgstAmount,
            igstAmount: totalIgstAmount,
          },
          products: selectedProducts,
        };
        console.log(calcData, 'calcData calcData cal data');

        return calcData;
      }
    } catch (error) {
      //  console.log("calcerror", error);
    }
  };

  const fn_CheckItem = (item, isNew, selectedOption, prevProducts) => {
    let tempProduct = prevProducts.find((m) => m.ItemId === selectedOption);
    if (isNew && tempProduct && Object.keys(tempProduct).length > 0) {
      if (item.ItemId === tempProduct.ItemId) {
        item.quantity = parseInt(tempProduct.quantity) + 1;
        item.mrp = tempProduct.mrp > 0 ? convertToFloat(tempProduct.mrp) : 0;
        item.cgstRate =
          tempProduct.cgstRate > 0 ? convertToFloat(tempProduct.cgstRate) : 0;
        item.sgstRate =
          tempProduct.sgstRate > 0 ? convertToFloat(tempProduct.sgstRate) : 0;
        item.igstRate =
          tempProduct.igstRate > 0 ? convertToFloat(tempProduct.igstRate) : 0;
        item.Rate =
          tempProduct.Rate > 0 ? convertToFloat(tempProduct.Rate) : item.mrp;
        item.manualDiscountPerc =
          tempProduct.manualdiscountper > 0
            ? convertToFloat(tempProduct.manualdiscountper)
            : 0;
      } else {
        item.quantity = parseInt(item.quantity ? item.quantity : 1);
      }
    }
    return item;
  };

  // gross amount formulla=
  // sp-dm-(sp-dm)*(cgstp+sgstp+igstp)/(100+cgstp+sgstp+igstp)
  const fn_GrossAmount = (sp, dm, cgstP, sgstP, igstP) => {
    sp = convertToFloat(sp);
    dm = convertToFloat(dm);
    cgstP = convertToFloat(cgstP);
    sgstP = convertToFloat(sgstP);
    igstP = convertToFloat(igstP);
    return (
      sp -
      dm -
      ((sp - dm) * (cgstP + sgstP + igstP)) / (100 + cgstP + sgstP + igstP)
    );
  };

  const fn_Tax = (taxP, amount) => {
    taxP = convertToFloat(taxP);
    amount = convertToFloat(amount);
    return (taxP * amount) / 100;
  };

  const fixedToLength = (data) => {
    return data ? parseFloat(data).toFixed(2) : data;
  };

  const convertToFloat = (value) => {
    return value ? parseFloat(value) : value;
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function numberWithOutCommas(x) {
    return x > 0 ? x.replaceAll(",", "") : x;
  }
  const fnRoundOff = (n) => {
    let roundff = fnCRoundOff(n);
    return roundff;
  };

  const divNo = (n) => {
    let l = n.length;
    let p = 1;
    while (l > 0) {
      p *= 10;
      l--;
    }
    return p;
  };
  // const editItem = () => {
  //   setEdit(true);
  // };
  // const tableInputOnchangeBatch=(e)=>{
  //   console.log(selectRowBatch,"selectRowBatch.stock")
  //   if(e.target.value > parseInt(selectRowBatch.stock)){
  //     alert("item out of stock");
  //     setUpdateBatch({...updateBatch,[e.target.name]:""});
  //     return ""

  //   }else{
  //     setUpdateBatch({...updateBatch,[e.target.name]:e.target.value});
  //     return e.target.value
  //   } 
  // }
  // const selectedRowBatch=(item)=>{
  //   setSelectRowBatch(item)
  // }

  const selectedBatchArray = (array) => {
    // setSlbatchArray(array);
    if (slbatchArray.length > 0) {
      const arrayA = array.filter(({ batchid: b1 }) => !slbatchArray.some(({ batchid: b2 }) => b2 === b1));
      const arrayB = slbatchArray.filter(({ batchid: b1 }) => !array.some(({ batchid: b2 }) => b2 === b1));
      if (arrayA.length > 0) {
        const arrayC = [...slbatchArray, ...arrayA]
        setSlbatchArray(arrayC);
        console.log(arrayA, "arrayA")
        console.log(arrayC, "arrayC")
      }
    } else {
      setSlbatchArray(array);
    }
  }

  // coulmn={[
  //   { header: "Item Code", field: "ItemCode" },
  //   { header: "Item Name", field: "ItemName" },
  //   { header: "Batch No", field: "batchno" },
  //   { header: "Lot No", field: "lotno" },
  //   { header: "Stock", field: "stock" },
  //   { header: "Out Qty", field: "QtyOut" },
  //   { header: "Mfg Date", field: "manufacturingdate" },
  //   { header: "Exp. Date", field: "expirydate" },
  //   { header: "MRP", field: "PartyMobileNo" },
  //   { header: "Remarks", field: "PartyMobileNo" },
  //   { header: "Serial Detail", viewBtn: true, viewBtntext: "View Item" },
  // ]}

  // P Starts
  const purchasedItemsBatchSerials = async (items) => {
    // alert("purchasedItemsBatchSerials")
    console.log(purchasedBatchSerials, 'purchasedBatchSerials  purchasedBatchSerials');
    console.log(items, 'items in purchasedItemsBatchSerials');
    let boughtBatchesNumber = await purchasedBatchSerials.bought_batch.map(BB => {
      return {
        ...BB,
        id: BB.batch_id,
        ItemName: BB.item_name,
        ItemCode: BB.item_code,
        lotno: BB.lot_no,
        stock: BB.qty_in,
        QtyOut: purchasedBatchSerials.bought_serials.filter(bs => bs.batch_id == BB.batch_id).length,
        manufacturingdate: BB.mfg_date,
        expirydate: BB.expiry_date,
        batchno: BB.batch_number,
        MRP: BB.mrp,
        Remarks: items.find(i => i.ItemCode == BB.item_code).remark
      }
    });
    console.log(boughtBatchesNumber, 'boughtBatchesNumber')
    setSoldItems(boughtBatchesNumber);
    // setSoldItems(soldItems);
  }

  const purchasedItemsBatchSerialsForVE = async items => {
    console.log(items, 'items purchasedItemsBatchSerials_for_view')

    let itemsSold = [];

    let itemSoldDetail = await Promise.all(items.map(async item => {
      console.log(item, 'purchasedItemsBatchSerials')
      let boughtBatches = item.soldBatchSerials && item.soldBatchSerials.bought_batch;
      let serialDetail = item.soldBatchSerials && item.soldBatchSerials.bought_serials;
      console.log(boughtBatches, "batchBatches batchBatches")
      if (boughtBatches != undefined && boughtBatches != '' && Object.keys(boughtBatches).length > 0) {
        let boughtBatchesNumber = await Promise.all(boughtBatches.map(BB => {
          let soldBatches = {
            ...BB,
            id: BB.batch_id,
            ItemName: BB.item_name,
            ItemCode: BB.item_code,
            lotno: BB.lot_no,
            stock: BB.qty_in,
            QtyOut: item.soldBatchSerials.bought_serials.filter(bs => bs.batch_id == BB.batch_id).length,
            manufacturingdate: BB.mfg_date,
            expirydate: BB.expiry_date,
            batchno: BB.batch_number,
            MRP: BB.mrp,
            Remarks: item.remark
          };
          itemsSold.push(soldBatches)
          return {
            ...BB,
            id: BB.batch_id,
            ItemName: BB.item_name,
            ItemCode: BB.item_code,
            lotno: BB.lot_no,
            stock: BB.qty_in,
            QtyOut: item.soldBatchSerials.bought_serials.filter(bs => bs.batch_id == BB.batch_id).length,
            manufacturingdate: BB.mfg_date,
            expirydate: BB.expiry_date,
            batchno: BB.batch_number,
            MRP: BB.mrp,
            Remarks: item.remark
          }
        }));
        console.log(soldItems, "if solDItems")
        setSoldItems(itemsSold);

        // console.log(boughtBatchesNumber,'BB in purchasedItemsBatchSerials INNNNNNN')
        // return itemsSold;
        // }    
      } else {
        console.log(item, "item in else")
        let soldBatches = {
          // ...item,
          id: item.id,
          ItemName: item.ItemName,
          ItemCode: item.ItemCode,
          lotno: item.lotno,
          // stock: item.qtyin,
          // QtyOut: item.soldBatchSerials.bought_serials.filter(bs => bs.batch_id == item.batch_id).length,
          QtyOut: item.quantity,
          // manufacturingdate: item.mfg_date,
          // expirydate: item.expiry_date,
          batchno: item.batch_number,
          MRP: item.mrp,
          // Remarks: item.remark
        };
        console.log(soldBatches, "else soldBatches")
        itemsSold.push(soldBatches)
        // return {
        //   // ...item,TR-929689361101
        //   ItemName: item.ItemName,
        //   ItemCode: item.ItemCode,
        //   lotno: item.lotno, 
        //   // stock: item.qtyin,
        //   // QtyOut: item.soldBatchSerials.bought_serials.filter(bs => bs.batch_id == item.batch_id).length,
        //   QtyOut: item.quantity,
        //   // manufacturingdate: item.mfg_date,
        //   // expirydate: item.expiry_date,
        //   batchno: item.batch_number,
        //   MRP: item.mrp,
        //   // Remarks: item.remark
        // }
      };
      setSoldItems(itemsSold);
      console.log(soldItems, "else solDItems")

      // console.log(itemSoldDetail, 'boughtBatchesNumber boughtBatchesNumber')

      // setSoldItems(boughtBatchesNumber);
      // setSoldItems(itemsSold);
      // return boughtBatchesNumber;
    }));
  };
  // P Ends

  useEffect(() => {
    console.log(slbatchArray, "SlbatchArray")
  }, [slbatchArray])

  const batchPopup = async (rowData) => {
    // console.log(rowData,"rowData")
    let getbatchobj = await db.BatchMaster.where("itemid").equals(rowData[0].ItemId).toArray().then().catch(err => console.log(err));
    //  console.log(getbatchobj,"getbatchobj") 
    if (getbatchobj.length > 1) {
      const newArr = await Promise.all(getbatchobj.map(async (a) => {
        let stock = await db.BatchDetail.where("batchid").equals(a.batchid).first().then().catch(err => console.log(err))
        console.log(stock, "stock batchPopup")
        return { ...a, ItemId: a.id, stock: stock.inqty, ItemName: rowData[0].ItemName, ItemCode: rowData[0].ItemCode, storeid: stock.storeid }
      }))
      const fltrBystor = newArr.filter((a) => parseInt(rowData[0].storeid) === a.storeid);
      // console.log(fltrBystor,"fltrBystor")
      // console.log(newArr,"newArray")
      setItemPopup(false);
      setBatchArray(fltrBystor);
      setSerialSts(false);
      setBatchSts(true);
      setPopbtntext("Ok")
      // setRefreshtbl(true);
      // setTimeout(()=>{
      //   setRefreshtbl(false);
      // },500)  
      // setOpen(true);
    } else {
      // serialPopup(rowData);
    }
  }
  // const serialPopup=async(rowData)=>{
  //   let getsereilobj = await db.SerialMaster.where("itemid").equals(rowData[0].ItemId).toArray().then().catch(err => console.log(err));
  //    if(getsereilobj.length > 0){
  //       let items= getsereilobj.map((a)=>{
  //         return {...a,id:a.serialid,ItemId:a.serialid}
  //       })
  //       setItemSeriralList(items);
  //       setBatchSts(false);
  //       setSerialSts(true);

  //       setRefreshtbl(true);
  //     setTimeout(()=>{
  //       setRefreshtbl(false);
  //     },500) 
  //     setOpen(true); 
  //     }
  // }
  // const updateBatchAction=useCallback(()=>{
  //   if(batchSts===true){
  //     console.log(updateBatch,"updateBatch")
  //     console.log(selectRowBatch,"SelectRowBatch")
  //     const arr = batchArray.map((a)=>{
  //       if(selectRowBatch.batchid===a.batchid){
  //         return {...a,...updateBatch}
  //       }else{
  //         return a
  //       }  
  //     });
  //     setBatchArray(arr);
  //     setEdit(false);
  //   }
  // },[updateBatch,batchSts])
  // const updateBatchAction=()=>{
  //   console.log(updateBatch,"updateBatch")
  // }
  // useEffect(()=>{
  //   const getKey2 = (e) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault();
  //       updateBatchAction();
  //       // setEdit(false);
  //     }
  //   };
  //   window.addEventListener("keydown", getKey2);
  //   return () => {
  //     window.removeEventListener("keydown", getKey2);
  //   };

  // },[updateBatch,batchSts,updateBatchAction])
  // const OkBatchbtn=async()=>{
  //   console.log(batchArray,"batcharr")
  //   let getsereilobj = await db.SerialMaster.where("itemid").equals(batchArray[0].itemid).toArray().then().catch(err => console.log(err));
  //    console.log(getsereilobj,"asdasdasdasd")
  //   if(getsereilobj.length > 0){
  //       let items= getsereilobj.map(async(a)=>{
  //         let srDetail = await db.SerialDetail.where("serialid").equals(a.serialid)
  //         return {...a,id:a.serialid,ItemId:a.serialid}
  //       })
  //       setOpen(true);
  //       setItemSeriralList(items);
  //       setBatchSts(false);
  //       setSerialSts(true);
  //       setRefreshtbl(true);
  //     setTimeout(()=>{
  //       setRefreshtbl(false);
  //     },500)  
  //     }

  // }

  // P Starts
  const OkSerialbtn = () => {
    // console.log(checkedItemSerial, "gggggggggggggggg");
    setSerialSts(false);
    const x = slbatchArray.map((a) => {
      const findval = checkedItemSerial.find((f) => a.itemid === f.itemid);
      if (findval) {
        if (a.itemid == findval.itemid) {
          const count = checkedItemSerial.filter((f) => a.batchid === f.batchid);
          return { ...a, QtyOut: count.length, serialDetail: count }
        }
      } else {
        return a;
      }
    })
    // console.log(x, "xxxxxxxxxxxxxxxxxxxxxx")
    const updateProduct = product.map((p) => {
      const id = x.find((f) => f.itemid === p.itemid);
      if (id.length > 0) {
        const fltr = x.filter((fl) => fl.itemid === p.itemid);
        console.log(fltr, "lllllllllllllllllllllllll")
      }

    })
    setSlbatchArray(x)

    setCheckedItemSerial([]);
    setSlserialArray([]);
  }
  // P Starts

  // Rabjeet Sir OkSerialbtn fuc
  // const OkSerialbtn=()=>{ 
  //   console.log(checkedItemSerial,"gggggggggggggggg");
  //   setSerialSts(false);
  //   const x = slbatchArray.map((a)=>{
  //     const findval = checkedItemSerial.find((f)=> a.itemid === f.itemid);
  //     if(findval){
  //       if(a.itemid == findval.itemid){
  //         const count = checkedItemSerial.filter((f)=> a.batchid === f.batchid);
  //         return {...a,QtyOut:count.length,serialDetail:count}
  //       }
  //     }else{
  //       return a;
  //     } 
  //   })
  //   console.log(x,"xxxxxxxxxxxxxxxxxxxxxx")
  //   const updateProduct = product.map((p)=>{
  //     const id = x.find((f)=> f.itemid === p.itemid);
  //     if(id.length > 0){
  //       const fltr = x.filter((fl)=> fl.itemid === p.itemid) ;
  //       console.log(fltr,"lllllllllllllllllllllllll")
  //     }

  //   })
  //   setSlbatchArray(x)

  //   //setProducts
  //   //updateCalcData(1,s1)

  //   // const x = slbatchArray.map((a)=>{
  //   //   const findval = checkedItemSerial.find((f)=> a.batchid === f.batchid);
  //   //   console.log(findval,"findval")
  //   //   if(findval === undefined){
  //   //     console.log(findval,"findvalfindvalfindval")
  //   //     console.log(a,"a")
  //   //     return a
  //   //   }else{
  //   //     const count = checkedItemSerial.filter((f)=> a.batchid === f.batchid);
  //   //     console.log(count.length,"count.length")
  //   //     console.log(a,"a")
  //   //     return {...a,QtyOut:count.length}
  //   //   }
  //   // })
  //   // console.log(x,"xx")
  //   // setSlbatchArray(x)
  //   setCheckedItemSerial([]);
  //   setSlserialArray([]);
  // }




  const viewSerialbtn = (batch_id) => {
    setBoughtSerialItemsModal(!boughtSerialItemsModal);
    purchasedBatchSerials.bought_serials && setBoughtSerial(purchasedBatchSerials.bought_serials.filter(bs => bs.batch_id == batch_id))
  }

  const addMyData = async (rowIndex, columnId, value) => {
    console.log(product, "product in updateMyData")
    // alert("product in updateMyData  2")
    console.log("rowIndex: ", rowIndex, "columnIndex: ", columnId, "value :", value, "value in s updateMyData")

    if (columnId === "quantity" && value > 0) {
      // alert("quantity")
      let rowData = [];
      product.map((a, i) => {
        if (i === rowIndex) {
          rowData.push(a);
        }
      })
      // console.log(product,"columnId 1270  1")
      if (rowData[0].IsLotEnable === true && value > 0) {
        // console.log("columnId 1279  2")
        batchPopup(rowData)
      } else if (rowData[0].IsSerialEnable === true && rowData[0].IsLotEnable === false) {
      } else {
        // alert("else")
        let s1 = product;
        // console.log(s1,"columnId 1285 3")
        s1[rowIndex][columnId] = value;
        updateCalcData(1, s1)
      }

      // let getsereilobj = await db.SerialMaster.where("itemid").equals(rowData[0].ItemId).toArray().then().catch(err => console.log(err));
      // // console.log(getbatchobj,"getbatchobj")
      // console.log(getsereilobj,"getsereilobj")
      // if(getsereilobj.length > 0){
      //   let items= getsereilobj.map((a)=>{
      //     return {...a,id:a.serialid,ItemId:a.serialid}
      //   })
      //   setOpen(true);
      //   setItemSeriralList(items);
      //   setSerialSts(true);
      // }else{
      //   let s1 = product;
      //   s1[rowIndex][columnId] = value;
      //   updateCalcData(1,s1)
      // }

    } else {
      // alert("else")
      if (columnId === "storeid") {
        // alert("storeID")
        let rowData = [];
        product.map((a, i) => {
          if (i === rowIndex) {
            a.storeid = parseInt(value);
            rowData.push(a);
          }
        })

        // console.log(rowData,"rowData rowData rowData")
        // console.log(product, "product product product")
        // let getitemstk = await getItemstockQtyindexDb(rowData[0].ItemId,parseInt(value));
        let getitemstk = await getItemstockQtyindexDb(rowData[0].ItemId, rowData[0].storeid);
        console.log(getitemstk, "getitemstk getitemstk")
        // let unitName = await db.unitMaster
        //   .where("Id")
        //   .equals(itemMasterDetail.UnitName)
        //   .first();
        let prodwithStock = product.map((a, i) => {
          if (a.itemId === rowData[0].ItemId) {
            a.storeid = value;
            a.stock = getitemstk;
            // a.UnitName = unitName.UnitSymbol;
          }
          if (i === rowIndex) {
            return { ...a, storeid: parseInt(value), stock: getitemstk, quantity: a.quantity > getitemstk ? "" : a.quantity }
          } else {
            return a
          }
        })

        console.log(prodwithStock, "prodwithStock prodwithStock")
        // alert("updateCalcData fires")
        updateCalcData(1, prodwithStock)
      }
      //   s start
      else {
        // alert("last")
        console.log("last last")
        let s1 = product;
        s1[rowIndex][columnId] = value;
        console.log(s1, " product in last")
        updateCalcData(1, s1)
      }
      //   s end
    }
  };

  const updateMyData = async (rowIndex, columnId, value) => {
    // console.log(product, "product in updateMyData")
    // alert("product in updateMyData  2")
    // console.log("rowIndex: ", rowIndex, "columnIndex: ", columnId, "value :", value, "value in s updateMyData")111

    if (columnId === "quantity" && value > 0) {
      // alert("quantity")
      let rowData = [];
      product.map((a, i) => {
        if (i === rowIndex) {
          rowData.push(a);
        }
      })
      // console.log(product,"columnId 1270  1")
      if (rowData[0].IsLotEnable === true && value > 0) {
        // console.log("columnId 1279  2")
        batchPopup(rowData)
      } else if (rowData[0].IsSerialEnable === true && rowData[0].IsLotEnable === false) {
      } else {
        // alert("else")
        let s1 = product;
        // console.log(s1,"columnId 1285 3")
        s1[rowIndex][columnId] = value;
        updateCalcData(1, s1)
      }

      // let getsereilobj = await db.SerialMaster.where("itemid").equals(rowData[0].ItemId).toArray().then().catch(err => console.log(err));
      // // console.log(getbatchobj,"getbatchobj")
      // console.log(getsereilobj,"getsereilobj")
      // if(getsereilobj.length > 0){
      //   let items= getsereilobj.map((a)=>{
      //     return {...a,id:a.serialid,ItemId:a.serialid}
      //   })
      //   setOpen(true);
      //   setItemSeriralList(items);
      //   setSerialSts(true);
      // }else{
      //   let s1 = product;
      //   s1[rowIndex][columnId] = value;
      //   updateCalcData(1,s1)
      // }

    } else {
      // alert("else")
      if (columnId === "storeid") {
        // alert("storeID")
        let rowData = [];
        product.map((a, i) => {
          if (i === rowIndex) {
            a.storeid = parseInt(value);
            rowData.push(a);
          }
        })

        // console.log(rowData,"rowData rowData rowData")
        // console.log(product, "product product product")
        // let getitemstk = await getItemstockQtyindexDb(rowData[0].ItemId,parseInt(value));
        let getitemstk = await getItemstockQtyindexDb(rowData[0].ItemId, rowData[0].storeid);
        // console.log(getitemstk, "getitemstk getitemstk")
        // let unitName = await db.unitMaster
        //   .where("Id")
        //   .equals(itemMasterDetail.UnitName)
        //   .first();
        let prodwithStock = product.map((a, i) => {
          if (a.itemId === rowData[0].ItemId) {
            a.storeid = value;
            a.stock = getitemstk;
            // a.UnitName = unitName.UnitSymbol;
          }
          if (i === rowIndex) {
            return { ...a, storeid: parseInt(value), stock: getitemstk, quantity: a.quantity > getitemstk ? "" : a.quantity }
          } else {
            return a
          }
        })

        // console.log(prodwithStock, "prodwithStock prodwithStock")
        // alert("updateCalcData fires")
        updateCalcData(1, prodwithStock)
      }
      //   s start
      // else {
      //   // alert("last")
      //   console.log("last last")
      //   let s1 = product;
      //   s1[rowIndex][columnId] = value;
      //   console.log(s1, " product in last")
      //   updateCalcData(1, s1)
      // }
      //   s end
    }
  };


  // console.log(boughtSerialItemsModal, 'BoughtSerialItemsModal ,BoughtSerialItemsModal')
  const updateCalcData = (v, a) => {
    // alert("updateCalcData  1")
    // console.log(v, "vvvvvvvvvv")
    // console.log(a, "aaaaaaaaaaaaaa")
    let calcData = calcProductAndFooter(v, a);
    setFooterState(() => {
      return { ...calcData.footer };
    });
    // console.log(footerState,"footerState")
    // console.log(calcData, "calcData updateCalcData")
    setProducts(calcData.products);
  }


  const totalAmount = (quantity, mrp) => {
    quantity = quantity && quantity > 0 ? parseInt(quantity) : 0;
    mrp = mrp && mrp > 0 ? parseInt(mrp) : 0;
    let amount = quantity * mrp;
    return amount;
  };
  const getcustomer = (customer) => {
    if (customer) {
      setMobileNumber(customer.Phone1);
      setCustomerName(customer.PartyName);
      setCustomerData(customer);
      setPartyId(customer.Id);
    }

    setCodeFocus("");
    setDropDownOption("");
  };
  const handleSalePersonDrop = (value) => {
    if (value) {
      setSalesPerson({
        slpName: value.SalePersonName,
        slpId: value.Id,
        slpdropdown: false,
      });
    }
    setCodeFocus("");
    setDropDownOption("");
  };
  const handleSalePerson = (e) => {
    setSalesPerson({
      slpName: "",
      slpId: null,
      slpdropdown: true,
    });
    setCodeFocus("");
    setDropDownOption("");
  };
  const mobileChange = (e) => {
    try {
      setRequired({ mobileNumber: "" });
      if (e.target.value >= 0) {
        setMobileNumber(e.target.value);
        if (e.target.value.length === 10) {
          if (e.target.value === /^[a-z-A-Z-\s]+$/) {
            setError({ mobileError: "Please enter Numbers only" });
          }
          fnGetCustomerData(e.target.value);
        }
      } else {
        setError({ mobileError: "Please enter number" });
        setTimeout(() => {
          setError({ mobileError: "" });
        }, 1000);
      }
      fnGetCustomerData(e.target.value);
    } catch (error) { }
  };
  const fnGetCustomerData = async (mobileNo) => {
    if (mobileNo !== "") {
      let customerListTemp = await fn_GetCustomerMaster();
      const customerObject =
        customerListTemp &&
        customerListTemp.length > 0 &&
        customerListTemp.find((m) => m.Phone1 === mobileNo);
      if (customerObject && Object.keys(customerObject).length > 0) {
        setMobileNumber(customerObject.Phone1);
        setCustomerName(customerObject.PartyName);
        setCustomerData(customerObject);
        setPartyId(customerObject.Id);
      }
    }
  };

  // Validation function
  const valid = (arg1, arg2) => {
    const focusKeys = {
      // mobileNumber: "mobilenumber",
      timer: "billtime",
      billDate: "invoiceno",
      billSeries: "billSeries",
    };
    const keys = [
      "billSeries",
      "invoicedate",
      "billDate",
      // "mobilenumber",
      "billtime",
    ];
    let focusError = [];
    let count = 0;
    let temp = {};
    for (let x of keys) {
      if (arg1[x] === "" || arg1[x] === null || arg1[x] === 0) {
        Object.keys(focusKeys).map((key) => {
          if (focusKeys[key] === x) {
            return (temp = { ...temp, [key]: "required" });
          }
        });
        count++;
      } else {
        Object.keys(focusKeys).map((key) => {
          if (focusKeys[key] === x) {
            temp = { ...temp, [key]: "" };
          }
        });
      }

      // alert('Required fields are empty')
    }
    if (
      customerName === "" ||
      customerName === null ||
      customerName === undefined
    ) {
      count++;
      temp = { ...temp, customerName: "required" };
    } else {
      temp = { ...temp, customerName: "" };
    }
    setRequired(temp);
    if (count) {
      alert("Required fields are empty");
      return false;
    }

    if (arg2.length === 0) {
      count++;
      alert("Please select atleast one product");
    }
    return count ? false : true;

    // alert('Required fields are empty')
  };

  const discChange = (e) => {
    let v = e.target.value;
    setFooterState((old) => {
      old.totalDiscountPerc = v;
      let disc =
        (convertToFloat(v > 0 ? v : 0) * convertToFloat(old.totalAmount)) / 100;
      let final = convertToFloat(old.totalAmount) - disc;
      old.roundOff = fnRoundOff(fixedToLength(final));
      final = convertToFloat(fnRoundOff(final)) + final;
      old.amountDiscPerc = fixedToLength(disc);
      old.finalAmount = fixedToLength(final);
      return { ...old };
    });
  };

  const emptyRequired = () => {
    for (let data in required) {
      required[data] = "";
    }
    setRequired(required);
  };
  //

  const onRowClick = (rowInfo) => {
    setSelectedRow(rowInfo.id);
    setRowInfoId(rowInfo);
  };
  const removeItemRow = (obj) => {
    const fltrProList = product.filter(
      (item) => item.ItemId !== obj.original.ItemId
    );
    setProducts(fltrProList);
    if (fltrProList && fltrProList.length > 0) {
      const calcData = calcProductAndFooter(1, fltrProList);
      setFooterState(() => {
        return { ...calcData.footer };
      });
      setProducts(calcData.products);
    } else {
      setFooterState({
        totalQty: 0,
        mrpValue: 0,
        grossAmount: 0,
        totalDiscount: 0,
        totalTax: 0,
        totalAmount: 0,
        totalDiscountPerc: 0,
        amountDiscPerc: 0,
        roundOff: 0,
        finalAmount: 0,
        receivedAmount: 0,
        balanceAmount: 0,
        cashReceived: 0,
        tender: 0,
        igstAmount: 0,
        sgstAmount: 0,
        cgstAmount: 0,
      });
      setProducts([]);
    }
  };

  const pageLoadStatus = (val) => {
    return val === undefined || val === "refresh" || val === null || val === ""
      ? true
      : false;
  };
  const submit = async (submitType) => {
    let data = val === "add" || !billTime ? reff.current.value : billTime;

    const saleInvoice = {
      Id: serverInvoiceId,
      update: 0,
      invoiceno: submitType === "hold" ? "Temp-" + billSeries : billSeries,
      invoicedate: billDate,
      partyid: partyId,
      grossamount: footerState.grossAmount,
      discountamount: footerState.totalDiscount,
      taxamount: footerState.totalTax,
      netamount: footerState.totalAmount,
      receiveamount: footerState.receivedAmount,
      branchid: 1,
      counterid: 1,
      createdby: localStorage.getItem("UserId"),
      createdon: new Date(),
      editlog: "",
      ishold: submitType === "hold" ? "true" : "false",
      iscancelled: "",
      alterid: 0,
      authorizedby: 0,
      authorizedon: "",
      cancelledby: "",
      cancelledon: "",
      salepersonid: salesPerson.slpId,
      seriesid:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      voucherid: seriesandVoucher.voucherId,
      seriesvouchertype: 0,
      isauthorized: false,
      remarks: inputRemarks,
      discountpermanual: footerState.totalDiscountPerc,
      discountamountmanual: footerState.amountDiscPerc,
      finalamount: footerState.finalAmount,
      noofbillprint: 0,
      billtime: data,
      roundoff: footerState.roundOff,
      totalbillqty: footerState.totalQty,
      invoicetype: 0,
      cash_amount: 0,
      cn_amount: 0,
      dc_amount: 0,
      cc_amount: 0,
      advance_amount: 0,
      coupon_amount: 0,
      other_amount: 0,
      mrp_value: footerState.mrpValue,
      cashtrade: 0,
      balamt: 0,
      tallyvoucherid: 0,
      tallysyncdate: "",
      tallyreferenceno: "",
      issendtotally: false,
      totaligst: footerState.igstAmount,
      totalcgst: footerState.cgstAmount,
      totalsgst: footerState.sgstAmount,
      billingcountryid: billingInfo.bCountry,
      billingstateid: billingInfo.bState,
      billingaddress: billingInfo.bAddress,
      billinggstinno: billingInfo.bGSTN,
      shippingcountryid: billingInfo.sCountry,
      shippingstateid: billingInfo.sState,
      shippingaddress: billingInfo.sAddress,
      shippinggstinno: billingInfo.sGSTN,
      mobilenumber: mobileNumber,
      influencerid: influencerId,
      billingtype: billingTypevalue,
      new: newInvoice,
    };
    if (valid(saleInvoice, product)) {
      console.log(saleInvoice, "saleInvoice saleInvoice")
      console.log(product, "valid product")

      if (invoiceId > 0) {
        await update(submitType, saleInvoice);
        setMethod(false);
        discard();
        setVal("");
        await fnShowSalesInvoice();
        alert("updated successfully");
      } else {
        const saveRes = await fn_SaveInvoice(
          saleInvoice,
          product,
          pageNav.formid
        );
        if (recallsts) {
          tempDelete(getcheckedRows[0].id);
        }
        setMethod(false);
        discard();
        setVal("");
        await fnShowSalesInvoice();
        alert("saved successfully");

        // P Starts
        purchasedItemsBatchSerials(product);
        // P Ends
      }

    }
  };
  const update = async (submitType, saleInvoice) => {
    saleInvoice.id = invoiceId;
    const updateRes = await fn_UpdateInvoice(
      saleInvoice,
      product,
      pageNav.formid
    );
  };
  const getTodayInvoice = async () => {
    let xList = await db.salesInvoice.toArray();
    if (xList.length > 0) {
      const flList = xList.filter(
        (a) => getFormateDate(a.createdon) === getFormateDate(new Date())
      );
      if (flList.length > 0) {
        const list = flList.filter(
          (b) => b.ishold !== "true" && b.iscancelled !== "true"
        );
        if (list.length > 0) {
          return list;
        } else {
          return [];
        }
      } else {
        return [];
      }
    }
    return [];
  };
  const ActionwiseList = async (type) => {
    const getHoldList =
      type === "discard" || type === "recall"
        ? await db.salesInvoice.where("ishold").equals("true").toArray()
        : type === "cancel"
          ? await getTodayInvoice()
          : [];
    if (getHoldList.length > 0) {
      let newList = [];
      for (let list of getHoldList) {
        let partyname = await db.customerMaster
          .where("Id")
          .equals(list.partyid)
          .first();
        let xObj = {
          BillNo: list.invoiceno,
          Date: getFormateDate(list.createdon),
          Time: list.billtime,
          PartyName: partyname.PartyName,
          PartyMobileNo: list.mobilenumber,
          ItemId: list.id,
        };
        newList.push({ ...list, ...xObj });
      }
      setPopuptableitem(newList);
      setOpen(true);
    } else {
      let alertmsg =
        type === "discard" || type === "recall"
          ? "You don't have any hold Bill"
          : "you don't have created any bill today";
      alert(alertmsg);
    }
    setPopbtntext(type);
  };
  const cancelPopup = () => {
    setPopuptableitem([]);
    setOpen(false);
  };
  const discard = () => {
    setServerInvoiceId(0);
    setBillingTypedata([]);
    setBillingTypevalue("");
    setInfluencerlist([]);
    setInfluencerValue("");
    setInfluencerId(null);
    setProducts([]);
    setInvoiceId(0);
    setSalesPersonList([]);
    setNewInvoice(0);
    setFooterState({
      totalQty: 0,
      mrpValue: 0,
      grossAmount: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalAmount: 0,
      totalDiscountPerc: 0,
      amountDiscPerc: 0,
      roundOff: 0,
      finalAmount: 0,
      receivedAmount: 0,
      balanceAmount: 0,
      cashReceived: 0,
      tender: 0,
      igstAmount: 0,
      sgstAmount: 0,
      cgstAmount: 0,
    });
    setBillCancel(false);
    setCustomerList();
    setVal("");
    setBillDate(null);
    setError({ mobileError: "" });
    setMobileNumber("");
    setCustomerData(null);
    setCustomerName("");
    setSaleInvoiceData({});
    setBillSeries(null);
    setInputRemarks("");
    setBillTime("");
    setMethod(false);
    setData({ salesInvoice: [], saleInvoiceDetail: [] });
    setPartyId("");
    emptyRequired();
    setCodeFocus("");
    setDropDownOption("");
    setSalesPerson({
      slpName: "",
      slpId: null,
      slpdropdown: true,
    });
    setSeriesandVoucher({
      seriesId: "",
      voucherId: "",
    });
    setOpen(false);
    setBillingInfo(billinfo);
    setStateList([]);
    setViewTaxinfo(false);
    setViewBillinginfo(false);
    setCheckedItem();
    setGetcheckedRows();
    setPopbtntext("");
    setPopuptableitem([]);
    setVoucherStatus();
    setVoucherList([]);
    fnShowSalesInvoice();
  };
  const fnShowSalesInvoice = async () => {
    let formData = await fn_GetLastSalesInvoice();
    if (
      formData &&
      Object.keys(formData).length > 0 &&
      formData.product &&
      formData.product.length > 0
    ) {
      const bilDate = formData.invoicedate;
      const billNo = formData.invoiceno;
      formData = await fnFormatTableData(formData);
      const calcData = calcProductAndFooter(1, formData);
      setPrevInvoiceDetail((old) => {
        return {
          billSeries: billNo,
          debitCard: 0,
          creditCard: 0,
          advAmount: 0,
          totalQty: calcData.footer.totalQty,
          couponAmount: 0,
          otherAmount: 0,
          cashAmount: 0,
          billDate: bilDate,
          netAmount: calcData.footer.finalAmount,
          totalMrp: calcData.footer.mrpValue,
        };
      });
    } else {
      setPrevInvoiceDetail({
        billSeries: "N/A",
        debitCard: "N/A",
        creditCard: "N/A",
        advAmount: "N/A",
        totalQty: "N/A",
        couponAmount: "N/A",
        otherAmount: "N/A",
        cashAmount: "N/A",
        billDate: "N/A",
        netAmount: "N/A",
        totalMrp: "N/A",
      });
    }
  };

  const fnInvoiceUpdate = async (obj) => {
    console.log(obj, 'obj in fnInvoiceUpdate')
    setServerInvoiceId(obj.Id);
    setSeriesandVoucher({
      seriesId: obj.seriesid,
      voucherId: obj.voucherid,
    });
    const partyname = await db.customerMaster
      .where("Id")
      .equals(obj.partyid)
      .first()
      .then()
      .catch((err) => console.log(err));
    setCustomerName(partyname.PartyName);
    setNewInvoice(obj.new);
    setProducts([]);
    if (obj && Object.keys(obj).length > 0 && obj.id > 0) {
      let formData = await fn_GetSaleInvoiceId(obj.id);
      console.log(formData, 'formData fn_GetSaleInvoiceId')
      if (formData && Object.keys(formData).length > 0) {
        await formatData(formData);

      }

      setCustdropdn(true);
    }
  };
  // const fnGetHoldSalesInvoice = async () => {
  //   setProducts([]);
  //   const formData = await fn_GetHoldSalesInvoice();
  //   if (formData && Object.keys(formData).length > 0) {
  //     await formatData(formData);
  //   }
  // };

  const fnRecallSalesInvoice = async (id) => {
    setProducts([]);
    let formData = await fn_GetHoldSalesInvoice(id);
    if (formData && Object.keys(formData).length > 0) {
      if (formData.salepersonid) {
        let slP = await db.salesPersonMaster
          .where("Id")
          .equals(parseInt(formData.salepersonid))
          .first();
        setSalesPerson({
          slpName: slP.SalePersonName,
          slpId: parseInt(slP.Id),
          slpdropdown: false,
        });
      } else {
        setSalesPerson({
          slpName: "",
          slpId: null,
          slpdropdown: true,
        });
      }
      setBillingInfo({
        bState: formData.billingstateid,
        bCountry: formData.billingcountryid,
        bAddress: formData.billingaddress,
        bGSTN: formData.billinggstinno,
        sState: formData.shippingstateid,
        sCountry: formData.shippingcountryid,
        sAddress: formData.shippingaddress,
        sGSTN: formData.shippinggstinno,
      });
      fnGetCustomerData(formData.mobilenumber);
      setMethod(false);
      setPartyId(formData.partyid);
      setMobileNumber(formData.mobilenumber);
      setBillDate(formData.invoicedate);
      setInputRemarks(formData.remarks);
      setFooterState((old) => {
        old.totalDiscountPerc = formData.discountpermanual;
        old.amountDiscPerc = formData.discountamountmanual;
        return { ...old };
      });
      await fnBindProduct();
      if (formData && formData.product && formData.product.length > 0) {
        formData = await fnFormatTableData(formData);
        setProducts(formData);
        const calcData = calcProductAndFooter(1, formData);
        setFooterState((old) => {
          return { ...old, ...calcData.footer };
        });
        setProducts(calcData.products);
      }
    }
  };

  const formatData = async (formData) => {
    console.log(formData, 'form data in formatData')
    // P Starts
    const PIBSFVE = await purchasedItemsBatchSerialsForVE(formData.product);
    // P Ends        
    fnBindPage(formData);
    // await fnBindProduct();
    if (formData.salepersonid) {
      let slP = await db.salesPersonMaster
        .where("Id")
        .equals(parseInt(formData.salepersonid))
        .first();
      setSalesPerson({
        slpName: slP.SalePersonName,
        slpId: parseInt(slP.Id),
        slpdropdown: false,
      });
    } else {
      setSalesPerson({
        slpName: "",
        slpId: null,
        slpdropdown: true,
      });
    }
    console.log(formData, 'formData formData in formatdata before getting product')
    if (formData && formData.product && formData.product.length > 0) {
      // let formDataWithOtherData = await fnFormatTableData(formData);
      // console.log(formDataWithOtherData,'formDataWithOtherData in formatdata')
      // P Starts
      console.log(formData, 'formData in fn formateData')
      let products = Array.isArray(formData.product)
        ? formData.product
        : [formData.product];

      let productlist = [];

      // console.log(typeof item, 'item , item typeof');
      // console.log(item.quantity, 'item.quantity item.quantity')

      // let st = await db.getItemStock
      //   .where("itemid")
      //   .equals(item.itemid)
      //   .first()
      //   .then()
      //   .catch((err) => alert("somthing went wrong"));
      //   console.log(st,'st in fnFormateTAbleData')

      // let unitName = await db.unitMaster
      // .where("Id")
      // .equals(itemMasterDetail.UnitName)
      // .first();
      // itemMasterDetail.UnitId = itemMasterDetail.UnitName;
      // itemMasterDetail.UnitName = unitName.UnitName;

      // await updateMyData(index,"storeid",item.storeid)
      console.log(products, "products products products")
      // products.map(item => {
      //   console.log(item, ' item for formData');
      // if(st && Object.keys(st).length > 0){
      // product.forEach((item)=>{
      for (let item of products) {


        let itemObj2 = {
          id: item.id,
          invoiceId: item.invoiceid,
          ItemId: item.itemid,
          ItemName: item.ItemName,
          ItemCode: item.ItemCode,
          mrp: item.mrp,
          // quantity: Number(item.quantity), // s
          quantity: item.quantity,
          storeid: item.storeid, // P
          stock: 1000, // P
          UnitId: item.UnitId, // s
          UnitName: item.UnitName, // s
          Rate: item.saleprice,
          taxper: 0,
          totaltaxamount: 0,
          finalperrate: 0,
          totalnetamount: 0,
          lotno: "",
          createdby: 1,
          createdon: new Date(),
          editlog: "",
          isvatitem: false,
          addtaxrate: 0,
          addtaxamount: 0,
          surchargerate: 0,
          surchargeamount: 0,
          taxamount: 0,
          IsTaxInclusive: item.istaxinclusive,
          altqty: 0,
          salepersonid: 0,
          changeindiscount: 0,
          autodiscountper: 0,
          autodiscountamount: 0,
          manualdiscountper: item.manualdiscountper,
          manualdiscountamount: item.manualdiscountamount,
          istaxcalculatebeforediscount: false,
          lotserialid: 0,
          remark: item.itemremark,
          discount_slab_detail_id: 0,
          isautodiscountonper: false,
          isautodiscountonamount: false,
          isaltrate: 0,
          Conversion: item.conversion,
          Denominator: item.denominator,
          isschemeitem: 0,
          hsnclassificationid: 0,
          igstRate: item.igstrate,
          cgstRate: item.cgstrate,
          sgstRate: item.sgstrate,
          igst: item.igstamount,
          cgst: item.cgstamount,
          sgst: item.sgstamount,
          manualchangesaleprice: false,
          sodetailid: 0,
          schemecode: item.schemecode,
          mobileNumber: item.mobilenumber,
          istaxinclusive: item.istaxinclusive,
        }
        // console.log(typeof itemObj.quantity, 'itemObj itemObj')
        console.log(itemObj2, "itemObj itemObj")
        console.log(itemObj2.quantity, 'itemObj.quantity ')

        // const tempItemObj = {...itemObj,tem}
        productlist.push(itemObj2)
        // return itemObj;
        // });
      }

      console.log(productlist, 'itemObjFormat in item')
      // setProducts(productlist);
      const calcData = calcProductAndFooter(1, productlist);
      console.log(calcData, "calcData calcData")
      // P Ends
      setFooterState((old) => {
        return { ...old, ...calcData.footer };
      });
      // setProducts(calcData.products);
      setProducts(productlist);
    }
  };

  const fnBindPage = async (formData) => {
    console.log(formData, 'formData formData fnBindPage')
    if (formData.salepersonid) {
      let slP = await db.salesPersonMaster
        .where("Id")
        .equals(parseInt(formData.salepersonid))
        .first();
      setSalesPerson({
        slpName: slP.SalePersonName,
        slpId: parseInt(slP.Id),
        slpdropdown: false,
      });
    }
    setBillingInfo({
      bState: formData.billingstateid,
      bCountry: formData.billingcountryid,
      bAddress: formData.billingaddress,
      bGSTN: formData.billinggstinno,
      sState: formData.shippingstateid,
      sCountry: formData.shippingcountryid,
      sAddress: formData.shippingaddress,
      sGSTN: formData.shippinggstinno,
    });
    setInvoiceId(formData.id);
    setBillCancel(formData.iscancelled === "true" ? true : false);
    fnGetCustomerData(formData.mobilenumber);
    setMethod(false);
    setPartyId(formData.partyid);
    setBillTime(formData.billtime);
    setBillSeries(formData.invoiceno);
    setMobileNumber(formData.mobilenumber);
    setBillDate(formData.invoicedate);
    setInputRemarks(formData.remarks);
    setFooterState((old) => {
      old.totalDiscountPerc = formData.discountpermanual;
      old.amountDiscPerc = formData.discountamountmanual;
      return { ...old };
    });
  };

  const fnFormatTableData = async (tableData) => {
    let productlist = [];
    for (let item of tableData.product) {
      let st = await db.getItemStock
        .where("itemid")
        .equals(item.itemid)
        .first()
        .then()
        .catch((err) => alert("somthing went wrong"));
      console.log(st, "st st st st st")
      productlist.push({
        id: item.id,
        invoiceId: item.invoiceid,
        ItemId: item.itemid,
        quantity: parseInt(item.quantity),
        ItemName: item.ItemName,
        ItemCode: item.ItemCode,
        mrp: item.mrp,
        stock: item.balance,
        Rate: item.saleprice,
        taxper: 0,
        totaltaxamount: 0,
        finalperrate: 0,
        totalnetamount: 0,
        lotno: "",
        createdby: 1,
        createdon: new Date(),
        editlog: "",
        isvatitem: false,
        addtaxrate: 0,
        addtaxamount: 0,
        surchargerate: 0,
        surchargeamount: 0,
        taxamount: 0,
        IsTaxInclusive: item.istaxinclusive,
        altqty: 0,
        salepersonid: 0,
        changeindiscount: 0,
        autodiscountper: 0,
        autodiscountamount: 0,
        manualdiscountper: item.manualdiscountper,
        manualdiscountamount: item.manualdiscountamount,
        istaxcalculatebeforediscount: false,
        lotserialid: 0,
        remark: item.itemremark,
        discount_slab_detail_id: 0,
        isautodiscountonper: false,
        isautodiscountonamount: false,
        isaltrate: 0,
        Conversion: item.conversion,
        Denominator: item.denominator,
        isschemeitem: 0,
        hsnclassificationid: 0,
        igstRate: item.igstrate,
        cgstRate: item.cgstrate,
        sgstRate: item.sgstrate,
        igst: item.igstamount,
        cgst: item.cgstamount,
        sgst: item.sgstamount,
        manualchangesaleprice: false,
        sodetailid: 0,
        schemecode: item.schemecode,
        mobileNumber: item.mobilenumber,
        istaxinclusive: item.istaxinclusive,
      });
    }
    console.log(productlist, "productlist productlist")
    return productlist;
  };

  const print = () => {
    if (product && product.length > 0 && billSeries && billSeries.length > 0) {
      var content = document.getElementById("divcontents");
      var pri = document.getElementById("ifmcontentstoprint").contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
    } else {
      alert("Please select invoice", billSeries);
    }
  };
  // const getCheckedRowsBatch = (res) => {
  //   setGetcheckedRowsBatch(res);
  // };

  const getCheckedRows = (res) => {
    setGetcheckedRows(res);
  };

  const getCheckedRowsItemPopup = (res) => {
    setGetcheckedRowsPop(res);
  };

  const okItemPopBtn = async (b) => {
    if (b === "none") {
      setItemPopup(false)
    } else {
      let arr = [];
      for (let x of b) {
        let itemMasterDetail = await fn_GetItemMasterDetail(
          x.ItemId,
          getFormateDate(billDate)
        );

        let unitName = await db.unitMaster
          .where("Id")
          .equals(itemMasterDetail.UnitName)
          .first();
        itemMasterDetail.UnitId = itemMasterDetail.UnitName;
        itemMasterDetail.UnitName = unitName.UnitName;
        console.log(itemMasterDetail, "itemMasterDetail")

        // let stockName = await db.
        // var itemStockCount = await getItemstockQtyindexDb(item.ItemId, null);

        arr.push(itemMasterDetail)
      }

      console.log(arr, 'in OK popup')
      selectedArray(arr);
      setItemPopup(false)
    }
  }



  // const okItemPopBtn=async()=>{
  //  // console.log(getcheckedRowsPop,"getcheckedRowsPop")
  //   const ids = getcheckedRowsPop.map((a) => {
  //     return a.ItemId;
  //   });
  //   setCheckedItemPopup(ids)
  //   let arr = [];
  //       for(let x of getcheckedRowsPop){
  //         let itemMasterDetail = await fn_GetItemMasterDetail(
  //          x.ItemId,
  //           getFormateDate(billDate)
  //         );
  //         arr.push(itemMasterDetail)
  //       }
  //       const results = arr.filter(
  //         ({ ItemId: id1 }) =>
  //           !product.some(({ ItemId: id2 }) => id2 === id1)
  //       );
  //       const results2 = product.filter(
  //         ({ ItemId: id1 }) => !arr.some(({ ItemId: id2 }) => id2 === id1)
  //       );
  //       if (results.length > 0) {
  //         let newArry=[...product,...results]
  //         selectedArray(newArry)
  //       }
  //       if (results2.length > 0) {
  //         const results3 = product.filter(
  //           ({ ItemId: id1 }) =>
  //             !results2.some(({ ItemId: id2 }) => id2 === id1)
  //         );
  //         if (results3) {
  //           selectedArray(results3)
  //         }
  //       }
  //       setItemPopup(false)

  //   }
  const selectedArray = (arr) => {
    // alert("dksjfsdfj")
    // console.log(arr,'arr arr arr in Ok item')
    const calcData = calcProductAndFooter(1, arr);
    setFooterState(() => {
      return { ...calcData.footer };
    });
    // console.log(calcData.products,'calcData.products in Ok item')
    setProducts(calcData.products);
  }

  const tempDelete = async (id) => {
    let item = await db.saleInvoiceDetail
      .where("invoiceid")
      .equals(id)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (item.length > 0) {
      const itemids = item.map((a) => {
        return a.id;
      });
      await db.salesInvoice.delete(id);
      await db.saleInvoiceDetail
        .bulkDelete(itemids)
        .then()
        .catch((err) => console.log(err));
      setRecallsts(false);
    }
  };

  const popupOkfunc = async (btnType) => {
    if (btnType === "discard") {
      if (getcheckedRows.length > 0) {
        let ids = getcheckedRows.map((a) => {
          return a.id;
        });
        if (ids.length > 0) {
          let items = [];
          for (let x of ids) {
            let item = await db.saleInvoiceDetail
              .where("invoiceid")
              .equals(x)
              .toArray()
              .then()
              .catch((err) => console.log(err));
            items = [...items, ...item];
          }
          const itemids = items.map((a) => {
            return a.id;
          });
          await db.salesInvoice
            .bulkDelete(ids)
            .then((res) =>
              db.saleInvoiceDetail
                .bulkDelete(itemids)
                .then((resitem) => {
                  alert("successfully discard");
                  discard();
                })
                .catch((arr) => alert("something went wrong"))
            )
            .catch((arr) => alert("something went wrong"));
        }
      } else {
        alert("Please select bill");
      }
    } else if (btnType === "cancel") {
      if (getcheckedRows.length > 0) {
        const list = getcheckedRows.map((a) => {
          return {
            ...a,
            cancelledby: localStorage.getItem("UserId"),
            cancelledon: new Date(),
            iscancelled: "true",
            update: 1,
          };
        });
        await db.salesInvoice
          .bulkPut(list)
          .then((res) => {
            alert("successfully canceled");
            discard();
          })
          .catch((err) => alert("something went wrong"));
      } else {
        alert("Please select bill");
      }
    } else if (btnType === "recall") {
      if (getcheckedRows.length > 0) {
        if (getcheckedRows.length > 1) {
          alert("Please select only one bill");
        } else {
          fnRecallSalesInvoice(getcheckedRows[0].id);
          setRecallsts(true);
        }
      } else {
        alert("Please select bill");
      }
    }
  };
  const onSpace = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      setError({ ...error, mobileError: "Space Not Allowed" });
      setTimeout(() => {
        setError({ ...error, mobileError: "" });
      }, 1000);
    }
  };


  const para = { change_state, val, disabledAction };
  const printData = {
    columns,
    product,
    footerState,
    billSeries,
    customerData,
    billDate,
  };
  return (
    <>
      <div
        className="tabBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />


        <div className="billSection">
          <div className="row">
            <div className="col w75">
              <div className="box grayBg">
                <div className="row">
                  <div className="col w33 autoComp billno">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Bill No" />
                        <span className="required">*</span>
                      </label>

                      {!method ? (
                        <select
                          name="billSeries"
                          id=""
                          className={required.billSeries}
                        >
                          {billSeries && (
                            <option value={billSeries}>{billSeries}</option>
                          )}
                        </select>
                      ) : (
                        <Autocomplete
                          open={
                            dropDownOption === "billno" && !pageLoadStatus(val)
                              ? true
                              : false
                          }
                          onChange={(e, value) => fnInvoiceUpdate(value)}
                          options={data.salesInvoice}
                          getOptionLabel={(option) => option.invoiceno}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("billno")}
                              onBlur={() => {
                                setCodeFocus("");
                                setDropDownOption("");
                              }}
                            />
                          )}
                          className={required.billSeries}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col w33">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Bill Date" />
                        <span className="required">*</span>
                      </label>
                      <DatePicker
                        name="billDate"
                        selected={billDate}
                        onChange={(date) => setBillDate(date)}
                        readOnly={pageLoadStatus(val)}
                        className={required.billDate}
                      />
                    </div>
                  </div>
                  <div className="col w33">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Time" />
                        <span className="required">*</span>
                      </label>
                      {val === "add" || (!pageLoadStatus(val) && !billTime) ? (
                        <Timer reff={reff} className={required.timer} />
                      ) : (
                        <input
                          readOnly={true}
                          value={billTime}
                          className={required.timer}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col w33">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Mobile No" />
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength="10"
                        name="mobileNumber"
                        value={mobileNumber}
                        onChange={mobileChange}
                        onKeyDown={onSpace}
                        readOnly={customerName === "" ? false : true}
                        // onFocus={() => {
                        //   //setMobileNumber("");
                        //   // setCustomerData(null);
                        //   setCustomerName("");
                        // }}
                        className={required.mobileNumber}
                      />
                      {error.mobileError ? (
                        <span style={{ color: "red", fontSize: "15px" }}>
                          {error.mobileError}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col w33 autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Customer Name" />
                        <span className="required">*</span>
                      </label>
                      {customerName === "" && custdropdn === true ? (
                        <Autocomplete
                          open={
                            dropDownOption === "customer" &&
                              !pageLoadStatus(val)
                              ? true
                              : false
                          }
                          options={customerList}
                          onChange={(e, value) => getcustomer(value)}
                          getOptionLabel={(option) => option.PartyName}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("customer")}
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
                          onChange={(e) => setCustomerName(e.target.value)}
                          className={required.customerName}
                          value={customerName}
                          readOnly={
                            val === "view" || val === undefined ? true : false
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="col w33 autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Sale Person" />
                      </label>
                      {salesPerson.slpdropdown === true ? (
                        <Autocomplete
                          open={
                            dropDownOption === "saleperson" &&
                              !pageLoadStatus(val)
                              ? true
                              : false
                          }
                          options={salesPersonList}
                          onChange={(e, value) => handleSalePersonDrop(value)}
                          getOptionLabel={(option) => option.SalePersonName}
                          // value={!pageLoadStatus(val) ? selectedProduct : ""}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("saleperson")}
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
                          data-valid="special"
                          value={salesPerson.slpName}
                          onChange={handleSalePerson}
                          readOnly={val === "view" ? true : false}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {influencerlist.length > 0 ? (
                    <div className="col w33 autoComp">
                      <div className="formBox">
                        <label htmlFor="">
                          <Text content="Influencers" />
                        </label>
                        {influencerValue === "" ? (
                          <Autocomplete
                            options={influencerlist}
                            onChange={(e, value) => {
                              setInfluencerValue(value.influencername);
                              setInfluencerId(value.influencerid);
                            }}
                            getOptionLabel={(option) => option.influencername}
                            // value={!pageLoadStatus(val) ? selectedProduct : ""}
                            renderInput={(params) => (
                              <TextField {...params} />
                            )}
                          />
                        ) : (
                          <input
                            type="text"
                            value={influencerValue}
                            onChange={(e) => {
                              if (e.target.value === "") {
                                setInfluencerValue(e.target.value);
                                setInfluencerId();
                              } else {
                                setInfluencerValue(e.target.value);
                              }
                            }}
                          />
                        )}
                        {/* <select name="" id="">
                            <option value="0">Select</option>
                            {influencerlist.map((a) => (
                              <option value={a.influencerid}>
                                {a.influencername}
                              </option>
                            ))}
                          </select> */}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {billingTypedata.length > 0 ? (
                    <div className="col w33 autoComp">
                      <div className="formBox">
                        <label htmlFor="">
                          <Text content="Billing Type" />
                        </label>
                        {billingTypevalue === "" ? (
                          <Autocomplete
                            options={billingTypedata}
                            onChange={(e, value) =>
                              setBillingTypevalue(value.valuename)
                            }
                            getOptionLabel={(option) => option.valuename}
                            // value={!pageLoadStatus(val) ? selectedProduct : ""}
                            renderInput={(params) => (
                              <TextField {...params} />
                            )}
                          />
                        ) : (
                          <input
                            type="text"
                            value={billingTypevalue}
                            onChange={(e) =>
                              setBillingTypevalue(e.target.value)
                            }
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col w33">
                    <div className="invoiceAction">
                      <button className={val === "add" || val === "edit" ? "green" : "grey"} style={{ margin: "0", height: "39px", marginTop: "9px" }} onClick={val === "add" || val === "edit" ? () => ShowItemList() : () => { return false }}>Item List</button>
                    </div>
                  </div>
                </div>


                {/* <div className="row">
                  <div className="col w100 autoComp">
                    <div className="formBox mb-0">
                      <label htmlFor="">
                        <Text content="Product" />
                      </label>
                      {prosts === true ? (
                        <Autocomplete
                          open={
                            dropDownOption === "poduct" && !pageLoadStatus(val)
                              ? true
                              : false
                          }
                          options={itemList}
                          onChange={(e, value) => handleProductChange(value)}
                          getOptionLabel={(option) => option.label}
                          // value={!pageLoadStatus(val) ? selectedProduct : ""}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Press ctrl + L"
                              onFocus={() => setCodeFocus("poduct")}
                              onBlur={() => {
                                setCodeFocus("");
                                setDropDownOption("");
                              }}
                            />
                          )}
                        />
                      ) : (
                        <input type="text" readOnly={true} />
                      )}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col w25">
              {billCancel && (
                <div className="cancelsts">
                  <Text content="Canceled" />
                </div>
              )}
              {/* <div className="billOption">
                <div className="row">
                  <div className="col w45">
                    <div className="left">
                      <button>Item Detail (F5)</button>
                      <button>Change Qty (F6)</button>
                      <button>100% Cash (F7)</button>
                      <button>Remove Payment (F8)</button>
                      <button>Remove Item (F9)</button>
                      <button>Tax Detail</button>
                    </div>
                  </div>
                  <div className="col w55">
                    <div className="right">
                      <button>Cash</button>
                      <button>Credit Card</button> 
                      <button>Debit Card</button>
                      <button>Voucher</button>
                      <button>Apply Coupon</button>
                      <button>Credit Note</button>
                      <button>Advance Adjustment</button>
                      <button>Other</button>
                      <button>Payment Details</button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          {console.log(product, ' in product  in item table ')}
          <div className="row">
            <div className="col w100">

              {viewCoulmnState == "view" ?
                <Table
                  columns={viewcolumns}
                  data={product}
                  itemList={itemList}
                  selectedProduct={product}
                  updateMyData={updateMyData}
                  getTrProps={onRowClick}
                  selectedRowId={selectedRow}
                  boughtBatchSerials={setPurchasedBatchSerials}
                />
                : viewCoulmnState == "edit" ?
                  <Table
                    columns={columns}
                    data={product}
                    itemList={itemList}
                    selectedProduct={product}
                    updateMyData={updateMyData}
                    getTrProps={onRowClick}
                    selectedRowId={selectedRow}
                    boughtBatchSerials={setPurchasedBatchSerials}
                  /> : <Table
                    columns={columns}
                    data={product}
                    itemList={itemList}
                    selectedProduct={product}
                    updateMyData={addMyData}
                    getTrProps={onRowClick}
                    selectedRowId={selectedRow}
                    boughtBatchSerials={setPurchasedBatchSerials}
                  />
              }
            </div>
          </div>
          <div className="row">
            <div className="col w100">
              <div className="row">
                <div className="col w75">
                  <div className="privInvoiceDetail">
                    <div className="title">
                      <Text content="Previous Invoice Detail" />
                    </div>
                    <div className="invoiceDetail">
                      <table>
                        <tbody>
                          <tr>
                            <td className="lbl">
                              <Text content="Bill No" />:
                            </td>
                            <td>{prevInvoiceDetail.billSeries}</td>
                            <td className="lbl">
                              <Text content="Debit Card" /> :
                            </td>
                            <td>{prevInvoiceDetail.debitCard}</td>

                            <td className="lbl">
                              <Text content="Credit Card" /> :
                            </td>
                            <td>{prevInvoiceDetail.creditCard}</td>
                            <td className="lbl">
                              <Text content="Adv Amount" /> :
                            </td>
                            <td>{prevInvoiceDetail.advAmount}</td>
                          </tr>
                          <tr>
                            <td className="lbl">
                              <Text content="Total Qty" /> :
                            </td>
                            <td>
                              {numberWithCommas(prevInvoiceDetail.totalQty)}
                            </td>
                            <td className="lbl">
                              <Text content="Coupon Amount" /> :
                            </td>
                            <td>{prevInvoiceDetail.couponAmount}</td>

                            <td className="lbl">
                              <Text content="Other Amount" /> :
                            </td>
                            <td>{prevInvoiceDetail.otherAmount}</td>
                            <td className="lbl">
                              <Text content="Cash Amount" />:
                            </td>
                            <td>{prevInvoiceDetail.cashAmount}</td>
                          </tr>
                          <tr>
                            <td className="lbl">
                              <Text content="Bill Date" />:
                            </td>
                            <td>
                              {prevInvoiceDetail.billDate &&
                                prevInvoiceDetail.billDate !== "N/A"
                                ? getFormateDate(prevInvoiceDetail.billDate)
                                : "N/A"}
                            </td>
                            <td className="lbl">
                              <Text content="Net Amount" /> :
                            </td>
                            <td>
                              {numberWithCommas(prevInvoiceDetail.netAmount)}
                            </td>

                            <td className="lbl">
                              <Text content="Total MRP" /> :
                            </td>
                            <td>
                              {numberWithCommas(prevInvoiceDetail.totalMrp)}
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col w25">
                  <div className="amountDetail">
                    <table>
                      <tbody>
                        {/* <tr>
                          <td>
                            <Text content="Total Qty" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.totalQty)}</td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="MRP Value" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.mrpValue)}</td>
                        </tr> */}
                        <tr>
                          <td>
                            <Text content="Gross Amount" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.grossAmount)}</td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="Ammount Without Tax" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.grossAmount)}</td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="Net Tax Amount" />
                          </td>
                          <td>:</td>
                          <td>
                            {numberWithCommas(footerState.totalTax)}
                          </td>
                        </tr>
                        {/* <tr>
                          <td>
                            <Text content="Total Amount" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.totalAmount)}</td>
                        </tr> */}

                        <tr>
                          <td>
                            <Text content="Net Amount" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.finalAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="invoiceAction">

                    <button
                      className={
                        pageLoadStatus(val) || val === "view"
                          ? "grey"
                          : "darkBlue"
                      }
                      onClick={
                        pageLoadStatus(val) || val === "view"
                          ? () => {
                            return false;
                          }
                          : () => ActionwiseList("discard")
                      }
                    >
                      <Text content="Discard Bill" />
                    </button>
                    
                    <button
                      className={
                        pageLoadStatus(val) || val === "view" ? "grey" : "darkBlue"
                      }
                      onClick={
                        pageLoadStatus(val) || val === "view"
                          ? () => {
                            return false;
                          }
                          : () => ActionwiseList("cancel")
                      }
                    >
                      <Text content="Cancel Bill" />
                    </button>

                    <button
                      className={
                        pageLoadStatus(val) || val === "view" ? "grey" : "darkBlue"
                      }
                      onClick={
                        pageLoadStatus(val) || val === "view"
                          ? () => {
                            return false;
                          }
                          : () => ActionwiseList("recall")
                      }
                    >
                      <Text content="Recall Bill" />
                    </button>

                    <button
                      className="billinfoBtn"
                      onClick={() => {
                        setViewBillinginfo(true);
                        setViewTaxinfo(false);
                      }}
                    >
                      <Text content="Billing Info" />
                    </button>
                    <button
                      className="taxinfoBtn"
                      onClick={() => {
                        setViewTaxinfo(true);
                        setViewBillinginfo(false);
                      }}
                    >
                      <Text content="Tax Info" />
                    </button>
                    <button
                      className="lotbatchBtn"
                      onClick={() => {
                        setSlbatchArraysts(true);
                      }}
                    >
                      <Text content="Lot / Batch Detail" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {

            // (val == 'view') ? (
            <BoughtSerialsBatchItemListModal
              show={boughtSerialItemsModal}
              onHide={() => setBoughtSerialItemsModal(false)}
              snb={boughtSerial}
            // onClickOk={setSelectedSerialList}
            // checkedSerial={setCheckedSerialData}
            />
            // ) : (
            //   null
            // )
          }

          <div className="row">
            <div className="col w100">
              <div className="RemarkForm mt-2 mb-2">
                <label htmlFor="">
                  <Text content="Remark" />
                </label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="Write Remarks here …."
                  value={inputRemarks}
                  onChange={(e) => setInputRemarks(e.target.value)}
                  readOnly={pageLoadStatus(val)}
                // onFocus={() => {
                //   setInputRemarks("");
                // }}
                ></textarea>
              </div>
            </div>
          </div>
          {/* <iframe
            id="ifmcontentstoprint"
            title="print"
            style={{
              height: "0px",
              width: "0px",
              position: "absolute",
              display: "none",
            }}
          ></iframe>

          <div id="divcontents" style={{ display: "none" }}>
            <Print {...printData} />
          </div> */}
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
      {viewTaxinfo && (
        <div className="rightOverlaySec">
          <div className="taxInfo">
            <div className="title">
              <Text content="Tax Info" />
              <button
                className="closebtn"
                onClick={() => setViewTaxinfo(false)}
              ></button>
            </div>
            <div className="taxinfoD">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Text content="Total Qty" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.totalQty)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="MRP Value" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.mrpValue)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Gross Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.grossAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Total Discount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.totalDiscount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Total Tax" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.totalTax)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Total Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.totalAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Dis" /> %
                    </td>

                    <td>
                      <input
                        type="text"
                        value={footerState.totalDiscountPerc}
                        onChange={discChange}
                        readOnly={
                          pageLoadStatus(val) || val === "view"
                            ? true
                            : false
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Dis Amount" /> :
                    </td>

                    <td>
                      {numberWithCommas(footerState.amountDiscPerc)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Round OFF" />
                    </td>

                    <td>{footerState.roundOff}</td>
                  </tr>

                  <tr>
                    <td>
                      <Text content="Final Amount" />
                      <span className="required">*</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.finalAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Recd Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.receivedAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Balance Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.balanceAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Cash Recived" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.cashReceived)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="Tender" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={footerState.tender}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="SGST Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.sgstAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="CGST Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.cgstAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Text content="IGST Amount" />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={numberWithCommas(footerState.igstAmount)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {viewBillinginfo && (
        <div className="rightOverlaySec">
          <div className="BillingInfo">
            <div className="title">
              <Text content="Billing Info" />
              <button
                className="closebtn"
                onClick={() => setViewBillinginfo(false)}
              ></button>
            </div>
            <div className="billingInfoD">
              <h4>
                <Text content="Billing Detail" />
              </h4>
              <div className="formbox">
                <label>
                  <Text content="State" />
                </label>
                <select
                  onChange={(e) => billinfoOnchange(e)}
                  name="bState"
                  value={billingInfo.bState}
                  disabled={
                    pageLoadStatus(val) || val === "view" ? "disabled" : ""
                  }
                >
                  <option value="">None</option>
                  {stateList.map((a, i) => (
                    <option key={i} value={a.StateId}>
                      {a.StateName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formbox">
                <label>
                  <Text content="Country" />
                </label>
                <select
                  disabled="disabled"
                  name="bCountry"
                  value={billingInfo.bCountry}
                >
                  <option>None</option>
                  <option value="5">India</option>
                </select>
              </div>
              <div className="formbox">
                <label>
                  <Text content="Billing Address" />
                </label>
                <input
                  type="text"
                  name="bAddress"
                  value={billingInfo.bAddress}
                  onChange={(e) => billinfoOnchange(e)}
                  readOnly={
                    pageLoadStatus(val) || val === "view" ? true : false
                  }
                />
              </div>
              <div className="formbox">
                <label>
                  <Text content="Billing GSTN no" />
                </label>
                <input
                  type="text"
                  name="bGSTN"
                  value={billingInfo.bGSTN}
                  onChange={(e) => billinfoOnchange(e)}
                  readOnly={
                    pageLoadStatus(val) || val === "view" ? true : false
                  }
                />
              </div>
              <h4>
                <Text content="Shipping Detail" />
              </h4>
              <div className="formbox">
                <label>
                  <Text content="State" />
                </label>
                <select
                  onChange={(e) => billinfoOnchange(e)}
                  name="sState"
                  value={billingInfo.sState}
                  disabled={
                    pageLoadStatus(val) || val === "view" ? "disabled" : ""
                  }
                >
                  <option value="">None</option>
                  {stateList.map((a, i) => (
                    <option key={i} value={a.StateId}>
                      {a.StateName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formbox">
                <label>
                  <Text content="Country" />
                </label>
                <select
                  disabled="disabled"
                  name="sCountry"
                  value={billingInfo.sCountry}
                >
                  <option>None</option>
                  <option value="5">India</option>
                </select>
              </div>
              <div className="formbox">
                <label>
                  <Text content="Shipping Address" />
                </label>
                <input
                  type="text"
                  name="sAddress"
                  value={billingInfo.sAddress}
                  onChange={(e) => billinfoOnchange(e)}
                  readOnly={
                    pageLoadStatus(val) || val === "view" ? true : false
                  }
                />
              </div>
              <div className="formbox">
                <label>
                  <Text content="Shipping GSTN no" />
                </label>
                <input
                  type="text"
                  name="sGSTN"
                  value={billingInfo.sGSTN}
                  onChange={(e) => billinfoOnchange(e)}
                  readOnly={
                    pageLoadStatus(val) || val === "view" ? true : false
                  }
                />
              </div>
              <div className="invoiceAction">
                <button
                  onClick={() => setViewBillinginfo(false)}
                  className="red"
                  style={{ width: "200px", marginLeft: "auto" }}
                >
                  <Text content="Close Billing Info" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {console.log(batchArray, "batchArray batchArray ")}
      {console.log(product, "product product")}

      <ItemPopup
        itemListPopup={itemListPopup}
        getcheckedRowsPop={getcheckedRowsPop}
        setCheckedItemPopup={(a) => setCheckedItemPopup(a)}
        getCheckedRowsItemPopup={(res) => getCheckedRowsItemPopup(res)}
        checkedItemPopup={checkedItemPopup}
        okItemPopBtn={(b) => okItemPopBtn(b)}
        serialSts={serialSts}
        itemSeriralList={itemSeriralList}
        setItemSeriralList={(list) => setItemSeriralList(list)}
        setSerialSts={(s) => setSerialSts(s)}
        batchSts={batchSts}
        setBatchSts={(s) => setBatchSts(s)}
        batchArray={batchArray}
        setBatchArray={(b) => setBatchArray(b)}
        checkedItemSerial={checkedItemSerial}
        setCheckedItemSerial={(c) => setCheckedItemSerial(c)}
        itemPopup={itemPopup}
        selectedBatchArray={(a) => selectedBatchArray(a)}
        setItemPopup={(a) => setItemPopup(a)}
        OkSerialbtn={() => OkSerialbtn()}
        product={product}
      />
      {/* {itemPopup === true ?  <div className="modalPopUp">
        <div className="modalPopUPin">
        <CustomTable
              coulmn={[
                { header: "Group", field: "groupName" },
                { header: "Item Name", field: "ItemName" },
                { header: "Part No", field: "ItemCode" },
                { header: "Stock", field: "Stock" },
              ]}
              data={itemListPopup}
              overFlowScroll={true}
              checkbox={true}
              selectedRows={checkedItemPopup}
              getCheckedItem={(res) => getCheckedRowsItemPopup(res)}
              //Footer={true}
              filter={true}
            />
             <div className="popupButton">
              <button
                className="btn btnGreen mr-5 mlAuto"
                onClick={()=>okItemPopBtn()}
              >
                <Text content="Ok" />
              </button>
              <button className="btn btnRed" onClick={() => setItemPopup(false)}>
                <Text content="Cancel" />
              </button>
            </div>
        </div>
      </div>:""} */}

      {/*
  // header: "MRP", field: "PartyMobileNo" ,
             // header: "Remarks", field: "PartyMobileNo" ,
           */ }
      {slbatchArraysts && <div className="modalPopUp">
        <div className="modalPopUPin">

          <CustomTable
            coulmn={[
              { header: "Item Code", field: "ItemCode" },
              { header: "Item Name", field: "ItemName" },
              { header: "Batch No", field: "batchno" },
              { header: "Lot No", field: "lotno" },
              { header: "Stock", field: "stock" },
              { header: "Out Qty", field: "QtyOut" },
              { header: "Mfg Date", field: "manufacturingdate" },
              { header: "Exp. Date", field: "expirydate" },
              { header: "MRP", field: "MRP" },
              { header: "Remarks", field: "Remarks" },
              { header: "Serial Detail", viewBtn: true, viewBtntext: "View Item" },
            ]}
            //Viewbtnclick={(batch_id) => viewSerialbtn(batch_id)}
            Viewbtnclick={(id) => viewSerialbtn(id)}
            // data={slbatchArray}
            data={soldItems}
            overFlowScroll={true}
            Footer={false}
            filter={false}
          // style={{width:'100%',height:'100%'}}
          />
          <div className="popupButton">
            <button className="btn btnRed" style={{ marginLeft: "auto" }} onClick={() => setSlbatchArraysts(false)}>
              <Text content="Close" />
            </button>
          </div>
        </div></div>
      }

      {open && (
        <div className="modalPopUp">
          <div className="modalPopUPin">
            {/* {serialSts === true ?
            <CustomTable
            coulmn={[
              { header: "serialno", field: "serialno" },
              { header: "Auto Generated", field: "uniqueserialno" },
              { header: "Warrenty Date", field: "warrentydate" },
              { header: "Expiry Date", field: "Expiry Date" },
            ]}
            data={itemSeriralList}
            overFlowScroll={true}
            checkbox={true}
            selectedRows={checkedItem}
            getCheckedItem={(res) => getCheckedRows(res)}
           
          />:batchSts === true ? <CustomTable
          coulmn={[
                { header: "Batch No", field: "batchno" },
                { header: "Lot No", field: "lotno" },
                { header: "Stock", field: "stock" },
                { header: "Qty Out", field: "QtyOut",cell: "EditInput"},
                { header: "Batch Date", field: "batchdate" },
                { header: "Mfg. Date", field: "manufacturingdate" },
                { header: "Exp. Date", field: "expirydate" },
                { header: "MRP", field: "mrp" },
          ]}
          selectedTr={(item) => selectedRowBatch(item)}
          editColumn={true}
          data={batchArray}
          overFlowScroll={true}
          editStatus={edit}
          checkbox={false}
          selectedRows={checkedItemBatch}
          editfunction={() => editItem()}
          tblInputOnchange={(e) => tableInputOnchangeBatch(e)}
          editbtnText="Add OutQty"
          getCheckedItem={(res) => getCheckedRowsBatch(res)}
          refreshTable={refreshtbl}
         
        />:*/}
            <CustomTable
              coulmn={[
                { header: "Bill No", field: "BillNo" },
                { header: "Date", field: "Date" },
                { header: "Time", field: "Time" },
                { header: "Party Name", field: "PartyName" },
                { header: "Mobile No", field: "PartyMobileNo" },
              ]}
              data={popuptableitem}
              overFlowScroll={true}
              checkbox={true}
              selectedRows={checkedItem}
              getCheckedItem={(res) => getCheckedRows(res)}
              Footer={true}
              filter={true}
            />
            <div className="popupButton">
              <button
                className="btn btnGreen mr-5 mlAuto"
                onClick={
                  popbtntext === "discard"
                    ? () => popupOkfunc("discard")
                    : popbtntext === "recall"
                      ? () => popupOkfunc("recall")
                      : popbtntext === "cancel"
                        ? () => popupOkfunc("cancel")
                        : () => {
                          return false;
                        }
                }
              >
                {popbtntext === "discard" ? (
                  <Text content="Discard Bill" />
                ) : popbtntext === "recall" ? (
                  <Text content="Recall Bill" />
                ) : popbtntext === "cancel" ? (
                  <Text content="Cancel Bill" />
                ) : popbtntext === "Ok" ? <Text content="Ok" /> : (
                  ""
                )}
              </button>
              <button className="btn btnRed" onClick={() => cancelPopup()}>
                <Text content="Cancel" />
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
export default BillPos;
