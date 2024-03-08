import React, { useState, useEffect } from "react";
import { vNum } from "../../common/validation";
import BatchListModal from "./BatchListModal";
import SerialListModal from "./SerialListModal";
import { getBatchOrSerialNumberById } from "../../common/commonFunction";

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  data,
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {

  // console.log(data[index].ItemId,'this is initialValue',initialValue,'this is index',index)
  console.log(data,'datadatadata')
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState({});

  // P Starts
  const [serialListModalShow, setSerialListModalShow] = useState(false)
  const [batchListModalShow, setBatchListModalShow] = useState(false)
  const [selectedSerialList, setSelectedSerialList] = useState([])
  const [selectedBatchList, setSelectedBatchList] = useState([])
  const [batchNumberOfItem, setBatchNumberOfItem] = useState([])
  const [serialNumberOfItem, setSerialNumberOfItem] = useState([])
  const [BatchListSubmit,setBatchListSubmit] = useState(false)

  useEffect( async () => {
    let bnlbyid = await getBatchOrSerialNumberById(data[index].ItemId)
    console.log(data[index].ItemId,'data[index].ItemIddata[index].ItemId')
    setBatchNumberOfItem(bnlbyid.batchnumber);
    setSerialNumberOfItem(bnlbyid.serialnumber)
    console.log(data[index].isSerial,'data[index].isSerialdata[index].isSerial')
  },[])
  

  useEffect(() => {
      if (BatchListSubmit) {
        if(data[index].IsSerial == 'true'){ 
        setSerialListModalShow(true)
        }
        setBatchListSubmit(false);
      }
  }, [BatchListSubmit])
  
  // P Ends

  const onChange = (e) => {
    if (id === "Rate") {
      if (e.target.value === "0") {
        setError({ [id + "error"]: "Please enter value greater than 0" });
        setTimeout(() => {
          setError({ [id + "error"]: "" });
        }, 2000);
        setValue(data[index].mrp);
      } else {
        if (vNum(e.target.value, 0, 17)) {
          if (
            data &&
            data[index].mrp > 0 &&
            convertToFloat(data[index].mrp) >= convertToFloat(e.target.value)
          ) {
            setValue(e.target.value);
            setError({ [id + "error"]: "" });
          } else if (data && data[index].mrp === 0) {
            setValue(e.target.value);
            setError({ [id + "error"]: "" });
          } else {
            setValue(data[index].mrp);
            alert("sale price should be less than equal to mrp");
          }
        } else {
          setError({ [id + "error"]: "Please enter number" });
          setTimeout(() => {
            setError({ [id + "error"]: "" });
          }, 2000);
        }
      }
    } else if (id === "quantity") {

      setTimeout(() => {
        setBatchListModalShow(true)
      },1000)

      if (e.target.value === "0") {
        setError({ [id + "error"]: "Please enter value greater than 0" });
        setTimeout(() => {
          setError({ [id + "error"]: "" });
          // setValue("");
        }, 2000);
      } else {
        if (vNum(e.target.value, 0, 17)) {
          if (e.target.value > data[index].stock) {
            setValue(e.target.value);
            setTimeout(() => {
              alert("Item quantity out of stock");
              setValue("");
            }, 500);
          } else {
            // setValue(e.target.value);
            alert(selectedSerialList)
            setValue(selectedSerialList)
            setError({ [id + "error"]: "" });
          }
        } else {
          setError({ [id + "error"]: "Please enter number" });
          setTimeout(() => {
            setError({ [id + "error"]: "" });
          }, 2000);
        }
      }
    } else if (id === "requiredQty") {
      console.log(e.target.value, "DDD");
      if (e.target.value.length > 0) {
        setValue(e.target.value);
      }
    } else {
      setValue(e.target.value);
    }
  };

  const convertToFloat = (value) => {
    return value ? parseFloat(value) : value;
  };
  
  const onFocus = () => {
    // setValue("");
  };
  // We'll only update the external data when the input is blurred
  const onBlur = async () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    console.log(initialValue,"initialValueinitialValueinitialValue")
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
        <div>
          <input
            value={value}
            onFocus={onFocus}
            onChange={onChange}
            onBlur={onBlur}
          />
          <span style={{ color: "red" }}>{error[id + "error"]}</span>
        </div>

        <BatchListModal
            show={batchListModalShow}
            onHide={() => setBatchListModalShow(false)}
            bnoi={batchNumberOfItem}
            onClickOk={setSelectedBatchList}
            didBatchListSubmit={setBatchListSubmit}
        />

        <SerialListModal
          show={serialListModalShow}
          onHide={() => setSerialListModalShow(false)}
          snoi={serialNumberOfItem}
          onClickOk={setSelectedSerialList}
        />



    </>
  );
};

export default EditableCell;
