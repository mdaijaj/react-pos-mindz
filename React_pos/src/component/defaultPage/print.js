import React from "react";
import "./app.css";

const Print = () => {
  const handleprint = () => {
    window.print();
  };
  return (
    <div className="tablePro">
      <button className="no-print" onClick={handleprint}>
        print
      </button>
      <div>
        <table
          cellspacing="0"
          cellpadding="0"
          border="1"
          style={{ fontSize: "12px" }}
        >
          <tr>
            <td colSpan="16">&nbsp;</td> <td colSpan="1">$$COPY_NAME</td>
          </tr>
          <tr>
            <td colSpan="18">&nbsp;</td>
          </tr>
          <tr>
            <td width="30" rowspan="13">
              &nbsp;
            </td>
            <td rowspan="13" width="250">
              <p>$$BRANCH_</p>
              <p>LOGO1</p>
            </td>
            <td width="44"></td>
            <td colSpan="3" width="101">
              Invoice No:
            </td>
            <td colSpan="2" width="109">
              $$INVOICE_NO
            </td>
            <td width="30"></td>
            <td colSpan="2" width="119">
              Date of Invoice
            </td>
            <td colSpan="2" width="104">
              $$INVOICE_DATE
            </td>
            <td width="65"></td>
            <td width="40"></td>
            <td colSpan="2" rowspan="4" width="47">
              $$EINVOICE_QRCODE
            </td>
          </tr>
          <tr>
            <td></td>
            <td>IRN</td>
            <td colSpan="9">$$IRN_NO</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="4">
              <p>CONSIGNOR</p>
              <p> DETAILS</p>
            </td>
            <td></td>
            <td></td>
            <td colSpan="3">CONSIGNEE DETAILS</td>
            <td colSpan="3">
              <br />
              (@Invoice Type@)
            </td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="3" width="101">
              GSTIN/Unique ID
            </td>
            <td colSpan="3">$$UNIT_GSTIN_NO</td>
            <td colSpan="2">GSTIN/Unique ID</td>
            <td colSpan="3">$$GSTIN_NO</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">Name</td>
            <td></td>
            <td colSpan="3">Mahashian Di Hatti Pvt.Ltd</td>
            <td>Name</td>
            <td></td>
            <td colSpan="5" width="278">
              $$PARTY_NAME
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="3">Address</td>
            <td colSpan="3" rowspan="2" width="156">
              $$UNIT_ADDRESS
            </td>
            <td>Address</td>
            <td></td>
            <td colSpan="6" rowspan="2" width="356">
              $$PARTY_ADDRESS
            </td>
          </tr>
          <tr>
            <td width="44"></td>
            <td width="41"></td>
            <td width="34"></td>
            <td width="26"></td>
            <td width="79"></td>
            <td width="40"></td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">State</td>
            <td></td>
            <td colSpan="2">$$UNIT_STATE</td>
            <td></td>
            <td colSpan="2">Driver name</td>
            <td colSpan="3" width="169">
              (@Driver Name@)
            </td>
            <td>GR No</td>
            <td colSpan="2" width="47">
              (@GR NO@)
            </td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">Ph :</td>
            <td></td>
            <td colSpan="2">$$UNIT_CONTACTNO1</td>
            <td></td>
            <td colSpan="2">Truck no</td>
            <td colSpan="2">(@Truck No.@)</td>
            <td></td>
            <td colSpan="2">Gross Weight  :</td>
            <td width="78">$$TOTAL_GROSS_WEIGHT</td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="2">Email :</td>
            <td></td>
            <td colSpan="2">$$UNIT_EMAIL</td>
            <td></td>
            <td colSpan="2">Through</td>
            <td colSpan="5" width="278">
              (@Through@)
            </td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>&nbsp;</td>
            <td>Scheme Dis</td>
            <td>
              <br />
              (@Scheme@)
            </td>
            <td colSpan="2">Delivery Address</td>
            <td colSpan="6" rowspan="2" width="356">
              $$IFSHIPPING_ADDRESS
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>&nbsp;</td>
            <td>Trade Dis</td>
            <td>(@Trde Dis@)</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Cash Dis</td>
            <td>(@Cash Dis@)</td>
            <td rowspan="2" width="79">
              Taxable Value (Rs)
            </td>
            <td colSpan="2" width="106">
              CGST
            </td>
            <td colSpan="2" width="103">
              SGST
            </td>
            <td colSpan="2" width="109">
              IGST
            </td>
            <td rowspan="2">TOTAL (Rs)</td>
          </tr>
          <tr>
            <td width="30">Sr. No.</td>
            <td width="100">Description of Goods</td>
            <td width="44">HSN Code</td>
            <td width="41">QTY.</td>
            <td width="34">Unit</td>
            <td width="26">MRP</td>
            <td width="62">Rate per unit (Rs )</td>
            <td width="30">Total (Rs)</td>
            <td width="30">Discount(%)</td>
            <td width="40">Rate(%)</td>
            <td width="66">Amount (Rs)</td>
            <td width="38">Rate(%)</td>
            <td width="65">Amount (Rs)</td>
            <td width="40">Rate(%)</td>
            <td width="69">Amount (Rs)</td>
          </tr>
          <tr>
            <td width="30">1</td>
            <td width="83">2</td>
            <td width="44">3</td>
            <td width="41">4</td>
            <td width="34">5</td>
            <td width="26">6</td>
            <td width="62">7</td>
            <td width="30">8=4x7</td>
            <td width="30">9</td>
            <td width="79">10=(8-9)</td>
            <td width="40">11</td>
            <td width="66">12=10 x11</td>
            <td width="38">13</td>
            <td width="65">14=10x13</td>
            <td width="40">15</td>
            <td width="69">16=10x15</td>
            <td width="78">17=(10+12+14+16)</td>
          </tr>

          <tr>
            <td width="30">1</td>
            <td width="95">2</td>
            <td width="44">3</td>
            <td width="41">4</td>
            <td width="34">5</td>
            <td width="26">6</td>
            <td width="62">7</td>
            <td width="30">8=4x7</td>
            <td width="30">9</td>
            <td width="79">10=(8-9)</td>
            <td width="40">11</td>
            <td width="66">12=10 x11</td>
            <td width="38">13</td>
            <td width="65">14=10x13</td>
            <td width="40">15</td>
            <td width="69">16=10x15</td>
            <td width="78">17=(10+12+14+16)</td>
          </tr>
          <tr>
            <td colSpan="9">&nbsp;</td>
            <td width="79">$$GROSS_TOTAL</td>
            <td colSpan="5">&nbsp;</td>
            <td width="69">&nbsp;</td>
            <td width="78">&nbsp;</td>
          </tr>
          <tr>
            <td width="30">&nbsp;</td>
            <td width="83">&nbsp;</td>
            <td width="44">&nbsp;</td>
            <td width="41">&nbsp;</td>
            <td width="34">&nbsp;</td>
            <td width="26">&nbsp;</td>
            <td width="62">&nbsp;</td>
            <td width="47">&nbsp;</td>
            <td width="47">&nbsp;</td>
            <td width="79">&nbsp;</td>
            <td width="40">&nbsp;</td>
            <td width="66">&nbsp;</td>
            <td width="38">&nbsp;</td>
            <td colSpan="3" width="174">
              $$TAX_NAME
            </td>
            <td width="78">$$TAX_AMOUNT</td>
          </tr>
          <tr>
            <td width="30">&nbsp;</td>
            <td width="83">&nbsp;</td>
            <td width="44">&nbsp;</td>
            <td width="41">&nbsp;</td>
            <td width="34">&nbsp;</td>
            <td width="26">&nbsp;</td>
            <td width="62">&nbsp;</td>
            <td width="47">&nbsp;</td>
            <td width="47">&nbsp;</td>
            <td width="79">&nbsp;</td>
            <td width="40">&nbsp;</td>
            <td width="66">&nbsp;</td>
            <td width="38">&nbsp;</td>
            <td width="65">&nbsp;</td>
            <td width="40">&nbsp;</td>
            <td width="69">&nbsp;</td>
            <td width="78">&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Total</td>
            <td colSpan="3" width="101">
              $$TOTAL_BASE_QTY
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td colSpan="3">&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td width="30">&nbsp;</td>
            <td width="83">&nbsp;</td>
            <td width="44">&nbsp;</td>
            <td width="41"></td>
            <td width="34"></td>
            <td width="26"></td>
            <td width="62"></td>
            <td width="47"></td>
            <td width="47">&nbsp;</td>
            <td width="79">&nbsp;</td>
            <td width="40">&nbsp;</td>
            <td width="66"></td>
            <td width="38"></td>
            <td colSpan="3" width="174"></td>
            <td width="78">&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td colSpan="2">&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td colSpan="10"></td>
            <td colSpan="4">Total Invoice Value ( Rs. In Figures )</td>
            <td colSpan="2">$$TOTAL_AMOUNT</td>
          </tr>

          <tr>
            <td width="30">&nbsp;</td>
            <td width="83">Total Invoice Value( Rs In Words)</td>
            <td colSpan="10" width="486">
              $$TOTAL_AMOUNT_IN_WORDS
            </td>
            <td width="38">&nbsp;</td>
            <td width="65">&nbsp;</td>
            <td width="40">&nbsp;</td>
            <td width="69">&nbsp;</td>
            <td width="78">&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td colSpan="4">Amount of Tax Subject to Reverse Charge</td>
            <td colSpan="12">&nbsp;</td>
          </tr>
          <tr>
            <td></td>
            <td colSpan="18">DECLARATION</td>
          </tr>
          <tr>
            <td>1</td>
            <td
              colSpan="16"
              rowspan="5"
              width="859"
              style={{ fontSize: "10px" }}
            >
              WARRANTY :Under The Food Safety &amp; Standards(Licensing and
              Registration of Food Businesses)Regulations,2011, Regulation
              2.1.14(2)Form E, I/we hereby Certify that food/foods mentioned in
              this invoice is/are warranted to be of the nature and quality
              which it/these purports/purported to be.   
                                                                                                                                                                                                                                                                                                                                                                                                                                   
              <br /> CONDITIONS : (a) To  keep the goods  in dry and protected
              place (b) The  company will not be held responsible for the
              packets once opened  (c) The Company  will be in no way
              responsible  for any damaged  goods on sale  (d)  Damaged
              pilfered  packets  which are damaged  or  defected  is not the 
              responsibility  of Company  (e)  Goods once sold will not be taken
              back.
            </td>
          </tr>

          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>Prepared By</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colSpan="2">Authorized By</td>
            <td colSpan="5">&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>$$CREATED_BY</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colSpan="2">$$AUTHORISED_BY</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td colSpan="3">Electronic Reference Number</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Date</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td colSpan="3">Authorised Signatory</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td colSpan="12">
              REGD OFFICE :   9/44,KIRTI NAGAR NEW DELHI -110015.        PHONE
              :-  01141425106/7/8         Email :-  mdhcare@mdhspices.in
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Print;
