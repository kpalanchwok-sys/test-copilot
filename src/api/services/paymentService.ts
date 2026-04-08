// // Responsible for: payment business logic, interpreting eCOMM response codes

// import { ecommRequest } from "./ecommService";

// // ─── Response Code Meanings ────────────────────────────────────────────────
// // 0044 = Transaction Approved
// // 0000 = 3DS Required (for sale) OR Hosted Page registered (for hosted payment)
// // 0054 = Refund Successful (notification method: Both/Server)
// // 0023 = Refund Received  (notification method: Notification)

// interface SaleRequest {
//   cardNumber: string;
//   expiryMonth: string;
//   expiryYear: string;
//   cvv: string;
//   amount: number;
//   currency: string;
//   customerIp: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// /**
//  * Process a direct card sale.
//  */
// export async function processSale({
//   cardNumber,
//   expiryMonth,
//   expiryYear,
//   cvv,
//   amount,
//   currency,
//   customerIp,
//   firstName,
//   lastName,
//   email,
// }: SaleRequest) {
//   const result = await ecommRequest("register", {
//     R1: "C", // C = Sale, CA = Pre-Auth
//     R2: cardNumber,
//     R3: expiryMonth, // MM
//     R4: expiryYear, // YY
//     R5: cvv,
//     R6: amount, // In minor units, e.g. 1000 = €10.00
//     R7: currency, // e.g. "EUR"
//     R8: firstName,
//     R9: lastName,
//     R10: email,
//     R37: customerIp, // IPv4 format
//   });

//   if (result.R1 === "0044") {
//     return { success: true, message: "Transaction approved", data: result };
//   }

//   if (result.R1 === "0000") {
//     return {
//       success: false,
//       requires3DS: true,
//       acsUrl: result.R3, // Redirect customer here for 3DS
//       pareq: result.R4,
//       md: result.R5,
//       data: result,
//     };
//   }

//   return {
//     success: false,
//     error: result.R2 || "Transaction declined",
//     code: result.R1,
//   };
// }

// /**
//  * Confirm a 3DS challenge after the customer returns from ACS.
//  */
// // export async function confirm3DS({ pares, md }) {
// //   const result = await ecommRequest("confirm3ds", {
// //     R1: pares,
// //     R2: md,
// //   });

// //   if (result.R1 === "0044") {
// //     return {
// //       success: true,
// //       message: "3DS confirmed, payment complete",
// //       data: result,
// //     };
// //   }

// //   return {
// //     success: false,
// //     error: result.R2 || "3DS confirmation failed",
// //     code: result.R1,
// //   };
// // }

// /**
//  * Register a hosted payment page and return the redirect URL.
//  */
// // export async function registerHostedPayment({
// //   amount,
// //   currency,
// //   customerName,
// //   email,
// //   successUrl,
// //   failUrl,
// // }) {
// //   const result = await ecommRequest("registerpayment", {
// //     R1: amount,
// //     R2: currency,
// //     R3: customerName,
// //     R4: email,
// //     R5: successUrl,
// //     R6: failUrl,
// //   });

// //   if (result.R1 === "0000") {
// //     return { success: true, paymentUrl: result.R3, data: result };
// //   }

// //   return {
// //     success: false,
// //     error: result.R2 || "Failed to register payment",
// //     code: result.R1,
// //   };
// // }

// /**
//  * Refund a previous transaction.
//  */
// // export async function processRefund({ transactionId, amount }) {
// //   const result = await ecommRequest("refund", {
// //     R1: transactionId,
// //     R2: amount,
// //   });

// //   if (["0054", "0023"].includes(result.R1)) {
// //     return {
// //       success: true,
// //       message: "Refund processed successfully",
// //       data: result,
// //     };
// //   }

// //   return {
// //     success: false,
// //     error: result.R2 || "Refund failed",
// //     code: result.R1,
// //   };
// // }

// /**
//  * Void / cancel a transaction (before settlement).
//  */
// // export async function voidTransaction({ transactionId  }) {
// //   const result = await ecommRequest("void", {
// //     R1: transactionId,
// //   });

// //   if (result.R1 === "0044") {
// //     return { success: true, message: "Transaction voided", data: result };
// //   }

// //   return { success: false, error: result.R2 || "Void failed", code: result.R1 };
// // }

// module.exports = {
//   processSale,
//   // confirm3DS,
//   // registerHostedPayment,
//   // processRefund,
//   // voidTransaction,
// };
