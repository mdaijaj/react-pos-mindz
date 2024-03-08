import DateCell from "./DateCell";
import GstEditabelCell from "./gstEditabelCell";

const GSTCOLUMN = [
  {
    header: "Applicable From",
    field: "ApplicableOn",
    //  Cell: DateCell,
  },
  {
    header: "Rate",
    field: "IgstTaxRate",
    cell: "EditInput",
  },
];

export default GSTCOLUMN;
