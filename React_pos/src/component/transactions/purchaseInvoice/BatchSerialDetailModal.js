import React, {  useState } from 'react'
import {Modal,Table} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


function BatchSerialDetailModal({BatchSerialDetail,...props}) {
  // console.log(BatchSerialDetail,'zzzzzzzzzzzzzzzzzzzzzzzz');

  // if(BatchSerialDetail != null || BatchSerialDetail != undefined){
    var bsd = BatchSerialDetail;
  // } else {
  //   var bsd = {};
  // }
  return (
      <>
    <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable={true}
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-hcenter" style={{textAlign:'center'}}>
                Batch Number Serial Detail
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>

        <h5 style={{textAlign: "center"}}></h5>

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
          BatchSerialDetail &&  BatchSerialDetail.map((item,index) => {
              return(
            <tr key={index}>
                <td>{index+1}</td>
                <td>{item.serial_number}</td>
                <td>{item.auto_generated_no}</td>
                <td></td>
                <td>{item.warrenty_date}</td>
                <td>{item.expiry_date}</td>
                <td>{item.mannual_fields}</td>
            </tr>
            )
         })
        }
        
        </tbody>
       </Table>
          
              

        </Modal.Body>
        
     </Modal>
     </>
  )
}


export default BatchSerialDetailModal;




