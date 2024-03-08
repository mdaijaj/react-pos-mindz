import db from "../datasync/dbs";
const DeleteDaysWiseData = async () => {
  const dates = await db.globelsetting
    .where("globsettingid").equals(541).first()
    .then()
    .catch((err) => console.log(err));
  if (dates) {
    let oneWeekAgo = new Date(
      Date.now() - dates.value * 24 * 60 * 60 * 1000
      // Date.now() - 0 * 24 * 60 * 60 * 1000
    );
    const tableArray = [
      {
        prTbl: "salesInvoice",
        chTbl: "saleInvoiceDetail",
        fltstr: "invoiceid",
        createon: "createdon",
      },
      {
        prTbl: "salesInvoiceWithSO",
        chTbl: "saleInvoiceDetailWithSO",
        fltstr: "invoiceid",
        createon: "createdon",
      },
      {
        prTbl: "salesReturn",
        chTbl: "SaleReturnDetail",
        fltstr: "InvoiceId",
        createon: "CreatedOn",
      },
      {
        prTbl: "PurchaseInvoice",
        chTbl: "PurchaseInvoiceDetail",
        fltstr: "InvoiceId",
        createon: "CreatedOn",
      },
      {
        prTbl: "IndentMaster",
        chTbl: "IndentDetail",
        fltstr: "IndentId",
        createon: "CreatedOn",
      },
      {
        prTbl: "IC_Master",
        chTbl: "IC_Detail",
        fltstr: "InwardId",
        createon: "CreatedOn",
      },
    ];
    for (let tbl of tableArray) {
      getDatafromTable(tbl, oneWeekAgo);
    }
  }
};
const getDatafromTable = async (arrayObj, date) => {
  const pArry = await db
    .table(arrayObj.prTbl)
    .where(arrayObj.createon)
    .below(date)
    .toArray()
    .then()
    .catch((err) => console.log(err));
  if (pArry && pArry.length > 0) {
    const pArryfltr = pArry.filter((a) => a.new === 0 && a.update === 0);
    if (pArryfltr && pArryfltr.length > 0) {
      let childTblarry = [];
      for (let arr of pArryfltr) {
        let id = arr.Id === 0 || arr.Id === "" ? arr.id : arr.Id;
        const tblrow = await db
          .table(arrayObj.chTbl)
          .where(arrayObj.fltstr)
          .equals(id)
          .toArray()
          .then()
          .catch((err) => console.log((err) => console.log(err)));
        childTblarry = [...childTblarry, ...tblrow];
      }
      const ids = childTblarry.map((d) => {
        return d.id;
      });

      const pids = pArryfltr.map((id) => {
        return id.id;
      });
      await db.table(arrayObj.prTbl).bulkDelete(pids);
      await db.table(arrayObj.chTbl).bulkDelete(ids);
    }
  }
};
export { DeleteDaysWiseData };
