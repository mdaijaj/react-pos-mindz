import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal, ToggleButtonTable, Table, ToggleButton, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { pink, green } from '@material-ui/core/colors';
import db from '../../../datasync/dbs';
import { Group } from '@material-ui/icons';


const BoughtSerialsBatchItemListModal = ({ snb, ...props }) => {
  // console.log(ItemList,'itemlist newwwwwwwwwww');
  console.log(snb,'snb in modal snb');
  
  
  
  // var ll = [];
  // snoi && snoi.map(kk  => {
  //   kk && kk.map(cc => {
  //     ll.push(cc);
  //   })
  // })
  
  // ll.map(si => {
  //     si.checkedItem = '';
  // })
    
  // console.log(checkedArray,'checkedArray in out')  
  // checkedArray && ll.map(si => {
  //   if(checkedArray.includes(si.id)){
  //     si.checkedItem = 'checked';
  //   }
  // })
     
  // console.log(ll,"ll snoi ll snoi..............")
  // (checkedArray.includes(s.id))?true:false
  
  // const handleSubmit = () => {
  //   let isConsumed = 0;
  //   let isConsumedAll = document.querySelectorAll('.isConsumed');
  //   var checkedSerialId = [];
  //   Array.from(isConsumedAll).map(IC => {
  //     if(IC.checked){
  //       isConsumed++;
        
  //       // if(checkedSerialId.indexOf(IC.getAttribute('data-batch-id')) === -1)  {  
  //       //         checkedSerialId.push(IC.getAttribute('data-batch-id'));
  //       // }  
  //         checkedSerialId.push({
  //                 'serial_number':IC.getAttribute('data_serial_number'),
  //                 'auto_generated_no':IC.getAttribute('data_auto_generated_no'),
  //                 'batch_number':IC.getAttribute('data_batch_number'),
  //                 'warrenty_date':IC.getAttribute('data_warrenty_date'),
  //                 'expiry_date':IC.getAttribute('data_expiry_date'),
  //                 'mannual_fields':IC.getAttribute('data_mannual_fields'),
  //                 'id':IC.getAttribute('data_id'),
  //                 'batch_id':IC.getAttribute('data_batch_id')
  //               });
          
  //       // if(!checkedSerialId.includes(IC.getAttribute('data-batch-id'))){
  //           // checkedSerialId.push(IC.getAttribute('data_id'));
  //           // checkedSerialId.push(IC.getAttribute('data-batch-id'));
  //       // }

  //       // var Ck = checkedArray.includes(IC.data_id) ? 'checked' : ''
  //       // IC.setAttribute('checked',Ck)

  //     }
  //   })

  //   checkedSerial(checkedSerialId)
  //   onClickOk(isConsumed);
  //   return props.onHide(false);
  // };
  
  


  
  


  return (
    <>
      <Modal
        {...props}
        size="lg"
        // style={{width:'80%',height:'80%',center}}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable={true}
      // fullscreen={true}
      >

        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-hcenter" style={{textAlign:'center'}}>
                Sold Items Serials Numbers.
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h5 style={{ textAlign: "center" }}>Serial Popup</h5>
          <Table striped bordered hover scrollable={true}>
            <thead>
              <tr>
                <th>#</th>
                <th>Serial Number</th>
                <th>AutoGenerated Number</th>
                <th>Batch No.</th>
                <th>Warrenty Date</th>
                <th>Expiry Date</th>
                <th>Mannual Batch No.</th>
                
              </tr>
            </thead>
            <tbody>
               {
                snb && snb.map((s, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{s.serial_number}</td>
                      <td>{s.auto_generated_no}</td>
                      <td>{s.batch_number}</td>
                      <td>{s.warrenty_date}</td>
                      <td>{s.expiry_date}</td>
                      <td>{s.mannual_fields}</td>
                     
                    </tr>
                  )
                })
               }
                
            </tbody>
          </Table>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn btn-success" 
          // onClick={() => handleSubmit()} 
          >OK</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}


export default BoughtSerialsBatchItemListModal;





