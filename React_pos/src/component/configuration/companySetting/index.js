import "./index.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
import Text from "../../common/text";
const CompanySettings = ({ onlinestatus, pageNav }) => {
    const obj={
        Address: "",
        City: "",
        CompanyName: "",
        CompanyShortName: "",
        Contact1: "",
        Contact2: "",
        Country: "",
        Currency: "",
        Email: "",
        FaxNo: "",
        LicenceNo: "",
        PinCode: "",
        RegisterDate: "",
        RegisterNo: "",
        State: "",
        TallyCompanyname: "",
        TallyIpAndPort: "",
        WebUrl: "",
        companylogo:"",
    }
    const [createObj,setCreateObj]=useState(obj)
    const [val, setVal] = useState();
    const [disabledAction, setDisabledAction] = useState({
        add: pageNav.AllowNew === true ? "disable" : "",
        view: pageNav.AllowView === false ? "disable" : "",
        edit: pageNav.AllowEdit === false ? "disable" : "",
        authorize: pageNav.AllowAuthorize === false ? "disable" : "",
        print: pageNav.AllowPrint === false ? "disable" : "",
      });
      const change_state = async (arg) => {
   
        if (arg === "view") {
            pageLoad()
          return setVal(arg);
        }
        if (arg === "refresh") {
            setCreateObj(obj);
            return setVal(arg);
        }
      };
      const pageLoad=async()=>{
        const companyDetail = await db.CompanySettings.toArray();
        const cityname = await db.cityMaster.where("CityId").equals(parseInt(companyDetail[0].City)).first();
        const currency = await db.currencyMaster.where("Id").equals(parseInt(companyDetail[0].Currency)).first();
        const stateMaster = await db.stateMaster.where("StateId").equals(parseInt(companyDetail[0].State)).first();
        if(companyDetail.length > 0){
            let newObj = {...companyDetail[0],State:stateMaster.StateName,Country:stateMaster.CountryName,Currency:currency.CurrencySymbol,City:cityname.CityName}
            setCreateObj(newObj);
        }
        
      }
      const para = { val, change_state, disabledAction };
      useEffect(()=>{

      },[createObj])
      return(<>
        <div
        className="tabBox"
        style={{
          display: pageNav.hide === true ? "none" : "block",marginBottom:"10px"
        }}
      >
          <CommonFormAction {...para} />
          <div className="box">
              <div className="row">
                  <div className="col w75">
                  <div className="row">
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Company Name"/></label>
                  <input
                name="CompanyName"
                type="text"
                value={createObj.CompanyName}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Company Short Name"/></label>
                  <input
                name="CompanyShortName"
                type="text"
                value={createObj.CompanyShortName}
                readOnly={true}
              />
                  </div>
              </div>
              
          </div>
          <div className="row">
          <div className="col">
                  <div className="formBox">
                  <label><Text content="Adress"/></label>
                 <textarea className="textarea" name="Address" value={createObj.Address} readOnly={true}></textarea>
                  </div>
              </div>
              
          </div>
                  </div>
                  <div className="col w25">
                  {/* <img src={`data:image/png;base64,${createObj.companylogo}`}/> */}
                  </div>
              </div>
         
          <div className="row">
          <div className="col">
                  <div className="formBox">
                  <label><Text content="Country"/></label>
                  <input
                name="Commission"
                type="text"
                value={createObj.Country}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="State"/></label>
                  <input
                name="State"
                type="text"
                value={createObj.State}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="City"/></label>
                  <input
                name="City"
                type="text"
                value={createObj.City}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Pincode"/></label>
                  <input
                name="PinCode"
                type="text"
                value={createObj.PinCode}
                readOnly={true}
              />
                  </div>
              </div>
          </div>
          <div className="row">
          <div className="col">
                  <div className="formBox">
                  <label><Text content="Contact No 1"/></label>
                  <input
                name="Contact1"
                type="text"
                value={createObj.Contact1}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Contact No 2"/></label>
                  <input
                name="Contact2"
                type="text"
                value={createObj.Contact2}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Fax No"/></label>
                  <input
                name="FaxNo"
                type="text"
                value={createObj.FaxNo}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Currency"/></label>
                  <input
                name="Currency"
                type="text"
                value={createObj.Currency}
                readOnly={true}
              />
                  </div>
              </div>
          </div>
          <div className="row">
          <div className="col">
                  <div className="formBox">
                  <label><Text content="Registration Date"/></label>
                  <input
                name="RegisterDate"
                type="text"
                value={createObj.RegisterDate}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Registration No"/></label>
                  <input
                name="RegisterNo"
                type="text"
                value={createObj.RegisterNo}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Web Url"/></label>
                  <input
                name="WebUrl"
                type="text"
                value={createObj.WebUrl}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Licence No"/></label>
                  <input
                name="LicenceNo"
                type="text"
                value={createObj.LicenceNo}
                readOnly={true}
              />
                  </div>
              </div>
          </div>
          <div className="row">
          <div className="col">
                  <div className="formBox">
                  <label><Text content="Email Adress"/></label>
                  <input
                name="Email"
                type="text"
                value={createObj.Email}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label><Text content="Tally Ip and Port"/></label>
                  <input
                name="TallyIpAndPort"
                type="text"
                value={createObj.TallyIpAndPort}
                readOnly={true}
              />
                  </div>
              </div>
              <div className="col">
                  <div className="formBox">
                  <label htmlFor="Commission"><Text content="Tally Company Name"/></label>
                  <input
                name="TallyCompanyname"
                type="text"
                value={createObj.TallyCompanyname}
                readOnly={true}
              />
                  </div>
              </div>
          </div>
          </div>
      </div>
      </>)
}
export default CompanySettings;