import React from "react";
import Modal from "@material-ui/core/Modal";
import DataGrids from "./dataGrid";
export default function SimpleModal({
  table,
  fnBindTable,
  setSelection,
  rows,
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //   const grid = (

  //   );

  const data = { fnBindTable, setSelection, rows, handleClose };
  return (
    <div>
      <button type="button" className="btnGreen" onClick={handleOpen}>
        Item List
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <DataGrids {...data} />
      </Modal>
    </div>
  );
}
