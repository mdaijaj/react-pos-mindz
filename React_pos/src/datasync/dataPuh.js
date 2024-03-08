import axios from "axios";
import db from "./dbs";

const customerMasterPushPut = async () => {
  let Customer = await db.customerMaster
    .where("update")
    .equals(1)
    .first()
    .then()
    .catch((err) => console.log(err));
  if (Customer) {
    const config = { headers: { token: localStorage.getItem("token") } };
    let data = {
      Id: Customer.Id,
      LedgerCode: Customer.PartyCode,
      LedgerName: Customer.PartyName,
      Address: Customer.Address,
      BillAddress: Customer.BillAddress,
      Phone1: Customer.Phone1,
      Phone2: Customer.Phone2,
      CompanyCode: Customer.CompanyCode,
      ContactPerson: null,
      Email: Customer.Email,
      Cityid: Customer.CityId,
      Fax: Customer.Fax,
      IsClosed: Customer.IsClosed,
      DmsLedgerCode: Customer.DmsLedgerCode,
      DealerCategory: Customer.DealerCategory,
      Pincode: Customer.Pincode,
      SalesPersonId: null,
      LedgerGroup: 0,
      LocationCode: null,
      CreatedBy: Customer.CreatedBy,
      Panno: Customer.PAN,
      Gstno: Customer.GSTNo,
      Website: Customer.Website,
      CreatedByName: "",
      EditLog: null,
      CreatedOn: "",
      LedgerType: Customer.LedgerType,
    };

    let api = "/api/LedgerMaster";
    await axios.put(api, data, config).then(async (res) => {
      if (res.data.statuscode === 202) {
        await db.customerMaster.update(Customer.id, { update: 0 });
      } else {
        console.log("customerMaster update statusCode", res.data.statuscode);
        console.log("customerMaster update message", res.data.message);
      }
    });
  }
};

const customerMasterPushPost = async () => {
  let getCustomer = await db.customerMaster
    .where("new")
    .equals(1)
    .first()
    .then()
    .catch((err) => console.log(err));
  if (getCustomer) {
    let data = {
      Id: 0,
      LedgerCode: getCustomer.PartyCode,
      LedgerName: getCustomer.PartyName,
      Address: getCustomer.Address,
      BillAddress: getCustomer.BillAddress,
      Phone1: getCustomer.Phone1,
      Phone2: getCustomer.Phone2,
      CompanyCode: getCustomer.CompanyCode,
      ContactPerson: null,
      Email: getCustomer.Email,
      Cityid: getCustomer.CityId,
      Fax: getCustomer.Fax,
      IsClosed: getCustomer.IsClosed,
      DmsLedgerCode: getCustomer.DmsLedgerCode,
      DealerCategory: getCustomer.DealerCategory,
      Pincode: getCustomer.Pincode,
      SalesPersonId: null,
      LedgerGroup: 0,
      LocationCode: null,
      CreatedBy: getCustomer.CreatedBy,
      CreatedByName: "",
      Panno: getCustomer.PAN,
      Gstno: getCustomer.GSTNo,
      Website: getCustomer.Website,
      EditLog: null,
      CreatedOn: "",
      LedgerType: getCustomer.LedgerType,
    };
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/LedgerMaster";
    await axios
      .post(api, data, config)
      .then(async (res) => {
        if (res.data.statuscode === 201) {
          await db.customerMaster.update(getCustomer.id, {
            new: 0,
            Id: res.data.MasterId,
          });
        } else {
          console.log("customerMaster new statusCode", res.data.statuscode);
          console.log("customerMaster new message", res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }
};

const billPosPush = async (type) => {
  // const typeObj =
  //   type === "new"
  //     ? { new: 1, ishold: "false" }
  //     : { update: 1, ishold: "false" };
  const typeObj =
    type === "new"
      ? '[new+ishold]'
      : '[update+ishold]';
  //const data = await db.salesInvoice.get(typeObj)
  // const data = await db.salesInvoice.get(typeObj).then(async (res) => {
    const data = await db.salesInvoice.where(typeObj).equals(1,"false").first().then(async (res) => {
    if (res) {
      res.Details = await db.saleInvoiceDetail
        .where({ invoiceid: res.Id === 0 || res.Id === "" ? res.id : res.Id })
        .reverse()
        .toArray()
        .then(async function (resp) {
          return resp.map((i) => {
            return {
              InvoiceDetailId: type === "edit" ? i.InvoiceDetailId : 0,
              rowid: i.id,
              InvoiceId: type === "edit" ? i.invoiceid : 0,
              ItemId: i.itemid,
              ItemName: i.ItemName,
              ItemCode: i.ItemCode,
              Quantity: i.quantity,
              MRP: i.mrp,
              SalePrice: i.saleprice,
              GrossAmount: i.grossamount,
              FinalDiscount: i.finaldiscount,
              TotalTaxAmount: i.totaltaxamount,
              TotalNetAmount: i.totalnetamount,
              IsTaxInclusive: true,
              AltQuantity: null,
              AutoDiscount: 0,
              AutoDiscountAmount: i.autodiscountamount,
              ManualDiscount: i.manualdiscountper,
              ManualDiscountAmount: i.manualdiscountamount,
              ItemRemark: i.itemremark,
              IsAutoDiscountOn: false,
              IsAutoDiscountOnAmount: false,
              Conversion: 1,
              Denominator: i.denominator,
              HsnId: i.HsnId,
              IGSTRate: i.igstrate,
              CGSTRate: i.cgstrate,
              SGSTRate: i.sgstrate,
              IGSTAmount: i.igstamount,
              CGSTAmount: i.cgstamount,
              SGSTAmount: i.sgstamount,
            };
          });
        });
      return res;
    } else {
      return {};
    }
  });
  if (data.invoiceno) {
    let item1 = {
      Id: type === "edit" ? data.Id : 0,
      InvoiceNo: data.invoiceno,
      InvoiceDate: formatDate(data.invoicedate),
      PartyId: data.partyid,
      GrossAmount: data.grossamount,
      NetAmount: data.netamount,
      DiscountAmount: data.discountamount,
      TaxAmount: data.taxamount,
      ReceiveAmount: data.receiveamount,
      CreatedBy: data.createdby,
      CreatedByName: "",
      SeriesId: data.seriesid,
      SeriesVoucherType: data.voucherid,
      CreatedOn: formatDate(data.createdon),
      EditLog: null,
      SalesPersonId: data.salepersonid,
      roundoff: data.roundoff,
      billingcountryid: data.billingcountryid,
      billingstateid: data.billingstateid,
      billingaddress: data.billingaddress,
      billinggstinno: data.billinggstinno,
      shippingcountryid: data.shippingcountryid,
      shippingstateid: data.shippingstateid,
      shippingaddress: data.shippingaddress,
      shippinggstinno: data.shippinggstinno,
      discountpermanual: data.discountpermanual,
      discountamountmanual: data.discountamountmanual,
      Remarks: data.remarks,
      BillTime: data.billtime, // "2019-10-04T17:35:41",
      TotalBillQty: data.totalbillqty,
      TotalIgst: data.totaligst, // "0.00000",
      TotalCgst: data.totalcgst, //"54.96000",
      TotalSgst: data.totalsgst, // "54.96000",
      iscancelled: data.iscancelled,
      ishold: data.ishold,
      isauthorized: data.isauthorized,
      cancelledby: data.cancelledby,
      cancelledon: data.cancelledon,
      SalesInvoiceDetail: data.Details,
      influencerid: data.influencerid,
      billingtype: data.billingtype,
    };
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SalesInvoice";
    if (item1 && item1.InvoiceNo) {
      if (type === "edit") {
        await axios
          .put(api, item1, config)
          .then(async (res) => {
            if (res.data.statuscode === 202) {
              await db.salesInvoice.update(data.id, {
                update: 0,
              });
            } else {
              console.log("bill pos update statusCode", res.data.statuscode);
              console.log("bill pos update message", res.data.message);
            }
          })
          .catch((err) => console.log(err));
      } else {
        console.log(item1, "item11111111111");
        await axios.post(api, item1, config).then(async (res) => {
          if (res.data.statuscode === 201) {
            await db.salesInvoice.update(data.id, {
              new: 0,
              Id: res.data.MasterId,
            });
            if (res.data.MasterId > 0) {
              const datalist = await db.saleInvoiceDetail
                .where("invoiceid")
                .equals(data.id)
                .toArray()
                .then()
                .catch((err) => console.log(err));
              if (datalist.length > 0) {
                const list = datalist.map((a) => {
                  let x = res.data.Result.SalesInvoiceDetail.find(
                    (did) => did.rowid === a.id
                  );
                  if (x) {
                    return {
                      ...a,
                      invoiceid: res.data.MasterId,
                      InvoiceDetailId: x.InvoiceDetailId,
                    };
                  } else {
                    return {
                      ...a,
                      invoiceid: res.data.MasterId,
                      InvoiceDetailId: "",
                    };
                  }
                });
                await db.saleInvoiceDetail.bulkPut(list);
              }
            }
          } else {
            console.log("bill pos statusCode", res.data.statuscode);
            console.log("bill pos message", res.data.message);
          }
        });
      }
    }
  }
};
const billPoswithsalesorderPush = async (type) => {
  // const typeObj =
  //   type === "new"
  //     ? { new: 1, ishold: "false" }
  //     : { update: 1, ishold: "false" };
  const typeObj =
    type === "new"
      ? '[new+ishold]'
      : '[update+ishold]';
  const data = await db.salesInvoiceWithSO.where(typeObj).equals(1,"false").first().then(async (res) => {
    if (res) {
      res.Details = await db.saleInvoiceDetailWithSO
        .where({ invoiceid: res.Id === 0 || res.Id === "" ? res.id : res.Id })
        .reverse()
        .toArray()
        .then(async function (resp) {
          return resp.map((i) => {
            return {
              InvoiceDetailId: type === "edit" ? i.InvoiceDetailId : 0,
              rowid: i.id,
              InvoiceId: type === "edit" ? i.invoiceid : 0,
              ItemId: i.itemid,
              ItemName: i.ItemName,
              ItemCode: i.ItemCode,
              Quantity: i.quantity,
              MRP: i.mrp,
              SalePrice: i.saleprice,
              GrossAmount: i.grossamount,
              FinalDiscount: i.finaldiscount,
              TotalTaxAmount: i.totaltaxamount,
              TotalNetAmount: i.totalnetamount,
              IsTaxInclusive: true,
              AltQuantity: null,
              AutoDiscount: 0,
              AutoDiscountAmount: i.autodiscountamount,
              ManualDiscount: i.manualdiscountper,
              ManualDiscountAmount: i.manualdiscountamount,
              ItemRemark: i.itemremark,
              IsAutoDiscountOn: false,
              IsAutoDiscountOnAmount: false,
              Conversion: 1,
              Denominator: i.denominator,
              HsnId: i.HsnId,
              IGSTRate: i.igstrate,
              CGSTRate: i.cgstrate,
              SGSTRate: i.sgstrate,
              IGSTAmount: i.igstamount,
              CGSTAmount: i.cgstamount,
              SGSTAmount: i.sgstamount,
              SoDetailId: i.SoDetailId,
              SoId: i.SoId,
            };
          });
        });
      return res;
    } else {
      return {};
    }
  });
  if (data.invoiceno) {
    let item1 = {
      Id: type === "edit" ? data.Id : 0,
      InvoiceNo: data.invoiceno,
      InvoiceDate: formatDate(data.invoicedate),
      PartyId: data.partyid,
      GrossAmount: data.grossamount,
      NetAmount: data.netamount,
      DiscountAmount: data.discountamount,
      TaxAmount: data.taxamount,
      ReceiveAmount: data.receiveamount,
      CreatedBy: data.createdby,
      CreatedByName: "",
      SeriesId: data.seriesid,
      SeriesVoucherType: data.voucherid,
      CreatedOn: formatDate(data.createdon),
      EditLog: null,
      SalesPersonId: data.salepersonid,
      roundoff: data.roundoff,
      billingcountryid: data.billingcountryid,
      billingstateid: data.billingstateid,
      billingaddress: data.billingaddress,
      billinggstinno: data.billinggstinno,
      shippingcountryid: data.shippingcountryid,
      shippingstateid: data.shippingstateid,
      shippingaddress: data.shippingaddress,
      shippinggstinno: data.shippinggstinno,
      discountpermanual: data.discountpermanual,
      discountamountmanual: data.discountamountmanual,
      Remarks: data.remarks,
      BillTime: data.billtime, // "2019-10-04T17:35:41",
      TotalBillQty: data.totalbillqty,
      TotalIgst: data.totaligst, // "0.00000",
      TotalCgst: data.totalcgst, //"54.96000",
      TotalSgst: data.totalsgst, // "54.96000",
      iscancelled: data.iscancelled,
      ishold: data.ishold,
      isauthorized: data.isauthorized,
      cancelledby: data.cancelledby,
      cancelledon: data.cancelledon,
      SalesInvoiceDetail: data.Details,
      influencerid: data.influencerid,
      billingtype: data.billingtype,
    };
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SalesInvoice";
    if (item1 && item1.InvoiceNo) {
      if (type === "edit") {
        await axios
          .put(api, item1, config)
          .then(async (res) => {
            if (res.data.statuscode === 202) {
              await db.salesInvoiceWithSO.update(data.id, {
                update: 0,
              });
            } else {
              console.log(
                "bill pos with sale order update statusCode",
                res.data.statuscode
              );
              console.log(
                "bill pos with sale order update message",
                res.data.message
              );
            }
          })
          .catch((err) => console.log(err));
      } else {
        await axios.post(api, item1, config).then(async (res) => {
          if (res.data.statuscode === 201) {
            await db.salesInvoiceWithSO.update(data.id, {
              new: 0,
              Id: res.data.MasterId,
            });
            if (res.data.MasterId > 0) {
              const datalist = await db.saleInvoiceDetailWithSO
                .where("invoiceid")
                .equals(data.id)
                .toArray()
                .then()
                .catch((err) => console.log(err));
              if (datalist.length > 0) {
                const list = datalist.map((a) => {
                  let x = res.data.Result.SalesInvoiceDetail.find(
                    (did) => did.rowid === a.id
                  );
                  if (x) {
                    return {
                      ...a,
                      invoiceid: res.data.MasterId,
                      InvoiceDetailId: x.InvoiceDetailId,
                    };
                  } else {
                    return {
                      ...a,
                      invoiceid: res.data.MasterId,
                      InvoiceDetailId: "",
                    };
                  }
                });
                await db.saleInvoiceDetailWithSO.bulkPut(list);
              }
            }
          } else {
            console.log(
              "bill pos with sale order statusCode",
              res.data.statuscode
            );
            console.log("bill pos with sale order message", res.data.message);
          }
        });
      }
    }
  }
};

const inwardPush = async (type) => {
  const res =
    type === "new"
      ? await db.IC_Master.where("new").equals(1).first()
      : type === "edit"
      ? await db.IC_Master.where("update").equals(1).first()
      : false;
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "/api/InwardChallan";
  if (res) {
    const rid = res.Id === 0 || res.Id === "" ? res.id : res.Id;
    const itemres = await db.IC_Detail.where("InwardId").equals(rid).toArray();
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          inwarddetailid: type === "edit" ? item.InwardDetailId : 0,
          InwardId: type === "edit" ? item.InwardId : 0,
          ItemId: item.ItemId,
          rowid: item.id,
          ItemName: "",
          ItemCode: "",
          BaseQty: item.ReceiveBaseQty,
          AltQty: item.ReceiveAltQty,
          MRP: item.MRP,
          Rate: item.Rate,
          GrossAmount: item.GrossAmount,
          NetAmount: item.NetAmount,
          DiscountPer: item.DiscountPercentage,
          DiscountAmount: item.DiscountAmount,
          DiscountedAmount: item.DiscountedAmount,
          PoDetailId: item.GitDetailId,
          // ReceiveAltQty: item.ReceiveAltQty,
          // ReceiveBaseQty: item.ReceiveBaseQty,
          UnitId: item.UnitId,
          ShortQty: item.shortQty,
          ExcessQty: item.excessqty,
        };
        return itemobj;
      });
      if (itemObjs) {
        const obj = {
          Id: type === "edit" ? res.Id : 0,
          InwardNo: res.InwardNo,
          InwardDate: formatDate(res.InwardDate),
          PartyId: res.PartyId,
          PartyName: "",
          GrossAmount: res.GrossAmount,
          NetAmount: res.NetAmount,
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          CreatedOn: formatDate(res.InwardDate),
          EditLog: null,
          Remarks: res.Remarks,
          BillBaseQty: res.billBaseQty,
          BillAltQty: res.billAltQty,
          RecBaseQty: res.recBaseQty,
          RecAltQty: res.recAltQty,
          ReferenceNo: null,
          ReferenceDate: "",
          SeriesId: res.seriesid,
          SeriesVoucherType: res.voucherid,
          IsGIT: true,
          PoId: res.GIT,
          InwardDetail: itemObjs,
        };
        if (type === "new") {
          await axios
            .post(api, obj, config)
            .then(async (a) => {
              if (a.data.statuscode === 201) {
                await db.IC_Master.update(res.id, {
                  new: 0,
                  update: 0,
                  Id: a.data.MasterId,
                });
                const updateIds = itemres.map((c) => {
                  let x = a.data.Result.InwardDetail.find(
                    (did) => did.rowid === c.id
                  );
                  if (x) {
                    return {
                      ...c,
                      InwardId: a.data.MasterId,
                      InwardDetailId: x.inwarddetailid,
                    };
                  } else {
                    return {
                      ...c,
                      InwardId: a.data.MasterId,
                      InwardDetailId: "",
                    };
                  }
                });
                await db.IC_Detail.bulkPut(updateIds)
                  .then()
                  .catch((arr) => console.log(arr));
              } else {
                console.log("inward push statusCode", a.data.statuscode);
                console.log("inward push message", a.data.message);
              }
            })
            .catch((err) => console.log(err));
        } else if (type === "edit") {
          await axios
            .put(api, obj, config)
            .then(async (a) => {
              if (a.data.statuscode === 202) {
                await db.IC_Master.update(res.id, {
                  update: 0,
                });
              } else {
                console.log("inward update statusCode", a.data.statuscode);
                console.log("inward update message", a.data.message);
              }
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }
};

// const purchaseInwardGit=async()=>{
//   const res = await db.PurchaseInvoice.where("new").equals(1).first();
//   const config = { headers: { token: localStorage.getItem("token") } };
//   if(res){
//     const items = await db.PurchaseInvoiceDetail.where("SoId").equals(res.id).toArray()
//     console.log(items,"itemsitemsitemsitemsitems")
//   }

// }

function formatDate(date) {
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
}

//Indent
const indentPush = async () => {
  const res = await db.IndentMaster.where("new").equals(1).first();
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/Indent";
  if (res) {
    const itemres = await db.IndentDetail.where("IndentNo")
      .equals(res.IndentNo)
      .toArray();
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          IndentDetailId: 0,
          IndentId: 0,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: "",
          Quantity: item.Quantity,
          ItemRemarks: item.ItemRemarks,
          Priority: item.Priority,
        };
        return itemobj;
      });
      if (itemObjs) {
        const obj = {
          Id: 0,
          IndentNo: res.IndentNo,
          IndentDate: formatDate(res.IndentDate), //get date
          PartyId: res.PartyId,
          PartyName: res.PartyName,
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          CreatedOn: formatDate(res.CreatedOn), //date
          EditLog: "",
          Remarks: res.Remarks,
          SeriesId: res.SeriesId,
          SeriesVoucherType: res.SeriesVoucherType,
          BranchId: 0,
          IndentDetail: itemObjs,
        };
        await axios
          .post(api, obj, config)
          .then(async (a) => {
            if (a.data.MasterId) {
              await db.IndentMaster.update(res.id, {
                new: 0,
                update: 0,
                Id: a.data.MasterId,
              });
              if (a.data.MasterId > 0) {
                const datalist = await db.IndentDetail.where("IndentId")
                  .equals(res.id)
                  .toArray()
                  .then()
                  .catch((err) => console.log(err));
                if (datalist.length > 0) {
                  const list = datalist.map((b) => {
                    return { ...b, IndentId: a.data.MasterId };
                  });
                  await db.IndentDetail.bulkPut(list);
                }
              }
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }
};

//PurchaseInvoice
const purchaseInvoicePush = async (type) => {
  // console.log(type,'typeeeeeeee purchaseInvoicePush')
  const res =
    type === "new"
      ? await db.PurchaseInvoice.where("new").equals(1).first()
      : type === "edit"
      ? await db.PurchaseInvoice.where("update").equals(1).first()
      : false;
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/PurchaseInvoice";
  // console.log(config,'configconfigconfig');
  // console.log(res,'resresresresres')
  if (res) {
    // console.log(res,"res purchaseInvoicePush")
  let Iid = res.Id > 0 ? res.Id:res.id
    // console.log(Iid,"Iid")

    const itemres = await db.PurchaseInvoiceDetail.where("InvoiceId")
      .equals(Iid)
      .toArray();
      // console.log("itemres",itemres)
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          InvoiceDetailId: type === "new" ? 0 : item.InvoiceDetailId,
          rowid: item.id,
          InvoiceId: item.InvoiceId,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: "",
          isaltrate: item.isaltrate,
          Quantity: item.Quantity,
          altqty: item.altqty,
          pinwardQuantity: item.pinwardQuantity,
          pinwardaltqty: item.pinwardaltqty,
          Rate: item.Rate,
          Amount: item.Amount,
          DiscountPer: item.DiscountPer,
          DiscountAmount: item.DiscountAmount,
          ReferenceNo: item.ReferenceNo,
          ReferenceDate: "",
          hsnclassificationid: item.hsnclassificationid,
          igstrate: item.igstrate,
          cgstrate: item.cgstrate,
          sgstrate: item.sgstrate,
          igstamount: item.igstamount,
          cgstamount: item.cgstamount,
          sgstamount: item.sgstamount,
          icdetailid: item.icdetailid,
          referencedetailid: item.referencedetailid,
        };
        return itemobj;
      });


      if (itemObjs) {
        // console.log(itemObjs,'itemObjsitemObjsitemObjsitemObjs')
        const obj = {
          Id: 0,
          InvoiceNo: res.InvoiceNo,
          InvoiceDate: formatDate(res.InvoiceDate), //get date
          PartyId: res.PartyId,
          PartyName: "",
          invoicetype: res.invoicetype,
          grossamount: res.grossamount,
          discountamount: res.discountamount,
          taxamount: res.taxamount,
          netamount: res.netamount,
          seriesid: res.seriesid,
          totalAmount: res.totalAmount,
          cgstAmount: res.cgstAmount,
          sgstAmount: res.sgstAmount,
          igstAmount: res.igstAmount,
          Rounoff: res.RoundOff,
          seriesvouchertype: res.seriesvouchertype,
          billingcountryid: res.billingcountryid,
          billingstateid: res.billingstateid,
          billingaddress: res.billingaddress,
          billinggstinno: res.billinggstinno,
          shippingcountryid: res.shippingcountryid,
          shippingstateid: res.shippingstateid,
          shippingaddress: res.shippingaddress,
          shippinggstinno: res.shippinggstinno,
          dncn_against_pi: res.dncn_against_pi,
          referencetype: res.referencetype,
          referenceid: res.referenceid,
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          CreatedOn: formatDate(res.InvoiceDate), //date
          EditLog: res.EditLog,
          Remarks: res.remark,
          PIDetail: itemObjs,
        };
        if (type === "edit") {
          // console.log("objfffffffffff",obj)
          await axios
            .put(api, obj, config)
            .then(async (a) => {
              // console.log(a,"if edit aaaaaaaaaaaaaaa")
              if (a.data.statuscode === 202) {
                await db.PurchaseInvoice.update(res.id, {
                  update: 0,
                });
              } else {
                // console.log("PurchaseInvoice put statusCode",  a.data.statuscode);
                // console.log("PurchaseInvoice put message", a.data.message);
              }
            })
            .catch((err) => console.log(err));
        } else {
          // console.log("objfffffffffffrrrrrrrrrrrrrr",obj)
          await axios
            .post(api, obj, config)
            .then(async (a) => {
              // console.log(a,"else aaaaaaaaaaaaaaa")
              if (a.data.statuscode === 201) {
                await db.PurchaseInvoice.update(res.id, {
                  new: 0,
                  update: 0,
                  Id: a.data.MasterId,
                });
                const itemarr = itemres.map((b) => {
                  let x = a.data.Result.PIDetail.find(
                    (did) => did.rowid === b.id
                  );
                  if (x) {
                    return {
                      ...b,
                      InvoiceId: a.data.MasterId,
                      InvoiceDetailId: x.InvoiceDetailId,
                    };
                  } else {
                    return {
                      ...b,
                      InvoiceId: a.data.MasterId,
                      InvoiceDetailId: "",
                    };
                  }
                });
                await db.PurchaseInvoiceDetail.bulkPut(itemarr)
                  .then()
                  .catch((err) => console.log);
              } else {
                // console.log(
                //   "PurchaseInvoice push statusCode",
                //   a.data.statuscode
                // );
                // console.log("PurchaseInvoice push message", a.data.message);
              }
            })
            .catch((err) => console.log(err));
        }
      }
    }
  }
};

//PurchaseInvoiceWithGIT
// const purchaseInvoiceWithGitPush = async () => {
//   const res = await db.PurchaseInvoice.where("new").equals(1).first();
//   const config = { headers: { token: localStorage.getItem("token") } };
//   let api = "api/PurchaseInvoice";
//   if (res) {
//     const itemres = await db.PurchaseInvoiceDetail.where("InvoiceId")
//       .equals(res.id)
//       .toArray();
//     if (itemres && itemres.length > 0) {
//       const itemObjs = itemres.map((item) => {
//         const itemobj = {
//           InvoiceDetailId: 0,
//           InvoiceId: item.InvoiceId,
//           ItemId: item.ItemId,
//           ItemName: "",
//           ItemCode: "",
//           isaltrate: item.isaltrate,
//           Quantity: item.Quantity,
//           altqty: item.altqty,
//           Rate: item.Rate,
//           Amount: item.Amount,
//           DiscountPer: item.DiscountPer,
//           DiscountAmount: item.DiscountAmount,
//           ReferenceNo: item.ReferenceNo,
//           ReferenceDate: formatDate(null),
//           hsnclassificationid: item.hsnclassificationid,
//           igstrate: item.igstrate,
//           cgstrate: item.cgstrate,
//           sgstrate: item.sgstrate,
//           igstamount: item.igstamount,
//           cgstamount: item.cgstamount,
//           sgstamount: item.sgstamount,
//           icdetailid: item.icdetailid,
//           referencedetailid: item.referencedetailid,
//         };
//         return itemobj;
//       });
//       if (itemObjs) {
//         const obj = {
//           Id: 0,
//           InvoiceNo: res.InvoiceNo,
//           InvoiceDate: formatDate(res.InvoiceDate), //get date
//           PartyId: res.PartyId,
//           PartyName: "",
//           invoicetype: 1,
//           grossamount: res.grossamount,
//           discountamount: res.discountamount,
//           taxamount: res.taxamount,
//           netamount: res.netamount,
//           seriesid: res.seriesid,
//           seriesvouchertype: res.seriesvouchertype,
//           billingcountryid: res.billingcountryid,
//           billingstateid: res.billingstateid,
//           billingaddress: res.billingaddress,
//           billinggstinno: res.billinggstinno,
//           shippingcountryid: res.shippingcountryid,
//           shippingstateid: res.shippingstateid,
//           shippingaddress: res.shippingaddress,
//           shippinggstinno: res.shippinggstinno,
//           remark: res.remark,
//           dncn_against_pi: res.dncn_against_pi,
//           referencetype: res.referencetype,
//           referenceid: res.referenceid,
//           CreatedBy: res.CreatedBy,
//           CreatedByName: "",
//           CreatedOn: formatDate(res.CreatedOn), //date
//           EditLog: res.EditLog,
//           Remarks: res.Remarks,
//           PIDetail: itemObjs,
//         };

//         await axios
//           .put(api, obj, config)
//           .then(async (a) => {
//             if (a.data.MasterId) {
//               await db.PurchaseInvoice.update(res.id, {
//                 new: 0,
//                 update: 0,
//                 Id: a.data.MasterId,
//               });
//             }
//           })
//           .catch((err) => console.log(err));
//       }
//     }
//   }
// };

//DebitNote
const debitNotePush = async () => {
  const res = await db.PurchaseInvoice.where("new").equals(1).first();
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/PurchaseInvoice";
  if (res) {
    const itemres = await db.PurchaseInvoiceDetail.where("InvoiceId")
      .equals(res.id)
      .toArray();
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          InvoiceDetailId: 0,
          InvoiceId: item.InvoiceId,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: "",
          isaltrate: item.isaltrate,
          Quantity: item.Quantity,
          altqty: item.altqty,
          Rate: item.Rate,
          Amount: item.Amount,
          DiscountPer: item.DiscountPer,
          DiscountAmount: item.DiscountAmount,
          ReferenceNo: item.ReferenceNo,
          ReferenceDate: formatDate(null),
          hsnclassificationid: item.hsnclassificationid,
          igstrate: item.igstrate,
          cgstrate: item.cgstrate,
          sgstrate: item.sgstrate,
          igstamount: item.igstamount,
          cgstamount: item.cgstamount,
          sgstamount: item.sgstamount,
          icdetailid: item.icdetailid,
          referencedetailid: item.referencedetailid,
        };
        return itemobj;
      });
      if (itemObjs) {
        const obj = {
          Id: 0,
          InvoiceNo: res.InvoiceNo,
          InvoiceDate: formatDate(res.InvoiceDate), //get date
          PartyId: res.PartyId,
          PartyName: "",
          invoicetype: 4,
          grossamount: res.grossamount,
          discountamount: res.discountamount,
          taxamount: res.taxamount,
          netamount: res.netamount,
          seriesid: res.seriesid,
          seriesvouchertype: res.seriesvouchertype,
          billingcountryid: res.billingcountryid,
          billingstateid: res.billingstateid,
          billingaddress: res.billingaddress,
          billinggstinno: res.billinggstinno,
          shippingcountryid: res.shippingcountryid,
          shippingstateid: res.shippingstateid,
          shippingaddress: res.shippingaddress,
          shippinggstinno: res.shippinggstinno,
          remark: res.remark,
          dncn_against_pi: res.dncn_against_pi,
          referencetype: res.referencetype,
          referenceid: res.referenceid,
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          CreatedOn: formatDate(res.CreatedOn), //date
          EditLog: res.EditLog,
          Remarks: res.Remarks,
          PIDetail: itemObjs,
        };

        await axios
          .put(api, obj, config)
          .then(async (a) => {
            if (a.data.MasterId) {
              await db.PurchaseInvoice.update(res.id, {
                new: 0,
                update: 0,
                Id: a.data.MasterId,
              });
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }
};

//Credite Note
const creditNotePush = async () => {
  const res = await db.PurchaseInvoice.where("new").equals(1).first();
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/PurchaseInvoice";
  if (res) {
    const itemres = await db.PurchaseInvoiceDetail.where("InvoiceId")
      .equals(res.id)
      .toArray();
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          InvoiceDetailId: 0,
          InvoiceId: item.InvoiceId,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: "",
          isaltrate: item.isaltrate,
          Quantity: item.Quantity,
          altqty: item.altqty,
          Rate: item.Rate,
          Amount: item.Amount,
          DiscountPer: item.DiscountPer,
          DiscountAmount: item.DiscountAmount,
          ReferenceNo: item.ReferenceNo,
          ReferenceDate: formatDate(null),
          hsnclassificationid: item.hsnclassificationid,
          igstrate: item.igstrate,
          cgstrate: item.cgstrate,
          sgstrate: item.sgstrate,
          igstamount: item.igstamount,
          cgstamount: item.cgstamount,
          sgstamount: item.sgstamount,
          icdetailid: item.icdetailid,
          referencedetailid: item.referencedetailid,
        };
        return itemobj;
      });
      if (itemObjs) {
        const obj = {
          Id: 0,
          InvoiceNo: res.InvoiceNo,
          InvoiceDate: formatDate(res.InvoiceDate), //get date
          PartyId: res.PartyId,
          PartyName: "",
          invoicetype: 3,
          grossamount: res.grossamount,
          discountamount: res.discountamount,
          taxamount: res.taxamount,
          netamount: res.netamount,
          seriesid: res.seriesid,
          seriesvouchertype: res.seriesvouchertype,
          billingcountryid: res.billingcountryid,
          billingstateid: res.billingstateid,
          billingaddress: res.billingaddress,
          billinggstinno: res.billinggstinno,
          shippingcountryid: res.shippingcountryid,
          shippingstateid: res.shippingstateid,
          shippingaddress: res.shippingaddress,
          shippinggstinno: res.shippinggstinno,
          remark: res.remark,
          dncn_against_pi: res.dncn_against_pi,
          referencetype: res.referencetype,
          referenceid: res.referenceid,
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          CreatedOn: formatDate(res.CreatedOn), //date
          EditLog: res.EditLog,
          Remarks: res.Remarks,
          PIDetail: itemObjs,
        };
        await axios
          .put(api, obj, config)
          .then(async (a) => {
            if (a.data.MasterId) {
              await db.PurchaseInvoice.update(res.id, {
                new: 0,
                update: 0,
                Id: a.data.MasterId,
              });
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }
};

//Stock Journal
const stockJournalPush = async () => {
  const res = await db.AdjustmentMaster.where("new").equals(1).first();
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/StockJournal";
  if (res) {
    const itemres = await db.AdjustmentDetail.where("stockadjustmentid")
      .equals(res.id)
      .toArray();
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          AdjustmentDetailId: 0,
          AdjustmentId: 0,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: "",
          MRP: item.MRP,
          QuantityIn: item.QuantityIn,
          QuantityOut: item.QuantityOut,
          LotNo: null,
        };
        return itemobj;
      });
      if (itemObjs) {
        const obj = {
          Id: 0,
          AdjustmentNo: res.AdjusmentNo,
          StockAdjustmentDate: formatDate(new Date()),
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          CreatedOn: formatDate(new Date()),
          BranchId: 0,
          EditLog: "",
          Remark: res.Remarks,
          DETAIL: itemObjs,
        };
        await axios
          .post(api, obj, config)
          .then(async (a) => {
            if (a.data.MasterId) {
              await db.AdjustmentMaster.update(res.id, {
                new: 0,
                update: 0,
                Id: a.data.MasterId,
              });
              let updatdArry = itemres.map((b) => {
                return { ...b, stockadjustmentid: a.data.MasterId };
              });
              await db.AdjustmentDetail.bulkPut(updatdArry)
                .then()
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      }
    }
  }
};

//Sales Return
const salesReturnPush = async (type) => {
  const res =
    type === "new"
      ? await db.salesReturn.where("new").equals(1).first()
      : type === "edit"
      ? await db.salesReturn.where("update").equals(1).first()
      : false;
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/SaleReturn";
  if (res) {
    let id = res.Id === 0 || res.Id === "" ? res.id : res.Id;
    const itemres = await db.SaleReturnDetail.where("InvoiceId")
      .equals(id)
      .toArray();
    if (itemres && itemres.length > 0) {
      const itemObjs = itemres.map((item) => {
        const itemobj = {
          InvoiceDetailId: 0,
          InvoiceId: type === "edit" ? item.InvoiceId : 0,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: "",
          Quantity: item.Quantity,
          MRP: item.MRP,
          SalePrice: item.SalePrice,
          GrossAmount: item.GrossAmount,
          FinalDiscount: item.FinalDiscount,
          TotalTaxAmount: item.TotalTaxAmount,
          TotalNetAmount: item.TotalNetAmount,
          IsTaxInclusive: "",
          AltQuantity: item.AltQuantity,
          AutoDiscount: item.AutoDiscount,
          AutoDiscountAmount: item.AutoDiscountAmount,
          ManualDiscount: item.ManualDiscount,
          ManualDiscountAmount: item.ManualDiscountAmount,
          ItemRemark: item.ItemRemark,
          AgainstInvoiceDetailId: 0,
          AgainstInvoiceId: item.AgainstInvoiceId,
          HsnId: item.Hsnid,
          IGSTRate: item.IgstRate,
          CGSTRate: item.CgstRate,
          SGSTRate: item.SgstRate,
          IGSTAmount: item.IgstAmount,
          CGSTAmount: item.CgstAmount,
          SGSTAmount: item.SgstAmount,
        };
        return itemobj;
      });
      if (itemObjs) {
        const obj = {
          Id: type === "edit" ? res.Id : 0,
          InvoiceNo: res.Invoiceno,
          InvoiceDate: formatDate(res.InvoiceDate),
          PartyId: res.PartyId,
          PartyName: "",
          GrossAmount: res.GrossAmount,
          NetAmount: res.NetAmount,
          DiscountAmount: res.DiscountPerAmount,
          TaxAmount: res.TaxAmount,
          ReceiveAmount: res.ReceiveAmount,
          CreatedBy: res.CreatedBy,
          SeriesId: res.SeriesId,
          SeriesVoucherType: res.SeriesVoucherType,
          CreatedByName: "",
          CreatedOn: formatDate(res.CreatedOn),
          EditLog: res.EditLog,
          SalesPersonId: res.salepersonId,
          Remarks: res.Remarks,
          TotalBillQty: res.TotalBillQty,
          AgainstInvoiceId: res.AgainstInvoiceId,
          TotalIgst: res.totalIgst === undefined ? 0 : res.totalIgst,
          TotalCgst: res.totalCgst === undefined ? 0 : res.totalCgst,
          TotalSgst: res.totalSgst === undefined ? 0 : res.totalSgst,
          SalesReturnDetail: itemObjs,
        };
        console.log(JSON.stringify(obj), "fffffffffff");
        if (type === "new") {
          await axios
            .post(api, obj, config)
            .then(async (a) => {
              if (a.data.statuscode === 201 && a.data.MasterId > 0) {
                await db.salesReturn.update(res.id, {
                  new: 0,
                  update: 0,
                  Id: a.data.MasterId,
                });
                const newarray = itemres.map((b) => {
                  return { ...b, InvoiceId: a.data.MasterId };
                });
                await db.SaleReturnDetail.bulkPut(newarray)
                  .then()
                  .catch((err) => console.log(err));
              } else {
                console.log(
                  "sales ReturnBill wise statusCode",
                  res.data.statuscode
                );
                console.log("sales ReturnBill wise message", res.data.message);
              }
            })
            .catch((err) => console.log(err));
        } else if (type === "edit") {
          await axios.put(api, obj, config).then(async (a) => {
            if (a.data.statuscode === 202) {
              await db.salesReturn.update(res.id, {
                update: 0,
              });
            } else {
              console.log(
                "sales ReturnBill wise statusCode",
                res.data.statuscode
              );
              console.log("sales ReturnBill wise message", res.data.message);
            }
          });
        }
      }
    }
  }
};

//Purchase Order
const purchaseOrderPush = async (type) => {
  //const res = await db.purchaseOrder.where("new").equals(1).first();
  const pObj =
    type === "new" ? { new: 1 } : type === "edit" ? { update: 1 } : "";
  if (pObj !== "") {
    const res = await db.purchaseOrder
      .get(pObj)
      .then()
      .catch((err) => console.log(err));
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "api/PurchaseOrder";
    if (res) {
      let id = res.Id === 0 || res.Id === undefined ? res.id : res.Id;
      const itemres = await db.purchaseDetail
        .where("PoId")
        .equals(id)
        .toArray();
      if (itemres && itemres.length > 0) {
        const itemObjs = itemres.map((item) => {
          const itemobj = {
            PoDetailId: 0,
            PoId: type === "new" ? 0 : item.PoId,
            ItemId: item.ItemId,
            ItemName: item.ItemName,
            ItemCode: item.ItemCode,
            Rate: item.Rate,
            Discount: item.Discount,
            BaseQty: parseInt(item.BaseQty),
            AltQty: item.AltQty,
            GrossTotal: item.GrossTotal,
            DiscountAmount: item.DiscountAmount,
            NetTotal: item.NetTotal,
            IsAltRate: null,
            Remark: item.Remark,
            HsnId: 0,
            IGSTRate: 0,
            CGSTRate: 0,
            SGSTRate: item.SGSTRate,
            IGSTAmount: 0,
            CGSTAmount: 0,
            SGSTAmount: item.SGSTAmount,
          };
          return itemobj;
        });
        const indentItemObjs = [];
        itemres.map((item1) => {
          if (item1.IndentId) {
            const indentItemobj = {
              PoIndentDetailId: 0,
              PoDetailId: 0,
              Poid: type === "new" ? 0 : item1.PoId,
              IndentId: item1.IndentId,
              IndentDetailId: 0,
              ItemId: item1.ItemId,
              BaseQty: parseInt(item1.BaseQty),
            };
            indentItemObjs.push(indentItemobj);
          }
          return item1;
        });
        if (itemObjs) {
          const obj = {
            Id: type === "new" ? 0 : res.Id,
            PoNumber: res.PoNumber,
            PoDate: formatDate(res.PoDate),
            PartyId: res.PartyId,
            PartyName: res.PartyName,
            CreatedBy: res.CreatedBy,
            CreatedByName: res.CreatedByName,
            CreatedOn: formatDate(new Date()),
            EditLog: "",
            IsClosed: false,
            Remarks: res.Remarks,
            OrderedBy: res.CreatedBy,
            SeriesId: res.SeriesId,
            SeriesNo: null,
            SeriesCode: null,
            SeriesVoucherType: res.SeriesVoucherType,
            TotalIGST: 0,
            TotalCGST: 0,
            TotalSGST: 0,
            PurchaseDetail: itemObjs,
            PurchaseIndentDetail: indentItemObjs,
          };
          if (type === "new") {
            await axios
              .post(api, obj, config)
              .then(async (a) => {
                if (a.data.statuscode === 201) {
                  await db.purchaseOrder.update(res.id, {
                    new: 0,
                    update: 0,
                    Id: a.data.MasterId,
                  });
                  const list = itemres.map((d) => {
                    return { ...d, PoId: a.data.MasterId };
                  });
                  await db.purchaseDetail
                    .bulkPut(list)
                    .then()
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => console.log(err));
          } else if (type === "edit") {
            await axios
              .put(api, obj, config)
              .then(async (a) => {
                if (a.data.statuscode === 202) {
                  await db.purchaseOrder.update(res.id, {
                    update: 0,
                  });
                }
              })
              .catch((err) => console.log(err));
          }
        }
      }
    }
  }
};
const purchaseReturnPush = async (type) => {
  const res =
    type === "new"
      ? await db.PR_Master.where("new").equals(1).first()
      : type === "edit"
      ? await db.PR_Master.where("update").equals(1).first()
      : false;
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/PurchaseReturn";
  if (res) {
    let id =
      res.Id === 0 || res.Id === "" || res.Id === undefined ? res.id : res.Id;
    const itemres = await db.PR_Detail.where("Prid").equals(id).toArray();
    if (itemres && itemres.length > 0) {
      const itemData = itemres.map((item) => {
        const itemDetail = {
          PrDetailId: 0,
          PrId: type === "new" ? 0 : item.Prid,
          ItemId: item.ItemId,
          ItemName: "",
          ItemCode: 0,
          BaseQty: item.ReturnBaseQty,
          AltQty: 0,
          MRP: item.MRP,
          Rate: item.Rate,
          GrossAmount: 0,
          DiscountPer: 0,
          DiscountAmount: 0,
          DiscountedAmount: 0,
          InwardDetailId: item.InwardDetailId,
        };
        return itemDetail;
      });
      if (itemData) {
        const prObj = {
          Id: type === "edit" ? res.Id : 0,
          PRNo: res.PurchaseReturnNo,
          PRDate: formatDate(res.PurchaseReturnDate),
          VendorId: res.vendorid,
          VendorName: null,
          GrossAmount: 0,
          NetAmount: 0,
          CreatedBy: res.CreatedBy,
          CreatedByName: "",
          SeriesId: res.SeriesId,
          SeriesVoucherType: res.SeriesVoucherType,
          CreatedOn: "",
          EditLog: "",
          Remarks: null,
          PrType: res.Manual,
          PRDetail: itemData,
        };
        if (type === "new") {
          await axios
            .post(api, prObj, config)
            .then(async (a) => {
              if (a.data.statuscode === 201 && a.data.MasterId > 0) {
                await db.PR_Master.update(res.id, {
                  new: 0,
                  update: 0,
                  Id: a.data.MasterId,
                });
                const newarray = itemres.map((b) => {
                  return { ...b, Prid: a.data.MasterId };
                });
                await db.PR_Detail.bulkPut(newarray)
                  .then()
                  .catch((err) => console.log(err));
              } else {
                console.log("Purchase purchaseReturn", a.data.statuscode);
                console.log("Purchase purchaseReturn", a.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (type === "edit") {
          await axios.put(api, prObj, config).then(async (a) => {
            if (a.data.statuscode === 202) {
              await db.PR_Master.update(res.id, {
                update: 0,
              });
            } else {
              console.log(
                "purchase ReturnBill wise statusCode",
                res.data.statuscode
              );
              console.log("Purchase ReturnBill wise message", res.data.message);
            }
          });
        }
      }
    }
  }
};
//AdvanceAdjustment
const advanceAdjustmentPush = async () => {
  const res = await db.advanceAdjustment.where("new").equals(1).first();
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/AdvanceAdjustment";
  if (res) {
    const obj = {
      Id: 0,
      AdvanceAdjustmentNo: res.advanceadjustmentno,
      AdvanceAdjustmentDate: formatDate(res.advanceadjustmentdate),
      PartyId: res.partyid,
      PartyName: "",
      AdvanceAdjustmentAmount: res.advanceadjustmentrefundamount,
      Remarks: res.remarks,
      AdvanceAdjustmentRefunAamount: res.advanceadjustmentrefundamount,
      AmountAdjusted: res.createdby,
      CounterId: 0,
      EditLog: "",
      CreatedBy: 0,
      CreatedOn: formatDate(new Date()),
    };
    await axios
      .post(api, obj, config)
      .then(async (a) => {
        if (a.data.MasterId) {
          await db.advanceAdjustment.update(res.id, {
            new: 0,
            update: 0,
            Id: a.data.MasterId,
          });
        }
      })
      .catch((err) => console.log(err));
  }
};

//AdvanceAdjustment
const CreditNoteRefundPush = async () => {
  const res = await db.creditNoteRefund.where("new").equals(1).first();
  const config = { headers: { token: localStorage.getItem("token") } };
  let api = "api/CreditNoteRefund";
  if (res) {
    const obj = {
      Id: 0,
      AdvanceAdjustmentNo: res.creditnoteno,
      AdvanceAdjustmentDate: formatDate(res.creditnotedate),
      PartyId: res.partyid,
      PartyName: "",
      AdvanceAdjustmentAmount: res.creditnoteamount,
      Remarks: res.remarks,
      AdvanceAdjustmentRefunAamount: res.creditnoterefundamount,
      AmountAdjusted: res.createdby,
      CounterId: 0,
      EditLog: "",
      CreatedBy: 0,
      CreatedOn: formatDate(new Date()),
    };
    await axios
      .put(api, obj, config)
      .then(async (a) => {
        //console.log("masterid####",a);
        if (a.data.MasterId) {
          await db.creditNoteRefund.update(res.id, {
            new: 0,
            update: 0,
            Id: a.data.MasterId,
          });
        }
      })
      .catch((err) => console.log(err));
  }
};

export {
  customerMasterPushPost,
  customerMasterPushPut,
  // itemMasterPushPut,
  // itemMasterPushPost,
  billPosPush,
  inwardPush,
  purchaseReturnPush,
  billPoswithsalesorderPush,
  //saleOrderPush,
  indentPush,
  purchaseInvoicePush,
  stockJournalPush,
  // purchaseInvoiceWithGitPush,
  salesReturnPush,
  purchaseOrderPush,
  creditNotePush,
  debitNotePush,
  advanceAdjustmentPush,
  CreditNoteRefundPush,
};
