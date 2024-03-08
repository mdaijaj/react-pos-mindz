import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  GridComponent,
  Page,
  Group,
  Resize,
  Filter,
  Inject,
  InfiniteScroll,
  Sort,
  Reorder,
  Toolbar,
  ColumnChooser,
  ExcelExport,
  PdfExport,
  ColumnDirective,
  ColumnsDirective,
  Aggregate,
} from "@syncfusion/ej2-react-grids";

class ReportData extends React.Component {
  constructor(props) {
    super(props);
    this.PageSettingsModel = { pageSize: 50 };
  }

  dataBound() {
    this.element
      .querySelector("#" + this.element.getAttribute("id") + "_searchbar")
      .addEventListener("keyup", function (e) {
        this.closest(".e-grid").ej2_instances[0].search(this.value);
      });
  }

  render() {
    const {
      isLoading,
      reportData,
      dataSources,
      toolbarClick,
      toolbarOptions,
      report_header,
      aggrt,
    } = this.props;

    return (
      <div>
        {isLoading === true ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress size={60} thickness={5} />
          </div>
        ) : (
          <>
            {report_header && report_header.length > 0 ? (
              <div>
                <GridComponent
                  id="reportData"
                  key={"report_detail" + this.props.formId}
                  ref={reportData}
                  rowHeight={25}
                  dataSource={dataSources}
                  allowPaging={true}
                  gridLines={"Both"}
                  allowFiltering={true}
                  filterSettings={{ type: "Excel" }}
                  allowExcelExport={true}
                  allowPdfExport={true}
                  toolbarClick={toolbarClick}
                  allowGrouping={true}
                  allowResizing={true}
                  height={545}
                  allowSorting={true}
                  allowMultiSorting={true}
                  allowReordering={true}
                  enableAltRow={true}
                  toolbar={toolbarOptions}
                  showColumnChooser={true}
                  enableVirtualization={false}
                  allowTextWrap={true}
                  enableInfiniteScrolling={true}
                  pageSettings={{ pageSize: 200 }}
                  dataBound={this.dataBound}
                >
                  <ColumnsDirective>
                    {report_header &&
                      report_header.map((text) => {
                        return (
                          <ColumnDirective
                            field={text.field}
                            headerText={text.headerText}
                            width={text.width}
                            textAlign={text.textAlign}
                            format={text.format ? text.format : ""}
                            headerTextAlign={"Left"}
                          />
                        );
                      })}
                  </ColumnsDirective>
                  {aggrt}
                  <Inject
                    services={[
                      Filter,
                      //VirtualScroll,
                      InfiniteScroll,
                      Sort,
                      Reorder,
                      Page,
                      Group,
                      Resize,
                      Toolbar,
                      ColumnChooser,
                      ExcelExport,
                      Aggregate,
                      PdfExport,
                    ]}
                  />
                </GridComponent>
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    );
  }
}
export default ReportData;
