import "./stockGeneral.scss";
import CommonFormAction from "../../common/commonFormAction";
import calenderIcon from "../../../images/icon/calender.svg";
import { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
// import coulmn from "./tableCoulmn";
import CustomTable from "../../common/table";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  updateStockIndDb,
  updateStockIndDbUpdate,

  // P Starts
  getItemstockQtyindexDb,
  getBatchOrSerialNumber,
  getBatchOrSerialNumberById
} from "../../common/commonFunction";



// P Starts
import BatchModal from "../purchaseInvoice/BatchModal";
import SerialModal from "../purchaseInvoice/SerialModal";
import BatchParentListModal from "../purchaseInvoice/BatchParentListModal";
import ExistsModal from "../purchaseInvoice/ExistsModal";
import BatchChildDetailModal from "../purchaseInvoice/BatchChildDetailModal";
import BatchSerialDetailModal from "../purchaseInvoice/BatchSerialDetailModal";

// _____For Out Quantity
import SerialListModal from "../billPos/SerialListModal";
import BatchListModal from "../billPos/BatchListModal";




const StockGeneral = ({ pageNav }) => {
  const obj = {
    transactionNo: "",
    sgDate: "",
    Remark: "",
    items: [],
    itemList: [],
    TrList: [],
  };

  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState(obj);
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

  // P Starts
  const [batchNumberList, setBatchNumberList] = useState([]);
  const [serialNumberList, setSerialNumberList] = useState([]);
  const [batchChildNumberList, setBatchChildNumberList] = useState([]);


  
  const [batchModalShow, setBatchModalShow] = useState(false);
  const [serialModalShow, setSerialModalShow] = useState(false);
  const [batchSerialDetailModal, setBatchSerialDetailModal] = useState(false);
  const [quantityPut, setQuantityPut] = useState(false);
  const [serialQuantityPut, setSerialQuantityPut] = useState(false);
  const [BatchNumber, setBatchNumber] = useState({});
  const [childBatchNumber, setChildBatchNumber] = useState({});
  // const [batchChildNumberList, setBatchChildNumberList] = useState();
  
  
  const [altQty, setAltQty] = useState(0)
  const [SerialNumber, setSerialNumber] = useState('');
  const [CurrentSerialNumber, setCurrentSerialNumber] = useState('');

  const [currentBatchChildList, setCurrentBatchChildList] = useState('');
  const [batchChildDetailModal, setBatchChildDetailModal] = useState(false);



  var batch_number_list = [];


  //  console.log(serialNumberList,'serialNumberListserialNumberListserialNumberList')
  

  const [invoiceQuantity, setInvoiceQuantity] = useState(0);
  const [soldQuantity, setSoldQuantity] = useState(0);
  const [inQuantity, setInQuantity] = useState(false);
  const [outQuantity, setOutQuantity] = useState(false);
  const [ItemDetail, setItemDetail] = useState(null);
  const [BatchSubmit, setBatchSubmit] = useState(false);

  const [UnitName, setUnitName] = useState('');
  const [selectedGodown, setSelectedGodown] = useState(false);

  const [batchParentExistModal,setBatchParentExistModal] = useState(false);
  const [batchParentListModalShow,setBatchParentListModalShow] = useState(false);
  // console.log(BatchSubmit,'BatchSubmitBatchSubmitBatchSubmitBatchSubmit')

  const [choosenBatchParent, setChoosenBatchParent] = useState('');
  const [batchParentListOk, setBatchParentListOk] = useState(false);
  
  const [ctrlF, setCtrlF] = useState(false);
  const [enteredMRP,setEnteredMRP] = useState(false);
  const [mrpValue,setMRPValue] = useState('');
  const [godown, setGodown] = useState(null);
  // _____________For Out Quantity

  // console.log(data,'this is initialValue',initialValue,'this is index',index)
  // console.log(data,'datadatadata')
  // We need to keep and update the state of the cell normally
  // initialValue
  const [value, setValue] = useState();
  const [error, setError] = useState({});

  // P Starts for Out Quantity
  const [serialListModalShow, setSerialListModalShow] = useState(false)
  const [batchListModalShow, setBatchListModalShow] = useState(false)
  const [selectedSerialList, setSelectedSerialList] = useState(0)
  const [selectedBatchList, setSelectedBatchList] = useState([])
  const [batchNumberOfItem, setBatchNumberOfItem] = useState([])
  const [serialNumberOfItem, setSerialNumberOfItem] = useState([])
  const [BatchListSubmit,setBatchListSubmit] = useState(false)
  const [checkedSerialData,setCheckedSerialData] = useState([])

  const [purchasedBatchSerials, setPurchasedBatchSerials] = useState([]);

  
  


  

  useEffect(async () => {
    let result, newResult;
    result = await db.GodownMaster.toArray();
    newResult = result.map(data => {
      // return { value: data.Storename, label: data.Storecode };
      return { value: data.storeid + '|' + data.Storename, label: data.Storename };  //s
    })
      // console.log(newResult,'newResultnewResultnewResultnewResultnewResultnewResultnewResultnewResultnewResult');
    setGodown(newResult)
  }, [])

  const column = [
    { header: "Item Name", field: "ItemName", width: 250, cell: "autocomplete" },
    { header: "Item Code", field: "ItemCode", width: 250, cell: "autocomplete" },
    { header: "Base Unit", field: "baseUnit" },
    { header: "Alt Unit", field: "altUnit" },
    {
      header: "Godown Name",
      field: "godown",
      cell: "select",
      slOption: godown,
    },
    { header: "Stock", field: "stock" },
    { header: "MRP", field: "MRP", cell: "EditInput" },
    {
      header: "Quantity (+)",
      field: "QuantityIn",
      cell: "EditInput",
      width: 100,
    },
    {
      header: "Quantity (-)",
      field: "QuantityOut",
      cell: "EditInput",
      width: 100,
    },
  ];
  
  


  // P Ends

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
    console.warn(createObj,'ccccc obj');
  };

  const reset = () => {
    setCreateObj(obj);
    setSaveEdit(false);
    setRefreshtbl(true);
  };
  const addItem = () => {
    // if (addbtn === true && createObj.items.length > 0) {
    //   alert("please add item detail");
    // } else {
      const ItemObj = {
        staticid: createObj.items.length + 1,
        ItemId: "",
        ItemName: "",
        ItemCode: "",
        baseUnit: "",
        altUnit: "",
        MRP: 0,
        QuantityIn: 0,
        QuantityOut: 0,
        IsLot:"",
        IsSerial:"",
        godown:""
      };
      let items = [...createObj.items, { ...ItemObj }];
      setCreateObj({ ...createObj, items: items });
      console.warn(createObj,'createObj in addItem')
      setAddbtn(true);
    // }
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
        setCreateObj(obj);
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
        setInQuantity(false);
        setOutQuantity(false);
        return;
      }
      case "save": {
        console.log(createObj.items,'createObj.items in save')
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
    console.warn(userID,'userID getTrlist')
    const res1 = await db.AdjustmentMaster.toArray();
    const res = res1.filter((f) => f.CreatedBy === parseInt(userID));
    const reslist = await db.itemMaster.toArray();
    console.warn(reslist,'reslist in getTrlist')
    console.warn(res,'res in getTrlist')
    console.warn(res1,'res1 in getTrlist')
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
      console.log(res,"ressssss stockadjustmentid");
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
            ItemId:proDetails === undefined ? "" : proDetails.ItemCode,
            ItemCode: proDetails === undefined ? "" : proDetails.ItemCode,
            ItemName: proDetails === undefined ? "" : proDetails.ItemName,
            baseUnit: unitName.UnitName,
            altUnit: AltunitName.UnitName,
            ItemId: item.ItemId,
            MRP: item.MRP,
            QuantityIn: item.QuantityIn,
            QuantityOut: item.QuantityOut,
            godown:item.godown,
            IsLot:item.IsLot,
            IsSerial:item.IsSerial
            
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
    console.warn(option ,'option option in tblOptionGet')
    console.warn(createObj.items,'createObj.items in tblOptionGet')
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
    const res = createObj.items.filter((a) =>
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
    }
  };
  const selectedRow = (item) => { 
    console.log(item,'item in selectedRow')
    setSelectedTblRow(item);
    console.log(selectedTblRow,'item in selectedRow')
    if (edit) {
      if (selectedTblRow) {
        console.log(selectedTblRow, "selectedTblRow1");
        const array = createObj.items.map((a) => {
          return a.id !== undefined
            ? a.id === selectedTblRow.id
              ? { ...a, ...selectedTblRow }
              : a
            : a.staticid === selectedTblRow.staticid
            ? { ...a, ...selectedTblRow }
            : a;
        });
        setCreateObj({ ...createObj, items: array });
      }
    }
    setEdit(false);
  };
  const editItem = () => {
    setEdit(true);
  };

  // useEffect(
    const checkBatchExists =  async () => {
      const itemId = selectedTblRow && selectedTblRow.ItemId;
      console.log(itemId, 'item id from useeffect seelcted');
      if (itemId) {
        const pi = await db.PurchaseInvoiceDetail.where("ItemId")
          .equals(itemId)
          .toArray()
          .then()
          .catch((err) => console.log(err));
          const x = pi && pi.length > 0 ? true : false;
          if(x){
              setTimeout(() => {
                setBatchModalShow(false)
              }, 1001);
              
              setBatchParentExistModal(true);
          }
          return Promise.resolve(x);
      }
    }
    // ,[invoiceQuantity, batchModalShow])


    

  // P updated this function
  const tableInputOnchange = e => {
    
    // alert("tableInputOnchange")
    // if(BatchNumber.batch_number == '' && ["Rate","DiscountPer"].includes(e.target.name)){
    //   e.target.setAttribute("disabled", "disabled");
    // }
    console.log(e, ' e in change input')
    console.log(e.target, ' e target in change input')
    // if (e.target.name === 'ItemName') {
      // e.target.addEventListener("click", () => {
        //   // alert('kkkk')
        //   setCtrlF(true);
        // })
        // }
        if (e.target.name === 'MRP') {
          if (e.target.value != undefined && e.target.value != '') {
         setEnteredMRP(true);
        setMRPValue(e.target.value)
      } else if (e.target.value == '') {
        e.target.nextSibling.innerHTML = "";
        e.target.nextSibling.nextSibling.innerHTML = "";
      }
    }

    if (e.target.name === 'QuantityIn' && e.target.value != '') {
      // if(soldQuantity && outQuantity && inQuantity == false){
      //   alert('Out')
      //   e.target.innerHTML(0);
      // } else 
      if (!selectedGodown) {
        alert('The Godown selection is required.');
        e.target.value = '';
        setSelectedGodown(false);
      } else if (!enteredMRP) {
        alert('The MRP field is required.');
        e.target.value = '';
        setEnteredMRP(false);
      } else {
        
        // if (vNum(e.target.value, 0, 17)) {
        setInvoiceQuantity(e.target.value);
        // setInQuantity(true);
        // e.target.nextSibling.innerHTML(0);
        // if(allBatchNo.length){
        // }
         const y =  checkBatchExists().then(res => res);
          // const yn = checkBatchExists();
          // console.warn(y,'bexitttttttttt');
          // console.warn(yn, 'dddljsejlsese');

          // if(y){
          //       setBatchModalShow(false);
          //       setBatchParentExistModal(true);
          // } else {
        console.log(selectedTblRow,'selectedTblRowselectedTblRow')
        // if (selectedTblRow.IsLot == "true") {
          console.log(invoiceQuantity, 'nothing exists')       
                if (e.target.value != '') {
                  setTimeout(() => {
                    setBatchModalShow(true)
                  }, 1000);
                  e.target.addEventListener("click", () => {
                    if (e.target.value != '') {
                      setTimeout(() => {
                        setBatchModalShow(true)
                      }, 1000);
                    }
                  })
                }
        // }
      
      // }

        if (selectedTblRow != undefined && selectedTblRow.IsLot == false && selectedTblRow.IsSerial == "true") {
          setTimeout(() => {
            setSerialModalShow(true)
          }, 1000)
        }
        // } else {
        //   e.target.value.splice(e.target.value.length, 1);
        //   alert('Please enter a number.')
        // }  
      }
    }

    if (e.target.name === 'QuantityOut' && e.target.value != '') {
      // if(invoiceQuantity && inQuantity && outQuantity == false){
      //   alert('In')
      //   e.target.innerHTML(0);
      // } else 
      if (!selectedGodown) {
        alert('The Godown selection is required.');
        e.target.value = '';
        setSelectedGodown(false);
      } else if (!enteredMRP) {
        alert('The MRP field is required.');
        e.target.value = '';
        setEnteredMRP(false);
      } else {
        
        // if (vNum(e.target.value, 0, 17)) {
        setSoldQuantity(e.target.value);
        // setOutQuantity(true);
        
        // e.target.previousSibling.innerHTML(0);
        // if(allBatchNo.length){
        // }
         const y = checkBatchExists().then(res => res);
          // const yn = checkBatchExists();
          // console.warn(y,'bexitttttttttt');
          // console.warn(yn, 'dddljsejlsese');

          // if(y){
          //       setBatchModalShow(false);
          //       setBatchParentExistModal(true);
          // } else {
        console.log(selectedTblRow,'selectedTblRowselectedTblRow')
        // if (selectedTblRow.IsLot == "true") {
          console.log(soldQuantity, 'nothing exists')       
                if (e.target.value != '') {
                  setTimeout(() => {
                    setBatchListModalShow(true)
                  }, 1000);
                  e.target.addEventListener("click", () => {
                    if (e.target.value != '') {
                      setTimeout(() => {
                        setBatchListModalShow(true)
                      }, 1000);
                    }
                  })
                }
        // }
      
      // }
                
      // if (id === "quantity") {
        // if(selectedRow.IsSerial == 'true'){ 
        //   setValue(selectedSerialList)
        //   // updateMyData(index, id, selectedSerialList);
        // } else {
        //   setValue(selectedBatchList);
        //   // updateMyData(index, id, selectedSerialList);
        // }  
      // }    

        if (selectedTblRow != undefined && selectedTblRow.IsLot == false && selectedTblRow.IsSerial == "true") {
          setTimeout(() => {
            setSerialModalShow(true)
          }, 1000)
        }
        // } else {
        //   e.target.value.splice(e.target.value.length, 1);
        //   alert('Please enter a number.')
        // }  
      }
    }

    if (e.target.name === 'godown') {
      // console.log(e, "eeeeeeeeeeeeeeeeeeee")
      var godownNameIdArr = e.target.value.split('|')
      var godownIdfromArr = parseInt(godownNameIdArr[0])
      var godownNamefromArr = godownNameIdArr[1]
      let batch_item_id = (selectedTblRow.ItemId != '') ? selectedTblRow.ItemId : '';
      console.log(batch_item_id, godownIdfromArr,"batch_item_id batch_item_id")

      // const badAdd = ((batch_item_id,godownIdfromArr) => async () => await getItemstockQtyindexDb(batch_item_id, godownIdfromArr).then(res => res))();
      
      // const badAdd = ((batch_item_id,godownIdfromArr) => {
      //   return  async () => { return await getItemstockQtyindexDb(batch_item_id, godownIdfromArr).then(res => res)}
      // })();

      console.log(batch_item_id, godownIdfromArr,"batch_item_id batch_item_id")
        
      // badAdd();
      // badAdd();
      // let itemStockCount = badAdd(batch_item_id,godownIdfromArr)    //s
      // batch_item_id
      // let itemStockCount = await getItemstockQtyindexDb(74, godownIdfromArr).then(res => res)    //s
      setUpdatedObj({ ...updatedObj, godownId: godownIdfromArr, [e.target.name]: godownNamefromArr
        // , stock: itemStockCount 
      }); //s
      // setUpdatedObj({ ...updatedObj, godownId: godownIdfromArr, [e.target.name]: godownNamefromArr});
      // console.log(updatedObj, "updateObj updateObj")
      if (e.target.value != undefined || e.target.value != '') {
        setSelectedGodown(true);
      } else if (e.target.value != '') {
        e.target.nextSibling.innerHTML = "";
      }
    } else {
       setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
    }
    // console.log(updatedObj,'updatedObjupdatedObjupdatedObjupdatedObjupdatedObj in inputqnty')
    return e.target.value;
  };

  const updateAction = useCallback(async () => {
        console.warn(updatedObj,'UP obj')
        console.warn(selectedTblRow,'selectedTblRow in updateACtion')
    // P Starts
    const PID = await getBatchOrSerialNumber();
    if(PID.purchaseinvoicedetail > 0){
    var lastBatchId = PID.batchparentlast;
    var lastBatchChildId = PID.batchchildlast;
    } else {
      var lastBatchId = await db.BatchMaster.reverse().limit(1).toArray()
      .then(res => res[0].batchid)
      .catch((err) => console.log(err));
      var lastBatchChildId = await db.BatchDetail.reverse().limit(1).toArray()
      .then(res => res[0].batchdetailid)
      .catch((err) => console.log(err));
    } 

      // batch detail without popup
    if (selectedTblRow.IsLot != "true") {
      
      // var item_name = '',item_code='';
      let batch_item_name = (selectedTblRow.ItemName != '') ? selectedTblRow.ItemName : '';
      let batch_item_code = (selectedTblRow.ItemCode != '') ? selectedTblRow.ItemCode : '';
      let batch_item_id = (selectedTblRow.ItemId != '') ? selectedTblRow.ItemId : '';

      let batchNumberDefault = 'BN-' + batch_item_code + new Date().getTime() + batch_item_id.toString().padStart(5, '0');
      let lotNumber = 'LOT-' + batch_item_code + new Date().getTime() + batch_item_id.toString().padStart(5, '0');

      // 'LOT-'+item_code + item_id.toString().padStart(5, '0')
      // var lastid = 1;
      // uuidv4() + j


      // setSerialNumberList([...serialNumberList, newSerialObj_batch]);
      var newBatchChildObj = {
          SerialDetail:null,
          createdon: new Date(),
          batchdetailid: lastBatchChildId + 1,
          batchid: lastBatchId + 1,
          entrydetailid: '',
          entryid: '',
          entrytype: "StockAdjustment",
          id: 2,
          inaltqty: "0.00",
          inqty: invoiceQuantity,
          itemid: batch_item_id,
          mrp: "", // p
          outaltqty: "0.00",
          outqty: "1.00",
          stockid: '',
          storeid: '',
      };
      
      // if( batchParentListModalShow && batchParentListOk && BatchSubmit ){
      if(  batchParentListOk  ){

          alert("if default")
            var editablePID =  await getBatchOrSerialNumberById(choosenBatchParent.data_item_id);
            // await db.PurchaseInvoiceDetail.put({
            //   ItemId: choosenBatchParent.data_item_id,
            //   BatchNumber:editablePID[0].BatchNumber.BatchDetail.push(newBatchChildObj)
            // })
            // .then((a) => console.log(a))
            // .catch((err) => console.log(err));
            console.log(editablePID,'editablePid default')
            let bnl = editablePID.batchnumber.find(bd => bd.batchid == choosenBatchParent.data_batchid);
            console.log(bnl,'bnl bnl')
            // var UpdatedBatchold = bnl.BatchDetail.push(newBatchChildObj);
            // var UpdatedBatch = editablePID[0].BatchDetail.push(newBatchChildObj);
            console.log(editablePID,'editablePID ,editablePID')
            // console.log(UpdatedBatch,'Updated Batch')
            // console.log(UpdatedBatchold,'UpdatedBatchold')
    
            // // console.log(editable,'editable ,editable')
            // var ud = await db.PurchaseInvoiceDetail.update({
            //      "ItemId":  choosenBatchParent.data_item_id,
            //      "BatchId": choosenBatchParent.data_batchid
            //     },{
            //       "BatchNumber.BatchDetail":newBatchChildObj
            //     })
      } 
      // else {
        // alert('default else')
        setChildBatchNumber(newBatchChildObj);
      // console.log(childBatchNumber, 'childBatchNumber after set')
      // var newBatchObj = {
      //   ...BatchNumber,
      //   batch_id: uuidv4(),
      //   item_name: batch_item_name,
      //   item_code: batch_item_code,
      //   batch_number: batchNumberDefault,
      //   lot_no: lotNumber,
      //   qty_in: invoiceQuantity,
      // }

      // alteredon: new Date('Y-m-d h:i:s'),   // new
      // batchdate: new Date('Y-m-d h:i:s'),
      // createdon: new Date('Y-m-d h:i:s'),    // new
      var newBatchObj = {
        BatchDetail: [{ ...newBatchChildObj }],
        batchid: lastBatchId + 1,
        batchno: batchNumberDefault,
        branchid: 1,
        editlog: null,
        id: lastBatchId + 1,
        iscancelled: false,
        itemid: batch_item_id,
        item_code: batch_item_code,
        item_name: batch_item_name,
        lotno: lotNumber,
        manufacturingdate: null, // p
        expirydate: null, // p
        seriescode: null,
        seriesid: null,
        seriesno: null,
      }

      var batchId = newBatchObj.batchid
      console.log(newBatchObj,' newBatchObj in parent')
      var batchChildId = newBatchChildObj.batchdetailid;
      setChildBatchNumber(newBatchChildObj);
      // if(batchChildNumberList.length > 0){
      // var c = batchChildNumberList.filter((a) => a.batchdetailid !== batchChildId);
      // setBatchChildNumberList([...c, newBatchChildObj]);
      // } else {
        // alert('b c else')
      setBatchChildNumberList(newBatchChildObj);
      // }

      console.log(newBatchChildObj,'in newBatchChildObj fuc')
      setBatchNumber(newBatchObj)
      // if(batchNumberList.length > 0){
      let x = batchNumberList && batchNumberList.filter((a) => a.batchid !== batchId);
      setBatchNumberList([...x, newBatchObj]);
      // } else {
      // setBatchNumberList(newBatchObj);
      // }

      // } //B L ends
      
    }
    

    if (selectedTblRow.IsLot == "true") {
      // alert("true")
      // console.log(BatchNumber, "BAtchNumber BatchNumber")

      let batch_item_name = (selectedTblRow.ItemName != '') ? selectedTblRow.ItemName : '';
      let batch_item_code = (selectedTblRow.ItemCode != '') ? selectedTblRow.ItemCode : '';
      let batch_item_id = (selectedTblRow.ItemId != '') ? selectedTblRow.ItemId : '';
      let lotNumber = 'LOT-' + batch_item_code + new Date().getTime() + batch_item_id.toString().padStart(5, '0');
      // alert(lotNumber)

      // let newBatchObj = {
      //   ...BatchNumber,
      //    item_name: batch_item_name,
      //   item_code: batch_item_code,
      //   lot_no: lotNumber,
      //   qty_in: invoiceQuantity
      // }

      // console.log(SerialNumber, "serialNumber true")
      let newSerialObj = SerialNumber;
      // console.log(newSerialObj,"newSerialObj","newSerialObj","newSerialObj")
      let newSerialObj_batch = newSerialObj && newSerialObj.map(sn => ({ ...sn, batch_id: batchId }));
      // console.log(newSerialObj_batch,"newSerialObj_batchaa newSerialObj_batchaa") 
      setSerialNumber(newSerialObj_batch);
      // setSerialNumber(newSerialObj)
      // let x = serialNumberList.filter((a) => a.batch_id !== newSerialObj.batch_id);
      setSerialNumberList([...serialNumberList, newSerialObj_batch]);
      // setSerialNumberList([...x, newSerialObj]);

      var newBatchChildObj = {
        SerialDetail:newSerialObj_batch,
        createdon: new Date(),
        batchdetailid: lastBatchChildId + 1,
        batchid: lastBatchId + 1,
        entrydetailid: '',
        entryid: '',
        entrytype: "StockAdjustment",
        id: 2,
        inaltqty: "0.00",
        inqty: invoiceQuantity,
        itemid: batch_item_id,
        mrp: BatchNumber.mrp, // p
        outaltqty: "0.00",
        outqty: "1.00",
        stockid: '',
        storeid: '',
      };

      console.log(batchParentListModalShow, 'batchParentListModalShow batchParentListModalShow');
      console.log(batchParentListOk,'batchParentListOk batchParentListOk');
      console.log(BatchSubmit,'BatchSubmit BatchSubmit');
      console.log(newBatchChildObj,'newBatchChildObj newBatchChildObj')
      // if( batchParentListModalShow && batchParentListOk && BatchSubmit ){
      if( batchParentListOk ){
        // alert("if batchPopup")
        // alert(choosenBatchParent.data_item_id)
            console.log(choosenBatchParent)
        
        //db.friends.update(friendId, {
        //   "address.zipcode": 12345
        //});

        let editablePID =  await getBatchOrSerialNumberById(Number(choosenBatchParent.data_item_id))
        let id = editablePID.item.find(bd => (bd.BatchId == choosenBatchParent.data_batchid) && bd.id );
        let bdetails = editablePID.batchnumber.find(bd => (bd.batchid == choosenBatchParent.data_batchid) && bd.BatchDetail );
        console.log(id,'bnl bnl')
        console.log(bdetails,'bdetailsss');
        // var updatedBatch = await bdetails.push(newBatchChildObj);
        // console.log(updatedBatch,'updated batch');
        // var UpdatedBatchold = bnl.BatchDetail.push(newBatchChildObj);
        // var UpdatedBatch = editablePID[0].BatchDetail.push(newBatchChildObj);
        console.log(editablePID,'editablePID ,editablePID')
        // console.log(UpdatedBatch,'Updated Batch')
        // console.log(UpdatedBatchold,'UpdatedBatchold')

        // console.log(editable,'editable ,editable')
        // {
        //   "ItemId":  choosenBatchParent.data_item_id,
        //   "BatchId": choosenBatchParent.data_batchid
      // }
        var ud = await db.PurchaseInvoiceDetail.update(id,{
              "BatchNumber.BatchDetail":newBatchChildObj
            })

          // await db.transaction("rw", db.PurchaseInvoiceDetail, async () => {
          //     await db.PurchaseInvoiceDetail.where("BatchId").equals(choosenBatchParent.data_batchid).modify({
          //         "BatchNumber.BatchDetail":newBatchChildObj
          //       });
          // }).catch (Dexie.ModifyError, error => {
          //     console.error(error.failures.length + " items failed to modify");
          // }).catch (error => {
          //     console.error("Generic error: " + error);
          // });    

        //     .then((a) => console.log(a))
        //     .catch((err) => console.log(err));
        //     console.log(ud,'udududud')
      } 

         // else {
      // alert("else batchPopup")

      // var newBatchObj = {
      //   ...BatchNumber,
      //   batch_id: uuidv4(),
      //   item_name: batch_item_name,
      //   item_code: batch_item_code,
      //   batch_number: batchNumberDefault,
      //   lot_no: lotNumber,
      //   qty_in: invoiceQuantity,
      // }

      // alteredon: new Date('Y-m-d h:i:s'),   // new
      // batchdate: new Date('Y-m-d h:i:s'),
      // createdon: new Date('Y-m-d h:i:s'),   // new

      // batchno: batchNumberDefault,
      var newBatchObj = {
        BatchDetail: [{ ...newBatchChildObj }],
        batchid: lastBatchId + 1,
        batchno: BatchNumber.batch_number,
        branchid: 1,
        editlog: null,
        id: lastBatchId + 1,
        iscancelled: false,
        itemid: batch_item_id,
        item_code: batch_item_code,
        item_name: batch_item_name,
        lotno: lotNumber,
        manufacturingdate: BatchNumber.mfg_date, // p
        expirydate: BatchNumber.expiry_date, // p
        seriescode: null,
        seriesid: null,
        seriesno: null,
      }
      // manufacturingdate: null, // p
      // expirydate: null, // p

      var batchChildId = newBatchChildObj.batchdetailid;
      setChildBatchNumber(newBatchChildObj);
      let c = batchChildNumberList && batchChildNumberList.filter((a) => a.batchdetailid !== batchChildId);
      setBatchChildNumberList([...c, newBatchChildObj]);
      
      var batchId = newBatchObj.batchid
      setBatchNumber(newBatchObj)
      let x = batchNumberList && batchNumberList.filter((a) => a.batchid !== batchId);
      setBatchNumberList([...x, newBatchObj]);

      // } // B L ends
    }

    // // console.log(SerialNumber, "serialNumber true")
    // let newSerialObj = SerialNumber;
    // // console.log(newSerialObj,"newSerialObj","newSerialObj","newSerialObj")
    // let newSerialObj_batch = newSerialObj && newSerialObj.map(sn => ({ ...sn, batch_id: batchId }));
    // // console.log(newSerialObj_batch,"newSerialObj_batchaa newSerialObj_batchaa") 
    // setSerialNumber(newSerialObj_batch);
    // // setSerialNumber(newSerialObj)
    // // let x = serialNumberList.filter((a) => a.batch_id !== newSerialObj.batch_id);
    // setSerialNumberList([...serialNumberList, newSerialObj_batch]);
    // // setSerialNumberList([...x, newSerialObj]);

    // P Ends  
    // alert('kkk')
    console.log(updatedObj,'updatedObjupdatedObj in updateAction')
    console.log(selectedTblRow,'selectedTblRow in selectedTblRow')
    // console.log(selectedTblRow,'selectedTblRow in selectedTblRow')


    if (updatedObj !== undefined) {
      let qtyIn =
        updatedObj.QuantityIn !== undefined
          ? updatedObj.QuantityIn
          : selectedTblRow.QuantityIn !== ""
            ? selectedTblRow.QuantityIn
            : 0;
      let qtyOut =
      updatedObj.QuantityOut !== undefined
        ? updatedObj.QuantityOut
        : selectedTblRow.QuantityOut !== ""
          ? selectedTblRow.QuantityOut
          : 0;      
      let rate =
        updatedObj.Rate !== undefined
          ? updatedObj.Rate
          : selectedTblRow.Rate !== ""
            ? selectedTblRow.Rate
            : 0;
      let disPer =
        updatedObj.DiscountPer !== undefined
          ? updatedObj.DiscountPer
          : selectedTblRow.DiscountPer !== ""
            ? selectedTblRow.DiscountPer
            : 0;
      let igstRate =
        updatedObj.igstrate !== undefined
          ? updatedObj.igstrate
          : selectedTblRow.igstrate !== ""
            ? selectedTblRow.igstrate
            : 0;
      let cgstRate =
        updatedObj.cgstrate !== undefined
          ? updatedObj.cgstrate
          : selectedTblRow.cgstrate !== ""
            ? selectedTblRow.cgstrate
            : 0;
      let sgstRate =
        updatedObj.sgstrate !== undefined
          ? updatedObj.sgstrate
          : selectedTblRow.sgstrate !== ""
            ? selectedTblRow.sgstrate
            : 0;
      // let amount = qty * rate;
      // let disAmount = (disPer * amount) / 100;
      // let igst = getPercentCalc(igstRate, amount);
      // let cgst = getPercentCalc(cgstRate, amount);
      // let sgst = getPercentCalc(sgstRate, amount);
      // let fnDisc = amount - disAmount;
      // let totlAmt =
      //   parseFloat(fnDisc) +
      //   parseFloat(igst) +
      //   parseFloat(cgst) +
      //   parseFloat(sgst);
      // let itemAltQty = await itemAltqty(selectedTblRow.ItemId, qty);
      let mrp =
        updatedObj.MRP !== undefined
          ? updatedObj.MRP
          : selectedTblRow.MRP !== ""
            ? selectedTblRow.MRP
            : 0;
      // P Starts
      // let batchNumber =
      //   updatedObj.BatchNumber !== undefined
      //     ? updatedObj.BatchNumber
      //     : selectedTblRow.BatchNumber !== ""
      //     ? selectedTblRow.BatchNumber
      //     : 0;
      // let serialNumber =
      //     updatedObj.SerialNumber !== undefined
      //       ? updatedObj.SerialNumber
      //       : selectedTblRow.SerialNumber !== ""
      //       ? selectedTblRow.SerialNumber
      //       : 0;
      let godown =
        updatedObj.godown !== undefined
          ? updatedObj.godown
          : selectedTblRow.godown !== ""
            ? selectedTblRow.godown
            : 0;
      let godownId =
        updatedObj.godownId !== undefined
          ? updatedObj.godownId
          : selectedTblRow.godownId !== ""
            ? selectedTblRow.godownId
            : 0;
      let Stock =
        updatedObj.stock !== undefined
          ? updatedObj.Stock
          : selectedTblRow.Stock !== ""
            ? selectedTblRow.Stock
            : 0;
      
      //  P Ends   

      // console.log(updatedObj,'updatedObjupdatedObj in updateAction After')
      // console.log(selectedTblRow,'selectedTblRow in selectedTblRow After')



      let newUpdateObj = {
        ...updatedObj,
        ItemName:
          updatedObj.ItemName !== undefined
            ? updatedObj.ItemName
            : selectedTblRow.ItemName !== undefined
              ? selectedTblRow.ItemName
              : "",
        // igstamount:
        //   createObj.billingstateid !== createObj.shippingstateid
        //     ? fixedToLength(igst)
        //     : 0,
        // cgstamount:
        //   createObj.billingstateid === createObj.shippingstateid
        //     ? fixedToLength(cgst)
        //     : 0,
        // sgstamount:
        //   createObj.billingstateid === createObj.shippingstateid
        //     ? fixedToLength(sgst)
        //     : 0,
        QuantityIn: qtyIn,
        QuantityOut: qtyOut,
        // igstrate:
        //   createObj.billingstateid !== createObj.shippingstateid ? igstRate : 0,
        // cgstrate:
        //   createObj.billingstateid === createObj.shippingstateid ? cgstRate : 0,
        // sgstrate:
        //   createObj.billingstateid === createObj.shippingstateid ? sgstRate : 0,
        // Rate: fixedToLength(rate),
        // DiscountPer: fixedToLength(disPer),
        // Amount: fixedToLength(amount),
        // DiscountAmount: fixedToLength(disAmount),
        // totalAmount: fixedToLength(totlAmt),
        // altqty: itemAltQty,
        // finalDiscount: fixedToLength(fnDisc),
        hsnid:
          updatedObj.hsnid !== undefined
            ? updatedObj.hsnid
            : selectedTblRow.hsnid !== undefined
              ? selectedTblRow.hsnid
              : "",
        BatchNumberDetail: BatchNumber,
        SerialNumberDetail: SerialNumber,
        godown: godown,
        godownId: godownId,
        stock: Stock,
        MRP: mrp,
        BatchParentId:lastBatchId + 1
      };

      console.log(newUpdateObj, 'newUpdateObjnewUpdateObjnewUpdateObj')
      const array = createObj.items.map((a) => {
        if (a.id === undefined) {
          return a.staticid === selectedTblRow.staticid
            ? { ...a, ...newUpdateObj }
            : a;
        } else {
          return a.id === selectedTblRow.id ? { ...a, ...newUpdateObj } : a;
        }
      });






    // const array = createObj.items.map((a) => {
    //   if (a.id === undefined) {
    //     return a.staticid === selectedTblRow.staticid
    //       ? { ...a, ...updatedObj }
    //       : a;
    //   } else {
    //     return a.id === selectedTblRow.id ? { ...a, ...updatedObj } : a;
    //   }
    // });
    setCreateObj({ ...createObj, items: array });
    setEdit(false);
    setUpdatedObj();
    setAddbtn(false);
    setRefreshtbl(true);
    } else {
      setRefreshtbl(true);
    }
  }, [selectedTblRow, updatedObj, createObj, SerialNumber, BatchNumber]);


  useEffect(() => {
    // if (selectedTblRow != undefined && selectedTblRow.IsLot == "true") { //for now only
      // alert('hii')
      // if (BatchSubmit && selectedTblRow.IsSerial == "true") { //for now only
        if (BatchSubmit){
        // alert('by')
        // setTimeout(() => {
        setSerialModalShow(true)
        setBatchSubmit(false);
        setBatchParentExistModal(false);
        // },1000)  
      }
      //  else {
      //   setSerialModalShow(false)
      // }
    // }
  }, [BatchSubmit])






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
          godown:item.godown
        };
        console.log(objsaveitem,'objsaveitem objsaveitem objsaveitem')
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
  useEffect(() => {
    const getKey = (e) => {
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setDropDownOption(codeFocus);
      }

      if (e.key === "Enter" && batchModalShow == false &&  serialModalShow == false) {
        e.preventDefault();
        // updateItem();
          updateAction();
        setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [createObj, selectedTblRow, codeFocus, updateAction]);

  // P Starts

            // const setBatchChildDetailF = batch_id => {
            //   // alert(batch_id,'batch_id')
            //   console.log(batchChildNumberList,'in set fun batchChildNumberList')
            //   var bcl = batchChildNumberList && batchChildNumberList.map(BC => (Number(BC.batchid) == Number(batch_id)) && BC);
            //   console.log(bcl, 'bclbclbclbcl')
            //   setCurrentBatchChildList(bcl)
            //   setBatchChildDetailModal(true)
            // }
            // const setBatchSerialDetailF = (batch_id,batch_detail_id) => {
            //   // alert("kjhkjhkj")
            //   // console.log(serialNumberList, 'serialNumberListserialNumberList')
            //   // console.log(batch_id, 'batch_id')
            //   var snt = batchChildNumberList && batchChildNumberList.find((SN) => ( (SN.batchid == batch_id) && (SN.batchdetailid == batch_detail_id) ) && SN.SerialDetail );
            //   console.log(snt, 'sntsntsntsnt')
            //   setBatchChildDetailModal(false);
            //   setCurrentSerialNumber(snt.SerialDetail)
            //   setBatchSerialDetailModal(true)
            // }


  //  ______________________ Out Quantity
  useEffect( async () => {
    // selectedTblRow?.ItemId
    let bnlbyid = await getBatchOrSerialNumberById(74).then(res => res);
    // console.log(data[index].ItemId,'data[index].ItemIddata[index].ItemId')
    setBatchNumberOfItem(bnlbyid.batchnumber);
    setSerialNumberOfItem(bnlbyid.serialnumber)
    // console.log(data[index].isSerial,'data[index].isSerialdata[index].isSerial')
  },[])

  useEffect(() => {
      if (BatchListSubmit) {
        // if(selectedRow.IsSerial == 'true'){ 
        setSerialListModalShow(true)
        // }
        setBatchListSubmit(false);
      }
  }, [BatchListSubmit])

  // useEffect(() => {
  //   if (id === "quantity") {
  //     if(selectedRow.IsSerial == 'true'){ 
  //       setValue(selectedSerialList)
  //       // updateMyData(index, id, selectedSerialList);
  //     } else {
  //       setValue(selectedBatchList);
  //       // updateMyData(index, id, selectedSerialList);
  //     }  
  //   }  
  // },[selectedSerialList,selectedBatchList]);
  
  useEffect(() => {
    if (checkedSerialData != null) {
  console.log(checkedSerialData,'checkedSerialData,checkedSerialData');
  console.log(batchNumberOfItem,'batchNumberOfItem,batchNumberOfItem');

          var selected_batch_id = [];
          var selected_batch_data = [];
          // console.log(sle)
          checkedSerialData.map(CSD => {
              if(selected_batch_id.indexOf(CSD.batch_id) === -1)  {  
                selected_batch_id.push(CSD.batch_id)
              }  
            })
            console.log(selected_batch_id,'selected_batch_id,selected_batch_id')
          selected_batch_id.map(SBI => {
            selected_batch_data.push(batchNumberOfItem.find(x => x.batch_id == SBI));
          })
          console.log(selected_batch_data,'selected_batch_data selected_batch_data')
          setPurchasedBatchSerials({'itemID':74, 'bought_batch':selected_batch_data,'bought_serials':checkedSerialData});
    }
}, [checkedSerialData])
           

  // P Ends




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
          <div className="row">
            <div className="col">
              <div className="tableBox">
                <CustomTable
                  coulmn={column}
                  data={createObj.items}
                  // data={createObj.itemList}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  optionList={createObj.itemList}
                  editStatus={edit}
                  deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  itemAdd={
                    val === "add" || val === "edit" ? () => addItem() : false
                  }
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
                {voucherList.map((a) => (
                  <li onClick={(e) => getVoucher(e, a)}>{a.VoucherName}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {val && val !== "view" ? (
            <div>
              <BatchModal
                show={batchModalShow}
                onHide={() => setBatchModalShow(false)}
                onClickOk={setBatchNumber}
                ItemDetail={selectedTblRow}
                onChangedInvoiceQuantity={invoiceQuantity}
                batchMRP={mrpValue}
                didBatchSubmit={setBatchSubmit}
                // parentExists={ choosenBatchParent && choosenBatchParent != '' ? true : false }
                // parent={choosenBatchParent}
              />

              <SerialModal
                show={serialModalShow}
                onHide={() => setSerialModalShow(false)}
                onChangedInvoiceQuantity={invoiceQuantity}
                onClickOk={setSerialNumber}
                ItemDetail={selectedTblRow}
                BatchID={BatchNumber}
                // // BatchID={SerialNumber.batch_id}
                SerialsBatchNumber={BatchNumber.batch_number}
              />

               {/* <BatchChildDetailModal
                show={batchChildDetailModal}
                onHide={() => setBatchChildDetailModal(false)}
                cursor={'pointer'}
                BatchChildDetail={currentBatchChildList}
                ScListF={setBatchSerialDetailF}
              />

              <BatchSerialDetailModal
                show={batchSerialDetailModal}
                onHide={() => setBatchSerialDetailModal(false)}
                cursor={'pointer'}
                BatchSerialDetail={CurrentSerialNumber}
              /> */}
              
              {/* <ExistsModal
                show={batchParentExistModal}
                onHide={() => setBatchParentExistModal(false)}
                onClickNo = {
                        (e) => {
                            setBatchModalShow(e)
                            setChoosenBatchParent('')
                        } 
                      }
                onClickYes={setBatchParentListModalShow}
                // ItemDetail={selectedTblRow}
                // onChangedInvoiceQuantity={invoiceQuantity}
                // didBatchSubmit={setBatchSubmit}
              /> */}

               {/* <BatchParentListModal
                show={batchParentListModalShow}
                onHide={() => setBatchParentListModalShow(false)}
                itemDetail={selectedTblRow}
                checkedParent={setChoosenBatchParent}
                batchPopUp={setBatchModalShow}
                batchListOkClicked={setBatchParentListOk}
              /> */}

              <BatchListModal
                      show={batchListModalShow}
                      onHide={() => setBatchListModalShow(false)}
                      bnoi={batchNumberOfItem}
                      onClickOk={setSelectedBatchList}
                      didBatchListSubmit={setBatchListSubmit}
                  />

              <SerialListModal
                  show={serialListModalShow}
                  onHide={() => setSerialListModalShow(false)}
                  snoi={serialNumberOfItem}
                  onClickOk={setSelectedSerialList}
                  checkedSerial={setCheckedSerialData}
              />

            </div>
          ) : (
            <div>
            {/* <BatchChildDetailModal
              show={batchSerialDetailModal}
              onHide={() => setBatchSerialDetailModal(false)}
              cursor={'pointer'}
              BatchSerialDetail={CurrentSerialNumber}
            />
            <BatchSerialDetailModal
              show={batchSerialDetailModal}
              onHide={() => setBatchSerialDetailModal(false)}
              cursor={'pointer'}
              BatchSerialDetail={CurrentSerialNumber}
            /> */}
            </div>
          )}

    </>
  );
};
export default StockGeneral;
