import React, { useEffect, useState, useCallback } from "react";
import "./purchaseOrder.scss";
import CommonFormAction from "../../common/commonFormAction";
import DatePicker from "react-datepicker";
import db from "../../../datasync/dbs";
import CustomTable from "../../common/table";
import * as column from "./tblcolumn";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  formatDate,
} from "../../common/commonFunction";

const PurchaseOrder = ({ pageNav }) => {
  const obj = {
    orderNo: "",
    orderDate: "",
    vendorName: "",
    vendorCode: "",
    vendorId: "",
    total: "",
    orderBy: "",
    createBy: "",
    remarks: "",
  };
  const rqObj = {
    orderNo: "",
    orderDate: "",
    vendorName: "",
    vendorCode: "",
    vendorId: "",
  };
  let [val, setVal] = useState("");
  const [errorObj, setErrorObj] = useState(rqObj);
  const [formObj, setFormobj] = useState(obj);
  const [open, setOpen] = useState(false);
  const [InditemList, setInditemList] = useState([]);
  const [checkedItem, setCheckedItem] = useState();
  const [getcheckedRows, setGetcheckedRows] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [addbtnstatus, setAddbtnstatus] = useState(true);
  const [indentbtnstatus, setIndentbtnstatus] = useState(true);
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [selectedTblRowpopup, setSelectedTblRowpopup] = useState();
  const [vendorList, setVendorList] = useState([]);
  const [refreshtbl, setRefreshtbl] = useState(false);
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [edit, setEdit] = useState();
  const [editpopup, setEditpopup] = useState();
  const [updatepopObj, setUpdatepopObj] = useState({});
  const [updateObj, setUpdateObj] = useState({});
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState();
  const [dropdownsts, setDropdownsts] = useState(true);
  const [ordNodropdownsts, setOrdNodropdownsts] = useState(true);
  const [poList, setPoList] = useState([]);
  const [seriesandVoucher, setSeriesandVoucher] = useState({
    seriesId: "",
    voucherId: "",
  });
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
  const change_state = async (arg) => {
    if (arg === "add") {
      // IndentList();
      setEditcoulmn(true);
      getoucherList();
      getVendorList();
      setDropdownsts(true);
      return setVal(arg);
    }

    if (arg === "edit") {
      setEditcoulmn(true);
      getVendorList();
      getPoList();
      setIndentbtnstatus(false);
      setAddbtnstatus(false);
      setDropdownsts(true);
      setOrdNodropdownsts(true);
      return setVal(arg);
    }

    if (arg === "view") {
      getVendorList();
      getPoList();
      setOrdNodropdownsts(true);
      return setVal(arg);
    }

    if (arg === "save") {
      setErrorObj(rqObj);
      const objKey = Object.keys(errorObj);
      var result = {};
      objKey.forEach(
        (key) =>
          (result[key] =
            formObj[key] === "" || formObj[key] === null ? true : false)
      );
      setErrorObj(result);
      const error = Object.values(result).filter((a) => a === true);
      if (error.length > 0) {
        alert("please fill all detail");
      } else if (formObj.total < 1) {
        alert("Your total is 0 So please fill item detail or add item");
      } else {
        savePo();
      }
    }

    if (arg === "refresh") {
      refresh();
      refreshtable();
      return setVal(arg);
    }
  };
  const refresh = () => {
    setFormobj(obj);
    setInditemList([]);
    setSelectedItems([]);
    setEditcoulmn(false);
    setEdit(false);
    setRefreshtbl(true);
    setSelectedTblRow();
    setSelectedTblRowpopup();
    setCheckedItem();
    setGetcheckedRows();
    setAddbtnstatus(true);
    setIndentbtnstatus(true);
    setUpdateObj();
    setUpdatepopObj();
    setVendorList([]);
    setErrorObj(rqObj);
    setPoList([]);
    setVal("");
    setOrdNodropdownsts(false);
  };
  const getPoList = async () => {
    const list = await db.purchaseOrder
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (list.length > 0) {
      setPoList(list);
    }
  };
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        //let count = await db.purchaseOrder.toArray();
        let count = await db.purchaseOrder
          .where("SeriesId")
          .equals(0)
          .toArray();
        let val = { series: "", sCount: 0, digit: 5, dbcount: count };
        let sr = await getseriesNo(val, pageNav.formid);
        setFormobj({
          ...formObj,
          orderNo: sr,
          orderDate: new Date(),
          orderBy: localStorage.getItem("fname"),
        });
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      //let count = await db.purchaseOrder.toArray();
      let count =
        series.seriesId === ""
          ? await db.purchaseOrder.where("SeriesId").equals(0).toArray()
          : await db.purchaseOrder
              .where("SeriesId")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      setFormobj({
        ...formObj,
        orderNo: sr,
        orderDate: new Date(),
        orderBy: localStorage.getItem("fname"),
      });
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count =
        series.seriesId === ""
          ? await db.purchaseOrder.where("SeriesId").equals(0).toArray()
          : await db.purchaseOrder
              .where("SeriesId")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      setFormobj({
        ...formObj,
        orderNo: sr,
        orderDate: new Date(),
        orderBy: localStorage.getItem("fname"),
      });
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  const getVendorList = async () => {
    const vendList = await db.customerMaster
      .where("LedgerType")
      .equals(2)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    setVendorList(
      vendList.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
    );
  };
  const calculatePqty = (array) => {
    if (array.length > 0) {
      let qty = 0;
      array.map((a) => {
        qty = qty + parseInt(a.BaseQty);
        return a;
      });
      return qty;
    } else {
      return 0;
    }
  };
  const IndentList = async () => {
    const IndList = await db.IndentMaster.toArray()
      .then()
      .catch((err) => console.log(err));
    if (IndList.length > 0) {
      const IndDetailList = await db.IndentDetail.toArray()
        .then()
        .catch((err) => console.log(err));
      const list = await Promise.all(
        IndDetailList.map(async (a) => {
          let x = IndList.find((n) => a.IndentNo === n.IndentNo);
          let pendingqtyList = await db.purchaseDetail
            .where("IndentDetailId")
            .equals(a.id)
            .toArray();
          let pendingQty = calculatePqty(pendingqtyList);
          let item = await db.itemMaster.get(a.ItemId);
          let unitName = await db.unitMaster
            .where("Id")
            .equals(item.UnitName)
            .first();
          return {
            ...a,
            IndentDate: formatDate(x.IndentDate),
            pQty: a.Quantity - pendingQty,
            pAltqty:
              item.Denominator !== item.Conversion
                ? (a.Quantity * item.Denominator) / item.Conversion
                : "",
            poQty: "",
            Denominator: item.Denominator,
            Conversion: item.Conversion,
            poAltQty: "",
            ItemName: item.ItemName,
            ItemCode: item.ItemCode,
            unit: unitName.UnitName,
            id: a.id,
            ItemId: a.id,
            indItemId: a.ItemId,
          };
        })
      );
      if (list) {
        setInditemList(list);
      }
    }
  };

  const getCheckedRows = (res) => {
    setGetcheckedRows(res);
  };
  /**
   * create item Object with add fields
   */
  const ObjItem = (itemObj) => {
    const object = itemObj.map((o) => {
      return {
        ...o,
        remark: "",
        Qty: o.poQty,
        Rate: 0,
        Disper: 0,
        DisAmount: 0,
        Gtotal: 0,
        Ntotal: 0,
        ItemId: o.indItemId,
        indentdetailid: o.id,
      };
    });

    return object;
  };
  const okSubmit = () => {
    const ids = getcheckedRows.map((a) => {
      return a.ItemId;
    });
    const objget = ObjItem(getcheckedRows);
    console.log(objget, "objget");
    if (objget.length > 0) {
      if (ids) {
        setCheckedItem(ids);
        if (!selectedItems) {
          setSelectedItems(objget);
        } else {
          const results = objget.filter(
            ({ ItemId: id1 }) =>
              !selectedItems.some(({ ItemId: id2 }) => id2 === id1)
          );
          const results2 = selectedItems.filter(
            ({ ItemId: id1 }) => !objget.some(({ ItemId: id2 }) => id2 === id1)
          );
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
          setAddbtnstatus(false);
        }
      }
    } else {
      setSelectedItems([]);
      setCheckedItem();
    }

    setOpen(false);
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  };
  const openIndentLIst = () => {
    IndentList();
    setEdit(true);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
    setRefreshtbl(true);
  };
  const selectedRow = (item) => {
    setSelectedTblRow(item);
    setEdit(false);
  };
  const selectedRowPopup = (item) => {
    setSelectedTblRowpopup(item);
    setEditpopup(false);
  };
  const editItem = () => {
    setEdit(true);
  };
  const editItempopup = () => {
    setEditpopup(true);
  };

  const addItem = () => {
    getItemlist();
    setSelectedItems([
      ...selectedItems,
      {
        id: selectedItems.length + 1,
        ItemName: "",
        ItemCode: "",
        Remarks: "",
        unit: "",
        Qty: 0,
        Rate: 0,
        Disper: 0,
        DisAmount: 0,
        Gtotal: 0,
        Ntotal: 0,
      },
    ]);
    setIndentbtnstatus(false);
  };

  const getItemlist = async () => {
    const Ilist = await db.itemMaster.toArray();
    setItemList(Ilist);
  };
  const tblOptionGet = async (option) => {
    let unitName = await db.unitMaster
      .where("Id")
      .equals(option.UnitName)
      .first();

    const array = selectedItems.map((a) => {
      return a.id === selectedTblRow.id
        ? {
            ...a,
            ItemName: option.ItemName,
            ItemCode: option.ItemCode,
            unit: unitName.UnitName,
          }
        : a;
    });
    setSelectedItems(array);
    setUpdateObj({
      ...updateObj,
      ItemName: option.ItemName,
      ItemCode: option.ItemCode,
      ItemId: option.ItemId,
      unit: unitName.UnitName,
    });
  };
  const tableInputOnchange = (e) => {
    if (e.target.name === "Qty" && indentbtnstatus === true) {
      if (selectedTblRow.Quantity < e.target.value) {
        alert(
          "pending qty is " +
            selectedTblRow.Quantity +
            " you can't input value greate then pending Qty."
        );
        return 0;
      } else {
        setUpdateObj({
          ...updateObj,
          [e.target.name]: e.target.value,
        });
        return e.target.value;
      }
    } else {
      setUpdateObj({
        ...updateObj,
        [e.target.name]: e.target.value,
      });
      return e.target.value;
    }
  };
  const tableInputOnchangePopup = (e) => {
    if (e.target.name === "poQty" && indentbtnstatus === true) {
      if (selectedTblRowpopup.Quantity < e.target.value) {
        alert(
          "pending qty is " +
            selectedTblRowpopup.Quantity +
            " you can't input value greate then pending Qty."
        );
        return 0;
      } else {
        setUpdatepopObj({
          ...updatepopObj,
          [e.target.name]: e.target.value,
        });
        return e.target.value;
      }
    } else {
      setUpdatepopObj({
        ...updatepopObj,
        [e.target.name]: e.target.value,
      });
      return e.target.value;
    }
  };
  const updateActionPopup = useCallback(() => {
    if (InditemList.length > 0) {
      const newInLIst = InditemList.map((a) => {
        if (selectedTblRowpopup.id === a.id) {
          return { ...a, ...updatepopObj };
        } else {
          return a;
        }
      });
      setInditemList(newInLIst);
      setEditpopup(false);
      setUpdatepopObj({});
    }
  }, [updatepopObj, selectedTblRowpopup, InditemList]);
  const updateAction = useCallback(() => {
    // console.log(selectedItems, "selectedItemsselectedItems");
    // console.log(selectedTblRow, "selectedTblRowselectedTblRow");
    // console.log(updateObj, "updateObj");
    if (selectedItems.length > 0) {
      const newInLIst = selectedItems.map((a) => {
        if (selectedTblRow.id === a.id) {
          return { ...a, ...updateObj };
        } else {
          return a;
        }
      });
      if (newInLIst.length > 0) {
        let total = 0;
        const calculateArray = newInLIst.map((a) => {
          let gAmount =
            parseInt(a.Qty === "" ? 0 : a.Qty) *
            parseFloat(a.Rate === "" ? 0 : a.Rate);
          let disAmount = (a.Disper / 100) * gAmount;
          let nAmount = gAmount - disAmount;
          total = total + nAmount;
          return {
            ...a,
            Rate: fixedToLength(a.Rate),
            DisAmount: fixedToLength(isNaN(disAmount) === true ? 0 : disAmount),
            Gtotal: fixedToLength(isNaN(gAmount) === true ? 0 : gAmount),
            Ntotal: fixedToLength(isNaN(nAmount) === true ? 0 : nAmount),
          };
        });
        setSelectedItems(calculateArray);
        setFormobj({
          ...formObj,
          total: fixedToLength(total),
        });
      }
      // setSelectedItems(newInLIst);
      setEdit();
      refreshtable();
      setUpdateObj({});
    }
  }, [updateObj, selectedTblRow, selectedItems]);
  const refreshtable = () => {
    setRefreshtbl(true);
    setTimeout(() => setRefreshtbl(false), 1000);
  };
  const getVender = (value) => {
    if (value) {
      setFormobj({
        ...formObj,
        vendorName: value.PartyName,
        vendorCode: value.PartyCode,
        vendorId: value.Id,
      });
      setDropDownOption();
      setCodeFocus();
      setDropdownsts(false);
    }
  };
  const onchangevendor = (e) => {
    if (e.target.value === "") {
      setFormobj({
        ...formObj,
        vendorName: "",
        vendorCode: "",
        vendorId: "",
      });
      setDropdownsts(true);
    } else {
      setFormobj({
        ...formObj,
        [e.target.name]: e.target.value,
      });
    }
  };
  const fixedToLength = (data) => {
    return data ? parseFloat(data).toFixed(2) : data;
  };
  const getPo = async (value) => {
    if (value) {
      let poid = value.Id === 0 ? value.id : value.Id;
      let items = await db.purchaseDetail
        .where("PoId")
        .equals(poid)
        .toArray()
        .then()
        .catch((err) => console.log(err));
      let total = 0;
      if (items && items.length > 0) {
        const x = await Promise.all(
          items.map(async (a) => {
            total = parseFloat(total) + parseFloat(a.NetTotal);
            let unit = await getUnitName(a.ItemId);
            const obj = {
              id: a.id,
              PoId: a.PoId,
              ItemId: a.ItemId,
              ItemName: a.ItemName,
              ItemCode: a.ItemCode,
              Rate: a.Rate,
              Disper: a.Discount,
              Qty: a.BaseQty,
              unit: unit,
              Gtotal: a.GrossTotal,
              DisAmount: a.DiscountAmount,
              Ntotal: a.NetTotal,
              Remarks: a.Remark,
              IndentId: a.IndentId,
            };
            if (a.IndentId) {
              let pendingqtyList = await db.purchaseDetail
                .where("IndentDetailId")
                .equals(a.IndentDetailId)
                .toArray();
              let pendingQty = calculatePqty(pendingqtyList);
              let indqty = await db.IndentDetail.where("id")
                .equals(a.IndentDetailId)
                .first()
                .then()
                .catch((err) => console.log(err));
              let pqty = parseInt(indqty.Quantity) - parseInt(pendingQty);
              setIndentbtnstatus(true);
              setAddbtnstatus(false);
              return { ...obj, Quantity: pqty + parseInt(a.BaseQty) };
            } else {
              setIndentbtnstatus(false);
              setAddbtnstatus(true);
              return obj;
            }
          })
        );
        setSelectedItems(x);
      }
      let vendor = await db.customerMaster
        .where("Id")
        .equals(value.PartyId)
        .first()
        .then()
        .catch((err) => console.log(err));
      const obj = {
        id: value.id,
        Id: value.Id,
        new: value.new,
        orderNo: value.PoNumber,
        orderDate: value.PoDate,
        vendorName: vendor !== undefined ? vendor.PartyName : "",
        vendorCode: vendor !== undefined ? vendor.PartyCode : "",
        vendorId: value.PartyId,
        total: fixedToLength(total),
        orderBy: value.CreatedByName,
        createBy: value.CreatedBy,
        remarks: value.Remarks,
      };
      setFormobj(obj);
    }
    setDropDownOption();
    setCodeFocus();
    setDropdownsts(false);
    setOrdNodropdownsts(false);
  };
  const getUnitName = async (id) => {
    let item = await db.itemMaster
      .where("Id")
      .equals(id)
      .first()
      .then()
      .catch((err) => console.log(err));
    if (item) {
      let unitName = await db.unitMaster
        .where("Id")
        .equals(item.UnitName)
        .first();
      return unitName.UnitName;
    } else {
      return "";
    }
  };
  const remarkOnchange = (e) => {
    setFormobj({ ...formObj, [e.target.name]: e.target.value });
  };
  const saveItem = async (type) => {
    let poid = await db.purchaseOrder
      .where("PoNumber")
      .equals(formObj.orderNo)
      .first()
      .then()
      .catch((err) => console.log(err));
    const itemlist = selectedItems.map((a) => {
      const newobj = {
        PoId: poid.Id === "" || poid.Id === 0 ? poid.id : poid.Id,
        ItemId: a.ItemId,
        ItemName: a.ItemName,
        ItemCode: a.ItemCode,
        Rate: a.Rate,
        Discount: a.Disper,
        BaseQty: a.Qty,
        AltQty:
          a.Denominator !== a.Conversion
            ? (a.Qty * a.Denominator) / a.Conversion
            : "",
        GrossTotal: a.Gtotal,
        DiscountAmount: a.DisAmount,
        NetTotal: a.Ntotal,
        Remark: a.Remarks,
        IndentId: a.IndentId === undefined ? "" : a.IndentId,
        IndentDetailId: a.indentdetailid === undefined ? "" : a.indentdetailid,
      };
      if (type === "update") {
        return { ...newobj, Id: a.Id };
      } else {
        return newobj;
      }
    });
    if (type === "add") {
      await db.purchaseDetail
        .bulkAdd(itemlist)
        .then((res) => {
          alert("data save successfully");
          refresh();
        })
        .catch((err) => console.log(err));
    } else if (type === "update") {
      await db.purchaseDetail
        .bulkPut(itemlist)
        .then((res) => {
          alert("data update successfully");
          refresh();
        })
        .catch((err) => console.log(err));
    }
  };
  const savePo = async () => {
    const obj = {
      Id: 0,
      PoNumber: formObj.orderNo,
      PoDate: formObj.orderDate,
      PartyId: formObj.vendorId,
      PartyName: formObj.vendorName,
      CreatedBy: localStorage.getItem("UserId"),
      CreatedByName: formObj.orderBy,
      CreatedOn: new Date(),
      Remarks: formObj.remarks,
      SeriesId:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      SeriesVoucherType:
        seriesandVoucher.voucherId === "" ? "" : seriesandVoucher.voucherId,
    };
    if (formObj.id) {
      db.purchaseOrder
        .update(formObj.id, {
          ...obj,
          new: formObj.new,
          Id: formObj.Id,
          update: 1,
        })
        .then((res) => {
          saveItem("update");
        })
        .catch((err) => alert("something went wrong"));
    } else {
      db.purchaseOrder
        .add({ ...obj, new: 1 })
        .then((res) => {
          saveItem("add");
        })
        .catch((err) => alert("something went wrong"));
    }
  };
  useEffect(() => {
    const getKey = (e) => {
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setDropDownOption(codeFocus);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (open) {
          updateActionPopup();
        } else {
          updateAction();
        }

        // setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setSelectedItems,
    editcoulmn,
    indentbtnstatus,
    addbtnstatus,
    updateActionPopup,
    updateAction,
    updateObj,
    dropDownOption,
    codeFocus,
    formObj,
    refreshtbl,
    open,
    errorObj,
  ]);
  const para = { change_state, val, disabledAction };
  return (
    <>
      <div
        className="purchaseOrder"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="purchaseOrderIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col w65">
                <div className="row">
                  <div className="col autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Order No" />
                        <span className="required">*</span>
                      </label>
                      {val === "edit" || val === "view" ? (
                        ordNodropdownsts === true ? (
                          <Autocomplete
                            open={dropDownOption === "orderNo" ? true : false}
                            onChange={(e, value) => getPo(value)}
                            options={poList}
                            getOptionLabel={(option) => option.PoNumber}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Press ctrl + L"
                                onFocus={() => setCodeFocus("orderNo")}
                                onBlur={() => {
                                  setCodeFocus();
                                  setDropDownOption();
                                }}
                              />
                            )}
                          />
                        ) : (
                          <input
                            type="text"
                            name="orderNo"
                            value={formObj.orderNo}
                            readOnly={true}
                          />
                        )
                      ) : (
                        <input
                          type="text"
                          name="orderNo"
                          readOnly={true}
                          value={formObj.orderNo}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Order Date" />
                        <span className="required">*</span>
                      </label>
                      <DatePicker
                        name="orderDate"
                        selected={formObj.orderDate}
                        minDate={formObj.orderDate}
                        maxDate={formObj.orderDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Vendor Name" />
                        <span className="required">*</span>
                      </label>
                      {val === "edit" || val === "add" ? (
                        dropdownsts === true ? (
                          <Autocomplete
                            open={
                              dropDownOption === "vendorName" ? true : false
                            }
                            onChange={(e, value) => getVender(value)}
                            options={vendorList}
                            getOptionLabel={(option) => option.PartyName}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Press ctrl + L"
                                onFocus={() => setCodeFocus("vendorName")}
                                onBlur={() => {
                                  setCodeFocus();
                                  setDropDownOption();
                                }}
                              />
                            )}
                          />
                        ) : (
                          <input
                            type="text"
                            name="vendorName"
                            onChange={(e) => onchangevendor(e)}
                            value={formObj.vendorName}
                          />
                        )
                      ) : (
                        <input
                          type="text"
                          name="vendorName"
                          onChange={(e) => onchangevendor(e)}
                          value={formObj.vendorName}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col autoComp">
                    <div className="formBox">
                      <label htmlFor="">
                        <Text content="Vendor Name" />
                        <span className="required">*</span>
                      </label>
                      {val === "edit" || val === "add" ? (
                        dropdownsts === true ? (
                          <Autocomplete
                            open={
                              dropDownOption === "vendorCode" ? true : false
                            }
                            onChange={(e, value) => getVender(value)}
                            options={vendorList}
                            getOptionLabel={(option) => option.PartyCode}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Press ctrl + L"
                                onFocus={() => setCodeFocus("vendorCode")}
                                onBlur={() => {
                                  setCodeFocus();
                                  setDropDownOption();
                                }}
                              />
                            )}
                          />
                        ) : (
                          <input
                            type="text"
                            name="vendorCode"
                            onChange={(e) => onchangevendor(e)}
                            value={formObj.vendorCode}
                          />
                        )
                      ) : (
                        <input
                          type="text"
                          name="vendorCode"
                          onChange={(e) => onchangevendor(e)}
                          value={formObj.vendorCode}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col w35">
                <div>
                  <button
                    onClick={
                      val === "add" || val === "edit"
                        ? indentbtnstatus === false
                          ? () => {
                              return false;
                            }
                          : openIndentLIst
                        : () => {
                            return false;
                          }
                    }
                    type="button"
                    className={
                      val === "add" || val === "edit"
                        ? indentbtnstatus === false
                          ? "btnDisable"
                          : "btnGreen"
                        : "btnDisable"
                    }
                  >
                    <Text content="Indent" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mb-1 100">
              <div className="tableBox">
                <CustomTable
                  coulmn={
                    indentbtnstatus === true ? column.tblindent : column.tbl
                  }
                  data={selectedItems}
                  overFlowScroll={true}
                  editStatus={edit}
                  editColumn={editcoulmn}
                  optionList={itemList}
                  editfunction={() => editItem()}
                  itemAdd={
                    addbtnstatus === true
                      ? val === "add" || val === "edit"
                        ? () => addItem()
                        : false
                      : false
                  }
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  getAutocompleteOption={(option) => tblOptionGet(option)}
                  refreshTable={refreshtbl}
                  editbtnText="Add Item detail"
                  selectedTr={(item) => selectedRow(item)}
                />
              </div>
            </div>
          </div>
          <div className="box blueBg borderTop-0">
            <div className="row">
              <div className="col w25 mr-auto">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Order By" />
                  </label>
                  <input
                    type="text"
                    readOnly="true"
                    name="orderBy"
                    value={formObj.orderBy}
                    className="bgWhite"
                  />
                </div>
              </div>
              <div className="col w25">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Total" />
                  </label>
                  <input
                    type="text"
                    name="total"
                    readOnly="true"
                    value={isNaN(formObj.total) === true ? 0 : formObj.total}
                    className="bgWhite"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col w100 mt-1">
              <div className="RemarkForm mb-2">
                <label htmlFor="">
                  <Text content="Remark" />
                </label>
                <textarea
                  name="remarks"
                  id=""
                  cols="30"
                  onChange={(e) => remarkOnchange(e)}
                  rows="10"
                  value={formObj.remarks}
                  placeholder="Write remarks here"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && val !== "view" ? (
        <div className="modalPopUp">
          <div className="modalPopUPin">
            <CustomTable
              coulmn={column.popuptbl}
              data={InditemList}
              overFlowScroll={true}
              checkbox={true}
              editStatus={editpopup}
              editColumn={true}
              selectedRows={checkedItem}
              tblInputOnchange={(e) => tableInputOnchangePopup(e)}
              getCheckedItem={(res) => getCheckedRows(res)}
              selectedTr={(item) => selectedRowPopup(item)}
              editfunction={() => editItempopup()}
              Footer={true}
              filter={true}
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
    </>
  );
};
export default PurchaseOrder;
