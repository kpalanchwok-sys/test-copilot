// controllers/webhook.controller.js
// Responsible for: receiving eCOMM server-to-server notifications

/**
 * POST /api/webhook/notification
 *
 * eCOMM posts transaction results here asynchronously.
 * You should validate, then update your DB / trigger emails / etc.
 *
 * Common R1 codes eCOMM sends:
 *   0044 = Approved
 *   0054 = Refund Successful
 *   0023 = Refund Received
 *   Others = Decline/Error — check R2 for message
 */
// async function handleNotification(req: Request, res: Response) {
//   try {
//     const payload = req.body;

//     console.log("[Webhook] eCOMM notification received:", payload);

//     const responseCode = payload.R1;
//     const transactionId = payload.R9; // Transaction ID from eCOMM
//     const amount = payload.R5;
//     const currency = payload.R6;
//     const message = payload.R2;

//     switch (responseCode) {
//       case "0044":
//         console.log(
//           `[Webhook] ✅ Payment approved — TxID: ${transactionId}, Amount: ${amount} ${currency}`,
//         );
//         // TODO: Mark order as paid in your DB
//         break;

//       case "0054":
//       case "0023":
//         console.log(
//           `[Webhook] 💸 Refund processed — TxID: ${transactionId}, Amount: ${amount} ${currency}`,
//         );
//         // TODO: Update refund status in your DB
//         break;

//       default:
//         console.warn(
//           `[Webhook] ⚠️ Unknown/decline response — Code: ${responseCode}, Message: ${message}`,
//         );
//         // TODO: Handle declined/failed transactions
//         break;
//     }

//     // eCOMM expects a 200 OK to confirm receipt
//     return res.sendStatus(200);
//   } catch (err) {
//     console.error("[Webhook] Error processing notification:", err.message);
//     return res.sendStatus(500);
//   }
// }

// module.exports = { handleNotification };
