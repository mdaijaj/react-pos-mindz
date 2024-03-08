import * as constant from "../constant/invoiceConstant";
import store from "../../store";
import { GET, POST } from '../common/requestStatus';

const dispatchAction = (dispatch,actionType,data,message) =>{
    dispatch({type:actionType,payload:data,message:message})
}

 export const getProductList =async  () => {
   try {
    console.log("action to get 555555555555 ")
         const url = `api/ItemMaster/List/0`
        const data = await GET(url);
     if (data && data.result && data.result.Result) { 
           return data.result.Result
          //dispatchAction(store.dispatch, constant.GET_ALL_PRODUCT_DATA_SUCCESS, {productList:data.result.Result}, null);
        }
     else {
       return []
          //dispatchAction(store.dispatch, constant.GET_ALL_PRODUCT_DATA_FAILED, data.result, 'Fail');
        }
    }
   catch (error) {
     return []
         //dispatchAction(store.dispatch, constant.GET_ALL_PRODUCT_DATA_FAILED,'Something Went Wrong','fail' );
    }
}


export const ProductDetailList =async  () => {
  try {   
    const PRODUCTS = [{id:1, productname: 'A', productCode: '001', quantity: 1, mrp: 200, saleprice: 23, autodiscount: 2, manualdiscount: 2, amount: 200, saleperson: 'ravi' },
  {id:2, productname: 'B', productCode: '002', quantity: 1, mrp: 200, saleprice: 23, autodiscount: 2, manualdiscount: 2, amount: 200, saleperson: 'ravi' },
  {id:3, productname: 'C', productCode: '003', quantity: 1, mrp: 200, saleprice: 23, autodiscount: 2, manualdiscount: 2, amount: 200, saleperson: 'ravi' },
  {id:4,productname:'D',productCode:'004',quantity:1,mrp:200,saleprice:23,autodiscount:2,manualdiscount:2,amount:200,saleperson:'ravi'}
    ]
return PRODUCTS
    console.log("action to get product detai;l")
       //dispatchAction(store.dispatch, constant.GET_ALL_PRODUCT_DATA_SUCCESS, {finalProduct:PRODUCTS}, null);
    
 }
  catch (error) {
    return []
     // dispatchAction(store.dispatch, constant.GET_ALL_PRODUCT_DATA_FAILED,'Something Went Wrong','fail' );
 }
} 


export const updateMyData =async  (index,id,products) => {
  try {            
       dispatchAction(store.dispatch, constant.GET_PRODUCT_DATA,products, null);
    
 }
 catch(error){
      dispatchAction(store.dispatch, constant.GET_ALL_PRODUCT_DATA_FAILED,'Something Went Wrong','fail' );
 }
}



