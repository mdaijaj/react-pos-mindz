import React, { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./index.scss";
import Text from "../../common/text";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
const Godown=({ onlinestatus, pageNav })=>{
    const obj={
        godownname:"",
        godowncode:"",
        IsActive:"",
        isauthorized:false,
        godownList:[],
    }
    const plainObj = {
        godownname:"",
        godowncode:"",
      };
    const [val, setVal] = useState();
    const [createObj,setCreateObj]=useState(obj);
    const [codeFocus, setCodeFocus] = useState(false);
    const [errorObj, setErrorObj] = useState(plainObj);
  const [dropDownOption, setDropDownOption] = useState(false);
    const [disabledAction, setDisabledAction] = useState({
        add: pageNav.AllowNew === false ? "disable" : "",
        view: pageNav.AllowView === false ? "disable" : "",
        edit: pageNav.AllowEdit === false ? "disable" : "",
        authorize: pageNav.AllowAuthorize === false ? "disable" : "",
        print: pageNav.AllowPrint === false ? "disable" : "",
      });
      const viewLoad=async()=>{
        const godownlist= await db.GodownMaster.toArray().then().catch(err=>console.log(err));
        if(godownlist){
            setCreateObj({...createObj,godownList:godownlist})
        }

      }
      const onchangeInput=(e)=>{
        setCreateObj({...createObj,[e.target.name]:e.target.value});
      }
      const change_state = async (arg) => {
        if (arg === "add") {
          if (onlinestatus) {
            return setVal(arg);
          } else {
            alert(
              "you are not online please try again after some time when you online"
            );
          }
        }
    
        // if (arg === "edit") {

        //   return setVal(arg);
        // }
    
        if (arg === "view") {
          viewLoad();
          return setVal(arg);
        }
    
        if (arg === "save") {
            const objKey = Object.keys(errorObj);
            var result = {};
            objKey.forEach(
              (key) =>
                (result[key] =
                  createObj[key] === "" ||
                  createObj[key] === null ||
                  errorObj[key] === true
                    ? true
                    : false)
            );
            setErrorObj(result);
            const error = Object.values(result).filter((a) => a === true);
            if (error.length > 0) {
              alert("please fill all the field");
            } else {
              if (onlinestatus) {
                submit();
              } else {
                alert(
                  "you are not online please try again after some time when you online"
                );
              }
            }
         
        }
        if (arg === "refresh") {
            setCreateObj(obj)
            return setVal(arg);
         
        }
      };
      const getGodown=(value)=>{
          console.log(value,"value")
          if(value){
            setCreateObj({
                ...createObj,
                godownname:value.Storename,
        godowncode:value.Storecode,
        IsActive:value.inactive,
        isauthorized:value.isauthorized
              });
          }
          setCodeFocus(false);
        setDropDownOption(false);

      }
      const handleChecked = (e) => {
        let { name, checked } = e.target;
        setCreateObj({
          ...createObj,
          [name]: checked,
        });
      };
      const submit=()=>{

      }
      useEffect(() => {
        const getKey = (e) => {
          if (codeFocus) {
            if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
              e.preventDefault();
              setDropDownOption(true);
            }
          }
        };
        window.addEventListener("keydown", getKey);
        return () => {
          window.removeEventListener("keydown", getKey);
        };
      }, [createObj, codeFocus, val]);
      const para = { val, change_state, disabledAction };
      return(
      <>
      <div
        className="tabBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
          <CommonFormAction {...para} />
        <div className="godownMaster">
           <div className="box">
           <div className="formBox">
               <div className="row">  
                   <div className="col w35">
                           <label htmlFor=""><Text content="Godown Name"/></label>
                   {val === "view" && createObj.godownname === "" ?  <Autocomplete
                      open={dropDownOption}
                      options={createObj.godownList}
                      onChange={(e, value) => {
                        getGodown(value);
                      }}
                      getOptionLabel={(option) => option.Storename}
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
                    />:
                           <input type="text"  onChange={(e)=> onchangeInput(e)} name="godownname" value={createObj.godownname}/>}
                       </div>
                      {createObj.isauthorized === true ? <div className="col w35"><span style={{marginTop:"27px",color:"#f00",display:"inline-block"}}>Authorised</span></div>:""}
                   </div>
                   </div>
                   <div className="formBox">
                   <div className="row">  
                   <div className="col w35">
                           <label htmlFor=""><Text content="Godown Code"/></label>
                           <input type="text" readOnly={val === "add" ? false : true} onChange={(e)=> onchangeInput(e)} name="godowncode" value={createObj.godowncode}/>
                       </div>
                       <div className="col w35">
                <div className="checkboxNew">
                  <input
                    type="checkbox"
                    id="godownIsactive"
                    disabled={
                      val === "add" ? false : true
                    }
                    name="IsActive"
                    checked={createObj.IsActive}
                    onChange={(e) => handleChecked(e)}
                   
                  />

                  <label htmlFor="godownIsactive"><Text content="IsActive" /></label>
                </div>
              </div>
                   </div>
               </div>
           </div>
        </div>
              

      </div>
      
      </>
      )
}
export default Godown;