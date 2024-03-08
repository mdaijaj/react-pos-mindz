const column = [
  // { header: "Item Image", field: "ItemImage", width: 250 },
  { header: "Group Name", field: "GroupName", width: 150, 
    // accessor: d => d.GroupName,
    // filterMethod: (filter, row) =>
    // row[filter.id].startsWith(filter.value) &&
    // row[filter.id].endsWith(filter.value)
  },
  { header: "Item Name", field: "ItemName", width: 250,
    // accessor: d => d.ItemName,
    // filterMethod: (filter, data) =>
    // row[filter.id].startsWith(filter.value) &&
    // row[filter.id].endsWith(filter.value)
  },
  { header: "Item Code", field: "ItemCode", width: 150 },
  { header: "Unit", field: "unit", cell: "EditInput" },
  { header: "Stock", field: "Stock", cell: "EditInput" },
  // { header: "Stock Alt Qty", field: "StockAltQty", cell: "EditInput" },
  // { header: "Max Stock", field: "MaxStock" },
];
export default column;
