import React, { useEffect, useState } from "react";
import db from "../../../datasync/dbs";
const SelectCell = ({
  value: initialValuee,
  row: { index },
  column: { id },
  data,
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  console.log(data, 'data in selectCell')
  console.log(initialValuee, "initialValuee")
  console.log(index, "index")
  console.log(id, "id")


  const [value, setValue] = useState(initialValuee);
  const [Defaultvalue, setDefaultvalue] = useState(initialValuee);
  const [godownlist, setGodownlist] = useState([]);
  //   const godownlist= await db.GodownMaster.toArray().then().catch(err=>console.log(err));
  //   if(godownlist){
  //       setCreateObj({...createObj,godownList:godownlist})
  //   }
  const onchangeSelect = (e) => {
    e.preventDefault();
    setValue(e.target.value);
    console.log(value, 'value in select cell')
    console.log(e.target.value, 'e.target.valuee.target.value in seelct cell')
    updateMyData(index, id, e.target.value);
  }
  useEffect(async () => {
    if (godownlist.length < 1) {
      const getgodownlist = await db.GodownMaster.toArray().then().catch(err => console.log(err));
      if (getgodownlist) {
        setGodownlist(getgodownlist)
      }
    }
  }, [])

  useEffect(() => {
    console.log(initialValuee, "initialValuee")
    console.log(index, "index")
    console.log(id, "id")
    setDefaultvalue(initialValuee)
    setValue(initialValuee);
  }, [initialValuee])
  return (
    <>
      <select value={value} onChange={(e) => onchangeSelect(e)} style={{ width: "150px" }}>
        <option value="0">select</option>
        {godownlist.map((a, i) => <option key={i} value={parseInt(a.storeid)}>{a.Storename}</option>)}
      </select>
    </>
  )

}
export default SelectCell;