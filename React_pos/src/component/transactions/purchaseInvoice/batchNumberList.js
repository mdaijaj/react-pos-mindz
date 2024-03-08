import React from "react";
import * as RB from 'react-bootstrap';
import { l } from "../../common/commonFunction";



const BatchNumberList = ({BnList, BcListF}) => {
    
    return (
        <>
            <RB.Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Batch No.</th>
                        <th>Lot No.</th>
                        <th>In Quantity</th>
                        <th>Batch Date</th>
                        <th>Mfg Date</th>
                        <th>Exp. Date</th>
                        <th>MRP</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    (BnList && l(BnList)) ? (
                        BnList && BnList.map((BN, index) => {
                            return (
                                <tr key={index}>
                                    <td>{++index}</td>
                                    <td onClick={() => BcListF(BN.batchid)} style={{cursor:'pointer'}}> {BN && BN.item_code}</td>
                                    <td>{BN.item_name}</td>
                                    <td>{BN.batchno}</td>
                                    <td>{BN.lotno}</td>
                                    <td>{BN.qty_in}</td>
                                    <td>{BN.batch_date}</td>
                                    <td>{BN.manufacturingdate}</td>
                                    <td>{BN.expirydate}</td>
                                    <td>{BN.mrp}</td>
                                </tr>
                            )
                        })

                        ) : (
                            <tr>
                                 <td colSpan={10} className='text-center'>No data available</td>
                            </tr>           
                        )
                    }
                </tbody>
            </RB.Table>
        </>
    )
}
export default BatchNumberList;