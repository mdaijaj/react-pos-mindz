const column = [
  { header: "Item Name", field: "itemname" },
  { header: "Item Code", field: "itemcode" },
  { header: "Bill Base Qty", field: "billedbaseqty" },
  { header: "Bill Alt. Qty", field: "billedaltqty" },
  { header: "Rec. Base Qty", field: "receivedbaseqty", cell: "EditInput" },
  { header: "Rec. Alt Qty", field: "receivedaltqty" },
  { header: "Unit", field: "unit" },
  { header: "Short Qty", field: "shortqty" },
  { header: "Excess Qty", field: "excessqty", cell: "EditInput" },
  { header: "Rate", field: "rate", cell: "EditInput" },
  { header: "MRP", field: "mrp" },
  { header: "Gross Amount", field: "gross_amount" },
  { header: "Discount(%)", field: "discount_per", cell: "EditInput" },
  { header: "Net Amount", field: "netamount" },
];
export default column;
