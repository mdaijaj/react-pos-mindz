import db from "../../../datasync/dbs";
import {
  updateStockIndDb,
  updateStockIndDbUpdate,
  getItemstockQtyindexDb,
} from "../../common/commonFunction";
// To get data from invoice db
export const getViewInvoiceDetails = async () => {
  try {
    let userID = localStorage.getItem("UserId");
    let a1 = await db.salesInvoiceWithSO
      .where({ ishold: "false" })
      .reverse()
      .toArray();
    let a = a1.filter((e) => e.createdby === userID);
    let b = await db.saleInvoiceDetailWithSO.toArray();
    return { salesInvoice: a, saleInvoiceDetail: b };
  } catch (error) {
    console.log("getInvoiceDetails error", error);
  }
};

export const getEditInvoiceDetails = async () => {
  try {
    let userID = localStorage.getItem("UserId");
    let a1 = await db.salesInvoiceWithSO
      .where({ ishold: "false" })
      .reverse()
      .toArray();
    //console.log("test test test ",a1);
    let a = a1.filter((e) => e.createdby === userID);
    //console.log("test1 test1 test1 ",a);
    let b = await db.saleInvoiceDetailWithSO.toArray();
    return { salesInvoice: a, saleInvoiceDetail: b };
  } catch (error) {
    console.log("getInvoiceDetails error", error);
  }
};

// ---
export const fn_GetHoldSalesInvoice = async (id) => {
  try {
    const data = await db.salesInvoiceWithSO
      .where("id")
      .equals(id)
      .last(function (res) {
        return res;
      })
      .then(async (res) => {
        if (res && res.id) {
          res.product = await db.saleInvoiceDetailWithSO
            .where("invoiceid")
            .equals(res.id)
            .toArray()
            .then(async function (resp) {
              return await getProductNameRes(resp);
            });
        }

        return res;
      });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
export const fn_GetLastSalesInvoice = async () => {
  try {
    const data = await db.salesInvoiceWithSO
      .orderBy("id")
      .last(function (res) {
        return res;
      })
      .then(async (res) => {
        if (res && res.id) {
          let id = res.Id > 0 ? res.Id : res.id;
          res.product = await db.saleInvoiceDetailWithSO
            .where("invoiceid")
            .equals(id)
            .toArray()
            .then(async function (resp) {
              return await getProductNameRes(resp);
            });
        }

        return res;
      });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
// ---

// export const del = () => {
//   try {
//     // const db = new Dexie("salesinvoicedb");
//     db.delete()
//       .then(() => {
//         console.log("SalesInvoice database successfully deleted");
//       })
//       .catch((err) => {
//         console.error("Could not delete salesInvoice database");
//       })
//       .finally(() => {
//         // Do what should be done next...
//       });
//   } catch (error) {}
// };

const fn_GetFormateProduct = (product, invoiceId, type) => {
  // let tempProduct = {};
  const productObj = product.map((item) => {
    const prObj = {
      invoiceid: invoiceId,
      itemid: item.ItemId,
      ItemName: item.ItemName,
      ItemCode: item.ItemCode,
      HsnId: item.HsnId,
      quantity: item.quantity,
      mrp: item.mrp,
      saleprice: item.Rate,
      grossamount: item.grossamount,
      taxper: 0,
      totaltaxamount: item.totaltaxamount,
      finalperrate: 0,
      totalnetamount: item.amount,
      lotno: "",
      createdby: 1,
      createdon: type === "new" ? new Date() : item.createdon,
      editlog: "",
      isvatitem: false,
      addtaxrate: 0,
      addtaxamount: 0,
      surchargerate: 0,
      surchargeamount: 0,
      taxamount: 0,
      istaxinclusive: item.IsTaxInclusive,
      altqty: 0,
      salepersonid: 0,
      changeindiscount: 0,
      autodiscountper: 0,
      autodiscountamount: 0,
      manualdiscountper: item.manualdiscountper,
      manualdiscountamount: item.manualdiscountamount,
      istaxcalculatebeforediscount: false,
      lotserialid: 0,
      itemremark: item.remark,
      discount_slab_detail_id: 0,
      isautodiscountonper: false,
      isautodiscountonamount: false,
      isaltrate: 0,
      conversion: item.Conversion,
      denominator: item.Denominator,
      isschemeitem: 0,
      hsnclassificationid: 0,
      igstrate: item.igstRate,
      cgstrate: item.cgstRate,
      sgstrate: item.sgstRate,
      igstamount: item.igst,
      cgstamount: item.cgst,
      sgstamount: item.sgst,
      manualchangesaleprice: false,
      schemecode: item.schemecode,
      SoNo: item.SoNo,
      SoId: item.SoId,
      SoDetailId: item.SoDetailId,
    };
    if (type !== "new") {
      return { ...prObj, id: item.id };
    } else {
      return prObj;
    }
  });

  return productObj;
};

//save
export const fn_SaveInvoice = async (object, product, pageId) => {
  try {
    let id = await db.salesInvoiceWithSO.add({ ...object, new: 1 });
    if (id > 0) {
      if (product && product.length > 0) {
        product = fn_GetFormateProduct(product, id, "new");
        await db.saleInvoiceDetailWithSO.bulkAdd(product);
        const x = product.map((c) => {
          const nObj = {
            formId: pageId,
            trId: id,
            ItemId: c.itemid,
            qty: c.quantity,
            type: "outqty",
          };
          return nObj;
        });
        updateStockIndDb(x);
      }
    }
    //return id;
  } catch (error) {}
};

// const fn_FormatArray = () => {};

// update;
export const fn_UpdateInvoice = async (object, product, pageId) => {
  try {
    await db.salesInvoiceWithSO.put({ ...object, update: 1 });
    const objproduct = fn_GetFormateProduct(
      product,
      object.Id === 0 || object.Id === "" ? object.id : object.Id,
      "edit"
    );
    await db.saleInvoiceDetailWithSO.bulkPut(objproduct);
    // let id = await db.saleInvoiceDetailWithSO
    //   .where("invoiceid")
    //   .anyOf(object.Id === 0 || object.Id ? object.id : object.Id)
    //   .delete()
    //   .then(async () => {

    //   });
    const x = product.map((c) => {
      const nObj = {
        formId: pageId,
        trId: object.Id === 0 || object.Id ? object.id : object.Id,
        ItemId: c.itemid,
        qty: c.quantity,
        type: "outqty",
      };
      return nObj;
    });
    updateStockIndDbUpdate(x);
    // return id;
  } catch (error) {
    console.log(error);
  }
};
export const fn_DeleteInvoice = async (id) => {
  try {
    return await db.transaction.delete(id);
  } catch (error) {}
};

// return await db.friends.bulkDelete([1,2,4]);
//GetBillSeries
export const fn_GetBillSeries = async () => {
  try {
    const data = await db.salesInvoiceWithSO.toArray();
    return data;
  } catch (error) {}
};

//query salesinvoice
export const fn_GetSalesInvoice = async () => {
  try {
    const data = await db.salesInvoiceWithSO.toArray();
    return data;
  } catch (error) {}
};

const getProductNameRes = async (list) => {
  if (list && list.length > 0) {
    list.map(async (item) => {
      const product = await db.itemMaster.get({ ItemId: item.itemid });
      item.ItemName = product && product.ItemName;
      item.ItemCode = product && product.ItemCode;
    });
    return list;
  }
};
//hold data
export const fn_GetSaleInvoiceId = async (invoiceId) => {
  try {
    const data = await db.salesInvoiceWithSO
      .where("id")
      .equals(invoiceId)
      .first()
      .then(async (res) => {
        let idval = res.Id > 0 ? res.Id : res.id;
        res.product = await db.saleInvoiceDetailWithSO
          .where("invoiceid")
          .equals(idval)
          .toArray()
          .then(async function (resp) {
            return await getProductNameRes(resp);
          });
        return res;
      });
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

//Item master data

//Query item master
export const fn_GetItemMaster = async () => {
  try {
    const data = await db.itemMaster.toArray();
    return data;
  } catch (error) {}
};

//Query item master
export const fn_GetCustomerMaster = async (mobileNumber) => {
  try {
    const data = await db.customerMaster.toArray().then((result) => {
      return result && result.length > 0
        ? result.filter((x) => x.LedgerType === 1)
        : [];
    });

    return data;
  } catch (error) {}
};
export async function fn_GetItemMasterDetail(arr, date) {
  try {
    let productId = arr.ItemId;
    let SoNo = arr.SoNo;
    let SoId = arr.SoId;
    let SoDetailId = arr.SoDetailId;
    let itemDetail = {};
    let itemMaster =
      productId && (await db.itemMaster.get({ ItemId: productId }));
    let gstDetails =
      itemMaster &&
      itemMaster.GSTClassification &&
      itemMaster.GSTClassification.length > 0 &&
      itemMaster.GSTClassification[0].HsnId &&
      (await db.hsnMaster.get({ Id: itemMaster.GSTClassification[0].HsnId }));
    let itemTaxStructure =
      productId && (await db.itemTaxStructure.get({ itemid: productId }));
    if (gstDetails && Object.keys(gstDetails).length > 0) {
      itemDetail = itemMaster;
      itemDetail.amount = 0;
      itemDetail.HsnId = itemMaster.GSTClassification[0].HsnId;
      itemDetail.salePrice = 0;
      itemDetail.mrp = 0;
      itemDetail.quantity = 0;
      itemDetail.cgstRate = 0;
      itemDetail.sgstRate = 0;
      itemDetail.igstRate = 0;
      itemDetail.remark = "";
      itemDetail.schemecode = 0;
      itemDetail.Rate = 0;
      itemDetail.manualdiscountper = 0;
      itemDetail.manualdiscountamount = 0;
      itemDetail.istaxinclusive =
        itemTaxStructure && itemTaxStructure.istaxinclusive;
      itemDetail.igstRate =
        gstDetails.IGST[0] && gstDetails.IGST[0].IgstTaxRate
          ? gstDetails.IGST[0].IgstTaxRate
          : 0;
      itemDetail.sgstRate =
        gstDetails.IGST[0].CGST[0] && gstDetails.IGST[0].CGST[0].SgstTaxRate
          ? gstDetails.IGST[0].CGST[0].SgstTaxRate
          : 0;
      itemDetail.cgstRate =
        gstDetails.IGST[0].CGST[0] && gstDetails.IGST[0].CGST[0].CgstTaxRate
          ? gstDetails.IGST[0].CGST[0].CgstTaxRate
          : 0;
      // let stock = 0;
      let mrp = 0;
      // let st = await getItemstockQtyindexDb(productId);
      // console.log(st, "dddddsssssssssssss");
      await db.getItemStock
        .where("itemid")
        .equals(productId)
        .toArray()
        .then((response) => {
          if (response && response.length > 0) {
            response.map((item) => {
              mrp = item.mrp;
              // stock = item.balance;
              return item;
            });
          }
        });
      // itemDetail.stock = stock;
      itemDetail.stock = await getItemstockQtyindexDb(productId);
      itemDetail.mrp = mrp;
      itemDetail.SoNo = SoNo;
      itemDetail.SoDetailId = SoDetailId;
      itemDetail.SoId = SoId;
      return itemDetail;
    } else {
      return {};
    }
  } catch (error) {
    console.log("error itemmasterdetail ", error.message);
  }
}
