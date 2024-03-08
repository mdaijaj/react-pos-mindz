// import axios from "axios";
// import db from "../../db";
// import { api_s } from "./store";

// // To sync data to indexDB
// const sync_data = async() => {

//     for (let x in api_s) {
//         let data = await db[x].toArray()

//         if (data.length === 0) continue

//         let keys = data.map(val => val.Id)
//         db[x].bulkDelete(keys)
//     }

//     const token = localStorage.getItem('token')
//     const config = { headers: { token } }

//     for (let x in api_s) {
//         let api = api_s[x]

//         axios.get(api, config)
//         .then(res => {
//             let data
//             if (x === "UnitMaster") data = res.data.Result
//             else data = res.data.result.Result
//             // console.log('data from sync data', data) //Dev
//             db[x].bulkAdd(data).catch(e=>console.log('err',e))
//         })
//         .catch(e => {
//             console.log(`error on requesting api(s) ${api_s[x]} `, e.response) //Dev
//         })
//     }
// }

// export default sync_data