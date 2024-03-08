import "./salesReturnBillWise.scss";
import CommonFormAction from "../../common/commonFormAction";
import validate from "../../common/validate";
import calenderIcon from "../../../images/icon/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import db from "../../../datasync/dbs";
import CustomTable from "../../common/table";
import column from "./column";
import Text from "../../common/text";
// import { getViewInvoiceDetails } from "../billPos/transactionDB";
import {
  getPercentCalc,
  getPercent,
  getVoucherIds,
  getSeries,
  getseriesNo,
  fnCRoundOff,
  getCustomerdetail,
  getItemDetail,
} from "../../common/commonFunction";
import { useState, useEffect } from "react";

const SalesReturnBillWise = ({ pageNav }) => {
  const plainObj = {
    Id: 0,
    saleReturnNo: "",
    saleReturnDate: "",
    customerName: "",
    PartyId: "",
    InvoiceType: "",
    AgainstInvoiceId: "",
    AgainstInvoiceNo: "",
    salepersonId: 0,
    totalQty: 0,
    cgstTax: 0,
    totalAmount: 0,
    grossAmount: 0,
    sgstTex: 0,
    discount: 0,
    totalDiscountAmount: 0,
    totalTax: 0,
    discountAmount: 0,
    roundOff: 0,
    remark: "",
    finalAmount: 0,
    products: [],
  };
  const [createObj, setCreateObj] = useState({
    ...plainObj,
    saleReturnDate: new Date(),
  });
  const [errorObj, setErrorObj] = useState(plainObj);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [invoiceLists, setInvoiceLists] = useState();
  const [val, setVal] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState("");
  const [selectRow, setSelectRow] = useState();
  const [editRow, setEditRow] = useState(false);
  const [edit, setEdit] = useState();
  const [refreshtbl, setRefreshtbl] = useState(false);
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [newQty, setNewQty] = useState("");
  const [disableDate, setDisableDate] = useState(true);
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.salesReturn.where("SeriesId").equals(0).toArray();
        let val = {
          series: "",
          seriesId: 0,
          sCount: 0,
          digit: 5,
          dbcount: count,
        };
        let sr = await getseriesNo(val, pageNav.formid);
        setCreateObj({ ...createObj, saleReturnNo: sr });
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count =
        series.seriesId === ""
          ? await db.salesReturn.where("SeriesId").equals(0).toArray()
          : await db.salesReturn
              .where("SeriesId")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      setCreateObj({ ...createObj, saleReturnNo: sr });
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count =
        series.seriesId === ""
          ? await db.salesReturn.where("SeriesId").equals(0).toArray()
          : await db.salesReturn
              .where("SeriesId")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      setCreateObj({ ...createObj, saleReturnNo: sr });
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  /**
   *  handlechange for inputs
   */
  const handleChange = (e) => {
    if (e.target.value === "") {
      setErrorObj({ ...errorObj, [e.target.name]: false });
      setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    }
    setErrorObj({ ...errorObj, [e.target.name]: false });
    let validateType = e.target.getAttribute("data-valid");
    if (validateType) {
      let checkValidate = validate(e.target.value, validateType);
      if (checkValidate) {
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
        setErrorObj({ ...errorObj, [e.target.name]: false });
      } else {
        setErrorObj({ ...errorObj, [e.target.name]: true });
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
      }
    } else {
      setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    }
  };

  const change_state = (arg) => {
    switch (arg) {
      case "edit": {
        setCreateObj({ ...plainObj, saleReturnDate: new Date() });
        setVal(arg);
        getListSalesreturn();
        setEditcoulmn(true);
        setDisableDate(false);
        return;
      }
      case "refresh": {
        refreshstate();
        setVal(arg);
        return;
      }
      case "view": {
        setCreateObj({ ...plainObj, saleReturnDate: new Date() });
        getListSalesreturn();
        setVal(arg);
        setDisableDate(true);
        setEditcoulmn(false);
        return;
      }
      case "add": {
        getoucherList();
        getInvoiceList();
        setEditcoulmn(true);
        setVal(arg);
        setDisableDate(true);
        return;
      }
      case "save": {
        if (createObj.invoiceNo === "" || createObj.customerName === "") {
          setErrorObj({ ...errorObj, invoiceNo: true });
          setVal("add");
        } else {
          saveData(createObj);
          setVal(arg);
        }
        setDisableDate(true);
        return;
      }

      default:
        return arg;
    }
  };

  const refreshstate = () => {
    setCreateObj({ ...plainObj, saleReturnDate: new Date() });
    refreshErrorObj();
    setSelectRow();
    refreshtable();
    setDisableDate(true);
    setDropDownOption(false);
    setCodeFocus("");
    setVoucherList([]);
    setNewQty();
  };
  //
  // handlechange for cutomer name
  //
  const handleCustomerName = (e) => {
    const { name, value } = e.target;
    setCreateObj({ ...createObj, customerName: value });
  };

  /**
   *
   * handelechange for date
   */
  const onchangeDate = (date) => {
    setCreateObj({ ...createObj, saleReturnDate: date });
  };
  /**
   *
   * get selected invoice detail
   */
  const getPrevQty = async (AgainstInvoiceId, ItemId) => {
    let list = await db.SaleReturnDetail.where("AgainstInvoiceId")
      .equals(AgainstInvoiceId)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const products = await db.saleInvoiceDetail
      .where("invoiceid")
      .equals(AgainstInvoiceId)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    let item = products.find((a) => a.itemid === ItemId);
    if (list.length > 0) {
      let qty = 0;
      list.map((a) => {
        if (a.ItemId === ItemId) {
          qty = qty + a.Quantity;
        }
        return a;
      });
      let newqty = item.quantity - qty;
      return newqty;
    } else {
      return item.quantity;
    }
  };
  const getInvoice = async (invoice) => {
    setDropDownOption("");
    if (invoice) {
      const customer = await getCustomerdetail(invoice.partyid);
      const saleperson =
        invoice.salepersonid && invoice.salepersonid > 0
          ? await db.salesPersonMaster
              .where("Id")
              .equals(invoice.salepersonid)
              .first()
              .then((res) => {
                return res.SalePersonName;
              })
              .catch((err) => console.log(err))
          : "";
      if (customer) {
        let sIDid =
          invoice.Id === 0 || invoice.Id === "" ? invoice.id : invoice.Id;
        const products = await db.saleInvoiceDetail
          .where("invoiceid")
          .equals(sIDid)
          .toArray()
          .then()
          .catch((err) => console.log(err));
        if (products) {
          const productWithItem = await Promise.all(
            products.map(async (a, i) => {
              const items = await getItemDetail(a.itemid);

              const lot = await db.getItemStock
                .where("itemid")
                .equals(a.itemid)
                .first()
                .then()
                .catch((err) => console.log(err));
              let prevQty = await getPrevQty(sIDid, a.itemid);
              return {
                ...a,
                prevQty: prevQty,
                quantity: "",
                ItemCode: items.ItemCode,
                ItemName: items.ItemName,
                lotno: lot.lotno,
                grossAmount: "",
                totaltaxamount: "",
                igstamount: 0,
                salepersonid: saleperson,
                igstrate:
                  invoice.billingstateid !== invoice.shippingstateid
                    ? a.igstrate
                    : 0,
                cgstrate:
                  invoice.billingstateid === invoice.shippingstateid
                    ? a.cgstrate
                    : 0,
                sgstrate:
                  invoice.billingstateid === invoice.shippingstateid
                    ? a.sgstrate
                    : 0,
                sgstamount: 0,
                cgstamount: 0,
                autodiscountper:
                  a.autodiscountper === "" ? 0 : a.autodiscountper,
                manualdiscountamount: 0,
                amount: "",
              };
            })
          );
          setCreateObj({
            ...createObj,
            products: productWithItem,
            customerName: customer.PartyName,
            salepersonId: invoice.salepersonid,
            PartyId: customer.Id,
            AgainstInvoiceNo: invoice.invoiceno,
            discount: invoice.discountpermanual,
            AgainstInvoiceId: sIDid,
            InvoiceType: parseInt(invoice.invoicetype),
          });
        }
      }
    }
  };
  /**
   *
   * get all invoice List
   */
  const getInvoiceList = async () => {
    const invoiceList = await db.salesInvoice
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (invoiceList) {
      let fltrList = invoiceList.filter(
        (a) => a.ishold !== "true" && a.iscancelled !== "true"
      );
      setInvoiceLists(fltrList);
    }
  };
  /**
   *
   * select item
   */

  /**
   *
   * selected row edit true
   */
  const editItem = () => {
    setEditRow(true);
    setEdit(true);
  };
  const selectedRow = (item) => {
    setSelectRow(item);
    setEdit(false);
  };
  /**
   *
   * handlechange for onchage on quantity
   */
  const changeQty = (e, id) => {
    if (selectRow.prevQty < e.target.value) {
      alert("you can't increase Quantity from " + selectRow.prevQty);
      setNewQty(selectRow.prevQty);
      return selectRow.prevQty;
    } else {
      setNewQty(e.target.value);
      return e.target.value;
    }
  };
  /**
   *
   * fixedToLength
   */
  const fixedToLength = (data) => {
    return data ? parseFloat(data).toFixed(2) : data;
  };
  /**
   *
   * convert to float value
   */
  const convertToFloat = (value) => {
    return value ? parseFloat(value) : value;
  };
  /**
   *
   * on change Quantitty of item recalculation and render data
   */
  const setQuantity = (Qty) => {
    if (Qty) {
      if (editRow) {
        const xArray = createObj.products.map((a) => {
          if (a.id === selectRow.id) {
            return {
              ...a,
              quantity: parseInt(Qty),
            };
          } else {
            return a;
          }
        });
        calulateItem(xArray);
      }
    }

    setSelectRow("");
    setNewQty();
    setEdit(false);
    refreshtable();
  };
  const calulateItem = (xArray) => {
    let totalQty = 0;
    let totalGrsamt = 0;
    let totalTaxAmount = 0;
    let totalAmount = 0;
    let totalcgst = 0;
    let totalsgst = 0;
    let totaligst = 0;
    let totaldis = 0;
    const newArray = xArray.map((b) => {
      const mdiscount = getPercentCalc(
        b.saleprice,
        b.quantity,
        b.manualdiscountper
      );
      const autodiscount = getPercentCalc(
        b.saleprice,
        b.quantity,
        b.autodiscountper
      );
      const fndiscount =
        convertToFloat(mdiscount) + convertToFloat(autodiscount);
      let grosAmt = b.quantity * b.saleprice;
      let amt = grosAmt - fndiscount;
      let cgst = getPercent(amt, b.cgstrate);
      let sgst = getPercent(amt, b.sgstrate);
      let igst = getPercent(amt, b.igstrate);
      let tax = getPercent(amt, b.taxper);
      let AddiTax = getPercent(amt, b.addtaxrate);
      let totalTax = fixedToLength(
        convertToFloat(cgst) +
          convertToFloat(sgst) +
          convertToFloat(igst) +
          convertToFloat(tax) +
          convertToFloat(AddiTax)
      );
      let amount = convertToFloat(amt) + convertToFloat(totalTax);
      totalQty = totalQty + b.quantity;
      totalcgst = convertToFloat(totalcgst) + convertToFloat(cgst);
      totalsgst = convertToFloat(totalsgst) + convertToFloat(sgst);
      totaligst = convertToFloat(totaligst) + convertToFloat(igst);
      totalTaxAmount =
        convertToFloat(totalTaxAmount) + convertToFloat(totalTax);
      totalGrsamt = totalGrsamt + grosAmt;
      totalAmount = totalAmount + amount;
      totaldis = convertToFloat(totaldis) + convertToFloat(mdiscount);
      return {
        ...b,
        cgstamount: fixedToLength(convertToFloat(cgst)),
        sgstamount: fixedToLength(convertToFloat(sgst)),
        igstamount: fixedToLength(convertToFloat(igst)),
        manualdiscountamount: mdiscount,
        FinalDiscount: fndiscount,
        autodiscountamount: autodiscount,
        grossAmount: fixedToLength(grosAmt),
        totaltaxamount: fixedToLength(convertToFloat(totalTax)),
        amount: fixedToLength(amount),
      };
    });
    let discount = getPercent(totalAmount, createObj.discount);
    let fnlamt = convertToFloat(totalAmount) - convertToFloat(discount);
    let roundoff = fnCRoundOff(fixedToLength(fnlamt));
    setCreateObj({
      ...createObj,
      products: newArray,
      totalQty: parseInt(totalQty),
      grossAmount: fixedToLength(totalGrsamt),
      totalTax: fixedToLength(totalTaxAmount),
      totalAmount: fixedToLength(totalAmount),
      cgstTax: fixedToLength(totalcgst),
      sgstTex: fixedToLength(totalsgst),
      totalDiscountAmount: fixedToLength(totaldis),
      discountAmount: fixedToLength(discount),
      roundOff: roundoff,
      finalAmount: fixedToLength(fnlamt + roundoff),
    });
  };
  const refreshtable = () => {
    setRefreshtbl(true);
    setTimeout(() => setRefreshtbl(false), 500);
  };
  /**
   *
   * save function for save sales return
   */
  const saveItem = async (data, type) => {
    let soid = await db.salesReturn
      .where("Invoiceno")
      .equals(data.saleReturnNo)
      .first()
      .then()
      .catch((err) => console.log(err));
    if (soid) {
      let itemObj = data.products.map((item) => {
        const obj = {
          InvoiceId: soid.Id === "" || soid.Id === 0 ? soid.id : soid.Id,
          AutoDiscountAmount: item.autodiscountamount,
          ManualDiscountAmount: item.manualdiscountamount,
          GrossAmount: item.grossAmount,
          ItemId: item.itemid,
          Quantity: item.quantity,
          MRP: item.mrp,
          ManualDiscount: item.manualdiscountper,
          ItemRemark: item.itemremark,
          SalePrice: item.saleprice,
          AgainstInvoiceDetailid: "",
          Hsnid: item.HsnId,
          AgainstInvoiceId: data.AgainstInvoiceId,
          AltQuantity: 0,
          TotalNetAmount: item.amount,
          AutoDiscount: item.autodiscountper,
          IgstRate: item.igstrate,
          IgstAmount: item.igstamount,
          SgstRate: item.sgstrate,
          SgstAmount: item.sgstamount,
          CgstRate: item.cgstrate,
          CgstAmount: item.cgstamount,
          TaxPercentage: item.taxper,
          TaxPercentageAmt: item.taxamount,
          surchargerate: item.surchargerate,
          surchargeamount: item.surchargeamount,
          AdditionalTax: item.addtaxrate,
          AdditionalTaxAmt: item.addtaxamount,
          TotalTaxAmount: item.totaltaxamount,
        };
        if (type === "update") {
          let o = { ...obj, id: item.id };
          return o;
        } else {
          return obj;
        }
      });
      if (type === "update") {
        await db.SaleReturnDetail.bulkPut(itemObj).then(function (updated2) {
          if (updated2) {
            alert("update successfully");
            refreshstate();
          } else {
            alert("something went wrong");
          }
        });
      } else {
        await db.SaleReturnDetail.bulkAdd(itemObj).then(function (updated2) {
          if (updated2) {
            alert("data save successfully");
            refreshstate();
          } else {
            alert("something went wrong");
          }
        });
      }
    }
  };
  const saveData = async (data) => {
    let saveObj = {
      Id: data.Id,
      BranchId: "",
      Invoiceno: data.saleReturnNo,
      SeriesId:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      TaxAmount: data.totalTax,
      InvoiceDate: data.saleReturnDate,
      PartyId: data.PartyId,
      GrossAmount: data.grossAmount,
      BillTime: "",
      EditLog: "",
      salepersonId: data.salepersonId,
      SeriesVoucherType:
        seriesandVoucher.voucherId === "" ? "" : seriesandVoucher.voucherId,
      TotalBillQty: data.totalQty,
      DiscountAmount: data.totalDiscountAmount,
      IsAuthorized: "",
      InvoiceType: data.InvoiceType,
      ReceiveAmount: data.finalAmount,
      Remarks: data.remark,
      CopunterId: "",
      AgainstInvoiceId: data.AgainstInvoiceId,
      totalCgst: data.cgstTax,
      totalSgst: data.sgstTex,
      totalIgst: data.igstTex,
      DiscountPer: data.discount,
      DiscountPerAmount: data.discountAmount,
      AgainstInvoiceNo: data.AgainstInvoiceNo,
      CreatedBy: localStorage.getItem("UserId"),
      RounOff: data.roundOff,
      NetAmount: data.totalAmount,
      CreatedOn: new Date(),
      new: 1,
      update: 0,
    };
    if (data.id) {
      let updatedObj = { ...saveObj, Id: data.Id, id: data.id };
      await db.salesReturn.update(data.id, updatedObj).then(function (updated) {
        if (updated) {
          saveItem(data, "update");
        } else {
          console.log("failed");
        }
      });
    } else {
      await db.salesReturn.add(saveObj).then(function (updated) {
        if (updated) {
          saveItem(data, "new");
        } else {
          console.log("failed");
        }
      });
    }
  };
  /**
   * get salesreturn list
   */
  const getListSalesreturn = async () => {
    let userID = localStorage.getItem("UserId");
    const salesReturList1 = await db.salesReturn.toArray();
    const salesReturList = salesReturList1.filter(
      (f) => f.CreatedBy === userID
    );

    if (salesReturList) {
      setCreateObj({ ...createObj, salesReturnList: salesReturList });
    }
  };
  const getSalesretrun = async (obj) => {
    setDropDownOption("");
    if (obj) {
      const customer = await getCustomerdetail(obj.PartyId);
      const slrObj = {
        id: obj.id,
        Id: obj.Id,
        BranchId: "",
        aleReturnNo: obj.Invoiceno,
        totalTax: obj.TaxAmount,
        saleReturnDate: obj.InvoiceDate,
        customerName: customer.PartyName,
        PartyId: obj.PartyId,
        grossAmount: obj.GrossAmount,
        totalQty: obj.TotalBillQty,
        totalDiscountAmount: obj.DiscountAmount,
        finalAmount: obj.ReceiveAmount,
        remark: obj.Remarks,
        AgainstInvoiceId: obj.AgainstInvoiceId,
        totalAmount: obj.NetAmount,
        salepersonId: obj.salepersonId,
        cgstTax: obj.totalCgst,
        sgstTex: obj.totalSgst,
        igstTex: obj.totalIgst,
        discount: obj.DiscountPer,
        discountAmount: obj.DiscountPerAmount,
        AgainstInvoiceNo: obj.AgainstInvoiceNo,
        CreatedBy: localStorage.getItem("UserId"),
        roundOff: obj.RounOff,
      };
      setSeriesandVoucher({
        seriesId: obj.SeriesId,
        voucherId: obj.SeriesVoucherType,
      });
      let id = obj.Id === 0 || obj.Id === "" ? obj.id : obj.Id;
      const getitemList = await db.SaleReturnDetail.where("InvoiceId")
        .equals(id)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      if (getitemList) {
        const saleperson =
          obj.salepersonId && obj.salepersonId > 0
            ? await db.salesPersonMaster
                .where("Id")
                .equals(obj.salepersonId)
                .first()
                .then((res) => {
                  return res.SalePersonName;
                })
                .catch((err) => console.log(err))
            : "";
        const newItemlist = await Promise.all(
          getitemList.map(async (a) => {
            const items = await getItemDetail(a.ItemId);
            const lot = await db.getItemStock
              .where("itemid")
              .equals(a.ItemId)
              .first()
              .then()
              .catch((err) => console.log(err));
            let prevQty = await getPrevQty(a.AgainstInvoiceId, a.ItemId);
            let itemobj = {
              id: items.id,
              ItemCode: items.ItemCode,
              ItemName: items.ItemName,
              InvoiceId: a.InvoiceId,
              autodiscountamount: a.AutoDiscountAmount,
              manualdiscountamount: a.ManualDiscountAmount,
              FinalDiscount: a.FinalDiscount,
              grossAmount: fixedToLength(a.GrossAmount),
              salepersonid: saleperson,
              itemid: a.ItemId,
              prevQty: prevQty + a.Quantity,
              quantity: a.Quantity,
              mrp: a.MRP,
              lotno: lot.lotno,
              manualdiscountper: fixedToLength(a.ManualDiscount),
              autodiscountper: a.AutoDiscount,
              itemremark: a.ItemRemark,
              saleprice: fixedToLength(a.SalePrice),
              amount: a.TotalNetAmount,
              AgainstInvoiceDetailid: "",
              Hsnid: a.Hsnid,
              AgainstInvoiceId: a.AgainstInvoiceId,
              AltQuantity: 0,
              igstrate: a.IgstRate,
              igstamount: fixedToLength(a.IgstAmount),
              sgstrate: a.SgstRate,
              sgstamount: fixedToLength(a.SgstAmount),
              cgstrate: a.CgstRate,
              cgstamount: fixedToLength(a.CgstAmount),
              taxper: a.TaxPercentage,
              taxamount: fixedToLength(a.TaxPercentageAmt),
              addtaxrate: a.AdditionalTax,
              addtaxamount: fixedToLength(a.AdditionalTaxAmt),
              totaltaxamount: fixedToLength(a.TotalTaxAmount),
              surchargerate: a.surchargerate,
              surchargeamount: fixedToLength(a.surchargeamount),
            };
            return itemobj;
          })
        );
        setCreateObj({ ...createObj, ...slrObj, products: newItemlist });
      }
    }
  };
  const disableType = (e) => {
    e.preventDefault();
  };
  const refreshErrorObj = () => {
    setErrorObj(plainObj);
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
        setQuantity(newQty);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [createObj, codeFocus, selectRow, editRow, newQty, errorObj]);

  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="salesReturnBillWise"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="salesReturnBillWiseIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Sales Return No" />
                  </label>
                  {val === "view" || val === "edit" ? (
                    createObj.salesReturnList && (
                      <Autocomplete
                        open={dropDownOption === "saleReturnNo" ? true : false}
                        options={createObj.salesReturnList}
                        onChange={(e, value) => getSalesretrun(value)}
                        getOptionLabel={(option) => option.Invoiceno.toString()}
                        getOptionSelected={(option, value) =>
                          option.Invoiceno === value.Invoiceno
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Press ctrl + L"
                            onFocus={() => setCodeFocus("saleReturnNo")}
                            onBlur={() => {
                              setCodeFocus("");
                              setDropDownOption("");
                            }}
                          />
                        )}
                      />
                    )
                  ) : (
                    <input
                      type="text"
                      name="saleReturnNo"
                      onChange={(e) => handleChange(e)}
                      data-valid="number"
                      readOnly={true}
                      className={
                        errorObj && errorObj.saleReturnNo === true
                          ? "error"
                          : ""
                      }
                      value={createObj && createObj.saleReturnNo}
                    />
                  )}
                  {/* <input
                    type="text"
                    name="saleReturnNo"
                    onChange={(e) => handleChange(e)}
                    data-valid="number"
                    className={
                      errorObj && errorObj.saleReturnNo === true ? "error" : ""
                    }
                    value={createObj && createObj.saleReturnNo}
                  /> */}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Sale Return Date" />
                  </label>
                  <DatePicker
                    selected={createObj && createObj.saleReturnDate}
                    onChange={(date) => onchangeDate(date)}
                    dropdownMode="select"
                    onChangeRaw={(e) => disableType(e)}
                    disabled={disableDate}
                  />
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    errorObj.AgainstInvoiceNo === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Select Invoice Number" />
                    <span className="required">*</span>
                  </label>
                  {val === "add" ? (
                    invoiceLists && (
                      <Autocomplete
                        open={dropDownOption === "invoiceNo" ? true : false}
                        options={invoiceLists}
                        onChange={(e, value) => getInvoice(value)}
                        getOptionLabel={(option) => option.invoiceno}
                        getOptionSelected={(option, value) =>
                          option.invoiceno === value.invoiceno
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Press ctrl + L"
                            onFocus={() => setCodeFocus("invoiceNo")}
                            onBlur={() => {
                              setCodeFocus("");
                              setDropDownOption("");
                            }}
                          />
                        )}
                      />
                    )
                  ) : (
                    <input
                      name="AgainstInvoiceNo"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      value={createObj && createObj.AgainstInvoiceNo}
                      readOnly={val === "add" ? false : true}
                    />
                  )}
                  {errorObj.AgainstInvoiceNo && (
                    <span className="error">Please select invoice No</span>
                  )}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Customer Name" />
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    //  onChange={(e) => handleCustomerName(e)}
                    className={
                      errorObj && errorObj.customerName === true ? "error" : ""
                    }
                    value={createObj && createObj.customerName}
                    readOnly={true}
                    // onChange={(e) => handleChange(e)}
                    // data-valid="character"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="tableBox">
                <CustomTable
                  coulmn={column}
                  data={
                    createObj.products && createObj.products.length > 0
                      ? createObj.products
                      : []
                  }
                  overFlowScroll={true}
                  editStatus={edit}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  refreshTable={refreshtbl}
                  tblInputOnchange={(e) => changeQty(e)}
                  editbtnText="Edit Item"
                  selectedTr={(item) => selectedRow(item)}
                />
              </div>
            </div>
          </div>
          <div className="box greyBg mb-0 borderBottom-0">
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Total Qty" />
                  </label>
                  <input
                    type="text"
                    name="totalQty"
                    value={createObj && createObj.totalQty}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="CGST Tax" />
                  </label>
                  <input
                    type="text"
                    name="cgstTax"
                    value={createObj && createObj.cgstTax}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Total Amount" />
                  </label>
                  <input
                    type="text"
                    name="totalAmount"
                    value={createObj && createObj.totalAmount}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Gross Amount" />
                  </label>
                  <input
                    type="text"
                    name="grossAmount"
                    value={createObj && createObj.grossAmount}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="SGST Tax" />
                  </label>
                  <input
                    type="text"
                    name="sgstTex"
                    value={createObj && createObj.sgstTex}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Discount" /> %
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={createObj && createObj.discount}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="box blueBg borderTop-0">
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Total Discount" />
                  </label>
                  <input
                    type="text"
                    name="totalDiscountAmount"
                    value={createObj && createObj.totalDiscountAmount}
                    className="bgWhite"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Total Tax" />
                  </label>
                  <input
                    type="text"
                    name="totalTax"
                    value={createObj && createObj.totalTax}
                    className="bgWhite"
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Discount Amount" />
                  </label>
                  <input
                    type="text"
                    name="discountAmount"
                    value={createObj && createObj.discountAmount}
                    className="bgWhite"
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox">&nbsp;</div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Round Off" />
                  </label>
                  <input
                    type="text"
                    name="roundOff"
                    className="bgWhite"
                    value={createObj && createObj.roundOff}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Final Amount" />
                  </label>
                  <input
                    type="text"
                    name="finalAmount"
                    className="bgWhite"
                    value={createObj && createObj.finalAmount}
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
                  placeholder="Write remarks here"
                  name="remark"
                  value={createObj && createObj.remark}
                  onChange={(e) => handleChange(e)}
                  readOnly={val === "view" ? true : false}
                ></textarea>
              </div>
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
    </>
  );
};
export default SalesReturnBillWise;
