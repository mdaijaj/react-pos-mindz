import * as constant  from '../constant/invoiceConstant';
import fnGetFinalProduct from '../common/utils'
const initialState ={
    productList: [],
    failedMessage: '',
    finalProduct:[]
}
const invoiceReducer =(state, action)=>{
if(state === undefined){
    return initialState;
}
switch (action.type){
    case constant.GET_ALL_PRODUCT_DATA_SUCCESS:
        return{
            ...state,...action.payload         
        }
        case constant.GET_ALL_PRODUCT_DATA_FAILED:
            return{
                ...state,failedMessage:action.payload         
        }
        case constant.GET_PRODUCT_DATA:
            return{
                ...state,
                finalProduct: fnGetFinalProduct(state.finalProduct,action.payload)
            }
        default:
            return state;
    
}
}
export default invoiceReducer;