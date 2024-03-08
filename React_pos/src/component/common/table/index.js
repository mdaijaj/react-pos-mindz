import "./index.scss";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { ReactComponent as Refresh } from "../../../images/icon/restart-line.svg";
import Text from "../text";
const Autocomplete = ({ name, optionList, optionGet, value }) => {
  const [val, setVal] = useState(value);
  const [optionsListIn, setOptionsListIn] = useState([]);
  const [elposition, setElposition] = useState();
  const [open, setOpen] = useState(false);
  const [selectVal, setSelectVal] = useState();
  const [inputName, setInputName] = useState("");
  const inputRef = useRef();

  const onchangeInput = (e) => {
    setVal(e.target.value);
    const filteredOptions = optionList?.filter((option) =>
      // option[e.target.name].toLowerCase().startsWith(e.target.value)
      option[e.target.name].startsWith(e.target.value)                  //s
    );
    setOptionsListIn(filteredOptions);
  };

  const getOption = async (option) => {
    let x = await optionGet(option);
    if (x !== false) {
      setVal(option[name]);
    }
    // console.log(option,"tbloption")
  };

  const focusinput = (e) => {
    setInputName("");
    setOpen(false);
    setSelectVal("");
    const position = inputRef.current.getBoundingClientRect();
    var elem = document.getElementById("options");
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
    let div = document.createElement("div");
    div.id = "options";
    document.body.appendChild(div);
    let wp = window.innerHeight;
    let eltop = position.top;
    let getP = eltop + 200 > wp ? true : false;
    let x =
      getP === false
        ? eltop + position.height + window.pageYOffset + 5
        : eltop - 200 + window.pageYOffset - 5;

    let elpos = {
      position: "absolute",
      left: position.left + "px",
      top: x + "px",
      width: position.width > 200 ? position.width : 200 + "px",
    };
    setElposition(elpos);
    renderEl(elpos);
    setInputName(name);
  };

  const blurinput = () => {
    const timer = setTimeout(() => {
      setOpen(false);
      setInputName();
      if (selectVal) {
        setVal(selectVal);
      }
    }, 500);
    return () => clearTimeout(timer);
  };

  const oplist = useCallback(() => {
    const list = optionList && optionList.slice(0, 200);
    setOptionsListIn(list);
  }, [optionList]);
  useEffect(() => {
    oplist();
  }, [oplist]);
  const renderEl = useCallback(
    (elpos) => {
      ReactDOM.render(
        open && inputName === name ? (
          <div className="optionList" style={elpos}>
            <ul>
              {optionsListIn && optionsListIn.length > 0 ? (
                optionsListIn.map((option, index) => (
                  <li key={index} onClick={() => getOption(option)}>
                    {option[name]}
                  </li>
                ))
              ) : (
                <li>No Item</li>
              )}
            </ul>
          </div>
        ) : (
          ""
        ),
        document.getElementById("options")
      );
    },
    [name, optionsListIn, open, inputName]
  );
  
  useEffect(() => {
    if (elposition) {
      renderEl(elposition);
    }
    const getKey = (e) => {
      // if (e.ctrlKey && (e.key === "l" || e.key === "L")) {                       //s
        // e.preventDefault();                                                      //s
        setOpen(true);
      // }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };


  }, [renderEl, optionsListIn, open, elposition, inputName]);

  useEffect(() => {
    setVal(value);
  }, [value]);
  return (
    <>
      <input
        type="text"
        name={name}
        value={val}
        onFocus={(e) => focusinput(e)}
        ref={inputRef}
        // placeholder="Press Ctrl + L"
        autoComplete="off"
        onBlur={() => blurinput()}
        onChange={(e) => onchangeInput(e)}
      />
    </>
  );
};
const SelectInput = ({ name, value, onchange, slOption }) => {
  const [inputVal, setInputVal] = useState(value);
  const changeInput = (e) => {
    const v = onchange(e);
    setInputVal(v);
  };
  useEffect(() => { }, [onchange]);
  return (
    <>
      <select name={name} value={inputVal} onChange={(e) => changeInput(e)}>
        <option value="">Select</option>
        {slOption &&
          slOption.map((sl, index) => (
            <option key={index} value={sl.value}>
              {sl.label}
            </option>
          ))}
      </select>
    </>
  );
};
const Input = ({ name, value, onchange }) => {
  const [inputVal, setInputVal] = useState(value);
  const changeInput = (e) => {
    const v = onchange(e);
    setInputVal(v);
    // if (v) {
    //   setInputVal(v);
    // }
  };
  useEffect(() => { }, [onchange]);
  return (
    <>
      <input name={name} value={inputVal} onChange={(e) => changeInput(e)} />
    </>
  );
};

///DATE Input
const SelectDate = ({ name, value, onchange }) => {
  const [dateVal, setDateVal] = useState(value);
  const changeInput = (e) => {
    const v = onchange(e);
    setDateVal(e.target.value);
    // console.log(v, "v");
  };

  useEffect(() => {
    setDateVal(value);
  }, [onchange, dateVal]);
  return (
    <>
      <input
        value={dateVal}
        name={name}
        type="date"
        onChange={(e) => changeInput(e)}
      />
    </>
  );
};

const CheckBoxInput = ({ id, value, onchange }) => {
  const [val, setVal] = useState(value);
  const onchangeCheck = (e) => {
    setVal(e.target.value);
    onchange(e);
  };

  useEffect(() => { }, [val, value]);
  return (
    <>
      <input
        type="checkbox"
        onChange={(e) => onchangeCheck(e)}
        checked={id === value ? true : false}
        id={id}
      />
    </>
  );
};
const CheckBox = ({ name, value, onchange }) => {
  const [val, setVal] = useState(value);
  const onchangeCheck = (e) => {
    setVal(e.target.checked);
    // console.log(e.target.checked);
    onchange(e);
  };

  useEffect(() => { }, [val]);
  return (
    <>
      <input
        type="checkbox"
        className="checkbox"
        onChange={(e) => onchangeCheck(e)}
        checked={val}
        name={name}
      />
    </>
  );
};
const CheckBoxStatic = ({ name, value }) => {
  useEffect(() => { }, [value]);
  return (
    <>
      <input type="checkbox" className="checkbox" checked={value} name={name} />
    </>
  );
};
const CustomTable = ({
  overFlowScroll,
  coulmn,
  data,
  checkbox,
  selectedRows,
  selectedTr,
  getCheckedItem,
  tblInputOnchange,
  editColumn,
  Footer,
  deleteRow,
  editfunction,
  editStatus,
  optionList,
  getAutocompleteOption,
  itemAdd,
  refreshTable,
  editbtnText,
  tableDate,
  oncheck,
  Viewbtnclick,
  filter,
  defaultFilterMethod
}) => {
  const [cellWidth, setCellWidth] = useState([]);
  const [tblwidth, settblwidth] = useState(
    !checkbox ? 150 * coulmn.length : 150 * coulmn.length + 50
  );
  const [startCount, setStartCount] = useState(0);
  const [endCount, setEndCount] = useState(100);
  const [dataArray, setDataArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    !selectedRows ? [] : selectedRows
  );
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowIndex, setSelectedRowIndex] = useState();
  const [tbodyMargin, setTbodyMargin] = useState();
  const [edit, setEdit] = useState();
  const [thArray, setTharray] = useState();
  const [tdArray, setTdarray] = useState();
  const [filterIndex, setFilterIndex] = useState(0);
  const [filterval, setFilterval] = useState();
  const tbodyRef = useRef(null);
  const theadRef = useRef(null);
  const prentWidth = useRef(null);

  const tblList = (s, e) => {
    if (data && data.length > 99) {
      const list = data.slice(s, e);
      setDataArray(list);
    } else {
      setDataArray(data);
    }
    // const list = data && data.slice(s, e);
    // if (list.length > 0) {
    //   setDataArray([...dataArray, ...list]);
    // } else {
    //   setDataArray(data);
    // }
  };
  const tblList2 = (s, e) => {
    const list = data && data.slice(s, e);
    if (list.length > 0) {
      setDataArray([...dataArray, ...list]);
    }
  };
  const getSelectTr = (value, i) => {
    if (selectedRowIndex !== i) {
      setSelectedRowIndex(i);
      setSelectedRow(value);
      selectedTr(value);
      setEdit(false);
    }
  };
  const remove = () => {
    deleteRow();
    setSelectedRowIndex();
    setSelectedRow();
    selectedTr();
    setEdit(false);
  };
  const onchangeCheck = (e) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, parseInt(e.target.id)]);
      const itemchecked =
        dataArray &&
        dataArray.find((item) => item.ItemId === parseInt(e.target.id));
      setCheckedItems((prevArray) => [...prevArray, itemchecked]);
    } else {
      const selected = selectedIds.filter((a) => a !== parseInt(e.target.id));
      setSelectedIds(selected);

      const itemunchecked =
        checkedItems &&
        checkedItems.filter((item) => item.ItemId !== parseInt(e.target.id));
      setCheckedItems(itemunchecked);
    }
  };
  const next = (e) => {
    let element = e.target;
    if (element.scrollTop > element.scrollHeight / 1.2) {
      const timer = setTimeout(() => {
        let x = endCount + 1;
        let y = endCount + 100;
        tblList2(x, y);
        setStartCount(x);
        setEndCount(y);
      }, 100);
      return () => clearTimeout(timer);
    }
  };
  const prev = () => {
    let x = startCount - 100;
    let y = endCount - 100;
    if (x === 1) {
      tblList(0, y);
      setStartCount(0);
      setEndCount(y);
    } else {
      tblList(x, y);
      setStartCount(x);
      setEndCount(y);
    }
  };
  const sendselect = (items) => {
    getCheckedItem(items);
  };

  const getselected = useCallback(() => {
    const x = selectedIds.map((item) => {
      const list = data.filter((a) => a.id === item);
      return list[0];
    });
    setCheckedItems(x);
  }, [selectedIds, data]);

  useEffect(() => {
    getselected();
  }, [getselected]);

  useEffect(() => {
    setEdit(editStatus);
  }, [editStatus, edit]);

  const getMargintbl = (th) => {
    setTimeout(() => {
      const thHeight = [];
      for (let thead of th) {
        thHeight.push(thead.getBoundingClientRect().height);
      }
      // for (let i = 0; i < th.length; i += 1) {
      //   thHeight.push(th[i].getBoundingClientRect().height);
      // }
      //console.log(thHeight[0],"dddddddddddd")
      setTbodyMargin(thHeight[0]);
    }, 100)

  };
  const getCellWidth = useCallback(
    (tr) => {
      if (tr !== tdArray) {
        const headerWidths = [];
        const prWidth = prentWidth.current.getBoundingClientRect().width;
        let totalWidth = 0;
        for (let i = 0; i < tr.length; i += 1) {
          let m = 0;
          if (checkbox) {
            if (i === 0) {
              let x =
                tr[i].getBoundingClientRect().width < 120
                  ? 120
                  : tr[i].getBoundingClientRect().width > 250
                    ? 250
                    : tr[i].getBoundingClientRect().width;
              m = x;
            } else {
              let y =
                coulmn[i - 1].width !== undefined
                  ? coulmn[i - 1].width
                  : tr[i].getBoundingClientRect().width < 120
                    ? 120
                    : tr[i].getBoundingClientRect().width > 250
                      ? 250
                      : tr[i].getBoundingClientRect().width;
              // console.log(coulmn[i - 1].width, "coulmn[i].field");
              // console.log(y, "coulmn[i].field y");
              m = y;
            }
          } else {
            let x =
              coulmn[i].width !== undefined
                ? coulmn[i].width
                : tr[i].getBoundingClientRect().width < 120
                  ? 120
                  : tr[i].getBoundingClientRect().width > 250
                    ? 250
                    : tr[i].getBoundingClientRect().width;
            m = x;
          }

          headerWidths.push(m);
          totalWidth = totalWidth + m;

          // console.log(prWidth, "prWidth");
          // Get the rendered width of the element.
        }
        if (totalWidth < prWidth) {
          settblwidth(prWidth);
        } else {
          settblwidth(totalWidth);
        }

        setCellWidth(headerWidths);
      }
    },
    [tdArray]
  );
  useEffect(() => {
    if (overFlowScroll) {
      const th = theadRef.current.children[0].children;
      const tr = tbodyRef.current.children[0].children;
      if (th !== undefined) {
        setTharray(th);
        getMargintbl(th);
      }
      if (tr !== undefined) {
        setTdarray(tr);
        getCellWidth(tr);
      }
    }
  }, [dataArray]);
  useEffect(() => {
    tblList(startCount, endCount);
    if (overFlowScroll) {
      const th = theadRef.current.children[0].children;
      const tr = tbodyRef.current.children[0].children;
      if (th !== undefined) {
        setTharray(th);
        getMargintbl(th);
      }
      if (tr !== undefined) {
        setTdarray(tr);
        getCellWidth(tr);
      }
    }
  }, [overFlowScroll, getCellWidth, data]);
  // }, [thArray, getCellWidth, tdArray, overFlowScroll, data]);

  useEffect(() => {
    if (getCheckedItem) {
      sendselect(checkedItems);
    }
  }, [selectedRowIndex, getCheckedItem, checkedItems, data]);
  const Refreshtable = () => {
    setSelectedRowIndex();
    setSelectedRow();
    selectedTr();
    setEdit(false);
  };
  useEffect(() => {
    if (refreshTable) {
      Refreshtable();
    }
  }, [refreshTable]);
  const editbtnfunction = () => {
    editfunction();
  };
  /**
   * table head
   */
  const tblHead =
    overFlowScroll && overFlowScroll === true ? (
      <div className="customTblHead" style={{ width: tblwidth + "px" }}>
        <table style={{ width: tblwidth + "px" }}>
          <thead ref={theadRef}>
            <tr>
              {checkbox && <th style={{ width: "50px" }}>&nbsp;</th>}
              {coulmn.map((item, index) => (
                <th
                  style={{
                    width:
                      checkbox === true
                        ? cellWidth[index + 1] + "px"
                        : cellWidth[index] + "px",
                  }}
                  key={index}
                >
                  <Text content={item.header} />
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    ) : (
      <thead>
        <tr>
          {checkbox && <td style={{ width: "50px" }}>&nbsp;</td>}
          {coulmn.map((item, index) => (
            <th key={index}>
              <Text content={item.header} />
            </th>
          ))}
        </tr>
      </thead>
    );

  /**
   * table body
   */
  const tblbody =
    overFlowScroll && overFlowScroll === true ? (
      <div
        className="customTblBody"
        style={{
          maxHeight: "350px",
          marginTop: tbodyMargin + "px",
          width: tblwidth + "px",
        }}
        onScroll={(e) => next(e)}
      >
        <table style={{ width: tblwidth + "px" }}>
          <tbody ref={tbodyRef}>
            {dataArray && dataArray.length > 0 ? (
              dataArray.map((item, index) => (
                <tr
                  key={index}
                  onClick={
                    !selectedTr || !editColumn
                      ? () => {
                        return false;
                      }
                      : (value, i) => getSelectTr(item, index)
                  }
                  className={
                    selectedRowIndex === index && editColumn ? "selected" : ""
                  }
                >
                  {checkbox && (
                    <td style={{ width: "50px" }}>
                      {selectedIds && selectedIds.length > 0 ? (
                        <CheckBoxInput
                          id={item.ItemId}
                          value={selectedIds.find((a) =>
                            parseInt(item.ItemId) === a ? item.ItemId : ""
                          )}
                          onchange={(e) => onchangeCheck(e)}
                        />
                      ) : (
                        <CheckBoxInput
                          id={item.ItemId}
                          value={""}
                          onchange={(e) => onchangeCheck(e)}
                        />
                      )}
                    </td>
                  )}
                  {coulmn.map((td, i) => (
                    <td
                      style={{
                        width:
                          checkbox === true
                            ? cellWidth[i + 1] + "px"
                            : cellWidth[i] + "px",
                      }}
                      key={i}
                    >
                      {editColumn &&
                        td.cell === "EditInput" &&
                        edit === true &&
                        selectedRowIndex === index ? (
                        <Input
                          name={td.field}
                          value={item[td.field]}
                          onchange={tblInputOnchange}
                        />
                      ) : editColumn &&
                        td.cell === "select" &&
                        edit === true &&
                        selectedRowIndex === index ? (
                        <SelectInput
                          value={item[td.field]}
                          name={td.field}
                          slOption={td.slOption}
                          onchange={tblInputOnchange}
                        />
                      ) : editColumn &&
                        td.cell === "autocomplete" &&
                        edit === true &&
                        selectedRowIndex === index ? (
                        <Autocomplete
                          optionList={optionList}
                          value={item[td.field]}
                          optionGet={getAutocompleteOption}
                          name={td.field}
                        />
                      ) : editColumn &&
                        td.cell === "date" &&
                        edit === true &&
                        selectedRowIndex === index ? (
                        <SelectDate
                          name={td.field}
                          value={item[td.field]}
                          onchange={tableDate}
                        />
                      ) : editColumn &&
                        td.cell === "checkbox" &&
                        edit === true &&
                        selectedRowIndex === index ? (
                        <CheckBox
                          name={td.field}
                          value={item[td.field]}
                          onchange={oncheck}
                        />
                      ) : td.cell === "checkbox" ? (
                        <CheckBoxStatic
                          name={td.field}
                          value={item[td.field]}
                          onchange={oncheck}
                        />
                      ) : td.viewBtn === true ? (
                        <button
                          className="btn btnGreen"
                          onClick={() =>
                            Viewbtnclick(
                              item.Id === undefined || item.Id === 0 || item.Id === ""
                                ? item.id
                                : item.Id
                            )
                          }
                        >
                          {td.viewBtntext}
                        </button>
                      ) : (
                        item[td.field]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // P Starts commented
              // <tr>
              //   <td colSpan={coulmn.length} style={{ padding: "8px 10px" }}>
              //     <Text content="No Data Available" />
              //   </td>
              // </tr>
              // 
              <tr>
                  {coulmn.map((col, i) => (
                <td
                style={{
                  width:
                    checkbox === true
                      ? cellWidth[i + 1] + "px"
                      : cellWidth[i] + "px",
                }}
                key={i}
                >
                    <Input
                      // type="text"
                      // name={td.header}
                      // placeholder="hii"
                      className="DefaultItemId"
                      type="text"
                      name={col.field}
                      value={col.field == 'ItemName' ? "Press Ctrl+F" : ""}
                    />
                    
                </td>
                ))
                
                }
              </tr>
              // P Ends

            )}
          </tbody>
        </table>
      </div>
    ) : (
      <tbody>
        {dataArray && dataArray.length > 0 ? (
          dataArray.map((item, index) => (
            <tr
              key={index}
              onClick={
                !selectedTr || !editColumn
                  ? () => {
                    return false;
                  }
                  : (value, i) => getSelectTr(item, index)
              }
              className={
                selectedRowIndex === index && editColumn ? "selected" : ""
              }
            >
              {checkbox && (
                <td style={{ width: "50px" }}>
                  {selectedIds && selectedIds.length > 0 ? (
                    <CheckBoxInput
                      id={item.ItemId}
                      value={selectedIds.find((a) =>
                        parseInt(item.ItemId) === a ? item.ItemId : ""
                      )}
                      onchange={(e) => onchangeCheck(e)}
                    />
                  ) : (
                    <CheckBoxInput
                      id={item.ItemId}
                      value={""}
                      onchange={(e) => onchangeCheck(e)}
                    />
                  )}
                </td>
              )}
              {coulmn.map((td, i) => (
                <td key={i}>
                  {/* {item[td.field]} */}
                  {editColumn &&
                    td.cell === "EditInput" &&
                    edit === true &&
                    selectedRowIndex === index ? (
                    <Input
                      name={td.field}
                      value={item[td.field]}
                      onchange={tblInputOnchange}
                    />
                  ) : editColumn &&
                    td.cell === "date" &&
                    edit === true &&
                    selectedRowIndex === index ? (
                    <SelectDate
                      name={td.field}
                      value={item[td.field]}
                      onchange={tableDate}
                    />
                  ) : td.cell === "select" ? (
                    <SelectInput
                      value={item[td.field]}
                      name={td.field}
                      slOption={td.slOption}
                      onchange={tblInputOnchange}
                    />
                  ) : editColumn && td.cell === "checkbox" && edit !== true ? (
                    <CheckBoxStatic
                      name={td.field}
                      checked={item[td.field]}
                      onchange={oncheck}
                    />
                  ) : editColumn &&
                    td.cell === "checkbox" &&
                    edit === true &&
                    selectedRowIndex === index ? (
                    <CheckBox
                      name={td.field}
                      checked={item[td.field]}
                      onchange={oncheck}
                    />
                  ) : td.viewBtn === true ? (
                    <button
                      className="btn btnGreen"
                      onClick={() => Viewbtnclick(item.id)}
                    >
                      {td.viewBtntext}
                    </button>
                  ) : (
                    item[td.field]
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={coulmn.length} style={{ padding: "8px 10px" }}>
              <Text content="No Data Available" />
            </td>
          </tr>
        )}
      </tbody>
    );

  const footer = (
    <div className="customfooter">
      {checkbox && (
        <div className="selectedRow">
          Selected Row <span>{selectedIds && selectedIds.length}</span>
        </div>
      )}
      {/* <div className="showNumber">
        {startCount} - {endCount} ({data && data.length})
      </div>
      <button
        onClick={
          startCount === 0
            ? () => {
                return false;
              }
            : () => prev()
        }
        className="prevBtn"
      >
        Prev
      </button>
      <button
        onClick={
          startCount + 100 > data && data.length
            ? () => {
                return false;
              }
            : () => next()
        }
        className="nextBtn"
      >
        Next
      </button> */}
    </div>
  );

  const editbtn =
    itemAdd && !selectedRow ? (
      // <div className="row">
      <div className="col">
        <button className="Addbtn" onClick={itemAdd}>
          Add Item
        </button>
        {dataArray && dataArray.length > 0 ? (
          <span className="addSuggestion">Please select Row for edit</span>
        ) : (
          ""
        )}
      </div>
    ) : (
      // </div>
      dataArray &&
      dataArray.length > 0 &&
      editColumn &&
      selectedRow && (
        // <div className="row">
        <div className="col">
          {
                /* {deleteRow && (
                    <button className="removeBtn" onClick={() => remove()}>
                      Remove Item
                    </button>
                  )} */
          }
          <button className="editBtn" onClick={() => editbtnfunction()}>
            {!editbtnText ? "Edit Item" : editbtnText}
          </button>
          {itemAdd && (
            <button className="Addbtn" onClick={itemAdd}>
              Add Item
            </button>
          )}
        </div>
        // </div>
      )
    );

  const Selectfilter = (e) => {
    // alert(e.target.value);
    setFilterIndex(e.target.value);
  };

  // old one
  // const getFilteredItem = (item) => {
  //   const filteredItem = data && data.filter((a) => a.id === item.id);
  //   setFilterval(item[coulmn[filterIndex].field]);
  //   setDataArray(filteredItem);
  // };

  // P updating this function
  const getFilteredItem = (item) => {
    // alert(item,'item')
    console.log(item,'item in filter')
    console.log(data,'data data data')

  // if(item.hasOwnProperty(String(coulmn[filterIndex].field))){
      // var filteredItem = data && data.filter((a) => a.coulmn[filterIndex].field === item.coulmn[filterIndex].field);  
      // console.warn('yes')
  // } 
  // else {
    // console.warn('hi')
  // }
  //  var filterArrCondition = [
  //   a.GroupName === item.GroupName
  //  ] 
    // var fl = [] 
    // fl.push(filterval)
    // console.warn(fl,'flflfl fl')
    
  //  if(item.hasOwnProperty('GroupName')){
      // var filteredItem = data && data.filter((a) => a.GroupName === item.GroupName);  
      // console.warn('yes')
  //  } 

  // if(item.hasOwnProperty('ItemName')){
  //   var filteredItem = data && data.filter((a) => a.ItemName === item.ItemName);  
  //   // console.warn('yes')
  // } 

  // if(item.hasOwnProperty('ItemCode')){
  //     var filteredItem = data && data.filter((a) => a.ItemCode === item.ItemCode);  
  //     // console.warn('yes')
  //  } 

  // if(item.hasOwnProperty('unit')){
  //   var filteredItem = data && data.filter((a) => a.unit === item.unit);  
  //   // console.warn('yes')
  //   }   

    
    const filteredItem = data && data.filter((a) => a.id === item.id);
    setFilterval(item[coulmn[filterIndex].field]);
    setDataArray(filteredItem);
  };

  const refreshfilter = () => {
    setFilterIndex(0);
    tblList(0, 100);
    setFilterval("");
  };
  
  return (
    <>
      <div className="row">
        {editbtn}
        {filter && (
          <div className="col filter">
            <label>Search By</label>
            <select value={filterIndex} onChange={(e) => Selectfilter(e)}>
              {coulmn &&
                coulmn.map((a, i) => (
                  <option key={i} value={i}>
                    {a.field}
                  </option>
                ))}
            </select>
            <Autocomplete
              optionList={data && data.length > 0 ? data : []}
              optionGet={getFilteredItem}
              value={filterval}
              name={coulmn[filterIndex].field}
            />
            <button
              onClick={() => refreshfilter()}
              className="refreshBtn"
              title="Refresh"
            >
              <Refresh fill={"#ffffff"} />
            </button>
          </div>
        )}
      </div>
      {/* P STARTS */}
      <div className="row">
        
        {filter && (
          <div className="col filter" >
              {coulmn &&
                coulmn.map((a, i) => (
                  <Autocomplete
                      style={{ width: tblwidth/10 + "px" }}
                      key={i} 
                      // value={a.field}
                      placeholder={a.field}
                      optionList={data && data.length > 0 ? data : []}
                      optionGet={getFilteredItem}
                      name={a.field}
                      // name={coulmn[filterIndex].field}
                  />
                ))} 
          </div>
        )}
      </div>
      {/* P Ends */}

      {overFlowScroll && overFlowScroll === true ? (
        <div className="customTbl" ref={prentWidth}>  
          {tblHead}
          {tblbody}
          {!Footer || dataArray.length < 20 ? "" : footer}
        </div>
      ) : (
        <div>
          <table>
            {tblHead}
            {tblbody}
          </table>
        </div>
      )}
    </>
  );
};
export default CustomTable;
