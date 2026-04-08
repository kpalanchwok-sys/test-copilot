// import { Request, Response } from "express";
// import * as paymentService from "../services/paymentService";

// // Responsible for: parsing request, calling service, returning HTTP response

// /**
//  * POST /api/payments/sale
//  * Body: { cardNumber, expiryMonth, expiryYear, cvv, amount, currency, customerIp, firstName, lastName, email }
//  */
// export async function sale(req: Request, res: Response) {
//   try {
//     const {
//       cardNumber,
//       expiryMonth,
//       expiryYear,
//       cvv,
//       amount,
//       currency,
//       customerIp,
//       firstName,
//       lastName,
//       email,
//     } = req.body;

//     if (
//       !cardNumber ||
//       !expiryMonth ||
//       !expiryYear ||
//       !cvv ||
//       !amount ||
//       !currency
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Missing required payment fields" });
//     }

//     const result = await paymentService.processSale({
//       cardNumber,
//       expiryMonth,
//       expiryYear,
//       cvv,
//       amount,
//       currency,
//       customerIp,
//       firstName,
//       lastName,
//       email,
//     });

//     const status = result.success ? 200 : result.requires3DS ? 200 : 400;
//     return res.status(status).json(result);
//   } catch (err) {
//     // console.error("[PaymentController] sale error:", err.message);
//     return res
//       .status(500)
//       .json({ success: false, error: "Payment processing failed" });
//   }
// }

// /**
//  * POST /api/payments/3ds-confirm
//  * Body: { pares, md }
//  */
// // export async function confirm3DS(req: Request, res: Response) {
// //   try {
// //     const { pares, md } = req.body;

// //     if (!pares || !md) {
// //       return res
// //         .status(400)
// //         .json({ success: false, error: "pares and md are required" });
// //     }

// //     const result = await paymentService.confirm3DS({ pares, md });
// //     return res.status(result.success ? 200 : 400).json(result);
// //   } catch (err) {
// //     // console.error("[PaymentController] 3DS confirm error:", err.message);
// //     return res
// //       .status(500)
// //       .json({ success: false, error: "3DS confirmation failed" });
// //   }
// // }

// /**
//  * POST /api/payments/hosted
//  * Body: { amount, currency, customerName, email, successUrl, failUrl }
//  */
// // export async function hostedPayment(req: Request, res: Response) {
// //   try {
// //     const { amount, currency, customerName, email, successUrl, failUrl } =
// //       req.body;

// //     if (!amount || !currency || !successUrl || !failUrl) {
// //       return res
// //         .status(400)
// //         .json({ success: false, error: "Missing required fields" });
// //     }

// //     const result = await paymentService.registerHostedPayment({
// //       amount,
// //       currency,
// //       customerName,
// //       email,
// //       successUrl,
// //       failUrl,
// //     });

// //     return res.status(result.success ? 200 : 400).json(result);
// //   } catch (err) {
// //     // console.error("[PaymentController] hosted payment error:", err.message);
// //     return res
// //       .status(500)
// //       .json({ success: false, error: "Hosted payment registration failed" });
// //   }
// // }

// /**
//  * POST /api/payments/refund
//  * Body: { transactionId, amount }
//  */
// // export async function refund(req: Request, res: Response) {
// //   try {
// //     const { transactionId, amount } = req.body;

// //     if (!transactionId || !amount) {
// //       return res.status(400).json({
// //         success: false,
// //         error: "transactionId and amount are required",
// //       });
// //     }

// //     const result = await paymentService.processRefund({
// //       transactionId,
// //       amount,
// //     });
// //     return res.status(result.success ? 200 : 400).json(result);
// //   } catch (err) {
// //     // console.error("[PaymentController] refund error:", err.message);
// //     return res.status(500).json({ success: false, error: "Refund failed" });
// //   }
// // }

// /**
//  * POST /api/payments/void
//  * Body: { transactionId }
//  */
// // export async function voidTransaction(req: Request, res: Response) {
// //   try {
// //     const { transactionId } = req.body;

// //     if (!transactionId) {
// //       return res
// //         .status(400)
// //         .json({ success: false, error: "transactionId is required" });
// //     }

// //     const result = await paymentService.voidTransaction({ transactionId });
// //     return res.status(result.success ? 200 : 400).json(result);
// //   } catch (err) {
// //     // console.error("[PaymentController] void error:", err.message);
// //     return res.status(500).json({ success: false, error: "Void failed" });
// //   }
// // }

// // module.exports = { sale, confirm3DS, hostedPayment, refund, voidTransaction };
// module.exports = { sale };
