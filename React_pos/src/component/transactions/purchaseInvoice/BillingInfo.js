import React, { useEffect } from "react";
import Text from "../../common/text";
const BillingInfo = ({ BillingObj, onchange, requiredObj, val }) => {
  // useEffect(() => {}, [BillingObj]);
  return (
    <>
      {/* <div className="borderBox box"> */}
        {/* <h2>
          <Text content="Billing Info" />
        </h2> */}
        <div className="billingAddr">
          <h4>
            <Text content="Billing Detail" />
          </h4>
          <div className="row">
           <div className="col">
              <div className="formBox">
                <label htmlFor="">
                  <Text content="Country" />
                </label>
                <select name="" id="">
                  {!BillingObj.billingstateid ? (
                    <option value="">Select</option>
                  ) : (
                    <option value="india">India</option>
                  )}
                </select>
              </div>
            </div>
            <div className="col">
              <div
                className={
                  requiredObj.billingstateid === true
                    ? "formBox error"
                    : "formBox"
                }
              >
                <label htmlFor="">
                  <Text content="State" /> 
                </label>
                <select
                  name="billingstateid"
                  value={BillingObj.billingstateid}
                  id=""
                  onChange={onchange}
                >
                  <option value="">Select</option>
                  {BillingObj.stateList.map((state, index) => (
                    <option
                      disabled={val === "view" ? true : false}
                      value={state.StateId}
                      key={index}
                    >
                      {state.StateName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          
         
            <div className="col">
              <div
                className={
                  requiredObj.billingaddress === true
                    ? "formBox error mb-0"
                    : "formBox mb-0"
                }
              >
                <label htmlFor="">
                  <Text content="Billing Address" />
                  
                </label>
                <input
                  type="text"
                  name="billingaddress"
                  value={BillingObj.billingaddress}
                  onChange={onchange}
                  readOnly={val === "view" ? true : false}
                />
              </div>
            </div>
            <div className="col">
              <div
                className={
                  requiredObj.billinggstinno === true
                    ? "formBox error mb-0"
                    : "formBox mb-0"
                }
              >
                <label htmlFor="">
                  <Text content="Billing GSTIN No" />.
                
                </label>
                <input
                  type="text"
                  name="billinggstinno"
                  value={BillingObj.billinggstinno}
                  onChange={onchange}
                  readOnly={val === "view" ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="shippingAddr">
          <h4>
            <Text content="Shipping Detail" />
          </h4>
          <div className="row">
           <div className="col">
              <div className="formBox">
                <label htmlFor="">
                  <Text content="Country" />
                </label>
                <select name="" id="">
                  {!BillingObj.shippingstateid ? (
                    <option value="">Select</option>
                  ) : (
                    <option value="india">India</option>
                  )}
                </select>
              </div>
            </div>
            <div className="col">
              <div
                className={
                  requiredObj.shippingstateid === true
                    ? "formBox error"
                    : "formBox"
                }
              >
                <label htmlFor="">
                  <Text content="State" />
                </label>
                <select
                  name="shippingstateid"
                  value={BillingObj.shippingstateid}
                  id=""
                  onChange={onchange}
                >
                  <option value="">Select</option>
                  {BillingObj.stateList.map((state, index) => (
                    <option
                      disabled={val === "view" ? true : false}
                      value={state.StateId}
                      key={index}
                    >
                      {state.StateName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
           
          
            <div className="col">
              <div
                className={
                  requiredObj.shippingaddress === true
                    ? "formBox error mb-0"
                    : "formBox mb-0"
                }
              >
                <label htmlFor="">
                  <Text content="Shipping Address" />
                 
                </label>
                <input
                  type="text"
                  name="shippingaddress"
                  value={BillingObj.shippingaddress}
                  onChange={onchange}
                  readOnly={val === "view" ? true : false}
                />
              </div>
            </div>
            <div className="col">
              <div
                className={
                  requiredObj.shippinggstinno === true
                    ? "formBox error mb-0"
                    : "formBox mb-0"
                }
              >
                <label htmlFor="">
                  <Text content="Shipping GSTIN No" />.
                    
                </label>
                <input
                  type="text"
                  name="shippinggstinno"
                  value={BillingObj.shippinggstinno}
                  onChange={onchange}
                  readOnly={val === "view" ? true : false}
                />
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </>
  );
};
export default BillingInfo;
