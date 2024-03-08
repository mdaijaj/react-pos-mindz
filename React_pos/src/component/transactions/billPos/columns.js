import EditableCell from "./editableCell";
import SelectCell from "./selectCell";
import BindDropDownTableCell from "./bindDropDownTableCell";

const COLUMNS = [
  {
    Header: "Product Name",
    accessor: "ItemName",
    // Cell: BindDropDownTableCell,
    disableFilters: false,
    sticky: "left",
  },
  {
    Header: "Product Code",
    accessor: "ItemCode",
    sticky: "left",
  },
  {
    Header: "Unit",
    accessor: "UnitName",
    cell: "EditInput"
  },
  {
    Header: "Godown",
    accessor: "storeid",
    sticky: "left",
    Cell: SelectCell,
  },
  {
    Header: "Stock",
    accessor: "stock",
    sticky: "left",
  },
  {
    Header: "Qty",
    accessor: "quantity",
    Cell: EditableCell,
    sticky: "right",
  },
  {
    Header: "MRP",
    accessor: "mrp",
    //sticky: "right",
    right: true,
  },
  {
    Header: "Sale Price",
    accessor: "Rate",
    Cell: EditableCell,
    sticky: "right",
  },
  {
    Header: "Gross Amount",
    accessor: "grossamount",
    sticky: "right",
  },
  {
    Header: "Auto Discount (%)",
    accessor: "autodiscountper",
    sticky: "right",
  },
  {
    Header: "Auto Discount Amount",
    accessor: "autodiscountamount",
    sticky: "right",
  },
  {
    Header: "Manual Discount (%)",
    accessor: "manualdiscountper",
    Cell: EditableCell,
    sticky: "right",
  },
  {
    Header: "Manual Discount Amount",
    accessor: "manualdiscountamount",
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
  {
    Header: "Item Remark",
    accessor: "remark",
    Cell: EditableCell,
  },
  {
    Header: "IGST Rate %",
    accessor: "igstRate",
    Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
  },
  {
    Header: "IGST Amount",
    accessor: "igst",
    Cell: (row) => (
      <div style={{ textAlign: "right" }}>{numberWithCommas(row.value)}</div>
    ),
  },
  {
    Header: "CGST Rate %",
    accessor: "cgstRate",
    Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
  },
  {
    Header: "CGST Amount",
    accessor: "cgst",
    Cell: (row) => (
      <div style={{ textAlign: "right" }}>{numberWithCommas(row.value)}</div>
    ),
  },
  {
    Header: "SGST Rate %",
    accessor: "sgstRate",
    Cell: (row) => (
      <div style={{ textAlign: "right" }}>{numberWithCommas(row.value)}</div>
    ),
  },
  {
    Header: "SGST Amount",
    accessor: "sgst",
    Cell: (row) => (
      <div style={{ textAlign: "right" }}>{numberWithCommas(row.value)}</div>
    ),
  },
  {
    Header: "Scheme Code",
    accessor: "schemeCode",
  },
];

function numberWithCommas(x) {
  return x > 0 ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
}
export default COLUMNS;
