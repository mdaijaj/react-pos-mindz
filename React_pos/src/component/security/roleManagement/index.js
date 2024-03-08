import React, { useEffect, useState } from "react";
import  "./index.scss";
import CommonFormAction from "../../common/commonFormAction";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import {formatDate} from "../../common/commonFunction";
import db from "../../../datasync/dbs";
import Text from "../../common/text";

const RollManagement=({pageNav})=>{
  const obj={
    rollnameId:null,
    id:null,
    rolldetailId:null,
    Description:"",
    RoleName:"",
    isActive:false,
    formlistbygroupid:[]
  }
  const requiredObj={
    RoleName:"",
  }
    let [val, setVal] = useState("");
    const[createObj,setCreateObj]=useState(obj);
    const [errorObj, setErrorObj] = useState(requiredObj);
    const [rolldetaillist,setRolldetaillist]=useState([]);
    const [formList,setFormList]=useState([]);
    const [rollMlist,setRollMlist]=useState([]); 
    const [codeFocus, setCodeFocus] = useState(false);
    const [dropDownOption, setDropDownOption] = useState(false);
    const [disabledAction, setDisabledAction] = useState({
      add:pageNav.AllowNew === false ? "disable":"",
      view:pageNav.AllowView === false ? "disable":"",
      edit:pageNav.AllowEdit === false ? "disable":"",
      authorize:pageNav.AllowAuthorize === false ? "disable":"",
      print:pageNav.AllowPrint === false ? "disable":"",
    });
    const pageLoad=async()=>{
     let rollDlist = await db.formgroupmaster.toArray();
     if(rollDlist){
      setRolldetaillist(rollDlist);
      formMaster();
     }
    }
    const rollList=async()=>{
      let rlist = await db.RoleMaster.toArray();
      if(rlist){
        setRollMlist(rlist);
      }
    }
    const getRollname=async(value)=>{
      if(value){
        const id = value.Id === 0 ? value.id:value.Id; 
        const detailList = await db.RoleDetailMaster.where("RoleId").equals(id).toArray();
        const list = formList.map((item)=>
        {
          let x = detailList.find((a)=> a.FormId === item.formid)
          if(x){
            return {...item,
              detailid:x.id,
              RoleId:id,
              AllowNew:x.AllowNew,
              AllowEdit:x.AllowEdit,
              AllowAuthorize:x.AllowAuthorize,
              AllowView:x.AllowView,
              AllowPrint:x.AllowPrint,
              AllowAmendmend:x.AllowAmendmend,
              AllowExportToExcel:x.AllowExportToExcel,
              AllowSendToTally:x.AllowSendToTally,
              AllowCancelTransaction:x.AllowCancelTransaction,
              AllowAttachment:x.AllowAttachment,
              AllowViewAttachment:x.AllowViewAttachment,
              AllowCreateStructure:x.AllowCreateStructure,
              AllowImport:x.AllowImport,
              ModuleName:x.ModuleName,
              FormName:x.FormName,
              FormTypeName:x.FormTypeName}
          }else{
            return item
          }
        })
        setCreateObj({...createObj,id:value.id,RoleName:value.RoleName,Description:value.Description,rollnameId:value.Id === 0 ? value.id:value.Id,rolldetailId:"",formlistbygroupid:[],isActive:value.IsActive});
        setFormList(list)
        setCodeFocus(false);
        setDropDownOption(false);
      }
    }
    const formMaster=async()=>{
      let formList = await db.formMaster.toArray();
      if(formList.length > 0){
        const list =formList.map((a)=>{
         return {...a,
          checkedId:false,
          AllowNew:false,
          AllowEdit:false,
          AllowAuthorize:false,
          AllowView:false,
          AllowPrint:false,
          AllowAmendmend:false,
          AllowExportToExcel:false,
          AllowSendToTally:false,
          AllowCancelTransaction:false,
          AllowAttachment:false,
          AllowViewAttachment:false,
          AllowCreateStructure:false,
          AllowImport:false,
          ModuleName:false,
          FormName:false,
          FormTypeName:false
        }
        })
        if(list){
          setFormList(list);
        }
      }
    }
    const onChangeRollDetail=(e)=>{
      console.log(createObj.rollnameId,"cccc")
      if(val === "view" || val === "edit"){
        if(createObj.rollnameId){
          const flfomlist = formList.filter((a)=> a.formgroupid === parseInt(e.target.value));
          setCreateObj({...createObj,rolldetailId:parseInt(e.target.value),formlistbygroupid:flfomlist});
        }
      }else{
        const flfomlist = formList.filter((a)=> a.formgroupid === parseInt(e.target.value));
        setCreateObj({...createObj,rolldetailId:parseInt(e.target.value),formlistbygroupid:flfomlist});
      }
     
    }
    const onchangeIsActive=(e)=>{
      setCreateObj({...createObj,isActive:e.target.checked})
    }
    const refresh=()=>{
      setCreateObj(obj);
      setRolldetaillist([]);
      setFormList([]);
      setErrorObj(requiredObj);
      setRollMlist([]);
      setCodeFocus(false);
      setDropDownOption(false);
    }
    const formcheck=(e,item)=>{
      if(e.target.name === "checkedId"){
        if(e.target.checked === true){
          let chlist = formList.map((a)=>{
            if(a.formid === item.formid){
              return {...a,[e.target.name]:e.target.checked,
                AllowNew:item.mnunew === true ? true:false,
                AllowEdit:item.mnuedit === true ? true:false,
                AllowView:item.mnuview === true ? true:false,
                AllowAuthorize:item.mnuauthorize === true ? true:false,
                AllowPrint:item.mnuprint === true ? true:false,
                AllowCancelTransaction:item.mnucanceltransaction === true ? true:false,
              }
            }else{
              return a
            }
          })
          const flfomlist = chlist.filter((a)=> a.formgroupid === createObj.rolldetailId);
          setCreateObj({...createObj,formlistbygroupid:flfomlist});
          setFormList(chlist);
        }else{
          let chlist = formList.map((a)=>{
            if(a.formid === item.formid){
              return {...a,[e.target.name]:e.target.checked,
                AllowNew:false,
                AllowEdit:false,
                AllowView:false,
                AllowAuthorize:false,
                AllowPrint:false,
                AllowCancelTransaction:false,
              }
            }else{
              return a
            }
          })
          const flfomlist = chlist.filter((a)=> a.formgroupid === createObj.rolldetailId);
          setCreateObj({...createObj,formlistbygroupid:flfomlist});
          setFormList(chlist);
        }
      }else{
      let chlist = formList.map((a)=>{
        if(a.formid === item.formid){
          return {...a,[e.target.name]:e.target.checked}
        }else{
          return a
        }
      })
      const flfomlist = chlist.filter((a)=> a.formgroupid === createObj.rolldetailId);
      setCreateObj({...createObj,formlistbygroupid:flfomlist});
      setFormList(chlist);
    }
    }
    const onchangeInput=(e)=>{
      setCreateObj({...createObj,[e.target.name]:e.target.value});
    }
    const saveDetailObj=async(detailObj)=>{
      let getId = await db.RoleMaster.where("RoleName").equals(createObj.RoleName).first();
      let dobjects = detailObj.map((a)=>{
        let xobj={
          RoleDetailId: 0,
          FormId: a.formid,
          AllowNew: a.AllowNew,
          AllowEdit: a.AllowEdit,
          AllowAuthorize: a.AllowAuthorize,
          AllowView: a.AllowView,
          AllowPrint: a.AllowPrint,
          AllowAmendmend: a.AllowAmendmend,
          AllowExportToExcel: a.AllowExportToExcel,
          AllowSendToTally: a.AllowSendToTally,
          AllowCancelTransaction: a.AllowCancelTransaction,
          AllowAttachment: a.AllowAttachment,
          AllowViewAttachment: a.AllowViewAttachment,
          AllowCreateStructure: a.AllowCreateStructure,
          AllowImport: a.AllowImport,
          ModuleName: a.ModuleName,
          FormName: a.FormName,
          FormTypeName: a.FormTypeName
        }
        if(a.detailid){
          xobj.RoleId= a.RoleId
          xobj.id=a.detailid
          return xobj
        }else{
          xobj.RoleId= getId.id
          return xobj
        }
        
      });
      if(createObj.id){
           db.RoleDetailMaster.bulkPut(dobjects).then(function(res){
            if(res){
              alert("data update successfully");
              refresh();
              setVal("refresh")
            }
           })
      }else{
        db.RoleDetailMaster.bulkAdd(dobjects).then(function(res){
          if(res){
            alert("data save successfully");
            refresh();
            setVal("refresh")
          }
         })
      }
    }
    const saveObj=()=>{
      let detailObj = formList.filter((a)=>{
        return a.AllowNew === true || a.AllowEdit === true || a.AllowView === true || a.AllowAuthorize === true || a.AllowPrint === true || a.AllowCancelTransaction === true
      })
      if(detailObj.length > 0){
        const obj = {
          RoleName: createObj.RoleName,
          Description: createObj.Description,
          CreatedBy: localStorage.getItem("UserId"),
          CreatedByName: localStorage.getItem("fname"),
          CreatedOn: formatDate(new Date()),
          IsActive: createObj.isActive,
          EditLog: null,
          alteredon: null,
          Detail:detailObj
           }
           if(createObj.id){
             let x = {...obj,update:1}
            db.RoleMaster.update(createObj.id,x).then(function(res){
              if(res){
                saveDetailObj(detailObj);
                //alert("data update successfully");
              }
            })
           }else{
             let x = {...obj,new:1}
            db.RoleMaster.add(x).then(function(res){
              if(res){
                saveDetailObj(detailObj);
               // alert("data save successfully");
              }
            })
           }
      }else{
        alert("you dont have select any Particulars from table")
      }
     
    }
    
    const change_state = (arg) => {
    switch (arg) {
      case "view": {
        setVal(arg);
        pageLoad();
        rollList();
        return;
      }
      case "edit": {
        setVal(arg);
        pageLoad();
        rollList();
        return;
      }
      case "refresh": {
        setVal(arg);
        refresh();
        return;
      }
      case "add": {
        setVal(arg);
        pageLoad();
        return; 
      }
      case "save": {
        const objKey = Object.keys(errorObj);
      var result = {};
      objKey.forEach(
        (key) => (result[key] = createObj[key] === "" || createObj[key] === null ? true : false)
      );
      setErrorObj(result);
      const error = Object.values(result).filter((a) => a === true);
      if (error.length > 0) {
        alert("please fill all the field");
      } else {
        saveObj();
      }
      // saveObj();
        return;
      }
      default:
        return arg;
    }
  };


  useEffect(()=>{
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(true);
          console.log("ddd")
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  },[codeFocus,createObj,formList]);
    const para = { val, change_state,disabledAction};
return(<>
<div className="rollManagement" style={{display:pageNav.hide === true ? "none":"block"}}>
<CommonFormAction {...para} />
<div className="rollManagementIn mt-2">
  <div className="box greyBg">
    <div className="row">
      <div className="col autoComp">
        <div className={ errorObj && errorObj.RoleName === true ? "error formBox" : "formBox"}>
          <label htmlFor=""><Text content="Roll Name" /></label>
         {val === "view" || val === "edit" ? <Autocomplete
                    open={dropDownOption}
                    options={rollMlist}
                    onChange={(e, value) => {
                      getRollname(value);
                    }}
                    getOptionLabel={(option) => option.RoleName}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        value=""
                        placeholder="Press ctrl + L"
                        onFocus={() => setCodeFocus(true)}
                        onBlur={() => {
                          setCodeFocus(false);
                          setDropDownOption(false);
                        }}
                      />
                    )}
                  />:<input type="text" name="RoleName" value={createObj.RoleName} onChange={val === "add" ? (e)=>onchangeInput(e):(e)=>{return false}} className={
                    errorObj && errorObj.RoleName === true ? "error" : ""
                  }/>}
        </div>
      </div>
      <div className="col">
        <div className="formBox">
          <label htmlFor=""><Text content="Roll Detail" /></label>
          <select value={createObj.rolldetailId} onChange={(e)=>onChangeRollDetail(e)}>
            <option value="">Select</option>
          {rolldetaillist.map((a)=> <option value={a.formgroupid}>{a.formgroupname}</option>)}
          </select>
        </div>
      </div>
      <div className="col">
      <div className="checkboxNew mt-47">
                  <input
                    type="checkbox"
                    disabled={val === "view" || val === "refresh" ? true : false}
                    id="checkboxOne"
                    name="IsActive"
                    checked={createObj.isActive}
                    onChange={(e)=> onchangeIsActive(e)}
                  />

                  <label htmlFor="checkboxOne"><Text content="IsActive" /></label>
                </div>
              </div>
    </div>

    <div className="row">
      <div className="col w55">
      <div className="formBox">
          <label htmlFor=""><Text content="Description" /></label>
         <textarea name="Description" value={createObj.Description} cols="30" rows="10" onChange={val === "add" || val === "edit" ? (e)=>onchangeInput(e):(e)=>{return false}}></textarea>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div className="tableBox">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><Text content="Particulars" /></th>
                <th><Text content="Create" /></th>
                <th><Text content="Alter" /></th>
                <th><Text content="View" /></th>
                <th><Text content="Authorize" /></th>
                <th><Text content="Print" /></th>
                <th><Text content="Cancel Transaction" /></th>
              </tr>
            </thead>
            <tbody>
              {createObj.formlistbygroupid && createObj.formlistbygroupid.map((item,i)=> <tr key={i}>
                <td><input type="checkbox" name="checkedId" checked={item.checkedId} onChange={val === "view" ? (e)=> {return false}:(e)=>formcheck(e,item)}/></td>
                <td>{item.caption}</td>
                <td><input type="checkbox" name="AllowNew" onChange={item.mnunew === true && val !== "view" ? (e)=>formcheck(e,item):(e)=> {return false}} checked={item.AllowNew}/></td>
                <td><input type="checkbox" name="AllowEdit" onChange={item.mnuedit === true && val !== "view" ? (e)=>formcheck(e,item):(e)=> {return false}} checked={item.AllowEdit}/></td>
                <td><input type="checkbox" name="AllowView" onChange={item.mnuview === true && val !== "view" ? (e)=>formcheck(e,item):(e)=> {return false}} checked={item.AllowView}/></td>
                <td><input type="checkbox" name="AllowAuthorize" onChange={item.mnuauthorize === true && val !== "view" ? (e)=>formcheck(e,item):(e)=> {return false}} checked={item.AllowAuthorize}/></td>
                <td><input type="checkbox" name="AllowPrint" onChange={item.mnuprint === true && val !== "view" ? (e)=>formcheck(e,item):(e)=> {return false}} checked={item.AllowPrint}/></td>
                <td><input type="checkbox" name="AllowCancelTransaction" onChange={item.mnucanceltransaction === true && val !== "view" ? (e)=>formcheck(e,item):(e)=> {return false}} checked={item.AllowCancelTransaction}  /></td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</>)
}
export default RollManagement;