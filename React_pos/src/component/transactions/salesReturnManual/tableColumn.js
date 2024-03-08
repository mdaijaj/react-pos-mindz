const column = [
    { header: "Item Name", field: "ItemName", width: 250, cell: "autocomplete" },
     { header: "Lot No", field: "unit" ,cell: "EditInput"},
    { header: "Qty", field: "Quantity", cell: "EditInput" },
    // { header: "Alt Qty", field: "altqty" },
    { header: "MRP", field: "Rate", cell: "EditInput" },
    { header: "Disc (%)", field: "DiscountPer", cell: "EditInput" },
    { header: "Discount Amount", field: "DiscountAmount" },
    { header: "Gross Amount", field: "Amount" },
    // { header: "Final Discount", field: "finalDiscount" },
    { header: "Sales Price", field: "totalAmount" },
    { header: "IGST Tax (%)", field: "igstrate" },
    { header: "IGST Amount", field: "igstamount" },
    { header: "CGST Tax (%)", field: "cgstrate" },
    { header: "CGST Amount", field: "cgstamount" },
    { header: "SGST Tax (%)", field: "sgstrate" },
    { header: "SGST Amount", field: "sgstamount" },
  ];
  export default column;
  