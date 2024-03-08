import "./index.scss";
import React, { useEffect, useState, useRef } from 'react'
import {Button,Form,Modal,Row,Col} from 'react-bootstrap';
import { getBatchOrSerialNumber } from '../../common/commonFunction';

// ,ItemDetail,onChangedInvoiceQuantity,didBatchSubmit, 
function ExistsModal({onClickNo,onClickYes,...props}) {
  
  // if(ItemDetail === null || ItemDetail == undefined ){
  //     var item_name = '';
  //     var item_code = '';   
  //     var item_id = '';   
  // } else {
  //     var item_name = (ItemDetail.ItemName != '')?ItemDetail.ItemName:'';
  //     var item_code = (ItemDetail.ItemCode != '')?ItemDetail.ItemCode:'';
  //     var item_id = (ItemDetail.ItemId != '')?ItemDetail.ItemId:'';
  // }   

  // const [defaultLotNumber,setDefaultLotNumber] = useState('');

  
  // const [formData,setFormData] = useState({
  //   batch_id: '',
  //   item_name: '',
  //   item_code: '',
  //   batch_number:'',
  //   batch_date:'',
  //   lot_no:'',
  //   qty_in:'',
  //   mfg_date:'',
  //   expiry_date:'',
  //   mrp:''
  // });
  
  // const onInputChange =  e => {
  //   var nameV = e.target.name;
  //   var valueV = e.target.value;

  //   if((nameV == 'batch_number') && (valueV != '' )){
  //     setFormData({...formData, [nameV]:valueV });
  //     // alert('bbbb');
  //     console.log(formData,'formData in BatchModal')
  //   } else if((nameV == 'batch_date') && (valueV != '' )){
  //      setFormData({...formData, [nameV]:valueV});
  //   } else if((nameV == 'mfg_date') && (valueV != '' )){
  //      setFormData({...formData, [nameV]:valueV});
  //   } else if((nameV == 'expiry_date') && (valueV != '' )){
  //      setFormData({...formData, [nameV]:valueV});
  //   } else if ((nameV == 'mrp') && (valueV != '' )){
  //      setFormData({...formData, [nameV]:valueV});
  //   }
  // }

  // useEffect(() => {
  //   // const number = '1';
  //   // setDefaultBatchNumber(item_code + number.padStart(5, '0'))
  //   // setDefaultLotNumber('LOT-'+item_code + number.padStart(5, '0'))
  //   // var ln = 'LOT-'+item_code + number.padStart(5, '0');
  //   setFormData(formData);
  // },[]);
  
  



  // setBatchError(true)
  // const batchOkClicked =  async () => {
    
  //     var bnl = await getBatchOrSerialNumber();
  //     var found_bnli = bnl.batchnumber.findIndex(bnli => bnli.batch_number == formData.batch_number)
  //     if(found_bnli > 0){
  //       alert('Batch number already exists.')
  //     } else {
  //       onClickOk(formData);
  //       didBatchSubmit(true);
  //           //   setFormData
  //           //   batch_number:'',
  //           //   batch_date:'',
  //           //   lot_no:'',
  //           //   mfg_date:'',
  //           //   expiry_date:'',
  //           //   mrp:''
            
  //       return props.onHide(false);
  //     }
  // }

  const parentExists = exists => exists ? onClickYes(true) : onClickNo(true); 
  

  return (
      <>
    <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-hcenter" style={{textAlign:'center'}}>
            </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{textAlign:'center'}}> Do you want to add batch in existing batch ? </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" 
            style={{backgroundColor:'#113f72'}}
            onClick={() => parentExists(true)} 
             >Yes</Button>
            <Button variant="secondary" 
            style={{backgroundColor:'#113f72'}}
              onClick={() => parentExists(false)} 
             >No</Button> 
            <Button  onClick={props.onHide}
            style={{backgroundColor:'#113f72'}}
            >Close</Button>
        </Modal.Footer>
     </Modal>
     </>
  )
}


export default ExistsModal;





