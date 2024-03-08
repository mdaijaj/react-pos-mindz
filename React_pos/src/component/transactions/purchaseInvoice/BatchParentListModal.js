import React, { useEffect , useState} from 'react'
import {Button,Modal,Table} from 'react-bootstrap';
import { getBatchOrSerialNumberById, l } from '../../common/commonFunction';
import { getBatchOrSerialNumber } from '../../common/commonFunction';


const BatchParentListModal  = ({itemDetail,checkedParent,batchPopUp,batchListOkClicked,...props}) => {
    console.log(itemDetail,'item Detail of items')
  // if(ItemDetail === null || ItemDetail == undefined ){
  //     var item_name = '';
  //     var item_code = '';   
  //     var item_id = '';   
  //     console.log('yyyyyyyyyyyyyyyyyyy')
  // } else {
      var item_name = (itemDetail && itemDetail.ItemName != '') ? itemDetail.ItemName : '';
      // var item_code = (ItemDetail.ItemCode != '') ? ItemDetail.ItemCode : '';
      var item_id = (itemDetail) ? itemDetail.ItemId : '';
      console.log('nnnnnnnnnnnnnnnnnnnnn')
  // }   
  const [bPList,setBPList] = useState();

  console.log(item_id,'item_id item_id before')

  useEffect(async () => {
    console.log(item_id,'item_id item_id')
    var bnlbyid = await getBatchOrSerialNumberById(item_id)
    console.log(bnlbyid,'bnlbyid of batch number')
    setBPList(bnlbyid.batchnumber);
    // console.log(bNumber,'batch number bnlbyid of batch number')
  },[itemDetail])


  const handleSubmit = () => {
    let isConsumed = 0;
    let isConsumedAll = document.querySelectorAll('.isParent');
    console.log(isConsumedAll,'isConsumedAll isConsumedAll')
    var checkedSerialId = [];

  Array.from(isConsumedAll).map(IC => {
      if(IC.checked){
        isConsumed++;
           checkedParent({
                    'data_item_id': IC.getAttribute('data_item_id'),
                    'data_batchid' : IC.getAttribute('data_batchid'),
                    'data_batchno' : IC.getAttribute('data_batchno'),
                    'data_lotno'   : IC.getAttribute('data_lotno'),
                    'data_manufacturingdate' : IC.getAttribute('data_manufacturingdate'),
                    'data_expirydate' : IC.getAttribute('data_expirydate')
              })
      }
  })

    batchPopUp(true);
    batchListOkClicked(true);
    // onClickOk(isConsumed);
    return props.onHide(false);
  };


  return (
      <>
    <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-hcenter" style={{textAlign:'center'}}>
                Batch Group List 
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>

        <h5 style={{textAlign: "center"}}>Item Name : {item_name} </h5>
        
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Batch Id</th>
                    <th>Batch Number</th>
                    <th>Lot Number</th>
                    <th>Manufacturing Date</th>
                    <th>Expiry Date</th>
                    <th>Batch Group</th>
                  </tr>
                </thead>
                <tbody>
                  {
                  (bPList && l(bPList)) ? (
                    bPList && bPList.map((b, counter) => {
                           return ( 
                              <tr>
                                <td>{++counter}</td>
                                <td>{b.batchid}</td>
                                <td>{b.batchno}</td>
                                <td>{b.lotno}</td>
                                <td>{b.manufacturingdate}</td>
                                <td>{b.expirydate}</td>
                                <td>
                                  <input type="radio" class="form-check-input isParent"  id="radio2" name="optradio" 
                                    data_batchid = {b.batchid}
                                    data_batchno = {b.batchno}
                                    data_lotno   = {b.lotno}
                                    data_manufacturingdate = {b.manufacturingdate}
                                    data_expirydate = {b.expirydate}
                                    data_item_id = {b.itemid}
                                  ></input>
                                 </td>
                              </tr>
                            )
                    })
                  ) : (
                    <tr>
                         <td colSpan={7} className='text-center'>No data available</td>
                    </tr>           
                  )
                    
                  }
                  
                </tbody>
              </Table>
  




        </Modal.Body> 
        <Modal.Footer>
            <Button variant="secondary" className="btn btn-success" 
            onClick={handleSubmit}
             >OK</Button>
            <Button  onClick={props.onHide}>Close</Button>
        </Modal.Footer>
     </Modal>
     </>
  )
}


export default BatchParentListModal;





