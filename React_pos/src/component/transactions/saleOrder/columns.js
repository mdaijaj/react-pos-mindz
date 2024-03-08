import EditableCell from "./editableCell";

const COLUMNS = [
  {
    Header: "Item Name",
    accessor: "ItemName",
    disableFilters: false,
    sticky: "left",
  },
  {
    Header: "Item Code",
    accessor: "ItemCode",
    sticky: "left",
  },
  {
    Header: "Remarks",
    accessor: "Remark",
    sticky: "left",
    Cell: EditableCell,
  },
  {
    Header: "Unit",
    accessor: "UnitName",
    sticky: "left",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
    Cell: EditableCell,
    sticky: "left",
  },
  {
    Header: "Rate",
    accessor: "Rate",
    sticky: "left",
    Cell: EditableCell,
  },
  {
    Header: "Disc(%)",
    accessor: "Discount",
    Cell: EditableCell,
    sticky: "left",
  },
  {
    Header: "Gross Total",
    accessor: "grossTotal",
    sticky: "left",
  },
  {
    Header: "Discount Amount",
    accessor: "DiscountAmount",
    sticky: "left",
  },
  {
    Header: "Net Total",
    accessor: "NetTotal",
    sticky: "left",
  },
];

export default COLUMNS;
