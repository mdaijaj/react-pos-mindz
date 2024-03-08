import db from "../../../datasync/dbs";
const getTaxesByItemObj = async (option) => {
  let hsnid = option.GSTClassification[0].HsnId;
  if (hsnid) {
    let taxObj = {};
    await db.hsnMaster
      .where("Id")
      .equals(hsnid)
      .toArray()
      .then(async (result) => {
        let cgst =
          result[0].IGST[0].CGST[0].CgstTaxRate !== undefined
            ? result[0].IGST[0].CGST[0].CgstTaxRate
            : 0;
        let Sgst =
          result[0].IGST[0].CGST[0].SgstTaxRate !== undefined
            ? result[0].IGST[0].CGST[0].SgstTaxRate
            : 0;
        let Igst =
          result[0].IGST[0].IgstTaxRate !== undefined
            ? result[0].IGST[0].IgstTaxRate
            : 0;
        // console.log(cgst, Sgst, Igst, "ooooooo");
        taxObj = { cgstRate: cgst, sgstRate: Sgst, igstRate: Igst };
      })
      .catch((err) => console.log(err));
    return taxObj;
  }
};
const getPercentCalc = (rate, amount) => {
  let amt = (rate * amount) / 100;
  return amt;
};
const fixedToLength = (data) => {
  return data ? parseFloat(data).toFixed(2) : data;
};
const getAndSetTaxOrAmount = (tableItems) => {
  let grosAmt = 0;
  let totDis = 0;
  let totigst = 0;
  let totcgst = 0;
  let totsgst = 0;
  let ttotAmt = 0;
  tableItems.map((n) => {
    grosAmt = parseFloat(grosAmt) + parseFloat(n.Amount);
    totDis = parseFloat(totDis) + parseFloat(n.DiscountAmount);
    totigst = parseFloat(totigst) + parseFloat(n.igstamount);
    totcgst = parseFloat(totcgst) + parseFloat(n.cgstamount);
    totsgst = parseFloat(totsgst) + parseFloat(n.sgstamount);
    ttotAmt = parseFloat(ttotAmt) + parseFloat(n.totalAmount);
    return n;
  });
  return {
    grossamount: fixedToLength(grosAmt),
    discountamount: fixedToLength(totDis),
    taxamount: fixedToLength(
      parseFloat(totigst) + parseFloat(totcgst) + parseFloat(totsgst)
    ),
    netamount: fixedToLength(
      parseFloat(ttotAmt) + fnRoundOff(fixedToLength(ttotAmt))
    ),
    roundOff: fnRoundOff(fixedToLength(ttotAmt)),
    totalAmount: fixedToLength(ttotAmt),
    igstAmount: fixedToLength(totigst),
    cgstAmount: fixedToLength(totcgst),
    sgstAmount: fixedToLength(totsgst),
  };
};
const fnRoundOff = (n) => {
  let a = (n + "").split(".");
  let l = a[1];
  if (l > 0) {
    let h = "1";
    for (let i = 0; i < l.toString().length; i++) {
      h = h + "0";
    }
    let digit = parseInt(h);
    let Rdigit = digit - l;
    if (Rdigit.toString().length < l.toString().length) {
      console.log(Rdigit.toString().length, "Rdigit.toString().length");
      console.log(l.toString().length, "l.toString().length");
      let length = l.toString().length - Rdigit.toString().length;
      let b = "";
      for (let j = 0; j < length; j++) {
        b = b + "0";
      }
      let finalDigit = b + Rdigit.toString();
      return parseFloat("0." + finalDigit);
    } else {
      return parseFloat("0." + Rdigit);
    }
  } else {
    return parseFloat("0.00");
  }
};
const formatDate = (date) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [day, monthNames[d.getMonth()], year].join("-");
};
export {
  getTaxesByItemObj,
  getPercentCalc,
  fnRoundOff,
  formatDate,
  getAndSetTaxOrAmount,
  fixedToLength,
};
