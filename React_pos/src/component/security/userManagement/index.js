import React, { useEffect, useState } from "react";
import "./index.scss";
import CommonFormAction from "../../common/commonFormAction";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import db from "../../../datasync/dbs";
import Text from "../../common/text";

const UserManagement=({pageNav})=>{
  const creObj={
    UserName:"",
    Password:"",
    ConfPassword:"",
    EmployeeId:"",
    rollIsActive:false,
    mDiscount:"",
    rollId:"",
    EmployeeName:"",
    Description:"",
    IsActive:false,
    IsAuthorized:false,
  }
  const requiredObj={
    UserName:"",
    Password:"",
    ConfPassword:"",
    EmployeeId:"",
    rollId:"",
  }
    let [val, setVal] = useState("");
    const [createObj,setCreateObj]=useState(creObj);
    const [errorObj, setErrorObj] = useState(requiredObj);
    const [edit,setEdit]=useState(false);
    const [codeFocus, setCodeFocus] = useState(false);
    const [emList,setEmList]=useState([]);
    const [rollList,setRollList]=useState([]);
    const [userList,setUserList]=useState([]);
    const [dropDownOption, setDropDownOption] = useState(false);
    const [disabledAction, setDisabledAction] = useState({
      add:pageNav.AllowNew === false ? "disable":"",
      view:pageNav.AllowView === false ? "disable":"",
      edit:pageNav.AllowEdit === false ? "disable":"",
      authorize:pageNav.AllowAuthorize === false ? "disable":"",
      print:pageNav.AllowPrint === false ? "disable":"",
    });
    const employeeList=async()=>{
       let list = await db.employeeMaster.toArray();
       if(list){
        setEmList(list)
         console.log(list,'listlistlist')
       }
       }
    const getrollList=async()=>{
      let Rlist = await db.RoleMaster.toArray();
      if(Rlist){
        setRollList(Rlist)
      }
    }   
    const getUserList=async()=>{
       let userLists = await db.userMaster.toArray() ;
       if(userLists){
        setUserList(userLists);
       }
    }
    const onchangeInput=(e)=>{
      if(e.target.name === "UserName"){
        if(e.target.value === ""){
          setCreateObj({...createObj,[e.target.name]:e.target.value});
          setEdit(true);
        }else{
          setCreateObj({...createObj,[e.target.name]:e.target.value});
        }
      }else{
        setCreateObj({...createObj,[e.target.name]:e.target.value})
        setErrorObj({...errorObj,[e.target.name]:false})
      }
     }
    const confirmPass=()=>{
      let x = checkconfirmPass();
      if(!x){
        setErrorObj({...errorObj,ConfPassword:true})
      }
    }   
     const checkconfirmPass=()=>{
       if(createObj.Password === createObj.ConfPassword){
         return true
       }else{
         return false
       }
     } 
    const onchangeIsActive=(e)=>{
      setCreateObj({...createObj,[e.target.name]:e.target.checked})
    } 
    const onchangeSelect=(e)=>{
      if(e.target.value !== ""){
        let x = emList.filter((a)=> a.Id === parseInt(e.target.value))
        setCreateObj({...createObj,EmployeeId:parseInt(e.target.value),EmployeeName:x[0].EmployeeName})
      }else{
        setCreateObj({...createObj,EmployeeId:parseInt(e.target.value),EmployeeName:""})
      }
      
    }
    const onchangeRoll=(e)=>{
      setCreateObj({...createObj,rollId:e.target.value})
    }
    const getUser=(value)=>{
      if(value){
        let getObj={
        id:value.id,  
        UserName:value.UserName,
        Password:value.Password,
        ConfPassword:value.Password,
        EmployeeId:value.EmployeeId,
        rollIsActive:value.Branch[0].BranchRole[0].IsActive,
        mDiscount:"",
        rollId:value.Branch[0].BranchRole[0].RoleId,
        EmployeeName:value.EmployeeName,
        Description:value.Description !== null ? value.Description:"",
        IsActive:value.IsActive,
        }
        setCreateObj({...createObj,...getObj})
        setEdit(false);
        setCodeFocus(false);
        setDropDownOption(false);
      }else{
        setCreateObj({...createObj,UserName:""})
      }
    }
    const saveObj=()=>{
      const obj={
                UserName: createObj.UserName,
                Password: createObj.Password,
                EmployeeId:createObj.EmployeeId,
                EmployeeName: createObj.EmployeeName,
                Description: createObj.Description,
                IsActive: createObj.IsActive,
                IsAuthorized: "",
                AuthorizedBy: "",
                CreateddBy: localStorage.getItem("UserId"),
                Email: null,
                EditLog: null,
                CreatedOn:"",
                AuthorizedOn:"",
                Branch:[
                  {BranchRole:[
                    {
                      RoleId: parseInt(createObj.rollId),
                      IsActive: createObj.rollIsActive
                  }
                  ]}
                ]
                 
      }
      if(createObj.id){
        db.userMaster.update(createObj.id,obj).then(function(res){
          if(res){
            alert("data update successfully");
          }
        })

      }else{
        db.userMaster.add(obj).then(function(res){
          if(res){
            alert("data save successfully");
          }
        })
      }
      
      console.log(obj,"createObjcreateObj")
    }
    const refresh=()=>{
      setCreateObj(creObj)
      setCodeFocus(false);
      setEmList([]);
      setRollList([]);
      setDropDownOption(false);
      setErrorObj(requiredObj);
      setUserList([]);
    }
    const change_state = (arg) => {
        switch (arg) {
          case "view": {
            setVal(arg);
            setEdit(true);
            employeeList();
            getUserList();
            getrollList();
            return;
          }
          case "edit": {
            setVal(arg);
            setEdit(true);
            employeeList();
            getrollList();
            getUserList();
            return;
          }
          case "refresh": {
            refresh();
            setVal(arg);
            return;
          }
          case "add": {
            setVal(arg);
            employeeList();
            getrollList();
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
            return;
          }
          default:
            return arg;
        }
      };
      useEffect(()=>{
        console.log(createObj,"createObjcreateObjcreateObjcreateObj")
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
      },[codeFocus,createObj]);
        const para = { val, change_state,disabledAction};
    return(<>
    <div className="userManagement" style={{display:pageNav.hide === true ? "none":"block"}}>
        <CommonFormAction {...para} />
        <div className="userManagementIn">
          <div className="box greyBg">
            <div className="row">
              <div className="col autoComp">
                  <div  className={ errorObj && errorObj.UserName === true ? "error formBox" : "formBox"}>
                    <label htmlFor=""> <Text content="Username" /></label>
                    {val === "view" || val === "edit" ? 
                    edit === true ? <Autocomplete
                    open={dropDownOption}
                    options={userList}
                    onChange={(e, value) => {
                      getUser(value);
                    }}
                    getOptionLabel={(option) => option.UserName}
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
                  />:<input name="UserName" value={createObj.UserName} className={ errorObj && errorObj.UserName === true ? "error" : ""} onChange={(e)=>onchangeInput(e)} type="text" />
                  :<input name="UserName" value={createObj.UserName} className={ errorObj && errorObj.UserName === true ? "error" : ""} onChange={(e)=>onchangeInput(e)} type="text" />}
                    
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                    <label htmlFor=""><Text content="Password" /></label>
                    <input name="Password" readOnly={val === "edit" || val === "add" ? false : true} className={ errorObj && errorObj.Password === true ? "error" : ""} value={createObj.Password} onChange={(e)=>onchangeInput(e)} type="text" />
                    </div>
              </div>
              <div className="col">
                  <div className="formBox">
                    <label htmlFor=""> <Text content="Confirm Password" /></label>
                    <input name="ConfPassword" value={createObj.ConfPassword} readOnly={val === "edit" || val === "add" ? false : true} className={ errorObj && errorObj.ConfPassword === true ? "error" : ""} onBlur={()=>confirmPass()} onChange={(e)=>onchangeInput(e)} type="text" /></div>
              </div>
              </div>
              <div className="row">
              <div className="col">
                <div className={ errorObj && errorObj.EmployeeId === true ? "error formBox" : "formBox"}>
                  <label htmlFor=""> <Text content="Employee" /></label>
                  <select value={createObj.EmployeeId} disabled={val === "edit" || val === "add" ? false : true} onChange={(e)=>onchangeSelect(e)}>
                    <option value="">None</option>
                    {emList.map((a,i)=> <option key={i} value={a.Id}>{a.EmployeeName}</option>)}
                  </select>
                  
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""> <Text content="Manual Discount upto" /></label>
                  <input name="mDiscount" readOnly={val === "edit" || val === "add" ? false : true} value={createObj.mDiscount} onChange={(e)=>onchangeInput(e)} type="text" />
                </div>
              </div>
              <div className="col">
              <div className="checkboxNew mt-47">
                  <input
                    type="checkbox"
                    disabled={val === "edit" || val === "add" ? false : true}
                    id="checkboxOne"
                    name="IsActive"
                    checked={createObj.IsActive}
                    onChange={(e)=> onchangeIsActive(e)}
                  />

                  <label htmlFor="checkboxOne"> <Text content="IsActive" /></label>
                </div>
              </div>
              
            </div>
            <div className="row">
            <div className="col w67">
                <div className="formBox">
                  <label htmlFor=""> <Text content="Description" /></label>
                  <textarea name="Description" value={createObj.Description} readOnly={val === "edit" || val === "add" ? false : true} onChange={(e)=>onchangeInput(e)} cols="30" rows="10"></textarea>
                </div>
              </div>
              
            </div>
            <h3> <Text content="Roll Asign" /></h3>
            <div className="row">
              <div className="col w33">
                <div className={ errorObj && errorObj.rollId === true ? "error formBox" : "formBox"}>
                <label htmlFor=""> <Text content="Select Roll" /></label>
                <select value={createObj.rollId} disabled={val === "edit" || val === "add" ? false : true} onChange={(e)=>onchangeRoll(e)}>
                    <option value="">None</option>
                    {rollList.map((a,i)=> <option key={i} value={a.Id}>{a.RoleName}</option>)}
                  </select>
                </div>
              </div>
              <div className="col w33">
              <div className="checkboxNew mt-47">
                  <input
                    type="checkbox"
                    disabled={val === "edit" || val === "add" ? false : true}
                    id="checkboxtwo"
                    name="rollIsActive"
                    checked={createObj.rollIsActive}
                    onChange={(e)=> onchangeIsActive(e)}
                  />

                  <label htmlFor="checkboxtwo"> <Text content="IsActive" /></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)
}
export default UserManagement;
