import { useTable, useRowSelect } from "react-table";
import React from "react";


function Table({
  columns,
  data,
  updateMyData,
  itemList,
  selectedProduct,
  selectedRowId,
  getTrProps,
  
  editCoulmn,      //s
  boughtBatchSerials   //  removalble P Start
}) {

   console.log(editCoulmn,"edit Column")
  //  console.log(data,'data')
   console.log(updateMyData,'updateMyData edit')
  //  console.log(itemList,'itemList')
  //  console.log(selectedProduct,'selectedProduct')
  //  console.log(selectedRowId,'selectedRowId')
  //  console.log(getTrProps,'getTrProps')
   


  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedRow,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      updateMyData,
      itemList,
      selectedProduct,
      selectedRowId,

      boughtBatchSerials   // removalble P Start
    },
    useRowSelect
  );
  const activeFormAction = {
    view: true,
    edit: true,
    add: true,
    refresh: false,
    save: false,
  };

  // Render the UI for your table
  return (
    <>
      <div style={{ width: "100%", overflowX: "scroll" }}>
        <table {...getTableProps()} className="tableView">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  key={i}
                  className={
                    selectedRowId && selectedRowId === row.id ? "selected" : ""
                  }
                  onClick={(e) => getTrProps(row)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
