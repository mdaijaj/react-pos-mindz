import './../AttributesBox/AttributesBox.scss';
import LoopIcon from '@material-ui/icons/Loop';
import MenuIcon from '@material-ui/icons/Menu';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Text from '../../../common/text';
const AttributesBox =props=>{

     return(
         <>
         <div className="AttributeFlex">
            <div className="topMenu">
                <h2> {props.text} </h2>
                </div>
                <div className="topMenu">
                <ul>
                    <li><small> <Text content="Click refresh attribute list" /></small> </li>
                    <li>  <IconButton> <Fab size="small" style={{backgroundColor:'#1DD46B', color:'#fff'}}> <LoopIcon /> </Fab> </IconButton> </li>

                    <li className="menuButton">   <IconButton  size="small">    <MenuIcon />  </IconButton> </li>
                </ul>
                </div>
         </div>
         </>
     )
}

export default AttributesBox;