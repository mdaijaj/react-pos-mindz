import * as constant from "../constant/startConstant";
import store from "../../store";

const testAction = () => {
  store.dispatch({type:constant.TEST, payload:true})
}
export default testAction;