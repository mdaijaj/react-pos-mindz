import React from "react";
import Text from "../../common/text";
const TaxInfo = ({ taxObject }) => {
  return (
    <>
      
        {/* <h2>
          <Text content="Tax Amount" />
        </h2> */}
        <div className="taxAmount">
          <div className="row">
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="Gross Amount" />
              </label>
              <input
                type="text"
                value={taxObject.grossamount}
                readOnly={true}
              />
              </div>
            </div>
        
            <div className="col">
            <div className="formBox">
            <label htmlFor="">
                <Text content="Total Discount" />
              </label>
              <input
                type="text"
                value={taxObject.discountamount}
                readOnly={true}
              />
              </div>
              
            </div>
           
        
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="Total Tax" />
              </label>
              <input type="text" value={taxObject.taxamount} readOnly={true} />
              </div> 
            </div>
         
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="Total Amount" />
              </label>
              <input
                type="text"
                value={taxObject.totalAmount}
                readOnly={true}
              />
              </div>
             
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="Round Off" />
              </label>
              <input type="text" value={taxObject.roundOff} readOnly={true} />
              </div>
              
            </div>
         
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="Final Amount" />
              </label>
              <input type="text" value={taxObject.netamount} readOnly={true} />
              </div>
              
            </div>
         
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="IGST Amount" />
              </label>
              <input type="text" value={taxObject.igstAmount} readOnly={true} />
              </div>
            </div>
          
            <div className="col">
              <div className="formBox">
              <label htmlFor="">
                <Text content="SGST Amount" />
              </label>
              <input type="text" value={taxObject.sgstAmount} readOnly={true} />
              </div>
              
            </div>
          </div>
          <div className="row">
            <div className="col w25">
              <div className="formBox">
              <label htmlFor="">
                <Text content="CGST Amount" />
              </label>
              <input type="text" value={taxObject.cgstAmount} readOnly={true} />
              </div>
              
            </div>
          </div>
        </div>
     
    </>
  );
};
export default TaxInfo;
