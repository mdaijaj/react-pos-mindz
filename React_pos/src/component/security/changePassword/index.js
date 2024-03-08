import "./changePassword.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useState ,useEffect} from "react";
import Text from "../../common/text";

const axios = require("axios");

const ChangePassword = ({pageNav}) => {
    const [passWordObj,setPasswordObj] = useState([]);
    const [errorSms,setErrorSms] = useState(null);
    const [val,setVal] = useState('add');
    const [disabledAction, setDisabledAction] = useState({
      add:pageNav.AllowNew === false ? "disable":"",
      view:pageNav.AllowView === false ? "disable":"",
      edit:pageNav.AllowEdit === false ? "disable":"",
      authorize:pageNav.AllowAuthorize === false ? "disable":"",
      print:pageNav.AllowPrint === false ? "disable":"",
    });
    const onChangeInput =(e)=>{
     setPasswordObj({...passWordObj,[e.target.name]:e.target.value});
     setErrorSms('');
    }
   
    useEffect(()=>{
   // console.log(passWordObj,'passWordObj');
    },[passWordObj])


const change_state=(value) =>{
console.log(value,"rrrrrr");

  if(value === "save"){
    if(passWordObj.newPassword === passWordObj.ConfirmPass){
      const config = { headers: { "token":localStorage.getItem('token') } }
    let data= {
    "UserName": passWordObj.userName,
    "oldPassword": passWordObj.oldPassword,
    "NewPassword": passWordObj.newPassword
    }

    console.log(data);
         axios.post('/api/User/Forget', data,
          config
          )
        .then(function (response) {
        //  setPasswordObj("")

          setErrorSms(response.data.result.message)
        })
        .catch(function (error) {
          setErrorSms("Internet Connections are not available ")
        });
    
  }else {
    setErrorSms("Old Password And New Password Not MAtched ")
   }
 
 }
 if(value==="refresh"){

  console.log("RRR")
  setPasswordObj("")

  setVal("add");



 }

}
const para = { val, change_state,disabledAction};
  return (
    <>
      <div className="changePasswordBox" style={{display:pageNav.hide === true ? "none":"block"}}>
        <CommonFormAction {...para} />
        <div className="changePasswordSection mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col">
                  <div className="formBox"><label htmlFor=""><Text content="Username" /></label><input type="text" value={passWordObj && passWordObj.userName} name="userName" onChange={(e)=>onChangeInput(e)}/></div>
              </div>
              <div className="col">
                  <div className="formBox"><label htmlFor=""><Text content="Old Password" /></label><input type="text" value={passWordObj && passWordObj.oldPassword} name="oldPassword" onChange={(e)=>onChangeInput(e)}/></div>
              </div>
              <div className="col">
                  <div className="formBox"><label htmlFor=""><Text content="New Password" /></label><input type="text" value={passWordObj && passWordObj.newPassword} name="newPassword" onChange={(e)=>onChangeInput(e)}/></div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor=""><Text content="Confirm Password" /></label>
                  <input name="ConfirmPass" onChange={(e) => onChangeInput(e)} value={passWordObj && passWordObj.ConfirmPass} type="text" />
                </div>
              </div>
              
            </div>
           {!errorSms ? "": <div className="row">
              <div className="col"><div className="errorShow">{errorSms}</div></div>
            </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};
export default ChangePassword;
