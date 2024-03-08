import React, {  useState } from 'react'
import {Modal,Table} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


function BatchChildDetailModal({BatchChildDetail,ScListF,...props}) {
  // console.log(BatchSerialDetail,'zzzzzzzzzzzzzzzzzzzzzzzz');

  // if(BatchSerialDetail != null || BatchSerialDetail != undefined){
    // var bsd = BatchChildDetail;
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
                Batch Child  Detail
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>

        <h5 style={{textAlign: "center"}}></h5>
        
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        {/* <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Batch No.</th> 
                        <th>Lot No.</th> */}
                        <th>In Quantity</th>
                        <th>Batch Date</th>
                        <th>MRP</th>
                    </tr>
                </thead>
                
                <tbody>
                    {
                        BatchChildDetail && BatchChildDetail.map((BN, index) => {
                            return (
                                <tr key={index}>
                                    <td onClick={() => ScListF(BN.batchid,BN.batchdetailid)} style={{cursor:'pointer'}}> {++index} </td>
                                    {/* <td onClick={() => ScListF(BN.batchid,BN.batchdetailid)} style={{cursor:'pointer'}}> {BN && BN.item_code}</td>
                                    <td>{BN.item_code}</td>
                                    <td>{BN.item_name}</td>
                                    <td>{BN.batchno}</td>
                                    <td>{BN.lotno}</td> */}
                                    <td>{BN.inqty}</td>
                                    <td>{`${new Date(BN.createdon).getFullYear()+'-'+ new Date(new Date(BN.createdon).setMonth(new Date(BN.createdon).getMonth()+1)).getMonth() + '-' +  new Date(BN.createdon).getDate() }`}</td>
                                    <td>{BN.mrp}</td>
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


export default BatchChildDetailModal;





