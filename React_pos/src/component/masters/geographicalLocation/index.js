import "./geographicalLocation.scss";
import CommonFormAction from "../../common/commonFormAction";
import { useEffect, useState } from "react";
import indentCoulmn from "./coulmn";
import db from "../../../datasync/dbs";
import StateColumns from "./stateColumns";
import CustomTable from "../../common/table";
import cityColumn from "./cityColumns";
import validate from "../../common/validate";
import Text from '../../common/text'

const GeographicalLocation = ({pageNav}) => {
  const [val, setVal] = useState("");

  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [updatedCountry, setUpdatedCountry] = useState({});
  const [updatedState, setUpdatedState] = useState({});
  const [updatedCity, setUpdatedCity] = useState({});
  const [editCountrycoulmn, setEditCountrycoulmn] = useState(true);
  const [editStatecoulmn, setEditStatecoulmn] = useState(true);
  const [editCitycoulmn, setEditCitycoulmn] = useState(true);
  const [selectedCountryRow, setSelectedCountryRow] = useState();
  const [selectedStateRow, setSelectedStateRow] = useState();
  const [selectedCityRow, setSelectedCityRow] = useState();
  const [countryEdit, setCountryEdit] = useState();
  const [stateEdit, setStateEdit] = useState();
  const [cityEdit, setCityEdit] = useState();
  const [id, setid] = useState(1);
  const [disabledAction, setDisabledAction] = useState({
    add:pageNav.AllowNew === false ? "disable":"",
    view:pageNav.AllowView === false ? "disable":"",
    edit:pageNav.AllowEdit === false ? "disable":"",
    authorize:pageNav.AllowAuthorize === false ? "disable":"",
    print:pageNav.AllowPrint === false ? "disable":"",
  });

  const change_state = async (arg) => {
    if (arg === "add") {
      await pageLoad();
      randomId();
      setCountryEdit(true);
      setStateEdit(true);
      setCityEdit(true);
      setSelectedCountryRow();
      setSelectedCountryRow();
      setSelectedCountryRow();
      setEditCountrycoulmn(true);
      setEditStatecoulmn(true);
      setEditCitycoulmn(true);
      return setVal(arg);
    }

    if (arg === "edit") {
      await pageLoad();
      setEditCountrycoulmn(true);
      setEditStatecoulmn(true);
      setEditCitycoulmn(true);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      return setVal(arg);
    }

    if (arg === "save") {
      console.log(selectedCountry, selectedCity, selectedState);
    }

    if (arg === "refresh") {
      setUpdatedCity();
      setUpdatedState();
      setUpdatedCountry();
      // setCityEdit(false);
      // setStateEdit(false);
      // setCountryEdit(false);
      // setEditCountrycoulmn(false);
      // setEditStatecoulmn(false);
      // setEditCitycoulmn(false);
      setSelectedCountry([]);
      setSelectedCity([]);
      setSelectedState([]);
      //await pageLoad();
      return setVal(arg);
    }
  };

  const pageLoad = async () => {
    const geoList = await db.geographicalMaster.toArray();
    const stateList = await db.stateMaster.toArray();
    stateList.sort(function(a,b) {
      var x = a.StateName.toLowerCase();
      var y = b.StateName.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    setSelectedCountry(geoList);
    setSelectedState(stateList);
  };

  const randomId = () => {
    let bill = "SO";
    bill += Date.now();

    setid(bill);
  };

  const addCountryLine = () => {
    randomId();
    const resVal = selectedCountry.filter(
      (a) => a.CountryCode === "" || a.CountryName === ""
    );
    if (resVal.length > 0) {
      return false;
    } else {
      setSelectedCountry([
        ...selectedCountry,
        { Id: id, CountryId: id, CountryCode: "", CountryName: "" },
      ]);
      return;
    }
  };
  const addStateLine = () => {
    randomId();
    const resVal = selectedState.filter((a) => a.Date === "" || a.Rate === "");
    if (resVal.length > 0) {
      return false;
    } else {
      setSelectedState([...selectedState, { Id: id, Date: "", Rate: "" }]);
      return;
    }
  };
  const addCityLine = () => {
    randomId();
    const resVal = selectedCity.filter(
      (a) => a.CityName === "" || a.CityCode === ""
    );
    if (resVal.length > 0) {
      return false;
    } else {
      setSelectedCity([...selectedCity, { Id: id, Date: "", Rate: "" }]);
      return;
    }
  };

  const selectCountryRow = async (item) => {
    setSelectedCountryRow(item);
    if (item) {
      const stateList = await db.stateMaster
        .where("CountryId")
        .equals(item.CountryId)
        .toArray();
      setSelectedState(stateList);
    }
  };
  const selectStateRow = async (item) => {
    setSelectedStateRow(item);
    if (item) {
      const cityList = await db.cityMaster
        .where("StateId")
        .equals(item.StateId)
        .toArray();
      cityList.sort(function(a,b) {
        var x = a.CityName.toLowerCase();
        var y = b.CityName.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
      setSelectedCity(cityList);
    }
  };
  const selectCityRow = (item) => {
    setSelectedCityRow(item);
  };

  /**
   * table input handle change event
   */
  const tableInputOnchange = (e) => {
    setUpdatedCountry({
      ...updatedCountry,
      [e.target.name]: e.target.value,
    });
    return e.target.value;
  };
  const CityTableChange = (e) => {
    setUpdatedCity({
      ...updatedCity,
      [e.target.name]: e.target.value,
    });
    return e.target.value;
  };
  const stateTableChange = (e) => {
    setUpdatedState({
      ...updatedState,
      [e.target.name]: e.target.value,
    });
    return e.target.value;
  };
  /**
   * edit button status event
   */
  const editCountry = () => {
    setCountryEdit(true);
  };
  const editState = () => {
    setStateEdit(true);
  };
  const editCity = () => {
    setCityEdit(true);
  };

  const removeCountry = () => {
    const newList = selectedCountry.filter(
      (item) => item.Id !== selectedCountryRow.Id
    );
    if (newList && newList.length !== 0) {
      setSelectedCountry(newList);
    } else {
      setSelectedCountry([{}]);
      setCountryEdit(true);
    }
  };
  const removeState = () => {
    const newList = selectedState.filter(
      (item) => item.id !== selectedStateRow.id
    );
    if (newList && newList.length !== 0) {
      setSelectedState(newList);
    } else {
      setSelectedState([{}]);
      setStateEdit(true);
    }
  };
  const removeCity = () => {
    const newList = selectedCity.filter(
      (item) => item.id !== selectedCityRow.id
    );
    if (newList && newList.length !== 0) {
      setSelectedCity(newList);
    } else {
      setSelectedCity([{}]);
      setCityEdit(true);
    }
  };

  /**
   * get updated item from item popup
   */

  const updateItem = () => {
    const update = selectedCountry.map((item) => {
      if (item.Id === selectedCountryRow.Id) {
        return { ...item, ...updatedCountry };
      } else {
        return item;
      }
    });
    setSelectedCountry(update);
    setUpdatedCountry();
  };
  const updateState = () => {
    const update = selectedState.map((item) => {
      if (item.id === selectedStateRow.id) {
        return { ...item, ...updatedState };
      } else {
        return item;
      }
    });
    setSelectedState(update);
    setUpdatedState();
  };
  const updateCity = () => {
    const update = selectedCity.map((item) => {
      if (item.id === selectedCityRow.id) {
        return { ...item, ...updatedCity };
      } else {
        return item;
      }
    });
    setSelectedCity(update);
    setUpdatedCity();
  };

  useEffect(async() => {
    const getKey = (e) => {
      if (e.key === "Enter" && selectCityRow) {
        e.preventDefault();
        updateCity();
        setCityEdit(false);
      }
      if (e.key === "Enter" && selectCountryRow) {
        e.preventDefault();
        updateItem();
        setCountryEdit(false);
      }
      if (e.key === "Enter" && selectStateRow) {
        e.preventDefault();
        updateState();

        setStateEdit(false);
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    selectedCountry,
    selectedState,
    selectedCity,
    selectedCountryRow,
    selectedStateRow,
    selectedCityRow,
    updatedCity,
    updatedState,
    updatedCountry,
    cityEdit,
    stateEdit,
    countryEdit,
  ]);

  const para = { val, change_state, disabledAction };

  return (
    <>
      <div className="geographicalLocationBox" style={{display:pageNav.hide === true ? "none":"block"}}>
        <CommonFormAction {...para} />
        <div className="geographicalLocation">
          <div className="row">
            <div className="col w50" style={{margin:"25px 0px"}}>
              <div className="tableBox" style={{ width: "450px" }}>
                <CustomTable
                  coulmn={indentCoulmn}
                  overFlowScroll={true}
                  data={selectedCountry}
                  selectedTr={(item) => selectCountryRow(item)}
                  //Footer={true}
                  editColumn={editCountrycoulmn}
                  editfunction={() => console.log('editing not allowed')}
                  //editStatus={countryEdit}
                  //deleteRow={() => removeCountry()}
                  tblInputOnchange={(e) => tableInputOnchange(e)}
                  addLine={() => addCountryLine()}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col w50">
              <div className="boxTitle"><Text content="State"/></div>
              <div className="tableBox" style={{ width: "450px" }}>
                <CustomTable
                  coulmn={StateColumns}
                  overFlowScroll={true}
                  data={selectedState}
                  selectedTr={(item) => selectStateRow(item)}
                  //Footer={true}
                  editColumn={editStatecoulmn}
                  editfunction={() => console.log('editing not allowed')}
                  //editStatus={stateEdit}
                  //deleteRow={() => removeState()}
                  tblInputOnchange={(e) => stateTableChange(e)}
                  addLine={() => addStateLine()}
                />
              </div>
            </div>
            <div className="col w50">
              <div className="boxTitle"><Text content=" City" /></div>
              <div className="tableBox" style={{ width: "450px" }}>
                <CustomTable
                  coulmn={cityColumn}
                  overFlowScroll={true}
                  data={selectedCity}
                  selectedTr={(item) => selectCityRow(item)}
                  //Footer={true}
                  editColumn={editCitycoulmn}
                  editfunction={() => console.log('editing not allowed')}
                  //editStatus={cityEdit}
                  //deleteRow={() => removeCity()}
                  tblInputOnchange={(e) => CityTableChange(e)}
                  addLine={() => addCityLine()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GeographicalLocation;
