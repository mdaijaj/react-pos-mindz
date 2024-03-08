const column = [
  { header: "Item Name", field: "ItemName" },
  { header: "Item Code", field: "ItemCode" },
  { header: "Unit", field: "unit" },
  { header: "Stock Base Qty", field: "StockBaseQty" },
  { header: "Stock Alt. Qty", field: "StockAltQty" },
  { header: "Required Qty", field: "RequiredQty", cell: "EditInput" },
  { header: "Required Alt. Qty", field: "RequiredAltQty" },
  { header: "Remark", field: "Remark", cell: "EditInput" },
  {
    header: "Priority",
    field: "Priority",
    cell: "select",
    slOption: [
      { value: "Most Urgent", label: "Most Urgent" },
      { value: "Urgent", label: "Urgent" },
      { value: "General", label: "General" },
    ],
  },
];
export default column;
