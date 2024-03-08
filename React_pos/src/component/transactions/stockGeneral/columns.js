import EditableCell from "./editableCell";
import SelectCell from "./selectCell";

const COLUMNS = [
  {
    Header: "Item Name",
    accessor: "ItemName",
    sticky: "left",
    Cell: SelectCell,
  },
  {
    Header: "Item Code",
    accessor: "ItemCode",
    Cell: SelectCell,
    sticky: "left",
  },
  {
    Header: "BASE Unit",
    accessor: "BASEUNIT",
    sticky: "left",
  },
  {
    Header: "ALT Unit",
    accessor: "ALTUNIT",
    sticky: "left",
  },
  {
    Header: "MRP",
    accessor: "MRP",
    sticky: "left",
    Cell: EditableCell,
  },
  {
    Header: "Quantity(+)",
    accessor: "quantityadd",
    Cell: EditableCell,
    sticky: "left",
  },
  {
    Header: "Quantity(-)",
    accessor: "quantityminus",
    Cell: EditableCell,
    sticky: "left",
  },
];

export default COLUMNS;
