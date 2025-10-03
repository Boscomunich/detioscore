export const passwordResetTemplate = (
  name: string,
  secureLink: string,
  token: string
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ditioscore | Password Reset</title>
</head>
<body style="margin:0; padding:0; font-family:Poppins, Arial, sans-serif; background-color:#f9fafb; color:#333;">
  <table role="presentation" style="width:100%; border-collapse:collapse; margin:0; padding:0;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" style="max-width:520px; width:100%; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:32px 24px; text-align:center;">
              <h1 style="margin:0; font-size:24px; font-weight:800; color:#ff2056;">DITIOSCORE</h1>
              <p style="margin:24px 0 0; font-size:14px; color:#6b7280;">Hi ${name},</p>
              <h2 style="margin:16px 0; font-size:20px; font-weight:600; color:#1E64AA;">Password Reset Request</h2>
              <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#374151;">
                We received a request to reset your password. If this was you, click below to set a new password.
              </p>
              <a href="${secureLink}?token=${token}" 
                style="display:inline-block; padding:12px 20px; font-size:14px; font-weight:600; color:#ffffff; background:#ff2056; border-radius:6px; text-decoration:none; box-shadow:0 2px 4px rgba(0,0,0,0.1); margin-bottom:16px;">
                RESET PASSWORD
              </a>
              <br/>
              <a href="https://ditioscore.com" 
                style="display:inline-block; padding:12px 20px; font-size:14px; font-weight:600; color:#ffffff; background:#1E64AA; border-radius:6px; text-decoration:none; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                EXPLORE THE APP
              </a>
              <p style="margin:24px 0 0; font-size:12px; color:#6b7280;">
                If you didn’t request a password reset, please ignore this email. For your safety, never share your password or personal details with anyone claiming to be part of our staff.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0; font-size:14px; color:#374151;">
          Best regards,<br/>The Ditioscore Team
        </p>
        <p style="margin:8px 0 0; font-size:12px; color:#6b7280;">
          Need help? Contact us at <a href="mailto:help@ditioscore.com" style="color:#1E64AA; text-decoration:none;">help@ditioscore.com</a>
        </p>
        <table role="presentation" style="margin:32px auto 0; text-align:center;">
          <tr>
            <td style="padding:0 8px;">
              <a href="#"><img src="https://www.google.com/s2/favicons?sz=24&domain=facebook.com" alt="Facebook" style="height:20px;"/></a>
            </td>
            <td style="padding:0 8px;">
              <a href="#"><img src="https://www.google.com/s2/favicons?sz=24&domain=instagram.com" alt="Instagram" style="height:20px;"/></a>
            </td>
            <td style="padding:0 8px;">
              <a href="#"><img src="https://www.google.com/s2/favicons?sz=24&domain=x.com" alt="X" style="height:20px;"/></a>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0; font-size:12px; color:#9ca3af;">
          &copy; 2025 <span style="color:#ff2056; font-weight:600;">Ditioscore</span>. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
