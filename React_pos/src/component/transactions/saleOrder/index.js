import "./saleOrder.scss";
import CommonFormAction from "../../common/commonFormAction";
import calenderIcon from "../../../images/icon/calender.svg";
import { useState, useEffect, useMemo } from "react";
import validate from "../../common/validate";
import db from "../../../datasync/dbs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DatePicker from "react-datepicker";
import Modal from "./modalPopUp";
import COLUMNS from "./columns";
import Table from "./table";
import TextField from "@material-ui/core/TextField";

import * as fn from "./transactionDB";
import COLUMN from "./noneditableColumns";
const SaleOrder = () => {
  const [product, setProduct] = useState({
    product: [],
    selectedProduct: [],
    rowSelected: [],
    form: {
      SoNumber: "",
      SoDate: "",
      dropDownOption: "",
      PartyCode: "",
      TotalAmount: 0,
      Remarks: "",
      PartyName: "",
      OrderedBy: "",
      required: {
        SoDate: "",
        PartyCode: "",
        PartyName: "",
        SoNumber: "",
        OrderedBy: "",
        PartyId: "",
        TotalAmount: "",
      },
    },
    vendorList: [],
  });
  const [saveonadd, setSaveonadd] = useState()
  const [inwardList, setinwardList] = useState(null);
  const [editId, setEditId] = useState();
  const [dropDownOption, setDropDownOption] = useState(false);
  const [customerNameDropDown, setcustomerNameDropDown] = useState(false);
  const [customercodeDropDown, setcustomercodeDropDown] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [customerCodeFocus, setcustomerCodeFocus] = useState(false);
  const [customerNameFocus, setcustomerNameFocus] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [date, setDate] = useState(new Date());
  const [rows, setRows] = useState([]);
  const [vendorCodeFocus, setVendorCodeFocus] = useState(false);
  const [vendorNameFocus, setVendorNameFocus] = useState(false);
  const [errorObj, setErrorObj] = useState();
  const [val, setVal] = useState();

  const fnBindTable = async () => {
    let finalProductTemp = [];
    const previousProductTemp =
      product && product.selectedProduct.length > 0
        ? product.selectedProduct
        : [];
    const newSelectedProductTemp = product.rowSelected
      ? product.rowSelected &&
        rows &&
        rows.filter((m) => product.rowSelected.indexOf(m.id) > -1)
      : [];
    finalProductTemp = previousProductTemp;
    await setProduct((old) => {
      return { ...old, selectedProduct: [] };
    });
    await setSelectedProduct([]);
    for (let arr in newSelectedProductTemp) {
      if (
        (finalProductTemp &&
          finalProductTemp.length > 0 &&
          finalProductTemp.findIndex(
            (m) => m.id === newSelectedProductTemp[arr].id
          ) === -1) ||
        (finalProductTemp && finalProductTemp.length === 0)
      ) {
        finalProductTemp.push(newSelectedProductTemp[arr]);
      }
    }
    await setSelectedProduct(finalProductTemp);
    await setProduct((old) => {
      return { ...old, product: rows, selectedProduct: finalProductTemp };
    });
  };
  const updateMyData = async (rowIndex, columnId, value) => {
    try {
      await setSelectedProduct([]);
      const sl = product;
      sl.selectedProduct[rowIndex][columnId] = value;
      const tempProduct = total(sl.selectedProduct);
      sl.selectedProduct = tempProduct.productData;
      sl.form.TotalAmount = tempProduct.totalAmount;
      await setProduct(sl);
      await setSelectedProduct(sl.selectedProduct);
    } catch (error) {}
  };
  const bindDefault = async () => {
    await setProduct((old) => {
      old.product = [];
      old.selectedProduct = [];
      old.rowSelected = [];
      old.form = {
        SoNumber: "",
        SoDate: "",
        dropDownOption: "",
        PartyCode: "",
        TotalAmount: 0,
        Remarks: "",
        PartyName: "",
        OrderedBy: "",
        PartyId: "",
        required: {
          SoDate: "",
          PartyCode: "",
          PartyName: "",
          SoNumber: "",
          OrderedBy: "",
          TotalAmount: "",
          PartyId: "",
        },
      };
      old.vendorList = [];
      return { ...old };
    });
    setVal("");
    setSelectedProduct([]);
  };

  const fixedToLength = (value) => {
    return value ? parseFloat(value).toFixed(3) : value;
  };

  const convertToFloat = (value) => {
    return value ? parseFloat(value) : value;
  };

  const bindSoSeries = (tempInvoiceData) => {
    let bill = "SO";
    bill += Date.now();
    bill +=
      tempInvoiceData && tempInvoiceData.length > 0
        ? tempInvoiceData.length + 1
        : 1;
    setProduct((old) => {
      old.form.SoNumber = bill;
      return {
        ...old,
      };
    });
  };
  const pageLoad = async () => {
    console.log('pageload function in saleorder')
    const itemList = await fn.fn_getItemMaster();
    const vendorList = await fn.fn_GetCustomerMaster();
    const saleOrderList = await db.SaleOrder.toArray();
    await setProduct((old) => {
      old.vendorList = vendorList;
      old.product = itemList;
      old.form.SoDate = new Date();
      return { ...old };
    });
    setinwardList(saleOrderList);
    await setRows(itemList);
  };
  const change_state = async (arg) => {
    if (arg === "add") {
      await pageLoad();
      fnGetSo(null);
      const tempSoData = await fn.fn_GetSo();
      bindSoSeries(tempSoData);
      return setVal(arg);
    }

    if (arg === "edit") {
      await pageLoad();
      fnGetSo(null);
      return setVal(arg);
    }

    if (arg === "view") {
      await pageLoad();
      return setVal(arg);
    }

    if (arg === "save") {
      submit();
    }

    if (arg === "refresh") {
      setVendorNameFocus(false);
      setVendorCodeFocus(false);
      bindDefault();
      return setVal(arg);
    }
  };
  const total = (productData) => {
    let quantity = 0;
    let rate = 0;
    let discountPer = 0;
    let grossTotal = 0;
    let discountAmount = 0;
    let netTotal = 0;
    let totalAmount = 0;
    if (productData && productData.length > 0) {
      for (let i = 0; i < productData.length; i++) {
        quantity = productData[i].quantity ? productData[i].quantity : 0;
        rate = convertToFloat(productData[i].Rate);
        discountPer = convertToFloat(productData[i].Discount);
        discountAmount = ((discountPer * rate) / 100) * quantity;
        productData[i].DiscountAmount = discountAmount = fixedToLength(
          discountAmount
        );
        grossTotal = quantity * rate;
        productData[i].grossTotal = grossTotal = fixedToLength(grossTotal);
        netTotal = convertToFloat(grossTotal) - convertToFloat(discountAmount);
        productData[i].NetTotal = netTotal = fixedToLength(netTotal);
        totalAmount = convertToFloat(totalAmount) + convertToFloat(netTotal);
        totalAmount = fixedToLength(totalAmount);
      }
    }
    return { productData, totalAmount };
  };

  const getVendorCode = (customer) => {
    setcustomerNameDropDown(false);
    setVendorNameFocus(true);
    if (customer) {
      setEditId(customer.Id);
      const data = {
        VendorCode: customer.PartyCode,
        VendorName: customer.PartyName,
      };
      setProduct((old) => {
        old.form.PartyCode = data.VendorCode;
        old.form.PartyName = data.VendorName;
        return { ...old };
      });
    }
  };

  const getVendorName = (customer) => {
    setcustomercodeDropDown(false);
    setVendorCodeFocus(true);
    if (customer) {
      setEditId(customer.Id);
      const data = {
        VendorCode: customer.PartyCode,
        VendorName: customer.PartyName,
      };
      setProduct((old) => {
        old.form.PartyName = data.VendorName;
        old.form.PartyCode = data.VendorCode;

        return { ...old };
      });
    }
  };
  const fnGetSo = async (SoNo) => {
    setDropDownOption(false);
    const formData = await fn.fn_GetSo(SoNo);
    if (formData && Array.isArray(formData)) {
      setProduct((old) => {
        old.form.SoList = formData;
        return { ...old };
      });
    } else {
      if (formData && Object.keys(formData).length > 0) {
        setProduct((old) => {
          old.form = formData;
          old.selectedProduct = formData.product;
          return { ...old };
        });
        setSelectedProduct(formData.product);
      }
    }
  };
  const setSelection = (rowSelected) => {
    console.log('setSelection rowselected checking array value',rowSelected.selectionModel)
    setSaveonadd(rowSelected.selectionModel);
    rowSelected.selectionModel &&
      setProduct((old) => {
        return {
          ...old,
          rowSelected: rowSelected.selectionModel.map((id) => {
            return parseInt(id);
          }),
        };
      });
  };
  const submit = async () => {
    let formData = fnGetFormatProduct(product.form);
    console.log('product.form.Id index saleOrder',saveonadd)
    if (product.form.Id) {
      await fn.fn_UpdateSo(formData, product.selectedProduct);
      bindDefault();
      alert("updated successfully");
    } else {
      if(saveonadd.length>0){
        await fn.fn_SaveSo(formData, product.selectedProduct);
      bindDefault();
      alert("saved successfully");
      setSaveonadd([]);
      }
      
    }
  };
  const fnGetFormatProduct = (prod) => {
    return {
      // Id: prod && prod.Id,
      SoNumber: prod && prod.SoNumber,
      SoDate: prod && prod.SoDate,
      PartyCode: prod && prod.PartyCode,
      PartyName: prod && prod.PartyName,
      CreatedBy: prod && prod.CreatedBy,
      CreatedByName: prod && prod.CreatedByName,
      CreatedOn: new Date(),
      Remarks: prod && prod.Remarks,
      OrderedBy: prod && prod.OrderedBy,
      TotalAmount: prod && prod.TotalAmount,
      new:1,
      update:0,
    };
  };

  useEffect(() => {
    const getKey = (e) => {
      if (codeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setDropDownOption(true);
        }
      }
      if (customerNameFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setcustomerNameDropDown(true);
        }
      }
      if (customerCodeFocus) {
        if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          setcustomercodeDropDown(true);
        }
      }
    };
    window.addEventListener("keydown", getKey);
    return () => {
      window.removeEventListener("keydown", getKey);
    };
  }, [
    inwardList,
    val,
    codeFocus,
    customerCodeFocus,
    customerNameFocus,
    errorObj,
  ]);

  const para = { val, change_state };
  const columns = useMemo(() => COLUMNS, []);
  const column = useMemo(() => COLUMN, []);
  let data = { product, fnBindTable, setSelection, rows };
  return (
    <>
      <div className="saleOrder">
        <CommonFormAction {...para} />
        <div className="saleOrderIn mt-2">
          <div className="box greyBg">
            <div className="row">
              <div className="col w65">
                <div className="row">
                  <div className="col">
                    <div className="formBox">
                      <label htmlFor="">Invoice No.</label>
                      {val === "edit" || val === "view" ? (
                        inwardList && (
                          <Autocomplete
                            open={dropDownOption}
                            options={inwardList}
                            onChange={(e, value) => fnGetSo(value)}
                            getOptionLabel={(option) => option.SoNumber}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Press ctrl + L"
                                onFocus={() => setCodeFocus(true)}
                                onBlur={() => {
                                  setCodeFocus(false);
                                  setDropDownOption(false);
                                }}
                              />
                            )}
                          />
                        )
                      ) : (
                        <input
                          name="nodeNumber"
                          onChange={(e) => {
                            setProduct((old) => {
                              old.form.SoNumber = e.target.value;
                              return { ...old };
                            });
                          }}
                          type="text"
                          className={
                            errorObj && errorObj.Invoiceno === true
                              ? "error"
                              : ""
                          }
                          data-valid="varChar"
                          value={
                            product && product.form && product.form.SoNumber
                          }
                          readOnly={true}
                        />
                      )}
                    </div>
                  </div>

                  <div className="col">
                    <div className="formBox">
                      <img src={calenderIcon} className="calIcon" alt="" />
                      <label htmlFor="">Invoice Date</label>
                      <DatePicker
                        selected={date}
                        onChange={(date) => {
                          setProduct((old) => {
                            old.form.SoDate = date;
                            return { ...old };
                          });
                        }}
                        dateFormat="dd-MM-yyyy"
                        dropdownMode="select"
                        value={product && product.form && product.form.SoDate}
                        readOnly={
                          val === "view" || val === undefined ? true : false
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="formBox">
                      <label htmlFor="">Vendor Name</label>
                      {val === "add" ? (
                        vendorCodeFocus === false ? (
                          product &&
                          product.vendorList && (
                            <Autocomplete
                              open={customerNameDropDown}
                              options={product.vendorList}
                              onChange={(e, value) => {
                                getVendorCode(value);
                              }}
                              getOptionLabel={(option) => option.PartyName}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Press ctrl + L"
                                  onFocus={() => setcustomerNameFocus(true)}
                                  onBlur={() => {
                                    setcustomerNameFocus(false);
                                    setcustomerNameDropDown(false);
                                  }}
                                />
                              )}
                            />
                          )
                        ) : (
                          <input
                            onChange={(e) => {
                              setProduct((old) => {
                                old.form.PartyName = e.target.value;
                                return { ...old };
                              });
                            }}
                            name="adjustmentAmount"
                            value={
                              product && product.form && product.form.PartyName
                            }
                            type="text"
                            className={
                              errorObj && errorObj.VendorName === true
                                ? "error"
                                : ""
                            }
                            readOnly={true}
                            data-valid="varChar"
                          />
                        )
                      ) : (
                        <input
                          onChange={(e) => {
                            setProduct((old) => {
                              old.form.PartyName = e.target.value;
                              return { ...old };
                            });
                          }}
                          name="adjustmentAmount"
                          value={
                            product && product.form && product.form.PartyName
                          }
                          type="text"
                          className={
                            errorObj && errorObj.VendorName === true
                              ? "error"
                              : ""
                          }
                          readOnly={true}
                          data-valid="varChar"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col">
                    <div className="formBox">
                      <label htmlFor="">Vendor Code</label>
                      {val === "add" ? (
                        vendorNameFocus === false ? (
                          product &&
                          product.vendorList && (
                            <Autocomplete
                              open={customercodeDropDown}
                              options={product.vendorList}
                              onChange={(e, value) => {
                                getVendorName(value);
                              }}
                              getOptionLabel={(option) => option.PartyCode}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Press ctrl + L"
                                  onFocus={() => setcustomerCodeFocus(true)}
                                  onBlur={() => {
                                    setcustomerCodeFocus(false);
                                    setcustomercodeDropDown(false);
                                  }}
                                />
                              )}
                            />
                          )
                        ) : (
                          <input
                            onChange={(e) => {
                              setProduct((old) => {
                                old.form.PartyCode = e.target.value;
                                return { ...old };
                              });
                            }}
                            name="adjustmentAmount"
                            value={
                              product && product.form && product.form.PartyCode
                            }
                            type="text"
                            className={
                              errorObj && errorObj.VendorCode === true
                                ? "error"
                                : ""
                            }
                            readOnly={true}
                            data-valid="varChar"
                          />
                        )
                      ) : (
                        <input
                          onChange={(e) => {
                            setProduct((old) => {
                              old.form.PartyCode = e.target.value;
                              return { ...old };
                            });
                          }}
                          name="adjustmentAmount"
                          value={
                            product && product.form && product.form.PartyCode
                          }
                          type="text"
                          className={
                            errorObj && errorObj.VendorCode === true
                              ? "error"
                              : ""
                          }
                          readOnly={true}
                          data-valid="varChar"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col w35">
                {val === "add" ? (
                  <Modal {...data} />
                ) : (
                  <button type="button" className="btnGreen">
                    Item List{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col w100">
              {val === "view" || val === undefined ? (
                <Table columns={column} data={selectedProduct} />
              ) : (
                <Table
                  columns={columns}
                  data={selectedProduct}
                  updateMyData={updateMyData}
                />
              )}
            </div>
          </div>
          <div className="box blueBg borderTop-0">
            <div className="row">
              <div className="col w25 mr-auto">
                <div className="formBox">
                  <label htmlFor="">Invoice By </label>
                  <input
                    onChange={(e) => {
                      setProduct((old) => {
                        old.form.OrderedBy = e.target.value;
                        return { ...old };
                      });
                    }}
                    name="invoiceBy"
                    value={product && product.form && product.form.OrderedBy}
                    type="text"
                    className={
                      errorObj && errorObj.InvoiceBy === true ? "error" : ""
                    }
                    readOnly={
                      val === "view" || val === undefined ? true : false
                    }
                  />
                </div>
              </div>
              <div className="col w25">
                <div className="formBox">
                  <label htmlFor="">Total</label>
                  <input
                    type="text"
                    className="bgWhite"
                    value={product && product.form && product.form.TotalAmount}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col w100 mt-2">
              <div className="RemarkForm mt-1 mb-2">
                <label htmlFor="">Remark</label>
                <textarea
                  onChange={(e) => {
                    setProduct((old) => {
                      old.form.Remarks = e.target.value;
                      return { ...old };
                    });
                  }}
                  name="remark"
                  value={product && product.form && product.form.Remarks}
                  type="text"
                  className={
                    errorObj && errorObj.Remarks === true ? "error" : "bgWhite"
                  }
                  readOnly={val === "view" || val == undefined ? true : false}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SaleOrder;
