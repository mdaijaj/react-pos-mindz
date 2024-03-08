import React, { useCallback, useEffect, useState,useRef } from 'react'
import {Button,Modal,ToggleButtonTable,Table,ToggleButton,Form} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { pink,green } from '@material-ui/core/colors';
import db from '../../../datasync/dbs';
import { Group } from '@material-ui/icons';


const BatchListModal = ({onClickOk= () => {}, bnoi = [] ,didBatchListSubmit = () => {},...props}) => {

  let outQuantity = useRef([]);
  // console.log(bnoi,'bnoibnoi')
  // console.log(typeof bnoi,'bnoibnoi')
    // outQuantity.current = [0,0,0,0].map(
    //   (ref, index) =>   outQuantity.current[index] = React.createref()
    // )

    // const handleCopyUsername = (e, index) => {
    //   outQuantity.current[index].current.select();
    // };
  const checkQty  = (e,stock) => {
      if(Number(e.target.value) > Number(stock) ){
        // e.target.nextSibling.innerHTML = "Stock is not available";
        alert("This batch stock is not available.");
        e.target.value = ""
      }
      //  else {
      //   e.target.nextSibling.innerHTML = "";
      // }
  }


  const handleSubmit = (checkedArray) => {
    // e.preventDefault();
    let allOutQty = document.querySelectorAll('.outQty');
    let totalOutQty = 0;
    Array.from(allOutQty).map(OQ => {
      if(OQ.value){
        totalOutQty += Number(OQ.value);
      }
    })

    
    // alert(outQuantity.current.value)
    // onClickOk(outQuantity.current.value);
    onClickOk(totalOutQty)
    didBatchListSubmit(true);
    return props.onHide(false);
  };

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
                Batch Number List Detail
            </Modal.Title>
            
        </Modal.Header>

        <Modal.Body>

        <h5 style={{textAlign: "center"}}>Batch Popup</h5>
        
              <Table striped bordered hover>
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Batch No.</th>
                      <th>Lot No.</th>
                      <th>Stock</th>
                      <th>Qty Out</th>
                      <th>Batch Date</th>
                      <th>Mfg Date</th>
                      <th>Exp. Date</th>
                      <th>MRP</th>
                  </tr>
              </thead>
              <tbody>
                
                 
                  {
                    // onClick={() => SnListF(BN && BN.batch_id)
                  (bnoi.length !== 0) ? (
                    bnoi && bnoi.map((BN, index) => {
                          return (
                              <tr key={index}>
                                  <td>{++index}</td>
                                  <td>{BN.batchno}</td>
                                  <td>{BN.lotno}</td>
                                  <td>{BN.qty_in}</td>
                                  <td>
                                      <Form.Control 
                                        type="number"
                                        aria-describedby="passwordHelpBlock"
                                        id="myInput" 
                                        placeholder='Qty Out.'
                                        className="outQty"
                                        onChange={(e) => checkQty(e,BN.qty_in)}
                                        // ref={outQuantity.current[index]} 
                                        // value={index}
                                      />
                                      <span  className='sn' style={{ color: "red", fontSize: "12px" }}></span>

                                      
                                  </td>
                                  <td>{BN.batch_date}</td>
                                  <td>{BN.manufacturingdate}</td>
                                  <td>{BN.expirydate}</td>
                                  <td>{BN.mrp}</td>
                              </tr>
                          )
                      })
                    ) :
                    (
                      <tr>
                          <td colSpan={9} className="text-center">No batch is avaiable.</td>
                      </tr>
                    )
                     
                  }
              </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
             <Button variant="secondary" className="btn btn-success" onClick={() => handleSubmit()} >OK</Button>
            <Button  onClick={props.onHide}>Close</Button>
        </Modal.Footer>
     </Modal>
     </>
  )
}

export default BatchListModal;





