import * as constant  from '../constant/startConstant';

const initialState ={
    test:'',
    text:'asdfas'
}
const testReducer =(state, action)=>{
if(state === undefined){
    return initialState;
}
switch (action.type){
    case constant.TEST:
        console.log(action.type, "ddddddddddd")
        return{
            ...state,
          test:true,
          text:'abc'
        }
        default:
            return state;
    
}
}
export default testReducer;