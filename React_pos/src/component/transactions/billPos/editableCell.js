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
  updateMyData,
  boughtBatchSerials // This is a custom function that we supplied to our table instance
}) => {

  console.log(data,'this is initialValue',initialValue,'this is index',index)
  // console.log(data,'datadatadata')
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState({});

  // P Starts
  const [serialListModalShow, setSerialListModalShow] = React.useState(false)
  const [batchListModalShow, setBatchListModalShow] = React.useState(false)
  const [selectedSerialList, setSelectedSerialList] = React.useState(0)
  const [selectedBatchList, setSelectedBatchList] = React.useState([])
  const [batchNumberOfItem, setBatchNumberOfItem] = React.useState([])
  const [serialNumberOfItem, setSerialNumberOfItem] = React.useState([])
  const [BatchListSubmit,setBatchListSubmit] = React.useState(false)
  const [checkedSerialData,setCheckedSerialData] = useState([])

  

  React.useEffect( async () => {
    let bnlbyid = await getBatchOrSerialNumberById(data[index].ItemId)
    // console.log(data[index].ItemId,'data[index].ItemIddata[index].ItemId')
    setBatchNumberOfItem(bnlbyid.batchnumber);
    setSerialNumberOfItem(bnlbyid.serialnumber)
    // console.log(data[index].isSerial,'data[index].isSerialdata[index].isSerial')
  },[])

  React.useEffect(() => {
      if (BatchListSubmit) {
        if(data[index].IsSerial == 'true'){ 
        setSerialListModalShow(true)
        }
        setBatchListSubmit(false);
      }
  }, [BatchListSubmit])

  React.useEffect(() => {
    if (id === "quantity") {
      if(data[index].IsSerial == 'true'){ 
        setValue(selectedSerialList)
        updateMyData(index, id, selectedSerialList);
      } else {
        setValue(selectedBatchList);
        updateMyData(index, id, selectedSerialList);
      }  
    }  
  },[selectedSerialList,selectedBatchList]);
  
  React.useEffect(() => {
    if (checkedSerialData != null) {
  console.log(checkedSerialData,'checkedSerialData,checkedSerialData');
  console.log(batchNumberOfItem,'batchNumberOfItem,batchNumberOfItem');

          var selected_batch_id = [];
          var selected_batch_data = [];
          // console.log(sle)
          checkedSerialData.map(CSD => {
              if(selected_batch_id.indexOf(CSD.batch_id) === -1)  {  
                selected_batch_id.push(CSD.batch_id)
              }  
            })
            console.log(selected_batch_id,'selected_batch_id,selected_batch_id')
          selected_batch_id.map(SBI => {
            selected_batch_data.push(batchNumberOfItem.find(x => x.batch_id == SBI));
          })
          console.log(selected_batch_data,'selected_batch_data selected_batch_data')
          boughtBatchSerials({'itemID':data[index].ItemId, 'bought_batch':selected_batch_data,'bought_serials':checkedSerialData});
          
      }
  }, [checkedSerialData])
  // Puhupwas Ends

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
      
        // e.target.value = selectedSerialList;

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
              if(data[index].IsLot == 'true'){ 
                setTimeout(() => {
                  setBatchListModalShow(true)
                },1000)
              }
            setValue(e.target.value);
            // setValue(selectedSerialList)  
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
          <span style={{ color: "red" }}> { error[id + "error"]} </span>
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
            checkedSerial={setCheckedSerialData}
        />


     </>
  );
};

export default EditableCell;
