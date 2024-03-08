import "./itemMaster.scss";
import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Equal from "../../../images/icon/equal.png";
import AttributesBox from "./AttributesBox";
import BoxTable from "./AttributesBox/BoxTable";
import GstTable from "./AttributesBox/BoxTable/GstTable";
import BoxForm from "./AttributesBox/BoxForm";
import Record from "./AttributesBox/BoxForm/Record";
import ItemImage from "./AttributesBox/ItemImage";
import calender from "../../../../src/images/icon/calender.svg";
import CommonFormAction from "../../common/commonFormAction";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Text from "../../common/text";
import { CalendarContainer } from "react-datepicker";

const ItemMater = (props) => {
  console.log(props,'props in ItemMaster_form')
  const [state, setState] = useState(false); // for itemCode ctrl+L
  let [state2, setState2] = useState(false); // for itemCode Auto
  const [state3, setState3] = useState(false); // for itemName ctrl+L
  let [state4, setState4] = useState(false); // for itemName Auto
  const [sabtabVal,setSabtabVal]=useState('Attributes');
  let [spaceerror, setSpaceError] = useState({"itemnumerror":"", "itemcoderror":""});

  const handleKeyDown = (e) => {
    if (e.ctrlKey && (e.key === "l" || e.key === "L") && state) {
      e.preventDefault();
      setState2(true);
      setState(false);
    }
    if (e.ctrlKey && (e.key === "l" || e.key === "L") && state3) {
      e.preventDefault();
      setState4(true);
      setState3(false);
    }
  };

  const Click = (event) => {
    if (event.target.name !== "uniq123") {
      if ((state2 || state4) && props.idb.ItemMaster[0])
        props.sett(props.idb.ItemMaster[0]);
    }
  };

  const onSpace = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      if(e.target.name === "ItemCode") {
        setSpaceError({ ...spaceerror, itemcoderror: "Space Not Allowed" });
        setTimeout(() => {
          setSpaceError({ ...spaceerror, itemcoderror: "" });
        }, 1000);
      } else if(e.target.name === "ItemName") {
        setSpaceError({ ...spaceerror, itemnumerror: "Space Not Allowed" });
        setTimeout(() => {
          setSpaceError({ ...spaceerror, itemnumerror: "" });
        }, 1000);
      }
    }
  };
const subtab=(tab)=>{
setSabtabVal(tab)
}
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    document.body.addEventListener("click", Click);
    if (props.method === "") {
      setState2(false);
      setState4(false);
    }

    return () => {
      document.body.removeEventListener("click", Click);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      <div className="tabBox">
        <CommonFormAction {...props.para} />
        <div className="box">
          <div className="row">
            <div className="col">
          <div
            className={
              props.errorObj && props.errorObj.ItemCode === true
                ? "formBox autoComp error"
                : "formBox autoComp"
            }
          >
            <label>
            <Text content="Item Code" />
              <span className="required">*</span>
            </label>
            {props.method === "view_edit" ? (
              state2 ? (
                <Autocomplete
                  open={true}
                  onChange={(e, value) => props.sett(value)}
                  options={props.idb.ItemMaster}
                  getOptionLabel={(option) => option.ItemCode}
                  renderInput={(params) => (
                    <TextField name="uniq123" {...params} variant="outlined" />
                  )}
                />
              ) : (
                <input
                  readOnly={true}
                  placeholder="Press Ctrl+L"
                  onFocus={() => setState(true)}
                  onBlur={() => setState(false)}
                />
              )
            ) : (
              <>
              <input
                readOnly={!props.para.val ? true : false}
                type="text"
                name="ItemCode"
                data-valid="number"
                onKeyDown={onSpace}
                className={
                  props.errorObj && props.errorObj.ItemCode === true
                    ? "error"
                    : ""
                }
                value={props.data.ItemCode}
                onChange={props.changeData}
              />
              {spaceerror.itemcoderror ? (
                <span style={{ color: "red", fontSize: "15px" }}>
                  {spaceerror.itemcoderror}
                </span>
                ) : null}
                </>
            )}
          </div>
          </div>
          <div className="col">
          <div
            className={
              props.errorObj && props.errorObj.ItemName === true
                ? "formBox autoComp error"
                : "formBox autoComp"
            }
          >
            <label>
            <Text content="Item Name" />
              <span className="required">*</span>
            </label>
            {props.method === "view_edit" ? (
              state4 ? (
                <Autocomplete
                  open={true}
                  onChange={(e, value) => props.sett(value)}
                  options={props.idb.ItemMaster}
                  getOptionLabel={(option) => option.ItemName}
                  renderInput={(params) => (
                    <TextField name="uniq123" {...params} variant="outlined" />
                  )}
                />
              ) : (
                <input
                  readOnly={true}
                  placeholder="Press Ctrl+L"
                  onFocus={() => setState3(true)}
                  onBlur={() => setState3(false)}
                />
              )
            ) : (
              <>
              <input
                readOnly={!props.para.val ? true : false}
                type="text"
                name="ItemName"
                onKeyDown={onSpace}
                data-valid="varCharSpace"
                className={
                  props.errorObj && props.errorObj.ItemName === true
                    ? "error"
                    : ""
                }
                value={props.data.ItemName}
                onChange={props.changeData}
              />
              {spaceerror.itemnumerror ? (
                <span style={{ color: "red", fontSize: "15px" }}>
                  {spaceerror.itemnumerror}
                </span>
                ) : null}
                </>
            )}
          </div>
          </div>
          <div className="col">
          <div className="formBox">
            <label><Text content="Print Name" /></label>
            <input
              readOnly={!props.para.val ? true : false}
              type="text"
              name="PrintName"
              value={props.data.PrintName}
              onChange={props.changeData}
            />
          </div>
          </div>
          <div className="col">
          <div className="formBox">
            <label><Text content="Name in Tally" /></label>
            <input
              readOnly={!props.para.val ? true : false}
              type="text"
              name="NameInTally"
              value={props.data.NameInTally}
              onChange={props.changeData}
            />
          </div>
          </div>
          </div>
        
          <div className="row">
             <div className="col">
               <div className="formBox">
               <label>
                <Text content="Base Unit" />
                  <span className="required">*</span>
                </label>
                <select
                    name="UnitName"
                    value={props.data.UnitName}
                    onChange={props.changeData}
                  >
                    <option value=""></option>
                    {props.idb.UnitMaster.map((val) => (
                      <option value={val.UnitSymbol}>{val.UnitSymbol}</option>
                    ))}
                  </select>
               </div>
             </div>
             <div className="col">
               <div className="formBox">
               <label><Text content="Alternate Unit" /></label>
                  <select
                    name="UnitAltName"
                    value={props.data.UnitAltName}
                    onChange={props.changeData}
                  >
                    <option value=""></option>
                    {props.idb.UnitMaster.map((val) => (
                      <option value={val.UnitSymbol}>{val.UnitSymbol}</option>
                    ))}
                  </select>
               </div>
             </div>
             <div className="col">
               <div className="formBox">
             <label>
              <Text content="Where" />
                <span className="required">*</span>
              </label>
              <div>
                  <input
                    readOnly={!props.para.val ? true : false}
                    type="number"
                    name="Denominator"
                    className={
                      props.errorObj && props.errorObj.Denominator === true
                        ? "error"
                        : ""
                    }
                    data-valid="number"
                    value={props.data.Denominator}
                    onChange={props.changeData}
                    style={{ width: "70%", marginRight: "13px" }}
                    onBlur={(e) => props.checkEqual(e)}
                  />
               
                
                  <input
                    readOnly={!props.para.val ? true : false}
                    style={{ width: "Calc(30% - 13px)" }}
                    type="text"
                    value={props.data.UnitAltName}
                  />
                </div>
                </div>
             </div>
             <div className="col">
             <img src={Equal} alt="" style={{position: "absolute",left:"-9px",top:"34px",width:"17px"}}/>
               <div className="formBox">
               <label>
              <Text content="Conversion" />
                <span className="required">*</span>
              </label>
              <div>
                  <input
                    readOnly={!props.para.val ? true : false}
                    type="number"
                    name="Conversion"
                    className={
                      props.errorObj && props.errorObj.Conversion === true
                        ? "error"
                        : ""
                    }
                    style={{ width: "70%", marginRight: "13px" }}
                    data-valid="number"
                    onBlur={(e) => props.checkEqual(e)}
                    value={props.data.Conversion}
                    onChange={props.changeData}
                  />
                  <input
                    readOnly={!props.para.val ? true : false}
                    style={{ width: "Calc(30% - 13px)" }}
                    type="text"
                    value={props.data.UnitName}
                  />
                </div>
               </div>
             </div>
          </div>
          <div className="row">
          <div className="col">
              <div className="formBox">
              <label>
              <Text content="Group Name" />
                <span className="required">*</span>
              </label>
                <select
                  name="GroupId"
                  value={props.data.GroupId}
                  onChange={props.changeData}
                  className={
                    props.groupiderror === true ? "error" : "custom-select"
                  }
                >
                  <option value=""></option>
                  {props.idb.ItemGroup.map((val) => (
                    <option value={val.GroupName}>{val.GroupName}</option>
                  ))}
                </select>
              
              </div>
            </div>
            <div className="col">
              <div className="formBox">
              <label><Text content="EAN Code" /></label>
            <input
              readOnly={!props.para.val ? true : false}
              type="text"
              onChange={props.changeData}
              name="EanCode"
              value={props.data.EanCode}
            />
              </div>
            </div>
            <div className="col">
              <div className="formBox">
            <label><Text content="Billing Unit" /></label>

<select
  name="BillingUnit"
  value={props.data.BillingUnit}
  onChange={props.changeData}
>
  <option value=""></option>
  <option value={props.data.UnitName}>{props.data.UnitName}</option>
  )
  <option value={props.data.UnitAltName}>
    {props.data.UnitAltName}
  </option>
  )
</select>
</div>
            </div>
            <div className="col">
               <div className="formBox">
               <label><Text content="Weight (KG)" /></label>
            <input
              readOnly={!props.para.val ? true : false}
              type="number"
              onChange={props.changeData}
              name="WeightInKg"
              value={props.data.WeightInKg}
            />
               </div>
            </div>
          </div>
          <div className="row">
            
            <div className="col">
            <div className="checkboxNew">
                  <input
                    disabled={!props.para.val ? true : false}
                    type="checkbox"
                    id="checkboxOne"
                    checked={props.data.IsLot}
                    onChange={props.changeData}
                    name="IsLot"
                    value={props.data.IsLot ? "" : true}
                  />
                  <label htmlFor="checkboxOne"><Text content="Enable Batch" /></label>
                </div>
           
            <div className="checkboxNew">
                  <input
                    disabled={!props.para.val ? true : false}
                    type="checkbox"
                    id="checkboxTow"
                    checked={props.data.IsSerial}
                    onChange={props.changeData}
                    name="IsSerial"
                    value={props.data.IsSerial ? "" : true}
                  />

                  <label htmlFor="checkboxTow"><Text content="Enable Seriel" /></label>
                </div>
           
              <div className="checkboxNew">
                  <input
                    disabled={!props.para.val ? true : false}
                    type="checkbox"
                    id="checkboxThree"
                    checked={props.data.IsActive}
                    onChange={props.changeData}
                    name="IsActive"
                    value={props.data.IsActive ? "" : true}
                  />

                  <label htmlFor="checkboxThree">Is Active</label>
                </div>
            
            <div className="checkboxNew">
              <input disabled={true} type="checkbox" id="checkboxFour" />
              <label htmlFor="checkboxFour"><Text content="Is For Service Item" /></label>
            </div>
            </div>
          </div>
        </div>  
      </div>
      <div className="subtabview">
        <ul>
          <li className={sabtabVal === "Attributes" ? "active":""} onClick={(e)=>subtab('Attributes')}>Attributes</li>
          <li className={sabtabVal === "Statutory Information" ? "active":""} onClick={(e)=>subtab('Statutory Information')}>Statutory Information</li>
          <li className={sabtabVal === "Reorder Level" ? "active":""} onClick={(e)=>subtab('Reorder Level')}>Reorder Level</li>
          <li className={sabtabVal === "Item Image" ? "active":""} onClick={(e)=>subtab('Item Image')}>Item Image</li>
          <li className={sabtabVal === "GST Classifications" ? "active":""} onClick={(e)=>subtab('GST Classifications')}>GST Classifications</li>
        </ul>
      </div>
      <div className="tabBox withsubtab">
      {/* <AttributesBox text="Attributes" /> */}
      <div className="box" style={{display:sabtabVal === "Attributes" ? "block":"none"}}>
      <div className="row">
        <div className="col">
        <BoxTable {...props} />
        </div>
      </div>
      </div>
      <div className="box" style={{display:sabtabVal === "Statutory Information" ? "block":"none"}}>
          {/* <AttributesBox text="statutory Information" /> */}
          <BoxForm {...props} val={props.para.val} />
      </div>
      <div className="box" style={{display:sabtabVal === "Reorder Level" ? "block":"none"}}>
      {/* <AttributesBox text="Reorder Level" /> */}
          <Record {...props} val={props.para.val} />
      </div>
      <div className="box" style={{display:sabtabVal === "Item Image" ? "block":"none"}}>
      {/* <AttributesBox text="Item Image" /> */}
          <ItemImage />
      </div>
      <div className="box" style={{display:sabtabVal === "GST Classifications" ? "block":"none"}}>
      {/* <AttributesBox text="GST Classifications" /> */}
          <div className="row">
            <div className="col w35">
              <div className="formBox">
              <label><Text content="GST Classifications" /> </label>

              <select
                disabled={props.para.val ? false : true}
                name="HsnId"
                value={props.gst_data.HsnId}
                onChange={props.changeGstData}
              >
                <option value=""></option>
                {props.idb.HsnMaster.map((val) => (
                  <option value={val.Code}>{val.Code}</option>
                ))}
              </select>
              </div>
            </div>
            <div className="col w35" style={{ position: "relative" }}>
              <div className="formBox">
              <label><Text content="Applicable From" /> </label>

              <input
                readOnly={!props.para.val ? true : false}
                type="date"
                onChange={props.changeGstData}
                name="ApplicableDate"
                value={props.gst_data.ApplicableDate}
              />
              <div className="CalenderForm">
                <img src={calender} alt="" />
              </div>
              </div>
            </div>
          </div>
          <GstTable data={props.gst_table} method={props.method} />
      </div>
          
      </div>
    </>
  );
};

export default ItemMater;
