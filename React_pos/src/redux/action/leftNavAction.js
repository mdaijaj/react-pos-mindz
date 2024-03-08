import * as constant from "../constant/navConstant";
import store from "../../store";
// 

const navAction = (navText) => {
  store.dispatch({ type: constant.NAV_UPDATE, payload: navText });
};
const navLogout = (navText) => {
  store.dispatch({ type: constant.RESET });
};
export { navAction, navLogout };
