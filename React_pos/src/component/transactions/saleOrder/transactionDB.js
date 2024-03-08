import db from "../../../datasync/dbs";

export const fn_GetSo = async (SoNo) => {
  try {
    let data = [];
    if (SoNo) {
      data = await db.SaleOrder.get(SoNo.id).then(async (res) => {
        if (res && res.id) {
          res.product = await db.saleDetail
            .where("SoId")
            .equals(res.id)
            .toArray();
        }

        return res;
      });
      return data;
    } else {
      data = await db.SaleOrder.reverse()
        .toArray()
        .then(async (res) => {
          if (res && res.id) {
            res.product = await db.saleDetail
              .where("SoId")
              .equals(res.id)
              .toArray();
          }

          return res;
        });
      return data;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const fn_SaveSo = async (object, product) => {
  try {
    let id = await db.SaleOrder.add(object);
    if (id > 0) {
      if (product && product.length > 0) {
        id = await db.saleDetail.bulkAdd(fn_GetFormateProduct(product, id));
      }
    }
    return id;
  } catch (error) {}
};

const fn_GetFormateProduct = (product, id) => {
  if (product && product.length > 0) {
  let products = product.map((item) => {
      return { ...item, SoId: id };
    });
    return products;
  }

};
export const fn_UpdateSo = async (object, product) => {
  try {
    await db.SaleOrder.put(object);
    let id = await db.saleDetail
      .where("SoId")
      .anyOf(object.id)
      .delete()
      .then(async () => {
        await db.saleDetail.bulkAdd(product);
      });
    return id;
  } catch (error) {
    console.log(error);
  }
};

export const fn_GetCustomerMaster = async (mobileNumber) => {
  try {
    const data = await db.customerMaster.toArray().then((result) => {
      return result && result.length > 0
        ? result.filter((x) => x.LedgerType === 2)
        : [];
    });

    return data;
  } catch (error) {}
};

// const fn_GetStockData = async (itemId) => {
//   let qty = 0;
//   let mrp = 0;
//   let totalIn = 0;
//   let totalOut = 0;
//   await db.stockLotMaster
//     .where("ItemId")
//     .equals(itemId)
//     .toArray()
//     .then((response) => {
//       if (response && response.length > 0) {
//         response.map((item) => {
//           totalIn = item.QtyIn > 0 ? totalIn + parseInt(item.QtyIn) : totalIn;
//           totalOut =
//             item.QtyOut > 0 ? totalOut + parseInt(item.QtyOut) : totalOut;
//           qty = totalIn - totalOut;
//           mrp = item.Mrp;
//           //console.log("quantit ", item.QtyIn, item.QtyOut, qty, productId);
//           //return qty;
//         });
//         //return qty;
//       } else {
//         //return 0;
//       }
//     });
//   return { qty, mrp };
// };

export const fn_getItemMaster = async () => {
  let itemMaster = [];
  let tempRes = [];

  itemMaster = await db.itemMaster.toArray();
  await itemMaster.map(async (y) => {
    return tempRes.push({
      id: y.Id,
      ItemName: y && y.ItemName,
      ItemCode: y && y.ItemCode,
      UnitId: 3,
      UnitName: y.UnitName,
      Rate: 0,
      quantity: y.Quantity,
      Discount: 0,
      grossTotal: 0,
      NetTotal: 0,
    });
  });

  return tempRes;
};
