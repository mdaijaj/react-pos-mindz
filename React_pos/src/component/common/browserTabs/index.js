import './browser.scss'; 
const BrowserTabs =(props)=>{
   console.log("props",props);
     const tabLink = props.navArray && props.navArray.map((item,index)=>{
       return (
         <li key={index} className={index === 0 ? "active":""} onClick={index === 0 ? ()=> {return false}:()=>props.tabFunction(item)}>{index === 0 ? <><span>{item.menuname}</span><button className="closeTab" onClick={()=>props.tabFunction(item,'true')}></button></>:<span>{item.menuname}</span>}</li>
       )
     })
    return(  
  <div className="BrowserTabs">
    <ul>
      {tabLink}
    </ul> 
  </div>
        
    )
}

export default BrowserTabs;