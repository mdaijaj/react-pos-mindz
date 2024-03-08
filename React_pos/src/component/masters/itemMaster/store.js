const ItemMaster_obj = {
  ItemId: "",
  ItemCode: "",
  ItemName: "",
  PrintName: "",
  NameInTally: "",
  GroupId: "",
  UnitName: "",
  UnitAltName: "",
  Conversion: "",
  Denominator: "",
  IsLot: "",
  IsSerial: "",
  BillingUnit: "",
  EanCode: "",
  WeightInKg: "",
  IsActive: "",
  IsTaxInclusive: "",
  CommodityCode: "",
  ScheduleNo: "",
  SerialNo: "",
  Exciseclassification: "",
  ExciseClassificationCode: "",
  AbatmentNotificationNo: "",
  RateOfExcise: "",
  ExciseEvaluatinMethod: "",
  MinStock: "",
  MaxStock: "",
  ReorderLevel: "",
  CriticalLevel: "",
  EconomicOrderQty: "",
  MfgDate: "",
  ExpDate: "",
  Image: "",
  CreatedBy: "",
  CreatedOn: "",
  EditLog: ""
}

const GSTClassification_obj = {
  ItemId: "",
  HsnId: "",
  ApplicableDate: "",
  CreatedBy: "",
  CreatedOn: "",
  EditLog: ""
}

// Default indexdb state
const indexDB_default_store = {
  ItemMaster : [], 
  UnitMaster : [], 
  AttributeMaster : [], 
  HsnMaster : [], 
  ItemGroup : []
}

export {
  ItemMaster_obj,
  GSTClassification_obj,
  indexDB_default_store
}