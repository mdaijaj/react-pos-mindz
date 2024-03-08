import { useTable, useRowSelect } from "react-table";
import React from "react";
function Table({
  columns,
  data,
  selectedProduct,
  updateMyData,
  updateRow,
  updateGstRow,
  updateGstData,
  updateGstDate,
}) {
  //Use the state and functions returned from useTable to build your UI
  // const columnss = columns && React.useMemo(() => columns, []);
  //c//onst dataa = React.useMemo(() => data, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      selectedProduct,
      updateMyData,
      updateRow,
      updateGstRow,
      updateGstData,
      updateGstDate,
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
                <tr {...row.getRowProps()}>
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
