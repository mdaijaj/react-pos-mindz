// 
  //   header: "Godown Name",
  //   field: "godown",
  //   cell: "select" ,
  //   slOption: [
      
  //   ],
  // 
const column = [
  { header: "Item Name", field: "ItemName", width: 250, cell: "autocomplete" 
  },
  { header: "Unit", field: "unit" },
  { header: "Invoice Qty", field: "Quantity", cell: "EditInput" },
  { header: "Invoice Alt Qty", field: "altqty" },
  
  { header: "Rate", field: "Rate", cell: "EditInput" },
  { header: "Disc (%)", field: "DiscountPer", cell: "EditInput" },
  { header: "Discount Amount", field: "DiscountAmount" },
  { header: "Gross Amount", field: "Amount" },
  { header: "Final Discount", field: "finalDiscount" },
  { header: "Total Amount", field: "totalAmount" },
  { header: "IGST Tax (%)", field: "igstrate" },
  { header: "IGST Amount", field: "igstamount" },
  { header: "CGST Tax (%)", field: "cgstrate" },
  { header: "CGST Amount", field: "cgstamount" },
  { header: "SGST Tax (%)", field: "sgstrate" },
  { header: "SGST Amount", field: "sgstamount" },
];
export default column;
