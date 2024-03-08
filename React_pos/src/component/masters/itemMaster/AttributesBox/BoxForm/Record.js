import "../BoxForm/BoxForm.scss";
// import Checkbox from "@material-ui/core/Checkbox";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
import calender from "../../../../../images/icon/calender.svg";
import { useState } from "react";
import DatePicker from "react-datepicker";
import Text from "../../../../common/text";

const BoxForm = (props) => {
  // console.log('props in box form', props)

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(); //const [startDate, setStartDate] = useState(null);
  const handleType = (e) => {
    e.preventDefault();
  };
  return (
    <>
    <div className="row">
      <div className="col">
        <div className="formBox">
        <label>Minimum Stock Qty</label>
          <input
            readOnly={!props.val ? true : false}
            type="Number"
            onChange={props.changeData}
            name="MinStock"
            value={props.data.MinStock}
            onBlur={props.checkInvalid}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label>Maximum Stock Qty</label>
          <input
            readOnly={!props.val ? true : false}
            type="Number"
            onChange={props.changeData}
            name="MaxStock"
            value={props.data.MaxStock}
            onBlur={props.checkInvalid}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label><Text content="Reorder Level Qty"/></label>
          <input
            readOnly={!props.val ? true : false}
            type="number"
            onChange={props.changeData}
            name="ReorderLevel"
            value={props.data.ReorderLevel}
            onBlur={props.checkInvalid}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label><Text content="Critical Level Qty" /></label>
          <input
            readOnly={!props.val ? true : false}
            type="number"
            onChange={props.changeData}
            name="CriticalLevel"
            value={props.data.CriticalLevel}
            onBlur={props.checkInvalid}
          />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div className="formBox">
        <label><Text content="Economic Order Qty" /></label>
          <input
            readOnly={!props.val ? true : false}
            type="number"
            onChange={props.changeData}
            name="EconomicOrderQty"
            value={props.data.EconomicOrderQty}
            onBlur={props.checkInvalid}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label> <Text content="Manufacturing Date"/></label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            onChangeRaw={(e) => handleType(e)}

          />
          <div className="CalenderForm">
            <img src={calender} alt="" />
          </div>
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label><Text content="Expiry Date" /></label>

<DatePicker
  selected={endDate}
  onChange={(date) => setEndDate(date)}
  onChangeRaw={(e) => handleType(e)}
  minDate={startDate}
/>

<div className="CalenderForm">
  <img src={calender} alt="" />
</div>
        </div>
      </div>
      <div className="col">
        <div className="formBox"></div>
      </div>
    </div>
      
    </>
  );
};

export default BoxForm;
