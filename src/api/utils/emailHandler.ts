interface EmailPayload {
  email: string;
  firstName: string;
  subject: string;
  type:
    | "WELCOME"
    | "RESET_PASSWORD"
    | "VERIFY_EMAIL"
    | "REMINDER"
    | "TASK_SHARED";
  url?: string;
  otp?: number;
  taskTitle?: string;
  senderName?: string;
  dueDateAndTime?: Date | string;
  notes?: string;
}

const getEmailTemplate = (payload: EmailPayload): string => {
  switch (payload.type) {
    case "WELCOME":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Lock-Gate 🎉</h1>
          <p>Hi ${payload.firstName},</p>
          <p>Thanks for registering! Use the OTP below to verify your account:</p>

          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            background: #f4f4f4;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
            color: #333;
          ">
            ${payload.otp ?? "------"}
          </div>

          <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          ${payload.url ? `<a href="${payload.url}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Login Now</a>` : ""}
          <p style="margin-top: 20px; color: #999; font-size: 12px;">If you didn't register, ignore this email.</p>
        </div>
      `;

    case "RESET_PASSWORD":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password 🔐</h1>
          <p>Hi ${payload.firstName},</p>
          <p>Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>

          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            background: #fff5f5;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
            color: #e53e3e;
          ">
            ${payload.otp ?? "------"}
          </div>

          ${payload.url ? `<a href="${payload.url}" style="background:#e53e3e;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>` : ""}
          <p style="margin-top: 20px; color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `;

    case "VERIFY_EMAIL":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Verify Your Email ✅</h1>
          <p>Hi ${payload.firstName},</p>
          <p>Use the OTP below to verify your email address:</p>

          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 10px;
            background: #ebf8ff;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
            color: #3182ce;
          ">
            ${payload.otp ?? "------"}
          </div>

          ${payload.url ? `<a href="${payload.url}" style="background:#3182ce;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a>` : ""}
          <p style="margin-top: 20px; color: #999; font-size: 12px;">If you didn't register, ignore this email.</p>
        </div>
      `;

    case "REMINDER":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reminder Notification</h1>
          <p>Hi ${payload.firstName},</p>
          <p>${payload.subject}</p>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">You are receiving this reminder from Lock-Gate.</p>
        </div>
      `;

    case "TASK_SHARED":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">A task has been shared with you</h1>
          <p>Hi ${payload.firstName},</p>
          <p><strong>${payload.senderName ?? "A Lock-Gate user"}</strong> shared a task with you on Lock-Gate.</p>
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Task:</strong> ${payload.taskTitle ?? "Untitled task"}</p>
            ${
              payload.dueDateAndTime
                ? `<p style="margin: 0 0 8px;"><strong>Due:</strong> ${new Date(payload.dueDateAndTime).toLocaleString()}</p>`
                : ""
            }
            ${
              payload.notes
                ? `<p style="margin: 0;"><strong>Notes:</strong> ${payload.notes}</p>`
                : ""
            }
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">You are receiving this because your email was added to a shared task in Lock-Gate.</p>
        </div>
      `;

    default:
      return `<p>Hi ${payload.firstName},</p>`;
  }
};

export const sendDynamicEmail = async (payload: EmailPayload) => {
  const apiKey = process.env.SMTP2GO_API_KEY;
  const fromEmail = process.env.SMTP_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error("SMTP2GO_API_KEY or SMTP_FROM_EMAIL is missing in .env");
  }

  const htmlBody = getEmailTemplate(payload);

  const response = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      sender: `Lock-Gate <${fromEmail}>`,
      to: [`${payload.firstName} <${payload.email}>`],
      subject: payload.subject,
      html_body: htmlBody,
    }),
  });

  const data = await response.json();

  console.log("📧 SMTP2Go response:", JSON.stringify(data, null, 2));

  if (!response.ok || data.data?.error) {
    const errorMsg = data.data?.error || "Failed to send email";
    console.error("❌ SMTP2Go Error:", errorMsg);
    throw new Error(errorMsg);
  }

  return data;
};

