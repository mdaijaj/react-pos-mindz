import React from "react";
import Text from "../../common/text";

const TaxInfo = ({ taxObject }) => {
  return (
    <>
      <div className="borderBox box">
        <div className="taxAmount">
          <div className="row">
            <div className="col">
              <label htmlFor="">
                <Text content="Gross Amount" />
              </label>
            </div>
            <div className="col">
              <input
                type="text"
                value={taxObject.grossamount}
                readOnly={true}
              />
            </div>

            <div className="col">
              <label htmlFor="">
                <Text content="Total Discount" />
              </label>
            </div>
            <div className="col">
              <input
                type="text"
                value={taxObject.discountamount}
                readOnly={true}
              />
            </div>
            <div className="col">
              <label htmlFor="">
                <Text content="Total Tax" />
              </label>
            </div>
            <div className="col">
              <input type="text" value={taxObject.taxamount} readOnly={true} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="">
                <Text content="Total Amount" />
              </label>
            </div>
            <div className="col">
              <input
                type="text"
                value={taxObject.totalAmount}
                readOnly={true}
              />
            </div>
            <div className="col">
              <label htmlFor="">
                <Text content="Round Off" />
              </label>
            </div>
            <div className="col">
              <input type="text" value={taxObject.roundOff} readOnly={true} />
            </div>

            <div className="col">
              <label htmlFor="">
                <Text content="Final Amount" />
              </label>
            </div>
            <div className="col">
              <input type="text" value={taxObject.netamount} readOnly={true} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <label htmlFor="">
                <Text content="IGST Amount" />
              </label>
            </div>
            <div className="col">
              <input type="text" value={taxObject.igstAmount} readOnly={true} />
            </div>

            <div className="col">
              <label htmlFor="">
                <Text content="SGST Amount" />
              </label>
            </div>
            <div className="col">
              <input type="text" value={taxObject.sgstAmount} readOnly={true} />
            </div>
            <div className="col">
              <label htmlFor="">
                <Text content="CGST Amount" />
              </label>
            </div>
            <div className="col">
              <input type="text" value={taxObject.cgstAmount} readOnly={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TaxInfo;
