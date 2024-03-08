import React, { useState, useEffect } from "react";
import Form from "./ItemMaster_form.js";
import db from "../../../datasync/dbs";
import {
  ItemMaster_obj,
  GSTClassification_obj,
  indexDB_default_store,
} from "./store";
import validate from "../../common/validate.js";

const ItemMaster = ({pageNav}) => {
  // ## states
  // For defining Method for API(s)
  const [method, setMethod] = useState("");
  const requiredField = {
    ItemCode: "",
    ItemName: "",
    UnitName: "",
    Denominator: "",
    Conversion: "",
    GroupId: "",
  };
  // To-maintain icons state
  let [val, setVal] = useState("");
  let [errorObj, setErrorObj] = useState(requiredField);

  // To-store data from indexDB
  let [idb, setIdb] = useState(indexDB_default_store);
  const [disabledAction, setDisabledAction] = useState({
    add:pageNav.AllowNew === false ? "disable":"",
    view:pageNav.AllowView === false ? "disable":"",
    edit:pageNav.AllowEdit === false ? "disable":"",
    authorize:pageNav.AllowAuthorize === false ? "disable":"",
    print:pageNav.AllowPrint === false ? "disable":"",
  });
  // // For storing input fields data
  let [data, setData] = useState(ItemMaster_obj);

  // For storing input fields data for gst classification
  let [gst_data, setGSTData] = useState(GSTClassification_obj);

  // To render gst_data in table on view click
  let [gst_table, set_gst_table] = useState([]);

  // To get data from indexDB
  const get_data = async () => {
    let result;
    result = await db.unitMaster.toArray();
    idb = { ...idb, UnitMaster: result };
    // result = await db.attributeMaster.toArray();
    // idb = { ...idb, AttributeMaster: result };
    result = await db.hsnMaster.toArray();
    idb = { ...idb, HsnMaster: result };
    result = await db.itemGroup.toArray();
    idb = { ...idb, ItemGroup: result };
    result = await db.itemMaster.toArray();
    idb = { ...idb, ItemMaster: result };
    setIdb({ ...idb });
    console.log(result);
  };

  // To change icons state
  const change_state = (arg) => {
    if (arg === "add") {
      setVal(arg);
      setData(ItemMaster_obj);
      get_data();
      setErrorObj(requiredField);
      return;
    }

    if (arg === "edit") {
      setVal(arg);
      setData(ItemMaster_obj);
      get_data();
      setMethod("view_edit");
      setErrorObj(requiredField);
      return;
    }

    if (arg === "view") {
      setVal(arg);
      setData(ItemMaster_obj);
      get_data();
      setMethod("view_edit");
      setErrorObj(requiredField);
      return;
    }

    if (arg === "save") {
      console.log(errorObj, "object");
      const objKey = Object.keys(errorObj);
      const objVal = Object.values(errorObj);
      const resVal = objVal.filter((a) => a === "" || a === true);
      if (resVal.length > 0) {
        var result = {};
        objKey.forEach(
          (key, i) =>
            (result[key] =
              objVal[i] === "" || objVal[i] === true ? true : false)
        );
        setErrorObj(result);
        return false;
      } else {
        let value;

        data.BillingUnit = data.UnitAltName === data.BillingUnit ? 1 : 0;

        // for replacing group name with id
        value = idb.ItemGroup.find((val) => val.GroupName === data.GroupId);
        data.GroupId = value.Id;

        // for replacing Unit Name with id
        value = idb.UnitMaster.find((val) => val.UnitSymbol === data.UnitName);
        data.UnitName = value.Id;

        // for replacing Unit Alt Name with id
        value = idb.UnitMaster.find(
          (val) => val.UnitSymbol === data.UnitAltName
        );
        data.UnitAltName = value ? value.Id : data.UnitName;

        if (gst_data.HsnId) {
          // for replacing HsnCode with id
          value = idb.HsnMaster.find((val) => val.Code == gst_data.HsnId);
          gst_data.HsnId = value.Id;
          // for assigning same itemid in itemmaster and gstClassification
          gst_data.ItemId = data.ItemId;
        }
      }

      if (data.GSTClassification) {
        if (data.new)
          data = gst_data.HsnId
            ? {
                ...data,
                GSTClassification: [...data.GSTClassification, { ...gst_data }],
              }
            : data;
        else
          data = gst_data.HsnId
            ? {
                ...data,
                update: "true",
                GSTClassification: [...data.GSTClassification, { ...gst_data }],
              }
            : { ...data, update: "true" };
        setData({ ...data });
        saveUpdate();
        //console.log('exist data', data) //Dev
        return;
      } else {
        // For adding unique id and a "new or update key-value" in data - item master data
        let unique = idb.ItemMaster.map((val) => val.Id);
        unique = unique.sort((a, b) => b - a);
        data = gst_data.HsnId
          ? {
              ...data,
              new: "true",
              Id: unique.length > 0 ? unique[0] + 1 : 1,
              GSTClassification: [{ ...gst_data }],
            }
          : {
              ...data,
              new: "true",
              Id: unique.length > 0 ? unique[0] + 1 : 1,
              GSTClassification: [],
            };
        setData({ ...data });
        saveNew();
        // console.log('new data', data) //Dev
        return;
      }
    }

    if (arg === "refresh") {
      setVal("");
      setMethod("");
      setData(ItemMaster_obj);
      setGSTData(GSTClassification_obj);
      set_gst_table([]);
      setIdb(indexDB_default_store);
      setErrorObj(requiredField);
      return;
    }
  };

  // To update data in indexDB
  const saveUpdate = async () => {
    console.log("update");
    data.update = 1;
    // data.new=0;
    await db.itemMaster.put(data);
    change_state("refresh");
  };

  // To save data in indexDB
  const saveNew = async () => {
    console.log("new");
    data.new = 1;
    data.update = 0;
    await db.itemMaster.add(data);
    change_state("refresh");
  };

  // To get value from autocomplete after ctrl+L - for item code and item Name
  const sett = (value_) => {
    console.log(value_, 'item_master in item_master_form sett function for itemcode value')
    const objKey = Object.keys(errorObj);
    var result = {};
    objKey.forEach((key) => (result[key] = value_[key] === "" ? true : false));
    setErrorObj(result);
    //console.log(temp_data);
    console.log("RRRR");
    let temp_data = value_;
    let get_val;

    get_val = idb.ItemGroup.find((val) => val.Id === temp_data.GroupId);
    //console.log(get_val)
    temp_data.GroupId = get_val.GroupName;

    get_val = idb.UnitMaster.find((val) => val.Id === temp_data.UnitName);
    temp_data.UnitName = get_val.UnitSymbol;

    get_val = idb.UnitMaster.find((val) => val.Id === temp_data.UnitAltName);
    temp_data.UnitAltName = get_val.UnitSymbol;

    temp_data.BillingUnit =
      temp_data.BillingUnit === 1 ? temp_data.UnitAltName : temp_data.UnitName;

    gst_table = temp_data.GSTClassification.map((val) => {
      let temp = {
        HSNCode: "",
        HSNName: "",
        ApplicableDate: val.ApplicableDate,
      };
      let { HsnName, Code } = idb.HsnMaster.find(
        (value) => value.Id === val.HsnId
      );
      temp.HSNCode = Code;
      temp.HSNName = HsnName;
      return temp;
    });

    set_gst_table([...gst_table]);

    setMethod("");

    setData({ ...temp_data });
  };

  // To catch GST input fields data and store in (gstData - state)
  const changeGstData = (e) => {
    let { name, value } = e.target;
    setGSTData({ ...gst_data, [name]: value });
  };

  // To catch input fields data and store in (data - state)
  const changeData = (e) => {
    /*
    if(e.target.name === "ItemCode" || e.target.name === "ItemName") {
      if(!e.target.value) {
        setMethod("view_edit");
      }
    }*/
    let { name, value } = e.target;
    let validateType = e.target.getAttribute("data-valid");
    if (validateType) {
      let checkValidate = validate(e.target.value, validateType);
      if (checkValidate) {
        setData({ ...data, [name]: value });
        setErrorObj({ ...errorObj, [name]: false });
      } else {
        setData({ ...data, [name]: value });
        setErrorObj({ ...errorObj, [name]: true });
      }
      if(e.target.name === "ItemCode" || e.target.name === "ItemName") {
        if(!e.target.value) {
          setMethod("view_edit");
        }
      }
    } else {
      if (name === "GroupId" || name === "UnitName") {
        if (value === "select" || value === "" || value === "Select") {
          setData({ ...data, [name]: value });
          setErrorObj({ ...errorObj, [name]: true });
        } else {
          setData({ ...data, [name]: value });
          setErrorObj({ ...errorObj, [name]: false });
        }
      }
      setData({ ...data, [name]: value });
    }
  };
  const checkEqual = (e) => {
    if (e.target.value < 0) {
      alert("invalid value");
      setData({ ...data, [e.target.name]: "" });
    } else {
      let Lname =
        e.target.name === "Denominator" ? data.Conversion : data.Denominator;
      if (e.target.value === Lname && e.target.value !== "") {
        alert("Where value and Conversion value can't be same");
        setData({ ...data, [e.target.name]: "" });
      }
    }
  };
  const checkInvalid = (e) => {
    if (e.target.value < 0) {
      alert("invalid value");
      setData({ ...data, [e.target.name]: "" });
    }
  };

  // Dev -  To check how many data you have created or updated
  // useEffect(() => {
  //   // example of - "new added and updated data only" in item master
  //   (async()=>{
  //     let dd
  //     dd = await db.itemMaster.where('new').equals('true').toArray()
  //     console.log('new data only',dd)
  //     dd = await db.itemMaster.where('update').equals('true').toArray()
  //     console.log(' update data only',dd)
  //   })()
  // },[])

  // To pass the props to CommonIcons
  const para = { val, change_state, disabledAction };

  // To pass the props to Form
  const prop_s = {
    para,
    data,
    gst_data,
    changeData,
    changeGstData,
    idb,
    method,
    gst_table,
    sett,
    errorObj,
    checkEqual,
    checkInvalid,
  };

  return <div style={{display:pageNav.hide === true ? "none":"block"}}><Form {...prop_s}/></div>;
};

export default ItemMaster;
