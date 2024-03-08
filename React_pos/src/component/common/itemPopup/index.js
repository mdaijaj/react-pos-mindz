import React, { useState,useCallback,useEffect } from "react";
import CustomTable from "../table";
import Text from "../text";
import db from "../../../datasync/dbs";
const ItemPopup=(props)=>{
    const [selectRowBatch,setSelectRowBatch]=useState();
    const [updateBatch,setUpdateBatch]=useState();
    const [edit, setEdit] = useState();
    const [refreshtbl,setRefreshtbl] =useState();
    const selectedRowBatch=(item)=>{
        setSelectRowBatch(item)
      }
      const tableInputOnchangeBatch=(e)=>{
        if(e.target.value > parseInt(selectRowBatch.stock)){
          setUpdateBatch({...updateBatch,[e.target.name]:""});
          return ""
    
        }else{
          setUpdateBatch({...updateBatch,[e.target.name]:e.target.value});
          return e.target.value
        } 
      }
      const editItem = () => {
        setEdit(true);
      };
    const OkBatchbtn=async()=>{
    let getsereilobj = await db.SerialMaster.where("itemid").equals(props.batchArray[0].itemid).toArray().then().catch(err => console.log(err));
    if(getsereilobj.length > 0){
        let items=await Promise.all(getsereilobj.map(async(a)=>{
          let srDetail = await db.SerialDetail.where("serialid").equals(a.serialid).first();
          return {...a,id:a.serialid,ItemId:a.serialid,expirydate:a.expirydate,warrentydate:a.warrentydate,batchid:srDetail.batchid,batchdetailid:srDetail.batchdetailid,storeid:srDetail.storeid}
        }))
        let fltrBystr = items.filter((a)=> a.storeid === props.batchArray[0].storeid)
        props.selectedBatchArray(props.batchArray);
        props.setItemSeriralList(fltrBystr);
        props.setBatchSts(false);
        props.setSerialSts(true);
      }

  }

      const updateBatchAction=useCallback(()=>{
        if(props.batchSts===true){
          console.log(updateBatch,"updateBatch")
          console.log(selectRowBatch,"SelectRowBatch")
          const arr = props.batchArray.map((a)=>{
            if(selectRowBatch.batchid===a.batchid){
              return {...a,...updateBatch}
            }else{
              return a
            }  
          });
          props.setBatchArray(arr);
          setEdit(false);
        }
      },[updateBatch,props.batchSts])
    const okItemPopBtn=async()=>{
        // console.log(getcheckedRowsPop,"getcheckedRowsPop")
         const ids = props.getcheckedRowsPop.map((a) => {
           return a.ItemId;
         });
        props.setCheckedItemPopup(ids)
         let arr = [];
             for(let x of props.getcheckedRowsPop){
               arr.push(x)
             }
             const results = arr.filter(
               ({ ItemId: id1 }) =>
                 !props.product.some(({ ItemId: id2 }) => id2 === id1)
             );
             const results2 = props.product.filter(
               ({ ItemId: id1 }) => !arr.some(({ ItemId: id2 }) => id2 === id1)
             );
             if (results.length > 0) {
               let newArry=[...props.product,...results]
              props.okItemPopBtn(newArry)
             }else if(results2.length > 0) {
               const results3 = props.product.filter(
                 ({ ItemId: id1 }) =>
                   !results2.some(({ ItemId: id2 }) => id2 === id1)
               );
               if (results3) {
               //  selectedArray(results3)
               props.okItemPopBtn(results3)
               }else{
                props.okItemPopBtn("none");   
               }
             }else{
                props.okItemPopBtn("none");
             }
            // setItemPopup(false)
             
         }
         
         useEffect(()=>{
          console.log("props.itemPopup")
            const getKey2 = (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                updateBatchAction();
                // setEdit(false);
              }
            };
            window.addEventListener("keydown", getKey2);
            return () => {
              window.removeEventListener("keydown", getKey2);
            };
            
          },[updateBatch,props.batchSts,props.itemPopup,updateBatchAction])
          useEffect(()=>{
            //console.log(props.itemPopup,"props.itemPopup")
          },[])

    return(<>
    {props.itemPopup === true ? 
    <div className="modalPopUp ff">
        <div className="modalPopUPin">
        <CustomTable
              coulmn={[
                { header: "Group", field: "groupName" },
                { header: "Item Name", field: "ItemName" },
                { header: "Item Code", field: "ItemCode" },
                { header: "Stock", field: "Stock" },
              ]}
              data={props.itemListPopup}
              overFlowScroll={true}
              checkbox={true}
              selectedRows={props.checkedItemPopup}
              getCheckedItem={(res) => props.getCheckedRowsItemPopup(res)}
              //Footer={true}
              filter={true}
            />
             <div className="popupButton">
              <button
                className="btn btnGreen mr-5 mlAuto"
               onClick={()=>okItemPopBtn()}
              >
                <Text content="Ok" />
              </button>
              <button className="btn btnRed" onClick={() => props.setItemPopup(false)}>
                <Text content="Cancel" />
              </button>
            </div>
        </div>
      </div>:props.batchSts === true ? 
      <div className="modalPopUp">
          <div className="modalPopUPin">
          <CustomTable
          coulmn={[
                { header: "Batch No", field: "batchno" },
                { header: "Lot No", field: "lotno" },
                { header: "Stock", field: "stock" },
                { header: "Qty Out", field: "QtyOut",cell: "EditInput"},
                { header: "Batch Date", field: "batchdate" },
                { header: "Mfg. Date", field: "manufacturingdate" },
                { header: "Exp. Date", field: "expirydate" },
                { header: "MRP", field: "mrp" },
          ]}
          selectedTr={(item) => selectedRowBatch(item)}
          editColumn={true}
          data={props.batchArray}
          overFlowScroll={true}
          editStatus={edit}
          checkbox={false}
          editfunction={() => editItem()}
          tblInputOnchange={(e) => tableInputOnchangeBatch(e)}
          editbtnText="Add OutQty"
          refreshTable={refreshtbl}
         
        />
        <div className="popupButton">
              <button
                className="btn btnGreen mr-5 mlAuto"
               onClick={()=>OkBatchbtn()}
              >
                <Text content="Ok" />
              </button>
              <button className="btn btnRed" onClick={() => props.setBatchSts(false)
        }>
                <Text content="Cancel" />
              </button>
            </div>
          </div>
          </div>:props.serialSts === true ?  <div className="modalPopUp">
          <div className="modalPopUPin"> <CustomTable
            coulmn={[
              { header: "serialno", field: "serialno" },
              { header: "Auto Generated", field: "uniqueserialno" },
              { header: "Warrenty Date", field: "warrentydate" },
              { header: "Expiry Date", field: "Expiry Date" },
            ]}
            getCheckedItem={(res) => props.setCheckedItemSerial(res)}
            data={props.itemSeriralList}
            selectedRows={props.checkedItemSerial}
            overFlowScroll={true}
            checkbox={true}
            // selectedRows={checkedItem}
            // getCheckedItem={(res) => getCheckedRows(res)}
           
          />
          <div className="popupButton">
              <button
                className="btn btnGreen mr-5 mlAuto"
               onClick={()=>props.OkSerialbtn()}
              >
                <Text content="Ok" />
              </button>
              <button className="btn btnRed" onClick={() => props.setSerialSts(false)}>
                <Text content="Cancel" />
              </button>
            </div>
          </div>
          </div>:""}
    </>)

}
export default ItemPopup;
