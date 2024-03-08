import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { getBatchOrSerialNumber, matchSerialNumber } from '../../common/commonFunction';

const SerialModal = ({ onChangedInvoiceQuantity, onClickOk, ItemDetail, ...props }) => {


  // var item_name = '';
  const [item_name, setItemName] = useState();
  const [item_id, setItemId] = useState();

  useEffect(() => {
    if (ItemDetail === null || ItemDetail == undefined) {
      // var item_code = '';
    } else {
      var item_name = (ItemDetail.ItemName != '') ? ItemDetail.ItemName : ''
      setItemName(item_name)
      var item_id = (ItemDetail.ItemId != '') ? ItemDetail.ItemId : '';
      setItemId(item_id)
      // var item_code = (ItemDetail.ItemCode != '') ? ItemDetail.ItemCode : '';
    }

  }, [])

  const inputFields = [];
  // const serialRow =
  // {
  //   id: uuidv4(),
  //   item_id: '',
  //   serial_number: '',
  //   auto_generated_no: '',
  //   warrenty_date: null,
  //   expiry_date: null,
  //   mannual_fields: '',
  // };

  for (let j = 1; j <= onChangedInvoiceQuantity; j++) {
    //  setInputFields([...inputFields, { id: uuidv4(),  firstName: '', lastName: '' }])
    inputFields.push({
      id: uuidv4() + j,
      item_id: item_id,
      serial_number: '',
      auto_generated_no: new Date().getTime() + (j).toString().padStart(5, '0'),
      warrenty_date: null,
      expiry_date: null,
      mannual_fields: '',
    });
  }

  const [error, setError] = useState(false)

  const handleChangeInput = async (id, event) => {
    const newInputFields = inputFields.map(i => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    // var bnl = await getBatchOrSerialNumber();
    // // await bnl.serialnumber.map(bnlObj => {
    // //   var found_bnli = await bnlObj.findIndex(bnli => bnli.serial_number == inputFields.serial_number)
    // // })
    // let x = inputFields.filter((a) => a.serial_number === event.target.value)
    // if (x.length > 0) {
    //   event.target.nextSibling.innerHTML = 'Serial number required';
    // } else {
    //   event.target.nextSibling.innerHTML = '';
    // }
    // if (found_bnli > 0) {
    //   event.target.nextSibling.innerHTML = 'Serial number required';
    // } else {
    //   event.target.nextSibling.innerHTML = '';
    //   const newInputFields = inputFields.map(i => {
    //     if (id === i.id) {
    //       i[event.target.name] = event.target.value
    //     }
    //     return i;
    //   })
    // }
  }

  // const [serialError, setSerialError] = useState(false);



  // var serialError = [];
  // const [serialError,setSerialError] = useState(false);
  
  const matchSerialN = async (e) => {
    e.preventDefault();
    if (e.target.value.length) {
      let x = inputFields.filter((a) => a.serial_number === e.target.value)
      var bnl = await matchSerialNumber(e.target.value);
      if (x.length > 1 || bnl) {
        e.target.nextSibling.innerHTML = 'Already exists';
        // serialError.push(1)
        // alert(serialError)
        // setSerialError(true)
      } else {
        e.target.nextSibling.innerHTML = '';
        // alert(serialError)
        // serialError.splice(0,1)
        // setSerialError(false)
      }
    }
    // console.log(serialError)
  }

  
  // console.log(pp);
  
  // console.log(serialError.length,"serial error")
  const handleSubmit = (e) => {
    e.preventDefault();
    var eCheck = false;
    var pp = document.querySelectorAll('.sn');
    Array.from(pp).map(nopp => {
      if(nopp.innerHTML == 'Already exists'){
        eCheck = true;
      }
    })
    if(eCheck){
      alert('Please enter unique serial number.')
    } else {
      onClickOk(inputFields);
      return props.onHide(false);
    }
    
    
  };


  // const getSerialDataCallback = (currentRowData) => {
  //   setSerialData({...serialData,currentRowData});
  // }
  const SerialOkClicked = () => {
    return props.onHide(false);
  }


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
          <Modal.Title id="contained-modal-title-hcenter" style={{ textAlign: 'center' }}>
            Serial Number
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <h5 style={{ textAlign: "center" }}>Item Name : {item_name} </h5>

          <Form onSubmit={handleSubmit}>
            {
              // Array.apply(null, { length: onChangedInvoiceQuantity }).map((e, i) => (
              // serialForm.map((serialRow,index) => (
              inputFields.map((inputField, counter) => (

                <Row key={inputField.id}>
                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                      <Form.Label>Serial Number<span style={{ color: "red", fontSize: "20px" }}>*</span></Form.Label>
                      <Form.Control
                        
                        required
                        type="text"
                        placeholder="Enter the Serial Number"
                        // autoFocus
                        name="serial_number"
                        dacounter-index={inputField.id}
                        onBlur={(e) => matchSerialN(e)}
                        // value={item_code + (counter+1).toString().padStart(5, '0')}
                        onChange={event => handleChangeInput(inputField.id, event)}
                      />
                      <span  className='sn' style={{ color: "red", fontSize: "12px" }}></span>
                      {/* <Form.Control.Feedback>Looks good!</Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={3}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Auto Generated No.</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Auto Generated No."
                        // autoFocus
                        disabled={true}
                        value={inputField.auto_generated_no}
                        name="auto_generated_no"
                        onChange={event => handleChangeInput(inputField.id, event)}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={2}>
                    <Form.Group className="mb-3" >
                      <Form.Label>Warrenty Date</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Warrenty Date"
                        // autoFocus
                        name="warrenty_date"
                        onChange={event => handleChangeInput(inputField.id, event)}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={2}>
                    <Form.Group className="mb-3" >
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Expiry Date"
                        // autoFocus
                        name="expiry_date"
                        onChange={event => handleChangeInput(inputField.id, event)}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={2}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Mannual Fields</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Mannual Fields"
                        // autoFocus
                        name="mannual_fields"
                        onChange={event => handleChangeInput(inputField.id, event)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              ))
            }
            <Modal.Footer>
              <Button variant="secondary" className="btn btn-success" type="submit" >OK</Button>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Form>

        </Modal.Body>
      </Modal>
    </>
  )
}


export default SerialModal;




