const column = [
  { header: "Item Name", field: "ItemName", width: 250, cell: "autocomplete" },
  { header: "Item Code", field: "ItemCode", width: 250, cell: "autocomplete" },
  { header: "Base Unit", field: "baseUnit" },
  { header: "Alt Unit", field: "altUnit" },
  { header: "MRP", field: "MRP", cell: "EditInput" },
  {
    header: "Quantity (+)",
    field: "QuantityIn",
    cell: "EditInput",
    width: 100,
  },
  {
    header: "Quantity (-)",
    field: "QuantityOut",
    cell: "EditInput",
    width: 100,
  },
];
export default column;
