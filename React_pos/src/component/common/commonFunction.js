import db from "../../datasync/dbs";
import axios from "axios";
const getPercentCalc = (price, qty, tax) => {
  console.log(price, qty, tax, "ddddddddddd");
  const Amount = price * qty;
  const taxCal = (tax * Amount) / 100;
  return taxCal;
};
const getPercent = (price, tax) => {
  const taxCal = (tax * price) / 100;
  return taxCal;
};
const getGrossAmount = (totalPrice, totalTaxAndDiscount) => {
  let grossAmt = totalPrice - totalTaxAndDiscount;
  return grossAmt;
};
const formatDate = (date) => {
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
};
const getVoucherIds = async (id) => {
  let x = await db.VoucherList.where("ApplyOnFormId").equals(id).toArray();
  if (x.length > 0) {
    let list = x.filter((a) => a.IsActive === true);
    if (list.length > 0) {
      const newList = await Promise.all(
        list.map(async (a) => {
          let id = await db.seriesApply.where("VoucherId").equals(a.Id).first();
          if (id) {
            let seriessts = await db.seriesMaster
              .where("Id")
              .equals(id.SeriesId)
              .first();
            if (
              seriessts &&
              (seriessts.IsActive === "True" ||
                seriessts.IsActive === "true" ||
                seriessts.IsActive === true)
            ) {
              return { ...a, seriesIsActive: true };
            } else {
              return { ...a, seriesIsActive: false };
            }
          } else {
            return { ...a, seriesIsActive: false };
          }
        })
      );
      const fltrList = newList.filter((l) => l.seriesIsActive === true);
      return fltrList;
    }
  } else {
    return [];
  }
};
const dateCompare = (d1) => {
  const date1 = new Date(d1);
  const date2 = new Date();
  // console.log(date1, "date1");
  // console.log(date2, "date2");
  if (date1 > date2) {
    return false;
  } else {
    console.log("y");
    return true;
  }
};
const getSeries = async (val) => {
  let sId = await db.seriesApply.where("VoucherId").equals(val.Id).first();
  if (sId) {
    let compareDate = dateCompare(sId.ApplicableFrom);
    if (compareDate) {
      let x = await db.seriesMaster.where("Id").equals(sId.SeriesId).first();
      //let id = x.Id === undefined || x.Id === null || x.Id === "" ? x.id : x.Id;
      console.log(x, "sId");
      let id = x.Id;
      let SeriesFieldDetail = await db.seriesMasterDetail
        .where("SeriesId")
        .equals(id)
        .toArray();
      if (SeriesFieldDetail) {
        let arr = SeriesFieldDetail.sort(function (a, b) {
          return a.Sno - b.Sno;
        });
        let Arr = [];
        let stCount = "";
        arr.map((a) => {
          if (a.FieldName === "Serial Number") {
            stCount = a.FieldValue;
          } else {
            Arr.push(a.FieldValue + a.Seperator);
          }
          return a;
        });
        let obj = {
          series: Arr.join(""),
          sCount: stCount,
          digit: x.DigitPadding,
          voucherId: val.Id,
          seriesId: id,
        };
        return obj;
      }
    } else {
      let obj = {
        series: "",
        sCount: "00000",
        digit: undefined,
        voucherId: val.Id,
        seriesId: "",
      };
      return obj;
    }
  } else {
    let obj = {
      series: "",
      sCount: "00000",
      digit: undefined,
      voucherId: val.Id,
      seriesId: "",
    };
    return obj;
  }
};
const getseriesNo = async (val, fid) => {
  let servCountFormIdList = await db.seriesCount
    .where("formid")
    .equals(fid)
    .toArray()
    .then()
    .catch((err) => console.log(err));
  let servCount =
    servCountFormIdList &&
    servCountFormIdList.find(
      (a) => a.seriesid === (val.seriesId === "" ? 0 : val.seriesId)
    );
  // console.log(val, "val");
  // console.log(servCountFormIdList, "servCountFormIdList");
  // console.log(val, "valval");
  // console.log(servCount, "servCountservCountservCountservCount");
  let x = 0;
  if (servCount) {
    x =
      val.dbcount.length === 0
        ? 1 + servCount.totalrecord
        : val.dbcount.length + 1 + servCount.totalrecord;
  } else {
    x = val.dbcount.length === 0 ? 1 : val.dbcount.length + 1;
  }
  let scount = x + parseInt(val.sCount === "" ? 0 : val.sCount);
  let lenth = scount.toString().length;
  let n = parseInt(val.digit) - lenth;
  let b = "";
  for (let j = 0; j < n; j++) {
    b = b + "0";
  }
  let s = b + scount.toString();
  let sr = val.series + s;
  return sr;
};
const Post = async (api, obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let x = await axios.post(api, obj, config).then(async (res) => {
      console.log(res, "respost");
      let result = getstatus(res);
      return result;
    });
    return x;
  } catch (err) {
    console.log(err, "pusherr");
    return { msg: "Error" };
  }
};
const Put = async (api, obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let x = await axios.put(api, obj, config).then(async (res) => {
      let result = getstatus(res);
      return result;
    });
    return x;
  } catch (err) {
    // console.log(err, "puterr");
    return { msg: "Error" };
  }
};
const getstatus = (res) => {
  if (res.data.status) {
    // console.log(res, "fffffffffffff");
    if (res.data.statuscode === 201) {
      return {
        mid: res.data.MasterId,
        msg: res.data.message,
        statuscode: res.data.statuscode,
      };
    } else if (res.data.statuscode === 200) {
      return { msg: res.data.message, statuscode: res.data.statuscode };
    } else if (res.data.statuscode === 202) {
      return { msg: res.data.message, statuscode: res.data.statuscode };
    }
  } else {
    //  console.log(res, "vvvvvvvvv");
    if (res.data.statuscode === 710 || res.data.statuscode === 711) {
      return { msg: "Error", statuscode: res.data.statuscode };
    } else {
      return { msg: res.data.message, statuscode: res.data.statuscode };
    }
  }
};
const fnCRoundOff = (n) => {
  let a = (n + "").split(".");
  let l = a[1];
  if (l > 0) {
    let h = "1";
    for (let i = 0; i < l.toString().length; i++) {
      h = h + "0";
    }
    let digit = parseInt(h);
    let Rdigit = digit - l;
    if (Rdigit.toString().length < l.toString().length) {
      let length = l.toString().length - Rdigit.toString().length;
      let b = "";
      for (let j = 0; j < length; j++) {
        b = b + "0";
      }
      let finalDigit = b + Rdigit.toString();
      return parseFloat("0." + finalDigit);
    } else {
      return parseFloat("0." + Rdigit);
    }
  } else {
    return parseFloat("0.00");
  }
};

const getItemstockQtyindexDb = async (id,storeid) => {
  let xid = storeid === null ? 'itemid':'[itemid+storeid]';
  let xvlu = storeid === null ? id:[id,storeid];
  let xid_indexdb  = storeid === null ? 'ItemId':'[ItemId+storeid]';
  let xvlu_indexdb = storeid === null ? id:[id,storeid];

  const items = await db.itemStockIndexdb
    .where(xid_indexdb)
    .equals(xvlu_indexdb)
    .toArray()
    .then()
    .catch((err) => console.log(err));
  if (items.length > 0) {
    const ChkbalanceQty = await db.getItemStock
      .where(xid)
      .equals(xvlu)
      .first()
      .then()
      .catch((err) => console.log(err));
    let inQty = 0;
    let outQty = 0;
    items.map((a) => {
      inQty = inQty + a.qtyIn;
      outQty = outQty + a.qtyOut;
      return a;
    });
    if (ChkbalanceQty) {
      let blQty = ChkbalanceQty.balance + inQty - outQty;
      return parseInt(blQty);
    } else {
      return parseInt(inQty - outQty);
    }
  } else {
   // console.log(xid,"xid");
   // console.log(xvlu,"xvlu");
    const ChkbalanceQty = await db.getItemStock
      .where(xid)
      .equals(xvlu)
      .first()
      .then()
      .catch((err) => console.log(err));
     // console.log(ChkbalanceQty,"ChkbalanceQty")
    if (ChkbalanceQty) {
      return parseInt(ChkbalanceQty.balance);
    } else {
      return 0;
    }
  }
};
const getCustomerdetail = async (id) => {
  const customer = await db.customerMaster
    .where("Id")
    .equals(id)
    .first()
    .then()
    .catch((err) => console.log(err, "customer"));
  return customer;
};
const getItemDetail = async (id) => {
  const items = await db.itemMaster
    .where("Id")
    .equals(id)
    .first()
    .then()
    .catch((err) => console.log(err));
  return items;
};
const getUnitName = async (id) => {
  const x = await db.unitMaster
    .where("Id")
    .equals(id)
    .first()
    .then()
    .catch((err) => console.log(err));
  if (x) {
    return x.UnitName;
  }
};
const itemAltqty = async (id, qty) => {
  const item = await db.itemMaster
    .where("Id")
    .equals(id)
    .first()
    .then()
    .catch((err) => console.log(err));
  if (item) {
    let altqty =
      item.Denominator !== item.Conversion
        ? (qty * item.Denominator) / item.Conversion
        : 0;
    return altqty;
  }
  return 0;
};
const updateStockIndDb = async (obj) => {
  if (obj.length > 0) {
    const newarray = await Promise.all(
      obj.map(async (a) => {
        let formname = await db.formMaster
          .where("formid")
          .equals(a.formId)
          .first()
          .then()
          .catch((err) => console.log(err));
        return {
          stockDate: new Date(),
          transactionTypeId: a.formId,  
          transactionType: formname.caption,  
          transactionId: a.trId,
          ItemId: a.ItemId,
          qtyIn: a.type === "stockG" ? a.Inqty : a.type === "inqty" ? a.qty : 0,
          qtyOut:
            a.type === "stockG" ? a.Outqty : a.type === "outqty" ? a.qty : 0,
          storeid:a.storeid,
          mrp:a.mrp  
        };
      })
    );
    await db.itemStockIndexdb
      .bulkAdd(newarray)
      .then()
      .catch((err) => console.log(err));
  }
  // const nObj = {
  //   formId: pageNav.formid,
  //   trId: getres.id,
  //   ItemId: c.ItemId,
  //   qty: c.ReceiveBaseQty,
  //   type: "inqty",
  // };
};

const updateStockIndDbUpdate = async (obj) => {
  let formId = obj[0].formId;
  let TrId   = obj[0].trId;
  const arr = await db.itemStockIndexdb.get({
    transactionId: TrId,
    transactionTypeId: formId,
  });
  if (arr && arr.length > 0) {
    const narr = arr.map((c) => {
      let item = obj.find((a) => a.ItemId === c.ItemId);
      if (item) {
        return {
          ...c,
          qtyIn:
            item.type === "stockG"
              ? item.Inqty
              : item.type === "inqty"
              ? item.qty
              : 0,
          qtyOut:
            item.type === "stockG"
              ? item.Outqty
              : item.type === "outqty"
              ? item.qty
              : 0,
        };
      } else {
        return c;
      }
    });
    await db.itemStockIndexdb
      .bulkPut(narr)
      .then()
      .catch((err) => console.log(err));
  }
};

const globalsettingValueById = async (id) => {
  let obj = await db.globelsetting
    .where("globsettingid")
    .equals(id)
    .first()
    .then()
    .catch((err) => console.log(err));
    if(obj){
      return obj.value;
    } else {
      // alert("something went wrong globsetting data does not exists")
    }
};

// const apiData= {
//   usa: "english",
//   france: "french",
//   genmany: "german",
//   china: "chinies",
//   india: "hindi",
//   uae: "arabia",
//   Login: "Default Language"
// }

const translateLanguage = async (key) => {
  const apiData = await db.UserPreferedLanguageDictionary.where("id")
    .equals(1)
    .first()
    .then()
    .catch((err) => console.log(err));
  if (apiData) {
    let all_country = Object.keys(apiData);
    const countryFound = all_country.find((element) => element === key);
    if (countryFound) {
      // console.log("languagefound", apiData[key]);
     // return apiData[key];
     return key
    } else {
      // console.log("key", key);
      return key;
    }
  } else {
    return key;
  }
  // console.log(key,"key")
};

// ____________________________________________________________________________________
// P Starts

const getBatchOrSerialNumber = async () => {
  var Bought_Items =  await db.PurchaseInvoiceDetail
    .toArray()
    .then()
    .catch((err) => console.log(err));
    return {
              batchnumber:Bought_Items.map(bi => bi.BatchNumber),
              serialnumber:Bought_Items.map(bi => bi.SerialNumber),
              batchparentlast:Bought_Items && Bought_Items?.reverse()[0] && Bought_Items.reverse()[0].BatchNumber && Bought_Items.reverse()[0].BatchNumber.batchid,
              batchchildlast:Bought_Items && Bought_Items?.reverse()[0] && Bought_Items.reverse()[0].BatchNumber && Bought_Items.reverse()[0].BatchNumber.BatchDetail && Bought_Items.reverse()[0].BatchNumber.BatchDetail.reverse()[0] && Bought_Items.reverse()[0].BatchNumber.BatchDetail.reverse()[0].batchdetailid,
              purchaseinvoicedetail:Bought_Items && Bought_Items.length
           };
}

const matchSerialNumber = async (val) => {
  let sts=false;
  var ArraySerial =  await db.PurchaseInvoiceDetail
    .toArray()
    .then()
    .catch((err) => console.log(err));
    if(ArraySerial.length > 0){
      ArraySerial && ArraySerial.map((a)=>{
        let x = (a.SerialNumber !== '') && a.SerialNumber.filter((b)=> b.serial_number === val);
        if(x.length > 0){
          sts=true;
        }
      })
    }
   return sts
}


const getBatchOrSerialNumberById = async itemID => {
    var Bought_Items =  await db.PurchaseInvoiceDetail.where('ItemId')
      .equals(itemID)
      .toArray()
      .then()
      .catch((err) => console.log(err));
      
      return {
          batchnumber:Bought_Items && Bought_Items.map(bi => bi.BatchNumber),
          serialnumber:Bought_Items && Bought_Items.map(bi => bi.SerialNumber),
          item: Bought_Items && Bought_Items.map(bi => bi)
      }
}  


const getBatchOrSerialNumberByIdOLD = (async itemID => {
  var Bought_Items =  await db.PurchaseInvoiceDetail.where('ItemId')
    .equals(itemID)
    .toArray()
    .then()
    .catch((err) => console.log(err));

    // var ll = [];
    // Bought_Items.map(bi => {
    //   bi.SerialNumber.map(kk  => {
    //     kk.map(cc => {
    //       ll.push(cc);
    //     })
    //   })
    // })

    // console.log(ll,' in common fun')
    // snoi.map(kk  => {
    //   kk.map(cc => {
    //     ll.push(cc);
    //   })
    // })
    
    // console.log(Bought_Items,'Bought_Items')
    // return () => {         
                 // batchnumber:Bought_Items.map(bi => bi.BatchNumber && bi.BatchNumber.push({'qty':bi.Quantity})),
                 return {
                      batchnumber:Bought_Items.map(bi => bi.BatchNumber),
                      serialnumber:Bought_Items.map(bi => bi.SerialNumber) 
                      // serialnumber: ll
                  }
      // }     
  })
  

  // P Created this
  const getLastId =  async (T,I) => {
        return await db[T].reverse().limit(1).toArray()
            .then(res => res[0][I])
            .catch((err) => console.log(err));
  }
// P Ends

  const  l = o => Object.keys(o).length > 0 ? true : false;
  




export {
  getPercentCalc,
  getPercent, 
  getGrossAmount,
  formatDate,
  getVoucherIds,
  getSeries,
  getseriesNo,
  updateStockIndDb,
  updateStockIndDbUpdate,
  Post,
  Put,
  fnCRoundOff,
  getItemstockQtyindexDb,
  getCustomerdetail,
  getItemDetail,
  getUnitName,
  itemAltqty,
  globalsettingValueById,
  translateLanguage,

  getBatchOrSerialNumber,     //P
  getBatchOrSerialNumberById,  //P
  matchSerialNumber, // P
  l, // p
  // LID //p
  getLastId
};
