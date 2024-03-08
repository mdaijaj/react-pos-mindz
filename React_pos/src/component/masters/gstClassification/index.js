import "./stockGeneral.scss";
import CommonFormAction from "../../common/commonFormAction";
//import validate from "../../common/validate";
import { useEffect, useMemo, useState } from "react";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import COLUMNS from "./columns";
import Table from "./table";
import GSTCOLUMN from "./gstColumn";
import CustomTable from "../../common/table";
import Text from "../../common/text";

const GstClassification = ({ pageNav }) => {
  const plainObj = {
    applicablefrom: "",
    HsnCode: "",
    HsnName: "",
    Code: "",
  };

  const gstObj = {};

  const [createObj, setCreateObj] = useState(plainObj);
  const [errorObj, setErrorObj] = useState();
  const [gstClassificationList, setGstClassificationList] = useState(null);
  const [selectedGstClassification, setSelectedGstClassification] = useState(
    []
  );
  const [disabledAction, setDisabledAction] = useState({
    add: pageNav.AllowNew === false ? "disable" : "",
    view: pageNav.AllowView === false ? "disable" : "",
    edit: pageNav.AllowEdit === false ? "disable" : "",
    authorize: pageNav.AllowAuthorize === false ? "disable" : "",
    print: pageNav.AllowPrint === false ? "disable" : "",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [dropDownOption, setDropDownOption] = useState(false);
  const [gst, setGst] = useState([]);
  const [sgstCgst, setSgstCgst] = useState();
  const [codeFocus, setCodeFocus] = useState(false);
  const [val, setVal] = useState("");
  const [rows, setRows] = useState(gstObj);
  const [gstRow, setGstRow] = useState();
  const updateRow = () => {
    if (Object.keys(rows).length > 1) {
      setRows(gstObj);
      setSgstCgst([...sgstCgst, {}]);
    } else {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateObj({ ...createObj, [name]: value });
  };
  const updateGstDate = (index, id, value) => {
    console.log(index, id, value);
    setCreateObj({
      ...createObj,
      applicablefrom: value,
    });
  };
  const updateGstData = (rowIndex, columnId, value) => {
    try {
      setGstRow({
        [columnId]: value,
      });
    } catch (error) {}
  };
  const updateMyData = (rowIndex, columnId, value) => {
    try {
      setRows({
        [columnId]: value,
      });
    } catch (error) {}
  };
  const updateGstRow = () => {
    if (Object.keys(gstRow).length > 1) {
      setGstRow(gstObj);
      setGst([...gst, {}]);
    } else {
      return false;
    }
  };
  const pageLoad = async () => {
    const gstList = await db.hsnMaster.toArray();
    const states = await db.stateMaster.toArray();
    states.sort(function (a, b) {
      var x = a.StateName.toLowerCase();
      var y = b.StateName.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    //setSelectedItems(gstList);
    setStateList(states);
    setGstClassificationList(gstList);
  };

  const change_state = (arg) => {
    switch (arg) {
      case "edit": {
        setVal(arg);
        return;
      }
      case "refresh": {
        setCreateObj(plainObj);
        setGst([]);
        setGstRow([]);
        setStateList([]);
        setSgstCgst();
        setVal(arg);
        pageLoad();
        return;
      }
      case "view": {
        pageLoad();
        setVal(arg);
        console.log(gstClassificationList);
        return;
      }
      case "add": {
        pageLoad();
        setRows([]);
        setGstRow([]);
        setSelectedGstClassification([]);
        setGst([{}]);
        setSgstCgst([{}]);
        setCreateObj(plainObj);
        setVal(arg);
        return;
      }
      case "save": {
        setVal(arg);
        submit();
        setGst([]);
        setSgstCgst([]);
        setCreateObj(plainObj);
        setRows();
        setGstRow();
        return;
      }
      default:
        return arg;
    }
  };
  const getFormattedData = async () => {
    const sgst_cgst = await { ...rows };
    console.log(sgst_cgst);
  };
  const submit = () => {
    // db.stockMaster.add(createObj.form).then((res) => {
    //   console.log(res);
    // });
    // db.stockMasterDetails
    //   .bulkAdd(selectedGstClassification)
    //   .then((res) => console.log(res));
    getFormattedData();
  };

  const getStockDetail = (value) => {
    if (!value) {
      setCreateObj(plainObj);
      setGstRow([]);
      setSgstCgst();
      return;
    }
    setSelectedItems(value);
    setCreateObj({
      ...value,
    });
    setSgstCgst([
      {
        cgst: value?.IGST[0]?.CGST[0]?.CgstTaxRate,
        sgst: value?.IGST[0]?.CGST[0]?.SgstTaxRate,
      },
    ]);
    setGstRow([
      {
        ApplicableOn: value?.IGST[0].ApplicableOn,
        IgstTaxRate:
          value?.IGST[0]?.CGST[0]?.CgstTaxRate +
          value?.IGST[0]?.CGST[0]?.SgstTaxRate,
      },
    ]);
    setDropDownOption(false);
  };

  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
      console.log(val);
    };
  }, [createObj, val, codeFocus, errorObj, selectedGstClassification]);

  const para = { val, change_state, disabledAction };

  return (
    <>
      <div
        className="stockGeneral"
        style={{ display: pageNav.hide === true ? "none" : "block" }}
      >
        <CommonFormAction {...para} />
        <div className="stockGeneralIn mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col col3">
                <div className="formBox">
                  <label htmlFor=""><Text content="HSN Name" /></label>
                  {val === "edit" || val === "view" ? (
                    gstClassificationList && (
                      <Autocomplete
                        open={dropDownOption}
                        options={
                          gstClassificationList ? gstClassificationList : [{}]
                        }
                        onChange={(e, value) => getStockDetail(value)}
                        getOptionLabel={(option) => option.HsnName}
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
                    )
                  ) : (
                    <input
                      type="text"
                      name="HsnName"
                      onChange={(e) => handleChange(e)}
                      data-valid="varChar"
                      value={createObj && createObj.HsnName}
                      readOnly={val === "add" ? false : true}
                    />
                  )}
                </div>
              </div>
              <div className="col col3">
                <div className="formBox">
                  <label htmlFor=""><Text content="HSN Code" /></label>
                  <input
                    type="text"
                    name="HsnCode"
                    onChange={(e) => handleChange(e)}
                    data-valid="varChar"
                    value={createObj && createObj.Code}
                    readOnly={val === "add" ? false : true}
                  />
                </div>
              </div>
            </div>
            <div className="row ">
              <div className="col">
                <div className="tableBox" style={{ width: "450px" }}>
                  <div className="gstclasstbl">
                    <div className="customTblHead">
                      <table>
                        <thead>
                          <tr>
                            <th><Text content="Sgst" /></th>
                            <th><Text content="Cgst" /></th>
                            <th><Text content="State" /></th>
                          </tr>
                        </thead>
                        {sgstCgst ? (
                          <tbody>
                            <tr>
                              <td>{sgstCgst[0]?.sgst}</td>
                              <td>{sgstCgst[0]?.cgst}</td>
                              <td>
                                <select name="states" id="states">
                                  {stateList &&
                                    stateList.map((states) => (
                                      <option value={states.StateName}>
                                        {states.StateName}
                                      </option>
                                    ))}
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          <tr>
                            <td><Text content="No data" /></td>
                          </tr>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="tableBox" style={{ width: "450px" }}>
                  <CustomTable
                    coulmn={GSTCOLUMN}
                    overFlowScroll={true}
                    data={gstRow && gstRow}
                    Footer={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GstClassification;
