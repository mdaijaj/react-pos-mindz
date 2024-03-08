import "../customerMaster/customerMaster.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import "react-datepicker/dist/react-datepicker.css";
import db from "../../../datasync/dbs";
import validate from "../../common/validate";
import MessagePopup from "../../common/messagePopup";
import Text from "../../common/text";

const VendorMaster = ({ pageNav }) => {
  const plainObj = {
    code: "",
    firstName: "",
    companyName: "",
    city: "",
    state: "",
    country: "",
    Panno: "",
    GSTNo: "",
    Address1: "",
    BillAddress: "",
    pinCode: "",
    Phone: "",
    mobile: "",
    fax: "",
    email: "",
    IsClosed: false,
    DmsLedgerCode: "",
    category: "",
    website: "",
  };
  const requiredObj = {
    code: "",
    firstName: "",
    mobile: "",
    email: "",
  };
  const [customerObj, setCustomerObj] = useState(plainObj);
  const [errorObj, setErrorObj] = useState(requiredObj);
  const [contacterror, setContactError] = useState({
    mobilerror: "",
    phonerror: "",
  });
  const [customerList, setCustomerList] = useState(null);
  const [codeerrtext, setCodeerrtext] = useState("This is mandatory field");
  const [cityList, setCityList] = useState();
  const [stateVal, setStateVal] = useState("");
  const [editId, setEditId] = useState();
  const [val, setVal] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();
  const [cateList, setcateList] = useState([]);
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  //
  /*
   *  handlechange for all input not for DOB, Anniversary.
   */
  const onChangeInput = (e) => {
    if (e.target.name === "city") {
      const getState = cityList.find(
        (s) => s.CityId === parseInt(e.target.value)
      );
      if (getState === undefined) {
        setStateVal("");
      } else {
        setStateVal(getState);
      }
      setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
      setErrorObj({ ...errorObj, [e.target.name]: false });
    } else if (e.target.name === "code") {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
          setErrorObj({ ...errorObj, [e.target.name]: false });
        } else {
          setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
          setErrorObj({ ...errorObj, [e.target.name]: true });
          setCodeerrtext("This is mandatory field");
        }
      } else {
        setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
        setErrorObj({ ...errorObj, [e.target.name]: false });
      }
    } else if (e.target.name === "mobile" || e.target.name === "Phone") {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          const { value } = e.target;
          if (value.length <= 10) {
            setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
            setErrorObj({ ...errorObj, [e.target.name]: false });
          }
        } else {
          setErrorObj({ ...errorObj, [e.target.name]: true });
          setCustomerObj({ ...customerObj, [e.target.name]: "" });
        }
      } else {
        setErrorObj({ ...errorObj, [e.target.name]: false });
        setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
      }
    } else {
      let validateType = e.target.getAttribute("data-valid");
      if (validateType) {
        let checkValidate = validate(e.target.value, validateType);
        if (checkValidate) {
          setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
          setErrorObj({ ...errorObj, [e.target.name]: false });
        } else {
          setErrorObj({ ...errorObj, [e.target.name]: true });
          if (e.target.value === "") {
            setCustomerObj({ ...customerObj, [e.target.name]: "" });
          } else if (e.target.name === "email") {
            setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
          }
        }
      } else {
        setErrorObj({ ...errorObj, [e.target.name]: false });
        setCustomerObj({ ...customerObj, [e.target.name]: e.target.value });
      }
    }

    // end validate}
  };

  /*
   *  handle form actions
   */
  const change_state = (arg) => {
    switch (arg) {
      case "edit": {
        getCustomers();
        getcategory();
        setVal(arg);
        return;
      }
      case "refresh": {
        setCustomerObj(plainObj);
        setErrorObj(requiredObj);
        setStateVal("");
        setVal(arg);
        return;
      }
      case "view": {
        getCustomers();
        setCustomerObj(plainObj);
        getcategory();
        setStateVal("");
        setVal(arg);
        return;
      }
      case "add": {
        setEditId("");
        getcategory();
        setVal(arg);
        return;
      }
      case "save": {
        const objKey = Object.keys(errorObj);
        var result = {};
        objKey.forEach(
          (key) =>
            (result[key] =
              customerObj[key] === "" ||
              customerObj[key] === null ||
              errorObj[key] === true
                ? true
                : false)
        );
        setErrorObj(result);
        const error = Object.values(result).filter((a) => a === true);
        if (error.length > 0) {
          alert("please fill all the field");
        } else {
          saveObj(customerObj);
          setVal(arg);
          setErrorObj(requiredObj);
        }

        return;
      }

      default:
        return arg;
    }
  };
  const getcategory = async () => {
    let cateList = await db.dealerCategory.toArray();
    setcateList(cateList);
  };
  /*
   *  get customer list from db;
   */
  const getCustomers = async () => {
    setCustomerObj(plainObj);
    const getCustomerList = await db.customerMaster
      .where("LedgerType")
      .equals(2)
      .toArray();
    setCustomerList(getCustomerList);
  };
  /*
   *  get cityList and bind city options;
   */
  const getCityList = async () => {
    const valCityList = await db.cityMaster.toArray();
    setCityList(valCityList);
  };
  /*
   *  on select code get Personal Information;
   */
  const getCustomer = (customer) => {
    setDropDownOption(false);
    if (customer) {
      setEditId(customer.id);
      const data = {
        code: customer.PartyCode,
        firstName: customer.PartyName,
        companyName: customer.CompanyCode,
        city: customer.CityId,
        pinCode: customer.Pincode,
        Phone: customer.Phone2,
        mobile: customer.Phone1,
        Address1: customer.Address,
        BillAddress: customer.BillAddress,
        fax: customer.Fax,
        Panno: customer.PAN,
        GSTNo: customer.GSTNo,
        DmsLedgerCode: customer.DmsLedgerCode,
        category: customer.DealerCategory,
        IsClosed: customer.IsClosed === 1 ? true : false,
        email: customer.Email,
        website: customer.Website,
      };
      const getState = cityList.find(
        (s) => s.CityId === parseInt(customer.CityId)
      );
      if (getState === undefined) {
        setStateVal("");
      } else {
        setStateVal(getState);
      }
      setCustomerObj(data);
    }
  };
  /*
   *  create object for save and update data;
   */
  const saveObj = async (Obj) => {
    let data = {
      new: 1,
      update: 0,
      PartyCode: Obj.code === undefined ? "" : Obj.code,
      PartyName: Obj.firstName === undefined ? "" : Obj.firstName,
      CompanyCode: Obj.companyName === undefined ? "" : Obj.companyName,
      CityId: Obj.city === undefined ? "" : parseInt(Obj.city),
      PAN: Obj.Panno === undefined ? "" : Obj.Panno,
      GSTNo: Obj.GSTNo === undefined ? "" : Obj.GSTNo,
      Address: Obj.Address1 === undefined ? "" : Obj.Address1,
      BillAddress: Obj.BillAddress === undefined ? "" : Obj.BillAddress,
      Pincode: Obj.pinCode === undefined ? "" : Obj.pinCode,
      Phone2: Obj.Phone === undefined ? "" : Obj.Phone,
      Phone1: Obj.mobile === undefined ? "" : Obj.mobile,
      Fax: Obj.fax === undefined ? "" : Obj.fax,
      Email: Obj.email === undefined ? "" : Obj.email,
      IsClosed: Obj.IsClosed === undefined ? "" : Obj.IsClosed === true ? 1 : 0,
      DmsLedgerCode: Obj.DmsLedgerCode === undefined ? "" : Obj.DmsLedgerCode,
      DealerCategory: Obj.category === undefined ? "" : Obj.category,
      LedgerType: 2,
      CreatedBy: localStorage.getItem("UserId"),
      Website: Obj.website === undefined ? "" : Obj.website,
    };
    if (editId) {
      data.update = 1;
      await db.customerMaster.update(editId, data).then(function (updated) {
        if (updated) {
          setPopupMessage("Data Updated Successfully");
          setPopup(true);
          setCustomerObj(plainObj);
        } else {
          console.log("");
        }
      });
    } else {
      data.update = 0;
      data.new = 1;
      console.log(data, "IsClosed");
      await db.customerMaster.add(data).then(function (updated) {
        if (updated) {
          setPopupMessage("Data Save Successfully");
          setPopup(true);
          setCustomerObj(plainObj);
        } else {
          console.log("");
        }
      });
    }
  };
  const para = { val, change_state, disabledAction };
  const onSpace = (e) => {
    const keycodes = [
      8, 9, 33, 34, 35, 36, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55,
      56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
    ];

    if (!keycodes.includes(e.keyCode)) {
      e.preventDefault();
      if (e.target.name === "mobile") {
        setContactError({
          ...contacterror,
          mobilerror: "Special chars not allowed",
        });
        setTimeout(() => {
          setContactError({ ...contacterror, mobilerror: "" });
        }, 1000);
      } else if (e.target.name === "Phone") {
        setContactError({
          ...contacterror,
          phonerror: "Special chars not allowed",
        });
        setTimeout(() => {
          setContactError({ ...contacterror, phonerror: "" });
        }, 1000);
      }
    }
  };
  const handleChecked = (e) => {
    let { name, checked } = e.target;
    setCustomerObj({
      ...customerObj,
      [name]: checked,
    });
  };
  const checkUser = async (e) => {
    let user = await db.customerMaster
      .where("PartyCode")
      .equals(e.target.value)
      .first();
    if (user) {
      setErrorObj({ ...errorObj, [e.target.name]: true });
      setCodeerrtext("Code is already used");
    }
    console.log(user, "user");
  };
  const onchangeCate = (e) => {
    let { name, value } = e.target;
    setCustomerObj({
      ...customerObj,
      [name]: value,
    });
  };
  useEffect(() => {
    getCityList();
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
  }, [customerObj, customerList, val, stateVal, codeFocus]);
  const messageClose = () => {
    setPopup(false);
  };
  return (
    <>
      {popup && (
        <MessagePopup message={popupMessage} closePopup={messageClose} />
      )}

      <div
        className="customerMasterBox"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="customerMasterSection">
          <div className="boxTitle">Personal Information</div>
          <div className="row">
            <div className="col w35 autoComp">
              <div className="formBox">
                <label htmlFor="">
                  <Text content="Code" />
                  <span className="required">*</span>
                </label>
                {val === "edit" || val === "view" ? (
                  customerList && (
                    <Autocomplete
                      open={dropDownOption}
                      options={customerList}
                      onChange={(e, value) => getCustomer(value)}
                      getOptionLabel={(option) => option.PartyCode}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Press ctrl + L"
                          className={
                            errorObj && errorObj.code === true
                              ? "autocodeerror"
                              : "autocode"
                          }
                          onFocus={() => setCodeFocus(true)}
                          onBlur={() => {
                            setCodeFocus(false);
                            setDropDownOption(false);
                          }}
                        />
                      )}
                    />
                  )
                ) : (
                  <input
                    name="code"
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    onKeyUp={(e) => checkUser(e)}
                    className={
                      errorObj && errorObj.code === true ? "error" : ""
                    }
                    data-valid="varChar"
                    value={customerObj && customerObj.code}
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                )}
                {errorObj.code ? (
                  <p style={{ color: "red", fontSize: "15px" }}>
                    {codeerrtext}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="box greyBg">
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Vendor Name" />
                    <span className="required">*</span>
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="firstName"
                    value={customerObj && customerObj.firstName}
                    type="text"
                    className={
                      errorObj && errorObj.firstName === true ? "error" : ""
                    }
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                    data-valid="varCharSpace"
                  />
                  {errorObj.firstName ? (
                    <p style={{ color: "red", fontSize: "15px" }}>
                      <Text content="This is mandatory field" />
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Company Code" />
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="companyName"
                    value={customerObj && customerObj.companyName}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="PAN No" />
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="Panno"
                    className={
                      errorObj && errorObj.Panno === true ? "error" : ""
                    }
                    value={customerObj && customerObj.Panno}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">GST No</label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="GSTNo"
                    value={customerObj && customerObj.GSTNo}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Category" />
                  </label>
                  <select
                    name="category"
                    value={customerObj.category}
                    onChange={(e) => onchangeCate(e)}
                    disabled={
                      val === undefined || val === "view" ? true : false
                    }
                  >
                    <option value="">select</option>
                    {cateList.map((a) => (
                      <option value={a.dealercategoryid}>
                        {a.dealercategorycode}
                      </option>
                    ))}
                  </select>
                  {/* <input
                    onChange={(e) => onChangeInput(e)}
                    name="category"
                    value={customerObj && customerObj.category}
                    type="text"
                    readOnly={
                      val === undefined || val === "refresh" ? true : false
                    }
                  /> */}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="DMS Ledger Code" />
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="DmsLedgerCode"
                    value={customerObj && customerObj.DmsLedgerCode}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col w35">
                <div className="checkboxNew" style={{ marginTop: "22px" }}>
                  <input
                    type="checkbox"
                    disabled={
                      val === "view" || val === "refresh" ? true : false
                    }
                    id="checkboxOne_mark_vend"
                    checked={customerObj.IsClosed}
                    onChange={(e) => handleChecked(e)}
                    name="IsClosed"
                  />

                  <label htmlFor="checkboxOne_mark_vend">
                    <Text content="Mark as closed" />
                  </label>
                </div>
              </div>
            </div>
            {/* <div className="row">
              <div className="col w100 mt-2">
                <div className="RemarkForm mt-1 mb-2">
                  <label htmlFor="">Remark</label>
                  <textarea
                    onChange={(e) => onChangeInput(e)}
                    name="posRemark"
                    value={customerObj && customerObj.posRemark}
                    type="text"
                    readOnly={
                      val === undefined || val === "refresh" ? true : false
                    }
                  ></textarea>
                </div>
              </div>
            </div> */}
          </div>
          <div className="boxTitle">
            <Text content="Address and Contact Info" />
          </div>
          <div className="box greyBg">
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">City</label>
                  <select
                    onChange={(e) => onChangeInput(e)}
                    name="city"
                    value={customerObj && customerObj.city}
                  >
                    <option value="select">select</option>
                    {cityList &&
                      cityList.map((item, index) => (
                        <option
                          key={index}
                          disabled={
                            val === undefined || val === "view" ? true : false
                          }
                          value={item.CityId}
                        >
                          {item.CityName.toUpperCase()}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">State</label>
                  <select
                    name="state"
                    onChange={(e) => onChangeInput(e)}
                    value={stateVal && stateVal.StateName}
                    type="text"
                  >
                    {stateVal === "" ? (
                      <option value="Select">Select</option>
                    ) : (
                      <option>
                        {stateVal && stateVal.StateName.toUpperCase()}
                      </option>
                    )}
                  </select>
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Country" />
                  </label>
                  <select
                    name="country"
                    onChange={(e) => onChangeInput(e)}
                    value={customerObj && customerObj.country}
                  >
                    {stateVal === "" ? (
                      <option value="Select">select</option>
                    ) : (
                      <option value="india">INDIA</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col">
                <div className="formBox">
                  <label htmlFor="">Street No</label>
                  <textarea
                    onChange={(e) => onChangeInput(e)}
                    name="streetNo"
                    className="streettextarea"
                    value={customerObj && customerObj.streetNo}
                    type="text"
                    readOnly={
                      val === undefined || val === "refresh" ? true : false
                    }
                  />
                </div>
              </div> */}
              {/* <div className="col">
                <div className="formBox">
                  <label htmlFor="">Street Name</label>
                  <textarea
                    onChange={(e) => onChangeInput(e)}
                    name="streetName"
                    className="streettextarea"
                    value={customerObj && customerObj.streetName}
                    type="text"
                    readOnly={
                      val === undefined || val === "refresh" ? true : false
                    }
                  />
                </div>
              </div> */}
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Pin Code" />
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="pinCode"
                    value={customerObj && customerObj.pinCode}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Phone" />
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="Phone"
                    value={customerObj && customerObj.Phone}
                    type="text"
                    onKeyDown={onSpace}
                    className={contacterror.phonerror ? "error" : ""}
                    data-valid="number"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                  {contacterror.phonerror ? (
                    <p style={{ color: "red", fontSize: "15px" }}>
                      {contacterror.phonerror}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Mobile" />
                    <span className="required">*</span>
                  </label>
                  <input
                    name="mobile"
                    onChange={(e) => {
                      onChangeInput(e);
                    }}
                    onKeyDown={onSpace}
                    value={customerObj && customerObj.mobile}
                    type="text"
                    className={
                      errorObj && errorObj.mobile === true ? "error" : ""
                    }
                    data-valid="number"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                  {contacterror.mobilerror ? (
                    <span style={{ color: "red", fontSize: "15px" }}>
                      {contacterror.mobilerror}
                    </span>
                  ) : null}
                  {errorObj.mobile ? (
                    <p style={{ color: "red", fontSize: "15px" }}>
                      <Text content="This is mandatory field" />
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Street Address 1" />{" "}
                  </label>
                  <textarea
                    onChange={(e) => onChangeInput(e)}
                    name="Address1"
                    value={customerObj && customerObj.Address1}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox">
                  <label htmlFor="">
                    <Text content="Street Address 2" />{" "}
                  </label>
                  <textarea
                    onChange={(e) => onChangeInput(e)}
                    name="BillAddress"
                    value={customerObj && customerObj.BillAddress}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="formBox mb-0">
                  <label htmlFor="">
                    <Text content="Fax" />{" "}
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    type="text"
                    name="fax"
                    value={customerObj && customerObj.fax}
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
              <div className="col">
                <div className="formBox mb-0">
                  <label htmlFor="">
                    <Text content="Email" />
                    <span className="required">*</span>
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="email"
                    value={customerObj && customerObj.email}
                    type="text"
                    className={
                      errorObj && errorObj.email === true ? "error" : ""
                    }
                    data-valid="email"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                  {errorObj.email ? (
                    <p style={{ color: "red", fontSize: "15px" }}>
                      <Text content="This is mandatory field" />
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="col">
                <div className="formBox mb-0">
                  <label htmlFor="">
                    <Text content="Website" />
                  </label>
                  <input
                    onChange={(e) => onChangeInput(e)}
                    name="website"
                    value={customerObj && customerObj.website}
                    type="text"
                    readOnly={
                      val === undefined || val === "view" ? true : false
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VendorMaster;
