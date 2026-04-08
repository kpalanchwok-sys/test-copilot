// // Responsible for: building XML, posting to eCOMM API, parsing response
// const axios = require("axios");
// const { v4: uuidv4 } = require("uuid");
// const xml2js = require("xml2js");
// const qs = require("qs");
// const config = require("../config/ecomm.config");

// /**
//  * Build an XML string from a flat key-value object.
//  * e.g. { R1: 'C', R2: '4111...' } => <R><R1>C</R1><R2>4111...</R2></R>
//  */
// function buildXML(fields) {
//   const tags = Object.entries(fields)
//     .map(([key, val]) => `<${key}>${val}</${key}>`)
//     .join("");
//   return `<R>${tags}</R>`;
// }

// /**
//  * Post a request to the eCOMM365 API.
//  * @param {string} apiSignature - e.g. 'register', 'refund', 'registerpayment', 'confirm3ds'
//  * @param {object} fields       - XML field key-value pairs
//  * @returns {object}            - Parsed XML response as JS object
//  */
// export async function ecommRequest(apiSignature, fields) {
//   const xmlData = buildXML(fields);

//   const params = {
//     Username: config.username,
//     Password: config.password,
//     MessageID: uuidv4(),
//     APISignature: apiSignature,
//     Data: xmlData,
//   };

//   const response = await axios.post(config.apiUrl, qs.stringify(params), {
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     timeout: 15000,
//   });

//   const parsed = await xml2js.parseStringPromise(response.data, {
//     explicitArray: false,
//   });

//   return parsed?.R || parsed;
// }

// module.exports = { ecommRequest };
