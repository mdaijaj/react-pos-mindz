import Dexie from "dexie";
import schema from "./constant";
// import axios from "axios";
// import { ItemMaster_obj } from "../component/masters/itemMaster/store";
// npm i dotenv
// npm install dotenv --save
require("dotenv").config();

var db = new Dexie("posdb");

db.version(1).stores({
  ...schema,
});

db.open()
  .then((res) => console.log("hey creating posdbs", res))
  .catch((error) => console.log("error on creating posdb", error));
export default db;

// For deleting dbs
export const del = () => {
  db.delete()
    .then(() => {
      console.log("Database successfully deleted");
      return true;
    })
    .catch((err) => {
      console.error("Could not delete database");
      return false;
    });
};

export const getdbcreated = () => {
  const sts = new Dexie("posdb")
    .open()
    .then(function (db) {
      return true;
    })
    .catch((err) => console.log(err));
  return sts;
};
// For creating dbs
// export const createDBS = async () => {
//   try {
//     db = new Dexie("posdb");
//     db.version(1).stores({
//       ...schema,
//     });
//     let res = await db.open();
//     console.log("hey creating posdbs in createDBS", res);
//     return true;
//   } catch (err) {
//     console.log("error on creating posdb in createDBS", err);
//     return false;
//   }
// };

// export const syncItemMaster = async (obj) => {
//   try {
//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/ItemMaster/List/";
//     axios.post(api,obj, config).then(async (res) => {
//       console.log(res,"resresresresresresresres")
//       const dbdata = await db.itemMaster.toArray().then().catch((err)=>console.log(err));
//       let data =
//         res.data &&
//         res.data.Result &&
//         res.data.Result.map((val) => {
//           const put_data = {
//             ...ItemMaster_obj,
//             Id: val.Id,
//             ItemId: val.Id,
//             ItemCode: val.ItemCode,
//             ItemName: val.ItemName,
//             PrintName: val.PrintName,
//             GroupId: val.GroupId,
//             UnitName: val.UnitId,
//             UnitAltName: val.AltUnitId === -1 ? val.UnitId : val.AltUnitId,
//             Conversion: val.Conversion,
//             Denominator: val.Denominator,
//             IsLot: val.IsLotEnable,
//             IsActive: val.IsActive,
//             IsTaxInclusive: val.IsTaxInclusive,
//             CreatedBy: val.CreatedBy,
//             CreatedOn: val.CreatedOn,
//             EditLog: val.EditLog,
//             alteredon:val.alteredon,
//           };

//           let gst_data = val.HSNMapping.map((value) => ({
//             ItemId: value.ItemId,
//             HsnId: value.HsnId,
//             ApplicableDate: value.ApplicableOn,
//             CreatedBy: value.CreatedBy,
//             CreatedOn: value.CreatedOn,
//             EditLog: "",
//           }));

//           put_data.GSTClassification = [...gst_data];

//           return put_data;
//         });

//        console.log(dbdata,"itemmaster")
//        console.log(data,"itemmasterdata")
//        if(dbdata){
//         if(data && data.length !== dbdata.length){
//           await db.itemMaster.bulkPut(data);
//           console.log("data insert")
//          }
//        }else{
//         await db.itemMaster.bulkPut(data);
//        }

//     });
//   } catch (error) {
//     console.log(error, "syncItemMaster");
//   }
// };

// export const syncCustomerMaster = async (obj) => {
//   try {
//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/LedgerMaster/List/1/";
//     axios.post(api,obj, config).then(async (res) => {
//       const dbdata =await db.customerMaster.where("LedgerType").equals(1).toArray().then().catch((err)=>console.log(err))
//       if (res && res.data && res.data.result && res.data.result.Result) {
//         const data = res.data.result.Result.map((item) => {
//           let datain = {
//             Id: item.Id,
//             new: 0,
//             update: 0,
//             PartyCode: item.LedgerCode,
//             PartyName: item.LedgerName,
//             CompanyCode: "",
//             GroupId: "",
//             Address: item.Address,
//             Address2: "",
//             CityId: "",
//             Pincoce: item.Pincode,
//             Phone1: item.Phone1,
//             Phone2: item.Phone2,
//             Fax: "",
//             Email: item.Email,
//             ContactPerson: "",
//             SalesPersonName: "",
//             CstNo: "",
//             CstDate: "",
//             LstNo: "",
//             LstDate: "",
//             TinNo: "",
//             TinDate: "",
//             PAN: "",
//             GSTNo: "",
//             BillAddress: "",
//             LedgerType: item.LedgerType,
//           };
//           return datain;
//         });
//         if(dbdata){
//           if(data.length > dbdata.length){
//             await db.customerMaster.bulkPut(data);
//             console.log("insert customer data 1")
//           }
//         }else{
//           await db.customerMaster.bulkPut(data);
//         }

//       }

//       // db.customerMaster.bulkPut(res.data.result.Result);
//     });
//   } catch (error) {
//     console.log(error, "syncCustomerMaster");
//   }
// };

// export const syncVendorMaster = async (obj) => {
//   try {
//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/LedgerMaster/List/2/";
//     axios.post(api,obj, config).then(async (res) => {
//       const dbdata = db.customerMaster.where("LedgerType").equals(2).toArray().then().catch((err)=>console.log(err))
//       if (res.data && res.data.result && res.data.result.Result) {
//         const data = res.data.result.Result.map((item) => {
//           let datain = {
//             Id: item.Id,
//             new: 0,
//             update: 0,
//             PartyCode: item.LedgerCode,
//             PartyName: item.LedgerName,
//             CompanyCode: "",
//             GroupId: "",
//             Address: item.Address,
//             Address2: "",
//             CityId: "",
//             Pincoce: item.Pincode,
//             Phone1: item.Phone1,
//             Phone2: item.Phone2,
//             Fax: "",
//             Email: item.Email,
//             ContactPerson: "",
//             SalesPersonName: "",
//             CstNo: "",
//             CstDate: "",
//             LstNo: "",
//             LstDate: "",
//             TinNo: "",
//             TinDate: "",
//             PAN: "",
//             GSTNo: "",
//             BillAddress: "",
//             LedgerType: item.LedgerType,
//           };
//           return datain;
//         });
//         console.log(data,"cus2")
//        if(dbdata){
//         if(data && data.length > dbdata.length){
//           await db.customerMaster.bulkPut(data);
//           console.log("insert customer data 2")
//         }
//        }else{
//         await db.customerMaster.bulkPut(data);
//        }

//         // await db.customerMaster.bulkPut(data);
//       }
//     });
//   } catch (error) {
//     console.log(error, "syncVendorMaster");
//   }
// };

// export const syncHsnMaster = async() => {
//   try {
//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/HsnMaster/List/0";
//     axios.get(api, config).then(async(res) => {
//       const dbdata = await db.hsnMaster.toArray().then().catch((err)=>console.log(err))
//       if(dbdata){
//         if( res.data &&
//           res.data.result &&
//           res.data.result.Result && res.data.result.Result.length > dbdata.length){
//            await db.hsnMaster.bulkPut(res.data.result.Result);
//           }
//       }else{
//         await db.hsnMaster.bulkPut(res.data.result.Result);
//       }

//     });
//   } catch (error) {
//     console.log(error, "syncHsnMaster");
//   }
// };

// export const syncItemGroup = async (obj) => {
//   try {

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/ItemGroup/List/0";
//     axios.post(api,obj, config).then(async (res) => {
//       const dbdata = await db.itemGroup.toArray().then().catch((err)=>console.log(err))
//       let dataResult = res.data && res.data.result && res.data.result.Result
//       if(dbdata){
//         if(dataResult.length > dbdata.length){
//             await db.itemGroup.bulkPut(res.data.result.Result)
//             // console.log("0 update itemgroup")
//           }
//         }else{
//           await db.itemGroup.bulkPut(res.data.result.Result)
//         }
//     });
//   } catch (error) {
//     console.log(error, "syncItemGroup");
//   }
// };

// export const syncUnitMaster = async () => {
//   try {

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/UnitMaster/List/0";
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.unitMaster.toArray().then().catch((err)=>console.log(err))
//       if(dbdata){
//         if( res.data &&
//           res.data.Result &&
//           res.data.Result.length > dbdata.length){
//             await db.unitMaster.bulkPut(res.data.Result)
//           }
//       }else{
//         await db.unitMaster.bulkPut(res.data.Result)
//       }

//       // res.data &&
//       //   res.data.Result &&
//       //   (await db.unitMaster.bulkPut(res.data.Result));
//     });
//   } catch (error) {
//     console.log(error, "syncUnitMaster");
//   }
// };

export const syncattributeMaster = async () => {
  try {
    // const config = { headers: { token: localStorage.getItem("token") } };
    // let api = "/api/AttributeMaster/List/0";

    // axios.get(api, config).then((res) => {
    //   res.data &&
    //     res.data.result &&
    //     res.data.result.Result &&
    //     db.attributeMaster.bulkPut(res.data.result.Result);
    // });
    let db = new Dexie("posdb");
    db.version(1).stores({
      attributeMaster: schema.attributeMaster,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
    const Data = [
      {
        id: 1,
        AttributeName: "12334",
        IsActive: true,
        CreatedByName: "creditdon",
        CreatedBy: "02/18/2021",
        Value: "cskhd287612",
      },
      {
        id: 2,
        AttributeName: "12334",
        IsActive: true,
        CreatedByName: "creditdon",
        CreatedBy: "02/18/2021",
        Value: "cskhd287612",
      },
    ];

    await db.attributeMaster.bulkPut(Data);
    
  } catch (error) {
    console.log(error, "syncattributeMaster");
  }
};

export const syncattributeMasterDetails = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      attributeMasterDetails: schema.attributeMasterDetails,
    });

    const data = [
      {
        AttributeId: 1,
        SizeCode: "size-01",
        Code: "105cm",
        PrintName: "",
        IsActive: true,
      },
      {
        AttributeId: 1,
        SizeCode: "size-01",
        Code: "105cm",
        PrintName: "",
        IsActive: true,
      },
      {
        AttributeId: 1,
        SizeCode: "size-01",
        Code: "105cm",
        PrintName: "",
        IsActive: true,
      },
      {
        AttributeId: 2,
        SizeCode: "size-01",
        Code: "105cm",
        PrintName: "",
        IsActive: true,
      },
      {
        AttributeId: 2,
        SizeCode: "size-01",
        Code: "105cm",
        PrintName: "",
        IsActive: true,
      },
    ];

    await db.attributeMasterDetails.bulkPut(data);
  } catch (error) {
    console.log(error, "syncattributeMasterDetails");
  }
};

// export const syncCityMaster = async () => {
//   try {

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/CityMaster/List/0";
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.cityMaster.toArray().then().catch((err)=>console.log(err))
//       if(dbdata){
//         if( res.data &&
//           res.data.result &&
//           res.data.result.Result && res.data.result.Result.length > dbdata.length){
//             await db.cityMaster.bulkPut(res.data.result.Result)
//           }
//       }else {
//         await db.cityMaster.bulkPut(res.data.result.Result)
//       }
//     });
//   } catch (error) {
//     console.log(error, "syncCityMaster");
//   }
// };

// export const syncledgerGroupMaster = async () => {
//   try {

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/LedgerGroupMaster/List/0";
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.ledgerGroupMaster.toArray().then().catch((err)=>console.log(err))
//       if(dbdata){
//         if(res.data &&
//           res.data.result &&
//           res.data.result.Result &&
//           res.data.result.Result.length > dbdata && dbdata.length){
//             await db.ledgerGroupMaster.bulkPut(res.data.result.Result)
//           }

//       }else{
//         await db.ledgerGroupMaster.bulkPut(res.data.result.Result)
//       }

//       // res.data &&
//       //   res.data.result &&
//       //   res.data.result.Result &&
//       //   (await db.ledgerGroupMaster.bulkPut(res.data.result.Result));
//     });
//   } catch (error) {
//     console.log(error, "syncledgerGroupMaster");
//   }
// };

// export const syncStateMaster = async () => {
//   try {

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/StateMaster/List/0";
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.stateMaster.toArray().then().catch((err)=>console.log(err))
//       if(dbdata){
//         if( res.data &&
//           res.data.result &&
//           res.data.result.Result && res.data.result.Result.length > dbdata.length){
//             await db.stateMaster.bulkPut(res.data.result.Result)
//           }
//       }else{
//         await db.stateMaster.bulkPut(res.data.result.Result)
//       }

//       // res.data &&
//       //   res.data.result &&
//       //   res.data.result.Result &&
//       //   (await db.stateMaster.bulkPut(res.data.result.Result));
//     });
//   } catch (error) {
//     console.log(error, "syncStateMaster");
//   }
// };

// export const syncPriceMaster = async () => {
//   try {

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/PriceListDiscount/List/0";
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.priceMaster.toArray().then().catch((err)=>console.log(err))
//       if(dbdata){
//         if( res.data &&
//           res.data.result &&
//           res.data.result.Result && res.data.result.Result.length > dbdata.length){
//             await db.priceMaster.bulkPut(res.data.result.Result)
//           }
//       }else{
//         await db.priceMaster.bulkPut(res.data.result.Result)
//       }

//       // res.data &&
//       //   res.data.result &&
//       //   res.data.result.Result &&
//       //   (await db.priceMaster.bulkPut(res.data.result.Result));
//     });
//   } catch (error) {
//     console.log(error, "syncPriceMaster");
//   }
// };

//gstclassification Map
export const syncGstClassificationMapMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      gstClassificationMap: schema.gstClassificationMap,
    });
    // const config = { headers: { token: localStorage.getItem("token") } };

    //HsnId:ExciseClassificationId
    const gstData = [
      {
        Id: 1,
        ItemId: 2,
        HsnId: 1,
        ApplicableDate: getFormateDate(),
        CreatedBy: null,
        CreatedOn: null,
        EditLog: null,
      },
      {
        Id: 2,
        ItemId: 3,
        HsnId: 2,
        ApplicableDate: getFormateDate(),
        CreatedBy: null,
        CreatedOn: null,
        EditLog: null,
      },
      {
        Id: 2,
        ItemId: 4,
        HsnId: 3,
        ApplicableDate: getFormateDate(),
        CreatedBy: null,
        CreatedOn: null,
        EditLog: null,
      },
      {
        Id: 3,
        ItemId: 5,
        HsnId: 4,
        ApplicableDate: getFormateDate(),
        CreatedBy: null,
        CreatedOn: null,
        EditLog: null,
      },
      {
        Id: 4,
        ItemId: 566,
        HsnId: 5,
        ApplicableDate: getFormateDate(),
        CreatedBy: null,
        CreatedOn: null,
        EditLog: null,
      },
      {
        Id: 5,
        ItemId: 349,
        HsnId: 6,
        ApplicableDate: getFormateDate(),
        CreatedBy: null,
        CreatedOn: null,
        EditLog: null,
      },
    ];

    await db.gstClassificationMap.bulkPut(gstData);
  } catch (error) {
    console.log(error, "syncGstClassificationMapMaster");
  }
};

const getFormateDate = () => {
  let dateTemp = "";
  let month = "";
  let day = "";
  try {
    dateTemp = new Date();
    month = ("0" + (dateTemp.getMonth() + 1)).slice(-2);
    day = ("0" + dateTemp.getDate()).slice(-2);
    dateTemp = [day, month, dateTemp.getFullYear()].join("-");
  } catch (error) {}
  return dateTemp;
};
//GSTCLASSIFICATION MASTER

export const syncGstClassificationMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      gstClassificationMaster: schema.gstClassificationMaster,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
    const gstData = [
      {
        Id: 1,
        HsnName: "Sports Goods String",
        HsnCode: null,
        UsedFor: 4,
        GstCalculation: 1,
        TaxableType: 4,
        ApplicableDate: "23-Jan-2021",
      },
      {
        Id: 2,
        HsnName: "Sports Goods String",
        HsnCode: null,
        UsedFor: 4,
        GstCalculation: 1,
        TaxableType: 4,
        ApplicableDate: "24-Jan-2021",
      },
      {
        Id: 3,
        HsnName: "Sports Goods String",
        HsnCode: null,
        UsedFor: 4,
        GstCalculation: 1,
        TaxableType: 4,
        ApplicableDate: "25-Jan-2021",
      },
      {
        Id: 4,
        HsnName: "Sports Goods String",
        HsnCode: null,
        UsedFor: 4,
        GstCalculation: 1,
        TaxableType: 4,
        ApplicableDate: "26-Jan-2021",
      },
      {
        Id: 5,
        HsnName: "Sports Goods String",
        HsnCode: null,
        UsedFor: 4,
        GstCalculation: 1,
        TaxableType: 4,
        ApplicableDate: "27-Jan-2021",
      },
      {
        Id: 6,
        HsnName: "Sports Goods String",
        HsnCode: null,
        UsedFor: 4,
        GstCalculation: 1,
        TaxableType: 4,
        ApplicableDate: "28-Jan-2021",
      },
    ];

    await db.gstClassificationMaster.bulkPut(gstData);
  } catch (error) {
    console.log(error, "syncGstClassificationMaster");
  }
};

//IGST MASTER
export const syncIgstMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      igstMaster: schema.igstMaster,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
    const gstData = [
      {
        Id: 1,
        ExciseClassificationId: 1,
        ApplicableDate: "23-Jan-2021",
        Rate: 12.0,
      },
      {
        Id: 2,
        ExciseClassificationId: 2,
        ApplicableDate: "24-Jan-2021",
        Rate: 12.0,
      },
      {
        Id: 3,
        ExciseClassificationId: 3,
        ApplicableDate: "24-Jan-2021",
        Rate: 12.0,
      },
      {
        Id: 4,
        ExciseClassificationId: 4,
        ApplicableDate: "25-Jan-2021",
        Rate: 12.0,
      },
      {
        Id: 5,
        ExciseClassificationId: 5,
        ApplicableDate: "26-Jan-2021",
        Rate: 12.0,
      },
      {
        Id: 6,
        ExciseClassificationId: 6,
        ApplicableDate: "27-Jan-2021",
        Rate: 12.0,
      },
    ];

    await db.igstMaster.bulkPut(gstData);
  } catch (error) {
    console.log(error, "syncIgstMaster");
  }
};

//CgstMaster
export const syncCgstMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      cgstMaster: schema.cgstMaster,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
    const gstData = [
      {
        Id: 1,
        ExciseClassificationId: 1,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 2,
        ExciseClassificationId: 2,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 3,
        ExciseClassificationId: 3,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 4,
        ExciseClassificationId: 4,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 5,
        ExciseClassificationId: 5,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 6,
        ExciseClassificationId: 6,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
    ];

    await db.cgstMaster.bulkPut(gstData);
  } catch (error) {
    console.log(error, "syncCgstMaster");
  }
};

//Sgst Master
export const syncSgstMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      sgstMaster: schema.sgstMaster,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
    const gstData = [
      {
        Id: 1,
        ExciseClassificationId: 1,
        CessRate: 0.0,
        SgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 2,
        ExciseClassificationId: 2,
        CessRate: 0.0,
        SgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 3,
        ExciseClassificationId: 3,
        CessRate: 0.0,
        SgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 4,
        ExciseClassificationId: 4,
        CessRate: 0.0,
        CgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 5,
        ExciseClassificationId: 5,
        CessRate: 0.0,
        SgstRate: 6.0,
        StateId: 12,
      },
      {
        Id: 6,
        ExciseClassificationId: 6,
        CessRate: 0.0,
        SgstRate: 6.0,
        StateId: 12,
      },
    ];

    await db.sgstMaster.bulkPut(gstData);
  } catch (error) {
    console.log(error, "syncSgstMaster");
  }
};

//stock

// export const syncStockLotMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       stockLotMaster: schema.stockLotMaster,
//     });

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/GetItemStock/0";
//     let result = [];
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.stockLotMaster.toArray().then().catch((err)=>console.log(err))
//       //console.log(res.data.result.Result);
//       if (res && res.data && res.data.result && res.data.result.Result) {
//         result = res.data.result.Result.map((item) => {
//           return {
//             SerialId: 1,
//             TransactionId: 1,
//             TransactionType: "IN",
//             TransactionDate: "23-Jan-2021",
//             TransactionNo: 1,
//             ItemId: item.itemid,
//             QtyIn: item.inqty,
//             QtyOut: item.qtyout,
//             LotNo: item.lotno,
//             BatchNo: item.batchno,
//             MfgDate: item.mfgdate,
//             ExpDate: item.expdate,
//             Balance: item.balance,
//             Mrp: item.mrp,
//             IsAltRate: 1,
//             AltQtyOut: 0,
//             AltQtyIn: 0,
//           };
//         });
//         // const stockData = [
//         //   {
//         //     SerialId: 1,
//         //     TransactionId: 1,
//         //     TransactionType: "IN",
//         //     TransactionDate: "23-Jan-2021",
//         //     TransactionNo: 1,
//         //     ItemId: 2,
//         //     QtyIn: 2.0,
//         //     QtyOut: 0.0,
//         //     LotNo: "PRIMARY",
//         //     BatchNo: null,
//         //     MfgDate: null,
//         //     ExpDate: null,
//         //     Mrp: 1900.0,
//         //     IsAltRate: 1,
//         //     AltQtyOut: 0,
//         //     AltQtyIn: 0,
//         //   },
//         //   {
//         //     SerialId: 2,
//         //     TransactionId: 2,
//         //     TransactionType: "IN",
//         //     TransactionDate: "23-Jan-2021",
//         //     TransactionNo: 1,
//         //     ItemId: 3,
//         //     QtyIn: 2.0,
//         //     QtyOut: 0.0,
//         //     LotNo: "PRIMARY",
//         //     BatchNo: null,
//         //     MfgDate: null,
//         //     ExpDate: null,
//         //     Mrp: 1900.0,
//         //     IsAltRate: 1,
//         //     AltQtyOut: 0,
//         //     AltQtyIn: 0,
//         //   },
//         //   {
//         //     SerialId: 3,
//         //     TransactionId: 3,
//         //     TransactionType: "IN",
//         //     TransactionDate: "23-Jan-2021",
//         //     TransactionNo: 1,
//         //     ItemId: 4,
//         //     QtyIn: 2.0,
//         //     QtyOut: 0.0,
//         //     LotNo: "PRIMARY",
//         //     BatchNo: null,
//         //     MfgDate: null,
//         //     ExpDate: null,
//         //     Mrp: 1900.0,
//         //     IsAltRate: 1,
//         //     AltQtyOut: 0,
//         //     AltQtyIn: 0,
//         //   },
//         //   {
//         //     SerialId: 4,
//         //     TransactionId: 4,
//         //     TransactionType: "IN",
//         //     TransactionDate: "23-Jan-2021",
//         //     TransactionNo: 1,
//         //     ItemId: 5,
//         //     QtyIn: 2.0,
//         //     QtyOut: 0.0,
//         //     LotNo: "PRIMARY",
//         //     BatchNo: null,
//         //     MfgDate: null,
//         //     ExpDate: null,
//         //     Mrp: 1900.0,
//         //     IsAltRate: 1,
//         //     AltQtyOut: 0,
//         //     AltQtyIn: 0,
//         //   },
//         // ];
//         if(dbdata){
//           if (result && result.length > dbdata.length) {
//             await db.stockLotMaster.bulkPut(result);
//           }
//         }else{
//           await db.stockLotMaster.bulkPut(result);
//         }

//         // } else {
//         //   await db.stockLotMaster.bulkPut(stockData);
//         // }
//       }
//     });
//   } catch (error) {
//     console.log(error, "syncStockLotMaster");
//   }
// };

// export const syncCreditNoteMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       CreditNoteMaster: schema.CreditNoteMaster,
//     });
//     const dbdata = await db.CreditNoteMaster.toArray().then().catch((err)=>console.log(err))
//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/PurchaseInvoice/CN/List/0";
//     let result = [];
//     axios.get(api, config).then(async (res) => {
//       console.log(res,"creditnotemaster")
//       console.log(dbdata,"dbdata creditnotemaster")
//       if (res.data && res.data.result && res.data.result.Result) {
//         result = res.data.result.Result.map((item) => {
//           return {
//             Id: item.Id,
//             InvoiceDate: item.InvoiceDate,
//             PartyName: item.PartyName,
//             InvoiceNo: item.InvoiceNo,
//             PartyId: item.PartyId,
//             GrossAmount: item.grossamount,
//             Remarks: item.Remarks,
//             SeriesId: item.seriesid,
//             ShippingGstNo: item.shippinggstinno,
//             Remark: item.remark,
//             SeriesVoucherType: item.seriesvouchertype,
//             CreatedById: item.CreatedBy,
//             CreatedBy: item.CreatedByName,
//             CreatedOn: item.CreatedOn,
//             EditLog: item.EditLog,
//             ReferenceType: item.referencetype,
//             ReferenceId: item.referenceid,
//             DncnAgaintPi: item.dncn_against_pi,
//             ShippingAddress: item.shippingaddress,
//             ShippingStateId: item.shippingstateid,
//             ShippingCountryId: item.shippingcountryid,
//             BillingAddress: item.billingaddress,
//             BillingGstNo: item.billinggstinno,
//             BillingStateId: item.billingstateid,
//             BillingCountryId: item.billingcountryid,
//             NetAmount: item.netamount,
//             TaxAmount: item.taxamount,
//             DiscountAmount: item.discountamount,
//             InvoiceType: item.invoicetype,
//           };
//         });
//         if(dbdata){
//           if (result.length > dbdata.length) {
//             await db.CreditNoteMaster.bulkPut(result);
//           }
//         }else{
//           await db.CreditNoteMaster.bulkPut(result);
//         }

//       }
//     });
//   } catch (error) {
//     console.log(error, "syncCreditNoteMaster");
//   }
// };

// export const syncDebitNoteMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       DebitNoteMaster: schema.DebitNoteMaster,
//     });

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/PurchaseInvoice/DN/List/0";
//     let result = [];
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.DebitNoteMaster.toArray().then().catch((err)=>console.log(err))
//       if (res.data && res.data.result && res.data.result.Result) {
//         result = res.data.result.Result.map((item) => {
//           return {
//             Id: item.Id,
//             InvoiceDate: item.InvoiceDate,
//             PartyName: item.PartyName,
//             InvoiceNo: item.InvoiceNo,
//             PartyId: item.PartyId,
//             GrossAmount: item.grossamount,
//             Remarks: item.Remarks,
//             SeriesId: item.seriesid,
//             ShippingGstNo: item.shippinggstinno,
//             Remark: item.remark,
//             SeriesVoucherType: item.seriesvouchertype,
//             CreatedById: item.CreatedBy,
//             CreatedBy: item.CreatedByName,
//             CreatedOn: item.CreatedOn,
//             EditLog: item.EditLog,
//             ReferenceType: item.referencetype,
//             ReferenceId: item.referenceid,
//             DncnAgaintPi: item.dncn_against_pi,
//             ShippingAddress: item.shippingaddress,
//             ShippingStateId: item.shippingstateid,
//             ShippingCountryId: item.shippingcountryid,
//             BillingAddress: item.billingaddress,
//             BillingGstNo: item.billinggstinno,
//             BillingStateId: item.billingstateid,
//             BillingCountryId: item.billingcountryid,
//             NetAmount: item.netamount,
//             TaxAmount: item.taxamount,
//             DiscountAmount: item.discountamount,
//             InvoiceType: item.invoicetype,
//           };
//         });
//           if(dbdata){
//             if (result.length > dbdata.length) {
//               await db.DebitNoteMaster.bulkPut(result);
//             }
//           }else{
//             await db.DebitNoteMaster.bulkPut(result);
//           }

//       }
//     });
//   } catch (error) {
//     console.log(error, "syncDebitNoteMaster");
//   }
// };
// export const syncCreditNoteMasterDetail = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       CreditNoteMasterDetail: schema.CreditNoteMasterDetail,
//     });

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/PurchaseInvoice/CN/List/0";
//     let items = [];
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.CreditNoteMasterDetail.toArray().then().catch((err)=>console.log(err))
//       if (res.data && res.data.result && res.data.result.Result) {
//         const data = res.data.result.Result;
//         for (var i = 0; i < data.length; i++) {
//           items.push(data[i].PIDetail);
//         }
//         var ItemList = [].concat.apply([], items);
//         if(dbdata){
//           if(ItemList.length > dbdata.length){
//             await db.CreditNoteMasterDetail.bulkPut(ItemList);
//            }
//         }else{
//           await db.CreditNoteMasterDetail.bulkPut(ItemList);
//         }

//       }
//     });
//   } catch (error) {
//     console.log(error, "syncCreditNoteMasterDetail");
//   }
// };
// export const syncDebitNoteMasterDetail = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       DebitNoteMasterDetail: schema.DebitNoteMasterDetail,
//     });

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/PurchaseInvoice/DN/List/0";
//     let items = [];
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.DebitNoteMasterDetail.toArray().then().catch((err)=>console.log(err))
//       if (res.data && res.data.result && res.data.result.Result) {
//         const data = res.data.result.Result;
//         for (var i = 0; i < data.length; i++) {
//           items.push(data[i].PIDetail);
//         }
//         var ItemList = [].concat.apply([], items);
//         if(dbdata){
//           if(ItemList.length > dbdata.length){
//             await db.DebitNoteMasterDetail.bulkPut(ItemList);
//            }
//         }else{
//           await db.DebitNoteMasterDetail.bulkPut(ItemList);
//         }

//       }
//     });
//   } catch (error) {
//     console.log(error, "syncDebitNoteMasterDetail");
//   }
// };
export const syncPurchaseReturn = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      PR_Master: schema.PR_Master,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
  } catch (error) {
    console.log(error, "syncPurchaseReturn");
  }
};

export const syncPurchaseReturnDetail = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      PR_Detail: schema.PR_Detail,
    });
  } catch (error) {
    console.log(error, "syncPurchaseReturnDetail");
  }
};

// export const syncGITMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       GITMaster: schema.GITMaster,
//     });

//     const config = { headers: { token: localStorage.getItem("token") } };
//     let api = "/api/GetGIT/0";
//     let result = [];
//     axios.get(api, config).then(async (res) => {
//       const dbdata = await db.GITMaster.toArray().then().catch((err)=>console.log(err));
//      // console.log(dbdata,"dbdata git")
//      // console.log(res,"res git")
//       if (res.data && res.data.result && res.data.result.Result) {
//         result = res.data.result.Result.map((item) => {
//           return {
//             Id: item.gitid,
//             gitid: item.gitid,
//             partyid_ho: item.partyid_ho,
//             partyid_pos: item.partyid_pos,
//             partyname: item.partyname,
//             invoiceno_ho: item.invoiceno_ho,
//             invoicedate_ho: item.invoicedate_ho,
//             invoiceid_ho: item.invoiceid_ho,
//             grandtotal: item.grandtotal,
//             git_no: item.git_no,
//             git_date: item.git_date,
//             alterid: item.alterid,
//             editlog: item.editlog,
//             authorizedby: item.authorizedby,
//             authorizedon: item.authorizedon,
//             headauthorizedby: item.headauthorizedby,
//             headauthorizedon: item.headauthorizedon,
//             cancelledby: item.cancelledby,
//             tally_log: item.tally_log,
//             tallyreferenceno: item.tallyreferenceno,
//             tallysyncdate: item.tallysyncdate,
//             remarks: item.remarks,
//             createdby: item.createdby,
//             createdon: item.createdon,
//             reference_no: item.reference_no,
//             reference_date: item.reference_date,
//             isautoentry: item.isautoentry,
//             invoiceno_erp: item.invoiceno_erp,
//             invoicedate_erp: item.invoicedate_erp,
//             gitdetail: item.gitdetail,
//             // gitid: item.gitid,
//             // partyid: item.partyid,
//             // partyname: item.partyname,
//             // inwardno: item.invoiceno_ho,
//             // gitno: item.git_no,
//             // inwarddate: item.invoicedate_ho,
//             // gitdetails: item.gitdetail,
//             // netamount: item.grandtotal,
//           };
//         });
//         if(dbdata){
//           if(result.length > dbdata.length){
//             await db.GITMaster.bulkPut(result);
//           }
//         }else{
//           await db.GITMaster.bulkPut(result);
//         }

//       }
//     });
//   } catch (error) {
//     console.log(error, "syncGITMaster");
//   }
// };
export const syncIC_Master = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      IC_Master: schema.IC_Master,
    });
  } catch (err) {
    console.log(err, "syncIC_Master");
  }
};

export const syncIC_Detail = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      IC_Detail: schema.IC_Detail,
    });
  } catch (err) {
    console.log(err, "syncIC_Detail");
  }
};

export const AdjustmentMaster = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      AdjustmentMaster: schema.AdjustmentMaster,
    });
  } catch (err) {
    console.log(err, "AdjustmentMaster");
  }
};

export const AdjustmentDetail = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      AdjustmentDetail: schema.AdjustmentDetail,
    });
  } catch (err) {
    console.log(err, "AdjustmentDetail");
  }
};
export const AdvanceAdjustment = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      advanceAdjustment: schema.advanceAdjustment,
    });
  } catch (err) {
    console.log(err, "AdvanceAdjustment");
  }
};
export const CreditNoteRefund = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      creditNoteRefund: schema.creditNoteRefund,
    });
  } catch (err) {
    console.log(err, "CreditNoteRefund");
  }
};
// export const syncSaleOrder = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       SaleOrder: schema.SaleOrder,
//     });
//     // const config = { headers: { token: localStorage.getItem("token") } };
//     // let api = "/api/GetGIT/0";
//     // let result = [];
//     // axios.get(api, config).then((res) => {
//     //  if (res.data && res.data.result && res.data.result.Result) {
//     //    result = res.data.result.Result.map((item) => {
//     //      return {
//     //       gitid: item.gitid,
//     //        partyid: item.partyid,
//     //        partyname: item.partyname,
//     //        inwardno: item.invoiceno_ho,
//     //       gitno: item.git_no,
//     //       inwarddate: item.invoicedate_ho,
//     //        gitdetails: item.gitdetail,
//     //       netamount: item.grandtotal,
//     //      };
//     //     });
//     //    db.InwardMaster.bulkPut(result);
//     ///  }
//     // });    "++Id ,SoNumber, SoDate ,PartyId ,PartyName ,CreatedBy ,CreatedByName ,CreatedOn, EditLog ,IsClosed,
//     // Remarks, OrderedBy, SeriesId, SeriesNo, SeriesCode, SeriesVoucherType, TotalIGST, TotalCGST, TotalSGST",
//     const data = [
//       {
//         SoNumber: "1",
//         InvoiceNo: 1,
//         SoDate: "02/12/2021",
//         PartyCode: "1234",
//         PartyId: "1",
//         PartyName: "Deepak",
//         CreatedBy: "deepak",
//         CreatedByName: "",
//         CreatedOn: "",
//         EditLog: "",
//         IsClosed: "",
//         Remarks: "it worked",
//         OrderedBy: "me",
//         SeriesId: "9211",
//         SeriesNo: "9211",
//         SeriesCode: "",
//         SeriesVoucherType: "",
//       },

//       {
//         SoNumber: "2",
//         InvoiceNo: 2,
//         SoDate: "02/12/2021",
//         PartyCode: "1234",
//         PartyId: "1",
//         PartyName: "Deepak",
//         CreatedBy: "deepak",
//         CreatedByName: "",
//         CreatedOn: "",
//         EditLog: "",
//         IsClosed: "",
//         Remarks: "it worked",
//         OrderedBy: "me",
//         SeriesId: "9211",
//         SeriesNo: "9211",
//         SeriesCode: "",
//         SeriesVoucherType: "",
//       },
//       {
//         SoNumber: "3",
//         InvoiceNo: 3,
//         SoDate: "02/12/2021",
//         PartyCode: "1234",
//         PartyId: "1",
//         PartyName: "Deepak",
//         CreatedBy: "deepak",
//         CreatedByName: "",
//         CreatedOn: "",
//         EditLog: "",
//         IsClosed: "",
//         Remarks: "it worked",
//         OrderedBy: "me",
//         SeriesId: "9211",
//         SeriesNo: "9211",
//         SeriesCode: "",
//         SeriesVoucherType: "",
//       },
//     ];
//     await db.SaleOrder.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncSaleOrder");
//   }
// };

// export const syncSaleDetail = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       saleDetail: schema.saleDetail,
//     });
//     // const config = { headers: { token: localStorage.getItem("token") } };
//     // let api = "/api/GetGIT/0";
//     // let result = [];
//     // axios.get(api, config).then((res) => {
//     //  if (res.data && res.data.result && res.data.result.Result) {
//     //    result = res.data.result.Result.map((item) => {
//     //      return {
//     //       gitid: item.gitid,
//     //        partyid: item.partyid,
//     //        partyname: item.partyname,
//     //        inwardno: item.invoiceno_ho,
//     //       gitno: item.git_no,
//     //       inwarddate: item.invoicedate_ho,
//     //        gitdetails: item.gitdetail,
//     //       netamount: item.grandtotal,
//     //      };
//     //     });
//     //    db.InwardMaster.bulkPut(result);
//     ///  }
//     // });        "++Id, SoId ,ItemId ,Rate, Discount ,BaseQty ,AltQty ,GrossTotal ,
//     //DiscountAmount, NetTotal, IsAltRate, Remark, HsnId, IGSTRate, CGSTRate, SGSTRate,
//     //   IGSTAmount, CGSTAmount, SGSTAmount",
//     const data = [
//       {
//         id: 1,
//         SoId: 1,
//         ItemName: "new",
//         ItemId: 1,
//         Rate: 100,
//         Discount: 10,
//         quantity: 1,
//         GrossTotal: 100,
//         DiscountAmount: 10,
//         NetTotal: 100,
//         Remark: "new remark",
//         UnitName: "Pieces",
//       },
//       {
//         id: 2,
//         SoId: 2,
//         ItemName: "new",
//         ItemId: 1,
//         Rate: 100,
//         Discount: 10,
//         quantity: 1,
//         GrossTotal: 100,
//         DiscountAmount: 10,
//         NetTotal: 100,
//         Remark: "new remark",
//         UnitName: "Pieces",
//       },
//       {
//         id: 3,
//         SoId: 3,
//         ItemName: "new",
//         ItemId: 1,
//         Rate: 100,
//         Discount: 10,
//         quantity: 1,
//         GrossTotal: 100,
//         DiscountAmount: 10,
//         NetTotal: 100,
//         Remark: "new remark",
//         UnitName: "Pieces",
//       },
//     ];
//     await db.saleDetail.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncSaleDetail");
//   }
// };

export const syncStockMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      stockMaster: schema.stockMaster,
    });

    const data = [
      {
        Id: 1,
        transactionNo: "SM6378402963",
        transactionDate: "12/12/2021",
        remarks: "FHOIGHIO",
      },
    ];
    await db.stockMaster.bulkPut(data);
  } catch (error) {
    console.log(error, "syncStockMaster");
  }
};

export const syncStockMasterDetail = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      stockMasterDetails: schema.stockMasterDetails,
    });

    const data = [
      {
        Id: 1,
        SmId: "SM6378402963",
        itemname: "new item1",
        itemcode: "9211",
        baseunit: "Piece",
        altunit: "Piece",
        mrp: 9211,
        quantityadd: 1,
        quantityMinus: 12,
      },
    ];
    await db.stockMasterDetails.bulkPut(data);
  } catch (error) {
    console.log(error, "syncStockMasterDetail");
  }
};

// export const syncSalesPersonMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       salesPersonMaster: schema.salesPersonMaster,
//     });

//     const data = [
//       {
//         SalePersonCode: "SM6378402963",
//         SalePersonName: "new item1",
//         CommisionValue: "9211",
//         Designation: "Piece",
//         CommisionPercentage: 1,
//         EmailId: "9211@gmail.yahoooooo",
//       },
//       {
//         SalePersonCode: "SM6378402963",
//         SalePersonName: "new item1",
//         CommisionValue: "9211",
//         Designation: "Piece",
//         CommisionPercentage: 1,
//         EmailId: "9211@gmail.yahoooooo",
//       },
//       {
//         SalePersonCode: "SM6378402963",
//         SalePersonName: "new item1",
//         CommisionValue: "9211",
//         Designation: "Piece",
//         CommisionPercentage: 1,
//         EmailId: "9211@gmail.yahoooooo",
//       },
//     ];
//     await db.salesPersonMaster.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncSalesPersonMaster");
//   }
// };

// export const syncReasonMaster = async () => {
//   try {
//     let db = await new Dexie("posdb");
//     db.version(1).stores({
//       reasonMaster: schema.reasonMaster,
//     });
//     const data = [
//       {
//         reasonName: "abcd",
//         reasonType: 1,
//       },
//     ];
//     await db.reasonMaster.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncReasonMaster");
//   }
// };

// export const syncReasonTypeMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       reasonTypeMaster: schema.reasonTypeMaster,
//     });
//     const data = [
//       {
//         reasonType: "cancellation",
//       },
//       {
//         reasonType: "old",
//       },
//       {
//         reasonType: "wastage",
//       },
//       {
//         reasonType: "break",
//       },
//       {
//         reasonType: "other",
//       },
//     ];
//     await db.reasonTypeMaster.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncReasonTypeMaster");
//   }
// };

// export const syncDesignationMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       designationMaster: schema.designationMaster,
//     });

//    // await db.designationMaster.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncDesignationMaster");
//   }
// };

// export const syncCounterMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       counterMaster: schema.counterMaster,
//     });
//     const data = [
//       {
//         counterCode: "counterName",
//         counterName: "counterCode",
//       },
//     ];
//     await db.counterMaster.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncCounterMaster");
//   }
// };

// export const syncCurrencyMaster = async () => {
//   try {
//     let db = new Dexie("posdb");
//     db.version(1).stores({
//       currencyMaster: schema.currencyMaster,
//     });
//     const data = [
//       {
//         currencySymbol: "Rs",
//         formalName: "Rupees",
//         digitAfterSymbol: "3",
//         symbolForDecimalPortion: "3",
//         decimalSymbol: ".",
//         digitGroupingSymbol: "3",
//       },
//     ];
//     await db.currencyMaster.bulkPut(data);
//   } catch (error) {
//     console.log(error, "syncCurrencyMaster");
//   }
// };
export const syncVoucherMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      voucherMaster: schema.voucherMaster,
    });
    const data = [
      {
        voucherName: "counterName",
        AppliedOn: "counterCode",
        tallyVoucherName: "counterName",
        shortName: "counterCode",
        EnableBatch: false,
        SetAsDefault: false,
        isImeiApplicable: false,
        enableDataBackEntry: true,
        itemLevelRoundingOff: false,
      },
    ];
    await db.voucherMaster.bulkPut(data);
  } catch (error) {
    console.log(error, "syncVoucherMaster");
  }
};
export const syncCurrencyMasterDetails = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      currencyMasterDetails: schema.currencyMasterDetails,
    });
    const data = [
      {
        CurrencyMasterId: 1,
        Date: "12/12/2021",
        Rate: 1,
      },
    ];
    await db.currencyMasterDetails.bulkPut(data);
  } catch (error) {
    console.log(error, "syncCurrencyMasterDetails");
  }
};
export const syncGeographicalMaster = async () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      geographicalMaster: schema.geographicalMaster,
    });
    const data = [
      {
        CountryName: "India",
        CountryCode: "IN",
        CountryId: 5,
      },
    ];
    await db.geographicalMaster.bulkPut(data);
  } catch (error) {
    console.log(error, "syncGeographicalMaster");
  }
};

export const userLogin = () => {
  try {
    let db = new Dexie("posdb");
    db.version(1).stores({
      userLogin: schema.userLogin,
    });
    //const config = { headers: { token: localStorage.getItem("token") } };
  } catch (error) {
    console.log(error, "userLogin");
  }
};
