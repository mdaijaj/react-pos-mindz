// import "./stockGeneral.scss";
// import CommonFormAction from "../../common/commonFormAction";
// import validate from "../../common/validate";
// import calenderIcon from "../../../images/icon/calender.svg";
// import { useEffect, useMemo, useState } from "react";
// import db from "../../../datasync/dbs";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import { TextField } from "@material-ui/core";
// import DatePicker from "react-datepicker";
// import COLUMNS from "./columns";
// import Table from "./table";
// const StockGeneral = () => {
//   const plainObj = {
//     product: [],
//     selectedProduct: [],
//     rowSelected: [],
//     form: {
//       transactionNo: "",
//       transactionDate: "",
//       remarks: "",
//     },
//     items: {
//       itemanme: "",
//       itemcode: "",
//       baseUnit: "",
//       altUnit: "",
//       mrp: "",
//       quantityAdd: "",
//       quantityMinus: "",
//     },
//     itemList: [],
//   };
//   const itemObj = { Id: "" };
//   const [createObj, setCreateObj] = useState(plainObj);
//   const [errorObj, setErrorObj] = useState();
//   const [stockList, setStockList] = useState(null);
//   const [stockItemsList, setStockItemsList] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState([]);
//   const [dropDownOption, setDropDownOption] = useState(false);
//   const [item, setItem] = useState([{}]);
//   const [codeFocus, setCodeFocus] = useState(false);
//   const [val, setVal] = useState();
//   const [rows, setRows] = useState(itemObj);
//   const updateRow = () => {
//     if (Object.keys(rows).length > 2) {
//       setRows(itemObj);
//       setItem([...item, {}]);
//     } else {
//       return false;
//     }
//   };

//   const handleChange = (e) => {
//     let validateType = e.target.getAttribute("data-valid");
//     if (validateType) {
//       let checkValidate = validate(e.target.value, validateType);
//       if (checkValidate) {
//         //console.log(checkValidate, "yes");
//         setCreateObj({ ...createObj, [e.target.name]: e.target.value });
//         setErrorObj({ ...errorObj, [e.target.name]: false });
//       } else {
//         setErrorObj({ ...errorObj, [e.target.name]: true });
//       }
//     } else {
//       setCreateObj({ ...createObj, [e.target.name]: e.target.value });
//     }
//   };

//   const updateMyData = (rowIndex, columnId, value) => {
//     try {
//       // console.log(rowIndex, columnId, value);
//       if (value === "" || value === undefined || value === null) {
//         return false;
//       } else {
//         setRows((old) => {
//           old.SmId = createObj.form.transactionNo;
//           old[columnId] = value;
//           return { ...old };
//         });
//       }
//       console.log(rows);
//       if (Object.keys(rows).length > 4) {
//         setSelectedProduct([...selectedProduct, rows]);
//         console.log(rows, selectedProduct);
//       } else {
//         return false;
//       }
//     } catch (error) {}
//   };

//   const pageLoad = async () => {
//     const stock = await db.stockMaster.toArray();
//     await setStockList(stock);
//     // console.log(stock);
//   };

//   const getStockDetail = async (tno) => {
//     setDropDownOption(false);
//     const data = {
//       SmId: tno.SmId,
//       transactionNo: tno.transactionNo,
//       transactionDate: tno.transactionDate,
//       remarks: tno.remarks,
//     };
//     let itemMaster = [];
//     let tempRes = [];
//     itemMaster = await db.stockMasterDetails
//       .where("SmId")
//       .equals(tno.transactionNo)
//       .toArray();
//     await itemMaster.map(async (y) => {
//       return tempRes.push({
//         itemName: y && y.itemname,
//         itemcode: y && y.itemcode,
//         baseunit: y && y.baseunit,
//         altunit: y && y.altunit,
//         mrp: y && y.mrp,
//         quantityadd: y && y.quantityadd,
//         quantityMinus: y && y.quantityMinus,
//       });
//     });
//     setStockItemsList(tempRes);
//     setCreateObj({
//       form: data,
//     });
//   };

//   const bindSMSeries = () => {
//     let bill = "SO";
//     bill += Date.now();
//     bill += 1;
//     setCreateObj((old) => {
//       old.form.transactionNo = bill;
//       old.form.transactionDate = new Date();
//       return { ...old };
//     });
//   };

//   const change_state = (arg) => {
//     switch (arg) {
//       case "edit": {
//         setVal(arg);
//         return;
//       }
//       case "refresh": {
//         setCreateObj(plainObj);
//         setStockItemsList([]);
//         setItem([{}]);
//         setVal(arg);
//         return;
//       }
//       case "view": {
//         pageLoad();
//         setVal(arg);
//         return;
//       }
//       case "add": {
//         pageLoad();
//         setRows([]);
//         setSelectedProduct([]);
//         setItem([{}]);
//         bindSMSeries();
//         setVal(arg);
//         return;
//       }
//       case "save": {
//         setVal(arg);
//         submit();

//         return;
//       }
//       default:
//         return arg;
//     }
//   };
//   const disabledAction = { edit: "disable" };

//   const submit = () => {
//     db.stockMaster.add(createObj.form).then((res) => {
//       console.log(res);
//     });
//     db.stockMasterDetails
//       .bulkAdd(selectedProduct)
//       .then((res) => console.log(res));
//   };

//   useEffect(() => {
//     const getKey = (e) => {
//       if (codeFocus) {
//         if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
//           e.preventDefault();
//           setDropDownOption(true);
//         }
//       }
//     };
//     window.addEventListener("keydown", getKey);
//     return () => {
//       window.removeEventListener("keydown", getKey);
//     };
//   }, [createObj, val, codeFocus, errorObj, selectedProduct]);

//   const para = { val, change_state, disabledAction };
//   const columns = useMemo(() => COLUMNS, []);
//   return (
//     <>
//       <div className="stockGeneral">
//         <CommonFormAction {...para} />
//         <div className="stockGeneralIn mt-2">
//           <div className="box greyBg">
//             <div className="row">
//               <div className="col col3">
//                 <div className="formBox">
//                   <label htmlFor="">Transaction No.</label>
//                   {val === "edit" || val === "view" ? (
//                     stockList && (
//                       <Autocomplete
//                         open={dropDownOption}
//                         options={stockList ? stockList : [{}]}
//                         onChange={(e, value) => getStockDetail(value)}
//                         getOptionLabel={(option) => option.transactionNo}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             placeholder="Press ctrl + L"
//                             onFocus={() => setCodeFocus(true)}
//                             onBlur={() => {
//                               setCodeFocus(false);
//                               setDropDownOption(false);
//                             }}
//                           />
//                         )}
//                       />
//                     )
//                   ) : (
//                     <input
//                       type="text"
//                       name="saleReturn"
//                       onChange={(e) => handleChange(e)}
//                       data-valid="number"
//                       value={
//                         createObj &&
//                         createObj.form &&
//                         createObj.form.transactionNo
//                       }
//                       className={
//                         errorObj && errorObj.transactionNo === true
//                           ? "error"
//                           : ""
//                       }
//                     />
//                   )}
//                 </div>
//               </div>
//               <div className="col col3">
//                 <div className="formBox">
//                   <img src={calenderIcon} className="calIcon" alt="" />
//                   <label htmlFor="">Transaction Date</label>
//                   <DatePicker
//                     readOnly={true}
//                     selected={new Date()}
//                     value={
//                       createObj &&
//                       createObj.form &&
//                       createObj.form.transactionDate
//                     }
//                     onChange={(date) => {
//                       setCreateObj((old) => {
//                         old.form.transactionDate = date;
//                         return { ...old };
//                       });
//                     }}
//                     type="text"
//                     dateFormat="dd-MM-yyyy"
//                     dropdownMode="select"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col">
//                 {val === "add" ? (
//                   <Table
//                     columns={columns}
//                     data={item}
//                     updateMyData={updateMyData}
//                     updateRow={updateRow}
//                   />
//                 ) : (
//                   <div className="tableBox">
//                     <table>
//                       <thead>
//                         <th>Item Name </th>
//                         <th>Item Code</th>
//                         <th>Base Unit </th>
//                         <th>Alt Unit</th>
//                         <th>MRP</th>
//                         <th>Quantity (+)</th>
//                         <th>Quantity (-)</th>
//                       </thead>
//                       <tbody>
//                         {stockItemsList.map((items, index) => {
//                           return (
//                             <tr key={index}>
//                               <td>{items.itemName}</td>
//                               <td>{items.itemcode}</td>
//                               <td>{items.baseunit}</td>
//                               <td>{items.altunit}</td>
//                               <td>{items.mrp}</td>
//                               <td>{items.quantityadd}</td>
//                               <td>{items.quantityMinus}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col w100">
//               <div className="RemarkForm mb-2">
//                 <label htmlFor="">Remark</label>
//                 <textarea
//                   placeholder="Write remarks here"
//                   name="remarks"
//                   value={createObj && createObj.form && createObj.form.remarks}
//                   readOnly={val === "view" || val === undefined ? true : false}
//                 ></textarea>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default StockGeneral;
