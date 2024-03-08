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
    let a1 = await db.salesInvoice
      .where({ ishold: "false" })
      .reverse()
      .toArray();
    let a = a1.filter((e) => e.createdby === userID);
    let b = await db.saleInvoiceDetail.toArray();
    return { salesInvoice: a, saleInvoiceDetail: b };
  } catch (error) {
    console.log("getInvoiceDetails error", error);
  }
};

export const getEditInvoiceDetails = async () => {
  try {
    let userID = localStorage.getItem("UserId");
    let a1 = await db.salesInvoice
      .where({ ishold: "false" })
      .reverse()
      .toArray();
    //console.log("test test test ",a1);
    let a = a1.filter((e) => e.createdby === userID);
    //console.log("test1 test1 test1 ",a);
    let b = await db.saleInvoiceDetail.toArray();
    return { salesInvoice: a, saleInvoiceDetail: b };
  } catch (error) {
    console.log("getInvoiceDetails error", error);
  }
};

// ---
export const fn_GetHoldSalesInvoice = async (id) => {
  try {
    const data = await db.salesInvoice
      .where("id")
      .equals(id)
      .last(function (res) {
        return res;
      })
      .then(async (res) => {
        if (res && res.id) {
          res.product = await db.saleInvoiceDetail
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
    const data = await db.salesInvoice
      .orderBy("id")
      .last(function (res) {
        return res;
      })
      .then(async (res) => {
        if (res && res.id) {
          let id = res.Id > 0 ? res.Id : res.id;
          res.product = await db.saleInvoiceDetail
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
  product = product.map((item) => {
    const prObj = {
      invoiceid: type === "edit" ? item.invoiceId : invoiceId,
      itemid: item.ItemId,
      ItemName: item.ItemName,
      ItemCode: item.ItemCode,
      HsnId: item.HsnId,
      quantity: item.quantity,
      mrp: item.mrp,
      soldBatchSerials: item.soldBatchSerials,
      UnitId:item.UnitId,
      UnitName:item.UnitName,
      storeid: item.storeid,      //s
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
      sodetailid: 0,
      schemecode: item.schemecode,
    };
    if (type === "edit") {
      return { ...prObj, id: item.id };
    } else {
      return prObj;
    }
  });

  return product;
};
// return await db.friends.bulkAdd([
//     {name: "Foo", age: 31},
//     {name: "Bar", age: 32}
//   ]);

//save
export const fn_SaveInvoice = async (object, product, pageId) => {
  try {
    console.log(object,'object in fnSaveInvoice')
    console.log(product,'product in fnSaveInvoice')
    console.log(pageId,'object in fnSaveInvoice')
    let id = await db.salesInvoice.add({ ...object, new: 1 });
    if (id > 0) {
      if (product && product.length > 0) {
        product = fn_GetFormateProduct(product, id, "new");
        await db.saleInvoiceDetail.bulkAdd(product);
        const x = product.map((c) => {
          const nObj = {
            storeid:c.storeid,
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
    return id;
  } catch (error) {}
};

// const fn_FormatArray = () => {};

// update;
export const fn_UpdateInvoice = async (object, product, pageId) => {
  try {
    await db.salesInvoice.put({ ...object, new: object.new, update: 1 });
    product = fn_GetFormateProduct(product, object.id, "edit");
    let id = await db.saleInvoiceDetail
      .where("invoiceid")
      .anyOf(object.id)
      .delete()
      .then(async () => {
        await db.saleInvoiceDetail.bulkPut(product);
      });
      
    const x = product.map((c) => {
      const nObj = {
        formId: pageId,
        trId: object.id,
        ItemId: c.itemid,
        qty: c.quantity,
        type: "outqty",
      };
      return nObj;
    });
    updateStockIndDbUpdate(x);
    return id;
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
    const data = await db.salesInvoice.toArray();
    return data;
  } catch (error) {}
};

//query salesinvoice
export const fn_GetSalesInvoice = async () => {
  try {
    const data = await db.salesInvoice.toArray();
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

//Hold Data
export const fn_GetSaleInvoiceId = async (invoiceId) => {
  try {
    const data = await db.salesInvoice
      .where("id")
      .equals(invoiceId)
      .first()
      .then(async (res) => {
        let idval = res.Id > 0 ? res.Id : res.id;
        res.product = await db.saleInvoiceDetail
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
    if(data.length > 0){
      let productTemp = [];
      for(var x of data) {
        const ItemStock = await getItemstockQtyindexDb(x.ItemId,null);
        // console.log(ItemStock,'ItemStock in fn_GetItemMaster')
        const GroupName = await db.itemGroup.where("Id").equals(x.GroupId).first().then().catch(err=>console.log(err));
        if(ItemStock > 0) {
            productTemp.push({...x,groupName:GroupName.GroupName,Stock:ItemStock,id:x.ItemId});
        }
      }
      return productTemp;
    }
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
export async function fn_GetItemMasterDetail(productId, date) {
  try {
    let itemDetail = {};
    let itemMaster =
      productId && (await db.itemMaster.get({ ItemId: productId }));
      console.log(itemMaster,"itemMaster")
    let gstDetails =
      itemMaster &&
      itemMaster.GSTClassification &&
      itemMaster.GSTClassification.length > 0 &&
      itemMaster.GSTClassification[0].HsnId &&
      (await db.hsnMaster.get({ Id: itemMaster.GSTClassification[0].HsnId }));
      console.log(gstDetails,"gstDetails")
    let itemTaxStructure =
      productId && (await db.itemTaxStructure.get({ itemid: productId }));
      console.log(itemTaxStructure,"itemTaxStructure")
    // if (gstDetails && Object.keys(gstDetails).length > 0) {
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
      itemDetail.igstRate =gstDetails === 0 ? 0:
        gstDetails.IGST[0] && gstDetails.IGST[0].IgstTaxRate
          ? gstDetails.IGST[0].IgstTaxRate
          : 0;
      itemDetail.sgstRate =gstDetails === 0 ? 0:
        gstDetails.IGST[0].CGST[0] && gstDetails.IGST[0].CGST[0].SgstTaxRate
          ? gstDetails.IGST[0].CGST[0].SgstTaxRate
          : 0;
      itemDetail.cgstRate =gstDetails === 0 ? 0:
        gstDetails.IGST[0].CGST[0] && gstDetails.IGST[0].CGST[0].CgstTaxRate
          ? gstDetails.IGST[0].CGST[0].CgstTaxRate
          : 0;
      //let stock = 0;
      let mrp = 0;
      let storeid=0;
      // let st = await getItemstockQtyindexDb(productId);
      // console.log(st, "dddddsssssssssssss");
      let itemstockArr = await db.getItemStock
        .where("itemid")
        .equals(productId)
        .toArray()
        .then((response)=>{
          console.log(response.length,"response.length")
          if(response.length === 1){
            storeid = response[0].storeid;
            mrp = response[0].mrp;
          }else{
            storeid = 0;
            mrp = "";
          }
          return response
        }).catch(err=>console.log(err));

        let itemsMRP = await db.itemStockIndexdb
        .where("ItemId")
        .equals(productId)
        .toArray()
        .then((response)=>{
          console.log(response,"response itemMRP")
          let totalMRP = 0;
          response.map(ISIDB => {
            totalMRP+=Number(ISIDB.mrp);
          })
          return totalMRP;
        }).catch(err=>console.log(err));

        
      // await db.getItemStock
      //   .where("itemid")
      //   .equals(productId)
      //   .toArray()
      //   .then((response) => {
      //     console.log(response,"response")
      //     if (response && response.length > 0) {
      //       response.map((item) => {
      //         mrp = item.mrp;
      //         storeid=item.storeid;
      //         // stock = item.balance;
      //         return item;
      //       });
      //     }
      //   });
      // itemDetail.stock = stock;
      
      console.log(itemsMRP,"hhhhhhhhhhhhhhhhhhhhhhhhhhh")
      itemDetail.stock =itemstockArr && itemstockArr.length > 1 ? "":itemstockArr && itemstockArr.length === 1 ? await getItemstockQtyindexDb(productId,storeid):"";
      itemDetail.mrp = itemsMRP;
      itemDetail.storeid = storeid;
      // console.log(itemDetail,"itemDetail")
      return itemDetail;
    // } else {
    //   return {};
    // }
  } catch (error) {
    console.log("error itemmasterdetail ", error.message);
  }
}

// P Starts this function
export const fn_PurchaseInvoice = async (items,invoiceId, pageId) => {
  try {
    console.log(items,'items in fn_PurchaseInvoice')
    console.log(invoiceId,'invoiceId in fn_PurchaseInvoice')
    console.log(pageId,'object in fn_PurchaseInvoice')
    // let id = await db.salesInvoice.add({ ...object, new: 1 });
    if (invoiceId > 0) {
      if (items && items.length > 0) {
        // product = fn_GetFormateProduct(product, id, "new");
        // await db.saleInvoiceDetail.bulkAdd(product);
        const x = items.map((c) => {
          const nObj = {
            formId: pageId,
            storeid:c.GodownId,
            trId: invoiceId,
            ItemId: c.ItemId,
            qty: c.Quantity,
            type: "inqty",
            mrp:c.MRP
          };
          return nObj;
        });
        updateStockIndDb(x);
      }
    }
    return invoiceId;
  } catch (error) {}
};

