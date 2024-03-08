import "./stockGeneral.scss";
import CommonFormAction from "../../common/commonFormAction";
import calenderIcon from "../../../images/icon/calender.svg";
import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import coulmn from "./tableCoulmn";
import CustomTable from "../../common/table";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  updateStockIndDb,
  updateStockIndDbUpdate,

  getItemstockQtyindexDb // added for popup from purchase invoice
} from "../../common/commonFunction";

// P Starts, added for popup from purchase invoice
import column_popup from "../purchaseInvoice/tableCoulmn_popup";
import { getTaxesByItemObj, getPercentCalc, getAndSetTaxOrAmount, fixedToLength } from "../purchaseInvoice/commonfunction";

// P Ends, added for popup from purchase invoice
const StockGeneral = ({ pageNav }) => {
  // P Starts, added for popup from purchase invoice
  const reqObj = {
    InvoiceNo: "",
    InvoiceDate: "",
    vendorCode: "",
    vendorName: "",
  };
  const [requiredObj, setRequiredObj] = useState(reqObj);
  
  // Changed obj to Obj, remark to Remark
  
  const Obj = {
    InvoiceNo: "",
    InvoiceDate: "",
    PartyId: "",
    vendorCode: "",
    vendorName: "",
    invoicetype: 0,
    vendorList: [],
    invoiceList: [],
    taxpage: {
      grossamount: "0.00",
      discountamount: "0.00",
      taxamount: "0.00",
      netamount: "0.00",
      roundOff: "0.00",
      totalAmount: "0.00",
      igstAmount: "0.00",
      cgstAmount: "0.00",
      sgstAmount: "0.00",
    },
    billingcountryid: "",
    billingstateid: "",
    billingaddress: "",
    billinggstinno: "",
    shippingcountryid: "",
    shippingstateid: "",
    shippingaddress: "",
    shippinggstinno: "",
    CreatedBy: localStorage.getItem("UserId"),
    CreatedByName: localStorage.getItem("fname"),
    // remark: "",
    dncn_against_pi: "",
    itemList: [],
    items: [],
    stateList: [],
    BatchNumberDetail: '',
    SerialNumberDetail: '',
    godown: '',
    godownId: 0,
    transactionNo: "", //added new from here
    sgDate: "", // added new from here
    Remark: "", // added new from here
    TrList: [], // added new from here
  };

  const itemObj = {
    InvoiceId: "",
    ItemId: "",
    ItemName: "",
    unit: "",
    isaltrate: "",
    Quantity: "",
    altqty: "",
    Rate: "",
    Amount: "",
    totalAmount: "",
    finalDiscount: "",
    DiscountPer: "",
    DiscountAmount: "",
    hsnclassificationid: "",
    igstrate: 0,
    cgstrate: 0,
    sgstrate: 0,
    igstamount: 0,
    cgstamount: 0,
    sgstamount: 0,
  };

  // P Ends, added for popup from purchase invoice

  const obj = {
    transactionNo: "",
    sgDate: "",
    Remark: "",
    items: [],
    itemList: [],
    TrList: [],
  };

  

  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState(Obj);
  const [edit, setEdit] = useState();
  const [refreshtbl, setRefreshtbl] = useState(false);
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [saveEdit, setSaveEdit] = useState(false);
  const [updatedObj, setUpdatedObj] = useState();
  const [codeFocus, setCodeFocus] = useState(false);
  const [addbtn, setAddbtn] = useState(false);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);

  // Pop-up useState starts 
  const [open, setOpen] = useState(false);
  const [selectedItemRow, setSelectedItemRow] = useState();
  const [itemList, setItemList] = useState();
  const [checkedItem, setCheckedItem] = useState();
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [updateEvent, setUpdateEvent] = useState();


  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });

  const [batchModalShow, setBatchModalShow] = useState(false);
  const [serialModalShow, setSerialModalShow] = useState(false);
  // Pop-up useState ends 


  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.AdjustmentMaster.toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        //let val = {...series,digit:5,dbcount:count}
        let sr = await getseriesNo(val, pageNav.formid);
        genTransactionNo(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count = await db.AdjustmentMaster.toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      genTransactionNo(sr);
    } else {
      let count = await db.AdjustmentMaster.toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      genTransactionNo(sr);
    }
    setVoucherStatus(false);
  };
  const genTransactionNo = async (transactionNo) => {
    const res = await db.itemMaster.toArray();
    setCreateObj({
      ...createObj,
      transactionNo: transactionNo,
      sgDate: new Date(),
      itemList: res,
    });
  };
  const reset = () => {
    setCreateObj(Obj);
    setSaveEdit(false);
    setRefreshtbl(true);
  };
  const addItem = () => {
    if (addbtn === true && createObj.items.length > 0) {
      alert("please add item detail");
    } else {
      const ItemObj = {
        staticid: createObj.items.length + 1,
        ItemName: "",
        ItemCode: "",
        baseUnit: "",
        altUnit: "",
        MRP: 0,
        QuantityIn: 0,
        QuantityOut: 0,
      };
      let items = [...createObj.items, { ...ItemObj }];
      setCreateObj({ ...createObj, items: items });
      setAddbtn(true);
    }
  };
  const change_state = (arg) => {
    switch (arg) {
      case "view": {
        setVal(arg);
        setRefreshtbl(false);
        setSaveEdit(false);
        getTrlist();
        setEditcoulmn(false);
        return;
      }
      case "edit": {
        setRefreshtbl(false);
        setSaveEdit(true);
        setEditcoulmn(true);
        setVal(arg);
        getTrlist();

        return;
      }
      case "refresh": {
        setVal(arg);
        setCreateObj(Obj);
        setSaveEdit(false);
        setRefreshtbl(true);
        return;
      }
      case "add": {
        getoucherList();
        setSaveEdit(false);
        setRefreshtbl(false);
        setEditcoulmn(true);
        setVal(arg);
        return;
      }
      case "save": {
        if (createObj.items.length < 1) {
          alert("please add at least one item");
        } else if (createObj.items.length > 0) {
          const fl = createObj.items.filter(
            (a) => a.ItemName !== "" && a.QuantityIn > 0
          );
          if (fl.length > 0) {
            saveData();
          } else {
            alert(
              "please add item and Item Detail item name and Quantity (+) required"
            );
          }
        }

        return;
      }
      default:
        return arg;
    }
  };
  const onchange = (e) => {
    setCreateObj({ ...createObj, [e.target.name]: e.target.value });
  };
  const getTrlist = async () => {
    let userID = localStorage.getItem("UserId");
    const res1 = await db.AdjustmentMaster.toArray();
    const res = res1.filter((f) => f.CreatedBy === parseInt(userID));
    const reslist = await db.itemMaster.toArray();
    setCreateObj({ ...createObj, TrList: res, itemList: reslist });
  };
  const getTrNo = async (value) => {
    if (value) {
      setCodeFocus("");
      setDropDownOption("");
      let valueid =
        value.Id === "" || value.Id === null || value.Id === undefined
          ? value.id
          : value.Id;
      let res = await db.AdjustmentDetail.where("stockadjustmentid")
        .equals(valueid)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      // console.log(res,"ressssss");
      if (res) {
        let list = [];
        for (let item of res) {
          let proDetails = await db.itemMaster
            .where("ItemId")
            .equals(item.ItemId)
            .first()
            .then()
            .catch((err) => console.log(err));
          let unitName = await db.unitMaster
            .where("Id")
            .equals(proDetails.UnitName)
            .first();
          let AltunitName = await db.unitMaster
            .where("Id")
            .equals(proDetails.UnitAltName)
            .first();
          let itemobj = {
            id: item.id,
            ItemCode: proDetails === undefined ? "" : proDetails.ItemCode,
            ItemName: proDetails === undefined ? "" : proDetails.ItemName,
            baseUnit: unitName.UnitName,
            altUnit: AltunitName.UnitName,
            ItemId: item.ItemId,
            MRP: item.MRP,
            QuantityIn: item.QuantityIn,
            QuantityOut: item.QuantityOut,
          };
          list.push(itemobj);
        }
        let objDoc = {
          transactionNo: value.AdjusmentNo,
          sgDate: value.AdjusmentDate,
          Remark: value.Remarks,
          items: list,
        };
        setCreateObj({ ...createObj, ...objDoc });
      }
    }
  };
  const tblOptionGet = async (option) => {
    let unitName = await db.unitMaster
      .where("Id")
      .equals(option.UnitName)
      .first();
    let AltunitName = await db.unitMaster
      .where("Id")
      .equals(option.UnitAltName)
      .first();

    const array = createObj.items.map((a) => {
      return a.staticid === selectedTblRow.staticid
        ? {
            ...a,
            ItemName: option.ItemName,
            ItemCode: option.ItemCode,
            baseUnit: unitName.UnitName,
            altUnit: AltunitName.UnitName,
          }
        : a;
    });
    setCreateObj({ ...createObj, items: array });
    setUpdatedObj({
      ...updatedObj,
      ItemName: option.ItemName,
      ItemCode: option.ItemCode,
      ItemId: option.ItemId,
      baseUnit: unitName.UnitName,
      altUnit: AltunitName.UnitName,
    });
  };
  const removeItem = () => {
    // const res = createObj.items.filter((a) =>
    const res = selectedItems.filter((a) =>
      a.id !== undefined
        ? a.id !== selectedTblRow.id
        : a.staticid !== selectedTblRow.staticid
    );
    if (res) {
      const nArray = res.map((a, index) => {
        if (a.id === undefined) {
          return { ...a, staticid: index + 1 };
        } else {
          return a;
        }
      });
      setCreateObj({ ...createObj, items: nArray });
      // added
      setSelectedItems(nArray)
    }
  };
  const selectedRow = (item) => {
    setSelectedTblRow(item);
    if (edit) {
      if (selectedTblRow) {
        console.log(selectedTblRow, "selectedTblRow1");
        // const array = createObj.items.map((a) => {
          const array = selectedItems.map((a) => {
          return a.id !== undefined
            ? a.id === selectedTblRow.id
              ? { ...a, ...selectedTblRow }
              : a
            : a.staticid === selectedTblRow.staticid
            ? { ...a, ...selectedTblRow }
            : a;
        });
        setCreateObj({ ...createObj, items: array });
        // added
        setSelectedItems(array)
      }
    }
    setEdit(false);
  };
  const editItem = () => {
    setEdit(true);
  };
  const tableInputOnchange = (e) => {
    setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    return e.target.value;
  };
  const updateAction = useCallback(() => {
    const array = createObj.items.map((a) => {
      if (a.id === undefined) {
        return a.staticid === selectedTblRow.staticid
          ? { ...a, ...updatedObj }
          : a;
      } else {
        return a.id === selectedTblRow.id ? { ...a, ...updatedObj } : a;
      }
    });
    setCreateObj({ ...createObj, items: array });
    setEdit(false);
    setUpdatedObj();
    setAddbtn(false);
  }, [selectedTblRow, updatedObj, createObj]);
  /***********save data event */
  const saveItemData = async () => {
    const getId = await db.AdjustmentMaster.where("AdjusmentNo")
      .equals(createObj.transactionNo)
      .first()
      .then()
      .catch((err) => console.log(err));
    if (getId) {
      const Getitems = createObj.items.map((item) => {
        let objsaveitem = {
          stockadjustmentid: getId.id,
          ItemId: item.ItemId,
          MRP: parseInt(item.MRP),
          QuantityIn: parseInt(item.QuantityIn),
          QuantityOut: parseInt(item.QuantityOut),
        };
        if (!saveEdit) {
          return objsaveitem;
        } else {
          objsaveitem.id = item.id;
          return objsaveitem;
        }
      });
      const items = Getitems.filter((a) => a.ItemId !== "" && a.QuantityIn > 0);
      if (!saveEdit) {
        await db.AdjustmentDetail.bulkAdd(items)
          .then(function (additem) {
            if (additem) {
              alert("data save successfully");
              const x = items.map((c) => {
                const nObj = {
                  formId: pageNav.formid,
                  trId: getId.id,
                  ItemId: c.ItemId,
                  Inqty: c.QuantityIn,
                  Outqty: c.QuantityOut,
                  type: "stockG",
                };
                return nObj;
              });
              updateStockIndDb(x);
              reset();
              setVal("save");
            }
          })
          .catch((err) => console.log(err));
      } else {
        await db.AdjustmentDetail.bulkPut(items).then(function (update) {
          if (update) {
            alert("data update successfully");
            const x = items.map((c) => {
              const nObj = {
                formId: pageNav.formid,
                trId: getId.id,
                ItemId: c.ItemId,
                Inqty: c.QuantityIn,
                Outqty: c.QuantityOut,
                type: "stockG",
              };
              return nObj;
            });
            updateStockIndDbUpdate(x);
            reset();
            setVal("save");
          }
        });
      }
    }
  };
  const saveData = async () => {
    const objsave = {
      AdjusmentNo: createObj.transactionNo,
      AdjusmentDate: createObj.sgDate,
      CreatedBy: parseInt(localStorage.getItem("UserId")),
      Remarks: createObj.Remark,
      CreatedOn: new Date(),
      new: 1,
      update: 0,
    };
    if (!saveEdit) {
      await db.AdjustmentMaster.add(objsave)
        .then(function (add) {
          if (add) {
            saveItemData();
          }
        })
        .catch((err) => console.log(err));
    } else {
      saveItemData();
    }
  };
  /***********save data event end*/
 





  // start______________________________________________________________
    const getItemDetailwithTax = async (arry) => {
      let newArr = await Promise.all(arry.map(async (a) => {
        const res = await getTaxesByItemObj(a);
        let hsnid = a.GSTClassification[0].HsnId;
        // let unitName = await getUnitName(a.ItemId).then(res => res);
        return {
          ...a,
          ItemName: a.ItemName,
          ItemId: a.ItemId,
          igstrate: res.igstRate,
          cgstrate: res.cgstRate,
          sgstrate: res.sgstRate,
          hsnid: hsnid,
          unitId: a.UnitName,
          unit: a.unit,
          Remark: "",
          RequiredQty: 0,
          RequiredAltQty: 0,
          Priority: "",
        }
      }))
      return newArr
    }








      // ----------------------
    const handleOpen = () => {
      setOpen(true);
    };
    /**
     *close Item popup
     */
    const handleClose = () => {
      setOpen(false);
      var elem = document.getElementById("options");
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    };
  
    const ObjItem = async (itemObj) => {
      let object = await getItemDetailwithTax(itemObj);
      // console.log(x,"array")
      // const object = itemObj.map((o) => {
      //   return {
      //     ...o,
      //     remark: "",
      //     RequiredQty: 0,
      //     RequiredAltQty: 0,
      //     Priority: "",
      //   };
      // });
      return object;
    };
  
    const getCheckedRows = (res) => {
      setGetcheckedRows(res);
    };
  
    const okSubmit = async () => {
      // console.log(getcheckedRows,'getcheckedRowsgetcheckedRowsgetcheckedRows');
      const ids = getcheckedRows.map((a) => {
        return a.ItemId;
      });
  
      const objget = await ObjItem(getcheckedRows);
      // console.log(objget,"ddddddddddd")
      // console.log(objget,'idsidsidsidsidsidsidsidsidsids')
      if (objget.length > 0) {
        if (ids) {
          setCheckedItem(ids);
  
          if (!selectedItems) {
            // let newArray =await getItemDetailwithTax(objget)
            setSelectedItems(objget);
          } else {
            const results = objget.filter(
              ({ ItemId: id1 }) =>
                !selectedItems.some(({ ItemId: id2 }) => id2 === id1)
            );
  
            const results2 = selectedItems.filter(
              ({ ItemId: id1 }) => !objget.some(({ ItemId: id2 }) => id2 === id1)
            );
            // console.log(results2,'resltlllllllll')
            if (results.length > 0) {
              setSelectedItems((prevArray) => [...prevArray, ...results]);
            }
            if (results2.length > 0) {
              const results3 = selectedItems.filter(
                ({ ItemId: id1 }) =>
                  !results2.some(({ ItemId: id2 }) => id2 === id1)
              );
              if (results3) {
                setSelectedItems(results3);
              }
            }
          }
        }
      }
      setOpen(false);
      var elem = document.getElementById("options");
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    };
  
    const updatedItemStock = async itemId => {
      const items = await db.PurchaseInvoiceDetail.where("ItemId")
        .equals(itemId)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      return items.length;
    }
  
    const getItems = async () => {
      let itemlist = await db.itemMaster.toArray();
      let productTemp = [];
      itemlist = await Promise.all(
        itemlist.map(async (item) => {
          let unitName = await db.unitMaster
            .where("Id")
            .equals(item.UnitName)
            .first();
          let itemGroup = await db.itemGroup.where("Id").equals(item.GroupId).first().then().catch(err => console.log(err));
          var itemStockCount = await getItemstockQtyindexDb(item.ItemId, null);
          // console.log(item.ItemId,'hhhhhhhhhhhhhh',itemStockCount,'ItemStock in getItems in PurchaseInvoice')
  
          // if(itemStockCount > 0){
          productTemp.push({
            ...item,
            id: item.Id,
            GroupName: itemGroup.GroupName,
            unit: unitName.UnitName,
            Stock: itemStockCount,
            // Stock: await updatedItemStock(item.Id),
          })
          // }
          return {
            ...item,
            id: item.Id,
            GroupName: itemGroup.GroupName,
            unit: unitName.UnitName,
            Stock: itemStockCount,
            // Stock: await updatedItemStock(item.Id),
          };
        })
      );
      var pTempSorted = productTemp.sort((a, b) => parseFloat(b.Stock) - parseFloat(a.Stock));
      setItemList(pTempSorted);
      // setItemList(itemlist);
    };
  
  
  
    const restData = () => {
      setCreateObj({ ...Obj, PurchaseInvoiceDate: new Date() });
      // setErrorObj(reqObj);
      setRequiredObj(reqObj);
      setVal("refresh");
      setUpdatedObj({});
      setEditcoulmn(false);
      setUpdateEvent(false);
      // setCustomerList();
      setSeriesandVoucher({
        seriesId: "",
        voucherId: "",
      });
      setCheckedItem([]);
      setSelectedItems([]);
    };
  
    // const selectedRow = (item) => {
    //   setSelectedItemRow(item);
    // };
  
  
  
    // const updateItem = useCallback(() => {
    //   // console.log(selectedItems, "selectedItems");
    //   // console.log(updatedObj, "updatedObj");
    //   // console.log(selectedItemRow, "updatedObj");
    //   const update = selectedItems.map((item) => {
    //     if (item.ItemId === selectedItemRow.ItemId) {
    //       return { ...item, ...updatedObj };
    //     } else {
    //       return item;
    //     }
    //   });
    //   setSelectedItems(update);
    //   setUpdatedObj({});
    // }, [updatedObj, selectedItemRow]);

    
    // useEffect(() => {
    //   const getKey = (e) => {
    //     if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
    //       e.preventDefault();
    //       setDropDownOption(codeFocus);
    //     }
  
    //     if (e.key === "Enter") {
    //       e.preventDefault();
    //       updateAction();
    //       // setEdit(false);
    //     }
    //   };
    //   window.addEventListener("keydown", getKey);
    //   return () => {
    //     window.removeEventListener("keydown", getKey);
    //   };
    // }, [createObj, selectedTblRow, codeFocus, updateAction]);


  
    useEffect(() => {
      const getKey = (e) => {
        if (codeFocus) {
          if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
            e.preventDefault();
            setDropDownOption(codeFocus);
          }
        }
        // if (e.key === "Enter" && batchModalShow == false &&  serialModalShow == false) {
        if ( e.key === "Enter" ) {
          e.preventDefault();
          // updateItem();
            updateAction();
          setEdit(false);
        }
        // myObj).length;
        // if(Object.keys(column.map(f => f.field == 'ItemName')).length > 0) {
          
            
          if (e.ctrlKey && (e.key === "f" || e.key === "F")) {
            e.preventDefault();
            if (val === "add" || val === "edit") {
              // alert('hiiiii');
              // if(ctrlF){
                    handleOpen();
              // }
            }
          }
        
        // }     
      };
      window.addEventListener("keydown", getKey);
      return () => {
            window.removeEventListener("keydown", getKey);
      };
    }, [
      val,
      createObj,
      codeFocus,
      itemList,
      getcheckedRows,
      checkedItem,
      selectedItems,
      selectedItemRow,
      updatedObj,
      edit,
      // errorObj, 
      requiredObj, // replace errObj with requireObj
      // customerList,
      updateEvent,
      selectedTblRow,
      updateAction
    ]);
  

    //end______________________________________________________








  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="stockGeneral"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="stockGeneralIn mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col col3 autoComp">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Transaction No" />.
                  </label>
                  {val === "view" || val === "edit" ? (
                    <Autocomplete
                      open={dropDownOption === "Transactionno" ? true : false}
                      options={createObj.TrList}
                      onChange={(e, value) => getTrNo(value)}
                      getOptionLabel={(option) => option.AdjusmentNo.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("Transactionno")}
                          onBlur={() => {
                            setCodeFocus("");
                            setDropDownOption("");
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="documentNo"
                      readOnly={true}
                      value={createObj && createObj.transactionNo}
                    />
                  )}
                </div>
              </div>
              <div className="col col3">
                <div className="formBox">
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Transaction Date" />
                  </label>
                  <DatePicker
                    selected={createObj && createObj.sgDate}
                    dropdownMode="select"
                    minDate={createObj && createObj.sgDate}
                    maxDate={createObj && createObj.sgDate}
                    // onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          { open && val !== "view" ? (
          <div className="modalPopUp">
              <div className="modalPopUPin">  
                <CustomTable
                  coulmn={column_popup}
                  data={itemList}
                  overFlowScroll={true}
                  checkbox={true}
                  selectedRows={checkedItem}
                  getCheckedItem={(res) => getCheckedRows(res)}
                  Footer={true}
                  filter={true}
                  // defaultFilterMethod={(filter, row) =>
                  //   String(row[filter.id]) === filter.value} //P
                />
                <div className="popupButton">
                  <button
                    onClick={() => okSubmit()}
                    className="btn btnGreen mr-5 mlAuto"
                  >
                    <Text content="Ok" />
                  </button>
                  <button onClick={() => handleClose()} className="btn btnRed">
                    <Text content="Cancel" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}              
                      

          <div className="row">
            <div className="col">
              <div className="tableBox">
                <CustomTable
                  coulmn={coulmn}
                  data={selectedItems}
                  // data={createObj.items} //old of this
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={createObj.itemList}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  // itemAdd={
                  //   val === "add" || val === "edit" ? () => addItem() : false
                  // }
                  refreshTable={refreshtbl}
                  editbtnText="Add Item detail"
                />

              
              </div>
            </div>
          </div>

          

          <div className="row">
            <div className="col w100">
              <div className="RemarkForm mb-2">
                <label htmlFor="">
                  <Text content="Remark" />
                </label>
                <textarea
                  name="Remark"
                  placeholder="Write remarks here"
                  onChange={(e) => onchange(e)}
                  value={createObj.Remark}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        {voucherStatus && (
          <div className="voucherPop">
            <div className="voucherPopin">
              <h3>
                <Text content="Voucher List" />
              </h3>
              <ul>
                { voucherList.map((a) => (
                    <li onClick={(e) => getVoucher(e, a)}>{a.VoucherName}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      
        

        



    </>
  );
};
export default StockGeneral;
