import React, { useState, useEffect, useMemo, useRef } from "react";
import Table from "../billPos/table";
import "../billPos/billPos.scss";
import CommonFormAction from "../../common/commonFormAction";
import COLUMNS from "./columns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Timer from "../billPos/timer";
//import Print from "./print";
import CustomTable from "../../common/table";
import db from "../../../datasync/dbs";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  fnCRoundOff,
  getItemstockQtyindexDb,
  globalsettingValueById,
} from "../../common/commonFunction";
import {
  //fn_GetCustomerMaster,
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
import column from "./poptablecolum";
const BillPoswithSaleorder = ({ pageNav }) => {
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
  const [selectedProduct, setProduct] = useState(null);
  const [product, setProducts] = useState([]);
  const [dropDownOption, setDropDownOption] = useState("");
  const [codeFocus, setCodeFocus] = useState("");
  const [invoiceId, setInvoiceId] = useState(0);
  const [serverInvoiceId, setServerInvoiceId] = useState({ id: "", Id: 0 });
  const [checkedItem, setCheckedItem] = useState();
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [open, setOpen] = useState(false);
  const [custdropdn, setCustdropdn] = useState(false);
  const [popbtntext, setPopbtntext] = useState("");
  const [popuptableitem, setPopuptableitem] = useState([]);
  const [openP, setOpenP] = useState(false);
  const [cussaleorderlist, setcussaleorderlist] = useState([]);
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

  //const [actionLink, setActionLink] = useState();
  // const [customerList, setCustomerList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowInfoId, setRowInfoId] = useState();
  // To-maintain icons state
  let [val, setVal] = useState("");
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [billDate, setBillDate] = useState(null);
  const [error, setError] = useState({ mobileError: "", salesPerson: "" });
  //const [mobileNumber, setMobileNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [saleInvoiceData, setSaleInvoiceData] = useState({});
  const [saleorderList, setSaleorderList] = useState([]);
  const [isProductSelected, setIsProductSelected] = useState(false);
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
  const [billingTypedata, setBillingTypedata] = useState([]);
  const [billingTypevalue, setBillingTypevalue] = useState("");
  const [influencerlist, setInfluencerlist] = useState([]);
  const [influencerValue, setInfluencerValue] = useState("");
  const [influencerId, setInfluencerId] = useState(null);

  // To store data from input fields for invoice n details
  //const [newData, setNewData] = useState("");
  // To get state list
  const getStateList = async () => {
    let sList = await db.stateMaster.toArray();
    if (sList) {
      setStateList(sList);
    }
  };
  const statewiseTax = () => {
    const calcData = calcProductAndFooter(1, product);
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
      // fnBindProduct();
      // cusotmerList();
      setRecallsts(false);
      getoucherList();
      billingType();
      InfluencerData();
      getStateList();
      saleorderlist();
      slpList();
      discard();
      setBillDate(new Date());
      return setVal(arg);
    }

    if (arg === "edit") {
      //  fnBindProduct();
      // cusotmerList();
      setRecallsts(false);
      getStateList();
      getEditDetails();
      billingType();
      InfluencerData();
      slpList();
      discard();
      setMethod(true);
      setSalesPerson({
        ...salesPerson,
        slpdropdown: false,
      });
      return setVal(arg);
    }

    if (arg === "view") {
      //  fnBindProduct();
      //cusotmerList();
      getStateList();
      getDetails();
      discard();
      setSalesPerson({
        ...salesPerson,
        slpdropdown: false,
      });
      setMethod(true);
      return setVal(arg);
    }

    if (arg === "save") {
      if (billCancel) {
        alert("This bill already canceled you can not edit it.");
      } else {
        submit("save");
      }
    }

    if (arg === "refresh") {
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
  const saleorderlist = async () => {
    const slList = await db.SaleOrder.toArray();
    if (slList) {
      let unique = [...new Set(slList.map((x) => x.PartyId))];
      let arr = unique.map((a, index) => {
        //  console.log(a)
        let x = slList.find((b) => b.PartyId === a);
        return x;
      });
      setSaleorderList(
        arr.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
      );
    }
  };
  // const fnBindProduct = async () => {
  //   const productListTemp = await fn_GetItemMaster();
  //   // const stocklist = await db.getItemStock.toArray();
  //   if (productListTemp && productListTemp.length > 0) {
  //     let productTemp = [];
  //     for (var x of productListTemp) {
  //       const ItemStock = await getItemstockQtyindexDb(x.ItemId);
  //       if (ItemStock > 0) {
  //         productTemp.push({ value: x.ItemId, label: x.ItemName });
  //       }
  //     }
  //     setItemList(productTemp);
  //   }
  // };
  async function fnGetData() {
    //await fnBindProduct();
    // const CustomerData = await fn_GetCustomerMaster();
    // setCustomerList(CustomerData);
    await fnShowSalesInvoice();
  }
  // const cusotmerList = async () => {
  //   const CustomerData = await fn_GetCustomerMaster();
  //   setCustomerList(
  //     CustomerData.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
  //   );
  // };

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
    } catch (error) {}
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
        let Tcount = await db.salesInvoiceWithSO
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
          ? await db.salesInvoiceWithSO.where("seriesid").equals(0).toArray()
          : await db.salesInvoiceWithSO
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
          ? await db.salesInvoiceWithSO.where("seriesid").equals(0).toArray()
          : await db.salesInvoiceWithSO
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
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [codeFocus, dropDownOption, rowInfoId, custdropdn]);

  const calcProductAndFooter = (selectedOption, selectedProd, type) => {
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
        let amount = 0;
        let prevProducts = product;
        let roundOff = 0;
        let amountDiscPerc = 0;

        let totalQty = 0;
        let totalMrp = 0;
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
        let spt = Array.isArray(selectedProd) ? selectedProd : [selectedProd];
        let tempProduct = prevProducts.find((m) => m.ItemId === selectedOption);
        if (
          type === "new" &&
          !(tempProduct && Object.keys(tempProduct).length > 0)
        )
          selectedProducts = [...prevProducts, ...spt];
        else if (
          type === "new" &&
          tempProduct &&
          Object.keys(tempProduct).length > 0
        )
          selectedProducts = prevProducts;
        selectedProducts = selectedProducts.map((item) => {
          item = fn_CheckItem(
            item,
            type === "new",
            selectedOption,
            prevProducts
          );
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
          console.log(totalQty, "quantity");
          totalQty += quantity === "" ? 0 : quantity;
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
  // function numberWithOutCommas(x) {
  //   return x > 0 ? x.replaceAll(",", "") : x;
  // }
  const fnRoundOff = (n) => {
    let roundff = fnCRoundOff(n);
    return roundff;
    // n = Math.abs(n);
    // let q1 = 0;
    // let q2 = 0;
    // if (n > 0) {
    //   n = (n + "").split("."); // Change to positive
    //   let decimal = n[1];
    //   if (decimal > 0) {
    //     q1 = decimal;
    //     q2 = divNo(decimal) - decimal;
    //     if (q1 < q2) {
    //       return -(q1 / divNo(decimal));
    //     } else {
    //       return q2 / divNo(decimal);
    //     }
    //   } else {
    //     return 0;
    //   }
    // }
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
  const updateMyData = (rowIndex, columnId, value) => {
    let s1 = product;
    s1[rowIndex][columnId] = value;
    const calcData = calcProductAndFooter(1, s1);
    setFooterState(() => {
      return { ...calcData.footer };
    });
    setProducts(calcData.products);
  };

  const totalAmount = (quantity, mrp) => {
    quantity = quantity && quantity > 0 ? parseInt(quantity) : 0;
    mrp = mrp && mrp > 0 ? parseInt(mrp) : 0;
    let amount = quantity * mrp;
    return amount;
  };
  const getcustomer = async (value) => {
    if (value) {
      const costm = await db.customerMaster
        .where("Id")
        .equals(value.PartyId)
        .first();
      const slOlist = await db.SaleOrder.where("PartyId")
        .equals(value.PartyId)
        .toArray();
      const sl = slOlist.map((s) => {
        return { ...s, ItemId: parseInt(s.Id), id: parseInt(s.Id) };
      });
      //console.log(costm,"costm");
      setCustomerName(costm.PartyName);
      setCustomerCode(costm.PartyCode);
      setPartyId(value.PartyId);
      //setCustomerCode(costm.PartyCode);
      setcussaleorderlist(sl);
      setCodeFocus("");
      setDropDownOption("");
      setProducts([]);
      setCheckedItem();
    }
    // if (customer) {
    //   setMobileNumber(customer.Phone1);
    //   setCustomerName(customer.PartyName);
    //   setCustomerData(customer);
    //   setPartyId(customer.Id);
    // }

    // setCodeFocus("");
    // setDropDownOption("");
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
  // const mobileChange = (e) => {
  //   try {
  //     setRequired({ mobileNumber: "" });
  //     if (e.target.value >= 0) {
  //       setMobileNumber(e.target.value);
  //       if (e.target.value.length === 10) {
  //         if (e.target.value === /^[a-z-A-Z-\s]+$/) {
  //           setError({ mobileError: "Please enter Numbers only" });
  //         }
  //         fnGetCustomerData(e.target.value);
  //       }
  //     } else {
  //       setError({ mobileError: "Please enter number" });
  //       setTimeout(() => {
  //         setError({ mobileError: "" });
  //       }, 1000);
  //     }
  //     fnGetCustomerData(e.target.value);
  //   } catch (error) {}
  // };
  // const fnGetCustomerData = async (mobileNo) => {
  //   if (mobileNo !== "") {
  //     let customerListTemp = await fn_GetCustomerMaster();
  //     const customerObject =
  //       customerListTemp &&
  //       customerListTemp.length > 0 &&
  //       customerListTemp.find((m) => m.Phone1 === mobileNo);
  //     if (customerObject && Object.keys(customerObject).length > 0) {
  //       // setMobileNumber(customerObject.Phone1);
  //       setCustomerName(customerObject.PartyName);
  //       setCustomerData(customerObject);
  //       setPartyId(customerObject.Id);
  //     }
  //   }
  // };

  // Validation function
  const valid = (arg1, arg2) => {
    const focusKeys = {
      customerCode: "customerCode",
      timer: "billtime",
      billDate: "invoiceno",
      billSeries: "billSeries",
    };
    const keys = [
      "billSeries",
      "invoicedate",
      "billDate",
      "customerCode",
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
      Id: serverInvoiceId.Id !== 0 ? serverInvoiceId.Id : 0,
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
      influencerid: influencerId,
      billingtype: billingTypevalue,
      //mobilenumber: mobileNumber,
    };
    if (valid(saleInvoice, product)) {
      if (invoiceId > 0) {
        await update({ ...saleInvoice, id: serverInvoiceId.id });
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
      }
    }
  };
  const update = async (saleInvoice) => {
    //saleInvoice.id = invoiceId;
    const updateRes = await fn_UpdateInvoice(
      saleInvoice,
      product,
      pageNav.formid
    );
  };
  const getTodayInvoice = async () => {
    let xList = await db.salesInvoiceWithSO.toArray();
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
        ? await db.salesInvoiceWithSO.where("ishold").equals("true").toArray()
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
    setServerInvoiceId({ id: "", Id: 0 });
    setBillingTypedata([]);
    setBillingTypevalue("");
    setInfluencerlist([]);
    setInfluencerValue("");
    setInfluencerId(null);
    setCustomerCode("");
    setProduct(null);
    setProducts([]);
    setInvoiceId(0);
    setSalesPersonList([]);
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
    //setCustomerList();
    setVal("");
    setBillDate(null);
    setError({ mobileError: "" });
    // setMobileNumber("");
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
    setServerInvoiceId({ id: obj.id, Id: obj.Id });
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
    setCustomerCode(partyname.PartyCode);
    setPartyId(obj.partyid);
    const slOlist = await db.SaleOrder.where("PartyId")
      .equals(obj.partyid)
      .toArray();
    const sl = slOlist.map((s) => {
      return { ...s, ItemId: parseInt(s.Id), id: parseInt(s.Id) };
    });
    setcussaleorderlist(sl);
    setProducts([]);
    if (obj && Object.keys(obj).length > 0 && obj.id > 0) {
      let formData = await fn_GetSaleInvoiceId(obj.id);
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
      // fnGetCustomerData(formData.mobilenumber);
      setMethod(false);
      setPartyId(formData.partyid);
      //setMobileNumber(formData.mobilenumber);
      setBillDate(formData.invoicedate);
      setInputRemarks(formData.remarks);
      setFooterState((old) => {
        old.totalDiscountPerc = formData.discountpermanual;
        old.amountDiscPerc = formData.discountamountmanual;
        return { ...old };
      });
      // await fnBindProduct();
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
    fnBindPage(formData);
    //await fnBindProduct();
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
    if (formData && formData.product && formData.product.length > 0) {
      formData = await fnFormatTableData(formData);
      setProducts(formData);
      const calcData = calcProductAndFooter(1, formData);
      setFooterState((old) => {
        return { ...old, ...calcData.footer };
      });
      setProducts(calcData.products);
    }
  };
  const fnBindPage = async (formData) => {
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
    setInvoiceId(
      formData.Id === 0 || formData.Id === "" ? formData.id : formData.Id
    );
    setBillCancel(formData.iscancelled === "true" ? true : false);
    //fnGetCustomerData(formData.mobilenumber);
    setMethod(false);
    setPartyId(formData.partyid);
    setBillTime(formData.billtime);
    setBillSeries(formData.invoiceno);
    //setMobileNumber(formData.mobilenumber);
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
      let stockb = await getItemstockQtyindexDb(item.itemid);
      let st = await db.getItemStock
        .where("itemid")
        .equals(item.itemid)
        .first()
        .then()
        .catch((err) => alert("somthing went wrong"));
      productlist.push({
        id: item.id,
        invoiceId: item.invoiceid,
        ItemId: item.itemid,
        quantity: item.quantity,
        ItemName: item.ItemName,
        ItemCode: item.ItemCode,
        mrp: item.mrp,
        stock: stockb,
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
        HsnId: item.HsnId,
        SoDetailId: item.SoDetailId,
        SoId: item.SoId,
        SoNo: item.SoNo,
        sodetailid: 0,
        schemecode: item.schemecode,
        //mobileNumber: item.mobilenumber,
        istaxinclusive: item.istaxinclusive,
      });
    }
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
  const getCheckedRows = (res) => {
    setGetcheckedRows(res);
  };
  const tempDelete = async (id) => {
    let item = await db.saleInvoiceDetailWithSO
      .where("invoiceid")
      .equals(id)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (item.length > 0) {
      const itemids = item.map((a) => {
        return a.id;
      });
      await db.salesInvoiceWithSO.delete(id);
      await db.saleInvoiceDetailWithSO
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
            let item = await db.saleInvoiceDetailWithSO
              .where("id")
              .equals(x)
              .toArray()
              .then()
              .catch((err) => console.log(err));
            items = [...items, ...item];
          }
          const itemids = items.map((a) => {
            return a.id;
          });
          await db.salesInvoiceWithSO
            .bulkDelete(ids)
            .then((res) =>
              db.saleInvoiceDetailWithSO
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
        await db.salesInvoiceWithSO
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
          setPopuptableitem([]);
          setOpen(false);
        }
      } else {
        alert("Please select bill");
      }
    }
  };
  const handleOpen = () => {
    if (customerName) {
      setOpenP(true);
    }
  };
  /**
   *close Item popup
   */
  const handleClose = () => {
    setOpenP(false);
  };
  const ObjItem = (itemObj) => {
    let object = [];
    itemObj.map((o, i) => {
      o.SoDetail &&
        o.SoDetail.length > 0 &&
        o.SoDetail.map((k) => {
          k.SoNo = o.SoNo;
          return { ...k };
        });
      object = [...object, ...o.SoDetail];
      return o;
    });
    return object;
  };
  const okSubmit = async () => {
    const ids = getcheckedRows.map((a) => {
      return a.Id;
    });
    const objget = ObjItem(getcheckedRows);
    if (ids) {
      setCheckedItem(ids);
      if (objget.length > 0) {
        setIsProductSelected(true);
        if (product.length < 1) {
          setItemarray(objget, ids);
        } else {
          const results = objget.filter(
            ({ SoId: id1 }) => !product.some(({ SoId: id2 }) => id2 === id1)
          );
          const results2 = product.filter(
            ({ SoId: id1 }) => !objget.some(({ SoId: id2 }) => id2 === id1)
          );
          console.log(results, "results");
          console.log(results2, "results2");
          if (results.length > 0) {
            const xarr = [...product, ...results];
            console.log(xarr, "xarr");
            setItemarray(xarr, ids);
          }
          if (results2.length > 0) {
            const results3 = product.filter(
              ({ SoId: id1 }) => !results2.some(({ SoId: id2 }) => id2 === id1)
            );
            if (results3) {
              console.log(results3, "results3");
              setItemarray(results3, ids);
            }
          }
        }
      } else {
        setProducts([]);
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
      }
      setOpenP(false);
    }
  };
  const setItemarray = async (proarray, ids) => {
    console.log(proarray, "proarray");
    const array = [];
    for (let arr of proarray) {
      let itemMasterDetail = await fn_GetItemMasterDetail(
        arr,
        getFormateDate(billDate)
      );
      array.push(itemMasterDetail);
    }
    console.log(array, "array");
    if (array.length > 0) {
      const calcData = calcProductAndFooter(1, array, "");
      if (calcData) {
        setFooterState(() => {
          return { ...calcData.footer };
        });
        // setProducts(calcData.products);
        const prod = calcData.products.filter((a) => a.stock > 0);
        if (prod.length > 0) {
          const ids = prod.map((id) => {
            return id.SoId;
          });
          let unique = [...new Set(ids)];
          setCheckedItem(unique);
          setProducts(calcData.products.filter((a) => a.stock > 0));
        } else {
          alert("Items are out of stock");
        }
      }
    }
  };
  const onSpace = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      setError({ ...error, mobileError: "Spce Not Allowed" });
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
                  {/* <div className="col w33">
                    <div className="formBox">
                      <label htmlFor="">
                        Mobile No<span className="required">*</span>
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
                  </div> */}
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
                          options={saleorderList}
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
                  <div className="col w33">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Customer Code" />
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerCode"
                        readOnly={true}
                        value={customerCode}
                        className={required.customerCode}
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
                {influencerlist.length > 0 || billingTypedata.length > 0 ? (
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
                  </div>
                ) : (
                  ""
                )}
                <div className="row"></div>
                <div className="row">
                  <div className="col w33">
                    <div className="invoiceAction">
                      <button
                        style={{ margin: "0" }}
                        className={
                          customerName === ""
                            ? "grey"
                            : val === "view"
                            ? "grey"
                            : "green"
                        }
                        onClick={
                          customerName === ""
                            ? () => {
                                return false;
                              }
                            : val === "view"
                            ? () => {
                                return false;
                              }
                            : handleOpen
                        }
                      >
                        <Text content="Sale Order List" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col w25">
              {billCancel && (
                <div className="cancelsts">
                  <Text content="Canceled" />
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col w100">
              <Table
                columns={columns}
                data={product}
                itemList={itemList}
                selectedProduct={product}
                updateMyData={updateMyData}
                getTrProps={onRowClick}
                selectedRowId={selectedRow}
              />
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
                  <div className="invoiceAction">
                    <button
                      className={
                        pageLoadStatus(val) || val === "view" ? "grey" : "green"
                      }
                      onClick={
                        pageLoadStatus(val) || val === "view"
                          ? () => {
                              return false;
                            }
                          : () => submit("hold")
                      }
                    >
                      <Text content="Hold Bill" />
                    </button>
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
                        pageLoadStatus(val) || val === "view" ? "grey" : "red"
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
                    {/* <button
                          className={
                            pageLoadStatus(val) || val === "view" ? "grey" : "red"
                          }
                          onClick={
                            pageLoadStatus(val) || val === "view"
                              ? () => {
                                  return false;
                                }
                              : () => submit("cancel")
                          }
                        >
                          Cancel Bill
                        </button> */}
                    <button
                      className={
                        pageLoadStatus(val) || val === "view" ? "grey" : "blue"
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
                    {/* <button
                          className={
                            pageLoadStatus(val) || val === "view" ? "grey" : "blue"
                          }
                          onClick={
                            pageLoadStatus(val) || val === "view"
                              ? () => {
                                  return false;
                                }
                              : () => fnGetHoldSalesInvoice()
                          }
                        >
                          Recall Bill
                        </button> */}
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
                  </div>
                </div>
                <div className="col w25">
                  <div className="amountDetail">
                    <table>
                      <tbody>
                        <tr>
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
                        </tr>
                        <tr>
                          <td>
                            <Text content="Gross Amount" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.grossAmount)}</td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="Total Amount" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.totalAmount)}</td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="Dis" /> %
                          </td>
                          <td>:</td>
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
                          <td>:</td>
                          <td>
                            {numberWithCommas(footerState.amountDiscPerc)}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="Round OFF" />
                          </td>
                          <td>:</td>
                          <td>{footerState.roundOff}</td>
                        </tr>
                        <tr>
                          <td>
                            <Text content="Final Amount" />
                          </td>
                          <td>:</td>
                          <td>{numberWithCommas(footerState.finalAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                      <Text content="Recd Amount" />{" "}
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
                      <Text content="Balance Amount" />{" "}
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
                  readOnly={true}
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
                <label>State</label>
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
                  readOnly={true}
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
      {open && (
        <div className="modalPopUp">
          <div className="modalPopUPin">
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
                ) : (
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
      {customerName && openP ? (
        <div className="modalPopUp">
          <div className="modalPopUPin">
            <CustomTable
              coulmn={column}
              data={cussaleorderlist}
              overFlowScroll={true}
              checkbox={true}
              selectedRows={checkedItem}
              getCheckedItem={(res) => getCheckedRows(res)}
              Footer={false}
            />
            <div className="popupButton">
              <button
                onClick={() => okSubmit()}
                className="btn btnGreen mr-5 mlAuto"
              >
                Ok
              </button>
              <button onClick={() => handleClose()} className="btn btnRed">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* <div className="rightOverlaySec">
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Bill No</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Party Name</th>
                  <th>Mobile Name</th>
                </tr>
              </thead>
            </table>
          </div> */}
    </>
  );
};
export default BillPoswithSaleorder;
