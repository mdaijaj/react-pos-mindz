import React from "react";
import {
  AggregateColumnDirective,
  AggregateColumnsDirective,
  AggregateDirective,
  AggregatesDirective,
} from "@syncfusion/ej2-react-grids";
import "./dropdown.scss";
import { ReactComponent as Refresh } from "../../../images/icon/restart-line.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../app.css";

import ReportData from "./ReportData";

import { dataSource } from "./ReportDataSource";
import {
  IsPeriodShow,
  getPeriod,
  getReportFltr,
  getClintId,
} from "./getReportData";
import axios from "axios";
import DropdownView from "./Dropdown";

class BillDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      reportheader: [],
      reportAggrgtHeader: [],
      showAggregate: false,
      reportName: "",
      fromDate: "",
      toDate: "",
      clientId: "",
      preiodId: "",
      filterVlu:"",
      DefaultPeriod: "",
      datebox: false,
      errorMsg: "",
      periodList: [],
      ReportData: [],
      IsPeriodObj: {
        IsDefaultLoad: false,
        IsReportOnlineMode: false,
        IsShowPeriod: false,
        IsShowRequestExportToExcel: false,
      },
    };
    this.toolbarOptions = [
      "Search",
      "ExcelExport",
      "CsvExport",
      "ColumnChooser",
    ];
  }
  getData = async () => {
    let IsPeriod = await IsPeriodShow(this.props.pageNav.formid);

    if (IsPeriod) {
      this.setState({
        IsPeriodObj: IsPeriod,
        clientId: await getClintId(),
      });
      if (IsPeriod.IsDefaultLoad === false) {
        if (IsPeriod.IsShowPeriod === true) {
          let periodArr = await getPeriod(this.props.pageNav.formid);
          if (periodArr) {
            this.setState({
              periodList: periodArr,
            });
          }
        }
      } else {
        if (IsPeriod.IsShowPeriod === true) {
          let periodArr = await getPeriod(this.props.pageNav.formid);
          if (periodArr) {
            let defaultVal = periodArr[0].DefaultPeriod;
            if (defaultVal !== "") {
              let defaultvalObj = periodArr.find(
                (a) => a.PeriodName === defaultVal
              );
              this.setState({
                periodList: periodArr,
                preiodId: defaultvalObj.PeriodId,
                fromDate: new Date(defaultvalObj.FromDate),
                toDate: new Date(defaultvalObj.ToDate),
                DefaultPeriod: periodArr[0].DefaultPeriod,
              });
              this.getReportsData();
            } else {
              this.setState({
                periodList: periodArr,
              });
            }
          }
        } else {
          this.getonloadreport();
        }
      }
    }

    // let fltr = await getReportFltr(this.props.pageNav.formid);
  };
  componentDidMount() {
    //this.handleRefresh();
    this.getData();
  }

  processAggrColumnHeader = (AggrCol) => {
    let aggrgtheader = eval(
      this.replaceAll(
        this.replaceAll(
          this.replaceAll(
            this.replaceAll(AggrCol, "ej.Grid.SummaryType.Sum", "Sum"),
            "ej.TextAlign.Left",
            '"left"'
          ),
          "ej.TextAlign.Right",
          '"left"'
        ),
        "{0:n2}",
        "N2"
      )
    );
    return aggrgtheader;
  };

  processColumnHeader = (Headercols) => {
    let colheader = eval(
      this.replaceAll(
        this.replaceAll(
          this.replaceAll(Headercols, "ej.TextAlign.Left", '"left"'),
          "ej.TextAlign.Right",
          '"right"',
        ),
        "{0:n2}",
        "N2"
      )
    );
    return colheader;
  };

  // handleRefresh = async (event) => {
  //   const obj = [
  //     {
  //       fromdate: "2020-01-20 13:27:10",
  //       todate: "2021-04-20 13:27:32",
  //     },
  //   ];
  //   const config = { headers: { token: localStorage.getItem("token") } };

  //   let api = `/api/Report/${this.props.pageNav.formid}`;
  //   axios
  //     .post(api, obj, config)
  //     .then((res) => {
  //       console.log(res, "ggggggggggggggggggggggggggggggggggggg");
  //       if (res.data.result.Result.Result.length > 0) {
  //         console.log(
  //           res.data.result.Result.Result,
  //           "ggggggggggggggggggggggggggggggggggggg"
  //         );
  //         const objKey = Object.keys(res.data.result.Result.Result[0]);
  //         let keyArry = [];
  //         objKey.forEach((key) => {
  //           keyArry.push({
  //             field: key,
  //             headerText: key,
  //             width: 120,
  //           });
  //         });
  //         this.setState({
  //           ReportData: res.data.result.Result.Result,
  //           reportheader: this.processColumnHeader(JSON.stringify(keyArry)),
  //         });
  //       }
  //     })
  //     .catch((err) => console.log(err, "getreprtdata error"));
  //   // const abc = await getReportdata(this.props.pageNav.formid, obj);
  //   // console.log(abc, "abcbac");
  //   // this.setState({
  //   //   //ReportData: dataSource.reportData,
  //   //   // ReportData: abc,
  //   //   reportheader: this.processColumnHeader(
  //   //     '[ { field: "Customer Code", headerText: "Customer Code", textAlign: ej.TextAlign.Left, width: 120 }, { field: "Customer Name", headerText: "Customer Name", textAlign: ej.TextAlign.Left, width: 200 }, { field: "sold", headerText: "Sale Qty", textAlign: ej.TextAlign.Right, format: "{0:n2}", width: 120 }, { field: "free", headerText: "FOC Qty", textAlign: ej.TextAlign.Right, format: "{0:n2}", width: 120 }]'
  //   //   ),
  //   // });
  // };

  replaceAll = (data, search, replaceWith) => {
    return data.split(search).join(replaceWith);
  };

  onGridFilterChange = (sel) => {
    this.reportData.clearFiltering();
    this.reportData.filterSettings.type = sel;
    this.setState({
      filterVlu:sel,
    })
    
  };

  toolbarClick = (args) => {
    let cur_timestamp = Math.floor(Date.now() / 1000);
    let export_file_name = this.props.pageNav.menuname.replaceAll(" ", "_") + "_" + cur_timestamp;
    if(args === "downloadExcel"){
      this.reportData.excelExport({ fileName: export_file_name + ".xlsx" });
    }else{
      if (args.item.text === "Excel Export") {
        this.reportData.excelExport({ fileName: export_file_name + ".xlsx" });
      }
      else if (args.item.text === "CSV Export") {
        this.reportData.csvExport({ fileName: export_file_name + ".csv" });
      }
    }
    
   
    // if (args.item.text === "Excel Export") {
    //   this.reportData.excelExport();
    // } else if (args.item.text === "CSV Export") {
    //   this.reportData.csvExport();
    // }
  };
  PreiodOnchange = (id) => {
    if (id) {
      const fltId = this.state.periodList.find(
        (a) => a.PeriodId === parseInt(id)
      );
      if (parseInt(id) === 10) {
        this.setState({
          fromDate: "",
          toDate: "",
          datebox: true,
          preiodId: parseInt(id),
        });
      } else {
        this.setState({
          fromDate: new Date(fltId.FromDate),
          toDate: new Date(fltId.ToDate),
          datebox: false,
          preiodId: parseInt(id),
        });
      }
    }
  };
  formatDate = (date) => {
    //'2021-11-01T00:00:00'
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    return `${yy}-${mm}-${dd}T00:00:00`;
  };
  // shouldComponentUpdate() {
  //   return true;
  // }
  footerAggr(props, summaryType) {
    switch (summaryType) {
      case "Average":
        return <span>Average: {props.Average}</span>;
        break;
      case "Min":
        return <span>Min: {props.Min}</span>;
        break;
      case "Max":
        return <span>Max: {props.Max}</span>;
        break;
      case "Count":
        return <span>Count: {props.Count}</span>;
        break;
      case "Truecount":
        return <span>True Count: {props.Truecount}</span>;
        break;
      case "Falsecount":
        return <span>False Count: {props.Falsecount}</span>;
        break;
      default:
        return <span>Sum: {props.Sum}</span>;
        break;
    }
  }
  getonloadreport = () => {
    this.props.lodding(true);
    const obj = {
      ClientId: "",
      filteredDists: "nothingselected",
      formId: this.props.pageNav.formid,
      formName: this.props.pageNav.menuname,
      jsonFilter: [],
      loginUserId: localStorage.getItem("UserId"),
      loginUserName: localStorage.getItem("fname"),
    };
    const config = { headers: { token: localStorage.getItem("token") } };
    axios
      .post("api/reports/getreports", obj, config)
      .then((res) => {
        if (res.data.Data.Rows.length < 1) {
          this.setState({
            IsPeriodObj: {
              ...this.state.IsPeriodObj,
              IsDefaultLoad: false,
            },
          });
          this.setState({
            errorMsg: "No data Available",
            ReportData:[],
          });
          this.props.lodding(false);
          setTimeout(() => {
            this.setState({
              errorMsg: "",
            });
          }, 2000);
        } else {
          this.setState({
            ReportData: res.data.Data.Rows,
            reportheader: this.processColumnHeader(res.data.Data.ReportHeaders),
            IsPeriodObj: { ...this.state.IsPeriodObj, IsDefaultLoad: true },
          });
          this.props.lodding(false);
        }
      })
      .catch((err) => console.log(err));
  };
  getReportsData = () => {
    this.props.lodding(true);
    if (this.state.fromDate === "" || this.state.toDate === "") {
      this.setState({
        errorMsg:
          this.state.preiodId === 10
            ? "Please select fromdate and Todate"
            : "Please select any one value from Select List",
      });
      this.props.lodding(false);
      setTimeout(() => {
        this.setState({
          errorMsg: "",
        });
      }, 2000);
    } else {
      const obj = {
        ClientId: this.state.clientId,
        filteredDists: "nothingselected",
        formId: this.props.pageNav.formid,
        formName: this.props.pageNav.menuname,
        jsonFilter: [],
        loginUserId: localStorage.getItem("UserId"),
        loginUserName: localStorage.getItem("fname"),
        endDate: this.formatDate(this.state.toDate),
        startDate: this.formatDate(this.state.fromDate),
      };
      const config = { headers: { token: localStorage.getItem("token") } };
      axios
        .post("api/reports/getreports", obj, config)
        .then((res) => {
          if (res.data.Data.Rows === null) {
            this.setState({
              IsPeriodObj: { ...this.state.IsPeriodObj, IsDefaultLoad: false },
            });
            this.setState({
              errorMsg: "No data Available",
              ReportData:[],
            });
            this.props.lodding(false);
            setTimeout(() => {
              this.setState({
                errorMsg: "",
              });
            }, 2000);
          } else {
            if (res.data.Data.Rows.length < 1) {
              this.setState({
                IsPeriodObj: {
                  ...this.state.IsPeriodObj,
                  IsDefaultLoad: false,
                },
              });
              this.setState({
                errorMsg: "No data Available",
                ReportData:[],
              });
              this.props.lodding(false);
              setTimeout(() => {
                this.setState({
                  errorMsg: "",
                });
              }, 2000);
            } else {
              // console.log(this.processColumnHeader(res.data.Data.ReportHeaders),"res.data.Data.ReportHeaders")
              // const objKey = Object.keys(res.data.Data.ReportHeaders);
              // let keyArry = [];
              // objKey.forEach((key) => {
              //   keyArry.push({
              //     field: key,
              //     headerText: key,
              //     width: 120,
              //   });
              // });
              // console.log(keyArry,"keyArry1")
              this.setState({
                ReportData: res.data.Data.Rows,
                reportheader: this.processColumnHeader(res.data.Data.ReportHeaders),
                IsPeriodObj: { ...this.state.IsPeriodObj, IsDefaultLoad: true },
                reportAggrgtHeader: this.processAggrColumnHeader(
                  JSON.stringify(res.data.Data.WebAggregates)
                ),
                showAggregate: res.data.Data.ShowWebAggregate,
              });
              this.props.lodding(false);
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    let reportAggrgtHdr = this.state.reportAggrgtHeader;
    let aggrt =
      reportAggrgtHdr.length > 0 && this.state.showAggregate ? (
        <AggregatesDirective>
          <AggregateDirective>
            <AggregateColumnsDirective>
              {reportAggrgtHdr.map((text) => {
                return (
                  <AggregateColumnDirective
                    key={this.state.reportName + "_" + text.displayColumn}
                    field={text.displayColumn}
                    type={text.summaryType}
                    format={text.format}
                    footerTemplate={(e) => this.footerAggr(e, text.summaryType)}
                    groupCaptionTemplate={(e) =>
                      this.footerAggr(e, text.summaryType)
                    }
                  />
                );
              })}
            </AggregateColumnsDirective>
          </AggregateDirective>
        </AggregatesDirective>
      ) : null;

    return (
      <div
        className="advanceAdjustment"
        style={{ display: this.props.pageNav.hide === true ? "none" : "block" }}
      >
        <div className="flterSection">
          <div className="row">
            <div className="col">
              <DropdownView
                preiodlist={this.state.periodList}
                onchange={this.PreiodOnchange}
                value={this.state.preiodId}
              />
            </div>
            <div className="col">
              <div className="formBox">
                <label htmlFor="">From Date</label>
                <DatePicker
                  dropdownMode="select"
                  onChange={(date) =>
                    this.setState({ fromDate: date, toDate: "" })
                  }
                  // yearDropdownItemNumber={100}
                  maxDate={new Date()}
                  scrollableYearDropdown={true}
                  showYearDropdown
                  showMonthDropdown
                  disabled={this.state.datebox === false ? true : false}
                  selected={this.state.fromDate}
                  onChangeRaw={(e) => e.preventDefault()}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col">
              <div className="formBox">
                <label htmlFor="">To Date</label>
                <DatePicker
                  dropdownMode="select"
                  onChange={(date) => this.setState({ toDate: date })}
                  disabled={this.state.datebox === false ? true : false}
                  minDate={this.state.fromDate}
                  maxDate={new Date()}
                  scrollableYearDropdown={true}
                  showYearDropdown
                  showMonthDropdown
                  selected={this.state.toDate}
                  onChangeRaw={(e) => e.preventDefault()}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="col">
              <DropdownView
                preiodlist={[
                  {PeriodId:"Menu",PeriodName:"Menu"},
                  {PeriodId:"CheckBox",PeriodName:"CheckBox"},
                  {PeriodId:"Excel",PeriodName:"Excel"},
                  {PeriodId:"FilterBar",PeriodName:"FilterBar"},
                ]}
                onchange={this.onGridFilterChange}
                value={this.state.filterVlu}
                disabled={this.state.ReportData.length > 0 ? false:true}
              />
            </div>
            <div className="col">
              <button className="fltr_Submit" onClick={this.getReportsData}>
                <Refresh fill="#ffffff"/>
              </button>
              <button className={this.state.ReportData.length > 0 ? "download_excel green":"download_excel grey"} onClick={this.state.ReportData.length > 0 ? ()=>this.toolbarClick("downloadExcel"):()=> {return false} }>
                <span className="icon_excelD"></span>
              </button>
            </div>
          </div>
          {this.state.errorMsg !== "" ? (
            <div className="errorShow">{this.state.errorMsg}</div>
          ) : (
            ""
          )}
        </div>
        {this.state.IsPeriodObj.IsDefaultLoad && (
          <div className="report-master-form">
            <div className="tab-content">
              <section className="contentWrapper">
                <ReportData
                  isLoading={this.state.isLoading}
                  formId={this.props.FormId}
                  reportData={(scope) => {
                    this.reportData = scope;
                  }}
                  dataSources={this.state.ReportData}
                  toolbarClick={this.toolbarClick}
                  toolbarOptions={this.toolbarOptions}
                  report_header={this.state.reportheader}
                  aggrt={aggrt}
                />
              </section>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default BillDetail;
