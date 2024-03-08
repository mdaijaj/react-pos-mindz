import "./inward.scss";
import CommonFormAction from "../../common/commonFormAction";
import validate from "../../common/validate";
import calenderIcon from "../../../images/icon/calender.svg";
import { useEffect, useState, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import Datepicker from "react-datepicker";
import coulmn from "./tableCoulmn";
import CustomTable from "../../common/table";
import Text from "../../common/text";
import {
  getVoucherIds,
  getSeries,
  getseriesNo,
  getItemDetail,
  getUnitName,
  itemAltqty,
  getPercent,
  updateStockIndDb,
  updateStockIndDbUpdate,
} from "../../common/commonFunction";

const Inward = ({ pageNav }) => {
  const plainObj = {
    inwardNo: "",
    inwardDate: "",
    vendorName: "",
    vendorCode: "",
    PartyId: "",
    gitno: "",
    gitid: "",
    items: [],
    billbaseqty: 0,
    billaltqty: 0,
    recbaseqty: 0,
    recaltqty: 0,
    grosstotal: 0,
    netamount: 0,
    remark: "",
  };
  const reuiredObj = {
    vendorName: "",
    vendorCode: "",
    inwardNo: "",
    inwardDate: "",
    gitno: "",
  };

  const [createObj, setCreateObj] = useState({
    ...plainObj,
    inwardDate: new Date(),
  });
  const [errorObj, setErrorObj] = useState(reuiredObj);
  const [val, setVal] = useState();
  const [inwardList, setInwardList] = useState([]);
  const [edit, setEdit] = useState();
  const [saveEdit, setSaveEdit] = useState(false);
  const [refreshtbl, setRefreshtbl] = useState(false);
  const [editcoulmn, setEditcoulmn] = useState(true);
  const [GitList, setGitList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [dropdown, setDropdown] = useState("");
  const [updatedObj, setUpdatedObj] = useState();
  const [selectedTblRow, setSelectedTblRow] = useState();
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherList, setVoucherList] = useState([]);
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
  const getoucherList = async () => {
    let x = await getVoucherIds(pageNav.formid);
    if (x) {
      if (x.length > 0) {
        setVoucherList(x);
        setVoucherStatus(true);
      } else {
        let count = await db.IC_Master.where("seriesid").equals(0).toArray();
        let val = {
          series: "",
          seriesId: 0,
          sCount: 0,
          digit: 5,
          dbcount: count,
        };
        let sr = await getseriesNo(val, pageNav.formid);
        getDocumentNo(sr);
      }
    }
  };
  const getVoucher = async (e, val) => {
    const series = await getSeries(val);
    if (series.digit === undefined) {
      let count =
        series.seriesId === ""
          ? await db.IC_Master.where("seriesid").equals(0).toArray()
          : await db.IC_Master.where("seriesid")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, digit: 5, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      getDocumentNo(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    } else {
      let count =
        series.seriesId === ""
          ? await db.IC_Master.where("seriesid").equals(0).toArray()
          : await db.IC_Master.where("seriesid")
              .equals(series.seriesId)
              .toArray();
      let val = { ...series, dbcount: count };
      let sr = await getseriesNo(val, pageNav.formid);
      getDocumentNo(sr);
      setSeriesandVoucher({
        seriesId: series.seriesId,
        voucherId: series.voucherId,
      });
    }
    setVoucherStatus(false);
  };
  const getVendorList = async () => {
    const res = await db.GITMaster.toArray();
    const vender = await db.customerMaster
      .where("LedgerType")
      .equals(2)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (vender) {
      let vlist = [];
      vender.map((a) => {
        let x = res.find((b) => a.Id === b.partyid_pos);
        if (x) {
          vlist.push(a);
        }
        return a;
      });
      setVendorList(
        vlist.sort((a, b) => a.PartyName.localeCompare(b.PartyName))
      );
    }
  };
  const getInwardList = async () => {
    let userID = localStorage.getItem("UserId");
    let reslist1 = await db.IC_Master.toArray();
    let reslist = reslist1.filter((f) => f.CreatedBy === userID);

    setInwardList(reslist);
    // console.log(reslist, "reslist");
  };
  const getGitno = async (id) => {
    const res = await db.GITMaster.where("partyid_pos").equals(id).toArray();
    if (res) {
      const x = await db.IC_Master.toArray();
      if (x) {
        let arr = [];
        for (let a of res) {
          let m = x.find((f) => a.gitid === f.GIT);
          if (!m) {
            arr.push(a);
          }
        }
        setGitList(arr);
      } else {
        setGitList(res);
      }
    }
  };

  const handleChange = (e) => {
    let validateType = e.target.getAttribute("data-valid");
    if (validateType) {
      let checkValidate = validate(e.target.value, validateType);
      if (checkValidate) {
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
        setErrorObj({ ...errorObj, [e.target.name]: false });
      } else {
        setErrorObj({ ...errorObj, [e.target.name]: true });
        setCreateObj({ ...createObj, [e.target.name]: e.target.value });
      }
    } else {
      setCreateObj({ ...createObj, [e.target.name]: e.target.value });
    }
  };

  const getDocumentNo = (documentNo) => {
    setCreateObj({
      ...createObj,
      inwardNo: documentNo,
      inwardDate: new Date(),
    });
  };
  const refreshObj = () => {
    setCreateObj(plainObj);
    setErrorObj(reuiredObj);
    setEditcoulmn(false);
    setEdit(false);
    refreshtable();
    setSeriesandVoucher({
      seriesId: "",
      voucherId: "",
    });
  };
  const change_state = (arg) => {
    switch (arg) {
      case "edit": {
        setEditcoulmn(true);
        setSaveEdit(true);
        getInwardList();
        setVal(arg);
        return;
      }
      case "refresh": {
        refreshObj();
        setVal(arg);
        setSaveEdit(false);
        return;
      }
      case "view": {
        setVal(arg);
        getInwardList();
        setEditcoulmn(false);
        setSaveEdit(false);
        setCreateObj({
          ...plainObj,
          inwardDate: new Date(),
        });
        return;
      }
      case "add": {
        setVal(arg);
        setEditcoulmn(true);
        setSaveEdit(false);
        getoucherList();
        getVendorList();
        setDropdown(true);

        return;
      }
      case "save": {
        const objKey = Object.keys(errorObj);
        var result = {};
        objKey.forEach(
          (key) => (result[key] = createObj[key] === "" ? true : false)
        );
        setErrorObj(result);
        const error = Object.values(result).filter((a) => a === true);
        if (error.length > 0) {
          alert("please fill all the field");
        } else {
          saveData();
        }
        return;
      }

      default:
        return arg;
    }
  };
  const refreshtable = () => {
    setRefreshtbl(true);
    setTimeout(() => setRefreshtbl(false), 500);
  };
  const selectGit = async (GIT) => {
    console.log(GIT, "ddd");
    if (GIT) {
      if (GIT.gitdetail === undefined || GIT.gitdetail.length < 1) {
        alert("item not found");
      } else {
        setErrorObj({ ...errorObj, gitno: false });
        setCodeFocus("");
        setDropDownOption("");
        // const arr = await Promise.all(
        //   GIT.gitdetail.map(async (b) => {
        //     let penqty = await getPendingQty(b.gitdetailid);
        //     let Besqty = b.billedbaseqty - penqty;
        //     return {
        //       ...b,
        //       completeSts: Math.sign(Besqty) === 1 ? false : true,
        //     };
        //   })
        // );
        //const fltr = arr.filter((a) => a.completeSts === false);
        const fltr = GIT.gitdetail;
        let billBasqty = 0;
        let grossAmt = 0;
        let billAltQty = 0;
        let recBaseQty = 0;
        let recAltQty = 0;
        let netAmtTotal = 0;
        let itemDetails = await Promise.all(
          fltr.map(async (a) => {
            let itemunit = await getItemDetail(a.itemid_pos);
            let unitname =
              itemunit !== undefined
                ? a.isaltrate === 0
                  ? await getUnitName(itemunit.UnitAltName)
                  : a.isaltrate === 1
                  ? await getUnitName(itemunit.UnitName)
                  : ""
                : "";
            let unitId =
              itemunit !== undefined
                ? a.isaltrate === 0
                  ? itemunit.UnitAltName
                  : a.isaltrate === 1
                  ? itemunit.UnitName
                  : ""
                : "";
            let pqty = await getPendingQty(a.gitdetailid);
            let eqty = a.receivedbaseqty - pqty;
            let Bqty = a.billedbaseqty - pqty;
            let bAltqty = await itemAltqty(a.itemid_pos, Bqty);
            let rAltqty = await itemAltqty(a.itemid_pos, eqty);
            let itmGrossAmt = parseFloat(a.rate) * eqty;
            let disAmt =
              (parseFloat(a.discount_per) * parseFloat(itmGrossAmt)) / 100;
            let netAmt = parseFloat(itmGrossAmt) - parseFloat(disAmt);
            netAmtTotal = parseFloat(netAmtTotal) + parseFloat(netAmt);
            billBasqty = billBasqty + parseInt(Bqty);
            grossAmt = parseFloat(grossAmt) + parseFloat(itmGrossAmt);
            billAltQty = billAltQty + bAltqty;
            recBaseQty = recBaseQty + parseInt(eqty);
            recAltQty =
              Number.isInteger(rAltqty) === true
                ? recAltQty + parseInt(rAltqty)
                : parseFloat(recAltQty) + parseFloat(rAltqty);
            return {
              ...a,
              billedbaseqty: Bqty,
              receivedbaseqty: eqty,
              billedaltqty:
                Number.isInteger(bAltqty) === true
                  ? bAltqty
                  : fixedToLengthAlt(bAltqty),
              receivedaltqty:
                Number.isInteger(rAltqty) === true
                  ? rAltqty
                  : fixedToLengthAlt(rAltqty),
              unit: unitname,
              unitId: unitId,
              gross_amount: fixedToLength(itmGrossAmt),
              netamount: fixedToLength(netAmt),
            };
          })
        );

        setCreateObj({
          ...createObj,
          items: itemDetails,
          billbaseqty: billBasqty,
          netamount: fixedToLength(netAmtTotal),
          grosstotal: fixedToLength(grossAmt),
          recbaseqty: recBaseQty,
          billaltqty:
            Number.isInteger(billAltQty) === true
              ? billAltQty
              : fixedToLengthAlt(billAltQty),
          recaltqty:
            Number.isInteger(recAltQty) === true
              ? recAltQty
              : fixedToLengthAlt(recAltQty),
          gitid: GIT.gitid,
          gitno: GIT.git_no,
        });
      }
    }
  };
  const getPendingQty = async (id) => {
    const items = await db.IC_Detail.where("GitDetailId")
      .equals(id)
      .toArray()
      .then()
      .catch((err) => console.log(err));
    if (items) {
      if (items.length === 1) {
        return parseInt(items[0].ReceiveBaseQty);
      } else {
        let qt = 0;
        items.map((qty) => {
          qt = qt + parseInt(qty.ReceiveBaseQty);
          return qty;
        });
        console.log(qt, "qt");
        return qt;
      }
    } else {
      return 0;
    }
  };
  const getInward = async (inward) => {
    if (inward) {
      setCodeFocus("");
      setDropDownOption("");
      let res = await db.IC_Master.where("InwardNo")
        .equals(inward.InwardNo)
        .first()
        .then()
        .catch((err) => console.log(err));
      if (res) {
        let LId = inward.Id === 0 || inward.Id === "" ? inward.id : inward.Id;
        let listres = await db.IC_Detail.where("InwardId")
          .equals(LId)
          .toArray()
          .then()
          .catch((err) => console.log(err));
        if (listres) {
          const xList = await Promise.all(
            listres.map(async (a) => {
              let itemunit = await getItemDetail(a.ItemId);
              return {
                id: a.id,
                InwardDetailId: a.InwardDetailId,
                InwardId: a.InwardId,
                inwardNo: a.InwardNo,
                itemname: itemunit.ItemName,
                itemcode: itemunit.ItemCode,
                ItemId: a.ItemId,
                billedbaseqty: a.BilledBaseQty,
                billedaltqty: a.BilledAltQty,
                receivedbaseqty: a.ReceiveBaseQty,
                receivedaltqty: a.ReceiveAltQty,
                shortqty: a.shortQty,
                excessqty: a.excessqty,
                netamount: a.NetAmount,
                unitId: a.UnitId,
                unit: await getUnitName(a.UnitId),
                rate: a.Rate,
                gross_amount: a.GrossAmount,
                discount_per: a.DiscountPercentage,
                discountamount: a.DiscountAmount,
                mrp: a.MRP,
                GitDetailId: a.GitDetailId,
              };
            })
          );
          const git = await db.GITMaster.where("gitid").equals(res.GIT).first();
          const user = await db.customerMaster
            .where("Id")
            .equals(res.PartyId)
            .first();
          const Obj = {
            id: res.id,
            Id: res.Id,
            inwardNo: res.InwardNo,
            inwardDate: res.InwardDate,
            PartyId: res.PartyId,
            grosstotal: res.GrossAmount,
            netamount: res.NetAmount,
            remark: res.Remarks,
            gitno: git.git_no,
            gitid: res.GIT,
            vendorName: user.PartyName,
            vendorCode: user.PartyCode,
            billbaseqty: res.billBaseQty,
            billaltqty: res.billAltQty,
            recbaseqty: res.recBaseQty,
            recaltqty: res.recAltQty,
            CreatedBy: res.CreatedBy,
            items: xList,
            new: res.new,
          };
          setCreateObj(Obj);
        }
      }
    }
  };
  const fixedToLength = (data) => {
    return data ? parseFloat(data).toFixed(2) : data;
  };
  const fixedToLengthAlt = (data) => {
    return data ? parseFloat(data).toFixed(4) : data;
  };
  const disableType = (e) => {
    e.preventDefault();
  };
  const getVendor = (vendor) => {
    if (vendor) {
      const a = codeFocus === "VendorName" ? "code" : "name";
      setCreateObj({
        ...createObj,
        vendorName: vendor.PartyName,
        vendorCode: vendor.PartyCode,
        PartyId: vendor.Id,
      });
      setErrorObj({ ...errorObj, vendorName: false, vendorCode: false });
      setCodeFocus("");
      setDropDownOption("");
      setDropdown(a);
      getGitno(vendor.Id);
    }
  };
  const selectedRow = (item) => {
    if (item !== selectedTblRow) {
      setEdit(false);
      setSelectedTblRow(item);
    } else {
      setSelectedTblRow(item);
    }
  };
  const tableInputOnchange = (e) => {
    if (e.target.name === "receivedbaseqty") {
      if (e.target.value > selectedTblRow.billedbaseqty) {
        alert(
          "You can't input greater then bill base qty extra Qty please input in Excess Qty"
        );
        setUpdatedObj({
          ...updatedObj,
          [e.target.name]: selectedTblRow.billedbaseqty,
        });
        return selectedTblRow.billedbaseqty;
      } else {
        setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
        return e.target.value;
      }
    } else {
      setUpdatedObj({ ...updatedObj, [e.target.name]: e.target.value });
      return e.target.value;
    }
  };
  const updateAction = useCallback(() => {
    if (selectedTblRow) {
      const flArray = createObj.items.map((a) => {
        if (!saveEdit) {
          return a.gitdetailid === selectedTblRow.gitdetailid
            ? { ...a, ...updatedObj }
            : a;
        } else {
          return a.GitDetailId === selectedTblRow.GitDetailId
            ? { ...a, ...updatedObj }
            : a;
        }
      });
      if (flArray) {
        calcArray(flArray);
      }
    }
  }, [updatedObj, selectedTblRow, createObj]);
  const calcArray = async (flArray) => {
    let recBaseQty = 0;
    let grossAmt = 0;
    let netAmt = 0;
    let recAltQty = 0;
    const newArray = await Promise.all(
      flArray.map(async (a) => {
        recBaseQty = recBaseQty + convertToFloat(a.receivedbaseqty);
        let itemGrossamt = a.receivedbaseqty * a.rate;
        grossAmt = grossAmt + convertToFloat(itemGrossamt);
        let itemDisAmt = await getPercent(itemGrossamt, a.discount_per);
        let itemNetAmt = itemGrossamt - itemDisAmt;
        let itemRaltQty = await itemAltqty(
          !saveEdit ? a.itemid_pos : a.ItemId,
          a.receivedbaseqty
        );
        recAltQty = recAltQty + convertToFloat(itemRaltQty);
        netAmt = netAmt + convertToFloat(itemNetAmt);
        let shortqty =
          a.receivedbaseqty < a.billedbaseqty
            ? a.billedbaseqty - a.receivedbaseqty
            : 0;
        let excesstqty = a.receivedbaseqty < a.billedbaseqty ? 0 : a.excessqty;
        return {
          ...a,
          gross_amount: fixedToLength(itemGrossamt),
          discountamount: fixedToLength(itemDisAmt),
          receivedaltqty:
            Number.isInteger(itemRaltQty) === true
              ? itemRaltQty
              : fixedToLengthAlt(itemRaltQty),
          excessqty: excesstqty,
          shortqty: shortqty,
          netamount: fixedToLength(itemNetAmt),
        };
      })
    );
    setCreateObj({
      ...createObj,
      items: newArray,
      netamount: fixedToLength(netAmt),
      grosstotal: fixedToLength(grossAmt),
      recbaseqty: recBaseQty,
      recaltqty:
        Number.isInteger(recAltQty) === true
          ? recAltQty
          : fixedToLengthAlt(recAltQty),
    });
    setUpdatedObj();
    refreshtable();
  };
  const convertToFloat = (value) => {
    return value ? parseFloat(value) : value;
  };
  const editItem = () => {
    setEdit(true);
  };
  const saveDataItem = async () => {
    let getres = await db.IC_Master.where("InwardNo")
      .equals(createObj.inwardNo)
      .first();
    if (getres) {
      const IcDetailObj = createObj.items.map((item) => {
        let newdata = {
          InwardDetailId: 0,
          InwardId: getres.id,
          InwardNo: createObj.inwardNo,
          ItemId: saveEdit === false ? item.itemid_pos : item.ItemId,
          BilledBaseQty: item.billedbaseqty,
          BilledAltQty: item.billedaltqty,
          ReceiveBaseQty: parseInt(item.receivedbaseqty),
          ReceiveAltQty: item.receivedaltqty,
          shortQty: item.shortqty,
          excessqty: item.excessqty,
          UnitId: item.unitId,
          Rate: item.rate,
          NetAmount: item.netamount,
          GrossAmount: item.gross_amount,
          DiscountPercentage: item.discount_per,
          DiscountAmount: item.discountamount,
          DiscountedAmount: null,
          MRP: item.mrp,
          GitDetailId: saveEdit === false ? item.gitdetailid : item.GitDetailId,
        };
        if (!saveEdit) {
          return newdata;
        } else {
          newdata.id = item.id;
          newdata.InwardId = item.InwardId;
          newdata.InwardDetailId = item.InwardDetailId;
          return newdata;
        }
      });
      console.log(IcDetailObj, "IcDetailObj");
      if (IcDetailObj) {
        if (!saveEdit) {
          db.IC_Detail.bulkAdd(IcDetailObj)
            .then(function (saveitem) {
              if (saveitem) {
                alert("save data successfully");
                const x = IcDetailObj.map((c) => {
                  const nObj = {
                    formId: pageNav.formid,
                    trId: getres.id,
                    ItemId: c.ItemId,
                    qty: c.ReceiveBaseQty,
                    type: "inqty",
                  };
                  return nObj;
                });

                updateStockIndDb(x);
                refreshObj();
                setVal("save");
              }
            })
            .catch((err) => console.log(err));
        } else {
          db.IC_Detail.bulkPut(IcDetailObj)
            .then(function (update) {
              if (update) {
                alert("data update successfully");
                const x = IcDetailObj.map((c) => {
                  const nObj = {
                    formId: pageNav.formid,
                    trId: getres.id,
                    ItemId: c.ItemId,
                    qty: c.ReceiveBaseQty,
                    type: "inqty",
                  };
                  return nObj;
                });

                updateStockIndDbUpdate(x);
                // const nObj = { formId:pageNav.formid,trId:getres.id,array:IcDetailObj}
                refreshObj();
                setVal("save");
                setSaveEdit(false);
              }
            })
            .catch((err) => console.log(err));
        }
      }
    }
  };
  const saveData = () => {
    const ICMasterObj = {
      InwardNo: createObj.inwardNo,
      InwardDate: createObj.inwardDate,
      PartyId: createObj.PartyId,
      GrossAmount: createObj.grosstotal,
      NetAmount: createObj.netamount,
      Remarks: createObj.remark,
      GIT: createObj.gitid,
      billBaseQty: createObj.billbaseqty,
      billAltQty: createObj.billaltqty,
      recBaseQty: createObj.recbaseqty,
      recAltQty: createObj.recaltqty,
      seriesid:
        seriesandVoucher.seriesId === "" ? 0 : seriesandVoucher.seriesId,
      voucherid: seriesandVoucher.voucherId,
      CreatedBy: localStorage.getItem("UserId"),
      CreatedOn: new Date(),
    };
    console.log(ICMasterObj);
    if (!saveEdit) {
      db.IC_Master.add({ ...ICMasterObj, new: 1, update: 0 })
        .then(function (save) {
          if (save) {
            saveDataItem();
          }
        })
        .catch((err) => console.log(err));
    } else {
      db.IC_Master.put({
        ...ICMasterObj,
        id: createObj.id,
        Id: createObj.Id,
        new: createObj.new,
        update: 1,
      })
        .then(function (save) {
          if (save) {
            saveDataItem();
          }
        })
        .catch((err) => console.log(err));
      // saveDataItem();
    }
  };
  //const onchangeDate = () => {};
  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          if (codeFocus === "SelectGIT") {
            if (createObj.vendorName === "") {
              alert("please select vendor name");
            }
            setDropDownOption(codeFocus);
          } else {
            setDropDownOption(codeFocus);
          }
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        updateAction();
        setEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    createObj,
    val,
    codeFocus,
    selectedTblRow,
    updateAction,
    updatedObj,
    inwardList,
    refreshtbl,
  ]);

  const para = { val, change_state, disabledAction };
  return (
    <>
      <div
        className="inward"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="inwardIn mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Inward No" />.
                  </label>
                  {val === "view" || (val === "edit" && inwardList) ? (
                    <Autocomplete
                      open={dropDownOption === "InwardNo" ? true : false}
                      options={inwardList}
                      onChange={(e, value) => getInward(value)}
                      getOptionLabel={(option) => option.InwardNo.toString()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("InwardNo")}
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
                      name="inwardNo"
                      onChange={(e) => handleChange(e)}
                      data-valid="number"
                      className={
                        errorObj && errorObj.inwardNo === true ? "error" : ""
                      }
                      value={createObj && createObj.inwardNo}
                      readOnly={val === "add" || val === "edit" ? false : true}
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <img src={calenderIcon} className="calIcon" alt="" />
                  <label htmlFor="">
                    <Text content="Inward Date" />
                  </label>
                  <Datepicker
                    selected={createObj && createObj.inwardDate}
                    enabled="false"
                    //  onChange={(date) => onchangeDate(date)}
                    minDate={createObj && createObj.inwardDate}
                    maxDate={createObj && createObj.inwardDate}
                    dropdownMode="select"
                    onChangeRaw={(e) => disableType(e)}
                  />
                </div>
              </div>
              <div className="col autoComp">
                <div
                  className={
                    errorObj.vendorName === true ? "formBox error" : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Name" />
                  </label>
                  {val === "add" && dropdown !== "name" ? (
                    <Autocomplete
                      open={dropDownOption === "VendorName" ? true : false}
                      options={vendorList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.PartyName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("VendorName")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="vendorName"
                      onChange={(e) => handleChange(e)}
                      className={
                        errorObj && errorObj.vendorName === true ? "error" : ""
                      }
                      value={createObj && createObj.vendorName}
                      readOnly={true}
                      data-valid="character"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col col3 autoComp">
                <div
                  className={
                    errorObj.vendorCode === true ? "formBox error" : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Vendor Code" />
                  </label>
                  {val === "add" && dropdown !== "code" ? (
                    <Autocomplete
                      open={dropDownOption === "VendorCode" ? true : false}
                      options={vendorList}
                      onChange={(e, value) => getVendor(value)}
                      getOptionLabel={(option) => option.PartyCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("VendorCode")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="vendorCode"
                      onChange={(e) => handleChange(e)}
                      className={
                        errorObj && errorObj.vendorCode === true ? "error" : ""
                      }
                      value={createObj && createObj.vendorCode}
                      readOnly={true}
                    />
                  )}
                </div>
              </div>
              <div className="col col3 autoComp">
                <div
                  className={
                    errorObj && errorObj.gitno === true
                      ? "formBox error"
                      : "formBox"
                  }
                >
                  <label htmlFor="">
                    <Text content="Select GIT" />
                  </label>
                  {val === "add" ? (
                    <Autocomplete
                      open={dropDownOption === "SelectGIT" ? true : false}
                      options={GitList}
                      onChange={(e, value) => selectGit(value)}
                      getOptionLabel={(option) => option.git_no}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          onFocus={() => setCodeFocus("SelectGIT")}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="gitno"
                      className={
                        errorObj && errorObj.gitno === true ? "error" : ""
                      }
                      // onChange={(e) => handleChange(e)}
                      readOnly={
                        val === "view" || val === "add" || val === "edit"
                          ? false
                          : true
                      }
                      data-valid="character"
                      value={createObj && createObj.gitno}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="tableBox">
                <CustomTable
                  coulmn={coulmn}
                  data={createObj.items}
                  overFlowScroll={true}
                  selectedTr={(item) => selectedRow(item)}
                  editColumn={editcoulmn}
                  editfunction={() => editItem()}
                  editStatus={edit}
                  refreshTable={refreshtbl}
                  // deleteRow={() => removeItem()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                />
                {/* <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item Code </th>
                      <th>Bill Base Qty </th>
                      <th>Bill Alt. Qty</th>
                      <th>Rec. Base Qty</th>
                      <th>Rec. Alt Qty</th>
                      <th>Unit </th>
                      <th>Short Qty</th>
                      <th>Excess Qty</th>
                      <th>Rate</th>
                      <th>MRP</th>
                      <th>Gross Amount</th>
                      <th>Discount(%)</th>
                      <th>Net Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createObj.items &&
                      createObj.items.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.itemname}</td>
                            <td>{item.itemcode}</td>
                            <td>{item.billedbaseqty}</td>
                            <td>{item.billedaltqty}</td>
                            <td>{item.receivedbaseqty}</td>
                            <td>{item.receivedaltqty}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{item.rate}</td>
                            <td>{item.mrp}</td>
                            <td>{item.gross_amount}</td>
                            <td>{item.discount_per}</td>
                            <td>{item.netamount}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>
          <div className="box blueBg borderTop-0">
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Bill Bas Qty" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj && createObj.billbaseqty}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Rec Base Qty" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj && createObj.recbaseqty}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Gross Total" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj && createObj.grosstotal}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Bill Alt Qty" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj && createObj.billaltqty}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Rec Alt Qty" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj && createObj.recaltqty}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Net Amount" />
                  </label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={createObj && createObj.netamount}
                    readOnly={true}
                  />
                </div>
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
                  placeholder="Write remarks here"
                  name="remark"
                  value={createObj && createObj.remark}
                  onChange={(e) => handleChange(e)}
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
    </>
  );
};
export default Inward;
