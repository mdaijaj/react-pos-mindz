import "./datasync.css";
import testAction from "../../src/redux/action/testAction";
import { useSelector, useDispatch } from "react-redux";
import Dexie from "dexie";
const axios = require("axios");
require("dotenv").config();

function DataSync() {
  const dispatch = useDispatch();
  const checkTest = () => {
    dispatch(testAction);
  };

  // const userLogin = () => {
  //   let data = {
  //     UserName: "test3",
  //     Password: "sq0qBx48VcfKufMP/nFB1jU3uruu6g6apNBVnq1iiPU=",
  //     WebUrl: "pos",
  //   };

  //   let api = "/api/AuthLogin/SignIn";
  //   axios.post(api, data).then((res) => {
  //     console.log(res.headers.token);
  //     if (res.headers.token) {
  //       localStorage.setItem("token", res.headers.token);
  //       return true;
  //     }
  //   });
  // };

  // const ActionLink = () => {
  //   const db = new Dexie("posdb");
  //   db.version(1).stores({ userLogin: "++id,name,age" });
  //   db.transaction("rw", db.userLogin, async () => {
  //     // Make sure we have something in DB:
  //     if ((await db.userLogin.where({ name: "Josephine" }).count()) === 0) {
  //       const id = await db.userLogin.add({ name: "Josephine", age: 31 });
  //       alert(`Addded friend with id ${id}`);
  //     }
  //     // Query:
  //     const youngFriends = await db.userLogin.where("age").below(25).toArray();
  //     // Show result:
  //     alert("My young friends: " + JSON.stringify(youngFriends));
  //   });
  //   console.log("reach");
  // };

  // const Login = () => {
  //   const db = new Dexie("posdb");
  //   db.open();
  //   db.version(1).stores({ friends: "++id,name,age" });
  //   db.transaction("rw", db.friends, async () => {
  //     // Make sure we have something in DB:
  //     if ((await db.friends.where({ name: "Josephine" }).count()) === 0) {
  //       const id = await db.friends.add({ name: "Josephine", age: 21 });
  //       alert(`Addded friend with id ${id}`);
  //     }
  //     // Query:
  //     const youngFriends = await db.friends.where("age").below(25).toArray();
  //     // Show result:
  //     alert("My young friends: " + JSON.stringify(youngFriends));
  //   });
  //   console.log("reach");
  // };

  // const syncItemMaster = async () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     itemMaster:
  //       "++id,HSNMapping,ItemCode,ItemName,GroupId,GroupName,UnitId,UnitName,AltUnitId,AltUnitName,Conversion,Denominator,ItemCategory,ItemCategoryName,IsActive,IsLotEnable,CreatedBy,CreatedByName,EditLog,CreatedOn,IsTaxInclusive,PrintName",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/ItemMaster/List/0";
  //   axios.get(api, config).then((res) => {
  //     console.log(res.data.result.Result);
  //     db.itemMaster.bulkPut(res.data.result.Result);
  //   });
  // };

  // const syncCustomerMaster = async () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     customerMaster:
  //       "++Id,LedgerCode,LedgerName,Address,Phone1,Phone2,ContactPerso,Email,Pincode,SalesPersonId,LedgerGroup,LocationCode,CreatedBy,CreatedByName,EditLog,CreatedOn,LedgerType",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/LedgerMaster/List/1/0";
  //   //  api/LedgerMaster/List/{LedgerType:Int}/{Pageno:int}
  //   axios.get(api, config).then((res) => {
  //     db.customerMaster.bulkPut(res.data.result.Result);
  //   });
  // };

  // const syncVendorMaster = async () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     customerMaster:
  //       "++Id,LedgerCode,LedgerName,Address,Phone1,Phone2,ContactPerso,Email,Pincode,SalesPersonId,LedgerGroup,LocationCode,CreatedBy,CreatedByName,EditLog,CreatedOn,LedgerType",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/LedgerMaster/List/2/0";
  //   //  api/LedgerMaster/List/{LedgerType:Int}/{Pageno:int}
  //   axios.get(api, config).then((res) => {
  //     db.customerMaster.bulkPut(res.data.result.Result);
  //   });
  // };

  // const syncHsnMaster = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     hsnMaster:
  //       "++Id,IGST,Code,HsnCode,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/HsnMaster/List/0";
  //   axios.get(api, config).then((res) => {
  //     db.hsnMaster.bulkPut(res.data.result.Result);
  //     console.log("res from unit master", res);
  //   });
  // };

  // const syncItemGroup = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     itemGroup:
  //       "++Id,GroupCode,GroupName,ParentGroupId,ParentGroupCode,ParentGroupName,CreatedBy,CreatedByName,EditLog,CreatedOn",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/ItemGroup/List/0";
  //   axios.get(api, config).then((res) => {
  //     console.log("res from unit master", res.data.result.Result);
  //     db.itemGroup.bulkPut(res.data.result.Result);
  //     console.log("res from unit master", res);
  //   });
  // };

  // const syncUnitMaster = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     unitMaster:
  //       "++Id,UnitSymbol,UnitName,DecimalDigit,CreatedBy,CreatedByName,EditLog,CreatedOn",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/UnitMaster/List/0";
  //   axios.get(api, config).then((res) => {
  //     db.unitMaster.bulkPut(res.data.Result);
  //   });
  // };
  // const syncattributeMaster = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     attributeMaster:
  //       "++Id,AttributeName,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn,Value",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/AttributeMaster/List/";
  //   axios.get(api, config).then((res) => {
  //     console.log("responsAttr ", res.data.result.Result);
  //     db.attributeMaster.bulkPut(res.data.result.Result);
  //     console.log("res from unit master", res);
  //   });
  // };

  // const syncCityMaster = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     cityMaster: "++id,CityId,CityCode,CityName,StateId,StateName",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/CityMaster/List/0";
  //   axios.get(api, config).then((res) => {
  //     console.log(res.data.result.Result);
  //     db.cityMaster.bulkPut(res.data.result.Result);
  //     console.log("res from unit master", res);
  //   });
  // };

  // const syncStateMaster = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     stateMaster:
  //       "++id,StateId,StateCode,StateName,CountryId,CountryName,IsActive",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/StateMaster/List/0";
  //   axios.get(api, config).then((res) => {
  //     console.log(res.data.result.Result);
  //     db.stateMaster.bulkPut(res.data.result.Result);
  //     console.log("res from unit master", res);
  //   });
  // };

  // const syncledgerGroupMaster = () => {
  //   var db = new Dexie("posdb");
  //   db.version(1).stores({
  //     ledgerGroupMaster:
  //       "++Id,GroupCode,GroupName,ParentGroupId,ParentGroupName,NatureOfGroupId,NatureOfGroupName",
  //   });
  //   const config = { headers: { token: localStorage.getItem("token") } };
  //   let api = "/api/LedgerGroupMaster/List/0";
  //   axios.get(api, config).then((res) => {
  //     console.log(res.data.result.Result);
  //     db.ledgerGroupMaster.bulkPut(res.data.result.Result);
  //     console.log("res from unit master", res);
  //   });
  // };

  // const dbCreations = () => {
  //   const db = new Dexie("posdb");
  //   db.version(1).stores({
  //     customerMaster:
  //       "++Id,LedgerCode,LedgerName,Address,Phone1,Phone2,ContactPerso,Email,Pincode,SalesPersonId,LedgerGroup,LocationCode,CreatedBy,CreatedByName,EditLog,CreatedOn,LedgerType",
  //     userLogin: "++id,name,userId,password",
  //     itemMaster:
  //       "++id,HSNMapping,ItemCode,ItemName,GroupId,GroupName,UnitId,UnitName,AltUnitId,AltUnitName,Conversion,Denominator,ItemCategory,ItemCategoryName,IsActive,IsLotEnable,CreatedBy,CreatedByName,EditLog,CreatedOn,IsTaxInclusive,PrintName",
  //     hsnMaster:
  //       "++Id,IGST,Code,HsnCode,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn",
  //     itemGroup:
  //       "++Id,GroupCode,GroupName,ParentGroupId,ParentGroupCode,ParentGroupName,CreatedBy,CreatedByName,EditLog,CreatedOn",
  //     unitMaster:
  //       "++Id,UnitSymbol,UnitName,DecimalDigit,CreatedBy,CreatedByName,EditLog,CreatedOn",
  //     attributeMaster:
  //       "++Id,AttributeName,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn,Value",
  //     stateMaster:
  //       "++id,StateId,StateCode,StateName,CountryId,CountryName,IsActive",
  //     cityMaster: "++id,CityId,CityCode,CityName,StateId,StateName",
  //     ledgerGroupMaster:
  //       "++Id,GroupCode,GroupName,ParentGroupId,ParentGroupName,NatureOfGroupId,NatureOfGroupName",
  //   });

  //   db.transaction("rw", db.customerMaster, async () => { });
  //   console.log("reach");
  // };
  // const salesInvoice = () => {
  //   const db = new Dexie("posdb");
  //   db.version(1).stores({ friends: "++id,name,age" });
  //   db.transaction("rw", db.friends, async () => {
  //     // Make sure we have something in DB:
  //     if ((await db.friends.where({ name: "Josephine" }).count()) === 0) {
  //       const id = await db.friends.add({ name: "Josephine", age: 21 });
  //       alert(`Addded friend with id ${id}`);
  //     }
  //     // Query:
  //     const youngFriends = await db.friends.where("age").below(25).toArray();
  //     // Show result:
  //     alert("My young friends: " + JSON.stringify(youngFriends));
  //   });
  //   console.log("reach");
  // };

  const data = useSelector((state) => state.testReducer);
  return (
    <>
    <h1>hello</h1>
    </>
  );
}

export default DataSync;
