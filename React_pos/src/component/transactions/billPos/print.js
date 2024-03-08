import "./print.scss";
import LogoImg from "../../../images/logo.png";
// import Table from "./table";
import React, { useMemo } from "react";
const BillPosPrint = ({
  product,
  footerState,
  billSeries,
  customerData,
  billDate,
}) => {
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  }

  function numberWithCommas(x) {
    return x > 0 ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
  }
  const fnRSInWord = (price) => {
    let value = "";
    if (price > 0) {
      let splittedNum = price.toString().split(".");
      let nonDecimal = splittedNum[0];
      let decimal = splittedNum[1];
      value =
        price_in_words(Number(nonDecimal)) +
        "and " +
        price_in_words(Number(decimal)) +
        " paise";
    }
    return value;
  };
  function price_in_words(price) {
    var sglDigit = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ],
      dblDigit = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ],
      tensPlace = [
        "",
        "Ten",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ],
      handle_tens = function (dgt, prevDgt) {
        return 0 == dgt
          ? ""
          : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
      },
      handle_utlc = function (dgt, nxtDgt, denom) {
        return (
          (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
          (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        );
      };

    var str = "",
      digitIdx = 0,
      digit = 0,
      nxtDigit = 0,
      words = [];
    if (((price += ""), isNaN(parseInt(price)))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
      for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
        switch (
          ((digit = price[digitIdx] - 0),
          (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
          price.length - digitIdx - 1)
        ) {
          case 0:
            words.push(handle_utlc(digit, nxtDigit, ""));
            break;
          case 1:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 2:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                      ? " and"
                      : "")
                : ""
            );
            break;
          case 3:
            words.push(handle_utlc(digit, nxtDigit, "Thousand"));
            break;
          case 4:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 5:
            words.push(handle_utlc(digit, nxtDigit, "Lakh"));
            break;
          case 6:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 7:
            words.push(handle_utlc(digit, nxtDigit, "Crore"));
            break;
          case 8:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 9:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                      ? " and"
                      : " Crore")
                : ""
            );
        }
      str = words.reverse().join("");
    } else str = 0;
    return str;
  }

  const COLUMNS = [
    {
      Header: "Description of Goods",
      accessor: "ItemName",
      disableFilters: false,
      sticky: "left",
    },
    {
      Header: "Qty",
      accessor: "quantity",
      sticky: "right",
    },
    {
      Header: "MRP",
      accessor: "mrp",
      right: true,
    },
    {
      Header: "Discount",
      accessor: "manualdiscountamount",
      sticky: "right",
    },
    {
      Header: "Sale Price",
      accessor: "Rate",
      sticky: "right",
    },
    {
      Header: "Amount",
      accessor: "amount",
      sticky: "right",
      right: true,
      Cell: (row) => (
        <div style={{ textAlign: "right" }}>{numberWithCommas(row.value)}</div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  return (
    <div>
      <div className="tablePro">
        <div>
          <table
            // border="1"
            style={{ fontSize: "14px" }}
          >
            {/*    <tr>
              <td colSpan="16">&nbsp;</td> <td colSpan="1">$$COPY_NAME</td>
            </tr> */}
            <tr>
              <td colSpan="18">&nbsp;</td>
            </tr>
            <tr>
              <td width="30" rowspan="13">
                &nbsp;
              </td>
              <td rowspan="13" width="250">
                <img src={LogoImg} alt="" />
              </td>
              <td width="44"></td>
              <td colSpan="3" width="101">
                Invoice No:
              </td>
              <td colSpan="2" width="109">
                {billSeries}
              </td>
              <td width="30"></td>
              <td colSpan="2" width="119">
                Date of Invoice
              </td>
              <td colSpan="2" width="104">
                {convert(billDate)}
              </td>
              <td width="65"></td>
              <td width="40"></td>
              <td colSpan="2" rowspan="4" width="47"></td>
            </tr>
            <tr>
              <td></td>
              <td>IRN</td>
              <td colSpan="9"></td>
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
              <td colSpan="3"></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan="3" width="101">
                GSTIN/Unique ID
              </td>
              <td colSpan="3"></td>
              <td colSpan="2">GSTIN/Unique ID</td>
              <td colSpan="3"> {customerData && customerData.GSTNo}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan="2">Name</td>
              <td></td>
              <td colSpan="3"></td>
              <td>Name</td>
              <td></td>
              <td colSpan="5" width="278">
                {customerData && customerData.PartyName}
              </td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan="3">Address</td>
              <td colSpan="3" rowspan="2" width="156">
                {/* $$UNIT_ADDRESS */}
              </td>
              <td>Address</td>
              <td></td>
              <td colSpan="6" rowspan="2" width="356">
                {customerData && customerData.Address}
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
              <td colSpan="2"></td>
              <td></td>
              <td colSpan="2">Driver name</td>
              <td colSpan="3" width="169"></td>
              <td>GR No</td>
              <td colSpan="2" width="47"></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan="2">Ph :</td>
              <td></td>
              <td colSpan="2"></td>
              <td></td>
              <td colSpan="2">Truck no</td>
              <td colSpan="2"></td>
              <td></td>
              <td colSpan="2">Gross Weight  :</td>
              <td width="78"></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan="2">Email :</td>
              <td></td>
              <td colSpan="2"></td>
              <td></td>
              <td colSpan="2">Through</td>
              <td colSpan="5" width="278"></td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>&nbsp;</td>
              <td>Scheme Dis</td>
              <td></td>
              <td colSpan="2">Delivery Address</td>
              <td colSpan="6" rowspan="2" width="356"></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>&nbsp;</td>
              <td>Trade Dis</td>
              <td></td>
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
              <td></td>
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

            {product.map((item, index) => {
              return (
                <tr key={index}>
                  <td width="30">{item.invoiceId}</td>
                  <td width="83">{item.ItemName}</td>
                  <td width="44">3</td>
                  <td width="41">{item.quantity}</td>
                  <td width="34">1</td>
                  <td width="26">{item.mrp}</td>
                  <td width="62">{item.Rate}</td>
                  <td width="30">{item.amount}</td>
                  <td width="30">{item.manualdiscountper}</td>
                  <td width="79">
                    {numberWithCommas(footerState.grossAmount)}
                  </td>
                  <td width="40">{item.cgstRate}</td>
                  <td width="66">{item.cgst}</td>
                  <td width="38">{item.sgstRate}</td>
                  <td width="65">{item.sgst}</td>
                  <td width="40">{item.igstRate}</td>
                  <td width="69">{item.igst}</td>
                  <td width="78">
                    {numberWithCommas(footerState.finalAmount)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="9">&nbsp;</td>
              <td width="79">{numberWithCommas(footerState.grossAmount)}</td>
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
              <td colSpan="3" width="174"></td>
              <td width="78">{numberWithCommas(footerState.totalTax)}</td>
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
              <td colSpan="3" width="101"></td>
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
              <td colSpan="2">{numberWithCommas(footerState.finalAmount)}</td>
            </tr>
            <tr>
              <td width="30">&nbsp;</td>
              <td width="83">Total Invoice Value( Rs In Words)</td>
              <td colSpan="10" width="486">
                {fnRSInWord(footerState.finalAmount)}
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
                2.1.14(2)Form E, I/we hereby Certify that food/foods mentioned
                in this invoice is/are warranted to be of the nature and quality
                which it/these purports/purported to be.
                <br /> CONDITIONS : (a) To  keep the goods  in dry and protected
                place (b) The  company will not be held responsible for the
                packets once opened  (c) The Company  will be in no way
                responsible  for any damaged  goods on sale  (d)  Damaged
                pilfered  packets  which are damaged  or  defected  is not the 
                responsibility  of Company  (e)  Goods once sold will not be
                taken back.
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
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan="2"></td>
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
      {/*   <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <h2 style={{ width: "100%", textAlign: "center" }}>
                TAX INVOICE
              </h2>
            </td>
          </tr>
          <tr>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: "left", verticalAlign: "top" }}>
                    <img src={LogoImg} alt="" />
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top" }}>
                    Ravindra Singh <br />
                    <div style={{ fontSize: "14px", lineHeight: "18px" }}>
                      SHOP NO D1-D2,JANPATH COMPLEX
                      <br />
                      BINDAL BRIDGE, CHAKRATA ROAD
                      <br /> UTTRAKHAND-248001 <br />
                      MOB: 9205688016
                      <br /> GST:05AAFCV0769H1Z8
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </tr>
        </tbody>
      </table>
      <div>TAX INVOICE</div>

      <div className="row">
        <div className="col">
          <div className="logo">
            <img src={LogoImg} alt="" />
          </div>
        </div>
        <div className="col">
          Ravindra Singh <br /> SHOP NO D1-D2,JANPATH COMPLEX <br /> BINDAL
          BRIDGE, CHAKRATA ROAD
          <br /> UTTRAKHAND-248001 <br />
          MOB: 9205688016
          <br /> GST:05AAFCV0769H1Z8
        </div>
      </div>
      <div className="row">
        <div className="col">
          Invoice No. {billSeries}
          <br />
          Name AMMU
          <br />
          Mob:9632140929
          <br />
          Email
          <br />
          GST No:
          <br />
        </div>
        <div className="col">
          Dated 05-Oct-2019
          <br />
          City:
          <br />
          State Code <br />
          State:
          <br />
          Country:
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col w100">
          <Table columns={columns} data={product} />
        </div>
      </div>
      <div className="col w55">
        <div className="curInvoiceDetail">
          <div className="title">Current Invoice</div>
          <div className="invoiceDetail">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div>
                      Payment Mode:Other
                      <br />
                      Amount in Words:
                      <br />
                      {fnRSInWord(footerState.finalAmount)}
                    </div>
                  </td>
                  <td></td>
                  <td>Total Amount </td>
                  <td>{numberWithCommas(footerState.grossAmount)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Discount Value</td>
                  <td>{numberWithCommas(footerState.totalDiscount)}</td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td>SGST Amount</td>
                  <td>{numberWithCommas(footerState.sgstAmount)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>CGST Amount</td>
                  <td>{numberWithCommas(footerState.cgstAmount)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Grand Total</td>
                  <td>{numberWithCommas(footerState.finalAmount)}</td>
                </tr>
              </tbody>
            </table> */}
    </div>
  );
};

export default BillPosPrint;
