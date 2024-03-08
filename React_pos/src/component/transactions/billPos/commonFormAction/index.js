import "./commonFormAction.scss";
import React, { useState, useEffect, memo } from "react";
import { ReactComponent as Eye } from "../../../../images/icon/eye-fill.svg";
import { ReactComponent as Edit } from "../../../../images/icon/edit-box-fill.svg";
import { ReactComponent as Add } from "../../../../images/icon/add-box-fill.svg";
import { ReactComponent as Refresh } from "../../../../images/icon/restart-line.svg";
import { ReactComponent as Save } from "../../../../images/icon/save-fill.svg";
import { ReactComponent as Print } from "../../../../images/icon/print.svg";

// Default icons state
// console.log()
const default_state = {
  view: true,
  edit: true,
  add: true,
  refresh: false,
  save: false,
  print: true,
};

const CommonFormAction = ({ val, change_state, disabledAction }) => {
  const actionDisable = {
    view: disabledAction && disabledAction.view ? disabledAction.view : "",
    add: disabledAction && disabledAction.add ? disabledAction.add : "",
    edit: disabledAction && disabledAction.edit ? disabledAction.edit : "",
    refresh:
      disabledAction && disabledAction.refresh ? disabledAction.refresh : "",
    save: disabledAction && disabledAction.save ? disabledAction.save : "",
    print: disabledAction && disabledAction.print ? disabledAction.print : "",
  };
  const [state, setState] = useState(true);
  const [Icon_State, setIcon_State] = useState(default_state);
  const [disableLink, setDisableLink] = useState(actionDisable);
  useEffect(() => {
    let value =
      val === "view"
        ? {
            ...default_state,
            view: false,
            refresh: true,
            edit: false,
            add: false,
            print: true,
          }
        : val === "edit"
        ? {
            add: false,
            save: true,
            refresh: true,
            view: false,
            edit: false,
            print: true,
          }
        : val === "refresh"
        ? default_state
        : val === "add"
        ? {
            add: false,
            save: true,
            refresh: true,
            view: false,
            edit: false,
            print: false,
          }
        : val === "save"
        ? default_state
        : default_state;
    setIcon_State(value);
  }, [val]);

  return (
    <>
      <div className="commonFormAction">
        <ul className={state === true ? "active" : ""}>
          <li>
            <button
              className={
                Icon_State.view === true && disableLink.view !== "disable"
                  ? "active"
                  : "disable"
              }
              onClick={
                Icon_State.view === true && disableLink.view !== "disable"
                  ? () => change_state("view")
                  : () => {
                      return false;
                    }
              }
            >
              <Eye
                fill={
                  Icon_State.view === true && disableLink.view !== "disable"
                    ? "#ffffff"
                    : "#c7d7eb"
                }
              />
            </button>
          </li>
          <li>
            <button
              className={
                Icon_State.refresh === true && disableLink.refresh !== "disable"
                  ? "active"
                  : "disable"
              }
              onClick={
                Icon_State.refresh === true && disableLink.refresh !== "disable"
                  ? () => change_state("refresh")
                  : () => {
                      return false;
                    }
              }
            >
              <Refresh
                fill={
                  Icon_State.refresh === true &&
                  disableLink.refresh !== "disable"
                    ? "#ffffff"
                    : "#c7d7eb"
                }
              />
            </button>
          </li>
          <li>
            <button
              className={
                Icon_State.edit === true && disableLink.edit !== "disable"
                  ? "active"
                  : "disable"
              }
              onClick={
                Icon_State.edit === true && disableLink.edit !== "disable"
                  ? () => change_state("edit")
                  : () => {
                      return false;
                    }
              }
            >
              <Edit
                fill={
                  Icon_State.edit === true && disableLink.edit !== "disable"
                    ? "#ffffff"
                    : "#c7d7eb"
                }
              />
            </button>
          </li>
          <li>
            <button
              className={
                Icon_State.save === true && disableLink.save !== "disable"
                  ? "active"
                  : "disable"
              }
              onClick={
                Icon_State.save === true && disableLink.save !== "disable"
                  ? () => change_state("save")
                  : () => {
                      return false;
                    }
              }
            >
              <Save
                fill={
                  Icon_State.save === true && disableLink.save !== "disable"
                    ? "#ffffff"
                    : "#c7d7eb"
                }
              />
            </button>
          </li>
          <li>
            <button
              className={
                Icon_State.add === true && disableLink.add !== "disable"
                  ? "active"
                  : "disable"
              }
              onClick={
                Icon_State.add === true && disableLink.add !== "disable"
                  ? () => change_state("add")
                  : () => {
                      return false;
                    }
              }
            >
              <Add
                fill={
                  Icon_State.add === true && disableLink.add !== "disable"
                    ? "#ffffff"
                    : "#c7d7eb"
                }
              />
            </button>
          </li>
          <li>
            <button
              className={
                Icon_State.print === true && disableLink.print !== "disable"
                  ? "active"
                  : "disable"
              }
              onClick={
                Icon_State.print === true && disableLink.print !== "disable"
                  ? () => change_state("print")
                  : () => {
                      return false;
                    }
              }
            >
              <Print
                fill={
                  Icon_State.print === true && disableLink.print !== "disable"
                    ? "#ffffff"
                    : "#c7d7eb"
                }
              />
            </button>
          </li>
        </ul>
        <button
          className="linkCloseBtn"
          onClick={() => setState(!state)}
        ></button>
      </div>
    </>
  );
  // return(
  //     <>
  //     <div className="commonFormAction">
  //         <ul className={state === true ? "active":""}>
  //             <li>
  //                 <button className={Icon_State.view === true ? "active":"disable"} onClick={Icon_State.view === true ? () => props.change_state('view'):()=> {return false}}>
  //                     <Eye fill={Icon_State.view === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={Icon_State.refresh === true ? "active":"disable"} onClick={Icon_State.refresh === true ? () => props.change_state('refresh'):()=> {return false}}>
  //                     <Refresh fill={Icon_State.refresh === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={Icon_State.edit === true ? "active":"disable"} onClick={Icon_State.edit === true ? () => props.change_state('edit'):()=> {return false}}>
  //                     <Edit fill={Icon_State.edit === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={Icon_State.save === true ? "active":"disable"} onClick={Icon_State.save === true ? () => props.change_state('save'):()=> {return false}}>
  //                     <Save fill={Icon_State.save === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={Icon_State.add === true ? "active":"disable"} onClick={Icon_State.add === true ? () => props.change_state('add'):()=> {return false}}>
  //                     <Add fill={Icon_State.add === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //         </ul>
  //         <button className="linkCloseBtn" onClick={()=>setstate(!state)}></button>

  //     </div>
  //     </>
  // )
  // return(
  //     <>
  //     <div className="commonFormAction">
  //         <ul className={state === true ? "active":""}>
  //             <li>
  //                 <button className={props.view === true ? "active":"disable"} onClick={props.view === true ? () => props.change_state('view'):()=> {return false}}>
  //                     <Eye fill={props.view === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={props.refresh === true ? "active":"disable"} onClick={props.refresh === true ? () => props.change_state('refresh'):()=> {return false}}>
  //                     <Refresh fill={props.refresh === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={props.edit === true ? "active":"disable"} onClick={props.edit === true ? () => props.change_state('edit'):()=> {return false}}>
  //                     <Edit fill={props.edit === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={props.save === true ? "active":"disable"} onClick={props.save === true ? () => props.change_state('save'):()=> {return false}}>
  //                     <Save fill={props.save === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //             <li>
  //                 <button className={props.add === true ? "active":"disable"} onClick={props.add === true ? () => props.change_state('add'):()=> {return false}}>
  //                     <Add fill={props.add === true ? "#ffffff":"#c7d7eb"}/>
  //                 </button>
  //             </li>
  //         </ul>
  //         <button className="linkCloseBtn" onClick={()=>setstate(!state)}></button>

  //     </div>
  //     </>
  // )
};
export default memo(CommonFormAction);
