import db from "./dbs";
import axios from "axios";
import { ItemMaster_obj } from "../component/masters/itemMaster/store";
import getTransactionData from "./getTransactionData";
require("dotenv").config();
export const globalsetting = async () => {
  try {
    const setting = await db.globelsetting
      .toArray()
      .then()
      .catch((err) => console.log(err));
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/Globalsetting";
    axios
      .get(api, config)
      .then(async (res) => {
        console.log(res, "res res 17")
        if (setting.length > 0) {
          await db.globelsetting.clear().then((res) => {
            db.globelsetting.bulkAdd(res.data.Result).then().catch();
          });
        } else {
          await db.globelsetting
            .bulkAdd(res.data.Result)
            .then((res) => getTransactionData())
        }
        // const setobj = {
        //   globsettingid: res.data.Result[0].globsettingid,
        //   itemkeyname: res.data.Result[0].itemkeyname,
        //   displayname: res.data.Result[0].displayname,
        //   value: parseInt(res.data.Result[0].value),
        //   pastdaysettingid: res.data.Result[1].globsettingid,
        //   pastdaysettingkeyname: res.data.Result[1].itemkeyname,
        //   pastdaysettingdisplayname: res.data.Result[1].displayname,
        //   pastdaysettingvalue: parseInt(res.data.Result[1].value),
        // };
        // if (setting) {
        //   setobj["id"] = setting.id;
        //   await db.globelsetting.put(setobj);
        //   settingVal = res.data.Result[0].value;
        // } else {
        //   await db.globelsetting.add(setobj);
        // }
      })
      .catch((err) => {
        console.log(err, "globalsettinterr");
      });
  } catch (err) {
    console.log(err, "globalsetting");
  }
};

export const syncItemMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/ItemMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      let data =
        res.data &&
        res.data.Result &&
        res.data.Result.map((val) => {
          const put_data = {
            ...ItemMaster_obj,
            Id: val.Id,
            ItemId: val.Id,
            ItemCode: val.ItemCode,
            ItemName: val.ItemName,
            PrintName: val.PrintName,
            GroupId: val.GroupId,
            UnitName: val.UnitId,
            UnitAltName: val.AltUnitId === -1 ? val.UnitId : val.AltUnitId,
            Conversion: val.Conversion,
            Denominator: val.Denominator,
            IsLot: val.IsLotEnable,
            IsActive: val.IsActive,
            IsTaxInclusive: val.IsTaxInclusive,
            CreatedBy: val.CreatedBy,
            CreatedOn: val.CreatedOn,
            EditLog: val.EditLog,
            IsLotEnable: val.IsLotEnable,
            IsSerialEnable: val.IsSerialEnable,
            alteredon: val.alteredon,
          };

          let gst_data = val.HSNMapping.map((value) => ({
            ItemId: value.ItemId,
            HsnId: value.HsnId,
            ApplicableDate: value.ApplicableOn,
            CreatedBy: value.CreatedBy,
            CreatedOn: value.CreatedOn,
            EditLog: "",
          }));

          put_data.GSTClassification = [...gst_data];
          return put_data;
        });
      if (data && data.length > 0) {
        const altdates = data.map((d) => {
          return d.alteredon;
        });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("itemMaster")
          .first()
          .then()
          .catch((err) => console.log(err));

        // const hitcountvalue =
        //   res.data.recordcount /
        //   parseInt(
        //     setting && setting.value === undefined ? 2000 : setting.value
        //   );
        // const hitcountvalue = res.data.recordcount / parseInt(glbCount);
        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);
        if (tbl) {
          await db.mastertables.put({
            id: tbl.id,
            tablename: "itemMaster",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: parseInt(tbl.pageindexno) + 1,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.itemMaster.bulkAdd(data);
          }
        } else {
          await db.mastertables.add({
            tablename: "itemMaster",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.itemMaster.bulkAdd(data);
        }
      } else {
        console.log("no more itemmaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncItemMaster");
  }
};

export const syncCustomerMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/LedgerMaster/List/1/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res && res.data && res.data.Result) {
        console.log(res, "second response")
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            new: 0,
            update: 0,
            PartyCode: item.LedgerCode,
            PartyName: item.LedgerName,
            CompanyCode: item.CompanyCode,
            GroupId: "",
            Address: item.Address,
            Address2: item.Address2,
            CityId: item.Cityid,
            Pincode: item.Pincode,
            Phone1: item.Phone1,
            Phone2: item.Phone2,
            Fax: item.Fax,
            Email: item.Email,
            DmsLedgerCode: item.DmsLedgerCode,
            DealerCategory: item.DealerCategory,
            IsClosed: item.IsClosed,
            ContactPerson: item.ContactPerson,
            SalesPersonName: "",
            CstNo: "",
            CstDate: "",
            LstNo: "",
            LstDate: "",
            TinNo: "",
            TinDate: "",
            PAN: item.Panno,
            GSTNo: item.Gstno,
            BillAddress: item.Billaddress,
            LedgerType: item.LedgerType,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("customerMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          // const hitcountvalue =
          //   res.data.recordcount <
          //   parseInt(
          //     setting && setting.value === undefined
          //       ? 2000
          //       : setting && setting.value
          //   )
          //     ? 0
          //     : res.data.recordcount /
          //       parseInt(
          //         setting && setting.value === undefined
          //           ? 2000
          //           : setting && setting.value
          //       );
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "customerMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.customerMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "customerMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.customerMaster.bulkAdd(data);
          }
        } else {
          console.log("no more customerMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "syncCustomerMaster");
  }
};

export const syncVendorMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/LedgerMaster/List/2/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        console.log(res, "third response")

        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            new: 0,
            update: 0,
            PartyCode: item.LedgerCode,
            PartyName: item.LedgerName,
            CompanyCode: "",
            GroupId: "",
            Address: item.Address,
            Address2: "",
            CityId: "",
            Pincoce: item.Pincode,
            Phone1: item.Phone1,
            Phone2: item.Phone2,
            Fax: "",
            Email: item.Email,
            ContactPerson: "",
            SalesPersonName: "",
            CstNo: "",
            CstDate: "",
            LstNo: "",
            LstDate: "",
            TinNo: "",
            TinDate: "",
            PAN: "",
            GSTNo: "",
            BillAddress: "",
            LedgerType: item.LedgerType,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("vendorMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "vendorMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.customerMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "vendorMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.customerMaster.bulkAdd(data);
          }
        } else {
          console.log("no more vendorMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "syncVendorMaster");
  }
};

export const syncHsnMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/HsnMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        console.log(res, "fourth response")

        const altdates =
          res.data.Result &&
          res.data.Result.map((d) => {
            return d.alteredon;
          });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("hsnMaster")
          .first()
          .then()
          .catch((err) => console.log(err));
        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);
        if (tbl) {
          let i = parseInt(tbl.pageindexno) + 1;
          await db.mastertables.put({
            id: tbl.id,
            tablename: "hsnMaster",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: i,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.hsnMaster.bulkAdd(res.data.Result);
          }
        } else {
          await db.mastertables.add({
            tablename: "hsnMaster",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.hsnMaster.bulkAdd(res.data.Result);
        }
      } else {
        // console.log("no more hsnMaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncHsnMaster");
  }
};

export const syncItemGroup = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/ItemGroup/List/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        console.log(res, "fifth response")

        const altdates =
          res.data.Result &&
          res.data.Result.map((d) => {
            return d.alteredon;
          });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("itemGroup")
          .first()
          .then()
          .catch((err) => console.log(err));
        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);

        if (tbl) {
          let i = parseInt(tbl.pageindexno) + 1;
          await db.mastertables.put({
            id: tbl.id,
            tablename: "itemGroup",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: i,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.itemGroup.bulkAdd(res.data.Result);
          }
        } else {
          await db.mastertables.add({
            tablename: "itemGroup",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.itemGroup.bulkAdd(res.data.Result);
        }
      } else {
        // console.log("no more hsnMaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncItemGroup");
  }
};
export const syncUnitMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/UnitMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "sixth response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        const altdates =
          res.data &&
          res.data.Result &&
          res.data.Result.map((d) => {
            return d.alteredon;
          });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("unitMaster")
          .first()
          .then()
          .catch((err) => console.log(err));
        // const hitcountvalue = res.data.recordcount / parseInt(glbCount);
        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);
        if (tbl) {
          let i = parseInt(tbl.pageindexno) + 1;
          await db.mastertables.put({
            id: tbl.id,
            tablename: "unitMaster",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: i,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.unitMaster.bulkAdd(res.data.Result);
          }
        } else {
          await db.mastertables.add({
            tablename: "unitMaster",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.unitMaster.bulkAdd(res.data.Result);
        }
      } else {
        console.log("no more unitMaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncUnitMaster");
  }
};
export const syncCityMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/CityMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        console.log(res, "seventh response")

        const altdates =
          res.data &&
          res.data.Result &&
          res.data.Result.map((d) => {
            return d.alteredon;
          });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("cityMaster")
          .first()
          .then()
          .catch((err) => console.log(err));
        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);
        if (tbl) {
          let i = parseInt(tbl.pageindexno) + 1;
          await db.mastertables.put({
            id: tbl.id,
            tablename: "cityMaster",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: i,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.cityMaster.bulkAdd(res.data.Result);
          }
        } else {
          await db.mastertables.add({
            tablename: "cityMaster",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.cityMaster.bulkAdd(res.data.Result);
        }
      } else {
        console.log("no more cityMaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncCityMaster");
  }
};
export const syncGITMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/GetGIT/0";
    let result = [];
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        console.log(res, "eight response")

        result = res.data.Result.map((item) => {
          return {
            Id: item.gitid,
            gitid: item.gitid,
            partyid_ho: item.partyid_ho,
            partyid_pos: item.partyid_pos,
            partyname: item.partyname,
            invoiceno_ho: item.invoiceno_ho,
            invoicedate_ho: item.invoicedate_ho,
            invoiceid_ho: item.invoiceid_ho,
            grandtotal: item.grandtotal,
            git_no: item.git_no,
            git_date: item.git_date,
            alterid: item.alterid,
            editlog: item.editlog,
            authorizedby: item.authorizedby,
            authorizedon: item.authorizedon,
            headauthorizedby: item.headauthorizedby,
            headauthorizedon: item.headauthorizedon,
            cancelledby: item.cancelledby,
            tally_log: item.tally_log,
            tallyreferenceno: item.tallyreferenceno,
            tallysyncdate: item.tallysyncdate,
            remarks: item.remarks,
            createdby: item.createdby,
            createdon: item.createdon,
            reference_no: item.reference_no,
            reference_date: item.reference_date,
            isautoentry: item.isautoentry,
            invoiceno_erp: item.invoiceno_erp,
            invoicedate_erp: item.invoicedate_erp,
            gitdetail: item.gitdetail,
            alteredon: "1970-01-01 00:00:01",
            // alteredon:item.alteredon,
            // gitid: item.gitid,
            // partyid: item.partyid,
            // partyname: item.partyname,
            // inwardno: item.invoiceno_ho,
            // gitno: item.git_no,
            // inwarddate: item.invoicedate_ho,
            // gitdetails: item.gitdetail,
            // netamount: item.grandtotal,
          };
        });
        // if(dbdata){
        //   if(result.length > dbdata.length){
        //     await db.GITMaster.bulkPut(result);
        //   }
        // }else{
        //   await db.GITMaster.bulkPut(result);
        // }

        if (result && result.length > 0) {
          const altdates =
            result &&
            result.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("GITMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "GITMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            await db.GITMaster.bulkAdd(result);
          } else {
            await db.mastertables.add({
              tablename: "GITMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.GITMaster.bulkAdd(result);
          }
        } else {
          console.log("no more syncGITMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "syncGITMaster");
  }
};

export const syncStateMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/StateMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "nine response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        const altdates =
          res.data &&
          res.data.Result &&
          res.data.Result.map((d) => {
            return d.alteredon;
          });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("stateMaster")
          .first()
          .then()
          .catch((err) => console.log(err));

        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);
        if (tbl) {
          let i = parseInt(tbl.pageindexno) + 1;
          await db.mastertables.put({
            id: tbl.id,
            tablename: "stateMaster",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: i,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.stateMaster.bulkAdd(res.data.Result);
          }
        } else {
          await db.mastertables.add({
            tablename: "stateMaster",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.stateMaster.bulkAdd(res.data.Result);
        }
      } else {
        console.log("no more stateMaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncStateMaster");
  }
};

export const syncPriceMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/PriceListDiscount/List/";

    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "ten response")
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        let slab = [];
        let pricelist = [];
        let pricelistdetail = [];
        const altdates =
          res.data &&
          res.data.Result &&
          res.data.Result.map((d) => {
            const s = {
              Id: d.Id,
              SlabCode: d.SlabCode,
              SlabName: d.SlabName,
              CreatedBy: d.CreatedBy,
              CreatedByName: d.CreatedByName,
              CreatedOn: d.CreatedOn,
              EditLog: d.EditLog,
              BranchId: d.BranchId,
              SeriesId: d.SeriesId,
              SeriesNo: d.SeriesNo,
              SeriesCode: d.SeriesCode,
              Remark: d.Remark,
              alteredon: d.alteredon,
            };
            slab.push(s);
            d.PriceListItem.map((s) => {
              const l = {
                SlabItemId: s.SlabItemId,
                SlabId: s.SlabId,
                ItemId: s.ItemId,
                ItemName: s.ItemName,
                ItemCode: s.ItemCode,
                ApplicableFrom: s.ApplicableFrom,
                ApplicableTo: s.ApplicableTo,
                InActive: s.InActive,
                Remarks: s.Remarks,
                InactiveDate: s.InactiveDate,
              };
              pricelist.push(l);
              s.PriceListItemDetail.map((m) => {
                let nm = {
                  DetailId: m.DetailId,
                  SlabItemId: m.SlabItemId,
                  SlabId: m.SlabId,
                  ItemId: m.ItemId,
                  ItemName: m.ItemName,
                  QtyFrom: m.QtyFrom,
                  QtyTo: m.QtyTo,
                  LotNo: m.LotNo,
                  MRP: m.MRP,
                  Rate: m.Rate,
                  DiscountAmount: m.DiscountAmount,
                  FinalRate: m.FinalRate,
                  LotSerialId: m.LotSerialId,
                };
                pricelistdetail.push(nm);
                return m;
              });
              return s;
            });
            return d.alteredon;
          });
        const altlatestdate = max_date(altdates);
        const tbl = await db.mastertables
          .where("tablename")
          .equals("priceMaster")
          .first()
          .then()
          .catch((err) => console.log(err));
        const hitcountvalue =
          res.data.recordcount < parseInt(glbCount)
            ? 0
            : res.data.recordcount / parseInt(glbCount);
        if (tbl) {
          let i = parseInt(tbl.pageindexno) + 1;
          await db.mastertables.put({
            id: tbl.id,
            tablename: "priceMaster",
            recordcount: tbl.recordcount,
            alteredon: altlatestdate,
            pageindexno: i,
            hitcount: tbl.hitcount,
          });
          if (tbl.pageindexno < tbl.hitcount) {
            await db.priceSlabMaster.bulkAdd(slab);
            await db.priceListItem.bulkAdd(pricelist);
            await db.priceListItemDetail.bulkAdd(pricelistdetail);
          }
        } else {
          await db.mastertables.add({
            tablename: "priceMaster",
            recordcount: res.data.recordcount,
            alteredon: altlatestdate,
            pageindexno: 1,
            hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
          });
          await db.priceSlabMaster.bulkAdd(slab);
          await db.priceListItem.bulkAdd(pricelist);
          await db.priceListItemDetail.bulkAdd(pricelistdetail);
        }
      } else {
        console.log("no more priceMaster data");
      }
    });
  } catch (error) {
    console.log(error, "syncPriceMaster");
  }
};

//stock
export const syncStockLotMaster = async () => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/GetItemStock/0";
    let result = [];

    axios.get(api, config).then(async (res) => {
      console.log(res, "ten response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result && res.data.Result.length > 0) {
        result = res.data.Result.map((item) => {
          return {
            SerialId: 1,
            TransactionId: 1,
            TransactionType: "IN",
            TransactionDate: "23-Jan-2021",
            TransactionNo: 1,
            ItemId: item.itemid,
            QtyIn: item.inqty,
            QtyOut: item.qtyout,
            LotNo: item.lotno,
            BatchNo: item.batchno,
            MfgDate: item.mfgdate,
            ExpDate: item.expdate,
            Balance: item.balance,
            Mrp: item.mrp,
            IsAltRate: 1,
            AltQtyOut: 0,
            AltQtyIn: 0,
            alteredon: item.alteredon,
          };
        });
        if (result && result.length > 0) {
          const altdates =
            result &&
            result.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("stockLotMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "stockLotMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.stockLotMaster.bulkAdd(result);
            }
          } else {
            await db.mastertables.add({
              tablename: "stockLotMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.stockLotMaster.bulkAdd(result);
          }
        } else {
          console.log("no more stockLotMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "syncStockLotMaster");
  }
};
export const syncEmployeeMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/EmployeeMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      console.log(res, "eleven response")

      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            EmployeeCode: item.EmployeeCode,
            EmployeeName: item.EmployeeName,
            Dob: item.Dob,
            Doj: item.Doj,
            Department: item.Department,
            DepartmentName: item.DepartmentName,
            Gender: item.Gender,
            MaritalStatus: item.MaritalStatus,
            PresentAddress: item.PresentAddress,
            ReportingTo: item.ReportingTo,
            PresentContactNo: item.PresentContactNo,
            PresentPincode: item.PresentPincode,
            Email: item.Email,
            PanNo: item.PanNo,
            IdCardNo: item.IdCardNo,
            PermanentAddress: item.PermanentAddress,
            PermanentPincode: item.PermanentPincode,
            IsActive: item.IsActive,
            EditLog: item.EditLog,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            CreatedOn: item.CreatedOn,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("employeemaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "employeemaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.employeeMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "employeemaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.employeeMaster.bulkAdd(data);
          }
        } else {
          console.log("no more employeemaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "employeemaster");
  }
};
export const syncDesignationMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/DesignationMaster/list";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twelve response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            DesignationCode: item.DesignationCode,
            DesignationName: item.DesignationName,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("DesignationMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "DesignationMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.designationMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "DesignationMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.designationMaster.bulkAdd(data);
          }
        } else {
          console.log("no more DesignationMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "DesignationMaster");
  }
};
export const syncSalesPersonMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SalePerson/List/";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "thirteen response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            TargetDetail: item.TargetDetail,
            SalePersonCode: item.SalePersonCode,
            SalePersonName: item.SalePersonName,
            Commission: item.Commission,
            CommissionValue: item.CommissionValue,
            Target: item.Target,
            VendorId: item.VendorId,
            DesginationId: item.DesginationId,
            ParentId: item.ParentId,
            EmailId: item.EmailId,
            ContactNo: item.ContactNo,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            EditLog: item.EditLog,
            CreatedOn: item.CreatedOn,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("SalesPersonMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "SalesPersonMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.salesPersonMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "SalesPersonMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.salesPersonMaster.bulkAdd(data);
          }
        } else {
          console.log("no more employeemaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "salesPersonMaster");
  }
};
export const syncReasonMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/reasonmaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "fourteen response")
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            ReasonName: item.ReasonName,
            CounterId: item.CounterId,
            ReasonTypeId: item.ReasonTypeId,
            ReasonTypeName: item.ReasonTypeName,
            EditLog: item.EditLog,
            CreatedBy: item.CreatedBy,
            CreatedOn: item.CreatedOn,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("ReasonMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          // const hitcountvalue = res.data.recordcount / parseInt(glbCount);
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "ReasonMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.reasonMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "ReasonMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.reasonMaster.bulkAdd(data);
          }
        } else {
          console.log("no more employeemaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "salesPersonMaster");
  }
};
export const syncReasonTypeMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/reasontypemaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "sixteen response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            ReasonTypeName: item.ReasonTypeName,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("ReasonTypeMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          // const hitcountvalue = res.data.recordcount / parseInt(glbCount);
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "ReasonTypeMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.reasonTypeMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "ReasonTypeMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.reasonTypeMaster.bulkAdd(data);
          }
        } else {
          console.log("no more employeemaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "salesPersonMaster");
  }
};
export const syncCurrencyMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/currencymaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "seventeen response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            ExchangeRate: item.ExchangeRate,
            CurrencySymbol: item.CurrencySymbol,
            FormalName: item.FormalName,
            DigitAfterDecimal: item.DigitAfterDecimal,
            SymbolForDecimalPortion: item.SymbolForDecimalPortion,
            DecimalSymbol: item.DecimalSymbol,
            GroupingSymbol: item.GroupingSymbol,
            CounterId: item.CounterId,
            EditLog: item.EditLog,
            CreatedBy: item.CreatedBy,
            CreatedOn: item.CreatedOn,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("CurrencyMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          // const hitcountvalue = res.data.recordcount / parseInt(glbCount);
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "CurrencyMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.currencyMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "CurrencyMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.currencyMaster.bulkAdd(data);
          }
        } else {
          console.log("no more employeemaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "salesPersonMaster");
  }
};
export const syncCounterMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/CounterMaster/List/";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            CounterName: item.CounterName,
            CounterCode: item.CounterCode,
            Remarks: item.Remarks,
            MachineId: item.MachineId,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            EditLog: item.EditLog,
            CreatedOn: item.CreatedOn,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("CounterMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "CounterMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.counterMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "CounterMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.counterMaster.bulkAdd(data);
          }
        } else {
          console.log("no more counterMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "salesPersonMaster");
  }
};
export const syncSeriesMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/seriesmaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty one response")
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            SeriesName: item.SeriesName,
            RestartSeries: item.RestartSeries,
            DigitPadding: item.DigitPadding,
            BranchId: item.BranchId,
            IsActive: item.IsActive,
            InactiveDate: item.InactiveDate,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            CreatedOn: item.CreatedOn,
            EditLog: item.EditLog,
            alteredon: item.alteredon,
          };
          return datain;
        });
        let dataDetail = [];
        res.data.Result.map((item) => {
          dataDetail = [...dataDetail, ...item.SeriesFieldDetail];
          return item;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("seriesmaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "seriesmaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.seriesMaster.bulkAdd(data);
              await db.seriesMasterDetail.bulkAdd(dataDetail);
            }
          } else {
            await db.mastertables.add({
              tablename: "seriesmaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.seriesMaster.bulkAdd(data);
            await db.seriesMasterDetail.bulkAdd(dataDetail);
          }
        } else {
          console.log("no more seriesmaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "seriesmaster");
  }
};
export const syncSeriesFieldMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SeriesFieldMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty two response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            FieldId: item.FieldId,
            FieldName: item.FieldName,
            FieldValue: item.FieldValue,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("SeriesFieldMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "SeriesFieldMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.seriesfieldMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "seriesmaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.seriesfieldMaster.bulkAdd(data);
          }
        } else {
          console.log("no more seriesmaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "seriesmaster");
  }
};
export const syncSeriesApply = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SeriesApply/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty five response")
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            SeriesId: item.SeriesId,
            VoucherId: item.VoucherId,
            VoucherName: item.VoucherName,
            ItemId: item.ItemId,
            ApplicableFrom: item.ApplicableFrom,
            BranchId: item.BranchId,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            CreatedOn: item.CreatedOn,
            EditLog: item.EditLog,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("SeriesApply")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "SeriesApply",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.seriesApply.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "SeriesApply",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.seriesApply.bulkAdd(data);
          }
        } else {
          console.log("no more SeriesApply data");
        }
      }
    });
  } catch (error) {
    console.log(error, "SeriesApply");
  }
};
export const syncVoucherFormMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/VoucherFormMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty six response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            formid: item.formid,
            formname: item.formname,
            caption: item.caption,
            formtype: item.formtype,
            mnunew: item.mnunew,
            mnuedit: item.mnuedit,
            mnuauthorize: item.mnuauthorize,
            mnuview: item.mnuview,
            mnuprint: item.mnuprint,
            mnuamendment: item.mnuamendment,
            mnusendtotally: item.mnusendtotally,
            mnuexporttoexcel: item.mnuexporttoexcel,
            extravalue: item.extravalue,
            formval: item.formval,
            isauthorizationreq: item.isauthorizationreq,
            mnuclosepending: item.mnuclosepending,
            visible: item.visible,
            mnucanceltransaction: item.mnucanceltransaction,
            formgroupid: item.formgroupid,
            allowbackdateentry: item.allowbackdateentry,
            isheadauthorizationreq: item.isheadauthorizationreq,
            mnuattachment: item.mnuattachment,
            mnuviewattachment: item.mnuviewattachment,
            bamount_auth_enable: item.bamount_auth_enable,
            formpath: item.formpath,
            backdateenddate: item.backdateenddate,
            saveandprint: item.saveandprint,
            saveandauthorize: item.saveandauthorize,
            roundoffitemlevelamt: item.roundoffitemlevelamt,
            mnucreatestructure: item.mnucreatestructure,
            mnuimport: item.mnuimport,
            tb_name: item.tb_name,
            is_from_dll: item.is_from_dll,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("VoucherFormMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "VoucherFormMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.VoucherFormMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "VoucherFormMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.VoucherFormMaster.bulkAdd(data);
          }
        } else {
          console.log("no more VoucherFormMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "VoucherFormMaster");
  }
};
export const syncVoucherList = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/voucher/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        console.log(res, "twenty seven response")
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            VoucherName: item.VoucherName,
            ApplyOnFormId: item.ApplyOnFormId,
            IsDefault: item.IsDefault,
            ShortName: item.ShortName,
            IsActive: item.IsActive,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            EditLog: item.EditLog,
            CreatedOn: item.CreatedOn,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("VoucherList")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "VoucherList",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.VoucherList.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "VoucherList",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.VoucherList.bulkAdd(data);
          }
        } else {
          console.log("no more VoucherList data");
        }
      }
    });
  } catch (error) {
    console.log(error, "VoucherList");
  }
};
export const syncSaleOrder = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SalesOrder/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty eight response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            SoNo: item.SoNo,
            SoDate: item.SoDate,
            PartyId: item.PartyId,
            PartyName: item.PartyName,
            GrandTotal: item.GrandTotal,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            CreatedOn: item.CreatedOn,
            EditLog: item.EditLog,
            Remarks: item.Remarks,
            alteredon: item.alteredon,
            SoDetail: item.SoDetail,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("SaleOrder")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "SaleOrder",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.SaleOrder.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "SaleOrder",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.SaleOrder.bulkAdd(data);
          }
        } else {
          console.log("no more SaleOrder data");
        }
      }
    });
  } catch (error) {
    console.log(error, "SaleOrder");
  }
};
export const syncFormMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/FormMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      console.log(res, "twenty nine response")

      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            formid: item.formid,
            formname: item.formname,
            caption: item.caption,
            formtype: item.formtype,
            mnunew: item.mnunew,
            mnuedit: item.mnuedit,
            mnuauthorize: item.mnuauthorize,
            mnuview: item.mnuview,
            mnuprint: item.mnuprint,
            mnuamendment: item.mnuamendment,
            mnusendtotally: item.mnusendtotally,
            mnuexporttoexcel: item.mnuexporttoexcel,
            extravalue: item.extravalue,
            formval: item.formval,
            isauthorizationreq: item.isauthorizationreq,
            mnuclosepending: item.mnuclosepending,
            visible: item.visible,
            mnucanceltransaction: item.mnucanceltransaction,
            formgroupid: item.formgroupid,
            allowbackdateentry: item.allowbackdateentry,
            isheadauthorizationreq: item.isheadauthorizationreq,
            mnuattachment: item.mnuattachment,
            mnuviewattachment: item.mnuviewattachment,
            bamount_auth_enable: item.bamount_auth_enable,
            formpath: item.formpath,
            backdateenddate: item.backdateenddate,
            saveandprint: item.saveandprint,
            saveandauthorize: item.saveandauthorize,
            roundoffitemlevelamt: item.roundoffitemlevelamt,
            mnucreatestructure: item.mnucreatestructure,
            mnuimport: item.mnuimport,
            tb_name: item.tb_name,
            is_from_dll: item.is_from_dll,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("FormMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "FormMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.formMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "FormMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.formMaster.bulkAdd(data);
          }
        } else {
          console.log("no more FormMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "FormMaster");
  }
};
export const syncFormMenuMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/formmenumaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            menuid: item.menuid,
            menuname: item.menuname,
            haschild: item.haschild,
            formid: item.formid,
            parentid: item.parentid,
            seqno: item.seqno,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("FormMenuMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "FormMenuMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.formmenumaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "FormMenuMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.formmenumaster.bulkAdd(data);
          }
        } else {
          console.log("no more FormMenuMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "FormMenuMaster");
  }
};
export const syncFormGroupMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/formgroupmaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            formgroupid: item.formgroupid,
            formgroupname: item.formgroupname,
            alteredon: item.alteredonf,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("formgroupmaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "formgroupmaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.formgroupmaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "formgroupmaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.formgroupmaster.bulkAdd(data);
          }
        } else {
          console.log("no more formgroupmaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "formgroupmaster");
  }
};
export const syncRoleMap = async (obj) => {
  try {
    //console.log("res.data.result.detail11111111111111111111111111111test test test");
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/RoleMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            RoleName: item.RoleName,
            Description: item.Description,
            CreatedBy: item.CreatedBy,
            CreatedByName: item.CreatedByName,
            CreatedOn: item.CreatedOn,
            IsActive: item.IsActive,
            EditLog: item.EditLog,
            alteredon: item.alteredon,
          };
          return datain;
        });
        let dataDetail = [];
        res.data.Result.map((item) => {
          dataDetail = [...dataDetail, ...item.Detail];
          return item;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("RoleMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "RoleMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.RoleMaster.bulkAdd(data);
              await db.RoleDetailMaster.bulkAdd(dataDetail);
            }
          } else {
            await db.mastertables.add({
              tablename: "RoleMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.RoleMaster.bulkAdd(data);
            await db.RoleDetailMaster.bulkAdd(dataDetail);
          }
        } else {
          console.log("no more RoleMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "RoleMaster");
  }
};
export const syncUserMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/usermaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            Id: item.Id,
            UserName: item.UserName,
            Password: item.Password,
            EmployeeId: item.EmployeeId,
            EmployeeName: item.EmployeeName,
            Description: item.Description,
            IsActive: item.IsActive,
            IsAuthorized: item.IsAuthorized,
            AuthorizedBy: item.AuthorizedBy,
            CreateddBy: item.CreateddBy,
            Email: item.Email,
            EditLog: item.EditLog,
            CreatedOn: item.CreatedOn,
            AuthorizedOn: item.AuthorizedOn,
            alteredon: item.alteredon,
            Branch: item.Branch,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("usermaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "usermaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.userMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "usermaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.userMaster.bulkAdd(data);
          }
        } else {
          console.log("no more usermaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "usermaster");
  }
};
export const syncUserMenuMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/UserMenuMaster/List";
    //const setting = await db.globelsetting.where("globsettingid").equals(540).first();
    axios.post(api, obj, config).then(async (res) => {
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            menuid: item.menuid,
            menuname: item.menuname,
            formid: item.formid,
            formname: item.formname,
            formtype: item.formtype,
            haschild: item.haschild,
            parentid: item.parentid,
            seqno: item.seqno,
            formval: item.formval,
            bshow: item.bshow,
            userId: parseInt(localStorage.getItem("UserId")),
          };
          return datain;
        });
        await db.UserMenuMaster.bulkAdd(data);
      } else {
        console.log("no more User Menu Master data");
      }
    });
  } catch (error) {
    console.log(error, "User Menu Master");
  }
};
export const syncItemTaxStructure = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/ItemTaxStructure/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            detailid: item.detailid,
            taxstructurecode: item.taxstructurecode,
            taxstructurename: item.taxstructurename,
            itemid: item.itemid,
            itemcode: item.itemcode,
            ledgerid: item.ledgerid,
            ledgercode: item.ledgercode,
            effectivefrom: item.effectivefrom,
            isvatitem: item.isvatitem,
            taxper: item.taxper,
            addtaxper: item.addtaxper,
            surcharge: item.surcharge,
            istaxinclusive: item.istaxinclusive,
            itemid_ho: item.itemid_ho,
            isexempted: item.isexempted,
            istaxcalculatebeforediscount: item.istaxcalculatebeforediscount,
            ho_itemtaxmasterid: item.ho_itemtaxmasterid,
            itemtaxmasterid: item.itemtaxmasterid,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("ItemTaxStructure")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "ItemTaxStructure",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.itemTaxStructure.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "ItemTaxStructure",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.itemTaxStructure.bulkAdd(data);
          }
        } else {
          console.log("no more itemTaxStructure data");
        }
      }
    });
  } catch (error) {
    console.log(error, "itemTaxStructure");
  }
};
export const syncGetItemStock = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/GetItemStock/0";
    axios.post(api, obj, config).then(async (res) => {
      // console.log(res,"res response in syncGetItemStock for DMS item stock")
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            itemid: item.itemid,
            lotno: item.lotno,
            batchno: item.batchno,
            mfgdate: item.mfgdate,
            expdate: item.expdate,
            mrp: item.mrp,
            inqty: item.inqty,
            qtyout: item.qtyout,
            balance: item.balance,
            storeid: item.storeid,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("getItemStock")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "getItemStock",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.getItemStock.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "getItemStock",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.getItemStock.bulkAdd(data);
          }
        } else {
          console.log("no more getItemStock data");
        }
      }
    });
  } catch (error) {
    console.log(error, "getItemStock");
  }
};
export const syncDealerCategory = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/DealerCategory/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            dealercategoryid: item.dealercategoryid,
            dealercategorycode: item.dealercategorycode,
            isactive: item.isactive,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates =
            data &&
            data.map((d) => {
              return d.alteredon;
            });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("DealerCategory")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "DealerCategory",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.dealerCategory.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "DealerCategory",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.dealerCategory.bulkAdd(data);
          }
        } else {
          console.log("no more DealerCategory data");
        }
      }
    });
  } catch (error) {
    console.log(error, "DealerCategory");
  }
};
export const syncItemSalePrice = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/ItemSalePrice/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            item_standard_id: item.item_standard_id,
            itemid: item.itemid,
            rdpprice: item.rdpprice,
            effective_from: item.effective_from,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("itemSalePrice")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "itemSalePrice",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.itemSalePrice.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "itemSalePrice",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.itemSalePrice.bulkAdd(data);
          }
        } else {
          console.log("no more itemSalePrice data");
        }
      }
    });
  } catch (error) {
    console.log(error, "itemSalePrice");
  }
};
export const billingType = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/BillingType/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            settingid: item.settingid,
            settingname: item.settingname,
            settingvalueid: item.settingvalueid,
            valuename: item.valuename,
            isactive: item.isactive,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("billingtype")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "billingtype",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.billingType.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "billingtype",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.billingType.bulkAdd(data);
          }
        } else {
          console.log("no more billingtype data");
        }
      }
    });
  } catch (error) {
    console.log(error, "billingtype");
  }
};
export const InfluencerData = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/Influencer/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            influencerid: item.influencerid,
            influencerdmscode: item.influencerdmscode,
            influencercode: item.influencercode,
            influencername: item.influencername,
            statename: item.statename,
            alteredon: item.alteredon,
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("Influencer")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "Influencer",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.Influencer.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "Influencer",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.Influencer.bulkAdd(data);
          }
        } else {
          console.log("no more Influencer data");
        }
      }
    });
  } catch (error) {
    console.log(error, "Influencer");
  }
};
export const GodownMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/GodownMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            storeid: item.storeid,
            Storename: item.Storename,
            Storecode: item.Storecode,
            Branchid: item.Branchid,
            isdefault: item.isdefault,
            inactive: item.inactive,
            Storetype: item.Storetype,
            Description: item.Description,
            isauthorized: item.isauthorized,
            authorizedby: item.authorizedby,
            authorizedon: item.authorizedon,
            CreatedBy: item.CreatedBy,
            EditLog: item.EditLog,
            headauthorizedon: item.headauthorizedon,
            headauthorizedby: item.headauthorizedby,
            inactivedate: item.inactivedate,
            createdon: item.createdon,
            updatedby: item.updatedby,
            updatedon: item.updatedon
          };
          return datain;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("GodownMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "GodownMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.GodownMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "GodownMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.GodownMaster.bulkAdd(data);
          }
        } else {
          console.log("no more GodownMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "GodownMaster");
  }
};

export const BatchMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/BatchMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      console.log(res, 'res of BatchMaster api ')
        
      const glbCount = await globalCount();
      console.log(glbCount, 'glbCount in BatchMaster api')
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {

          let datain = {
            batchid: item.batchid,
            batchno: item.batchno,
            batchdate: item.batchdate,
            lotno: item.lotno,
            branchid: item.branchid,
            itemid: item.itemid,
            manufacturingdate: item.manufacturingdate,
            expirydate: item.expirydate,
            seriesid: item.seriesid,
            seriesno: item.seriesno,
            seriescode: item.seriescode,
            editlog: item.editlog,
            iscancelled: item.iscancelled,
            createdon: item.createdon,  
            alteredon: item.alteredon,
          };

          // s
          // let datain = {

          //   BatchNumber: {
          //     BatchDetail: [
          //       {
          //         batchdetailid: 1634,
          //         batchid: item.batchid,
          //         createdon: "2021-11-22 00:00:00",
          //         entrydetailid: item.entrydetailid,
          //         entryid: item.entryid,
          //         entrytype: item.entrytype,
          //         id: item.id,
          //         inaltqty: item.inaltqty,
          //         inqty: item.inqty,
          //         itemid: item.itemid,
          //         mrp: item.mrp,
          //         outaltqty: item.outaltqty,
          //         outqty: item.outqty,
          //         stockid: item.stockid,
          //         storeid: item.storeid
          //       },
          //       {
          //         batchdetailid: 1635,
          //         batchid: item.batchid,
          //         createdon: "2021-11-22 00:00:00",
          //         entrydetailid: item.entrydetailid,
          //         entryid: item.entryid,
          //         entrytype: item.entrytype,
          //         id: item.id,
          //         inaltqty: "0.00",
          //         inqty: "2.00",
          //         itemid: 4,
          //         mrp: "200.00",
          //         outaltqty: "0.00",
          //         outqty: "1.00",
          //         stockid: 3775,
          //         storeid: 1
          //       }
          //     ],              
          //     alteredon: "2021-11-22 14:49:18",   // new
          //     batchdate: "2021-11-22 00:00:00",
          //     batchid: 44,
          //     batch_id: "78f90846-e506-4a41-ab5e-8fa367a97b6c",
          //     batchno: "PRIMARY",
          //     batch_number: "BN- 222",
          //     branchid: 1,
          //     createdon: "2021-11-22 14:49:18",    // new
          //     editlog: null,
          //     expirydate: null,
          //     id: 44,
          //     iscancelled: false,
          //     itemid: 1362,
          //     item_code: "TR-929689361101",
          //     item_name: "TR-929689361101-VWV T2 QFS HPF 15W 220-240V B22 WW",
          //     lotno: "LOT-TR-929689361101165829852116300074",
          //     manufacturingdate: null,
          //     seriescode: null,
          //     seriesid: null,
          //     seriesno: null
          //   }
          // }

          //  s

          return datain;
        });
        let dataDetail = [];
        res.data.Result.map((item) => {
          dataDetail = [...dataDetail, ...item.BatchDetail];
          return item;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("BatchMaster")
            .first()
            .then()
            .catch((err) => console.log(err));

          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "BatchMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.BatchMaster.bulkAdd(data);
              await db.BatchDetail.bulkAdd(dataDetail);
            }
          } else {
            await db.mastertables.add({
              tablename: "BatchMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.BatchMaster.bulkAdd(data);
            await db.BatchDetail.bulkAdd(dataDetail);
          }
        } else {
          console.log("no more BatchMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "BatchMaster");
  }
};

export const SerialMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/SerialMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      
      console.log(res, 'res of Serial Master API')
      var rr = await res.data.Result;

      // await Promise.all(rr.map(async r => {
      //   await Promise.all(await r.SerialDetail.map(async s => {
      //     if(s.batchdetailid){
      //       console.log(s.batchdetailid, 'SerialDetail');
      //     }
      //   }))
      // })) 

      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            serialid: item.serialid,
            serialno: item.serialno,
            uniqueserialno: item.uniqueserialno,
            manualbatchno: item.manualbatchno,
            itemid: item.itemid,
            branchid: item.branchid,
            warrentydate: item.warrentydate,
            expirydate: item.expirydate,
            serialcreatedfrom: item.serialcreatedfrom,
            seriesid: item.seriesid,
            seriesno: item.seriesno,
            seriescode: item.seriescode,
            editlog: item.editlog,
            iscancelled: item.iscancelled,
            isstock: item.isstock,
            createdon: item.createdon,
            alteredon: item.alteredon,
          };
          return datain;
        });
        let dataDetail = [];
        res.data.Result.map((item) => {
          dataDetail = [...dataDetail, ...item.SerialDetail];
          return item;
        });
        if (data && data.length > 0) {
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("SerialMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "SerialMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.SerialMaster.bulkAdd(data);
              await db.SerialDetail.bulkAdd(dataDetail);
            }
          } else {
            await db.mastertables.add({
              tablename: "SerialMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.SerialMaster.bulkAdd(data);
            await db.SerialDetail.bulkAdd(dataDetail);
          }
        } else {
          console.log("no more BatchMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "BatchMaster");
  }
};
export const ProfileMaster = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/ProfileMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      // const setting = await db.globelsetting
      //   .where("globsettingid")
      //   .equals(540)
      //   .first();
      // console.log("aijajkhan", res)
      const glbCount = await globalCount();
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            principalCode: item.Code,
            headOfficeCode: item.HeadofficeCode,
            locationCode: item.LocationCode,
            syncMode: item.Syncmode,
            headOfficeName: item.HeadofficeName,
            isActive: item.isactive,
            address: item.Address,
            pinCode: item.Pincode,
            email: item.Email,
            contact1: item.ContactNo,
            contact2: item.PhoneNo,
            allowItemCreation: item.allowItemCreation,
            allowItemAlternation: item.allowItemAlternation,
            allowLedgerCreation: item.allowLedgerCreation,
            allowLedgerAlternation: item.allowLedgerAlternation,
          };
          return datain;
        });
        if (data && data.length > 0) {
          console.log("data", data)
          const altdates = data.map((d) => {
            return d.alteredon;
          });
          const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("ProfileMaster")
            .first()
            .then()
            .catch((err) => console.log(err));
          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "ProfileMaster",
              recordcount: tbl.recordcount,
              alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.ProfileMaster.bulkAdd(data);
            }
          } else {
            await db.mastertables.add({
              tablename: "ProfileMaster",
              recordcount: res.data.recordcount,
              alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });
            await db.ProfileMaster.bulkAdd(data);
          }
        } else {
          console.log("no more GodownMaster data");
        }
      }
    });
  } catch (error) {
    console.log(error, "ProfileMaster");
  }
};
export const CompanySettings = async (obj) => {
  try {
    const config = { headers: { token: localStorage.getItem("token") } };
    let api = "/api/CompanyMaster/List";
    axios.post(api, obj, config).then(async (res) => {
      const setting = await db.globelsetting
        .where("globsettingid")
        .equals(540)
        .first();
      console.log("setting", setting)
      const glbCount = await globalCount();
      console.log("res.data.Result", res)
      if (res.data && res.data.Result) {
        const data = res.data.Result.map((item) => {
          let datain = {
            CompanyName: item.companyname,
            CompanyShortName: item.companyshortname,
            Address: item.address,
            City: item.cityid,
            State: item.stateid,
            Country: item.countryid,
            PinCode: item.pincode,
            Contact1: item.contactnumber1,
            Contact2: item.contactnumber2,
            FaxNo: item.faxnumber,
            Currency: item.currencyid,
            RegisterDate: item.registrationdate,
            RegisterNo: item.registrationnumber,
            WebUrl: item.url,
            LicenceNo: item.licenceno,
            companylogo: item.companylogo,
            Email: item.emailid,
            TallyIpAndPort: item.tally_ip,
            TallyCompanyname: item.tally_company,
          };
          return datain;
        });
        if (data && data.length > 0) {
          // console.log("aijajdatares--", data)
          // const altdates = data.map((d) => {
          //   return d.alteredon;
          // });
          // console.log("altdates", altdates)

          // const altlatestdate = max_date(altdates);
          const tbl = await db.mastertables
            .where("tablename")
            .equals("CompanySettings")
            .first()
            .then()
            .catch((err) => console.log(err));

          const hitcountvalue =
            res.data.recordcount < parseInt(glbCount)
              ? 0
              : res.data.recordcount / parseInt(glbCount);
          console.log("tbl", tbl)

          if (tbl) {
            let i = parseInt(tbl.pageindexno) + 1;
            await db.mastertables.put({
              id: tbl.id,
              tablename: "CompanySettings",
              recordcount: tbl.recordcount,
              // alteredon: altlatestdate,
              pageindexno: i,
              hitcount: tbl.hitcount,
            });
            if (tbl.pageindexno < tbl.hitcount) {
              await db.CompanySettings.bulkAdd(data);
            }
            console.log("tbl2", tbl)
          } else {
            console.log("res.data.recordcount", res.data)
            await db.mastertables.add({
              tablename: "CompanySettings",
              recordcount: res.data.recordcount,
              // alteredon: altlatestdate,
              pageindexno: 1,
              hitcount: hitcountvalue < 1 ? 0 : Math.ceil(hitcountvalue),
            });

            await db.CompanySettings.bulkAdd(data);
          }
        } else {
          console.log("no more ProfileSettings data");
        }
      }
    });
  } catch (error) {
    console.log(error, "CompanySettings");
  }
};
const max_date = (all_dates) => {
  var max_dt = all_dates[0],
    max_dtObj = new Date(all_dates[0]);
  all_dates.forEach(function (dt, index) {
    if (new Date(dt) > max_dtObj) {
      max_dt = dt;
      max_dtObj = new Date(dt);
    }
  });
  return max_dt;
};
const globalCount = async () => {
  const setting = await db.globelsetting
    .where("globsettingid")
    .equals(540)
    .first();
  if (setting) {
    return setting.value;
  } else {
    return 2000;
  }
};
