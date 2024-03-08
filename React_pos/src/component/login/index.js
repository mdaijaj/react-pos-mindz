import { useState, useEffect } from "react";
import "./login.scss";
import Logo from "../../images/logo.png";
import MailIcon from "../../images/icon/envelope.svg";
import Phone from "../../images/icon/phone-alt.svg";
import axios from "axios";
import * as dbs from "../../datasync/dbs";
import * as mdb from "../../datasync/masterdata";
import db from "../../datasync/dbs";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ForgotPassword from "../forgotPassword/index";
import Text from "../common/text";
import { el } from "date-fns/locale";
// import {translateLanguage} from "../common/commonFunction"
//import getTransactionData from "../../datasync/getTransactionData";
const demo_data = {
  username: "",
  password: "",
  WebUrl: "pos",
  remember: false,
  HashKey: "",
  IsForcfullyLogOut: false,
  //   "UserName" : "testinggq",
  // "Password" : "aa",
  // "WebUrl" : "pos",
  // "BrowserName" : "Postman",
  // "BrowserInfo" : "",
  // "HashKey"  : "44241",
  // "IsForcfullyLogOut" : "false"
};

// const apiData= {
//   usa: "english",
//   france: "french",
//   genmany: "german",
//   china: "chinies",
//   india: "hindi",
//   uae: "arabia"
// }
// var key= "india"
// const translateLanguage= async(key, apiData)=>{
//   let all_country=Object.keys(apiData)
//   const countryFound =all_country.find(element => element ==key);
//   console.log("countryFound", countryFound)
//   if(countryFound){
//     console.log("languagefound", apiData[key])
//     return apiData[key];
//   }else{
//     console.log("key", key)
//     return key
//   }
// }

// Login Component
const Login = (props) => {
  // ## States
  // To store input data
  let [data, setData] = useState(demo_data);
  const [fgPassstatus, setFgPassstatus] = useState(false);

  // To alert user if anything goes wrong
  let [alert, setAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [loginerror, setloginerror] = useState(false);
  const [internetConnectionStatus, setInternetConnectionStatus] = useState();
  const [lodding, setLodding] = useState(false);
  let [logins, setlogin] = useState(false);
  const [forceLogin, setForceLogin] = useState({ status: false, msg: "" });
  let [progress, setProgress] = useState(false);

  // Functions
  // To catch input data
  const input_value = (e) => {
    setErrorMsg(false);
    let { name, value } = e.target;
    if (e.target.name === "remember") {
      alert && setAlert(false);
      setData({ ...data, [name]: e.target.checked });
    } else {
      alert && setAlert(false);
      if (value.length > 12) {
        console.log("The field cannot contain more than 5 characters!");
        setErrorMsg(`${name} length should be only ${12}`);
        setTimeout(() => {
          setErrorMsg("");
        }, 2000);
        return false;
      } else {
        let { name, value } = e.target;
        setData({ ...data, [name]: value });
      }
    }
  };

  let logindata = sessionStorage.getItem("loginfailed");
  const getBrowserId = async () => {
    let x = Math.floor(Math.random() * 100000000 + 1);
    let id = await db.loginbrowserId.toArray();
    if (id.length === 0) {
      db.loginbrowserId.add({ Id: x });
      setData({ ...data, HashKey: x });
    } else {
      setData({ ...data, HashKey: id[0].Id });
    }
  };
  useEffect(() => {
    const checkConnection = setInterval(() => {
      let ConnStatus = navigator.onLine ? true : false;
      setInternetConnectionStatus(ConnStatus);
    }, 2000);
    return () => clearInterval(checkConnection);
  }, [internetConnectionStatus]);
  useEffect(() => {
    if (localStorage.getItem("username") !== "") {
      getBrowserId();
      setData(JSON.parse(localStorage.getItem("username")));
    }
    setTimeout(() => {
      if (JSON.parse(logindata) > 4) {
        setlogin(true);
        setloginerror("You have exceeded your login attempts");
      }
    }, 500);
  }, [logindata, logins]);

  // to send login data to login api
  const login = async (forcefully) => {
    setProgress(true);
    const api = "/api/AuthLogin/SignIn";
    try {
      if (data.username === "" && data.password === "") {
        setAlert("Please enter usename and password");
        setProgress(false);
      } else if (data.password === "") {
        setAlert("Please enter your password ");
        setProgress(false);
      } else if (data.username === "") {
        setAlert("Please enter your usename ");
        setProgress(false);
      } else {
        if (internetConnectionStatus) {
          console.log("internetConnectionStatus", internetConnectionStatus);
          axios
            .post(api, { ...data, IsForcfullyLogOut: forcefully })
            .then(async (res) => {
                console.log(res,"login respnse response")
              if (res.data.statuscode === 400) {
                setForceLogin({ status: true, msg: res.data.message });
              } else if (res.headers.token) {
                localStorage.setItem("token", res.headers.token);
                sessionStorage.setItem("token", res.headers.token);
                localStorage.setItem("fname", data.username);
                localStorage.setItem("UserId", res.data.UserId);
                if(res.data.UserPreferedLanguageDictionary !== null){
                const UPLD = db.UserPreferedLanguageDictionary.toArray()
                  .then()
                  .catch((err) => console.log(err));
                if (UPLD.length > 0) {
                  db.UserPreferedLanguageDictionary.update(
                    1,
                    res.data.UserPreferedLanguageDictionary
                  );
                } else {
                  db.UserPreferedLanguageDictionary.add(
                    res.data.UserPreferedLanguageDictionary
                  );
                }
              }
                const cnt = await db.seriesCount
                  .toArray()
                  .then()
                  .catch((err) => console.log(err));
                if (cnt.length > 0) {
                  let gResult =
                    res.data.Result && res.data.Result.length > cnt.length
                      ? true
                      : false;
                  if (gResult) {
                    let nArray = res.data.Result.map((a) => {
                      let m = cnt.find((b) => b.formid === a.formid);
                      if (m) {
                        return { ...m, totalrecord: a.totalrecord };
                      } else {
                        return a;
                      }
                    });
                    await db.seriesCount.bulkPut(nArray);
                  } else {
                    let vArray = cnt.map((a) => {
                      let m = res.data.Result.find(
                        (b) => b.formid === a.formid
                      );
                      if (m) {
                        return { ...a, totalrecord: m.totalrecord };
                      } else {
                        return a;
                      }
                    });
                    await db.seriesCount.bulkPut(vArray);
                  }
                } else {
                  await db.seriesCount.bulkAdd(res.data.Result);
                }

                await mdb.globalsetting();
                if (data.remember === true) {
                  localStorage.setItem("username", JSON.stringify(data));
                } else {
                  localStorage.setItem("username", "");
                }
                setData(demo_data);

                const dbstatus = await dbs.getdbcreated();
                console.log(dbstatus,'dbstatus............dbstatus')
                if (dbstatus) {
                  const datadateObj = {
                    alteredon: "1970-01-01 00:00:01",
                    pageindexno: 0,
                  };
                  const StateMaster = await mdb.syncStateMaster(datadateObj);
                  const syncCityMaster = await mdb.syncCityMaster(datadateObj);
                  const CustomerMaster = await mdb.syncCustomerMaster(
                    datadateObj
                  );
                  const VendorMaster = await mdb.syncVendorMaster(datadateObj);
                  const UnitMaster = await mdb.syncUnitMaster(datadateObj);
                  const ItemGroup = await mdb.syncItemGroup(datadateObj);
                  const HsnMaster = await mdb.syncHsnMaster(datadateObj);
                  const ItemMaster = await mdb.syncItemMaster(datadateObj);
                  const attributeMaster = await dbs.syncattributeMaster();
                  const PriceMaster = await mdb.syncPriceMaster(datadateObj);
                  const StockLotMaster = await mdb.syncStockLotMaster();
                  const GITMaster = await mdb.syncGITMaster(datadateObj);
                  const EmployeeMaster = await mdb.syncEmployeeMaster(
                    datadateObj
                  );
                  const DesignationMaster = await mdb.syncDesignationMaster(
                    datadateObj
                  );
                  const SalesPersonMaster = await mdb.syncSalesPersonMaster(
                    datadateObj
                  );
                  const ReasonMaster = await mdb.syncReasonMaster(datadateObj);
                  const ReasonTypeMaster = await mdb.syncReasonTypeMaster(
                    datadateObj
                  );
                  const CurrencyMaster = await mdb.syncCurrencyMaster(
                    datadateObj
                  );
                  const CounterMaster = await mdb.syncCounterMaster(
                    datadateObj
                  );
                  const seriesMaster = await mdb.syncSeriesMaster(datadateObj);
                  const SeriesFieldMaster = await mdb.syncSeriesFieldMaster(
                    datadateObj
                  );
                  const SeriesApply = await mdb.syncSeriesApply(datadateObj);
                  const syncSaleOrder = await mdb.syncSaleOrder(datadateObj);
                  const formMaster = await mdb.syncFormMaster(datadateObj);
                  const FormMenuMaster = await mdb.syncFormMenuMaster(
                    datadateObj
                  );
                  const FormGroupMaster = await mdb.syncFormGroupMaster(
                    datadateObj
                  );
                  const RoleMaster = await mdb.syncRoleMap(datadateObj);
                  const UserMaster = await mdb.syncUserMaster(datadateObj);
                  const VoucherMaster = await mdb.syncVoucherFormMaster(
                    datadateObj
                  );
                  const VoucherList = await mdb.syncVoucherList(datadateObj);
                  const ItemTaxStructure = await mdb.syncItemTaxStructure(
                    datadateObj
                  );
                  const GetItemStock = await mdb.syncGetItemStock(datadateObj);
                  const DealerCategory = await mdb.syncDealerCategory(
                    datadateObj
                  );
                  const itemsaleprice = await mdb.syncItemSalePrice(
                    datadateObj
                  );
                  const billingtype = await mdb.billingType(datadateObj);
                  const Influencers = await mdb.InfluencerData(datadateObj);
                  const BatchMaster = await mdb.BatchMaster(datadateObj)
                  const GodownMaster = await mdb.GodownMaster(datadateObj);
                  const SerialMaster = await mdb.SerialMaster(datadateObj);
                  const CompanySettings= await mdb.CompanySettings(datadateObj);
                  const ProfileMaster = await mdb.ProfileMaster(datadateObj);
                  const GstClassificationMapMaster =
                    await dbs.syncGstClassificationMapMaster();
                  const SgstMaster = await dbs.syncSgstMaster();
                  const CgstMaster = await dbs.syncCgstMaster();
                  const IgstMaster = await dbs.syncIgstMaster();
                  const GstClassificationMaster =
                    await dbs.syncGstClassificationMaster();
                  const StockMaster = await dbs.syncStockMaster();
                  const StockMasterDetail = await dbs.syncStockMasterDetail();
                  const CurrencyMasterDetails =
                    await dbs.syncCurrencyMasterDetails();
                  const GeographicalMaster = await dbs.syncGeographicalMaster();
                  const attributeMasterDetails =
                    await dbs.syncattributeMasterDetails();

                  const promise = await Promise.allSettled([
                    UserMaster,
                    StateMaster,
                    syncCityMaster,
                    CustomerMaster,
                    VendorMaster,
                    UnitMaster,
                    ItemGroup,
                    HsnMaster,
                    ItemMaster,
                    attributeMaster,
                    PriceMaster,
                    StockLotMaster,
                    GITMaster,
                    DesignationMaster,
                    SalesPersonMaster,
                    seriesMaster,
                    SeriesFieldMaster,
                    SeriesApply,
                    VoucherMaster,
                    VoucherList,
                    ItemTaxStructure,
                    GetItemStock,
                    DealerCategory,
                    itemsaleprice,
                    billingtype,
                    Influencers,
                    BatchMaster,
                    GodownMaster,
                    SerialMaster,
                    CompanySettings,
                    ProfileMaster,
                    syncSaleOrder,
                    formMaster,
                    FormMenuMaster,
                    FormGroupMaster,
                    RoleMaster,
                    GstClassificationMapMaster,
                    SgstMaster,
                    CgstMaster,
                    IgstMaster,
                    GstClassificationMaster,
                    StockMaster,
                    StockMasterDetail,
                    EmployeeMaster,
                    ReasonMaster,
                    ReasonTypeMaster,
                    CounterMaster,
                    CurrencyMaster,
                    CurrencyMasterDetails,
                    GeographicalMaster,
                    attributeMasterDetails,
                  ])
                    .then((values) =>
                      values.forEach((values) => {
                        return values.status === "fulfilled" ? true : false;
                      })
                    )
                    .catch((err) => console.log(err, "err"));
                  // getTransactionData();
                  // console.log(promise, "promisepromisepromisepromise");
                  const Logdetail = await db.userLogin
                    .where("name")
                    .equals(data.username)
                    .first()
                    .then()
                    .catch((err) => console.log(err));
                  if (Logdetail) {
                    await db.userLogin
                      .put({
                        id: Logdetail.id,
                        name: data.username,
                        password: data.password,
                        new: res.headers.token,
                        Id: res.data.UserId,
                      })
                      .then((a) => console.log(a))
                      .catch((err) => console.log(err));
                  } else {
                    await db.userLogin
                      .add({
                        name: data.username,
                        password: data.password,
                        new: res.headers.token,
                        Id: res.data.UserId,
                      })
                      .then((a) => console.log(a))
                      .catch((err) => console.log(err));
                  }
                } else {
                  console.log("not created in login attempt");
                }
                props.refresh(); //for changing state to "true" - to redirect to dashboard
              } else {
                if (res.data && res.data.statuscode === 407) {
                  let msg = res.data.message;
                  setAlert(msg);
                  setData(demo_data);
                  setProgress(false);
                  return;
                }
                setProgress(false);
                setAlert("Oops Something went wrong");
                setData(demo_data);
              }
            })
            .catch((error) => {
              if (
                error &&
                error.response &&
                error.response.data &&
                error.response.data.statuscode === 407
              ) {
                let msg = error.response.data.message;
                setAlert(msg);
                setData(demo_data);
                console.log("failed");
                setProgress(false);
                props.loginfailed();
                return;
              }
              setProgress(false);
              setAlert("Oops Something went wrong");
              setData(demo_data);
            });
        } else {
          if (data.username === "") {
            alert("Enter User name");
          } else {
            let user = await db.userLogin
              .where("name")
              .equals(data.username)
              .first();
            if (user) {
              if (
                data.username === user.name &&
                data.password === user.password
              ) {
                localStorage.setItem("token", user.new);
                sessionStorage.setItem("token", user.new);
                localStorage.setItem("fname", user.name);
                localStorage.setItem("UserId", user.Id);
                props.refresh();
              } else {
                setAlert("invalid login detail");
                setProgress(false);
              }
            } else {
              setAlert(
                "first time you can't login Offline you need first time online Login"
              );
              setProgress(false);
            }
          }
          console.log("you are offline");
        }
      }
    } catch (error) {}
  };
  const [state, setState] = useState({
    hide: true,
  });
  const dbDelete = () => {
    dbs.del();
    window.location.reload();
  };
  const hideSwitch = (ev) => {
    setState({ hide: !state.hide });
  };
  const ForceloginCancel = () => {
    setForceLogin({ status: false, msg: "" });
    setProgress(false);
  };
  const handle_copy_paste = (e) => {
    e.preventDefault();
    setErrorMsg("Copy ,Paste not allowed");
    return false;
  };
  const fgpBtn = () => {
    setFgPassstatus(true);
  };

  return (
    <>
      <div className="loginContainer">
        <div className="loginBg">
          <div className="loginLogo">
            <img src={Logo} alt="" />
            <button onClick={() => dbDelete()} className="deleteDb">
              Delete DB
            </button>
          </div>
          {fgPassstatus === false ? (
            <div
              className={
                forceLogin.status === false ? "loginBox" : "loginBox force"
              }
            >
              {forceLogin.status === false ? (
                <div>
                  <div className="loginTitle">
                    <Text content="Login" />
                  </div>
                  <div className="loginFormBox">
                    <div className="loginForm">
                      <input
                        type="text"
                        placeholder="User Name"
                        name="username"
                        onChange={input_value}
                        value={data && data.username}
                        // onPaste={handle_copy_paste}
                        // onCopy={handle_copy_paste}
                      />
                    </div>
                    <div className="loginForm">
                      <input
                        type={state.hide ? "password" : "input"}
                        placeholder="Password"
                        name="password"
                        onChange={input_value}
                        onPaste={handle_copy_paste}
                        onCopy={handle_copy_paste}
                        value={data && data.password}
                        className="form-control"
                      />
                      <span
                        className="password__show field-icon"
                        onClick={hideSwitch}
                      >
                        {state.hide ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </span>
                    </div>
                    <div className="loginForm mb-25">
                      <input
                        checked={
                          data && data.remember === true ? "checked" : ""
                        }
                        type="checkbox"
                        onChange={input_value}
                        name="remember"
                        id="remember"
                        className="typeCheck"
                      />
                      <label htmlFor="remember">
                        <Text content="Remember" />
                      </label>
                    </div>
                    {alert && <p className="error">{alert}</p>}
                    <div className="loginForm mb-15">
                      {logins && logins === true ? (
                        <button disabled>Sign in</button>
                      ) : progress ? (
                        <button disabled>Please wait...</button>
                      ) : (
                        <button onClick={() => login(false)}>
                          <Text content="Sign in" />
                        </button>
                      )}
                    </div>
                    <div className="forgotpass">
                      <button
                        onClick={() => fgpBtn()}
                        className="forgotpassLink"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {errorMsg && <p className="error">{errorMsg}</p>}
                    {loginerror && <p className="error">{loginerror}</p>}
                    {props.errorMsg && (
                      <p className="error">{props.errorMsg}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="loginforce">
                  <div className="msgDiv">{forceLogin.msg}</div>
                  <div className="btnDiv">
                    <button className="lff_btn" onClick={() => login(true)}>
                      Login force fully
                    </button>
                    <button
                      className="lff_btn Cancel"
                      onClick={() => ForceloginCancel()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ForgotPassword
              lodingProc={(a) => setLodding(a)}
              forgotstatus={(s) => setFgPassstatus(s)}
            />
          )}
          <div className="loginFooter">
            <div className="footerMail">
              <img src={MailIcon} alt="" /> info@eazyorder.com
            </div>
            <div className="footerNo">
              <img src={Phone} alt="" /> +91 123456789
            </div>
            <div className="copyRight">2020 © Eazy Business Solutions</div>
          </div>
        </div>
      </div>
      {lodding && (
        <div className="loding_div">
          <h1 data-text="Loading...">Loading...</h1>
        </div>
      )}
    </>
  );
};

export default Login;
