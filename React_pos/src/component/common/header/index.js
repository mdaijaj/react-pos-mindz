/* eslint-disable jsx-a11y/anchor-is-valid */
import "./header.scss";
import MailIcon from "../../../images/icon/Mail.svg";
import PhoneIcon from "../../../images/icon/phone.svg";
import Calender from "../../../images/icon/calender.svg";
import { navLogout } from "../../../redux/action/leftNavAction";
import Search from "../../../images/icon/search.svg";
import User from "../../../images/icon/User.svg";
// import Phone from "../../images/icon/phone-alt.svg"
// import {del} from "../transactions/billPos/transactionDB";
import db from "../../../datasync/dbs";
import {
  syncItemMaster,
  syncCustomerMaster,
  syncVendorMaster,
  syncHsnMaster,
  syncItemGroup,
  syncUnitMaster,
  syncCityMaster,
  syncStateMaster,
  syncPriceMaster,
  syncStockLotMaster,
  // syncCreditNoteMaster,
  // syncDebitNoteMaster,
  // syncCreditNoteMasterDetail,
  // syncDebitNoteMasterDetail,
  syncGITMaster,
  // syncUserMenuMaster,
} from "../../../datasync/masterdata";
import {
  customerMasterPushPost,
  customerMasterPushPut,
  billPosPush,
  purchaseReturnPush,
  inwardPush,
  indentPush,
  purchaseInvoicePush,
  stockJournalPush,
  billPoswithsalesorderPush,
  // purchaseInvoiceWithGitPush,
  salesReturnPush,
  purchaseOrderPush,
  advanceAdjustmentPush,
  CreditNoteRefundPush,
} from "../../../datasync/dataPuh";
import { useEffect, useState } from "react";
// Console

const Header = ({ checkonline, navToggle }) => {
  const [internetConnectionStatus, setInternetConnectionStatus] = useState();
  const logOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navLogout();
    window.location.reload();
  };
  const itemmaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("itemMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncItemMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };
  const customerMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("customerMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncCustomerMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };
  const vendorMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("vendorMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncVendorMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };
  const HsnMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("vendorMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncHsnMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };
  const itemGroup = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("itemGroup")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncItemGroup({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };
  const unitMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("unitMaster")
        .first();
      //const count = await db.unitMaster.toArray().then().catch((err)=>console.log(err))
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncUnitMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };
  const cityMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("cityMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncCityMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };

  const stateMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("stateMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncStateMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };

  const priceMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("priceMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncPriceMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };

  const stockLotMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("stockLotMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncStockLotMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };

  const GITMaster = async () => {
    if (internetConnectionStatus) {
      const obj = await db.mastertables
        .where("tablename")
        .equals("GITMaster")
        .first();
      if (obj) {
        if (obj.pageindexno < obj.hitcount) {
          syncGITMaster({
            alteredon: "1970-01-01 00:00:01",
            pageindexno: parseInt(obj.pageindexno),
          });
        }
      }
    } else {
      //console.log(internetConnectionStatus,"dddd")
    }
  };

  useEffect(() => {
    const checkConnection = setInterval(() => {
      let ConnStatus = navigator.onLine ? true : false;
      setInternetConnectionStatus(ConnStatus);
      checkonline(ConnStatus);
    }, 3000);
    return () => clearInterval(checkConnection);
  });

  useEffect(() => {
    const pushinterval = setInterval(() => {
      if (internetConnectionStatus) {
        // saleOrderPush()
        customerMasterPushPost();
        customerMasterPushPut();
        billPosPush("new");
        billPosPush("edit");
        billPoswithsalesorderPush("new");
        billPoswithsalesorderPush("edit");
        inwardPush("new");
        inwardPush("edit");
        purchaseReturnPush("new");
        purchaseReturnPush("edit");
        indentPush("edit");
        purchaseInvoicePush("new");
        purchaseInvoicePush("edit");
        // purchaseInvoiceWithGitPush();
        stockJournalPush();
        salesReturnPush("new");
        salesReturnPush("edit");
        purchaseOrderPush("new");
        purchaseOrderPush("edit");
        advanceAdjustmentPush();
        CreditNoteRefundPush();
      }
    }, 10000);
    return () => clearInterval(pushinterval);
  }, [internetConnectionStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (internetConnectionStatus) {
        console.log("get master data");
        cityMaster();
        unitMaster();
        itemGroup();
        HsnMaster();
        vendorMaster();
        customerMaster();
        itemmaster();
        stateMaster();
        priceMaster();
        stockLotMaster();
        GITMaster();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [internetConnectionStatus]);

  return (
    <>
      <div className="topHeader">
        <div className="leftDivide">
          <div onClick={navToggle} className="toggleNav">
            <span></span>
          </div>
          <div className="emailSection">
            <ul>
              <li>
                <img src={MailIcon} alt="" />
                <span>info@eazyorder.com </span>
              </li>
              <li>
                <img src={PhoneIcon} alt="" />
                <span> +91 123456789 </span>
              </li>
            </ul>
          </div>

          {/* <div className="ulCalender">
            <ul>
              <li>
                <img src={Calender} alt="" className="calIcon" />
              </li>
              <li>
                <input type="text" readOnly={true} value="2021-01-08" />
              </li>
              <li>
                {" "}
                <span>To</span>
              </li>
              <li>
                <input type="text" readOnly={true} value="2021-01-08" />
              </li>
              <li>
                <button className="calBtn"></button>
              </li>
            </ul>
          </div> */}
          <div className="networkStatus" style={{marginLeft:"auto"}}>
            <span
              className={
                internetConnectionStatus === true ? "Online" : "Offline"
              }
            ></span>
            {internetConnectionStatus === true ? "Online" : "Offline"}
          </div>
          {/* <div className="searchBox">
            <div className="searchBoxIn">
              <input
                type="text"
                readOnly={true}
                placeholder="Search Data here...."
              />
              <button>
                <img src={Search} alt="" />
              </button>
            </div>
          </div> */}
          <div className="profileText">
            <ul>
              <li className="nameText">
                Hi,
                <b>
                  {localStorage.getItem("fname") !== ""
                    ? localStorage.getItem("fname")
                    : ""}
                </b>
              </li>
              <li>
                <div className="ProfileImg">
                  <img src={User} alt="" />
                </div>
              </li>
            </ul>
            <div className="profileSubMenu">
              <ul>
                <li>
                  <button onClick={() => logOut()}>Logout</button>
                </li>
                {/* <li>
                  <button onClick={() => dataSync()}>Sync</button>
                </li>
                <li>
                  <button onClick={() => dataSyncUpdate()}>Update</button>
                </li>  */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
