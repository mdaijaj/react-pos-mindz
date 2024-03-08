import React, { useEffect, useState, useRef } from 'react'
import {Button,Form,Modal,Row,Col} from 'react-bootstrap';
import { getBatchOrSerialNumber } from '../../common/commonFunction';

function BatchModal({onClickOk = () => {},ItemDetail={},onChangedInvoiceQuantity=0,didBatchSubmit,parentExists,parent,batchMRP, ...props}) {
  
  if(ItemDetail === null || ItemDetail == undefined ){
      var item_name = '';
      var item_code = '';   
      var item_id = '';   
  } else {
      var item_name = (ItemDetail.ItemName != '')?ItemDetail.ItemName:'';
      var item_code = (ItemDetail.ItemCode != '')?ItemDetail.ItemCode:'';
      var item_id = (ItemDetail.ItemId != '')?ItemDetail.ItemId:'';
  }   


  // useEffect( async () => {
  //   console.log(l,'cccccccccccccccccccccccc');
  // },[])
  

  // const [defaultBatchNumber,setDefaultBatchNumber] = useState('');
  const [defaultLotNumber,setDefaultLotNumber] = useState('');
  // const [batchError,setBatchError] = useState(false);
  
  
  // const lotRef = useRef(null);
  // lotRef.current.value = defaultLotNumber;
  
  // console.log(lotRef,'hellowwwwwwwwwwwww')
  
  const [formData,setFormData] = useState({
    batch_id: '',
    item_name: '',
    item_code: '',
    batch_number:'',
    batch_date:'',
    lot_no:'',
    qty_in:'',
    mfg_date:'',
    expiry_date:'',
    mrp:''
  });
  
  const onInputChange =  e => {
    var nameV = e.target.name;
    var valueV = e.target.value;

    if((nameV == 'batch_number') && (valueV != '' )){
      setFormData({...formData, [nameV]:valueV });
      // alert('bbbb');
      console.log(formData,'formData in BatchModal')
    } else if((nameV == 'batch_date') && (valueV != '' )){
       setFormData({...formData, [nameV]:valueV});
    } else if((nameV == 'mfg_date') && (valueV != '' )){
       setFormData({...formData, [nameV]:valueV});
    } else if((nameV == 'expiry_date') && (valueV != '' )){
       setFormData({...formData, [nameV]:valueV});
    } 
    if(parentExists){
        if ((nameV == 'qty_in') && (valueV != '' )){
         setFormData({...formData, [nameV]:valueV});
      }
    }
  }

  // useEffect(() => {
  //   // const number = '1';
  //   // setDefaultBatchNumber(item_code + number.padStart(5, '0'))
  //   // setDefaultLotNumber('LOT-'+item_code + number.padStart(5, '0'))
  //   // var ln = 'LOT-'+item_code + number.padStart(5, '0');
  //   setFormData(formData);
  // },[]);
  
  



  // setBatchError(true)
  const batchOkClicked =  async () => {
     if(!parentExists){
      var bnl = await getBatchOrSerialNumber();
      var found_bnli = bnl.batchnumber.findIndex(bnli => bnli.batchno == formData.batch_number)
     } else {
        if(formData?.qty_in == undefined || formData?.qty_in == '' ){
          var qty = true;
        }
        var found_bnli = 0;
      } 
      if(found_bnli > 0){
        alert('Batch number already exists.')
      } else if(qty){
        alert('In Quantity is required.')  
      }  else {
        onClickOk(formData);
        didBatchSubmit(true);
        return props.onHide(false);
      }
    
  }

  

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
                Batch Number 
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>

        <h5 style={{textAlign: "center"}}>Item Name : {item_name}</h5>

        <Form>
            
                
              <Row>
                    <Col xs={12} md={2}>
                      {
                        parentExists ? (
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Batch Number <span style={{color:"red", fontSize:"20px"}}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the Batch Number"
                                autoFocus
                                disabled={true}
                                defaultValue={parent.data_batchno}
                                name="batch_number"
                                required
                            />  
                         <span style={{color:"red", fontSize:"12px"}}></span>
                        </Form.Group>
                        ) : (
                          <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Batch Number <span style={{color:"red", fontSize:"20px"}}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the Batch Number"
                                autoFocus
                                name="batch_number"
                                required
                                onChange={onInputChange}
                            />  
                            <span style={{color:"red", fontSize:"12px"}}></span>
                            </Form.Group>
                        )
                      } 
                    </Col>
                    
                    <Col xs={12} md={2}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Lot Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Lot No."
                            disabled={parentExists ? true : false}
                            autoFocus
                            name="lot_no"
                            value={parentExists ? parent.data_lotno : 'LOT-'+ item_code + item_id?.toString().padStart(5, '0')}
                            onChange={onInputChange}
                           />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={1}>
                      {
                        parentExists ? (
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Qty IN</Form.Label>
                          <Form.Control 
                              type="text" 
                              placeholder="Qty IN" 
                              autoFocus
                              name="qty_in"
                              onChange={onInputChange}
                          />
                        </Form.Group>
                        ) : (
                          <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Qty IN</Form.Label>
                          <Form.Control 
                              type="text" 
                              placeholder="Qty IN" 
                              disabled={true}
                              autoFocus
                              name="qty_in"
                              value={onChangedInvoiceQuantity}
                              onChange={onInputChange}
                          />
                        </Form.Group>
                        )
                      } 
                    </Col>

                    <Col xs={12} md={2}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Batch Date</Form.Label>
                          <Form.Control 
                                type="date" 
                                placeholder="Batch Date"
                                autoFocus
                                value={parentExists ? parent.data_manufacturingdate : ''}
                                name="batch_date"
                                onChange={onInputChange}
                                />
                        </Form.Group>
                        </Col>


                        <Col xs={12} md={2}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Manufacturing Date</Form.Label>
                          <Form.Control 
                                type="date" 
                                placeholder="Mfg Date"
                                autoFocus
                                value={parentExists ? parent.data_manufacturingdate : ''}
                                name="mfg_date"
                                onChange={onInputChange}   
                                />
                        </Form.Group>
                        </Col>

                        <Col xs={12} md={2}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control 
                                  type="date" 
                                  placeholder="Expiry Date"
                                  autoFocus
                                  value={parentExists ? parent.data_expirydate : ''}
                                  name="expiry_date"
                                  onChange={onInputChange}
                                  
                                  />
                        </Form.Group>
                        </Col>

                        <Col xs={12} md={1}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>MRP</Form.Label>
                          <Form.Control 
                                type="number" 
                                placeholder="MRP"
                                autoFocus
                                name="mrp"
                                min={0}
                                defaultValue={batchMRP}
                            />
                        </Form.Group>
                        </Col>
                
              </Row>
          </Form>

        </Modal.Body> 
        <Modal.Footer>
            <Button variant="secondary" className="btn btn-success" onClick={batchOkClicked} >OK</Button>
            <Button  onClick={props.onHide}>Close</Button>
        </Modal.Footer>
     </Modal>
     </>
  )
}


export default BatchModal;





