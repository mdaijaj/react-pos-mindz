import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  randomCreatedDate,
  randomUpdatedDate,
} from "@material-ui/x-grid-data-generator";
import EditableCell from "./editableCell";

const DataGrids = ({ setSelection, rows, fnBindTable, handleClose }) => {
 
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  return (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title" style={{ textAlign: "center" }}>
        ITEMS LIST
      </h2>
      {console.log("datagrid bbbbbbb ", rows)}
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          columns={[
            { field: "ItemCode", type: "string" },
            { field: "ItemName", type: "string" },
          ]}
          rows={rows}
          checkboxSelection={true}
          onSelectionModelChange ={(row) => {
            console.log('ITEMSvvk LIST ITEMS LIST',row)
            setSelection(row);
          }}
          selectedRows={["1,2,3"]}
        />
      </div>
      <div style={{ float: "right" }}>
        <button
          className="btn2"
          style={{
            backgroundColor: "rgb(45 155 255)",
            padding: "30",
            color: "#fff",
            border: "0",
            width: "80px",
            height: "30px",
            marginTop: "10px",
            marginRight: "20px",
          }}
          onClick={() => {
            fnBindTable();
            handleClose();
          }}
        >
          Ok
        </button>
        <button
          className="btn2"
          style={{
            backgroundColor: "rgb(45 155 255)",
            padding: "30",
            color: "#fff",
            border: "0",
            width: "80px",
            height: "30px",
            marginTop: "10px",
          }}
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default DataGrids;
