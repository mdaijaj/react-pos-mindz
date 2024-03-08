import "./leftNav.scss";
import React, { useState, useEffect } from "react";
import LogoImg from "../../../images/logo.png";
import db from "../../../datasync/dbs";
import axios from "axios";
// import {syncUserMenuMaster} from "../../../datasync/masterdata";

const LeftNav = (props) => {
  const [expanded, setExpanded] = useState();
  const [Chexpanded, setChexpanded] = useState();
  const [getMenu, setMenuList] = useState([]);
  const handleChange = (panel) => {
    setExpanded(expanded !== panel ? panel : "");
  };
  const handleChangeSub = (panel) => {
    setChexpanded(Chexpanded !== panel ? panel : "");
  };
  const getuserMenu = async () => {
    let id = parseInt(localStorage.getItem("UserId"));
    let um = await db.UserMenuMaster.where("userId").equals(id).toArray();
    if (um.length === 0) {
      const config = { headers: { token: localStorage.getItem("token") } };
      let api = "/api/UserMenuMaster/List";
      const datadateObj = { alteredon: "1970-01-01 00:00:01", pageindexno: 0 };
      axios.post(api, datadateObj, config).then(async (res) => {
        console.log(res,"res menu")
        if (res.data && res.data.Result) {
          const data = res.data.Result.map((item) => {
            let datain = {
              menuid: item.menuid,
              menuname: item.menuname,
              formid: item.formid,
              formname: item.formname,
              formtype: item.formtype,
              haschild: item.haschild,
              parentid: item.parentid,
              seqno: item.seqno,
              formval: item.formval,
              bshow: item.bshow,
              userId: parseInt(localStorage.getItem("UserId")),
            };
            return datain;
          });
          // console.log(data,"menu data")
          menuList(data);
          await db.UserMenuMaster.bulkAdd(data);
        }
      });
    } else {
      menuList(um);
    }
  };
  const menuList = async (formMlist) => {
    const userId = localStorage.getItem("UserId");
    const employeeRolesIds = await db.userMaster
      .where("Id")
      .equals(parseInt(userId))
      .first();
    if (employeeRolesIds) {
      const roleIds = employeeRolesIds.Branch[0].BranchRole[0].RoleId;
      const rollformlist = await db.RoleDetailMaster.where("RoleId")
        .equals(parseInt(roleIds))
        .toArray();
      if (rollformlist.length !== 0) {
        if (formMlist) {
          let list = formMlist.map((a) => {
            if (a.formid !== 0) {
              let x = rollformlist.find((b) => b.FormId === a.formid);
              return {
                ...a,
                AllowAmendmend: x.AllowAmendmend,
                AllowAttachment: x.AllowAttachment,
                AllowAuthorize: x.AllowAuthorize,
                AllowCancelTransaction: x.AllowCancelTransaction,
                AllowCreateStructure: x.AllowCreateStructure,
                AllowEdit: x.AllowEdit,
                AllowExportToExcel: x.AllowExportToExcel,
                AllowImport: x.AllowImport,
                AllowNew: x.AllowNew,
                AllowPrint: x.AllowPrint,
                AllowSendToTally: x.AllowSendToTally,
                AllowView: x.AllowView,
                AllowViewAttachment: x.AllowViewAttachment,
                append: false,
                hide: true,
              };
            } else {
              return a;
            }
          });
          const navArr = list.filter((a) => a.formid !== 0);
          const flArr = navArr.filter((a) => a.menuname !== "-");
          const prArr = list.filter((a) => a.formid === 0 && a.parentid === 0);
          const chprArr = list.filter((a) => a.formid === 0 && a.parentid !== 0);
          const arr = [...flArr,...chprArr]
          const newArr = prArr.map((a) => {
            let submenu = arr.filter((b) => b.parentid === a.menuid);
            const subsubmenue = submenu.map((s)=>{
              const subchild = arr.filter((f)=> f.parentid === s.menuid)
              return {...s,subchild:subchild}
            })
           // const subsubmenue = submenu.filter((f)=> f.parentid === a.menuid)
            return { name: a.menuname, subMenu: subsubmenue };
          });
          props.getArr(newArr);
          setMenuList(newArr);
          props.lodding(false);
        }
      }
    }
  };
//  const submenuChild=(a)=>{
//   let submenu = arr.filter((b) => b.parentid === a.menuid);
//  }
  useEffect(() => {
    const fun = async () => {
      let t = await db.userMaster.toArray();
      let r = await db.RoleDetailMaster.toArray();
      if (t.length > 0 && r.length > 0) {
        getuserMenu();
        console.log("yes");
      } else {
        const interval = setTimeout(() => {
          console.log("no");
          fun();
        }, 2000);
        return () => clearTimeout(interval);
      }
    };
    fun();
  }, []);

  const menu =
    getMenu &&
    getMenu.map((link, index) => {
      return (
        <>
          {link.subMenu.length > 0 ? (
            <li
              key={index}
              className={expanded === `panel_${index}` ? "active" : ""}
            >
              <div
                key={`div_${index}`}
                id={`panelHead_${index}`}
                onClick={() => handleChange(`panel_${index}`)}
              >
                <i
                  key={`i_${index}`}
                  className={
                    expanded === `panel_${index}`
                      ? `i_${index} active`
                      : `i_${index}`
                  }
                ></i>
                {link.name}
              </div>
              {link.subMenu.length > 0 ? (
                <ul key={`ul_${index}`}>
                  {link.subMenu.map((val, i) => (
                    <li key={`lichild_${i}`} className={Chexpanded === `lichild_${i}` ? "active" : ""}>
                      <span
                        key={`span_${i}`}
                        class={val.subchild.length > 0 ? "hasSubmenu":""}
                        // className={
                        //   props.navArray && props.navArray[0] === val.menuname
                        //     ? "active"
                        //     : "asas"
                        // }
                        onClick={() =>val.subchild.length > 0 ? handleChangeSub(`lichild_${i}`):props.navFunction(val)}
                        // onClick={() => props.navFunction(val.menuname)}
                      >
                        {val.menuname}
                      </span>
                      {val.subchild.length > 0 ? <ul>
                        {val.subchild.map((chiVal,ind)=>
                          <li>
                            <span>{chiVal.menuname}</span>
                          </li>
                        )}
                      </ul>:""}
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </li>
          ) : (
            ""
          )}
        </>
      );
    });

  return (
    <>
      <div className="leftNavWrapper">
        <div className="logo">
          <img src={LogoImg} alt="" />
        </div>
        <div className="leftNav">
          <div className="navSection">
            <ul>{menu}</ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default LeftNav;
