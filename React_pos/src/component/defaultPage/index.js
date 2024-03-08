import React, { useState, useEffect } from "react";
import "./defaultPage.scss";
import ReactDOM from "react-dom";
import LeftNav from "../common/leftNav";
import Header from "../common/header";
import BrowserTabs from "../common/browserTabs";
import UnitMaster from "../masters/unitMaster";
import BillPos from "../transactions/billPos";
import ChangePassword from "../security/changePassword";
import { useSelector } from "react-redux";
import { navAction } from "../../redux/action/leftNavAction";
import ItemMaster from "../masters/itemMaster";
import GeographicalLocation from "../masters/geographicalLocation";
import CustomerMaster from "../masters/customerMaster";
import EmployeeMaster from "../masters/employeeMaster";
import ReasonMaster from "../masters/reasonMaster";
import SalePersonMaster from "../masters/salePersonMaster";
import SalesReturnBillWise from "../transactions/salesReturnBillWise";
import PurchaseReturn from "../transactions/purchaseReturn";
import AdvanceAdjustment from "../transactions/advanceAdjustment";
import CreditNote from "../transactions/CreditNote";
import PurchaseOrder from "../transactions/purchaseOrder";
import Inward from "../transactions/inward";
import StockGeneral from "../transactions/stockGeneral";
import Indent from "../transactions/indent";
import DebitNote from "../transactions/debitNote";
import VendorMaster from "../masters/vendorMaster";
import PurchaseInwardGit from "../transactions/purchaseInwardGit";
import PurchaseRWI from "../transactions/purchaseReturnWithoutInward";
import PurchaseInvoice from "../transactions/purchaseInvoice";
import SaleOrder from "../transactions/saleOrder";
import ItemGroupMaster from "../masters/itemGroup";
import GstClassififcation from "../masters/gstClassification";
import DesignationMaster from "../masters/designationMaster";
import CounterMaster from "../masters/counterMaster";
import VoucherTypes from "../masters/voucherTypes";
import CurrencyMaster from "../masters/currencyMaster";
import VendorMasterAlteration from "../masters/vendorMasterAlteration";
import ItemAttributeMaster from "../masters/itemAttribute";
import SeriesMasterLot from "../masters/seriesMaster/index";
import ApplySeriesMaster from "../masters/applySeries";
import CreditNoteRefund from "../transactions/CreditNoteRefund";
import BillPoswithSaleorder from "../transactions/billposwithsaleorder";
import RollManagement from "../security/roleManagement";
import UserManagement from "../security/userManagement";
import SalesReturnManual from "../transactions/salesReturnManual";
import BillDetail from "../reports/billDetail";
import Godown from "../masters/Godown";
import CompanySettings from "../configuration/companySetting";
import { DeleteDaysWiseData } from "../../datasync/daysWiseData";

const DefaultPage = (props) => {
  const navArray = useSelector((state) => state.navUpdateReducer);
  const [menuArray, setMenuArray] = useState(navArray);
  const [lodding, setLodding] = useState(true);
  const [newNavArr, setNewNavArr] = useState([]);
  const [online, setOnline] = useState(false);
  const [toggleN, setToggleN] = useState(false);
  const navFunction = (nav) => {
    let list = newNavArr.map((a) => {
      if (a.menuid === nav.menuid) {
        return { ...a, append: true, hide: false };
      } else {
        return { ...a, hide: true };
      }
    });
    setNewNavArr(list);
    const x = menuArray.navArray.find((a) => a.menuname === nav.menuname);
    if (x === undefined) {
      navAction([nav, ...menuArray.navArray]);
    } else {
      const newArray = menuArray.navArray.filter(
        (item) => item.menuname !== nav.menuname
      );
      navAction([nav, ...newArray]);
    }
  };
  const getOnline = (online) => {
    setOnline(online);
  };
  const tabFunction = (navItem, close) => {
    if (close === "true") {
      let nNav =
        menuArray.navArray.length > 1 ? menuArray.navArray[1] : undefined;
      let list = newNavArr.map((a) => {
        if (nNav !== undefined && a.menuid === nNav.menuid) {
          return { ...a, hide: false };
        }
        if (a.menuid === navItem.menuid) {
          return { ...a, append: false, hide: true };
        } else {
          return a;
        }
      });
      setNewNavArr(list);
      const newArray = menuArray.navArray.filter(
        (item) => item.menuid !== navItem.menuid
      );
      navAction([...newArray]);
    } else {
      let list = newNavArr.map((a) => {
        if (a.menuid === navItem.menuid) {
          return { ...a, hide: false };
        } else {
          return { ...a, hide: true };
        }
      });
      setNewNavArr(list);
      const newArray = menuArray.navArray.filter(
        (item) => item.menuid !== navItem.menuid
      );
      navAction([navItem, ...newArray]);
    }
  };
  const getnavArr = (arr) => {
    let x = [];
    arr.map((a) => {
      if (a.subMenu.length > 0) {
        x = [...x, ...a.subMenu];
        //x.push(a.subMenu)
      }
      return a;
    });
    setNewNavArr(x);
  };
  const toggleNav = () => {
    setToggleN(!toggleN);
  };
  useEffect(() => {
    setMenuArray(navArray);
    // return;
  }, [menuArray, navArray]);
  useEffect(() => {
    const datamanage = setInterval(() => {
      let getDate = new Date(localStorage.getItem("currentDate"));
      if (getDate) {
        let todaydate = new Date();
        let compareDate =
          todaydate.getTime() > getDate.getTime() ? true : false;
        if (compareDate) {
          DeleteDaysWiseData();
          localStorage.setItem("currentDate", new Date());
          // console.log(compareDate, "ccccccccccccc");
        }
      } else {
        localStorage.setItem("currentDate", new Date());
      }
    }, 60000);
    return () => clearInterval(datamanage);
  }, []);
  return (
    <div className={toggleN === true ? "wrapper active" : "wrapper"}>
      <LeftNav
        {...menuArray}
        getArr={(arr) => getnavArr(arr)}
        navFunction={(name) => navFunction(name)}
        lodding={setLodding}
      />
      <div className="rightWrapper">
        <Header
          {...props}
          navToggle={() => toggleNav()}
          checkonline={(a) => getOnline(a)}
        />
        <div className="rightPage">
          <BrowserTabs
            {...menuArray}
            tabFunction={(text, close) => tabFunction(text, close)}
          />
          {newNavArr &&
            newNavArr.map((a, i) =>
              a.menuname === "Unit Master" && a.append === true ? (
                <UnitMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Item Group" && a.append === true ? (
                <ItemGroupMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Multi Record Alteration" &&
                a.append === true ? (
                <VendorMasterAlteration
                  key={i}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Change Password" && a.append === true ? (
                <ChangePassword key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Bill (POS)" && a.append === true ? (
                <BillPos key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Item Master" && a.append === true ? (
                <ItemMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "GST Classification" && a.append === true ? (
                <GstClassififcation key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Geographical Location" &&
                a.append === true ? (
                <GeographicalLocation
                  key={i}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Customer Master" && a.append === true ? (
                <CustomerMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Employee Master" && a.append === true ? (
                <EmployeeMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Reason Master" && a.append === true ? (
                <ReasonMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Designation Master" && a.append === true ? (
                <DesignationMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Sale Person Master" && a.append === true ? (
                <SalePersonMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Sale Return (Bill Wise)" &&
                a.append === true ? (
                <SalesReturnBillWise
                  key={i}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Sale Return (Manual)" && a.append === true ? (
                <SalesReturnManual key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Purchase Return" && a.append === true ? (
                <PurchaseReturn key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Advance Adjustment" && a.append === true ? (
                <AdvanceAdjustment key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Credit Note" && a.append === true ? (
                <CreditNote key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Purchase Order" && a.append === true ? (
                <PurchaseOrder key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Material Inward With G.I.T." &&
                a.append === true ? (
                <Inward key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Stock Journal" && a.append === true ? (
                <StockGeneral key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Indent" && a.append === true ? (
                <Indent key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Vendor Master" && a.append === true ? (
                <VendorMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Debit Note" && a.append === true ? (
                <DebitNote key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Counter Master" && a.append === true ? (
                <CounterMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Purchase Inward with GIT" &&
                a.append === true ? (
                <PurchaseInwardGit key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Purchase Return Without Inward" &&
                a.append === true ? (
                <PurchaseRWI key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Purchase Invoice" && a.append === true ? (
                <PurchaseInvoice key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Sale Order" && a.append === true ? (
                <SaleOrder key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Voucher Type" && a.append === true ? (
                <VoucherTypes key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Currency Master" && a.append === true ? (
                <CurrencyMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Item Attribute" && a.append === true ? (
                <ItemAttributeMaster
                  key={i}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Series Master (Transaction)" &&
                a.append === true ? (
                <SeriesMasterLot key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Apply Series" && a.append === true ? (
                <ApplySeriesMaster key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Credit Note Refund" && a.append === true ? (
                <CreditNoteRefund key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Bill (POS) With Sales Order" &&
                a.append === true ? (
                <BillPoswithSaleorder
                  key={i}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Role Management" && a.append === true ? (
                <RollManagement key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "User Management" && a.append === true ? (
                <UserManagement key={i} onlinestatus={online} pageNav={a} />
              ) : a.menuname === "Bill Detail" && a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Bill Detail Item Wise" &&
                a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Bill Wise Payment Detail" &&
                a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Bill Detail With Tax" && a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Tax Detail Report" && a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Goods In Transit Report" &&
                a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Stock Report" && a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Discount Slab Report" && a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Customer Report" && a.append === true ? (
                <BillDetail
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Godown Master" && a.append === true ? (
                <Godown
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ) : a.menuname === "Company Settings" && a.append === true ? (
                <CompanySettings
                  key={i}
                  lodding={setLodding}
                  onlinestatus={online}
                  pageNav={a}
                />
              ): (
                ""
              )
            )}
        </div>
      </div>
      {lodding && (
        <div className="loding_div">
          <h1 data-text="Loading...">Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default DefaultPage;
