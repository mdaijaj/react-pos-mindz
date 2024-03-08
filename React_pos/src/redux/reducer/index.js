import {combineReducers} from 'redux'
import testReducer from '../reducer/testReducer'
import invoiceReducer from '../reducer/invoiceReducer'
import navUpdateReducer from '../reducer/leftNavReducer';

const rootReducer =combineReducers({
  testReducer,
  navUpdateReducer,
  invoiceReducer
})
export default rootReducer;
  