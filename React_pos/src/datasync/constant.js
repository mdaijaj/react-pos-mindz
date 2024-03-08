const schema = {
  globelsetting: "++id,globsettingid,itemkeyname,displayname,value",
  itemMaster:
    "++id,Id,new,update,ItemId,ItemCode,ItemName,PrintName,NameInTally,GroupId,UnitName,UnitAltName,Conversion,Denominator,IsLot,IsSerial,BillingUnit,EanCode,WeightInKg,IsActive,IsTaxInclusive,CommodityCode,ScheduleNo,SerialNo,Exciseclassification,ExciseClassificationCode,AbatmentNotificationNo,RateOfExcise,ExciseEvaluatinMethod,MinStock,MaxStock,ReorderLevel,CriticalLevel,EconomicOrderQty,MfgDate,ExpDate,Image,CreatedBy,CreatedOn,EditLog,GSTClassification,IsLotEnable,IsSerialEnable,alteredon",

  hsnMaster:
    "++id,Id,new,update,IGST,Code,HsnCode,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn",

  itemGroup:
    "++id,Id,new,update,GroupCode,GroupName,ParentGroupId,ParentGroupCode,ParentGroupName,CreatedBy,CreatedByName,EditLog,CreatedOn",

  unitMaster:
    "++id,Id,new,update,UnitSymbol,UnitName,DecimalDigit,CreatedBy,CreatedByName,EditLog,CreatedOn",

  attributeMaster:
    "++Id,id,new,update,AttributeName,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn,Value",

  attributeMasterDetails: "++Id,AttributeId,SizeCode,Code,PrintName,IsActive",

  userLogin: "++id,Id,new,update,name,userId,password,valid",

  customerMaster:
    "++id,Id,new,update,PartyCode,PartyName,PartyLastName,CompanyCode,GroupId,Address,Address2,CityId,PinCode,Phone1,Phone2,Fax,Email,ContactPerson,SalesPersonName,CstNo,CstDate,LstNo,LstDate,TinNo,TinDate,PAN,GSTNo,BillAddress,LedgerType,Salutation,DOB,Anniversary,Nationality,Gender,Spouse,Remarks,Website,StreetNo,StreetName,IsClosed,DmsLedgerCode,DealerCategory,CreatedBy",
  stateMaster:
    "++id,Id,new,update,StateId,StateCode,StateName,CountryId,CountryName,IsActive",

  cityMaster: "++id,Id,new,update,CityId,CityCode,CityName,StateId,StateName",

  priceSlabMaster:
    "++id,Id,SlabCode, SlabName, CreatedBy , CreatedByName, CreatedOn,EditLog,BranchId,SeriesId,SeriesNo,SeriesCode,Remark,alteredon",
  priceListItem:
    "++id,SlabItemId,SlabId,ItemId,ItemName,ItemCode,ApplicableFrom,ApplicableTo,InActive,Remarks,InactiveDate",
  priceListItemDetail:
    "++id,DetailId,SlabItemId,SlabId,ItemId,ItemName,QtyFrom,QtyTo,LotNo,MRP,Rate,Disc,DiscountAmount,FinalRate,LotSerialId",
  gstClassificationMap:
    "++Id,ItemId,HsnId,ApplicableDate,CreatedBy,CreatedOn,EditLog",
  gstClassificationMaster:
    "++Id,HsnName,HsnCode,UsedFor,GstCalculation,TaxableType,ApplicableDate",
  igstMaster: "++Id,ExciseClassificationId,ApplicableDate,Rate",
  cgstMaster: "++Id,ExciseClassificationId,CessRate,CgstRate,StateId",
  sgstMaster: "++Id,ExciseClassificationId,CessRate,SgstRate,StateId",
  stockLotMaster:
    "++Id,SerialId,TransactionId,TransactionType,TransactionDate,TransactionNo,ItemId,QtyIn,QtyOut,LotNo,BatchNo,MfgDate,ExpDate,Mrp,IsAltRate,AltQtyOut,AltQtyIn",
  salesInvoice:
    "++id,Id,new,update,invoiceno,invoicedate,partyid,grossamount,discountamount,taxamount,netamount,receiveamount,branchid,counterid,createdby,createdon,editlog,ishold,iscancelled,alterid,authorizedby,authorizedon,cancelledby,cancelledon,salepersonid,voucherid,seriesid,seriesvouchertype,isauthorized,remarks,discountpermanual,discountamountmanual,finalamount,noofbillprint,billtime,roundoff,totalbillqty,invoicetype,cash_amount,cn_amount,dc_amount,cc_amount,advance_amount,coupon_amount,other_amount,mrp_value,cashtrade,balamt,tallyvoucherid,tallysyncdate,tallyreferenceno,issendtotally,totaligst,totalcgst,totalsgst,billingcountryid,billingstateid,billingaddress,billinggstinno,shippingcountryid,shippingstateid,shippingaddress,shippinggstinno,mobilenumber,influencerid,billingtype,[new+ishold],[update+ishold]",
  saleInvoiceDetail:
  "++id,invoiceid,InvoiceDetailId,itemid,quantity,soldBatchSerials,mrp,UnitId,UnitName,stock,storeid,saleprice,grossamount,finaldiscount,taxper,totaltaxamount,finalperrate,totalnetamount,lotno,createdby,createdon,editlog,isvatitem,addtaxrate,addtaxamount,surchargerate,surchargeamount,taxamount,istaxinclusive,altqty,salepersonid,changeindiscount,autodiscountper,autodiscountamount,manualdiscountper,manualdiscountamount,istaxcalculatebeforediscount,lotserialid,itemremark,discount_slab_detail_id,isautodiscountonper,isautodiscountonamount,isaltrate,conversion,denominator,isschemeitem,hsnclassificationid,igstrate,cgstrate,sgstrate,igstamount,cgstamount,sgstamount,manualchangesaleprice,sodetailid,schemecode",
  IndentMaster:
    "++id,Id, IndentNo,IndentDate,PartyId,PartyName,CreatedBy,CreatedOn,EditLog,Remarks,SeriesId,SeriesVoucherType,BranchId,new,update",
  IndentDetail:
    "++id,IndentId, IndentNo, ItemId, Quantity, ItemRemarks, Priority",
  purchaseOrder:
    "++id,Id,PoNumber, PoDate ,PartyId ,PartyName ,CreatedBy ,CreatedByName ,CreatedOn, EditLog ,IsClosed, Remarks ,OrderedBy, SeriesId, SeriesNo, SeriesCode, SeriesVoucherType ,TotalIGST, TotalCGST ,TotalSGST,new,update",
  purchaseIndentDetail:
    "++Id, PoDetailId, PoId ,IndentId, IndentDetailId, ItemId ,BaseQty",
  purchaseDetail:
    "++id, PoId ,ItemId,IndentId,IndentDetailId ,Rate, Discount ,BaseQty ,AltQty ,GrossTotal ,DiscountAmount, NetTotal, IsAltRate ,Remark, HsnId, IGSTRate ,CGSTRate ,SGSTRate, IGSTAmount, CGSTAmount, SGSTAmount",

  salesReturn:
    "++id,Id,InvoiceId, Invoiceno, InvoiceDate,salepersonId,PartyId, GrossAmount, DiscountAmount, RTaxAmount, NetAmount, ReceiveAmount, BranchId, CopunterId, CreatedBy, CreatedOn, EditLog, SeriesId, SeriesVoucherType, IsAuthorized, Remarks, InvoiceType, BillTime, TotalBillQty,Stype,new,update,totalCgst,totalIgst,totalSgst,RounOff,DiscountPer,DiscountPerAmount,AgainstInvoiceId,AgainstInvoiceNo",
  SaleReturnDetail:
    "++Id,SaleReturnId,InvoiceId,ItemId, Quantity, MRP, SalePrice, GrossAmount, FinalDiscount, TaxPercentage,TaxPercentageAmt,AdditionalTax,AdditionalTaxAmt,TotalNetAmount,TotalTaxAmount,surchargerate,surchargeamount,AltQuantity, AutoDiscount, AutoDiscountAmount, ManualDiscount, ManualDiscountAmount, ItemRemark, AgainstInvoiceDetailid, AgainstInvoiceId, Hsnid, IgstRate, CgstRate, SgstRate, IgstAmount, CgstAmount, SgstAmount",

  CreditNoteMaster:
    "++Id,InvoiceDate,PartyName,InvoiceNo,PartyId,GrossAmount,Remarks,SeriesId,ShippingGstNo,Remark,SeriesVoucherType,CreatedById,CreatedBy,CreatedOn,EditLog,ReferenceType,ReferenceId,DncnAgaintPi,ShippingAddress,ShippingStateId,ShippingCountryId,BillingAddress,BillingGstNo,BillingStateId,BillingCountryId,NetAmount,TaxAmount,DiscountAmount,InvoiceType,ItemDetail,SalesInvoiceNo,new,update",
  DebitNoteMaster:
    "++Id,InvoiceDate,PartyName,InvoiceNo,PartyId,GrossAmount,Remarks,SeriesId,ShippingGstNo,Remark,SeriesVoucherType,CreatedById,CreatedBy,CreatedOn,EditLog,ReferenceType,ReferenceId,DncnAgaintPi,ShippingAddress,ShippingStateId,ShippingCountryId,BillingAddress,BillingGstNo,BillingStateId,BillingCountryId,NetAmount,TaxAmount,DiscountAmount,InvoiceType,ItemDetail,SalesInvoiceNo",
  PR_Master:
    "++id,Id,Prid,PurchaseReturnNo,InwardNo,GITNo,PurchaseReturnDate,vendorid,IsAuthorized,IsCancelled,DiscountAmount,GrossAmount,DiscountedAmount,NetAmount,AuthorizedBy,AuthorizedOn,HeadauthorizedBy,HeadauthorizedOn,CancelledBy,CancelledOn,Remarks,CreatedBy,CreatedOn,SeriesId,SeriesVoucherType,BranchId,PrType,Manual,new,update",
  PR_Detail:
    "++id,Id,PrDetailId,Prid,ItemId,ReturnBaseQty,ReturnAltQty,Rate,InwardDetailId,MRP",
  purchaseReturn:
    "++Id,documentno ,documentdate,vendorname,vendorcode,inwardno,gitno ,erpinvoice",
  AdjustmentMaster:
    "++id,Id,AdjusmentId,AdjusmentNo,AdjusmentDate,IsAuthorized,AuthorizedBy,AuthorizedOn,IsCancelled,CancelledBy,CancelledOn,CreatedBy,CreatedOn,BranchId,CounterId,SeriesId,SeriesVoucherType,EditLog,Remarks,new,update",
  AdjustmentDetail:
    "++id,Id,StockAdjusmentDetailId,stockadjustmentid,ItemId,MRP,QuantityIn,QuantityOut,LotNo",
  SaleOrder:
    "++id,Id ,SoNo, SoDate,PartyId,GrandTotal,CreatedBy,CreatedByName,CreatedOn,Remarks,SoDetail,alteredon",
  // saleDetail:
  //   "++id,Id,SoDetailId,SoId,ItemId,ItemName,ItemCode,Quantity,Rate,Amount,DiscountPer,ReferenceNo,ReferenceDate",
  stockMaster: "++Id, transactionNo,transactionDate,remarks",
  stockMasterDetails:
    "++Id,SmId,itemname,itemcode,baseunit,altunit,mrp,quantityadd,quantityMinus",
  salesPersonMaster:
    "++id,Id,SalePersonName,SalePersonCode,Commission,CommissionValue,Target,VendorId,DesginationId,ParentId,EmailId,ContactNo,CreatedBy,CreatedByName,TargetDetail,EditLog,CreatedOn,alteredon,new,update",
  employeeMaster:
    "++id,Id,EmployeeName,EmployeeCode,Dob,Doj,Department,DepartmentName,Gender,MaritalStatus,PresentAddress,PresentContactNo,ReportingTo,Designationid,PresentPincode,Email,PanNo,IdCardNo,PermanentAddress,PermanentPincode,IsActive,EditLog,CreatedBy,CreatedByName,reportingper,CreatedOn,contactNo,alteredon,new,update",
  reasonMaster:
    "++id,Id,ReasonName,CounterId,ReasonTypeId,ReasonTypeName,EditLog,CreatedBy,CreatedOn,alteredon",
  reasonTypeMaster: "++id,Id,ReasonTypeName,alteredon",
  designationMaster:
    "++id,Id,DesignationCode,DesignationName,alteredon,new,update",
  GITMaster:
    "++id,Id,gitid,partyid_ho,partyid_pos,partyname,invoiceno_ho,invoicedate_ho,invoiceid_ho,grandtotal,git_no,git_date,alterid,editlog,authorizedby,authorizedon,headauthorizedby,headauthorizedon,cancelledby,tally_log,tallyreferenceno,tallysyncdate,remarks,createdby,createdon,reference_no,reference_date,isautoentry,invoiceno_erp,invoicedate_erp,gitdetail,alteredon",
  IC_Master:
    "++id,Id,InwardId,InwardNo,GIT,billBaseQty,billAltQty,recBaseQty,recAltQty,InwardDate,PartyId,IsAuthorized,DiscountAmount,GrossAmount,DiscountedAmount,NetAmount,EditLog,AuthorizedBy,AuthorizedOn,HeadAuthorizedBy,HeadAuthorizedOn,IsCancelled,Remarks,CreatedBy,CreatedOn,seriesid,voucherid,new,update",
  IC_Detail:
    "++id,Id,InwardDetailId,InwardId,InwardNo,ItemId,BilledBaseQty,BilledAltQty,ReceiveBaseQty,ReceiveAltQty,UnitId,Rate,GrossAmount,DiscountPercentage,DiscountAmount,DiscountedAmount,MRP,GitDetailId,shortQty,excessqty,NetAmount",
  PurchaseInvoice:
    "++id,Id,InvoiceNo,InvoiceDate,PartyId,invoicetype,[InvoiceNo+invoicetype],grossamount,discountamount,taxamount,netamount,seriesid,seriesvouchertype,billingcountryid,billingstateid,billingaddress,billinggstinno,shippingcountryid,shippingstateid,shippingaddress,shippinggstinno,remark,dncn_against_pi,referencetype,referenceid,CreatedBy,CreatedOn,EditLog,Remarks,new,update,roundOff,totalAmount,igstAmount,cgstAmount",
  PurchaseInvoiceDetail:
    "++id,Id,InvoiceId,ItemId,BatchId,isaltrate,Quantity,altqty,Godown,GodownId,MRP,Rate,Amount,DiscountPer,DiscountAmount,ReferenceNo,ReferenceDate,hsnclassificationid,igstrate,cgstrate,sgstrate,igstamount,cgstamount,sgstamount,icdetailid,referencedetailid,InvoiceDetailId",
  counterMaster:
    "++id,Id,CounterName,CounterCode,Remarks,MachineId,CreatedBy,CreatedByName,EditLog,CreatedOn,alteredon,new,update",
  currencyMaster:
    "++id,Id,CurrencySymbol,FormalName,DigitAfterDecimal,SymbolForDecimalPortion,DecimalSymbol,GroupingSymbol,CounterId,EditLog,CreatedBy,CreatedOn,alteredon,new,update",
  voucherMaster:
    "++Id,voucherName,AppliedOn,tallyVoucherName,shortName,EnableBatch,SetAsDefault,isImeiApplicable,enableDataBackEntry,itemLevelRoundingOff",
  currencyMasterDetails: "++Id,CurrencyMasterId,Date,Rate",
  geographicalMaster: "++Id,CountryName,CountryCode",
  advanceAdjustment:
    "++id,Id,advanceadjustmentno,advanceadjustmentdate,partyid,advanceadjustmentamount,advanceadjustmentrefundamount,remarks,seriesid,seriesvouchertype,branchid,counterid,createdby,createdon,editlog,amountadjusted,new,update",
  creditNoteRefund:
    "++id,Id,creditnoteno,creditnotedate,partyid,creditnoteamount,creditnoterefundamount,remarks,seriesid,seriesvouchertype,branchid,counterid,createdby,createdon,editlog,amountadjusted,referencetype,referenceid,alterid,new,update",
  CreditNoteMasterDetail:
    "++id,Id,Amount,DiscountAmount,DiscountPer,InvoiceDetailId,InvoiceId,ItemCode,ItemId,ItemName,Quantity,Rate,ReferenceDate,ReferenceNo,altqty,cgstamount,cgstrate,hsnclassificationid,icdetailid,igstamount,igstrate,isaltrate,referencedetailid,sgstamount,sgstrate",
  DebitNoteMasterDetail:
    "++id,Id,Amount,DiscountAmount,DiscountPer,InvoiceDetailId,InvoiceId,ItemCode,ItemId,ItemName,Quantity,Rate,ReferenceDate,ReferenceNo,altqty,cgstamount,cgstrate,hsnclassificationid,icdetailid,igstamount,igstrate,isaltrate,referencedetailid,sgstamount,sgstrate",
  mastertables: "++id,tablename,alteredon,recordcount,pageindexno,hitcount",
  seriesMaster:
    "++id,Id,SeriesName,RestartSeries,DigitPadding,BranchId,IsActive,InactiveDate,CreatedBy,CreatedByName,CreatedOn,EditLog,alteredon",
  seriesMasterDetail:
    "++id,CusSeriesId,SeriesId,FieldId,FieldName,FieldValue,Seperator,Sno,alteredon",
  seriesfieldMaster: "++id,Id,FieldId,FieldName,FieldValue,alteredon",
  seriesApply:
    "++id,Id,SeriesId,VoucherId,VoucherName,ItemId,ApplicableFrom,BranchId,CreatedBy,CreatedByName,CreatedOn,EditLog,alteredon,new,update",
  VoucherFormMaster:
    "++id,Id,formid,formname,caption,formtype,mnunew,mnuedit,mnuauthorize,mnuview,mnuprint,mnuamendment,mnusendtotally,mnuexporttoexcel,extravalue,formval,isauthorizationreq,mnuclosepending,visible,mnucanceltransaction,formgroupid,allowbackdateentry,isheadauthorizationreq,mnuattachment,mnuviewattachment,bamount_auth_enable,formpath,backdateenddate,saveandprint,saveandauthorize,roundoffitemlevelamt,mnucreatestructure,mnuimport,tb_name,is_from_dll,alteredon",
  VoucherList:
    "++id,Id,VoucherName,ApplyOnFormId,IsDefault,ShortName,IsActive,CreatedBy,CreatedByName,EditLog,CreatedOn,alteredon,new,update",
  formMaster:
    "++id,Id,formid,formname,caption,formtype,mnunew,mnuedit,mnuauthorize,mnuview,mnuprint,mnuamendment,mnusendtotally,mnuexporttoexcel,extravalue,formval,isauthorizationreq,mnuclosepending,visible,mnucanceltransaction,formgroupid,allowbackdateentry,isheadauthorizationreq,mnuattachment,mnuviewattachment,bamount_auth_enable,formpath,backdateenddate,saveandprint,saveandauthorize,roundoffitemlevelamt,mnucreatestructure,mnuimport,tb_name,is_from_dll,alteredon",
  formgroupmaster: "++id,formgroupid,formgroupname,alteredon",
  formmenumaster:
    "++id,menuid,menuname,haschild,formid,parentid,seqno,alteredon",
  RoleMaster:
    "++id,Id,RoleName,Description,CreatedBy,CreatedByName,CreatedOn,IsActive,EditLog,alteredon,Detail,new,update",
  RoleDetailMaster:
    "++id,RoleDetailId,RoleId,FormId,AllowNew,AllowEdit,AllowAuthorize,AllowView,AllowPrint,AllowAmendmend,AllowExportToExcel,AllowSendToTally,AllowCancelTransaction,AllowAttachment,AllowViewAttachment,AllowCreateStructure,AllowImport,ModuleName,FormName,FormTypeName",
  userMaster:
    "++id,Id,UserName,Password,EmployeeId,EmployeeName,Description,IsActive,IsAuthorized,AuthorizedBy,CreateddBy,Email,EditLog,CreatedOn,AuthorizedOn,alteredon,Branch,new,update",
  UserMenuMaster:
    "++id,menuid,formid,menuname,formname,formtype,haschild,parentid,seqno,formval,bshow,userId",
  salesInvoiceWithSO:
    "++id,Id,new,update,invoiceno,invoicedate,partyid,grossamount,discountamount,taxamount,netamount,receiveamount,branchid,counterid,createdby,createdon,editlog,ishold,iscancelled,alterid,authorizedby,authorizedon,cancelledby,cancelledon,salepersonid,voucherid,seriesid,seriesvouchertype,isauthorized,remarks,discountpermanual,discountamountmanual,finalamount,noofbillprint,billtime,roundoff,totalbillqty,invoicetype,cash_amount,cn_amount,dc_amount,cc_amount,advance_amount,coupon_amount,other_amount,mrp_value,cashtrade,balamt,tallyvoucherid,tallysyncdate,tallyreferenceno,issendtotally,totaligst,totalcgst,totalsgst,billingcountryid,billingstateid,billingaddress,billinggstinno,shippingcountryid,shippingstateid,shippingaddress,shippinggstinno,mobilenumber,influencerid,billingtype,[new+ishold],[update+ishold]",
  saleInvoiceDetailWithSO:
    "++id,invoiceid,InvoiceDetailId,itemid,quantity,mrp,saleprice,grossamount,finaldiscount,taxper,totaltaxamount,finalperrate,totalnetamount,lotno,createdby,createdon,editlog,isvatitem,addtaxrate,addtaxamount,surchargerate,surchargeamount,taxamount,istaxinclusive,altqty,salepersonid,changeindiscount,autodiscountper,autodiscountamount,manualdiscountper,manualdiscountamount,istaxcalculatebeforediscount,lotserialid,itemremark,discount_slab_detail_id,isautodiscountonper,isautodiscountonamount,isaltrate,conversion,denominator,isschemeitem,hsnclassificationid,igstrate,cgstrate,sgstrate,igstamount,cgstamount,sgstamount,manualchangesaleprice,SoDetailId,schemecode,SoNo,SoId",
  itemTaxStructure:
    "++id,detailid,taxstructurecode,taxstructurename,itemid,itemcode,ledgerid,ledgercode,effectivefrom,isvatitem,taxper,addtaxper,surcharge,istaxinclusive,itemid_ho,isexempted,istaxcalculatebeforediscount,ho_itemtaxmasterid,itemtaxmasterid,alteredon",
  getItemStock:
    "++id,itemid,storeid,lotno,batchno,mfgdate,expdate,mrp,inqty,qtyout,balance,[itemid+storeid]",
  itemStockIndexdb:
    "++id,stockDate,transactionTypeId,transactionType,transactionId,ItemId,storeid,qtyIn,qtyOut,mrp,IsSyncServer,[ItemId+storeid]",
  itemSalePrice:
    "++id,item_standard_id,itemid,rdpprice,effective_from,alteredon",
  dealerCategory: "++id,dealercategoryid,dealercategorycode,isactive,alteredon",
  loginbrowserId: "++id,Id",
  seriesCount: "++id,formcaption,formid,seriesid,totalrecord",
  billingType:
    "++id,settingid,settingname,settingvalueid,valuename,isactive,alteredon",
  Influencer:
    "++id,influencerid,influencerdmscode,influencercode,influencername,statename,alteredon",
  GodownMaster:
  "++id,storeid,Storename,Storecode,Branchid,isdefault,inactive,Storetype,Description,isauthorized,authorizedby,authorizedon,CreatedBy,EditLog,headauthorizedon,headauthorizedby,inactivedate,createdon,updatedby,updatedon",
  BatchMaster:
  "++id,batchid,batchno,batchdate,lotno,branchid,itemid,manufacturingdate,expirydate,seriesid,seriesno,seriescode,editlog,iscancelled,createdon,alteredon",
  BatchDetail:
  "++id,batchdetailid,batchid,stockid,entrytype,entryid,entrydetailid,itemid,storeid,mrp,inqty,outqty,inaltqty,outaltqty,createdon",
  SerialMaster:
  "++id,serialid,serialno,uniqueserialno,manualbatchno,itemid,branchid,warrentydate,expirydate,serialcreatedfrom,seriesid,seriesno,seriescode,editlog,iscancelled,isstock,createdon,alteredon",
  SerialDetail:
  "++id,serialdetailid,serialid,batchdetailid,batchid,stockid,entrytype,entryid,entrydetailid,itemid,storeid,isconsumed,createdon",
  UserPreferedLanguageDictionary: "++id",
  ProfileMaster:
    "++id,principalCode,headOfficeCode,locationCode,syncMode.headOfficeName,isActive,address,pinCode,email,contact1,contact2,allowItemCreation,allowItemAlternation,allowLedgerCreation,allowLedgerAlternation",
  CompanySettings:
    "++id,companyName,companyShortName,address,city,state,country,pinCode,contact1,contact2,faxNo,currency,registerDate,registerNo,webUrl,licenceNo,email,tallyIP&port,tallyCompanyName,companylogo"
};

export default schema;
