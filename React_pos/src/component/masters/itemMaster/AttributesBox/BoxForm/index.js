import "../BoxForm/BoxForm.scss";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import calender from "../../../../../images/icon/calender.svg";
const BoxForm = (props) => {
  console.log('props in box form', props)

  return (
    <>
    <div className="row">
      <div className="col">
        <div className="InexclusiveCheck">
          <FormControlLabel
            control={
              <Checkbox
                color="default"
                // checked={props.data.IsTaxInclusive}
                checked={props.val ? props.data.IsTaxInclusive : ''}
                onChange={props.changeData}
                name="IsTaxInclusive"
                value={props.data.IsTaxInclusive ? "" : true}
              />
            }
            label="Inclusive of Tax"
          />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div className="formBox">
        <label>Serial No.</label>

            <input
              readOnly={!props.val ? true : false}
              type="text"
              onChange={props.changeData}
              name="SerialNo"
              data-valid="number"
              value={props.data.SerialNo}
              className={
                props.serialnoerror === true ? "error" : ""
              }
            />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label>Schedule No</label>

            <input
              readOnly={!props.val ? true : false}
              type="text"
              onChange={props.changeData}
              name="ScheduleNo"
              value={props.data.ScheduleNo}
            />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label>Commodity Code</label>
          <input
            readOnly={!props.val ? true : false}
            type="text"
            onChange={props.changeData}
            name="CommodityCode"
            value={props.data.CommodityCode}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label>Excise Classification</label>
          <input
            readOnly={!props.val ? true : false}
            type="text"
            onChange={props.changeData}
            name="Exciseclassification"
            value={props.data.Exciseclassification}
          />
        </div>
      </div>
    </div>
    <div className="row">
    <div className="col">
        <div className="formBox">
        <label>Excise Classification Code</label>
          <input
            readOnly={!props.val ? true : false}
            type="text"
            onChange={props.changeData}
            name="ExciseClassificationCode"
            value={props.data.ExciseClassificationCode}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label>Abatment Notificaiton No </label>
          <input
            readOnly={!props.val ? true : false}
            type="text"
            onChange={props.changeData}
            name="AbatmentNotificationNo"
            value={props.data.AbatmentNotificationNo}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label> Rate of Excise </label>
          <input
            readOnly={!props.val ? true : false}
            type="number"
            onChange={props.changeData}
            name="RateOfExcise"
            value={props.data.RateOfExcise}
          />
        </div>
      </div>
      <div className="col">
        <div className="formBox">
        <label> Excise valuation Method </label>
        <select
          disabled={props.val ? false : true}
          onChange={props.changeData}
          name="ExciseEvaluatinMethod"
          value={props.data.ExciseEvaluatinMethod}
        >
          <option value=""></option>
          <option value="Ad Quantum">Ad Quantum</option>
          <option value="Ad Valorem">Ad Valorem</option>
          <option value="MRP">MRP</option>

        </select>
        </div>
      </div>
    </div>
      
    </>
  );
};

export default BoxForm;
