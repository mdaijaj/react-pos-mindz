import { useEffect, useState } from "react";
import CommonFormAction from "../../common/commonFormAction";
import "./unitMaster.scss";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import validate from "../../common/validate";
import { column } from "./column";
import CustomTable from "../../common/table";
import Text from "../../common/text";

const CurrencyMaster = ({pageNav}) => {
  const obj = {
    CurrencySymbol: "",
    FormalName: "",
    DigitAfterDecimal: "",
    SymbolForDecimalPortion: "",
    DecimalSymbol: "",
    GroupingSymbol: "",
    CounterId:"",
    ExchangeRate:[]
  };
 

  const [val, setVal] = useState("");
  const [createObj, setCreateObj] = useState({
    ...obj,
    indentDate: new Date(),
  });
  const [currencyList, setCurrencyList] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  // const [itemList, setItemList] = useState();
  const [codeFocus, setCodeFocus] = useState(false);
  // const [selectedItems, setSelectedItems] = useState([]);
  // const [updatedObj, setUpdatedObj] = useState({});
  // const [editcoulmn, setEditcoulmn] = useState(true);
  // const [selectedItemRow, setSelectedItemRow] = useState();
  // const [edit, setEdit] = useState();
  // const [id, setid] = useState(1);
  const [disabledAction, setDisabledAction] = useState({
    add:pageNav.AllowNew === false ? "disable":"",
    view:pageNav.AllowView === false ? "disable":"",
    edit:pageNav.AllowEdit === false ? "disable":"",
    authorize:pageNav.AllowAuthorize === false ? "disable":"",
    print:pageNav.AllowPrint === false ? "disable":"",
  });
  const change_state = async (arg) => {
    // if (arg === "add") {
    //   setCreateObj(obj);
    //   return setVal(arg);
    // }

    // if (arg === "edit") {
    //   await pageLoad();
    //   setCreateObj(obj);
    //   return setVal(arg);
    // }

    if (arg === "view") {
      await pageLoad();
      setCreateObj(obj);
      return setVal(arg);
    }


    if (arg === "refresh") {
      setCreateObj(obj);
      return setVal(arg);
    }
  };

  const pageLoad = async () => {
    const currencyList = await db.currencyMaster.toArray();
    setCurrencyList(currencyList);
  };

  const onchange = async (e, value) => {
    if (value) {
      e.preventDefault();
      setDropDownOption(false);
      setCreateObj(value);
    }
  };

  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(codeFocus);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    createObj,
    codeFocus,
    currencyList,
  ]);

  const para = { val, change_state, disabledAction };

  return (
    <>
      <div className="tabBox" style={{display:pageNav.hide === true ? "none":"block"}}>
        <CommonFormAction {...para} />
        <div className="currencyM">
          <div className="marg">
            <label><Text content="Currency Symbol"/></label>
            {val === "view" || val === "edit" ? (
              <Autocomplete
                options={currencyList}
                open={dropDownOption}
                onChange={(e, value) => onchange(e, value)}
                getOptionLabel={(option) => option.CurrencySymbol}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Press ctrl + L"
                    onFocus={() => setCodeFocus(true)}
                    onBlur={() => {
                      setCodeFocus(false);
                      setDropDownOption(false);
                    }}
                  />
                )}
              />
            ) : (
              <input
                name="CurrencySymbol"
                type="text"
                data-valid="varChar"
                value={createObj && createObj.CurrencySymbol}
                readOnly={true}
              />
            )}
          </div>
          <div className="marg">
            <label><Text content="Formal Name"/></label>
            <input
              name="FormalName"
              type="text"
              data-valid="varChar"
              value={createObj && createObj.FormalName }
              readOnly={true}
            />
          </div>
          <div className="marg">
            <label><Text content="Digit After Decimal"/></label>
            <input
              name="DigitAfterDecimal"
              type="text"
              data-valid="varChar"
              dir="rtl"
              value={createObj && createObj.DigitAfterDecimal}
              readOnly={true}
            />
          </div>
        </div>
        <div className="currencyM">
          <div className="marg">
            <label><Text content="Symbol For Decimal Portion"/></label>
            <input
              name="SymbolForDecimalPortion"
              type="text"
              data-valid="varChar"
              value={createObj && createObj.SymbolForDecimalPortion}
              readOnly={true}
            />
          </div>
          <div className="marg">
            <label><Text content="Decimal Symbol"/></label>
            <input
              name="DecimalSymbol"
              type="text"
              value={createObj && createObj.DecimalSymbol}
              readOnly={true}
            />
          </div>
          <div className="marg">
            <label><Text content="Digit Grouping Symbol"/></label>
            <input
              name="GroupingSymbol"
              type="text"
              data-valid="varChar"
              value={createObj && createObj.GroupingSymbol}
              readOnly={true}
            />
          </div>
        </div>
        <div className="currencyM">
          <div className="tableBox" style={{ width: "450px" }}>
            <CustomTable
              coulmn={column}
              overFlowScroll={false}
              data={createObj.ExchangeRate}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyMaster;
