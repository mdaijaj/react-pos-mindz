import axios from "axios";
import db from "../datasync/dbs";
const getTransactionData = async () => {
  const tbldata = await db.globelsetting
    .where("globsettingid")
    .equals(541)
    .first()
    .then()
    .catch((err) => console.log(err));
  if (tbldata) {
    let oneWeekAgo = new Date(
      Date.now() - tbldata.value * 24 * 60 * 60 * 1000
      // Date.now() - 0 * 24 * 60 * 60 * 1000
    );
    //alert(formatDate(oneWeekAgo),"ddddddd")
    const datadateObj = {
      alteredon: formatDate(oneWeekAgo),
      pageindexno: 0,
    };
    billposData(datadateObj);
  }
};
const billposData = (obj) => {
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "/api/SalesInvoice/List";
  axios
    .post(api, obj, config)
    .then((res) => {
      console.log(res, "respossssssssssssssss");
      const objarray = [];
      const Dobjarray = [];
      if (res.data && res.data.Result) {
        res.data.Result.map((item) => {
          const itemObj = {
            Id: item.Id,
            invoiceno: item.InvoiceNo,
            invoicedate: new Date(itemDate(item.InvoiceDate)),
            partyid: item.PartyId,
            grossamount: item.GrossAmount,
            netamount: item.NetAmount,
            discountamount: item.DiscountAmount,
            taxamount: item.TaxAmount,
            receiveamount: item.ReceiveAmount,
            createdby: item.CreatedBy.toString(),
            CreatedByName: "",
            seriesid: item.SeriesId,
            voucherid: item.SeriesVoucherType,
            createdon: item.CreatedOn,
            EditLog: null,
            salepersonid: item.SalesPersonId,
            roundoff: item.roundoff,
            billingcountryid: item.billingcountryid,
            billingstateid: item.billingstateid,
            billingaddress: item.billingaddress,
            billinggstinno: item.billinggstinno,
            shippingcountryid: item.shippingcountryid,
            shippingstateid: item.shippingstateid,
            shippingaddress: item.shippingaddress,
            shippinggstinno: item.shippinggstinno,
            discountpermanual: item.discountpermanual,
            discountamountmanual: item.discountamountmanual,
            remarks: item.Remarks,
            billtime: item.BillTime, // "2019-10-04T17:35:41",
            totalbillqty: item.TotalBillQty,
            totaligst: item.TotalIgst, // "0.00000",
            totalcgst: item.TotalCgst, //"54.96000",
            totalsgst: item.TotalSgst, // "54.96000",
            iscancelled: item.iscancelled,
            ishold: item.ishold.toString(),
            isauthorized: item.isauthorized,
            cancelledby: item.cancelledby,
            cancelledon: item.cancelledon,
            update: 0,
            new: 0,
          };
          objarray.push(itemObj);
          item.SalesInvoiceDetail.map((dItem) => {
            const detailobj = {
              InvoiceDetailId: dItem.InvoiceDetailId,
              invoiceid: dItem.InvoiceId,
              itemid: dItem.ItemId,
              ItemName: dItem.ItemName,
              ItemCode: dItem.ItemCode,
              quantity: dItem.Quantity,
              mrp: dItem.MRP,
              saleprice: dItem.SalePrice,
              grossamount: dItem.GrossAmount,
              finaldiscount: dItem.FinalDiscount,
              totaltaxamount: dItem.TotalTaxAmount,
              totalnetamount: dItem.TotalNetAmount,
              IsTaxInclusive: dItem.IsTaxInclusive,
              AltQuantity: null,
              AutoDiscount: 0,
              autodiscountamount: dItem.AutoDiscountAmount,
              manualdiscountper: dItem.ManualDiscount,
              manualdiscountamount: dItem.ManualDiscountAmount,
              itemremark: dItem.ItemRemark,
              IsAutoDiscountOn: false,
              IsAutoDiscountOnAmount: false,
              Conversion: 1,
              denominator: dItem.Denominator,
              HsnId: dItem.HsnId,
              igstrate: dItem.IGSTRate,
              cgstrate: dItem.CGSTRate,
              sgstrate: dItem.SGSTRate,
              igstamount: dItem.IGSTAmount,
              cgstamount: dItem.CGSTAmount,
              sgstamount: dItem.SGSTAmount,
            };
            Dobjarray.push(detailobj);
          });
          return item;
        });
      }
      db.salesInvoice
        .bulkAdd(objarray)
        .then()
        .catch((err) => console.log(err));
      db.saleInvoiceDetail
        .bulkAdd(Dobjarray)
        .then()
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
function itemDate(date) {
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
  let dateArr = date.split("-");
  let day = dateArr[0];
  let month = dateArr[1];
  let year = dateArr[2];
  let setMonth = "";
  for (let i = 0; i < monthNames.length; i++) {
    if (month === monthNames[i]) {
      let v = i + 1;
      setMonth = v < 10 ? "0" + v : v;
    }
  }
  return year + "-" + setMonth + "-" + day;
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    min = d.getMinutes(),
    sec = d.getSeconds();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return (
    [year, d.getMonth(), day].join("-") + " " + hour + ":" + min + ":" + sec
  );
}
export default getTransactionData;
