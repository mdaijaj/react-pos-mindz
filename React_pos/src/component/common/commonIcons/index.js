import React, { useState, memo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

const style = {outline: 'none', margin:'0', padding:'10px'}

const Cancel = prop=>
<IconButton style={style} onClick={prop.handleClick}>
        <CancelIcon color="secondary" fontSize='large' />
</IconButton>

const CommonIcons = props => {

   // console.log(props,"props") //Dev

    const [state, setstate] = useState(false)
    
    if(state)
    return <Cancel handleClick={()=>setstate(!state)} />

    if(props.def)
    return <>
        <IconButton style={style} onClick={()=>props.change_state('view')} >
            <VisibilityIcon color="primary"/>
        </IconButton>

        <IconButton disabled style={style} >
            <RefreshIcon/>
        </IconButton>

        <IconButton style={style} onClick={()=>props.change_state('edit')} >
            <EditIcon color="primary"/>
        </IconButton>

        <IconButton disabled style={style} >
            <SaveIcon/>
        </IconButton>

        <IconButton style={style} onClick={()=>props.change_state('plus')}>
            <AddIcon color="primary"/>
        </IconButton>
        
        <Cancel handleClick={()=>setstate(!state)} />
    </>

    if(props.plus_edit)
    return <>
        <IconButton disabled style={style} >
            <VisibilityIcon/>
        </IconButton>

        <IconButton style={style} onClick={()=>props.change_state('def')} >
            <RefreshIcon color="primary"/>
        </IconButton>

        <IconButton disabled style={style} >
            <EditIcon/>
        </IconButton>

        <IconButton style={style} onClick={()=>props.change_state('save')} >
            <SaveIcon color="primary"/>
        </IconButton>

        <IconButton disabled style={style} >
            <AddIcon/>
        </IconButton>

        <Cancel handleClick={()=>setstate(!state)} />
    </>

    if(props.view)
    return <>
        <IconButton disabled style={style} >
            <VisibilityIcon/>
        </IconButton>

        <IconButton style={style} onClick={()=>props.change_state('def')} >
            <RefreshIcon color="primary"/>
        </IconButton>

        <IconButton disabled style={style} >
            <EditIcon/>
        </IconButton>

        <IconButton disabled style={style} >
            <SaveIcon/>
        </IconButton>

        <IconButton disabled style={style} >
            <AddIcon/>
        </IconButton>

        <Cancel handleClick={()=>setstate(!state)} />
    </>
}

export default memo(CommonIcons)