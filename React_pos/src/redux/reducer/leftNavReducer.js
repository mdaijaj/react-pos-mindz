import * as constant from "../constant/navConstant";

// 
const initialState = {
  navArray: [],
};
const navUpdateReducer = (state, action) => {
  if (state === undefined) {
    return initialState;
  }
  switch (action.type) {
    case constant.NAV_UPDATE:
      console.log("...state", action.payload);
      return {
        //navArray:[action.payload, ...state.navArray]
        // ...state.navArray,
        navArray: action.payload,
      };
    case constant.RESET: {
      return {
        navArray: [],
      };
    }

    default:
      return state;
  }
};
export default navUpdateReducer;
