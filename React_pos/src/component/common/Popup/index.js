
import './../../common/Popup/Popup.scss'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import CommonIcons from "../commonFormAction";
import {useState} from "react"
import axios from "axios"

const Popup =(props)=>{

    
    // To-maintain icons state
    let [val, setVal] = useState('')

    // To change icons state
    const change_state = arg => {
       // console.log('value in change state', arg) //Dev

        if (arg == "add") {
        setMethod("put")
        return setVal(arg)
        }

        if (arg == "edit") {
        setMethod("post");
        return setVal(arg)
        }

        if (arg == "view") {
        return setVal(arg)
        }

        if (arg == "save") {
        return setVal(arg)
        }

        if (arg == "refresh") {
        return setVal(arg)
        }
    }

    // To pass the props to CommonIcons
    const para = { val, change_state }

    // ##
    // Default input fields data
    let demo_data = { UnitSymbol: '', UnitName: '', DecimalDigit: '' }

    // ## states
    // To-maintain icons state
    const [state, setstate] = useState(demo_state)

    // For defining Method for API(s)
    const [method, setMethod] = useState('')

    // To store data for options in autocomplete
    let [option_data, setOptions] = useState([])

    // To-render-autocomplete instead of textfield
    let [updateAuto, setUpdateAuto] = useState(false)

    // For storing input fields data
    let [data, setData] = useState(demo_data)

    // To inform user that all input fields r required
    let [alert, setAlert] = useState(false)

    // To catch input fields data and store in (data - state)
    const changeData = e => {
        alert && setAlert(false)
        let { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    // Catch data from autocomplete
    const store_data = (e, value) => {

        if(value == '')
        return

        let temp_data = option_data.filter(val=>{
        if(val.UnitSymbol == value)
        return val
        })

        if(temp_data.length == 0)
        return

        let {UnitSymbol, UnitName, DecimalDigit, Id} = temp_data[0]
        setData({ UnitSymbol, UnitName, DecimalDigit, Id })
        setUpdateAuto(false)
    }

    // To send data to database for update and create
    const sendData = () => {

        // ##Dev
      //  console.log('method n data in sendData', method, data)
        
        const token = localStorage.getItem('token')

        if (!token)
        return props.refresh()

        const config = { headers: { token } }
        let api = '/api/UnitMaster'

        for(let key in data){
        if(data[key] == '')
        return setAlert(true)
        }

        axios[method](api, data, config)
        .then(res => {
        setData(demo_data)
        
        // ##Dev
       // console.log('res from unit master', res)

        })
        .catch(e => {
        setData(demo_data)

        // #Dev
       // console.log('error from unit master', e.response.data.statuscode, e.response.data.message)

        if(e.response.data.statuscode == 400 && 
            (
                e.response.data.message == "Authentication failed due to expired token." || 
                e.response.data.message == "Someone has signin at different system. "
            )
            ){
            localStorage.removeItem('token')
            props.refresh()
        }

        })
    }

    // to pass props to CommonForm
    const p = {data, alert, para, updateAuto, changeData, store_data, option_data}

    
    return(

        <>
        <div className="Popup">
            <div className="PopupBox">
                <CommonIcons {...para} />
                <div className="closeIcon">
                <IconButton> <Fab size="small" style={{backgroundColor:'#1DD46B', color:'#fff'}}> <CloseIcon/> </Fab> </IconButton>
                </div>
            <div className="row">
                <div className="col w100">
            <label htmlFor="namedInput">Short Name *</label>
            <input type="text"/> 
            
            <label htmlFor="namedInput">Formal Name *</label>
            <input type="text"/> 
            
            <label htmlFor="namedInput">No of Decimal Place *</label>
            <input type="text"/> 
            </div>
            </div>
            </div>
        </div>
        </>
    )
}
export default Popup;