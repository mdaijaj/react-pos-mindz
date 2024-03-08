import { useEffect } from "react";

const DropdownView = (props) => {
  useEffect(()=>{

  },[props])
  return (
    <>
      <div className="formBox">
        <label htmlFor="">Select</label>
        <select name="" id="" disabled={props.disabled} value={props.value} onChange={(e) => props.onchange(e.target.value)}>
          <option value="">Select</option>
          {props.preiodlist.map((a) => (
            <option value={a.PeriodId}>{a.PeriodName}</option>
          ))}
        </select>
      </div>
    </>
  );
};
export default DropdownView;
