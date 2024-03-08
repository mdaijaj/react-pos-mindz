import axios from "axios";
// api/reports/IsPeriodShow/{formId}
// api/reports/GetPeriods/{formId}
// api/reports/getreportfilters/{formId}
// api/reports/getreportfiltersdata/{filterId}/{userId}
// api/reports/getchildfilterrecord
// api/reports/GetDistFilterStatus/{formId}
// api/ledgerMaster/GetDistributorsForReportPage/{userId}/{formId}
// api/reports/getreports
const apiIsPeriodShow = `api/reports/IsPeriodShow/`;
const apiGetPeriod = `api/reports/GetPeriods/`;
const apiGetReportFltr = `api/reports/getreportfilters/`;
const apiGetReportFltrData = `api/reports/getreportfiltersdata/`;
const apiGetReportFltrChildData = `api/reports/getchildfilterrecord/`;
const getDistributor = `api/ledgerMaster/GetDistributorsForReportPage/`;
const getReports = `api/reports/getreports`;


const IsPeriodShow = (id) => {
  const config = { headers: { token: localStorage.getItem("token") } };
  const dataRes = axios.get(apiIsPeriodShow + id, config).then((res) => {
    return res.data;
    //console.log(res, "resddddddddddddddddddddd");
  });
  return dataRes;
};
const getPeriod = (id) => {
  const config = { headers: { token: localStorage.getItem("token") } };
  const datares = axios
    .get(apiGetPeriod + id, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
  return datares;
};
const getClintId = () => {
  const config = { headers: { token: localStorage.getItem("token") } };
  const cId = axios
    .get("api/usermanagement/getclientid", config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err));
  return cId;
};
const getReportFltr = (id) => {
  const config = { headers: { token: localStorage.getItem("token") } };
  const datares = axios.get(apiGetReportFltr + id, config).then((res) => {
    return res;
  });
  return datares;
};
export { IsPeriodShow, getPeriod, getReportFltr, getClintId };
// const getReportdata = (id, obj) => {
//   const config = { headers: { token: localStorage.getItem("token") } };
//   let arr = [];
//   let api = `/api/Report/${id}`;
//   axios
//     .post(api, obj, config)
//     .then((res) => {
//       console.log(res, "ggggggggggggggggggggggggggggggggggggg");
//       arr = res.data.result.Result.Result;
//     })
//     .catch((err) => console.log(err, "getreprtdata error"));
//   return arr;
// };
// export default getReportdata;
