// require("dotenv").config();
// const fetch = require("node-fetch");

// export const GET = async (getUrl) => {
//     let requestOptions = {
//         headers: {
//             'token': '/GSSBcWvAXrWGWdQvwdi4M8F50v9bB9iEk22hQuKbuiZtziwWJWtnIyjy/XvDSP5HDMgChOn1tGNFC8QM/Artg==',
//         }
//       };
//   const data = await fetch(getUrl,requestOptions)
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   return data;
// };

// export const POST = async (posturl, data) => {
//   const Data = JSON.stringify(data);
//   const ResponseData = await fetch(posturl, {
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: Data,
//   })
//     .then((response) => response.json())
//     .catch((error) => console.log(error));
//   return ResponseData;
// };
// export const POSTFILE = async (posturl, data) => {
//    const ResponseData = await fetch(posturl, {
//      method: 'POST',
//      body: data,
//    })
//      .then(response => response.json())
//      .catch(error => console.log(error));
//    return ResponseData;
//  };


