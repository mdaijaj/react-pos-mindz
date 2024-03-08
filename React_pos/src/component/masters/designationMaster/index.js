import "./reasonMaster.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import MessagePopup from "../../common/messagePopup";
import {Post,Put} from "../../common/commonFunction";
import Text from "../../common/text";

const DesignationMaster = ({onlinestatus,pageNav}) => {
  const plainObj = {
    DesignationName: "",
    DesignationCode: "",
  };
  const [val, setVal] = useState();
  const [createObj, setCreateObj] = useState(plainObj);
  const [designationList, setDesignationList] = useState(null);
  const [DesignationNameDropDown, setDesignationNameDropDown] = useState(false);
  const [DesignationCodeDropDown, setDesignationCodeDropDown] = useState(false);
  const [DesignationNameFocus, setDesignationNameFocus] = useState(false);
  const [DesignationCodeFocus, setDesignationCodeFocus] = useState(false);
  const [DesignationName, setDesignationName] = useState(false);
  const [DesignationCode, setDesignationCode] = useState(false);
  const [edit, setEdit] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();
  const [disabledAction, setDisabledAction] = useState({
    add:pageNav.AllowNew === false ? "disable":"",
    view:pageNav.AllowView === false ? "disable":"",
    edit:pageNav.AllowEdit === false ? "disable":"",
    authorize:pageNav.AllowAuthorize === false ? "disable":"",
    print:pageNav.AllowPrint === false ? "disable":"",
  });
  

  const pageLoad = async () => {
    const reason = await db.designationMaster.toArray();
    console.log(reason,"reason")
    setDesignationList(reason);
  };
  const change_state = async (arg) => {
    if (arg === "add") {
      if(onlinestatus){
      await pageLoad();
      setCreateObj(plainObj);
      setDesignationCode(true);
      setDesignationName(true);
      return setVal(arg);
      }else{
        alert("you are not online please try again after some time when you online")
      }
     
    }

    if (arg === "edit") {
      await pageLoad();
      setCreateObj(plainObj);
      setDesignationCode(true);
      setDesignationName(true);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      setCreateObj(plainObj);
      setDesignationCode(true);
      setDesignationName(true);
      return setVal(arg);
    }

    if (arg === "save") {
      if(onlinestatus){
        submit();
        setCreateObj(plainObj);
        setEdit(false);
        setDesignationCode(false);
        setDesignationName(false);
        return setVal(arg);
      }else{
        alert("you are not online please try again after some time when you online")
      }
      
    }

    if (arg === "refresh") {
      setCreateObj(plainObj);
      setDesignationNameDropDown(false);
      setDesignationCodeDropDown(false);
      setDesignationNameFocus(false);
      setDesignationCodeFocus(false);
      setDesignationName(false);
      setDesignationCode(false);
      setEdit(false);
      return setVal(arg);
    }
  };
  const getDesinationName = async (value) => {
    setDesignationNameDropDown(false);
    setDesignationName(false);
    setDesignationCode(false);
    if(value) {
      const data = {
        id: value.id,
        Id: value.Id,
        DesignationName: value.DesignationName,
        DesignationCode: value.DesignationCode,
      };
      setCreateObj(data);
    }
  };

  const getDesinationCode = (value) => {
    setDesignationCodeDropDown(false);
    setDesignationName(false);
    setDesignationCode(false);
    const data = {
      id: value.id,
      Id: value.Id,
      DesignationName: value.DesignationName,
      DesignationCode: value.DesignationCode,
    };
    setCreateObj(data);
  };
  const submit = async() => {
    const obj = {
      DesignationName: createObj.DesignationName,
      DesignationCode: createObj.DesignationCode,
    }
    if (createObj && createObj.id) {
      let msgSuccess = await Put('/api/DesignationMaster/',{...obj,Id:createObj.Id});
     if(msgSuccess.statuscode === 202){
       db.designationMaster.update(createObj.id,{...obj,Id:createObj.Id}).then((res) => {
        alert(msgSuccess.msg);
        change_state("refresh");
      });
     }else{
      alert(msgSuccess.msg,"statuscode:",msgSuccess.statuscode);
     }
    } else {
      let mid =await Post('/api/DesignationMaster/',{...obj,Id:0})
      if(mid.mid > 0 && mid.mid !== null){
        db.designationMaster.add({...obj,Id:mid.mid}).then((res) => {
          alert(mid.msg);
          change_state("refresh");
        });
      }else{
        alert(mid.msg,"statuscode:",mid.statuscode);
      }
    }
  };

  useEffect(() => {
    const getKey = (e) => {
      if (DesignationNameFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDesignationNameDropDown(true);
        }
      }
      if (DesignationCodeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDesignationCodeDropDown(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [designationList, val, DesignationNameFocus, DesignationCodeFocus]);

  const para = { val, change_state,disabledAction};

  const messageClose = () => {
    setPopup(false);
  };

  return (
    <>
      {popup && (
        <MessagePopup message={popupMessage} closePopup={messageClose} />
      )}
      <div className="customerMasterBox" style={{display:pageNav.hide === true ? "none":"block"}}>
        <CommonFormAction {...para} />
        <div className="reasonMasterSection">
          <div className="row">
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Designation Name" /></label>
                {val === "view" || val === "edit" ? (
                  DesignationName === true ? (
                    <Autocomplete
                      open={DesignationNameDropDown}
                      options={designationList}
                      onChange={(e, value) => 
                        getDesinationName(value)
                      }
                      
                      getOptionLabel={(option) => option.DesignationName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press Ctrl + L"
                          onFocus={() => setDesignationNameFocus(true)}
                          onBlur={() => {
                            setDesignationNameFocus(false);
                            setDesignationNameDropDown(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                      type="text"
                      name="DesignationName"
                     // readOnly={true}
                     readOnly={val === "view" ? true:false}
                      value={createObj && createObj.DesignationName}
                      onChange={(e) => {
                        if(e.target.value === ""){
                          setDesignationName(true);
                          setCreateObj({
                            ...createObj,
                            DesignationName: e.target.value,
                          });
                        }else{
                          setCreateObj({
                            ...createObj,
                            DesignationName: e.target.value,
                          });
                        }
                      }}
                    />
                  )
                ) : (
                  <input
                    type="text"
                    name="DesignationName"
                    onChange={(e) => {
                      if(e.target.value === ""){
                        setDesignationName(true);
                        setCreateObj({
                          ...createObj,
                          DesignationName: e.target.value,
                        });
                      }else{
                        setCreateObj({
                          ...createObj,
                          DesignationName: e.target.value,
                        });
                      }
                     
                    }}
                    readOnly={val === "view" ? true:false}
                   // readOnly={val === "add" ? false : true}
                    value={createObj && createObj.DesignationName}
                  />
                )}
              </div>
            </div>
           
          </div>

          <div className="row">
            <div className="col w35">
              <div className="formBox">
                <label htmlFor=""><Text content="Designation Code" /></label>
                {val === "view" || val === "edit" ? (
                  DesignationCode === true ? (
                    <Autocomplete
                      open={DesignationCodeDropDown}
                      options={designationList}
                       onChange={(e, value) =>
                        getDesinationCode(value)
                      }
                     
                      getOptionLabel={(option) => option.DesignationCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select designation code"
                          onFocus={() => setDesignationCodeFocus(true)}
                          onChange={(e) => {
                            console.log(e.target.value)
                            setCreateObj({
                              ...createObj,
                              DesignationCode: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            setDesignationCodeFocus(false);
                            setDesignationCodeDropDown(false);
                          }}
                        />
                      )}
                    />
                  ) : (
                    <input
                    type="text"
                    name="DesignationCode"
                    readOnly={val === "view" ? true:false}
                   // readOnly={!edit}
                    onChange={(e) => {
                      if(e.target.value === ""){
                        setDesignationCode(true);
                        setCreateObj({
                          ...createObj,
                          DesignationCode: e.target.value,
                        });
                      }else{
                        setCreateObj({
                          ...createObj,
                          DesignationCode: e.target.value,
                        });
                      }
                      
                    }}
                    value={createObj && createObj.DesignationCode}
                  />
                  )
                ) : (
                  <input
                    type="text"
                    name="DesignationCode"
                    readOnly={val === "view" ? true:false}
                    onChange={(e) => {
                      if(e.target.value === ""){
                        setDesignationCode(true);
                        setCreateObj({
                          ...createObj,
                          DesignationCode: e.target.value,
                        });
                      }else{
                        setCreateObj({
                          ...createObj,
                          DesignationCode: e.target.value,
                        });
                      }
                    }}
                    value={createObj && createObj.DesignationCode}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignationMaster;
